// page.js
"use client";
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import RecipeList from './RecipeList';

const GlobeComponent = dynamic(() => import('./Globe'), { ssr: false });

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isGlobeLoading, setIsGlobeLoading] = useState(true);
  const [showGlobe, setShowGlobe] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const handleModalClose = () => {
    setSelectedCountry(null);
  };

  const handleBeginClick = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowGlobe(true);
    }, 500); // Duration matches the CSS animation duration
  };

  // Simulate globe loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGlobeLoading(false);
    }, 2000); // Simulate a 2-second loading time
    return () => clearTimeout(timer);
  }, []);

  // Loading Screen Component
  const LoadingScreen = () => (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <h1 className="loading-title">World Wide Recipe Finder</h1>
      {!isGlobeLoading && (
        <button className="begin-button" onClick={handleBeginClick}>
          Begin
        </button>
      )}
    </div>
  );

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {!showGlobe && <LoadingScreen />}
      {showGlobe && (
        <>
          {/* Globe Container */}
          <div className="globe-container" style={{ width: '100%', height: '100%' }}>
            <GlobeComponent onCountrySelect={handleCountrySelect} selectedCountry={selectedCountry} />
          </div>

          {/* Recipe Modal */}
          {selectedCountry && (
            <RecipeList selectedCountry={selectedCountry} onClose={handleModalClose} />
          )}
        </>
      )}
    </div>
  );
}
