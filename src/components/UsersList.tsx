import { SortBy, User } from '../interface/interface.d';

interface Props {
  users: User[];
  showColors: boolean;
  deleteUser: (email: string) => void;
  changeSorting: (sorting: SortBy) => void;
}

function UsersList({ users, showColors, deleteUser, changeSorting }: Props) {
  return (
    <table width='100%'>
      <thead>
        <tr>
          <th>Foto</th>
          <th onClick={() => changeSorting(SortBy.NAME)}>Nombre</th>
          <th onClick={() => changeSorting(SortBy.LAST)}>Apellido</th>
          <th onClick={() => changeSorting(SortBy.COUNTRY)}>País</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody className={showColors ? 'table-showColors' : 'table'}>
        {users?.map((user) => {
          return (
            <tr key={user.email}>
              <td>
                <img src={user.picture.thumbnail} alt={user.name.first} />
              </td>
              <td>{user.name.first}</td>
              <td>{user.name.last}</td>
              <td>{user.location.country}</td>
              <td>
                <button onClick={() => deleteUser(user.email)}>Borrar</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default UsersList;
