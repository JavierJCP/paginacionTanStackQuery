import { useEffect, useMemo, useRef, useState } from 'react';
import { SortBy, User } from './interface/interface.d';
import UsersList from './components/UsersList';

import './App.css';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [showColors, setShowColors] = useState(false);
  const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
  const originalUsers = useRef<User[]>([]);
  // useRef -> para guardar un valor
  // que queremos que se comparta entre renderizados
  // pero que al cambiar, no vuelve a renderizar el componente
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

  const handleReset = () => {
    setUsers(originalUsers.current);
  };

  const handleDelete = (email: string) => {
    const filteredUsers = users.filter((user) => user.email !== email);
    setUsers(filteredUsers);
  };

  const handleChangeSort = (sort: SortBy) => {
    setSorting(sort);
  };

  useEffect(() => {
    fetch('https://randomuser.me/api/?results=100')
      .then((res) => res.json())
      .then((res) => {
        setUsers(res.results);
        originalUsers.current = res.results;
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredUsers = useMemo(() => {
    // console.log('render on filter');
    return filterCountry != null && filterCountry.length > 0
      ? users.filter((user) => {
          return user.location.country
            .toLowerCase()
            .includes(filterCountry.toLowerCase());
        })
      : users;
  }, [users, filterCountry]);

  const sortedUsers = useMemo(() => {
    // console.log('render on sort');
    // return sorting === SortBy.COUNTRY
    //   ? filteredUsers.toSorted((a, b) => {
    //       return a.location.country.localeCompare(b.location.country);
    //     })
    //   : filteredUsers;'

    // if (sorting === SortBy.NONE) return filteredUsers;
    // if (sorting === SortBy.COUNTRY) {
    //   return filteredUsers.toSorted((a, b) =>
    //     a.location.country.localeCompare(b.location.country)
    //   );
    // }
    // if (sorting === SortBy.NAME) {
    //   return filteredUsers.toSorted((a, b) =>
    //     a.name.first.localeCompare(b.name.first)
    //   );
    // }
    // if (sorting === SortBy.LAST) {
    //   return filteredUsers.toSorted((a, b) =>
    //     a.name.last.localeCompare(b.name.last)
    //   );
    // }

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

  // const sortedUsers = sortByCountry
  //   ? filteredUsers.toSorted((a, b) => {
  //       return a.location.country.localeCompare(b.location.country);
  //     })
  //   : filteredUsers;

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

      <main>
        <UsersList
          changeSorting={handleChangeSort}
          deleteUser={handleDelete}
          showColors={showColors}
          users={sortedUsers}
        />
      </main>
    </div>
  );
}

export default App;
