import React, { useState } from 'react';
import { LogIn } from 'lucide-react';

export default function LoginForm({ onLogin, employees }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'kango@fenix.com' && password === 'admin123') {
      onLogin({ id: 0, name: 'Admin', email: 'kango@fenix.com' }, true);
      return;
    }

    const employee = employees.find(emp => emp.email === email && emp.password === password);
    if (employee) {
      onLogin(employee, false);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
                      <div className="mb-6">
              <img src="/logo.png" alt="FENIX Logo" className="mx-auto w-48 h-24 object-contain" />
            </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">FENIX</h1>
          <p className="text-gray-600">Construction Tracker</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Login
          </button>
        </div>
      </div>
    </div>
  );
} 