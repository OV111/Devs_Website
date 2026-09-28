// Tracks which live sockets belong to which authenticated user, independent of
// which chat rooms they've joined. REST endpoints (group create/add/remove/etc.)
// use this to push realtime updates to affected users even if they don't
// currently have that room open.
const userSockets = new Map(); // userId (string) -> Set<ws>

export const registerUserSocket = (userId, ws) => {
  if (!userId) return;
  const key = userId.toString();
  if (!userSockets.has(key)) userSockets.set(key, new Set());
  userSockets.get(key).add(ws);
};

export const unregisterUserSocket = (userId, ws) => {
  if (!userId) return;
  const key = userId.toString();
  const sockets = userSockets.get(key);
  if (!sockets) return;
  sockets.delete(ws);
  if (sockets.size === 0) userSockets.delete(key);
};

export const sendToUser = (userId, payload) => {
  const sockets = userSockets.get(userId?.toString());
  if (!sockets?.size) return;
  const message = JSON.stringify(payload);
  sockets.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(message);
  });
};

export const notifyUsers = (userIds, payload) => {
  new Set(userIds.map(String)).forEach((id) => sendToUser(id, payload));
};
