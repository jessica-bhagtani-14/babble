/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Bell, ChevronDown, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import ProfileModal from "../miscellaneous/ProfileModal";
import { useUserStore } from "../../state/userStore";
import { useChatStore } from "../../state/chatStore";
import SearchBar from "../miscellaneous/SearchBar";
import { BgChanger } from "./BgChanger";

interface NotificationBadgeProps {
  count: number;
}

function NotificationBadge({ count }: NotificationBadgeProps) {
  if (!count) return null;

  return (
    <Badge
      variant="destructive"
      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-medium notification-badge animate-pulse-glow"
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}

export const Navbar = () => {
  const { user, setUser } = useUserStore();
  const { notification, setNotification, setSelectedChat } = useChatStore();

  const handleNotificationClick = (notif: any) => {
    setSelectedChat(notif.chat);
    setNotification(notification.filter((n) => n !== notif));
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    window.location.href = "/";
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setUser(updatedUser);
  };

  return (
    <div className="flex items-center justify-between typography md:px-6 py-4 shadow-lg bg-card md:bg-background backdrop-blur-3xl select-none">
      <div className="flex w-20 h-8">
        <img src="/bg-frames/Frame4.svg" alt="logo" className="w-full h-full" />
        {/* <img
          src="/logo-2.svg"
          alt="logo"
          className="w-full h-full dark:invert"
        /> */}
      </div>
      <SearchBar/>

      <div className="flex items-center md:space-x-3">
      <BgChanger/>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="w-5 h-5" />
              <NotificationBadge count={notification.length} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="font-semibold mb-2 px-2">Notifications</div>
            {notification.length === 0 ? (
              <div className="text-muted-foreground text-sm px-2 pb-2">
                No new notifications
              </div>
            ) : (
              notification.map((notif, idx) => (
                <DropdownMenuItem
                  key={idx}
                  className="cursor-pointer hover:bg-accent rounded px-2 py-1 text-sm whitespace-normal"
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div>
                    {notif.chat.isGroupChat
                      ? `New message in ${notif.chat.chatName}`
                      : `New message from ${notif.sender?.name || "User"}`}
                    <div className="text-xs text-gray-400 mt-0.5">
                      {notif.content?.slice(0, 40)}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-white/20 dark:hover:bg-slate-800/50 p-2 transition-all duration-300 hover:scale-105 focus-ring"
            >
              <Avatar className="w-9 h-9 ring-2 ring-white/50 dark:ring-slate-700/50">
                <AvatarImage
                  src={user?.pic || "/placeholder.svg"}
                  alt={user?.name}
                  className="w-full h-full object-cover object-top"
                />
                <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 glass border-white/20 dark:border-slate-700/50 animate-scale-in"
          >
            <div className="flex items-center space-x-3 p-3">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={user?.pic || "/placeholder.svg"}
                  alt={user?.name}
                  className="w-full h-full object-contain object-top"
                />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-gray-900 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400 truncate max-w-32">
                  {user?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-white/20 dark:bg-slate-700/50" />

            {user && (
              <ProfileModal
                user={user}
                onProfileUpdate={handleProfileUpdate}
                isOwnProfile={true}
              >
                {/* <DropdownMenuItem className="cursor-pointer hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem> */}
              </ProfileModal>
            )}

            {/* <DropdownMenuItem className="cursor-pointer hover:bg-white/20 dark:hover:bg-slate-800/50 transition-colors">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem> */}
            <DropdownMenuSeparator className="bg-white/20 dark:bg-slate-700/50" />
            <DropdownMenuItem
              onClick={logoutHandler}
              className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
