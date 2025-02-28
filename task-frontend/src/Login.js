import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(response => {
        if (!response.ok) throw new Error('Invalid credentials');
        return response.text();
      })
      .then(data => {
        setToken(data);
        navigate('/tasks');
      })
      .catch(error => setError(error.message));
  };

  return (
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={() => navigate('/signup')}>Sign Up</button>
    </div>
  );
}

export default Login;