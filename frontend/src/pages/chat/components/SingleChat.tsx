/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";
import { toast } from "sonner";
import { getSender, getSenderFull } from "../../../config/ChatLogics";
import { ArrowLeft, Send, MoreVertical, Users, User } from "lucide-react";
import ProfileModal from "../../../components/miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../../../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "../../../components/miscellaneous/UpdateGroupChatModal";
import { useMessagesQuery, useSendMessageMutation } from "../../../api/message";
import { useChatStore } from "../../../state/chatStore";
import { useUserStore } from "../../../state/userStore";
import { EmojiPicker } from "../../../components/ui/EmojiPicker";
import { useNotifications } from "../../../hooks/useNotifications";
import { useBgStore } from "@/state/bgStore";

const ENDPOINT = import.meta.env.VITE_API_URL;
let socket: any;
let selectedChatCompare: any;

interface SingleChatProps {
  fetchAgain: boolean;
  setFetchAgain: (value: boolean) => void;
}

const SingleChat = ({ fetchAgain, setFetchAgain }: SingleChatProps) => {
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const user = useUserStore((s) => s.user);
  const {
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    incrementUnread,
  } = useChatStore();
  const { requestPermission, showNotification } = useNotifications();
  const { backgroundImage, isBgLoaded } = useBgStore();

  const { data: messages = [], isLoading } = useMessagesQuery(
    selectedChat?._id || ""
  );
  const sendMessageMutation = useSendMessageMutation(selectedChat?._id || "");

  const sendMessage = async (event?: React.KeyboardEvent<HTMLInputElement>) => {
    const messageToSend = newMessage;
    if (
      (event && event.key === "Enter" && messageToSend) ||
      (!event && messageToSend)
    ) {
      socket.emit("stop typing", selectedChat?._id);
      try {
        setNewMessage("");
        const data = await sendMessageMutation.mutateAsync(messageToSend);
        socket.emit("new message", data);
        if (audioRef.current) audioRef.current.play();
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Failed to send the message"
        );
        setNewMessage(messageToSend);
      }
    } else if (
      (event && event.key === "Enter" && !messageToSend) ||
      (!event && !messageToSend)
    ) {
      toast.info("Please enter a message before sending");
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", (payload: { userId: string }) => {
      if (payload && payload.userId !== user?._id) setIsTyping(true);
    });
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("join chat", selectedChat._id);
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  useEffect(() => {
    socket?.on("message recieved", (newMessageRecieved: any) => {
      const isWindowFocused = document.hasFocus();
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
          incrementUnread(newMessageRecieved.chat._id);
          if (!isWindowFocused) {
            showNotification(
              newMessageRecieved.chat.isGroupChat
                ? `New message in ${newMessageRecieved.chat.chatName}`
                : `New message from ${
                    newMessageRecieved.sender?.name || "User"
                  }`,
              {
                body: newMessageRecieved.content,
                icon: newMessageRecieved.sender?.pic || "/logo.svg",
              }
            );
          }
        }
      } else {
        if (audioRef.current) audioRef.current.play();
      }
    });
  }, [
    notification,
    setNotification,
    setFetchAgain,
    fetchAgain,
    incrementUnread,
    showNotification,
  ]);

  const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", { chatId: selectedChat?._id, userId: user?._id });
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", {
          chatId: selectedChat?._id,
          userId: user?._id,
        });
        setTyping(false);
      }
    }, timerLength);
  };

  if (!user) return null;
  if (!selectedChat) return null;

  const chatPartner = !selectedChat.isGroupChat
    ? getSenderFull(user, selectedChat.users)
    : null;

  return (
    <div className="relative flex flex-col h-full bg-background">
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-700 ease-in-out ${
          isBgLoaded ? "opacity-40 dark:opacity-50" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <audio ref={audioRef} src="/message.mp3" preload="auto" />

      {/* Mobile-Optimized Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-card/95 backdrop-blur-sm z-10 select-none">
        {/* Left Section - Back Button + Avatar + Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedChat(null)}
            className="p-2 hover:bg-muted/50 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {chatPartner && !selectedChat.isGroupChat ? (
            <ProfileModal user={chatPartner}>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-muted/30 rounded-lg p-2 -m-2 transition-colors">
                <Avatar className="w-10 h-10 border-2 border-background">
                  <AvatarImage
                    src={chatPartner?.pic || "/placeholder.svg"}
                    alt={chatPartner?.name}
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                    {chatPartner?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base truncate">
                    {getSender(user, selectedChat.users)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tap to view profile
                  </p>
                </div>
              </div>
            </ProfileModal>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted border-2 border-background rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base truncate">
                  {selectedChat.chatName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedChat.users.length} members
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center space-x-1">
          {!selectedChat.isGroupChat && chatPartner ? (
            <ProfileModal user={chatPartner}>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-muted/50 rounded-full"
              >
                <User className="w-5 h-5" />
              </Button>
            </ProfileModal>
          ) : (
            <UpdateGroupChatModal
              fetchMessages={() => {}}
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            >
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-muted/50 rounded-full"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </UpdateGroupChatModal>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden bg-background/50 z-10  select-none">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground text-sm">Loading messages...</p>
            </div>
          </div>
        ) : (
          <div className="h-full px-2 md:px-4">
            <ScrollableChat messages={messages} />
          </div>
        )}
      </div>

      {/* Typing Indicator */}
      {istyping && (
        <div className="flex items-center space-x-3 px-4 py-3 bg-muted/30 border-t z-10">
          <div className="bg-white rounded-full p-2 shadow-sm">
            <Lottie options={defaultOptions} width={24} height={12} />
          </div>
          <span className="text-sm text-muted-foreground">
            Someone is typing...
          </span>
        </div>
      )}

      {/* Mobile-Optimized Message Input */}
      <div className="p-4 border-t bg-card/95 backdrop-blur-sm z-10 select-none">
        <div className="flex items-end space-x-1.5 md:space-x-3">
          {/* Emoji Picker */}
          <div className="pb-1.5">
            <EmojiPicker
              onSelect={(emoji) => setNewMessage((prev) => prev + emoji)}
            />
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={sendMessage}
              className="min-h-[44px] py-3 px-4 rounded-full border-2 transition-colors text-base resize-none"
              disabled={sendMessageMutation.isPending}
              style={{ fontSize: "16px" }} // Prevents zoom on iOS
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={() => sendMessage()}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="h-11 w-11 rounded-full p-0 bg-primary hover:bg-primary/90 transition-colors"
          >
            {sendMessageMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-primary-foreground" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleChat;
