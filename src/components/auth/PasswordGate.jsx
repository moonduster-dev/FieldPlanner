import { useState } from 'react';

const CORRECT_PASSWORD = 'nick2026';
const AUTH_KEY = 'fieldPlanner_authenticated';

/**
 * Password gate component
 * Requires users to enter correct password to access the app
 */
const PasswordGate = ({ children }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if already authenticated this session
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // If authenticated, show the app
  if (isAuthenticated) {
    return children;
  }

  // Show password screen
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-800 to-green-900">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Field Planner</h1>
          <p className="text-gray-500 text-sm mt-1">Enter password to continue</p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                text-center text-lg"
              autoFocus
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-medium rounded-lg
              hover:bg-green-700 transition-colors focus:outline-none focus:ring-2
              focus:ring-green-500 focus:ring-offset-2"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordGate;
