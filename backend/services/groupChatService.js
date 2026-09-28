import { ObjectId } from "mongodb";

const serviceError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const getGroupOrThrow = async (rooms, roomId) => {
  const room = await rooms.findOne({ _id: roomId });
  if (!room || room.type !== "group") throw serviceError("Group not found", 404);
  return room;
};

const assertAdmin = (room, userId) => {
  if (!room.admins.includes(userId)) {
    throw serviceError("Only group admins can do this", 403);
  }
};

export const createGroupService = async (db, { creatorId, name, memberIds }) => {
  if (!name?.trim()) throw serviceError("Group name is required", 400);

  const members = Array.from(
    new Set([creatorId, ...memberIds].map(String)),
  );
  if (members.length < 3) {
    throw serviceError("A group needs at least 2 other members", 400);
  }

  const room = {
    _id: new ObjectId().toString(),
    type: "group",
    name: name.trim(),
    avatar: null,
    members,
    admins: [creatorId.toString()],
    createdBy: creatorId.toString(),
    lastMessage: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection("rooms").insertOne(room);
  return room;
};

export const addGroupMemberService = async (db, { roomId, actorId, memberId }) => {
  const rooms = db.collection("rooms");
  const room = await getGroupOrThrow(rooms, roomId);
  assertAdmin(room, actorId);

  if (room.members.includes(memberId)) {
    throw serviceError("User is already a member", 409);
  }

  await rooms.updateOne(
    { _id: roomId },
    { $addToSet: { members: memberId }, $set: { updatedAt: new Date() } },
  );
  return rooms.findOne({ _id: roomId });
};

export const removeGroupMemberService = async (db, { roomId, actorId, memberId }) => {
  const rooms = db.collection("rooms");
  const room = await getGroupOrThrow(rooms, roomId);

  const isSelfRemoval = actorId === memberId;
  if (!isSelfRemoval) assertAdmin(room, actorId);
  if (memberId === room.createdBy) {
    throw serviceError("The group owner cannot be removed", 403);
  }

  await rooms.updateOne(
    { _id: roomId },
    { $pull: { members: memberId, admins: memberId }, $set: { updatedAt: new Date() } },
  );
  return rooms.findOne({ _id: roomId });
};

export const leaveGroupService = (db, { roomId, userId }) =>
  removeGroupMemberService(db, { roomId, actorId: userId, memberId: userId });

export const setGroupAdminService = async (db, { roomId, actorId, memberId, promote }) => {
  const rooms = db.collection("rooms");
  const room = await getGroupOrThrow(rooms, roomId);
  assertAdmin(room, actorId);

  if (!room.members.includes(memberId)) {
    throw serviceError("User is not a member of this group", 400);
  }

  await rooms.updateOne(
    { _id: roomId },
    {
      [promote ? "$addToSet" : "$pull"]: { admins: memberId },
      $set: { updatedAt: new Date() },
    },
  );
  return rooms.findOne({ _id: roomId });
};

export const updateGroupService = async (db, { roomId, actorId, name, avatar }) => {
  const rooms = db.collection("rooms");
  const room = await getGroupOrThrow(rooms, roomId);
  assertAdmin(room, actorId);

  const update = { updatedAt: new Date() };
  if (typeof name === "string" && name.trim()) update.name = name.trim();
  if (avatar !== undefined) update.avatar = avatar;

  await rooms.updateOne({ _id: roomId }, { $set: update });
  return rooms.findOne({ _id: roomId });
};

export const getGroupDetailsService = async (db, roomId, requesterId) => {
  const rooms = db.collection("rooms");
  const room = await getGroupOrThrow(rooms, roomId);

  if (!room.members.includes(requesterId)) {
    throw serviceError("Access denied", 403);
  }

  const memberDetails = await db
    .collection("users")
    .aggregate([
      { $match: { _id: { $in: room.members.map((id) => new ObjectId(id)) } } },
      {
        $lookup: {
          from: "usersStats",
          localField: "_id",
          foreignField: "userId",
          as: "stats",
        },
      },
      { $unwind: { path: "$stats", preserveNullAndEmptyArrays: true } },
      { $project: { firstName: 1, lastName: 1, username: 1, stats: 1 } },
    ])
    .toArray();

  return { ...room, memberDetails };
};
