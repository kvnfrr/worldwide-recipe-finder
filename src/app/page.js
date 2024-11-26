"use client";
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import RecipeList from './RecipeList';

const GlobeComponent = dynamic(() => import('./Globe'), { ssr: false });

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Callback function to update selected country
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Globe Container */}
      <div className="globe-container" style={{ width: '100%', height: '100%' }}>
        <GlobeComponent onCountrySelect={handleCountrySelect} />
      </div>

      {/* Sidebar Menu */}
      <div className="menu" style={{
        width: '400px',
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px',
        position: 'fixed',
        top: '0',
        right: '0',
        height: '100vh',
        overflowY: 'auto',
        borderLeft: '2px solid #444',
        zIndex: 3,
      }}>
        {/* Title */}
        <div style={{ borderBottom: '1px solid #777', paddingBottom: '10px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '1.8rem', textAlign: 'center' }}>• World Recipe Finder •</h1>
        </div>

        {/* Selected Country Details */}
        <h2 style={{ borderBottom: '1px solid #777', paddingBottom: '10px' }}>Selected Country</h2>
        {selectedCountry ? (
          <>
            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>{selectedCountry}</h3>
            <RecipeList selectedCountry={selectedCountry} />
          </>
        ) : (
          <p>No country selected.</p>
        )}
      </div>
    </div>
  );
}
