"use client";
import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent = () => {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]); // State to hold the countries GeoJSON data
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (globeRef.current) {
      // Center and zoom out the globe to see all countries
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 3.0 }, 1000); // Adjusted altitude for better initial view

      // Fetch the GeoJSON data for countries
      fetch('/countries.geojson')
        .then((res) => res.json())
        .then((countriesData) => {
          setCountries(countriesData.features); // Set the country data in state
        });
    }
  }, []);

  // Function to handle click on a country
  const handleCountryClick = (polygon) => {
    if (polygon) {
      console.log("Clicked country properties:", polygon.properties); // Debugging to see available properties
      setSelectedCountry(polygon); // Set the clicked country polygon in state
    }
  };

  // Helper function to get the country name using multiple properties in a priority order
  const getCountryName = (polygon) => {
    if (polygon && polygon.properties) {
      const properties = polygon.properties;

      // Try different properties that might contain the country name
      const name = properties.admin || // Administrative name (most common)
                   properties.name_long || // Long name if available
                   properties.name || // Short common name
                   properties.sovereignt || // Sovereign entity name
                   properties.iso_a3 || // Country code as a last fallback
                   "Unknown Country";

      if (name === "Unknown Country") {
        console.warn("Country with unknown name:", properties); // Log for debugging if the name is still unknown
      }

      return name;
    }
    return "Unknown Country";
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Globe Container */}
      <div style={{ flex: 2, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0, 0, 0, 0)" // Set a valid transparent color for background
          polygonsData={countries} // Pass the countries data to the globe
          polygonCapColor={(polygon) => {
            if (selectedCountry && selectedCountry === polygon) {
              return 'rgba(255, 165, 0, 0.8)'; // Distinct orange color for selected country
            }
            return 'rgba(0, 255, 0, 0.2)'; // Faded green for others
          }}
          polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'} // Light black for side color
          polygonStrokeColor={(polygon) => {
            if (selectedCountry && selectedCountry === polygon) {
              return '#FF8C00'; // Bright border for the selected country
            }
            return '#ffffff'; // White borders for non-selected countries
          }}
          polygonLabel={(polygon) => getCountryName(polygon)} // Use the new property for labeling
          onPolygonClick={(polygon) => handleCountryClick(polygon)}
          onPolygonHover={(polygon) => {
            if (globeRef.current) {
              globeRef.current.controls().autoRotate = !polygon;
              globeRef.current.controls().autoRotateSpeed = polygon ? 0 : 0.1; // Stop rotation on hover
            }
          }}
          controls={{ 
            enableZoom: false, // Prevent zooming in or out
            autoRotate: true, // Enable auto rotation when not hovering over a country
            autoRotateSpeed: 0.2 // Slow down the auto rotation speed for better user experience
          }}
        />
      </div>

      {/* Sidebar Menu */}
      <div style={{
        width: '400px',
        backgroundColor: '#333',
        color: '#fff',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        height: '100vh'
      }}>
        <h2>Selected Country</h2>
        {selectedCountry ? (
          <>
            <h3>{getCountryName(selectedCountry)}</h3>
            <div className="recipes">
              <p>Recipes will be displayed here...</p>
            </div>
          </>
        ) : (
          <p>No country selected.</p>
        )}
      </div>
    </div>
  );
};

export default GlobeComponent;
