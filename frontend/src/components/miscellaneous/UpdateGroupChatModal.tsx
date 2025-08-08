/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { Search, Settings, X, Crown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import UserListItem from "../../pages/userAvatar/UserListItem";
import { useSearchUsersQuery } from "../../api/chat";
import { useChatStore } from "../../state/chatStore";
import { useUserStore } from "../../state/userStore";
import {
  useRenameGroupMutation,
  useAddUserMutation,
  useRemoveUserMutation,
} from "@/api/groupChat";

interface UserBadgeItemProps {
  user: any;
  admin: string;
  handleFunction: () => void;
}

const UserBadgeItem = ({ user, admin, handleFunction }: UserBadgeItemProps) => (
  <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
    {admin === user._id && <Crown className="w-3 h-3 text-yellow-600" />}
    <span>{user.name}</span>
    <button
      onClick={handleFunction}
      className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
);

interface UpdateGroupChatModalProps {
  fetchMessages: () => void;
  fetchAgain: boolean;
  setFetchAgain: (value: boolean) => void;
  children?: React.ReactNode;
}

const UpdateGroupChatModal = ({
  fetchMessages,
  setFetchAgain,
  children,
}: UpdateGroupChatModalProps) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");

  const user = useUserStore((s) => s.user);
  const { selectedChat, setSelectedChat } = useChatStore();


  const { data: searchResult = [], isLoading } = useSearchUsersQuery(search);

  const renameGroupMutation = useRenameGroupMutation({ setSelectedChat, setFetchAgain, toast });
  const addUserMutation = useAddUserMutation({ setSelectedChat, setFetchAgain, toast });
  const removeUserMutation = useRemoveUserMutation({ setSelectedChat, setFetchAgain, fetchMessages, toast, userId: user?._id });

  const handleAddUser = (user1: any) => {
    if (selectedChat?.users.find((u: any) => u._id === user1._id)) {
      toast.error("User already in group!");
      return;
    }
    if (selectedChat?.groupAdmin._id !== user?._id) {
      toast.error("Only admins can add someone!");
      return;
    }
    if (!selectedChat?._id || !user?.token) return;
    addUserMutation.mutate({
      chatId: selectedChat._id,
      userId: user1._id,
      token: user.token,
    });
  };

  const handleRemove = (user1: any) => {
    if (selectedChat?.groupAdmin._id !== user?._id && user1._id !== user?._id) {
      toast.error("Only admins can remove someone!");
      return;
    }
    if (!selectedChat?._id || !user?.token) return;
    removeUserMutation.mutate({
      chatId: selectedChat._id,
      userId: user1._id,
      token: user.token,
    });
  };

  const handleRename = () => {
    if (!groupChatName.trim()) {
      toast.warning("Please enter a group name");
      return;
    }
    if (!selectedChat?._id || !user?.token) return;
    renameGroupMutation.mutate({
      chatId: selectedChat._id,
      chatName: groupChatName,
      token: user.token,
    });
  };

  if (!selectedChat) return null;

  return (
    <>
      {children ? (
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-gray-100"
        >
          <Settings className="w-5 h-5" />
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Group Settings</DialogTitle>
          </DialogHeader>

          <div className="typography space-y-6 py-4">
            <div className="space-y-2">
              <p>Group Name</p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter new group name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size={"sm"}
                  onClick={handleRename}
                  disabled={renameGroupMutation.isPending}
                >
                  {renameGroupMutation.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <p>Members ({selectedChat.users.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedChat.users.map((u: any) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin._id}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3>Add Members</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users to add"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResult?.slice(0, 4).map((user: any) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateGroupChatModal;
