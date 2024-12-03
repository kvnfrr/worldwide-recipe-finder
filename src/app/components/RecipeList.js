// RecipeList.js
import React from 'react';

const RecipeList = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="recipe-modal">
      <div className="recipe-modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>{recipe.name}</h2>
        <p>
          <strong>Country of Origin:</strong> {recipe.country}
        </p>
        <p>
          <strong>Description:</strong> {recipe.description}
        </p>
        <p>
          <strong>Cooking Time:</strong> {recipe.cooking_time}
        </p>
        <h3>Ingredients:</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ingredient, idx) => (
            <li key={idx}>{ingredient}</li>
          ))}
        </ul>
        <h3>Steps:</h3>
        <ol className="steps-list">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeList;
