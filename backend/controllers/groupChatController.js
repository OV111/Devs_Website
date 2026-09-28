import { getAuthToken } from "../services/followService.js";
import { notifyUsers } from "../websocket/connectionRegistry.js";
import {
  createGroupService,
  addGroupMemberService,
  removeGroupMemberService,
  leaveGroupService,
  setGroupAdminService,
  updateGroupService,
  getGroupDetailsService,
} from "../services/groupChatService.js";

const handleServiceError = (res, err) => {
  res.status(err.status ?? 500).json({ message: err.message || "Server Error" });
};

export const createGroup = async (req, res) => {
  try {
    const auth = getAuthToken(req.headers.authorization);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    const { name, memberIds } = req.body;
    const room = await createGroupService(req.app.locals.db, {
      creatorId: auth.userId,
      name,
      memberIds: Array.isArray(memberIds) ? memberIds : [],
    });

    notifyUsers(room.members, { type: "group_created", room });
    res.status(201).json({ room });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const addGroupMember = async (req, res) => {
  try {
    const auth = getAuthToken(req.headers.authorization);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    const { roomId } = req.params;
    const { memberId } = req.body;
    if (!memberId) return res.status(400).json({ message: "memberId is required" });

    const room = await addGroupMemberService(req.app.locals.db, {
      roomId,
      actorId: auth.userId,
      memberId,
    });

    notifyUsers(room.members, { type: "group_updated", room });
    res.status(200).json({ room });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const auth = getAuthToken(req.headers.authorization);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    const { roomId, memberId } = req.params;
    const room = await removeGroupMemberService(req.app.locals.db, {
      roomId,
      actorId: auth.userId,
      memberId,
    });

    notifyUsers([...room.members, memberId], { type: "group_updated", room });
    res.status(200).json({ room });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const auth = getAuthToken(req.headers.authorization);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    const { roomId } = req.params;
    const room = await leaveGroupService(req.app.locals.db, {
      roomId,
      userId: auth.userId,
    });

    notifyUsers([...room.members, auth.userId], { type: "group_updated", room });
    res.status(200).json({ room });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const setGroupAdmin = async (req, res) => {
  try {
    const auth = getAuthToken(req.headers.authorization);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    const { roomId, memberId } = req.params;
    const room = await setGroupAdminService(req.app.locals.db, {
      roomId,
      actorId: auth.userId,
      memberId,
      promote: Boolean(req.body?.promote),
    });

    notifyUsers(room.members, { type: "group_updated", room });
    res.status(200).json({ room });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const updateGroup = async (req, res) => {
  try {
    const auth = getAuthToken(req.headers.authorization);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    const { roomId } = req.params;
    const { name, avatar } = req.body;
    const room = await updateGroupService(req.app.locals.db, {
      roomId,
      actorId: auth.userId,
      name,
      avatar,
    });

    notifyUsers(room.members, { type: "group_updated", room });
    res.status(200).json({ room });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const getGroupDetails = async (req, res) => {
  try {
    const auth = getAuthToken(req.headers.authorization);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    const { roomId } = req.params;
    const group = await getGroupDetailsService(req.app.locals.db, roomId, auth.userId);
    res.status(200).json({ group });
  } catch (err) {
    handleServiceError(res, err);
  }
};
