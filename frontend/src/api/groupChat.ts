import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL + '/api/chat';

export const renameGroup = async ({ chatId, chatName, token }: { chatId: string; chatName: string; token: string }) => {
  const response = await fetch(`${API_URL}/rename`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId, chatName }),
  });
  if (!response.ok) throw new Error('Failed to rename group');
  return response.json();
};

export const addUserToGroup = async ({ chatId, userId, token }: { chatId: string; userId: string; token: string }) => {
  const response = await fetch(`${API_URL}/groupadd`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId, userId }),
  });
  if (!response.ok) throw new Error("Failed to add user");
  return response.json();
};

export const removeUserFromGroup = async ({ chatId, userId, token }: { chatId: string; userId: string; token: string }) => {
  const response = await fetch(`${API_URL}/groupremove`, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ chatId, userId }),
  });
  if (!response.ok) throw new Error("Failed to remove user");
  return response.json();
};

export const createGroupChat = async ({ groupChatName, selectedUsers, token }: { groupChatName: string; selectedUsers: any[]; token: string }) => {
  const response = await fetch(`${API_URL}/group`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: groupChatName,
      users: JSON.stringify(selectedUsers.map((u) => u._id)),
    }),
  });
  if (!response.ok) throw new Error('Failed to create group chat');
  return response.json();
};

export function useRenameGroupMutation({ setSelectedChat, setFetchAgain, toast }: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renameGroup,
    onSuccess: (data) => {
      setSelectedChat(data);
      setFetchAgain((prev: boolean) => !prev);
      toast.success('Group name updated successfully');
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Rename failed');
    },
  });
}

export function useAddUserMutation({ setSelectedChat, setFetchAgain, toast }: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUserToGroup,
    onSuccess: (data) => {
      setSelectedChat(data);
      setFetchAgain((prev: boolean) => !prev);
      toast.success("User added successfully");
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Add user failed");
    },
  });
}

export function useRemoveUserMutation({ setSelectedChat, setFetchAgain, fetchMessages, toast, userId }: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeUserFromGroup,
    onSuccess: (data, variables) => {
      if (variables.userId === userId) {
        setSelectedChat(null);
      } else {
        setSelectedChat(data);
      }
      setFetchAgain((prev: boolean) => !prev);
      fetchMessages();
      toast.success(
        variables.userId === userId
          ? "Left group successfully"
          : "User removed successfully"
      );
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Remove user failed");
    },
  });
}

export function useCreateGroupChatMutation({ onSuccess, onError }: any = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGroupChat,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });
} 