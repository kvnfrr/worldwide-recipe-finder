// RecipeList.js
import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const RecipeList = ({ selectedCountry, onClose, clickPosition }) => {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [animateModal, setAnimateModal] = useState(false);

  const pdfRef = useRef();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ country: selectedCountry }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch recipes');
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setRecipes(data.recipes);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCountry]);

  useEffect(() => {
    setAnimateModal(true);
  }, []);

  const handleSaveAsPDF = async () => {
    const input = pdfRef.current;

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      } else {
        let position = 0;
        while (position < pdfHeight) {
          pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, pdfHeight);
          position += pdf.internal.pageSize.getHeight();
          if (position < pdfHeight) {
            pdf.addPage();
          }
        }
      }

      pdf.save(`${selectedFood.name}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleFoodClick = (food) => {
    setSelectedFood(food);
  };

  const handleBackToList = () => {
    setSelectedFood(null);
  };

  return (
    <div
      className={`recipe-modal ${animateModal ? 'animate' : ''}`}
      onAnimationEnd={() => {
        setAnimateModal(false);
      }}
    >
      <div
        className="recipe-modal-content"
        style={{
          transformOrigin: `${clickPosition.x}px ${clickPosition.y}px`,
        }}
      >
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        {loading && <p>Loading recipes...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && !selectedFood && recipes && (
          <>
            <h2>Foods from {selectedCountry}</h2>
            <ul className="food-list">
              {recipes.map((recipe, index) => (
                <li
                  key={index}
                  className="food-item"
                  onClick={() => handleFoodClick(recipe)}
                >
                  <h3>{recipe.name}</h3>
                  <p>{recipe.description}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        {!loading && !error && selectedFood && (
          <>
            <button className="back-button" onClick={handleBackToList}>
              &larr; Back to list
            </button>
            <button
              className="save-pdf-button"
              onClick={handleSaveAsPDF}
              disabled={!selectedFood}
            >
              Save as PDF
            </button>
            <div ref={pdfRef} className="pdf-content">
              <h2>{selectedFood.name}</h2>
              <p>
                <strong>Description:</strong> {selectedFood.description}
              </p>
              <p>
                <strong>Cooking Time:</strong> {selectedFood.cooking_time}
              </p>
              <h3>Ingredients:</h3>
              <ul className="ingredients-list">
                {selectedFood.ingredients.map((ingredient, idx) => (
                  <li key={idx}>{ingredient}</li>
                ))}
              </ul>
              <h3>Steps:</h3>
              <ol className="steps-list">
                {selectedFood.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
