/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Separator } from "../ui/separator";
import UserListItem from "../../pages/userAvatar/UserListItem";
import { useSearchUsersQuery, useCreateChatMutation } from "../../api/chat";
import { useChatStore } from "../../state/chatStore";
import { Button } from "../ui/button";

function SearchBar() {
  const [search, setSearch] = useState("");
  const { setSelectedChat } = useChatStore();

  const {
    data: searchResult = [],
    isLoading,
    refetch: handleSearch,
  } = useSearchUsersQuery(search);
  const createChatMutation = useCreateChatMutation();

  const accessChat = async (userId: string) => {
    try {
      const data = await createChatMutation.mutateAsync(userId);
      setSelectedChat(data);
      toast.success("Chat opened successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching the chat");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      handleSearch();
    }
  };

  const onSearch = () => {
    handleSearch();
  };

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (open && !search.trim()) {
            handleSearch();
          }
        }}
      >
        <DialogTrigger className="flex items-center space-x-2 cursor-pointer select-none">
          {/* <Button variant="ghost" className="flex items-center space-x-2"> */}
          <Search className="w-5 h-5" />
          <span className="hidden sm:inline">
            Search your friends, groups, and more
          </span>
          {/* </Button> */}
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="w-full max-w-md sm:max-w-lg typography"
        >
          <div className="space-y-6">
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button
              size={"sm"}
                onClick={onSearch}
                disabled={isLoading}
                className="px-6 hover:shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
            <Separator />
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="loading-dots">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    <p className="text-sm">Searching users...</p>
                  </div>
                </div>
              ) : searchResult.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground font-medium">
                    Found {searchResult.length} user
                    {searchResult.length !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-2">
                    {searchResult.map((user: any, index: number) => (
                      <div
                        key={user._id}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <UserListItem
                          user={user}
                          handleFunction={() => accessChat(user._id)}
                        />
                      </div>
                    ))}
                  </div>
                </>
              ) : search && !isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 animate-fade-in-up">
                  <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    No users found
                  </h3>
                  <p className="text-center text-sm">
                    Try searching with a different term
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400 animate-fade-in-up">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start searching
                  </h3>
                  <p className="text-center text-sm">
                    Type a name or email to find users
                  </p>
                </div>
              )}
              {createChatMutation.isPending && (
                <div className="flex items-center justify-center py-6 animate-fade-in-up">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Opening chat...
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SearchBar;
