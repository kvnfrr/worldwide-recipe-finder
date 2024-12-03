import React, { useEffect, useState } from 'react';

const RecipeList = ({ selectedCountry, onClose }) => {
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    // Placeholder for AI-generated recipes
    // In the future, replace this with an API call to your AI service
    setTimeout(() => {
      setRecipes([
        { name: 'Recipe 1', description: 'Delicious traditional dish.' },
        { name: 'Recipe 2', description: 'A must-try specialty.' },
        { name: 'Recipe 3', description: 'A local favorite.' },
      ]);
    }, 1000); // Simulate loading time
  }, [selectedCountry]);

  return (
    <div className="recipe-modal">
      <div className="recipe-modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Recipes from {selectedCountry}</h2>
        {recipes ? (
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>
                <h3>{recipe.name}</h3>
                <p>{recipe.description}</p>
                {/* Placeholder for recipe link or details */}
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading recipes...</p>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
