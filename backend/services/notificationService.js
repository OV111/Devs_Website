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

// Newest first. Served by GET /my-profile/notifications.
export async function getNotifications(db, userId) {
  return db
    .collection("notifications")
    .find({ targetUserId: userId.toString() })
    .sort({ createdAt: -1 })
    .toArray();
}
