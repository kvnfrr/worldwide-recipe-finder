import React, { useEffect, useState } from 'react';
import recipesData from './recipes.json'; // Import the recipes JSON file

const RecipeList = ({ selectedCountry }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes for the selected country from the JSON file
    if (selectedCountry && recipesData[selectedCountry]) {
      setRecipes(recipesData[selectedCountry]);
    } else {
      setRecipes([]);
    }
  }, [selectedCountry]);

  return (
    <div>
      <h2>Recipes from {selectedCountry}</h2>
      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe, index) => (
            <li key={index}>
              <h3>{recipe.name}</h3>
              <p>{recipe.description}</p>
              <a href={recipe.link} target="_blank" rel="noopener noreferrer">View Recipe</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes available for this country.</p>
      )}
    </div>
  );
};

export default RecipeList;
