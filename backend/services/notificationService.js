import { ObjectId } from "mongodb";

// Notification persistence. Delivery (queue → worker → live WebSocket push)
// lives in workers/notificationWorker.js; this module only reads and writes
// the `notifications` collection.

// Builds and stores a notification. Returns null — writing nothing — when a
// required field is missing or the user would be notifying themselves.
export async function createNotification(db, { type, actorId, targetUserId }) {
  if (!type || !actorId || !targetUserId) return null;
  if (actorId === targetUserId) return null;

  const actor = await db.collection("users").findOne(
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
    // filter(Boolean) so a deleted actor or a missing name part never renders
    // as the literal text "undefined".
    senderName: [actor?.firstName, actor?.lastName].filter(Boolean).join(" "),
  };

  await db.collection("notifications").insertOne(notification);
  return notification;
}

// The inbox is capped: an unbounded list grows with the account's age.
export const NOTIFICATION_LIMIT = 100;

// Newest first. Served by GET /my-profile/notifications.
export async function getNotifications(db, userId) {
  return db
    .collection("notifications")
    .find({ targetUserId: userId.toString() })
    .sort({ createdAt: -1 })
    .limit(NOTIFICATION_LIMIT)
    .toArray();
}

// Every write below filters on `targetUserId`, so a user can only ever touch
// their own notifications — knowing another notification's id gets you nothing.
// Each returns whether anything of theirs matched (false → 404).

export async function markNotificationRead(db, userId, notificationId) {
  if (!ObjectId.isValid(notificationId)) return false;
  const { matchedCount } = await db
    .collection("notifications")
    .updateOne(
      { _id: new ObjectId(notificationId), targetUserId: userId.toString() },
      { $set: { read: true } },
    );
  return matchedCount > 0;
}

export async function markAllNotificationsRead(db, userId) {
  const { modifiedCount } = await db
    .collection("notifications")
    .updateMany({ targetUserId: userId.toString(), read: false }, { $set: { read: true } });
  return modifiedCount;
}

export async function deleteNotification(db, userId, notificationId) {
  if (!ObjectId.isValid(notificationId)) return false;
  const { deletedCount } = await db
    .collection("notifications")
    .deleteOne({ _id: new ObjectId(notificationId), targetUserId: userId.toString() });
  return deletedCount > 0;
}
