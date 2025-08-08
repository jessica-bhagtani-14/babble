import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../state/userStore';

const API_URL = import.meta.env.VITE_API_URL + '/api/message';

export const fetchMessagesApi = async ({ chatId, token }: { chatId: string; token: string }) => {
  const { data } = await axios.get(`${API_URL}/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const sendMessageApi = async ({ content, chatId, token }: { content: string; chatId: string; token: string }) => {
  const { data } = await axios.post(
    API_URL,
    { content, chatId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const useMessagesQuery = (chatId: string) => {
  const user = useUserStore((s) => s.user);
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => {
      if (!user?.token) {
        return Promise.reject(new Error('User token is missing'));
      }
      return fetchMessagesApi({ chatId, token: user.token });
    },
    enabled: !!chatId && !!user?.token,
  });
};

export const useSendMessageMutation = (chatId: string) => {
  const user = useUserStore((s) => s.user);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => {
      if (!user || !user.token) {
        return Promise.reject(new Error('User token is missing'));
      }
      return sendMessageApi({ content, chatId, token: user.token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });
}; 