import React, { useCallback, useEffect, useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/SideBar";
import { BellOff, ChevronDown, SquarePen, Users } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  setRoomMuted,
  clearRoom,
  getBlockedIds,
  blockUser,
  unblockUser,
} from "./chatControlsApi";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { ArrowUpDown } from "lucide-react";
import "react-loading-skeleton/dist/skeleton.css";
import LoadingChatSuspense from "@/components/feedback/LoadingChatSuspense";
import ChatInterface from "./ChatInterface";
import { formatTimeAgo } from "./ChatInterface";
import NewGroupModal from "./NewGroupModal";
import Skeleton from "react-loading-skeleton";
import useThemeStore from "../../../stores/useThemeStore";
import { getAccessToken } from "../../../../constants/api";

// import VoiceChatSvg from "../../../assets/Voice chat-amico.svg";
const getUserIdFromJWT = (token) => {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const decodedPayload = JSON.parse(atob(padded));
    return decodedPayload?.id ? String(decodedPayload.id) : null;
  } catch {
    return null;
  }
};

const MIN_USER_STATS_SKELETON_MS = 350;

const Chats = () => {
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const [rooms, setRooms] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingLastMessages, setIsLoadingLastMessages] = useState(true);
  const [userStats, setUserStats] = useState(null);
  // { kind: "direct", user } | { kind: "group", room } | null
  const [activeConversation, setActiveConversation] = useState(null);
  const [filter, setFilter] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingUserStats, setIsLoadingUserStats] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [mutualFollowers, setMutualFollowers] = useState([]);
  const [sortOrder, setSortOrder] = useState("Newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  // Ids of users I've blocked (string ids). Blocked-by-them is deliberately not
  // exposed — the server just rejects the send, so it can't be probed.
  const [blockedIds, setBlockedIds] = useState([]);

  const isGroupActive = activeConversation?.kind === "group";
  const activeUser = activeConversation?.kind === "direct" ? activeConversation.user : null;
  const activeRoom = isGroupActive ? activeConversation.room : null;

  const clickedUser =
    `${activeUser?.firstName ?? ""} ${activeUser?.lastName ?? ""}`.trim() ||
    "Name Surname";

  // ws implementation //////////////////////////////////////////////
  const token = getAccessToken();
  const [socket, setSocket] = useState(null);
  const senderId = getUserIdFromJWT(token);
  const receiverId = activeUser?._id;
  const roomId = isGroupActive
    ? activeRoom?._id
    : senderId && receiverId
      ? [String(senderId), String(receiverId)].sort().join("_")
      : null;

  const roomsById = useMemo(() => {
    const map = {};
    rooms.forEach((room) => {
      map[room._id] = room;
    });
    return map;
  }, [rooms]);

  // Every conversation the user can see: existing groups they belong to, plus
  // every mutual follower as a potential/ongoing direct chat. Direct rooms
  // don't need their own list entry — a mutual follower IS the direct chat,
  // whether or not a room document exists for them yet.
  const conversationItems = useMemo(() => {
    const groupItems = rooms
      .filter((room) => room.type === "group")
      .map((room) => ({
        kind: "group",
        key: `group-${room._id}`,
        muted: Boolean(room.mySettings?.muted),
        title: room.name || "Unnamed group",
        avatar: room.avatar,
        room,
        preview: room.lastMessage
          ? { text: room.lastMessage.text, updatedAt: room.updatedAt }
          : null,
      }));

    const directItems = mutualFollowers.map((user) => {
      const directRoomId =
        senderId && user._id
          ? [String(senderId), String(user._id)].sort().join("_")
          : null;
      const room = directRoomId ? roomsById[directRoomId] : null;
      return {
        kind: "direct",
        key: `direct-${user._id}`,
        muted: Boolean(room?.mySettings?.muted),
        title: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        avatar: user.stats?.profileImage,
        user,
        preview: room?.lastMessage
          ? { text: room.lastMessage.text, updatedAt: room.updatedAt }
          : null,
      };
    });

    return [...groupItems, ...directItems];
  }, [rooms, mutualFollowers, roomsById, senderId]);

  const filteredConversations = useMemo(() => {
    // Sort by the last message time. Conversations with no messages yet have
    // nothing to order by, so they always go last in either direction.
    const time = (item) =>
      item.preview?.updatedAt ? new Date(item.preview.updatedAt).getTime() : null;
    const direction = sortOrder === "Newest" ? -1 : 1;
    const sorted = [...conversationItems].sort((a, b) => {
      const ta = time(a);
      const tb = time(b);
      if (ta === null && tb === null) return 0;
      if (ta === null) return 1;
      if (tb === null) return -1;
      return (ta - tb) * direction;
    });

    return sorted.filter((item) =>
      item.title.toLowerCase().includes(filter.trim().toLowerCase()),
    );
  }, [conversationItems, sortOrder, filter]);

  const skeletonBaseColor = isDarkMode ? "#1f2937" : "#ebebeb";
  const skeletonHighlightColor = isDarkMode ? "#374151" : "#f5f5f5";

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", token }));
      ws.send(
        JSON.stringify({
          type: "load_last_messages",
        }),
      );
      setSocket(ws);
    };
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "error") {
        toast.error(payload.message || "Something went wrong");
      } else if (payload.type === "sended_message") {
        setChatMessages((prev) => [...prev, payload.message]);
      } else if (payload.type === "message_history") {
        setChatMessages(payload.messageHistory || []);
        setIsLoadingHistory(false);
      } else if (payload.type === "load_last_messages") {
        setRooms(payload.roomsData || []);
        setIsLoadingLastMessages(false);
      } else if (
        payload.type === "group_created" ||
        payload.type === "group_updated"
      ) {
        const room = payload.room;
        const currentUserId = getUserIdFromJWT(getAccessToken());
        const isStillMember = room.members.includes(String(currentUserId));

        setRooms((prev) => {
          if (!isStillMember) return prev.filter((r) => r._id !== room._id);
          const idx = prev.findIndex((r) => r._id === room._id);
          if (idx === -1) return [...prev, room];
          const next = [...prev];
          // The broadcast room is shared by all members, so it carries no
          // per-user settings — keep this user's own.
          next[idx] = { ...room, mySettings: prev[idx].mySettings };
          return next;
        });

        if (!isStillMember) {
          setActiveConversation((prev) =>
            prev?.kind === "group" && prev.room._id === room._id ? null : prev,
          );
        }
      }
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setIsLoadingLastMessages(false);
    };
    ws.onclose = () => {
      return () => ws.close();
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!socket || !activeConversation || !roomId) return;
    if (socket.readyState !== WebSocket.OPEN) return;
    setIsLoadingHistory(true);
    setChatMessages([]);

    socket.send(
      JSON.stringify({
        type: "join_room",
        roomId,
        senderId,
        // Only meaningful for a direct chat's implicit first-message room
        // creation — a group's roomId already resolves to an existing room.
        receiverId: isGroupActive ? undefined : receiverId,
        message: "Creating Room",
      }),
    );
  }, [socket, activeConversation, roomId, senderId, receiverId, isGroupActive]);

  // Patch (or create a stub for) a room in the list. A direct chat's room is
  // created server-side on join, so it may not be in `rooms` yet.
  const patchRoom = (id, patch, direct = false) =>
    setRooms((prev) =>
      prev.some((r) => r._id === id)
        ? prev.map((r) => (r._id === id ? { ...r, ...patch } : r))
        : [...prev, { _id: id, type: direct ? "direct" : "group", ...patch }],
    );

  const activeRoomDoc = roomId ? roomsById[roomId] : null;
  const isMuted = Boolean(activeRoomDoc?.mySettings?.muted);
  const isBlockedByMe = Boolean(receiverId && blockedIds.includes(String(receiverId)));

  const handleToggleMute = async () => {
    if (!roomId) return;
    const next = !isMuted;
    try {
      await setRoomMuted(roomId, next);
      patchRoom(roomId, { mySettings: { muted: next } }, !isGroupActive);
      toast.success(next ? "Notifications muted" : "Notifications on");
    } catch (err) {
      toast.error(err.message || "Couldn't update notifications");
    }
  };

  const handleClearChat = async () => {
    if (!roomId) return;
    try {
      await clearRoom(roomId);
      setChatMessages([]);
      patchRoom(roomId, { lastMessage: null }, !isGroupActive);
      toast.success("Chat cleared");
    } catch (err) {
      toast.error(err.message || "Couldn't clear chat");
    }
  };

  const handleToggleBlock = async () => {
    if (!receiverId) return;
    const id = String(receiverId);
    try {
      if (isBlockedByMe) {
        await unblockUser(id);
        setBlockedIds((prev) => prev.filter((b) => b !== id));
        toast.success("User unblocked");
      } else {
        await blockUser(id);
        setBlockedIds((prev) => [...prev, id]);
        toast.success("User blocked");
      }
    } catch (err) {
      toast.error(err.message || "Couldn't update block");
    }
  };

  useEffect(() => {
    getBlockedIds()
      .then(({ blockedIds: ids }) => setBlockedIds(ids.map(String)))
      .catch((err) => console.error("Failed to load blocked users:", err));
  }, []);

  const handleSendMessage = () => {
    if (!draftMessage.trim() || !roomId) return;
    socket.send(
      JSON.stringify({
        type: "send_message",
        roomId,
        text: draftMessage,
      }),
    );
    setDraftMessage("");
  };

  const fetchUsers = useCallback(async () => {
    setIsLoadingChats(true);
    try {
      const request = await fetch(
        `${API_BASE_URL}/my-profile/chats/mutual-followers`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
          },
        },
      );
      const response = await request.json();
      setMutualFollowers(response.mutualFollowers);
    } catch (err) {
      console.error("Failed to load mutual followers:", err);
      setMutualFollowers([]);
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    if (isGroupActive || !receiverId) {
      setUserStats(null);
      setIsLoadingUserStats(false);
      return;
    }

    const fetchReceiverStats = async () => {
      const startedAt = Date.now();
      setIsLoadingUserStats(true);
      setUserStats(null);
      try {
        const request = await fetch(
          `${API_BASE_URL}/my-profile/chats/${receiverId}/stats`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getAccessToken()}`,
            },
          },
        );

        const response = await request.json();
        setUserStats(response.stats);
      } catch (error) {
        console.error("Failed to load user stats:", error);
      } finally {
        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_USER_STATS_SKELETON_MS) {
          await new Promise((resolve) =>
            setTimeout(resolve, MIN_USER_STATS_SKELETON_MS - elapsed),
          );
        }
        setIsLoadingUserStats(false);
      }
    };
    fetchReceiverStats();
  }, [receiverId, isGroupActive]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return (
    <div className="flex min-h-screen">
      <Toaster position="top-center" />
      <Sidebar />
      {!activeConversation ? (
        <>
          <div className="border-r w-full border-white/10 bg-white dark:bg-black lg:w-70 lg:pt-4  lg:px-0 lg:text-lg">
            <div className="flex items-center justify-between px-3">
              <h1 className="mt-3 lg:mt-0 text-lg font-semibold text-gray-900 dark:text-gray-100">
                Messages
              </h1>
              {/* New group */}
              <button
                type="button"
                onClick={() => setIsNewGroupOpen(true)}
                title="New group"
                aria-label="New group"
              >
                <SquarePen
                  size={15}
                  strokeWidth={1.75}
                  className="mt-3 lg:mt-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-200"
                />
              </button>
            </div>

            <div className="px-3 pt-5">
              <label
                htmlFor="chat-search"
                className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-100/80 px-3 py-[3px] backdrop-blur transition focus-within:border-purple-400 dark:border-gray-700 dark:bg-gray-800/60"
              >
                <SearchIcon
                  className="text-gray-400"
                  sx={{ fontSize: "20px" }}
                />
                <input
                  id="chat-search"
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search conversations"
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
                />
              </label>

              <div className="relative flex justify-end py-2">
                <button
                  type="button"
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <ArrowUpDown size={16} />
                  <div className="flex items-center justify-center gap-1 hover:text-gray-500 dark:hover:text-gray-300">
                    <span>{sortOrder}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isSortOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {isSortOpen && (
                  <div className="absolute top-full mt-0 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white  dark:border-gray-700 dark:bg-gray-900">
                    {["Newest", "Oldest"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSortOrder(option);
                          setIsSortOpen(false);
                        }}
                        className={`block w-full px-3 py-2 text-left text-sm transition hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          sortOrder === option
                            ? "bg-purple-50 text-purple-600 dark:bg-gray-800 dark:text-purple-400"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="max-h-[calc(100vh-180px)] overflow-y-auto bg-white dark:bg-black">
              {isLoadingChats ? (
                <div className="flex justify-center items-center px-3 py-6 text-sm text-gray-500 dark:text-gray-100">
                  <LoadingChatSuspense />
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((item) => {
                  const shouldShowLastMessageSkeleton =
                    isLoadingLastMessages && !item.preview;
                  const isActive =
                    item.kind === "group"
                      ? isGroupActive && activeRoom?._id === item.room._id
                      : !isGroupActive && activeUser?._id === item.user._id;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setActiveConversation(
                          item.kind === "group"
                            ? { kind: "group", room: item.room }
                            : { kind: "direct", user: item.user },
                        )
                      }
                      aria-current={isActive ? "true" : undefined}
                      className={`flex w-full items-center gap-3 border-b border-white/5 px-3 py-3 text-left transition-colors first:border-t focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-fuchsia-400
                  ${
                    isActive
                      ? "bg-fuchsia-950/30"
                      : "hover:bg-white/5"
                  }
                    `}
                    >
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt="Profile"
                          className="h-8 w-8 shrink-0 rounded-full bg-purple-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-fuchsia-950/40 dark:text-fuchsia-300">
                          {item.kind === "group" ? (
                            <Users size={14} />
                          ) : (
                            item.title?.[0]?.toUpperCase()
                          )}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-sm font-medium text-gray-100">
                          <span className="truncate">{item.title}</span>
                          {item.muted && (
                            <BellOff
                              size={12}
                              className="shrink-0 text-[#8A8A93]"
                              aria-label="Muted"
                            />
                          )}
                        </p>
                        <div className="flex justify-between items-center">
                          {shouldShowLastMessageSkeleton ? (
                            <>
                              <Skeleton
                                width={120}
                                height={12}
                                borderRadius={6}
                                baseColor={skeletonBaseColor}
                                highlightColor={skeletonHighlightColor}
                                className="opacity-80"
                              />
                              <Skeleton
                                width={44}
                                height={12}
                                borderRadius={6}
                                baseColor={skeletonBaseColor}
                                highlightColor={skeletonHighlightColor}
                                className="opacity-80"
                              />
                            </>
                          ) : (
                            <>
                              <p className="truncate text-xs text-[#8A8A93]">
                                {item.preview?.text || "No messages yet"}
                              </p>
                              {item.preview && (
                                <p className="ml-2 shrink-0 text-xs text-[#8A8A93]">
                                  {formatTimeAgo(item.preview.updatedAt)}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : mutualFollowers.length > 0 ? (
                <p className="flex justify-center items-center px-3 py-6 text-sm text-gray-500 dark:text-gray-400">
                  No conversations found
                </p>
              ) : (
                <p className="flex justify-center items-center px-3 py-6 text-sm text-gray-500 dark:text-gray-400">
                  No users found
                </p>
              )}
            </div>
          </div>
          <div className="hidden lg:m-4 lg:mx-auto lg:flex items-center  ">
            <div className="mx-auto grid items-center justify-center text-center text-gray-500 dark:text-gray-400">
              {/* <img src={VoiceChatSvg} alt="select a chat" /> */}
              <h2 className="pt-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
                Select a chat
              </h2>
              <p className=" mt-2">
                Choose a conversation from the left to start messaging.
              </p>
            </div>
          </div>
        </>
      ) : (
          <ChatInterface
            isGroup={isGroupActive}
            group={activeRoom}
            userSelected={activeUser}
            userStats={userStats}
            isMobile={isMobile}
            isLoadingUserStats={isLoadingUserStats}
            clickedUser={clickedUser}
            isLoadingHistory={isLoadingHistory}
            chatMessages={chatMessages}
            senderId={senderId}
            mutualFollowers={mutualFollowers}
            draftMessage={draftMessage}
            setDraftMessage={setDraftMessage}
            handleSendMessage={handleSendMessage}
            isMuted={isMuted}
            isBlockedByMe={isBlockedByMe}
            onToggleMute={handleToggleMute}
            onClearChat={handleClearChat}
            onToggleBlock={handleToggleBlock}
            onBack={() => setActiveConversation(null)}
            onLeftGroup={() => setActiveConversation(null)}
          />
      )}

      {isNewGroupOpen && (
        <NewGroupModal
          mutualFollowers={mutualFollowers}
          onClose={() => setIsNewGroupOpen(false)}
          onCreated={(room) => {
            setRooms((prev) => [...prev, room]);
            setActiveConversation({ kind: "group", room });
          }}
        />
      )}
    </div>
  );
};

export default Chats;
