# DevsWebs — Integrations & Features Backlog

> This file tracks planned integrations and new features. Each entry includes what to build, where it goes in the codebase, and what the DB/API changes look like.
> Last updated: 2026-03-27

---

## Index

| # | Feature | Status |
|---|---------|--------|
| 1 | Like / Reaction System | Planned |
| 2 | Notification System (BullMQ + WebSocket) | Planned |

---

## 1. Like / Reaction System

**What it is:**
Users can react to blog posts with a like (or multiple reaction types). Each post shows a live reaction count. A user can only react once per post — clicking again removes the reaction (toggle).

---

### Database

New collection: `reactions`

```js
{
  _id: ObjectId,
  postId: ObjectId,        // ref: blogs._id
  userId: ObjectId,        // ref: users._id
  type: "like",            // extend later: "fire", "mind_blown", etc.
  createdAt: Date
}
```

Index: `{ postId: 1, userId: 1 }` — unique compound index prevents duplicate reactions.

---

### Backend — New API Endpoints

Add to `backend/server.js` (or split into a `routes/reactions.js` file):

```
POST   /blogs/:postId/react        # Toggle reaction (add if not exists, remove if exists)
GET    /blogs/:postId/reactions    # Get reaction count + whether current user reacted
```

**POST /blogs/:postId/react** (auth required)
- Check if a reaction from this user on this post already exists
- If yes → delete it (unlike)
- If no → insert it (like)
- Return: `{ liked: bool, count: number }`

**GET /blogs/:postId/reactions**
- Count all reactions for the post
- If user is authenticated, also return whether they've reacted
- Return: `{ count: number, userReacted: bool }`

---

### Frontend — What to Change

**1. `BlogCard.jsx`**
- Add a heart/like button below each card
- Show reaction count
- Animate the button on click (scale + color change)

**2. `ReadMore.jsx` (post detail page)**
- Full-size like button in the post footer
- Show total count with label ("42 likes")
- Optimistic UI update — don't wait for API response before showing the toggle

**3. New hook: `src/hooks/useReaction.js`**
```js
// handles toggle, optimistic update, and error rollback
useReaction(postId) → { liked, count, toggle }
```

**4. API call in `src/service/ApiService.js`**
```js
toggleReaction(postId)
getReactions(postId)
```

---

### UI Behavior

- Heart icon (Lucide `Heart` — already in the stack)
- Default state: outlined heart, gray
- Liked state: filled heart, fuchsia (matches primary color)
- Count displayed next to icon: `❤ 24`
- Transition: `scale(1.3)` pop on click via Framer Motion or Tailwind `active:scale-125`
- Not logged in → clicking redirects to `/get-started` with a toast: "Sign in to react to posts"

---

### Auth

- Reactions require authentication
- Use existing JWT from `localStorage` ("JWT" key, see `useAuthStore`)
- Pass as `Authorization: Bearer <token>` header

---

### Scope Notes

- Start with "like" only — single reaction type
- Multi-reaction types (fire, 💡, etc.) are a Phase 2 extension
- No notifications for likes in Phase 1 (add to notification system later)
- No per-user list of "who liked" in Phase 1

---

## 2. Notification System (BullMQ + WebSocket)

**What it is:**
A real-time + persistent notification system. When key events happen (follow, message, like, new post from someone you follow), the target user gets notified instantly if they're online via WebSocket — and the notification is saved to MongoDB so they can read it later if they're offline.

BullMQ (backed by Redis) sits in the middle as the job queue — it decouples the event trigger from the notification delivery, handles retries, and makes the system resilient.

---

### Why BullMQ

| Without BullMQ | With BullMQ |
|---|---|
| Notification logic inline in route handlers | Jobs queued and processed separately |
| A crash during delivery = notification lost | Failed jobs are retried automatically |
| No rate control | Throttle bulk notifications (e.g. digest emails later) |
| Hard to extend to email/push later | Add email worker by adding a second processor |

Redis config file already exists at `backend/config/redis.js` — it's empty and ready to be filled.

---

### Notification Types (Phase 1)

| Event | Trigger point in code | Recipient |
|---|---|---|
| `follow` | `POST /users/:username/follow` in `server.js` | The user who got followed |
| `new_message` | `sendMessage()` in `backend/websocket/chatHandler.js` | The message receiver (if not in the room) |
| `post_like` | `POST /blogs/:postId/react` (Integration #1) | The post author |
| `new_post` | `POST /blogs` (blog creation) | All followers of the author |

---

### Architecture

```
Event happens (follow / message / like / new post)
        ↓
Route handler or WebSocket handler adds a job to BullMQ queue
        ↓
BullMQ worker picks up the job (runs in same Node.js process or separate worker file)
        ↓
Worker:
  1. Saves notification to MongoDB  →  persisted for offline users
  2. Checks if target user has an active WebSocket connection
     ├── Online  →  pushes { type: "notification", ... } over WebSocket instantly
     └── Offline →  saved in DB, delivered next time they open the app
```

---

### Redis Setup

Fill in `backend/config/redis.js`:

```js
// backend/config/redis.js
import { Redis } from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // required by BullMQ
});

export default redis;
```

New env vars to add to `.env.local`:
```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=        # leave empty for local dev
```

---

### Database

New collection: `notifications`

```js
{
  _id: ObjectId,
  recipientId: ObjectId,       // who receives it — ref: users._id
  senderId: ObjectId,          // who triggered it — ref: users._id
  type: String,                // "follow" | "new_message" | "post_like" | "new_post"
  read: Boolean,               // false on creation
  meta: {
    postId: ObjectId,          // present for post_like, new_post
    roomId: String,            // present for new_message
  },
  createdAt: Date
}
```

Index: `{ recipientId: 1, read: 1, createdAt: -1 }` — fast unread count + sorted feed.

---

### Backend — New Files

**`backend/queues/notificationQueue.js`** — defines the BullMQ queue:
```js
import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const notificationQueue = new Queue("notifications", { connection: redis });
```

**`backend/workers/notificationWorker.js`** — processes jobs:
```js
import { Worker } from "bullmq";
import redis from "../config/redis.js";
// Worker logic:
//   1. Insert notification doc into MongoDB
//   2. Look up recipient's live WS connection from connectedUsers Map
//   3. If found → ws.send({ type: "notification", ... })
```

**`backend/websocket/connectedUsers.js`** — shared Map of userId → ws socket:
```js
// Exported Map used by both websocket/index.js and the notification worker
export const connectedUsers = new Map(); // userId → ws
```

Update `backend/websocket/index.js` to populate this map on `auth` and clean it on `close`.

---

### Backend — New API Endpoints

```
GET    /my-profile/notifications           # Fetch all notifications (paginated, newest first)
PUT    /my-profile/notifications/read      # Mark all as read
PUT    /my-profile/notifications/:id/read  # Mark single notification as read
GET    /my-profile/notifications/unread-count  # Just the badge number
DELETE /my-profile/notifications/:id       # Delete single notification
```

---

### Where to Enqueue Jobs

**Follow event** — inside the existing follow handler in `server.js`:
```js
// After inserting into follows collection:
await notificationQueue.add("follow", {
  recipientId: followedUserId,
  senderId: currentUserId,
  type: "follow",
});
```

**New message** — inside `sendMessage()` in `backend/websocket/chatHandler.js`:
```js
// After inserting message, before broadcasting:
// Only notify if receiver is NOT currently in the room
const receiverInRoom = rooms.get(roomId)?.has(receiverSocket);
if (!receiverInRoom) {
  await notificationQueue.add("new_message", {
    recipientId: receiverId,
    senderId: senderId,
    type: "new_message",
    meta: { roomId },
  });
}
```

**Post like** — inside the react route from Integration #1:
```js
await notificationQueue.add("post_like", {
  recipientId: post.authorId,
  senderId: reactingUserId,
  type: "post_like",
  meta: { postId },
});
```

**New post** — inside `POST /blogs`:
```js
// Get all followers of the author, enqueue one job per follower
// Use BullMQ bulk add: notificationQueue.addBulk([...])
```

---

### Frontend — What to Change

**1. `src/pages/My-Profile/Notifications.jsx`** (currently just `<p>Notifications</p>`)
- Fetch notifications from `GET /my-profile/notifications`
- Render a list: avatar + message text + timestamp + unread dot
- "Mark all as read" button at the top
- Click on notification → navigate to the relevant page (post, profile, chat)

**2. `src/components/Navbar.jsx`**
- Add unread count badge on the bell icon (already in the nav)
- Poll `GET /my-profile/notifications/unread-count` every 30s, OR
- Receive count update over the existing WebSocket connection (preferred)

**3. WebSocket client** (wherever WS connection is initialized in the frontend)
- Handle incoming `{ type: "notification", ... }` message
- Update unread count in a new `useNotificationStore` (Zustand)
- Show a toast: "Vahe followed you" / "New message from Vahe"

**4. New store: `src/stores/useNotificationStore.js`**
```js
// unreadCount, notifications[], fetchNotifications(), markAllRead(), incrementUnread()
```

---

### WebSocket Message (real-time delivery)

The worker pushes this to the recipient's live socket:
```json
{
  "type": "notification",
  "notification": {
    "_id": "...",
    "type": "follow",
    "senderId": "...",
    "senderName": "Vahe",
    "senderAvatar": "https://...",
    "read": false,
    "createdAt": "2026-03-27T..."
  }
}
```

The frontend handler increments `useNotificationStore.unreadCount` and shows a hot-toast.

---

### Install

```bash
npm install bullmq ioredis
```

BullMQ requires `ioredis` — install both. No other config needed beyond Redis running locally.

---

### Scope Notes

- Phase 1: follow, new_message, post_like, new_post — the four events above
- No email notifications in Phase 1 (add a second BullMQ worker for email later — same queue, different processor)
- No notification preferences/settings in Phase 1
- Notifications auto-expire after 30 days — add a MongoDB TTL index: `{ createdAt: 1 }` with `expireAfterSeconds: 2592000`
- The `connectedUsers` Map works fine for a single-server deployment. If you scale to multiple servers later, replace with a Redis pub/sub broadcast.

---
