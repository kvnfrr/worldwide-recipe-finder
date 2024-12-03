// RecipeList.js
import React, { useEffect, useState, useRef } from 'react';

const RecipeList = ({ selectedCountry, recipe, onClose }) => {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const isVisible = selectedCountry !== null || recipe !== null;

  useEffect(() => {
    if (selectedCountry) {
      const fetchRecipes = async () => {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch('/api/recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: selectedCountry }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch recipes');
          }

          const data = await response.json();

          setRecipes(data.recipes);
        } catch (err) {
          setError(err.message || 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchRecipes();
    }
  }, [selectedCountry]);

  const handleFoodClick = (food) => {
    setSelectedFood(food);
  };

  const handleBackToList = () => {
    setSelectedFood(null);
  };

  return (
    <div className={`recipe-modal ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="recipe-modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        {loading && <p>Loading recipes...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && selectedFood && (
          <>
            <button className="back-button" onClick={handleBackToList}>
              &larr; Back to list
            </button>
            <h2>{selectedFood.name}</h2>
            <p><strong>Description:</strong> {selectedFood.description}</p>
            <p><strong>Cooking Time:</strong> {selectedFood.cooking_time}</p>
            <h3>Ingredients:</h3>
            <ul className="ingredients-list">
              {selectedFood.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3>Steps:</h3>
            <ol className="steps-list">
              {selectedFood.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </>
        )}
        {!loading && !error && !selectedFood && recipes && (
          <>
            <h2>Foods from {selectedCountry}</h2>
            <ul className="food-list">
              {recipes.map((item, index) => (
                <li
                  key={index}
                  className="food-item"
                  onClick={() => handleFoodClick(item)}
                >
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        {!loading && !error && !selectedFood && recipe && (
          <>
            <h2>{recipe.name}</h2>
            <p><strong>Description:</strong> {recipe.description}</p>
            <p><strong>Cooking Time:</strong> {recipe.cooking_time}</p>
            <h3>Ingredients:</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3>Steps:</h3>
            <ol className="steps-list">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
