import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// project-imports
import { fetcher, fetcherPost } from 'utils/axios';

// types
import { ChatHistory } from 'types/chat';
import { UserProfile } from 'types/user-profile';

// ==============================|| API - CHAT ||============================== //

const endpoints = {
  key: '/api/chat',
  list: '/users',
  update: '/filter'
};

const localFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

const localFetcherPost = async (args: string | [string, Record<string, any>]) => {
  const [url, body] = Array.isArray(args) ? args : [args, {}];
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

export function useGetUsers() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, localFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      users: data?.users as UserProfile[],
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.users?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUserChat(userName: string) {
  const URL = [endpoints.key + endpoints.update, { user: userName, endpoints: 'chat' }];

  const { data, isLoading, error, isValidating } = useSWR(URL, localFetcherPost, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      chat: (data as ChatHistory[]) || [],
      chatLoading: isLoading,
      chatError: error,
      chatValidating: isValidating,
      chatEmpty: !isLoading && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function insertChat(userName: string, newChat: ChatHistory) {
  const URL = [endpoints.key + endpoints.update, { user: userName, endpoints: 'chat' }];

  // to update local state based on key
  mutate(
    URL,
    (currentChat: any) => {
      const addedChat: ChatHistory[] = [...currentChat, newChat];
      return addedChat;
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  // const data = { chat: newChat };
  // await axios.post(endpoints.key + endpoints.update, data);
}
