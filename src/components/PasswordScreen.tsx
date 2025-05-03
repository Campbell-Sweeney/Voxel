import { useState } from 'react';
import { config } from '../utils/config';

interface PasswordScreenProps {
  onPasswordCorrect: () => void;
}

export const PasswordScreen = ({ onPasswordCorrect }: PasswordScreenProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === config.password) {
      onPasswordCorrect();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker to-dark flex items-center justify-center p-4">
      <div className="glass-effect p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Voxel</h1>
          <p className="text-gray-400">Enter your access code</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`w-full px-4 py-3 bg-dark/50 border ${
                isFocused ? 'border-accent' : 'border-gray-700'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all duration-300`}
              placeholder="••••••••"
            />
            {isFocused && (
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            )}
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-accent to-blue-600 text-white py-3 rounded-lg hover:opacity-90 transition-opacity duration-300 font-medium shadow-lg shadow-accent/20"
          >
            Access
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Protected by Voxel Security
          </p>
        </div>
      </div>
    </div>
  );
}; 