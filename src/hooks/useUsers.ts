import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUsers } from '../services/users';
import { User } from '../interface/interface.d';

export function useUsers() {
  const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } =
    useInfiniteQuery<{ nextCursor?: number; users: User[] }>(
      ['users'], // -> es la key de la informacion o de la query
      fetchUsers,
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
      }
    );

  return {
    isError,
    isLoading,
    users: data?.pages?.flatMap((page) => page.users) ?? [],
    refetch,
    fetchNextPage,
    hasNextPage,
  };
}
