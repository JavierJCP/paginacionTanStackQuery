import { useMemo, useState } from 'react';
import { SortBy, User } from './interface/interface.d';
import UsersList from './components/UsersList';

import './App.css';
import { useUsers } from './hooks/useUsers';
import NumeroUsuarios from './components/NumeroUsuarios';

// const fetchUsers = (currentPage: number) => {
//   return fetch(
//     `https://randomuser.me/api/?results=10&seed=javier&page=${currentPage}`
//   )
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(res.statusText);
//       }
//       return res.json();
//     })
//     .then((res) => res.results);
// };
// const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
//   return await fetch(
//     `https://randomuser.me/api/?results=10&seed=javier&page=${pageParam}`
//   )
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error(res.statusText);
//       }
//       return res.json();
//     })
//     .then((res) => {
//       // const nextCursor = Number(res.info.page) + 1;
//       const currentPage = Number(res.info.page);
//       const nextCursor = currentPage > 3 ? undefined : currentPage + 1;
//       return {
//         users: res.results,
//         nextCursor,
//       };
//     });
// };

function App() {
  // const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } =
  //   useInfiniteQuery<{ nextCursor?: number; users: User[] }>(
  //     ['users'], // -> es la key de la informacion o de la query
  //     fetchUsers,
  //     {
  //       getNextPageParam: (lastPage) => lastPage.nextCursor,
  //     }
  //   ); // -> como traer la informacion

  // const [users, setUsers] = useState<User[]>([]);
  // const users: User[] = data?.pages?.[0].users ?? [];
  // const users: User[] = data?.pages?.flatMap((page) => page.users) ?? [];
  const { isLoading, isError, users, refetch, fetchNextPage, hasNextPage } =
    useUsers();
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);

  // const [currentPage, setCurrentPage] = useState(1);

  // const originalUsers = useRef<User[]>([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  const [filterCountry, setFilterCountry] = useState<string | null>(null);
  const toggleColors = () => {
    setShowColors(!showColors);
  };

  const toogleSortByCountry = () => {
    const newSortingValue =
      sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE;
    // setSortByCountry((prevState) => !prevState);
    setSorting(newSortingValue);
  };

  const handleReset = async () => {
    // setUsers(originalUsers.current);
    await refetch();
  };

  const handleDelete = (email: string) => {
    // const filteredUsers = users.filter((user) => user.email !== email);
    // setUsers(filteredUsers);
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  // useEffect(() => {
  // setLoading(true);
  // setError(null);

  // fetch(
  //   `https://randomuser.me/api/?results=10&seed=javier&page=${currentPage}`
  // )
  //   .then((res) => {
  //     if (!res.ok) {
  //       throw new Error(res.statusText);
  //     }
  //     return res.json();
  //   })

  //   fetchUsers(currentPage)
  //     .then((users) => {
  //       setUsers((prevUsers) => {
  //         const newUsers = prevUsers.concat(users);
  //         originalUsers.current = newUsers;
  //         return newUsers;
  //       });
  //     })
  //     .catch((err) => {
  //       setError(err.message);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [currentPage]);

  const filteredUsers = useMemo(() => {
    return filterCountry != null && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    if (sorting === SortBy.NONE) return filteredUsers;

    const compareProperties: Record<string, (user: User) => string> = {
      [SortBy.COUNTRY]: (user) => user.location.country,
      [SortBy.NAME]: (user) => user.name.first,
      [SortBy.LAST]: (user) => user.name.last,
    };

    return filteredUsers.toSorted((a, b) => {
      const extractProperty = compareProperties[sorting];
      return extractProperty(a).localeCompare(extractProperty(b));
    });
  }, [filteredUsers, sorting]);

  return (
    <div className='App'>
      <header>
        <h1 className='title'>Random User</h1>
        <button onClick={toggleColors}>Colorear Filas</button>
        <button onClick={toogleSortByCountry}>
          {sorting === SortBy.COUNTRY
            ? 'No ordenar por país'
            : 'Ordenar por país'}
        </button>
        <button onClick={handleReset}>Resetear estado</button>
        <input
          type='text'
          placeholder='filtra por país'
          onChange={(e) => setFilterCountry(e.target.value)}
        />
      </header>
      <NumeroUsuarios />
      <main>
        {users.length > 0 && (
          <UsersList
            changeSorting={handleChangeSort}
            deleteUser={handleDelete}
            showColors={showColors}
            users={sortedUsers}
          />
        )}
        {isLoading && <strong>Cargando...</strong>}
        {isError && <p>Ha habido un error</p>}
        {!isLoading && users.length === 0 && <p>No hay ususarios</p>}

        {!isLoading && !isError && hasNextPage && (
          // <button onClick={() => setCurrentPage(currentPage + 1)}>
          //   Cargar más resultados
          // </button>
          <button
            onClick={() => {
              void fetchNextPage();
            }}
          >
            Cargar más resultados
          </button>
        )}
        {!isLoading && !isError && !hasNextPage && <p>No hay mas resultados</p>}
      </main>
    </div>
  );
}

export default App;
