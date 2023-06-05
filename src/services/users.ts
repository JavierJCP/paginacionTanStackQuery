export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
  return await fetch(
    `https://randomuser.me/api/?results=10&seed=javier&page=${pageParam}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res) => {
      // const nextCursor = Number(res.info.page) + 1;
      const currentPage = Number(res.info.page);
      const nextCursor = currentPage > 3 ? undefined : currentPage + 1;
      return {
        users: res.results,
        nextCursor,
      };
    });
};
