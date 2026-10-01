// Chat persistence: rooms, membership and messages.
// Pure DB logic — no sockets. websocket/chatHandler.js owns the transport
// side (who is connected, broadcasting, notification fan-out) and calls in
// here. Access failures come back as `{ error }` so the handler can relay the
// message to the client; unexpected DB errors still throw.

const ROOM_LIST_PROJECTION = {
  _id: 1,
  type: 1,
  name: 1,
  avatar: 1,
  members: 1,
  admins: 1,
  createdBy: 1,
  lastMessage: 1,
  updatedAt: 1,
};

// Returns the room if `userId` may enter it. A missing room is only created
// implicitly for the direct-chat flow (first DM between two mutual followers,
// signalled by `receiverId`) — groups must be created via the REST endpoint
// first, since they need a name/admins.
export async function getOrCreateRoomForMember(db, { roomId, userId, receiverId }) {
  const rooms = db.collection("rooms");
  const id = roomId.toString();
  const room = await rooms.findOne({ _id: id });

  if (room) {
    return room.members.includes(userId.toString())
      ? { room }
      : { error: "Access denied" };
  }

  if (!receiverId) return { error: "Room does not exist" };

  const newRoom = {
    _id: id,
    members: [receiverId.toString(), userId.toString()],
    type: "direct",
    admins: [],
    name: null,
    avatar: null,
    createdBy: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await rooms.insertOne(newRoom);
  return { room: newRoom };
}

// Persists a message after re-checking membership (a socket can outlive its
// membership), and bumps the room's lastMessage preview. Returns the room's
// members too, so the caller can notify whoever isn't online.
export async function saveMessage(db, { roomId, senderId, text }) {
  const rooms = db.collection("rooms");
  const id = roomId.toString();

  const room = await rooms.findOne({ _id: id }, { projection: { members: 1 } });
  if (!room || !room.members.includes(senderId.toString())) {
    return { error: "Access denied" };
  }

  const messageDoc = {
    roomId: id,
    senderId: senderId.toString(),
    text: text.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const inserted = await db.collection("messages").insertOne(messageDoc);

  await rooms.updateOne(
    { _id: id },
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

  return {
    members: room.members,
    message: { _id: inserted.insertedId, ...messageDoc },
  };
}

// Latest `limit` messages, returned oldest-first for display.
export async function loadMessages(db, roomId, limit = 50) {
  const messages = await db
    .collection("messages")
    .find({ roomId: roomId.toString() })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .toArray();
  return messages.reverse();
}

export async function loadRoomsForUser(db, userId) {
  return db
    .collection("rooms")
    .find({ members: userId.toString() })
    .project(ROOM_LIST_PROJECTION)
    .toArray();
}
