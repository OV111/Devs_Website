import { ObjectId } from "mongodb";

export async function createNotification(db, { type, actorId, targetUserId }) {
  if (!type || !actorId || !targetUserId) return null;
  if (actorId === targetUserId) return null;

  const users = db.collection("users");
  const notifications = db.collection("notifications");

  const actor = await users.findOne(
    { _id: new ObjectId(actorId) },
    { projection: { username: 1, firstName: 1, lastName: 1 } },
  );

  const notification = {
    type,
    actorId,
    targetUserId,
    read: false,
    createdAt: new Date(),
    senderUsername: actor?.username,
    senderName: actor ? `${actor.firstName} ${actor.lastName}` : "",
  };

  await notifications.insertOne(notification);
  return notification;
}

export async function getNotifications(db, userId) {
  const notifications = db.collection("notifications");
  return notifications
    .find({ targetUserId: userId.toString() })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
}

export async function markNotificationsRead(db, userId) {
  const notifications = db.collection("notifications");
  await notifications.updateMany(
    { targetUserId: userId.toString(), read: false },
    { $set: { read: true } },
  );
}
