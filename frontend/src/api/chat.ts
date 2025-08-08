import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../state/userStore';

const API_URL = import.meta.env.VITE_API_URL + '/api/chat';
const USER_API_URL = import.meta.env.VITE_API_URL + '/api/user';

export const fetchChatsApi = async (token: string) => {
  const { data } = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createChatApi = async ({ userId, token }: { userId: string; token: string }) => {
  const { data } = await axios.post(
    API_URL,
    { userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const searchUsersApi = async ({ search, token }: { search: string; token: string }) => {
  const { data } = await axios.get(`${USER_API_URL}?search=${search}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const useChatsQuery = () => {
  const user = useUserStore((s) => s.user);
  return useQuery({
    queryKey: ['chats'],
    queryFn: () => {
      if (!user || !user.token) {
        throw new Error('User is not authenticated');
      }
      return fetchChatsApi(user.token);
    },
    enabled: !!user?.token,
  });
};

export const useCreateChatMutation = () => {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => {
      if (!user || !user.token) {
        throw new Error('User is not authenticated');
      }
      return createChatApi({ userId, token: user.token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });
};

export const useSearchUsersQuery = (search: string) => {
  const user = useUserStore((s) => s.user);
  return useQuery({
    queryKey: ['search-users', search],
    queryFn: () => {
      if (!user || !user.token) {
        throw new Error('User is not authenticated');
      }
      return searchUsersApi({ search, token: user.token });
    },
    enabled: !!search && !!user?.token,
  });
}; 