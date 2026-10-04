// Chat persistence: rooms, membership and messages.
// Pure DB logic — no sockets. websocket/chatHandler.js owns the transport
// side (who is connected, broadcasting, notification fan-out) and calls in
// here. Access failures come back as `{ error }` so the handler can relay the
// message to the client; unexpected DB errors still throw.

import { ObjectId } from "mongodb";

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

const serviceError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Blocks are stored as { blockerId, blockedId } string pairs. A block applies
// in both directions for messaging: neither side can send once either blocked.
async function isBlockedEitherWay(db, a, b) {
  const hit = await db.collection("blocks").findOne({
    $or: [
      { blockerId: a, blockedId: b },
      { blockerId: b, blockedId: a },
    ],
  });
  return Boolean(hit);
}

// Persists a message after re-checking membership (a socket can outlive its
// membership), and bumps the room's lastMessage preview. Returns the room's
// members too, so the caller can notify whoever isn't online.
export async function saveMessage(db, { roomId, senderId, text }) {
  const rooms = db.collection("rooms");
  const id = roomId.toString();

  const room = await rooms.findOne(
    { _id: id },
    { projection: { members: 1, type: 1, memberSettings: 1 } },
  );
  if (!room || !room.members.includes(senderId.toString())) {
    return { error: "Access denied" };
  }

  if (room.type === "direct") {
    const other = room.members.find((m) => m !== senderId.toString());
    if (other && (await isBlockedEitherWay(db, senderId.toString(), other))) {
      // Same wording for both directions so a blocked user can't tell who blocked whom.
      return { error: "You can't message this user" };
    }
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

  const mutedMembers = room.members.filter(
    (m) => room.memberSettings?.[m]?.mutedAt,
  );

  return {
    members: room.members,
    mutedMembers,
    message: { _id: inserted.insertedId, ...messageDoc },
  };
}

// Latest `limit` messages, returned oldest-first for display. `after` is the
// viewer's "clear chat" time — older messages stay in the DB (the other member
// still sees them) but are hidden from this viewer.
export async function loadMessages(db, roomId, limit = 50, after = null) {
  const filter = { roomId: roomId.toString() };
  if (after) filter.createdAt = { $gt: new Date(after) };
  const messages = await db
    .collection("messages")
    .find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .toArray();
  return messages.reverse();
}

// Rooms for the sidebar list. memberSettings holds every member's mute/clear
// state, so it's reduced to the caller's own `mySettings` before leaving the
// server, and a preview older than the caller's clear time is hidden.
export async function loadRoomsForUser(db, userId) {
  const uid = userId.toString();
  const rooms = await db
    .collection("rooms")
    .find({ members: uid })
    .project({ ...ROOM_LIST_PROJECTION, memberSettings: 1 })
    .toArray();

  return rooms.map(({ memberSettings, ...room }) => {
    const mine = memberSettings?.[uid] ?? {};
    const cleared =
      mine.clearedAt &&
      room.lastMessage &&
      new Date(room.lastMessage.createdAt) <= new Date(mine.clearedAt);
    return {
      ...room,
      lastMessage: cleared ? null : room.lastMessage,
      mySettings: { muted: Boolean(mine.mutedAt) },
    };
  });
}

async function getMemberRoomOrThrow(db, roomId, userId) {
  const room = await db
    .collection("rooms")
    .findOne({ _id: roomId.toString() }, { projection: { members: 1 } });
  if (!room || !room.members.includes(userId.toString())) {
    throw serviceError("Room not found", 404);
  }
  return room;
}

export async function setRoomMuted(db, { roomId, userId, muted }) {
  await getMemberRoomOrThrow(db, roomId, userId);
  await db.collection("rooms").updateOne(
    { _id: roomId.toString() },
    { $set: { [`memberSettings.${userId}.mutedAt`]: muted ? new Date() : null } },
  );
  return { muted: Boolean(muted) };
}

export async function clearRoomForUser(db, { roomId, userId }) {
  await getMemberRoomOrThrow(db, roomId, userId);
  const clearedAt = new Date();
  await db.collection("rooms").updateOne(
    { _id: roomId.toString() },
    { $set: { [`memberSettings.${userId}.clearedAt`]: clearedAt } },
  );
  return { clearedAt };
}

export async function listBlockedIds(db, userId) {
  const rows = await db
    .collection("blocks")
    .find({ blockerId: userId.toString() })
    .project({ blockedId: 1 })
    .toArray();
  return rows.map((r) => r.blockedId);
}

// Blocked people with enough profile info to render a "Blocked users" list,
// newest block first. Users who no longer exist are dropped (account deletion
// also removes their block rows, so this is just a safety net).
export async function listBlockedUsers(db, userId) {
  const blocks = await db
    .collection("blocks")
    .find({ blockerId: userId.toString() })
    .sort({ createdAt: -1 })
    .toArray();
  const objectIds = blocks
    .map((b) => b.blockedId)
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));
  if (objectIds.length === 0) return [];

  const [users, stats] = await Promise.all([
    db
      .collection("users")
      .find({ _id: { $in: objectIds } })
      .project({ firstName: 1, lastName: 1, username: 1 })
      .toArray(),
    db
      .collection("usersStats")
      .find({ userId: { $in: objectIds } })
      .project({ userId: 1, profileImage: 1 })
      .toArray(),
  ]);
  const userById = new Map(users.map((u) => [u._id.toString(), u]));
  const imageById = new Map(stats.map((s) => [s.userId.toString(), s.profileImage ?? null]));

  return blocks.flatMap((b) => {
    const user = userById.get(b.blockedId);
    if (!user) return [];
    return [
      {
        _id: b.blockedId,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        username: user.username ?? "",
        profileImage: imageById.get(b.blockedId) ?? null,
        blockedAt: b.createdAt ?? null,
      },
    ];
  });
}

export async function blockUser(db, { blockerId, blockedId }) {
  if (blockerId.toString() === blockedId.toString()) {
    throw serviceError("You can't block yourself", 400);
  }
  // Upsert so repeating the request is harmless (PUT is idempotent).
  await db.collection("blocks").updateOne(
    { blockerId: blockerId.toString(), blockedId: blockedId.toString() },
    { $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
}

export async function unblockUser(db, { blockerId, blockedId }) {
  await db.collection("blocks").deleteOne({
    blockerId: blockerId.toString(),
    blockedId: blockedId.toString(),
  });
}
