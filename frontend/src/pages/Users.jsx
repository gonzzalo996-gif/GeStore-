import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ id: null, username: '', password: '', role: 'cliente' });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  function loadUsers() {
    fetch('http://localhost:3000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('No autorizado');
        const data = await response.json();
        setUsers(data);
      })
      .catch(() => {
        setError('No tienes permisos para ver esta sección');
      });
  }

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.role !== 'admin') {
      navigate('/dashboard', { replace: true });
      return;
    }

    loadUsers();
  }, [token, navigate]);

  async function saveUser(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `http://localhost:3000/api/users/${form.id}` : 'http://localhost:3000/api/users';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          role: form.role
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'No se pudo guardar');
      setShowModal(false);
      setForm({ id: null, username: '', password: '', role: 'cliente' });
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id) {
    if (!window.confirm('¿Deseas eliminar este usuario?')) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'No se pudo eliminar');
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error al eliminar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="h3 mb-1">Gestión de usuarios</h2>
            <p className="text-muted mb-0">CRUD con tabla y modal para crear, editar y eliminar usuarios.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard')}>Volver al dashboard</button>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Nuevo usuario</button>
          </div>
        </div>

        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.role || 'cliente'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => {
                          setForm({ id: user.id, username: user.username, password: '', role: user.role || 'cliente' });
                          setShowModal(true);
                        }}
                      >
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteUser(user.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal ? (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{form.id ? 'Editar usuario' : 'Crear usuario'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={saveUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                      className="form-control"
                      value={form.username}
                      onChange={(event) => setForm({ ...form, username: event.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      className="form-control"
                      type="password"
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                      required={!form.id}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select
                      className="form-select"
                      value={form.role}
                      onChange={(event) => setForm({ ...form, role: event.target.value })}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Users;
