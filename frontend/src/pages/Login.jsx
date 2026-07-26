import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registerMode, setRegisterMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = registerMode ? 'http://localhost:3000/api/users/register' : 'http://localhost:3000/api/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || (registerMode ? 'No se pudo registrar el usuario' : 'No se pudo iniciar sesión'));
      }

      if (registerMode) {
        const loginResponse = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });

        const loginData = await loginResponse.json().catch(() => ({}));

        if (!loginResponse.ok) {
          throw new Error(loginData.message || 'No se pudo iniciar sesión después del registro');
        }

        localStorage.setItem('token', loginData.token);
        localStorage.setItem('user', JSON.stringify(loginData.user));
        navigate(from, { replace: true });
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Error en el servidor');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card-body p-4 p-md-5">
          <h2 className="card-title text-center mb-3">{registerMode ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
          <p className="text-muted text-center mb-4">{registerMode ? 'Registra un nuevo usuario con rol cliente' : 'Accede al panel de GeStore'}</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error ? <div className="alert alert-danger py-2">{error}</div> : null}

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (registerMode ? 'Creando...' : 'Ingresando...') : (registerMode ? 'Registrar' : 'Ingresar')}
            </button>

            <button type="button" className="btn btn-link w-100 mt-2" onClick={() => setRegisterMode(!registerMode)}>
              {registerMode ? 'Ya tengo cuenta' : 'Crear una cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;