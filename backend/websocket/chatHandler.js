import notificationQueue from "../queues/notificationQueue.js";
import connectDB from "../config/db.js";

const rooms = new Map();
export const joinRoom = async (ws, data) => {
  const { roomId, receiverId } = data;
  const senderId = ws.userId;
  if (!roomId) {
    return ws.send(
      JSON.stringify({ type: "error", message: "Room ID is missing" }),
    );
  }
  if (!senderId || !receiverId) {
    return ws.send(
      JSON.stringify({ type: "error", message: "Users Id is missing!" }),
    );
  }
  // if the room is missing create it like ({roomId: Set[user1,user2]})
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  try {
    let db = await connectDB();
    const roomCollection = db.collection("rooms");
    const roomCollExisting = await roomCollection.findOne({
      _id: roomId.toString(),
    });
    if (!roomCollExisting) {
      await roomCollection.insertOne({
        _id: roomId.toString(),
        members: [receiverId, senderId],
        type: "direct",
        createdBy: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      // verify the sender is actually a member of this room
      if (!roomCollExisting.members.includes(senderId.toString())) {
        ws.send(JSON.stringify({ type: "error", message: "Access denied" }));
        return;
      }
      // never overwrite members — the DB is the source of truth
    }
  } catch (err) {
    console.log(err);
    ws.send(JSON.stringify({ type: "error", message: "Error with DB" }));
    return;
  }
  // WebSocket memory room
  rooms.get(roomId).add(ws);
  const messageHistory = await loadMessages(roomId);
  ws.send(JSON.stringify({ type: "message_history", roomId, messageHistory }));
  ws.send(JSON.stringify({ type: "joined_room", roomId }));
};

export const sendMessage = async (ws, data) => {
  const { roomId, receiverId, text } = data;
  const senderId = ws.userId;
  if (!roomId || !senderId || !receiverId || !text) {
    return ws.send(
      JSON.stringify({ type: "error", message: "Missing required fields" }),
    );
  }
  if (!rooms.has(roomId)) {
    return ws.send(
      JSON.stringify({ type: "error", message: "Room does not exist" }),
    );
  }
  try {
    let db = await connectDB();
    const roomsCollection = db.collection("rooms");
    const messagesCollection = db.collection("messages");
    const messageDoc = {
      roomId: roomId.toString(),
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
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
    // Broadcast to all clients currently joined to this room.
    const room = rooms.get(roomId);
    room.forEach((clientSocket) => {
      if (clientSocket.readyState === WebSocket.OPEN) {
        clientSocket.send(
          JSON.stringify({
            type: "sended_message",
            message: {
              _id: insertedMessage.insertedId,
              ...messageDoc,
            },
          }),
        );
      }
    });
    const receiverInRoom = [...room].some((c) => c.userId === receiverId);
    if (!receiverInRoom) {
      notificationQueue.add("new_message", {
        type: "new_message",
        actorId: senderId,
        targetUserId: receiverId,
      })
    }
  } catch (error) {
    console.log(error);
    ws.send(
      JSON.stringify({ type: "error", message: "Failed to send message" }),
    );
    return;
  }
};

export const removeFromRooms = (ws) => {
  for (const [roomId, sockets] of rooms.entries()) {
    sockets.delete(ws);
    if (sockets.size === 0) rooms.delete(roomId);
  }
};

const loadMessages = async (roomId, limitNum = 50) => {
  let db = await connectDB();
  const messagesCollection = db.collection("messages");
  if (!roomId.trim()) {
    console.error("Invalid or missing roomId");
  }
  const roomMessages = await messagesCollection
    .find({ roomId: roomId.toString() })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limitNum)
    .toArray();
  return roomMessages.reverse(); // Initial logic
};

export const loadLastMessages = async (ws) => {
  const userId = ws.userId;
  if (!userId) {
    return ws.send(
      JSON.stringify({ type: "error", message: "userId is not defined" }),
    );
  }
  let db = await connectDB();
  const roomsCollection = db.collection("rooms");

  const roomsData = await roomsCollection
    .find({
      members: userId.toString(),
    })
    .project({ _id: 1, lastMessage: 1, members: 1, updatedAt: 1 })
    .toArray();

  return ws.send(JSON.stringify({ type: "load_last_messages", roomsData }));
};
