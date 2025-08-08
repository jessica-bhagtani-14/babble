import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL + '/api/user';

export const updateProfile = async ({ pic, token }: { pic: string; token: string }) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pic }),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

export function useUpdateProfileMutation({ onSuccess, onError }: any = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },
  });
} 