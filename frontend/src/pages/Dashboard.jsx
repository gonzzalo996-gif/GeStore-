import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.role === 'admin' || storedUser?.role === 'user') {
      setUser(storedUser);
    }

    fetch('http://localhost:3000/api/login/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Sesión inválida');
        }

        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setError('Tu sesión expiró o no es válida.');
        navigate('/login', { replace: true });
      });
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-vh-100 bg-light p-4">
      <div className="container">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="h3 mb-1">Bienvenido al panel</h1>
                <p className="text-muted mb-0">Tu sesión está protegida con JWT.</p>
              </div>
              <div className="d-flex gap-2">
                {user?.role === 'admin' ? (
                  <button className="btn btn-outline-primary" onClick={() => navigate('/users')}>Gestionar usuarios</button>
                ) : null}
                <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            </div>

            {error ? <div className="alert alert-warning">{error}</div> : null}

            {user ? (
              <>
                <div className="alert alert-success mb-4">
                  Sesión activa para <strong>{user.username}</strong>.
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title">Estado de acceso</h5>
                        <p className="card-text text-muted mb-0">Tu sesión está protegida con JWT y solo se permite el acceso a áreas autorizadas.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title">Rol actual</h5>
                        <p className="card-text text-muted mb-0">{user.role || 'user'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title">Acciones rápidas</h5>
                        <p className="card-text text-muted mb-0">Puedes administrar usuarios si tu rol es administrador.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-muted">Cargando información...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;