import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/register' : '/login';
      const res = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
      if (!isRegister) {
        localStorage.setItem('token', res.data.token);
        onLogin();
      } else {
        alert('Registered! Now login.');
        setIsRegister(false);
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="block mb-2 p-2 border w-full" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="block mb-2 p-2 border w-full" required />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">{isRegister ? 'Register' : 'Login'}</button>
      <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-blue-500 mt-2">{isRegister ? 'Switch to Login' : 'Switch to Register'}</button>
    </form>
  );
};

export default Login;