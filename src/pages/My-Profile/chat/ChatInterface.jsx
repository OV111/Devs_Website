import React, { useEffect, useRef, useState } from "react";
import {
  AudioLines,
  Plus,
  Ellipsis,
  Send,
  ArrowLeft,
  Users,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import GroupMembersModal from "./GroupMembersModal";
// import StartChatSvg from "../../../assets/StartChat.svg";
// import VoiceChatSvg from "../../../assets/Voice chat-amico.svg";
// eslint-disable-next-line react-refresh/only-export-components
export function formatTimeAgo(dateString) {
  if (!dateString) return "recently";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "recently";
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const unit in intervals) {
    const value = Math.floor(seconds / intervals[unit]);
    if (value >= 1) {
      return rtf.format(-value, unit);
    }
  }
  return "just now";
}

const isOnlineByLastActive = (dateString) => {
  if (!dateString) return false;
  const lastActive = new Date(dateString);
  if (Number.isNaN(lastActive.getTime())) return false;
  const diff = Date.now() - lastActive.getTime();
  return diff >= 0 && diff < 60 * 1000;
};

const ChatInterface = ({
  isGroup = false,
  group,
  userSelected,
  userStats,
  isLoadingUserStats,
  clickedUser,
  isLoadingHistory,
  chatMessages,
  senderId,
  mutualFollowers = [],
  draftMessage,
  setDraftMessage,
  handleKeyDown,
  handleSendMessage,
  onBack,
  onLeftGroup,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const messagesContainerRef = useRef(null);
  const menuRef = useRef(null);
  const skeletonBaseColor = "#161616";
  const skeletonHighlightColor = "#262626";
  const activeId = isGroup ? group?._id : userSelected?._id;
  // Best-effort sender label for group messages — resolved from the mutual
  // followers list the sidebar already has in memory, so no extra fetch is
  // needed just to label a bubble.
  const memberNameById = React.useMemo(() => {
    const map = new Map();
    mutualFollowers.forEach((u) => {
      map.set(String(u._id), `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim());
    });
    return map;
  }, [mutualFollowers]);

  useEffect(() => {
    if (isLoadingHistory) return;
    if (!messagesContainerRef.current) return;

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "auto",
    });
  }, [chatMessages, activeId, isLoadingHistory]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [activeId]);

  return (
    <div className="min-w-0 flex-1 bg-black">
      <div className="flex h-screen flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 bg-black px-2 lg:px-3 py-2.5">
          <div className="flex justify-center items-center">
            <button onClick={onBack}>
              <ArrowLeft
                // size={18}
                className="w-4 h-4 lg:w-5 lg:h-5 lg:mr-4 mr-2 cursor-pointer text-white/70 hover:text-white "
              />
            </button>
            <div className="flex justify-center items-center gap-3">
              {isGroup ? (
                group?.avatar ? (
                  <img
                    src={group.avatar}
                    alt="Group"
                    className="lg:mx-0 mx-auto h-8 w-8 object-cover rounded-full bg-purple-100"
                  />
                ) : (
                  <div className="lg:mx-0 mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-950/40 text-fuchsia-300">
                    <Users size={16} />
                  </div>
                )
              ) : isLoadingUserStats ? (
                <Skeleton
                  circle
                  width={32}
                  height={32}
                  baseColor={skeletonBaseColor}
                  highlightColor={skeletonHighlightColor}
                />
              ) : (
                <img
                  src={userStats?.profileImage}
                  alt="Profile"
                  className="lg:mx-0 mx-auto h-8 w-8 object-cover rounded-full bg-purple-100"
                />
              )}
              <div className=" ">
                {isGroup ? (
                  <div>
                    <p className="text-sm lg:text-base text-white/90 ">
                      {group?.name || "Group"}
                    </p>
                    <p className="text-xs text-white/40">
                      {group?.members?.length ?? 0} members
                    </p>
                  </div>
                ) : isLoadingUserStats ? (
                  <div className="space-y-0">
                    <Skeleton
                      width={130}
                      height={12}
                      borderRadius={6}
                      baseColor={skeletonBaseColor}
                      highlightColor={skeletonHighlightColor}
                    />
                    <Skeleton
                      width={90}
                      height={10}
                      borderRadius={6}
                      baseColor={skeletonBaseColor}
                      highlightColor={skeletonHighlightColor}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm lg:text-base text-white/90 ">
                      {clickedUser}
                    </p>

                    <div className="flex items-center gap-2 overflow-x-auto text-xs text-white/40">
                      {isOnlineByLastActive(userStats?.lastActive) ? (
                        <>
                          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                          <p className="text-xs text-white/40">
                            Online
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-white/40">
                          {formatTimeAgo(userStats?.lastActive)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label="Open chat actions"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="cursor-pointer rounded-2xl bg-white/5 p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Ellipsis className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {isMenuOpen && (
              <ul className="absolute right-0 z-4 mt-2 grid w-52 gap-1 overflow-hidden rounded-2xl border border-white/10 bg-black/95 p-2 shadow-xl shadow-black/40 backdrop-blur-sm">
                {isGroup ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMembersOpen(true);
                    }}
                    className="w-full cursor-pointer rounded-lg border border-transparent bg-white/5 px-3 py-2 text-left text-xs font-medium text-white/80 transition-all duration-200 hover:border-white/10 hover:bg-white/10"
                  >
                    <li>Manage members</li>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="w-full cursor-pointer rounded-lg border border-transparent bg-white/5 px-3 py-2 text-left text-xs font-medium text-white/80 transition-all duration-200 hover:border-white/10 hover:bg-white/10"
                    >
                      <li>View Profile</li>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="w-full cursor-pointer rounded-lg border border-transparent bg-white/5 px-3 py-2 text-left text-xs font-medium text-white/80 transition-all duration-200 hover:border-white/10 hover:bg-white/10"
                    >
                      <li>Mute Notifications</li>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="w-full cursor-pointer rounded-lg border border-transparent bg-white/5 px-3 py-2 text-left text-xs font-medium text-white/80 transition-all duration-200 hover:border-white/10 hover:bg-white/10"
                    >
                      <li>Clear Chat</li>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="w-full cursor-pointer rounded-lg border border-transparent bg-red-50 px-3 py-2 text-left text-xs font-medium text-red-700 transition-all duration-200 hover:border-red-200 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300 dark:hover:border-red-900/70 dark:hover:bg-red-950/50"
                    >
                      <li>Block User</li>
                    </button>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="grid flex-1 items-end overflow-y-auto  bg-black p-4"
        >
          <div className="flex max-w-full flex-col gap-2">
            {isLoadingHistory ? (
              <div className="space-y-3">
                {[...Array(12)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
                  >
                    <Skeleton
                      width={idx % 2 === 0 ? 170 : 210}
                      height={34}
                      borderRadius={18}
                      baseColor={skeletonBaseColor}
                      highlightColor={skeletonHighlightColor}
                    />
                  </div>
                ))}
              </div>
            ) : chatMessages.length > 0 ? (
              chatMessages.map((msg) => {
                const isMine = String(msg.senderId) === String(senderId);
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex flex-col w-auto max-w-[56%]  ${isMine ? "items-end" : "items-start"}`}
                    >
                      {isGroup && !isMine && (
                        <span className="mb-0.5 px-2 text-[11px] font-medium text-fuchsia-400/80">
                          {memberNameById.get(String(msg.senderId)) || "Member"}
                        </span>
                      )}
                      <p
                        className={`inline-block w-fit max-w-full break-words rounded-3xl px-3 py-2 text-sm ${
                          isMine
                            ? "rounded-br-sm bg-fuchsia-600 text-white"
                            : "rounded-bl-sm border border-white/10 bg-white/5 text-white/90"
                        }`}
                      >
                        {msg.text}
                      </p>
                      <span
                        className={`mt-1 px-2 text-[10px] ${
                          isMine ? "text-white/30" : "text-white/25"
                        }`}
                      >
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full items-center justify-center py-16">
                <div className="rounded-3xl bg-transparent px-6 py-8 text-center">
                  {/* <img src={StartChatSvg} alt="no messages" /> */}
                  <p className="text-sm font-medium text-white/80">
                    No messages yet
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Start the conversation with your first message.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 bg-black p-2">
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/3 px-2.5 py-1.5">
            <button
              onClick={() => setIsPlusMenuOpen((prev) => !prev)}
              className={`${isPlusMenuOpen ? "bg-white/10" : ""} w-8 h-8 rounded-md flex items-center justify-center text-white transition-colors hover:bg-white/5 cursor-pointer shrink-0`}
              title="More options"
              aria-haspopup="menu"
              aria-expanded={isPlusMenuOpen}
            >
              <Plus size={20} strokeWidth={1.5} />
            </button>
            <input
              type="text"
              value={draftMessage}
              placeholder="Write your message..."
              onChange={(e) => setDraftMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent px-1 py-1 text-sm text-white placeholder:text-[#555] outline-none"
            />
            <AudioLines
              size={22}
              className="mx-1 shrink-0 cursor-pointer text-white/70 transition-colors hover:text-fuchsia-400"
            />
            <Send
              onClick={handleSendMessage}
              size={22}
              className="mr-1 shrink-0 cursor-pointer text-fuchsia-500 transition-colors hover:text-fuchsia-400"
            />
          </div>
        </div>
      </div>

      {isGroup && isMembersOpen && (
        <GroupMembersModal
          roomId={group._id}
          currentUserId={senderId}
          mutualFollowers={mutualFollowers}
          onClose={() => setIsMembersOpen(false)}
          onLeft={onLeftGroup}
        />
      )}
    </div>
  );
};

export default ChatInterface;
