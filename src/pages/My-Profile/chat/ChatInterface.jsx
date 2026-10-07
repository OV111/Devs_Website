import React, { useEffect, useRef, useState } from "react";
import { AudioLines, Ellipsis, Mic, Send, ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
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

const MENU_ITEM =
  "w-full cursor-pointer rounded-lg border border-transparent bg-white/5 px-3 py-2 text-left text-xs font-medium text-white/80 transition-all duration-200 hover:border-white/10 hover:bg-white/10 disabled:cursor-not-allowed disabled:text-[#8A8A93] disabled:hover:border-transparent disabled:hover:bg-white/5";

const CONFIRM_COPY = {
  clear: {
    title: "Clear this chat?",
    body: "This removes the messages from your view only. The other person keeps their copy.",
    confirmLabel: "Clear chat",
  },
  block: {
    title: "Block this user?",
    body: "Neither of you will be able to send messages in this chat. You can unblock them any time.",
    confirmLabel: "Block",
  },
};

const isOnlineByLastActive =(dateString) => {
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
  handleSendMessage,
  isMuted = false,
  isBlockedByMe = false,
  onToggleMute,
  onClearChat,
  onToggleBlock,
  onBack,
  onLeftGroup,
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirm, setConfirm] = useState(null); // "clear" | "block" | null
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
      <div className="flex h-[calc(100dvh-var(--navbar-h,0px))] md:h-screen flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 bg-black px-2 lg:px-3 py-2.5">
          <div className="flex justify-center items-center">
            <button type="button" onClick={onBack} aria-label="Back to conversations" className="relative after:absolute after:-inset-3">
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
                userStats?.profileImage ? (
                  <img
                    src={userStats.profileImage}
                    alt="Profile"
                    className="lg:mx-0 mx-auto h-8 w-8 object-cover rounded-full bg-purple-100"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-950/40 text-sm font-medium text-fuchsia-300">
                    {clickedUser?.[0]?.toUpperCase()}
                  </div>
                )
              )}
              <div className=" ">
                {isGroup ? (
                  <div>
                    <p className="text-sm lg:text-base text-white/90 ">
                      {group?.name || "Group"}
                    </p>
                    <p className="text-xs text-[#8A8A93]">
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

                    <div className="flex items-center gap-2 overflow-x-auto text-xs text-[#8A8A93]">
                      {isOnlineByLastActive(userStats?.lastActive) ? (
                        <>
                          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                          <p className="text-xs text-[#8A8A93]">
                            Online
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-[#8A8A93]">
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
              aria-haspopup="menu"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="cursor-pointer rounded-2xl bg-white/5 p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Ellipsis className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 z-4 mt-2 grid w-52 gap-1 overflow-hidden rounded-2xl border border-white/10 bg-black/95 p-2 shadow-xl shadow-black/40 backdrop-blur-sm"
              >
                {isGroup ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMembersOpen(true);
                    }}
                    className={MENU_ITEM}
                  >
                    Manage members
                  </button>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    disabled={!userSelected?.username}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate(`/users/${userSelected.username}`);
                    }}
                    className={MENU_ITEM}
                  >
                    View Profile
                  </button>
                )}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onToggleMute();
                  }}
                  className={MENU_ITEM}
                >
                  {isMuted ? "Unmute notifications" : "Mute notifications"}
                </button>
                {/* Destructive-ish actions confirm first. */}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setConfirm("clear");
                  }}
                  className={MENU_ITEM}
                >
                  Clear chat
                </button>
                {!isGroup && !isBlockedByMe && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setConfirm("block");
                    }}
                    className={`${MENU_ITEM} text-red-300! hover:bg-red-950/40!`}
                  >
                    Block user
                  </button>
                )}
              </div>
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
                        className="mt-1 px-2 text-[11px] text-[#8A8A93]"
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
                  <p className="mt-1 text-xs text-[#8A8A93]">
                    Start the conversation with your first message.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {isBlockedByMe ? (
          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black px-4 py-3">
            <p className="text-sm text-[#8A8A93]">
              You blocked this user. They can&apos;t message you and you can&apos;t
              message them.
            </p>
            <button
              type="button"
              onClick={onToggleBlock}
              className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-fuchsia-400"
            >
              Unblock
            </button>
          </div>
        ) : (
        /* A real <form>: Enter submits natively, so no key handler is needed. */
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="border-t border-white/10 bg-black p-2"
        >
          <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/3 px-2.5 py-1.5 focus-within:border-fuchsia-500/60">
            <input
              type="text"
              value={draftMessage}
              placeholder="Write your message..."
              aria-label="Message"
              onChange={(e) => setDraftMessage(e.target.value)}
              className="w-full bg-transparent px-1 py-1 text-base md:text-sm text-white placeholder:text-[#8A8A93] outline-none"
            />
            {/* UI only for now — wire onClick when voice features are built. */}
            <button
              type="button"
              aria-label="Record voice message"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-purple-600 dark:text-purple-600 transition-colors hover:bg-white/5 hover:text-purple-500 focus-visible:outline-2 focus-visible:outline-purple-500"
            >
              <Mic size={20} />
            </button>
            <button
              type="button"
              aria-label="Voice mode"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-purple-600 dark:text-purple-600 transition-colors hover:bg-white/5 hover:text-purple-500 focus-visible:outline-2 focus-visible:outline-purple-500"
            >
              <AudioLines size={20} />
            </button>
            <button
              type="submit"
              aria-label="Send message"
              disabled={!draftMessage.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-purple-600 dark:text-purple-600 transition-colors hover:bg-white/5 hover:text-purple-500 focus-visible:outline-2 focus-visible:outline-purple-500 disabled:cursor-not-allowed disabled:text-[#8A8A93]/50 disabled:hover:bg-transparent"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        )}
      </div>

      {confirm && (
        <ConfirmDialog
          {...CONFIRM_COPY[confirm]}
          onCancel={() => setConfirm(null)}
          onConfirm={() => {
            const action = confirm === "clear" ? onClearChat : onToggleBlock;
            setConfirm(null);
            action();
          }}
        />
      )}

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
