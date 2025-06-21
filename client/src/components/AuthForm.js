import { useState } from 'react';
import './AuthForm.css';

export default function AuthForm({ onAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    // Basic validation
    if (!username || !password) {
      setLoading(false);
      return setError('Username and password are required');
    }

    if (isSignup) {
      if (!email.includes('@')) {
        setLoading(false);
        return setError('Please enter a valid email');
      }
      if (password !== confirmPassword) {
        setLoading(false);
        return setError('Passwords do not match');
      }
      if (!firstName || !lastName) {
        setLoading(false);
        return setError('Please enter your full name');
      }
    }

    const endpoint = isSignup ? '/signup' : '/login';
    const payload = {
      username,
      password,
      ...(isSignup && { email, firstName, lastName })
    };

    try {
      const res = await fetch(`http://localhost:5000/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        if (onAuth) {
          onAuth(data.token); // Success callback
        } else {
          console.warn("onAuth callback not provided");
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Server error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>{isSignup ? 'Create Your Account' : 'Welcome Back'}</h2>

      {error && <p className="error">{error}</p>}

      {isSignup && (
        <>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </>
      )}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      {isSignup && (
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
      )}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
      </button>

      <p className="toggle" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account? Login' : 'New here? Create an account'}
      </p>
    </div>
  );
}
