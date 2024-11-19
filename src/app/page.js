"use client";
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

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

        {/* Search Bar */}
        <div className="search-bar-container" style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#2c2c2c',
          borderRadius: '25px',
          padding: '10px',
          width: 'calc(100% - 20px)', // Adjusted width to give some left margin
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          marginLeft: '10px' // Added margin to the left to center better
        }}>
          <span style={{ color: 'white', fontSize: '1.5rem', marginRight: '10px' }}>🔍</span>
          <input
            type="text"
            placeholder="Search for a country or recipe..."
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              borderRadius: '5px',
              border: 'none',
              outline: 'none',
              color: '#ECE9DB',
              backgroundColor: '#1a1a1a'
            }}
          />
        </div>

        {/* Selected Country Details */}
        <h2 style={{ borderBottom: '1px solid #777', paddingBottom: '10px' }}>Selected Country</h2>
        {selectedCountry ? (
          <>
            <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>{selectedCountry}</h3>
            <div className="recipes" style={{ marginTop: '20px' }}>
              <p>Recipes will be displayed here...</p>
            </div>
          </>
        ) : (
          <p>No country selected.</p>
        )}
      </div>
    </div>
  );
}
