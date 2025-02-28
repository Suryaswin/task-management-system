import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import App from './App';

function AppRouter() {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route path="/tasks" element={<App token={token} setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;