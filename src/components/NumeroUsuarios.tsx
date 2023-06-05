import { useUsers } from '../hooks/useUsers';

function NumeroUsuarios() {
  const { users } = useUsers();
  return <div>NumeroUsuarios: {users?.length}</div>;
}

export default NumeroUsuarios;
