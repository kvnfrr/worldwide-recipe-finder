"use client";
import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent = ({ onCountrySelect, selectedCountry }) => {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]); // State to hold the countries GeoJSON data
  const [selectedCountryPolygon, setSelectedCountryPolygon] = useState(null); // Track selected polygon

  useEffect(() => {
    if (globeRef.current) {
      // Set an initial point of view to show all countries
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 3.0 }, 1000);

      // Fetch GeoJSON data for countries and set state
      fetch('/countries.geojson')
        .then((res) => res.json())
        .then((countriesData) => {
          setCountries(countriesData.features);
        });
    }
  }, []);

  // Highlight the country when selected through search
  useEffect(() => {
    if (selectedCountry && countries.length > 0) {
      const matchedCountry = countries.find((country) => {
        const name = getCountryName(country);
        return name.toLowerCase() === selectedCountry.toLowerCase();
      });

      if (matchedCountry) {
        setSelectedCountryPolygon(matchedCountry);
        globeRef.current.pointOfView({ lat: matchedCountry.properties.LAT, lng: matchedCountry.properties.LONG, altitude: 1.5 }, 1000);
      }
    }
  }, [selectedCountry, countries]);

  // Function to handle click on a country
  const handleCountryClick = (polygon) => {
    if (polygon) {
      setSelectedCountryPolygon(polygon); // Set the clicked country in the state
      const countryName = getCountryName(polygon);

      // Notify the parent component of the selected country name
      if (typeof onCountrySelect === 'function') {
        onCountrySelect(countryName);
      }
    }
  };

  // Helper function to get the country name from the polygon properties
  const getCountryName = (polygon) => {
    if (polygon && polygon.properties) {
      const properties = polygon.properties;

      // Try different properties that might contain the country name
      return (
        properties.ADMIN || // Administrative name (most common)
        properties.NAME ||  // Common name
        properties.name_long || // Long name if available
        properties.sovereignt || // Sovereign entity name
        properties.iso_a3 || // Country code as a last fallback
        "Unknown Country"
      );
    }
    return "Unknown Country";
  };

  return (
    <div style={{ flex: 1, position: 'relative', width: '100%' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0, 0, 0, 0)" // Transparent background
        polygonsData={countries} // Set the country polygons
        polygonCapColor={(polygon) => {
          // Highlight only the selected country
          if (selectedCountryPolygon && polygon === selectedCountryPolygon) {
            return 'rgba(255, 165, 0, 0.8)'; // Distinct orange color for the selected country
          }
          return 'rgba(0, 255, 0, 0.2)'; // Faded green for others
        }}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'} // Light black for side color
        polygonStrokeColor={(polygon) => {
          if (selectedCountryPolygon && polygon === selectedCountryPolygon) {
            return '#FF8C00'; // Bright border for the selected country
          }
          return '#ffffff'; // White borders for non-selected countries
        }}
        polygonLabel={(polygon) => getCountryName(polygon)} // Display country name as a label
        onPolygonClick={(polygon) => handleCountryClick(polygon)}
        onPolygonHover={(polygon) => {
          if (globeRef.current) {
            globeRef.current.controls().autoRotate = !polygon;
            globeRef.current.controls().autoRotateSpeed = polygon ? 0 : 0.1; // Stop rotation on hover
          }
        }}
        controls={{
          enableZoom: false, // Prevent zoom in/out
          autoRotate: true, // Auto rotate when idle
          autoRotateSpeed: 0.2, // Slow auto rotation
        }}
      />
    </div>
  );
};

export default GlobeComponent;
