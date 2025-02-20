'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [businessUnit, setBusinessUnit] = useState('');
  const router = useRouter();

  // Add state for admin login
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLogin = async () => {
    if (!adminUsername) {
      alert('Username is required');
      return;
    }

    try {
      const response = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: adminUsername,
          password: adminPassword
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid admin credentials');
      }

      // Store admin user data
      localStorage.setItem('user', JSON.stringify({
        id: 'admin',
        username: adminUsername,
        businessUnit: 'Admin'
      }));

      // Set admin cookie
      document.cookie = `user=admin; path=/`;

      // Navigate to database page
      router.push('/database');
    } catch (error) {
      alert('Invalid admin credentials');
    }
  };

  const handleLogin = async () => {
    console.log('Attempting to login with:', { username, businessUnit }); // Debug log
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, businessUnit }),
      });

      console.log('Response status:', response.status); // Log response status
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData); // Log error details
        throw new Error('Failed to login');
      }

      const data = await response.json();
      console.log('User logged in:', data);

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data));

      // Set the user cookie
      document.cookie = `user=${data.id}; path=/`;

      // Navigate to events page
      router.push('/events');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Login</h2>

        {showAdminPrompt ? (
          // Admin login form
          <div className="space-y-4">
            <input
              type="text"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="w-full p-2 rounded bg-white/10 text-white text-sm sm:text-base"
              placeholder="Admin Username"
            />
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full p-2 rounded bg-white/10 text-white text-sm sm:text-base"
              placeholder="Admin Password"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdminLogin}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login as Admin
              </button>
              <button
                onClick={() => setShowAdminPrompt(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Regular user login form
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded bg-white/10 text-white text-sm sm:text-base"
              placeholder="Username"
            />
            <input
              type="text"
              value={businessUnit}
              onChange={(e) => setBusinessUnit(e.target.value)}
              className="w-full p-2 rounded bg-white/10 text-white text-sm sm:text-base"
              placeholder="Business Unit"
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => setShowAdminPrompt(true)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Admin Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}