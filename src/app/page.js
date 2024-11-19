"use client";
import dynamic from 'next/dynamic';
import React, { useState } from 'react';

const GlobeComponent = dynamic(() => import('./Globe'), { ssr: false });

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Callback function to update selected country
  const handleCountrySelect = (country) => {
    console.log("Country selected in HomePage:", country); // Debugging to confirm the function works
    setSelectedCountry(country);
  };

  return (
    <div className="container" style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
      <div className="globe-container" style={{ flex: 1, position: 'relative' }}>
        {/* Globe Component */}
        <GlobeComponent onCountrySelect={handleCountrySelect} />
      </div>

      {/* Sidebar Menu */}
      <div className="menu" style={{
        width: '300px',
        backgroundColor: '#333',
        color: '#fff',
        padding: '20px',
        position: 'fixed',
        top: '0',
        right: '0',
        height: '100vh',
        overflowY: 'auto',
        borderLeft: '2px solid #444',
        zIndex: 2,
      }}>
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
