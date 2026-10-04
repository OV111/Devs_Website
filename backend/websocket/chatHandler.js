import notificationQueue from "../queues/notificationQueue.js";
import connectDB from "../config/db.js";
import {
  getOrCreateRoomForMember,
  saveMessage,
  loadMessages,
  loadRoomsForUser,
} from "../services/chatService.js";

// Transport layer only: socket presence, broadcasting and notification
// fan-out. All persistence lives in services/chatService.js.

const rooms = new Map(); // roomId -> Set<ws> (sockets currently viewing that room)

const sendError = (ws, message) =>
  ws.send(JSON.stringify({ type: "error", message }));

export const joinRoom = async (ws, data) => {
  const { roomId, receiverId } = data;
  const senderId = ws.userId;
  if (!roomId) return sendError(ws, "Room ID is missing");
  if (!senderId) return sendError(ws, "User id is missing");

  if (!rooms.has(roomId)) rooms.set(roomId, new Set());

  let db;
  let clearedAt = null;
  try {
    db = await connectDB();
    const { error, room } = await getOrCreateRoomForMember(db, {
      roomId,
      userId: senderId,
      receiverId,
    });
    if (error) return sendError(ws, error);
    clearedAt = room.memberSettings?.[senderId]?.clearedAt ?? null;
  } catch (err) {
    console.error("joinRoom failed:", err);
    return sendError(ws, "Error with DB");
  }

  rooms.get(roomId).add(ws);
  const messageHistory = await loadMessages(db, roomId, 50, clearedAt);
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
    const { error, members, mutedMembers = [], message } = await saveMessage(db, {
      roomId,
      senderId,
      text,
    });
    if (error) return sendError(ws, error);

    // Broadcast to every socket currently viewing this room, and track who's
    // actually present so we only queue notifications for absent members —
    // works the same way for a 2-person room or an N-person group.
    const sockets = rooms.get(roomId);
    const presentUserIds = new Set();
    sockets.forEach((clientSocket) => {
      if (clientSocket.readyState === WebSocket.OPEN) {
        presentUserIds.add(clientSocket.userId);
        clientSocket.send(JSON.stringify({ type: "sended_message", message }));
      }
    });

    // Muted members still receive the message, just no notification.
    const absentMembers = members.filter(
      (memberId) =>
        memberId !== senderId.toString() &&
        !presentUserIds.has(memberId) &&
        !mutedMembers.includes(memberId),
    );
    absentMembers.forEach((targetUserId) => {
      notificationQueue.add("new_message", {
        type: "new_message",
        actorId: senderId,
        targetUserId,
      });
    });
  } catch (error) {
    console.error("sendMessage failed:", error);
    return sendError(ws, "Failed to send message");
  }
};

export const removeFromRooms = (ws) => {
  for (const [roomId, sockets] of rooms.entries()) {
    sockets.delete(ws);
    if (sockets.size === 0) rooms.delete(roomId);
  }
};

export const loadLastMessages = async (ws) => {
  const userId = ws.userId;
  if (!userId) return sendError(ws, "userId is not defined");

  const db = await connectDB();
  const roomsData = await loadRoomsForUser(db, userId);
  return ws.send(JSON.stringify({ type: "load_last_messages", roomsData }));
};
