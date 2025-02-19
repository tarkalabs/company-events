'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    businessUnit: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed. Please try again.');
      }

      const userData = await response.json();
      document.cookie = `user=${JSON.stringify(userData)}; path=/`;
      localStorage.setItem('user', JSON.stringify(userData));
      router.push('/events');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-600 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Member Login</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <div>
            <div className="relative">
              <input
                id="username"
                type="text"
                required
                className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-colors placeholder-gray-500 text-black"
                placeholder="User Name"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                id="businessUnit"
                type="text"
                required
                className="w-full px-4 py-3 text-lg border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-colors placeholder-gray-500 text-black"
                placeholder="Business Unit"
                value={formData.businessUnit}
                onChange={(e) => setFormData(prev => ({ ...prev, businessUnit: e.target.value }))}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-full text-lg font-semibold hover:opacity-90 transition-opacity transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
}