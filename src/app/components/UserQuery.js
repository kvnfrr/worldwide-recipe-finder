// /app/components/UserQuery.js
import React, { useState } from 'react';

const UserQuery = ({ onRecipeFetch }) => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userInput }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || 'Failed to fetch recipe';
        throw new Error(errorMessage);
      }

      const data = await response.json().catch(() => {
        throw new Error('Invalid JSON response from server');
      });

      onRecipeFetch(data.recipe);
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-query-container">
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="What do you feel like eating?"
          value={userInput}
          onChange={handleInputChange}
          className="user-query-input"
        />
        <button type="submit" className="user-query-button" disabled={loading}>
          {loading ? 'Searching...' : 'Find Recipe'}
        </button>
      </form>
      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
};

export default UserQuery;
