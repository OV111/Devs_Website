import React, { useEffect, useRef, useState } from "react";
import {
  AudioLines,
  CirclePlus,
  Ellipsis,
  Send,
  ArrowLeft,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import useThemeStore from "../../../stores/useThemeStore";
// import StartChatSvg from "../../../assets/StartChat.svg";
// import VoiceChatSvg from "../../../assets/Voice chat-amico.svg";
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
  userSelected,
  userStats,
  isLoadingUserStats,
  clickedUser,
  isLoadingHistory,
  chatMessages,
  senderId,
  draftMessage,
  setDraftMessage,
  handleKeyDown,
  handleSendMessage,
  onBack,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const messagesContainerRef = useRef(null);
  const menuRef = useRef(null);
  const { theme } = useThemeStore();
  const isDarkMode = theme === "dark";
  const skeletonBaseColor = isDarkMode ? "#1f2937" : "#ebebeb";
  const skeletonHighlightColor = isDarkMode ? "#374151" : "#f5f5f5";

  useEffect(() => {
    if (isLoadingHistory) return;
    if (!messagesContainerRef.current) return;

    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "auto",
    });
  }, [chatMessages, userSelected, isLoadingHistory]);

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
  }, [userSelected?._id]);

  return (
    <div className="min-w-0 flex-1 bg-white dark:bg-gray-950">
      <div className="flex h-screen flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-2 lg:px-3 py-2.5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex justify-center items-center">
            <button onClick={onBack}>
              <ArrowLeft
                // size={18}
                className="w-4 h-4 lg:w-5 lg:h-5 lg:mr-4 mr-2 cursor-pointer text-gray-700 dark:text-gray-100 "
              />
            </button>
            <div className="flex justify-center items-center gap-3">
              {isLoadingUserStats ? (
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
                {isLoadingUserStats ? (
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
                    <p className="text-sm lg:text-base text-gray-800 dark:text-gray-100 ">
                      {clickedUser}
                    </p>

                    <div className="flex items-center gap-2 overflow-x-auto text-xs text-gray-500 dark:text-gray-400">
                      {isOnlineByLastActive(userStats?.lastActive) ? (
                        <>
                          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Online
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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
              className="cursor-pointer rounded-2xl bg-gray-200 p-1 text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <Ellipsis className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>

            {isMenuOpen && (
              <ul className="absolute right-0 z-4 mt-2 grid w-52 gap-1 overflow-hidden rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-xl shadow-black/10 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95 dark:shadow-black/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-lg border border-transparent bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-800 transition-all duration-200 hover:border-gray-200 hover:bg-gray-100 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                >
                  <li>View Profile</li>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-lg border border-transparent bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-800 transition-all duration-200 hover:border-gray-200 hover:bg-gray-100 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                >
                  <li>Mute Notifications</li>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-lg border border-transparent bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-800 transition-all duration-200  hover:border-gray-200 hover:bg-gray-100 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:border-gray-600 dark:hover:bg-gray-800"
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
              </ul>
            )}
          </div>
        </div>

        <div
          ref={messagesContainerRef}
          className="grid flex-1 items-end overflow-y-auto  bg-gray-50 p-4 dark:bg-gray-950"
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
                      <p
                        className={`inline-block w-fit max-w-full break-words rounded-3xl px-3 py-2 text-sm ${
                          isMine
                            ? "rounded-br-sm bg-fuchsia-600 text-white dark:bg-fuchsia-500"
                            : "rounded-bl-sm border border-gray-200 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {msg.text}
                      </p>
                      <span
                        className={`mt-1 px-2 text-[10px] ${
                          isMine
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-gray-400 dark:text-gray-500"
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
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    No messages yet
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    Start the conversation with your first message.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-gray-100 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
          <CirclePlus
            size={26}
            className="cursor-pointer text-xl mx-2 text-gray-700 transition-colors hover:text-fuchsia-600 dark:text-gray-100 dark:hover:text-fuchsia-400"
          />
          <input
            type="text"
            value={draftMessage}
            placeholder="Write your message..."
            onChange={(e) => setDraftMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-3xl border border-gray-200 bg-transparent px-4 py-[7px] text-sm text-gray-900 placeholder:text-gray-400 outline-none duration-300 focus:border-fuchsia-400 focus:placeholder:opacity-0 dark:border-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
          <AudioLines
            size={26}
            className="mx-2 cursor-pointer text-gray-700 transition-colors duration-400 hover:text-fuchsia-600 dark:text-gray-100 dark:hover:text-fuchsia-400"
          />
          <Send
            onClick={handleSendMessage}
            size={26}
            className="mr-2 cursor-pointer text-fuchsia-600 transition-colors duration-400 hover:text-fuchsia-700 dark:text-fuchsia-400 dark:hover:text-fuchsia-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
