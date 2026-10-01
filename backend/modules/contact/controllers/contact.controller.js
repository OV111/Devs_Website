import { sendContactNotification } from "../../../utils/emailService.js";

/**
 * POST /api/contact
 *
 * The message is saved BEFORE the email is sent, and the email is best-effort.
 * Email providers fail (quota, unverified domain, outage); when they do, the
 * message must still be readable later from the database instead of being
 * lost while the user sees "sent".
 */
export const submitContactMessage = async (req, res) => {
  const { website, ...message } = req.body;

  // Honeypot filled → a bot. Same response as success, nothing stored.
  if (website) return res.status(202).json({ success: true });

  try {
    const db = req.app.locals.db;
    const { insertedId } = await db.collection("contact_messages").insertOne({
      ...message,
      createdAt: new Date(),
      emailed: false,
    });

    sendContactNotification(message)
      .then(() =>
        db
          .collection("contact_messages")
          .updateOne({ _id: insertedId }, { $set: { emailed: true } }),
      )
      .catch((err) => console.error("contact: notification email failed:", err.message));

    res.status(202).json({ success: true });
  } catch (err) {
    console.error("contact: failed to save message:", err);
    res.status(500).json({
      success: false,
      message: "Couldn't send your message. Please email us directly.",
    });
  }
};
