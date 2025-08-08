/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Plus, Users, User, Search, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../components/ui/avatar";
import { Badge } from "../../../components/ui/badge";
import GroupChatModal from "../../../components/miscellaneous/GroupChatModal";
import { getSender } from "../../../config/ChatLogics";
import { Card } from "../../../components/ui/card";
import { useChatsQuery } from "../../../api/chat";
import { useChatStore } from "../../../state/chatStore";
import { useUserStore } from "../../../state/userStore";

interface MyChatsProps {
  onClose?: () => void;
}

const MyChats = ({ onClose }: MyChatsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const user = useUserStore((s) => s.user);
  const { selectedChat, setSelectedChat, unreadCounts, clearUnread } =
    useChatStore();

  const { data: chats, isLoading, error } = useChatsQuery();

  // const filteredChats = chats?.filter((chat: any) => {
  //   if (!searchTerm) return true;
  //   const chatName = chat.isGroupChat
  //     ? chat.chatName
  //     : user
  //     ? getSender(user, chat.users)
  //     : "";
  //   return chatName.toLowerCase().includes(searchTerm.toLowerCase());
  // });


  const filteredChats = Array.isArray(chats)
  ? chats.filter((chat: any) => {
      if (!searchTerm) return true;
      const chatName = chat.isGroupChat
        ? chat.chatName
        : user
        ? getSender(user, chat.users)
        : "";
      return chatName.toLowerCase().includes(searchTerm.toLowerCase());
    })
  : [];


  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
    clearUnread(chat._id);
    // Always close sidebar on mobile when chat is selected
    if (window.innerWidth < 1024) {
      // lg breakpoint
      onClose?.();
    }
  };

  if (error) {
    return (
      <Card className="h-full flex flex-col">
        <div className="flex items-center justify-center h-full p-4 sm:p-8 text-red-500">
          <div className="text-center">
            <h3 className="text-base sm:text-lg font-medium mb-2">
              Failed to load chats
            </h3>
            <p className="text-sm">Please try refreshing the page</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!user) return null; 


  return (
    <Card className="h-full flex flex-col py-0">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Chats</h2>
          <div className="flex items-center gap-2">
            <GroupChatModal>
              <Button size="sm" className="text-xs sm:text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">New Group</span>
                <span className="sm:hidden">New</span>
              </Button>
            </GroupChatModal>
            {/* Close button for mobile */}
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 sm:h-10 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full p-4 sm:p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading chats...</p>
            </div>
          </div>
        ) : filteredChats && filteredChats.length > 0 ? (
          <div className="divide-y">
            {filteredChats.map((chat: any) => {
              const isSelected = selectedChat?._id === chat?._id;
              const chatName = chat.isGroupChat
                ? chat.chatName
                : getSender(user, chat.users);
              const otherUser = !chat.isGroupChat
                ? chat.users.find((u: any) => u._id !== user?._id)
                : null;
              const unread = unreadCounts[chat._id] || 0;

              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`p-3 sm:p-4 cursor-pointer transition-colors hover:bg-secondary ${
                    isSelected &&
                    "bg-secondary border border-r-4 border-r-blue-500"
                  }`}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="relative flex-shrink-0">
                      {chat.isGroupChat ? (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted border rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                        </div>
                      ) : (
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                          <AvatarImage
                            src={otherUser?.pic || "/placeholder.svg"}
                            alt={chatName}
                          />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm">
                            {chatName[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {/* Online indicator for individual chats */}
                      {!chat.isGroupChat && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}

                      {/* Unread badge */}
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-bold border border-white">
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-semibold truncate text-sm sm:text-base ${
                            isSelected
                              ? "text-accent-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {chatName}
                        </h3>
                        {chat.latestMessage && (
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {formatTime(chat.latestMessage.createdAt)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          {chat.latestMessage ? (
                            <>
                              {chat.latestMessage.sender._id === user?._id
                                ? "You: "
                                : ""}
                              {chat.latestMessage.content}
                            </>
                          ) : chat.isGroupChat ? (
                            `${chat.users.length} members`
                          ) : (
                            "Start a conversation"
                          )}
                        </p>

                        {/* Unread indicator */}
                        {chat.unreadCount > 0 && (
                          <Badge
                            variant="destructive"
                            className="ml-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                          </Badge>
                        )}
                      </div>

                      {/* Group chat members preview */}
                      {chat.isGroupChat && (
                        <div className="flex items-center mt-1 sm:mt-2 space-x-1">
                          <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-500 truncate">
                            {chat.users
                              .slice(0, 3)
                              .map((u: any) => u.name)
                              .join(", ")}
                            {chat.users.length > 3 &&
                              ` +${chat.users.length - 3} more`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8 text-gray-500">
            {searchTerm ? (
              <>
                <Search className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">
                  No chats found
                </h3>
                <p className="text-center text-gray-500 text-sm">
                  No chats match your search term "{searchTerm}"
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-medium mb-2">
                  No chats yet
                </h3>
                <p className="text-center mb-4 text-sm px-4">
                  Start a conversation by searching for users or create a group
                  chat
                </p>
                <GroupChatModal>
                  <Button variant="secondary" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group Chat
                  </Button>
                </GroupChatModal>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MyChats;
