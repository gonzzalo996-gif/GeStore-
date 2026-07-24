import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleUsernameChange(event) {
    setUsername(event.target.value)
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value)
  }

  async function handleSubmit(event) {
    event.preventDefault()

  // Enviar información del formulario al backend

  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const status = response.status;
  if (status === 200) {
    alert('Inicio de sesión exitoso');
  } else if (status === 401) {
    alert('Nombre de usuario o contraseña incorrectos');
  } else {
    alert('Error en el servidor');
  }
}

  return (
    <>
      <form action="" method="post" onSubmit={handleSubmit}>
        <input type="text" name="username" id="username" placeholder="Ingresa tu nombre" value={username} 
        onChange={handleUsernameChange} />
        <input type="password" name="password" id="password" placeholder="Ingresa tu contraseña" value={password} 
        onChange={handlePasswordChange} />
        <button type="submit">Ingresar</button>
      </form>
    </>
  )
}

export default App
