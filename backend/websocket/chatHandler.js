import notificationQueue from "../queues/notificationQueue.js";
import connectDB from "../config/db.js";

const rooms = new Map(); // roomId -> Set<ws> (sockets currently viewing that room)

const sendError = (ws, message) =>
  ws.send(JSON.stringify({ type: "error", message }));

export const joinRoom = async (ws, data) => {
  const { roomId, receiverId } = data;
  const senderId = ws.userId;
  if (!roomId) return sendError(ws, "Room ID is missing");
  if (!senderId) return sendError(ws, "User id is missing");

  if (!rooms.has(roomId)) rooms.set(roomId, new Set());

  try {
    const db = await connectDB();
    const roomCollection = db.collection("rooms");
    let room = await roomCollection.findOne({ _id: roomId.toString() });

    if (!room) {
      // No pre-existing room. Only the direct-chat flow can implicitly create
      // one here (first DM between two mutual followers) — groups must be
      // created via the REST endpoint first, since they need a name/admins.
      if (!receiverId) return sendError(ws, "Room does not exist");

      room = {
        _id: roomId.toString(),
        members: [receiverId.toString(), senderId.toString()],
        type: "direct",
        admins: [],
        name: null,
        avatar: null,
        createdBy: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await roomCollection.insertOne(room);
    } else if (!room.members.includes(senderId.toString())) {
      return sendError(ws, "Access denied");
    }
  } catch (err) {
    console.log(err);
    return sendError(ws, "Error with DB");
  }

  rooms.get(roomId).add(ws);
  const messageHistory = await loadMessages(roomId);
  ws.send(JSON.stringify({ type: "message_history", roomId, messageHistory }));
  ws.send(JSON.stringify({ type: "joined_room", roomId }));
};

export const sendMessage = async (ws, data) => {
  const { roomId, text } = data;
  const senderId = ws.userId;
  if (!roomId || !senderId || !text?.trim()) {
    return sendError(ws, "Missing required fields");
  }
  if (!rooms.has(roomId)) {
    return sendError(ws, "Room does not exist");
  }

  try {
    const db = await connectDB();
    const roomsCollection = db.collection("rooms");
    const messagesCollection = db.collection("messages");

    const room = await roomsCollection.findOne(
      { _id: roomId.toString() },
      { projection: { members: 1 } },
    );
    if (!room || !room.members.includes(senderId.toString())) {
      return sendError(ws, "Access denied");
    }

    const messageDoc = {
      roomId: roomId.toString(),
      senderId: senderId.toString(),
      text: text.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertedMessage = await messagesCollection.insertOne(messageDoc);
    await roomsCollection.updateOne(
      { _id: roomId.toString() },
      {
        $set: {
          lastMessage: {
            text: messageDoc.text,
            senderId: messageDoc.senderId,
            createdAt: new Date(),
          },
          updatedAt: new Date(),
        },
      },
    );

    // Broadcast to every socket currently viewing this room, and track who's
    // actually present so we only queue notifications for absent members —
    // works the same way for a 2-person room or an N-person group.
    const sockets = rooms.get(roomId);
    const presentUserIds = new Set();
    sockets.forEach((clientSocket) => {
      if (clientSocket.readyState === WebSocket.OPEN) {
        presentUserIds.add(clientSocket.userId);
        clientSocket.send(
          JSON.stringify({
            type: "sended_message",
            message: { _id: insertedMessage.insertedId, ...messageDoc },
          }),
        );
      }
    });

    const absentMembers = room.members.filter(
      (memberId) => memberId !== senderId.toString() && !presentUserIds.has(memberId),
    );
    absentMembers.forEach((targetUserId) => {
      notificationQueue.add("new_message", {
        type: "new_message",
        actorId: senderId,
        targetUserId,
      });
    });
  } catch (error) {
    console.log(error);
    return sendError(ws, "Failed to send message");
  }
};

export const removeFromRooms = (ws) => {
  for (const [roomId, sockets] of rooms.entries()) {
    sockets.delete(ws);
    if (sockets.size === 0) rooms.delete(roomId);
  }
};

const loadMessages = async (roomId, limitNum = 50) => {
  const db = await connectDB();
  const messagesCollection = db.collection("messages");
  if (!roomId.trim()) {
    console.error("Invalid or missing roomId");
  }
  const roomMessages = await messagesCollection
    .find({ roomId: roomId.toString() })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limitNum)
    .toArray();
  return roomMessages.reverse();
};

export const loadLastMessages = async (ws) => {
  const userId = ws.userId;
  if (!userId) return sendError(ws, "userId is not defined");

  const db = await connectDB();
  const roomsCollection = db.collection("rooms");

  const roomsData = await roomsCollection
    .find({ members: userId.toString() })
    .project({
      _id: 1,
      type: 1,
      name: 1,
      avatar: 1,
      members: 1,
      admins: 1,
      createdBy: 1,
      lastMessage: 1,
      updatedAt: 1,
    })
    .toArray();

  return ws.send(JSON.stringify({ type: "load_last_messages", roomsData }));
};
