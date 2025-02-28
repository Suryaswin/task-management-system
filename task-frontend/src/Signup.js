import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Signup({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.text())
      .then(data => {
        if (data === "User created successfully") {
          fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          })
            .then(response => response.text())
            .then(token => {
              setToken(token);
              navigate('/tasks');
            })
            .catch(error => setError('Login failed: ' + error.message));
        } else {
          setError(data);
        }
      })
      .catch(error => setError('Signup failed: ' + error.message));
  };

  return (
    <div className="App">
      <h1>Sign Up</h1>
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
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={() => navigate('/')}>Back to Login</button>
    </div>
  );
}

export default Signup;