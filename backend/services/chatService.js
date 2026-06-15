
export async function createOrUpdateRoom(db, { roomId, senderId, receiverId }) {
  const rooms = db.collection("rooms");
  const existing = await rooms.findOne({ _id: roomId.toString() });

  if (!existing) {
    await rooms.insertOne({
      _id: roomId.toString(),
      members: [receiverId, senderId],
      type: "direct",
      createdBy: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    await rooms.updateOne(
      { _id: roomId.toString() },
      { $set: { members: [receiverId, senderId] } },
    );
  }
}

export async function saveMessage(db, { roomId, senderId, receiverId, text }) {
  const rooms = db.collection("rooms");
  const messages = db.collection("messages");

  const messageDoc = {
    roomId: roomId.toString(),
    senderId: senderId.toString(),
    receiverId: receiverId.toString(),
    text: text.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const inserted = await messages.insertOne(messageDoc);
  await rooms.updateOne(
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

  return { _id: inserted.insertedId, ...messageDoc };
}

export async function loadMessages(db, roomId, limit = 50) {
  const messages = db.collection("messages");
  const results = await messages
    .find({ roomId: roomId.toString() })
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .toArray();
  return results.reverse();
}

export async function loadRoomsForUser(db, userId) {
  const rooms = db.collection("rooms");
  return rooms
    .find({ members: userId.toString() })
    .project({ _id: 1, lastMessage: 1, members: 1, updatedAt: 1 })
    .toArray();
}
