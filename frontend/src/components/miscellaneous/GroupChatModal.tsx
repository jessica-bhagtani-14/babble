/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { Users, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import UserListItem from "../../pages/userAvatar/UserListItem";
import { useSearchUsersQuery } from "../../api/chat";
import { useUserStore } from "../../state/userStore";
import { useCreateGroupChatMutation } from "@/api/groupChat";

interface UserBadgeItemProps {
  user: any;
  handleFunction: () => void;
}

const UserBadgeItem = ({ user, handleFunction }: UserBadgeItemProps) => (
  <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm">
    <span>{user.name}</span>
    <button
      onClick={handleFunction}
      className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5 transition-colors"
    >
      <X className="w-3 h-3" />
    </button>
  </div>
);

interface GroupChatModalProps {
  children: React.ReactNode;
}

const GroupChatModal = ({ children }: GroupChatModalProps) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const user = useUserStore((s) => s.user);

  // Use the new API hook
  const { data: searchResult = [], isLoading } = useSearchUsersQuery(search);

  const handleGroup = (userToAdd: any) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) {
      toast.warning("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    toast.success(`${userToAdd.name} added to group`);
  };

  const handleDelete = (delUser: any) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const createGroupMutation = useCreateGroupChatMutation({
    onSuccess: () => {
      setOpen(false);
      toast.success('Group chat created successfully!');
      setGroupChatName('');
      setSelectedUsers([]);
      setSearch('');
    },
    onError: (error: { message: any; }) => {
      toast.error(error.message || 'Failed to create group chat');
    },
  });

  const handleSubmit = async () => {
    if (!groupChatName.trim()) {
      toast.warning("Please enter a group name");
      return;
    }
    if (selectedUsers.length < 2) {
      toast.warning("Please select at least 2 users for a group chat");
      return;
    }
    try {
      createGroupMutation.mutate({ groupChatName, selectedUsers, token: user?.token ?? "" });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create group chat"
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-2xl">
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="font-open-sans font-semibold">Create Group Chat</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4 typography">
            {/* Group Name Input */}
            <div className="space-y-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                placeholder="Enter group name..."
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="h-11"
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label htmlFor="group-name">Add Members</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-11"
                />
              </div>

              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Selected Members ({selectedUsers.length})
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUsers([])}
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {selectedUsers.map((u) => (
                      <UserBadgeItem
                        key={u._id}
                        user={u}
                        handleFunction={() => handleDelete(u)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-gray-500">
                        Searching users...
                      </p>
                    </div>
                  </div>
                ) : searchResult.length > 0 ? (
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    <p className="mb-2">
                      Found {searchResult.length} user
                      {searchResult.length !== 1 ? "s" : ""}
                    </p>
                    {searchResult.slice(0, 6).map((user: any) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))}
                    {searchResult.length > 6 && (
                      <p className="text-xs text-center py-2">
                        Showing first 6 results. Refine your search for more
                        specific results.
                      </p>
                    )}
                  </div>
                ) : search && !isLoading ? (
                  <Card className="flex flex-col items-center justify-center py-8">
                    <Search className="w-12 h-12 mb-2" />
                    <p className="text-sm">No users found</p>
                    <p className="text-xs">
                      Try searching with a different term
                    </p>
                  </Card>
                ) : (
                  <Card className="flex flex-col items-center justify-center py-8">
                    <Users className="w-12 h-12 mb-2" />
                    <p className="text-sm">
                      Search for users to add to your group
                    </p>
                    <p className="text-xs">
                      Type a name or email to get started
                    </p>
                  </Card>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!groupChatName.trim() || selectedUsers.length < 2}
              >
                Create Group
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupChatModal;
