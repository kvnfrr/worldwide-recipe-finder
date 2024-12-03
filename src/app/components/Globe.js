// Globe.js
"use client";
import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';
import RecipeList from './RecipeList';

const GlobeComponent = () => {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]);
  const [hoverD, setHoverD] = useState(null);
  const [selectedD, setSelectedD] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000);

      fetch('/countries.geojson')
        .then((res) => res.json())
        .then((countriesData) => {
          setCountries(countriesData.features);
        });
    }
  }, []);

  const handleCountryClick = (polygon, event) => {
    if (polygon) {
      const countryName = getCountryName(polygon);
      setSelectedCountry(countryName);
      setSelectedD(polygon);
      setClickPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const getCountryName = (polygon) => {
    if (polygon && polygon.properties) {
      const properties = polygon.properties;
      return (
        properties.ADMIN ||
        properties.NAME ||
        properties.sovereignt ||
        properties.iso_a3 ||
        "Unknown Country"
      );
    }
    return "Unknown Country";
  };

  return (
    <div style={{ flex: 1, position: 'relative', width: '100%' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundColor="#1a1a1a" // Set your desired background color
        showAtmosphere={true}
        atmosphereColor="rgba(135, 206, 235, 0.5)" // Soft blue atmosphere
        atmosphereAltitude={0.25}
        polygonsData={countries}
        polygonAltitude={(d) => (d === hoverD || d === selectedD ? 0.06 : 0.01)}
        polygonCapColor={(d) =>
          d === selectedD
            ? 'rgba(255, 140, 0, 0.8)' // Dark orange for selected
            : d === hoverD
            ? 'rgba(255, 215, 0, 0.6)' // Gold on hover
            : 'rgba(60, 179, 113, 0.7)' // Medium sea green for others
        }
        polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
        polygonStrokeColor={(d) => (d === selectedD ? '#FF8C00' : '#333')}
        polygonLabel={(polygon) => getCountryName(polygon)}
        onPolygonHover={(d) => {
          setHoverD(d);
          if (globeRef.current) {
            globeRef.current.controls().autoRotate = !d;
            globeRef.current.controls().autoRotateSpeed = d ? 0 : 0.1;
          }
        }}
        onPolygonClick={(d, event) => handleCountryClick(d, event)}
        polygonsTransitionDuration={300}
        controls={{
          enableZoom: true,
          autoRotate: true,
          autoRotateSpeed: 0.2,
        }}
      />
      {selectedCountry && (
        <RecipeList
          selectedCountry={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          clickPosition={clickPosition}
        />
      )}
    </div>
  );
};

export default GlobeComponent;
