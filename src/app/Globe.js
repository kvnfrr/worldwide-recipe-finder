"use client";
import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent = ({ onCountrySelect, selectedCountry }) => {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]);
  const [hoverD, setHoverD] = useState(null);
  const [selectedD, setSelectedD] = useState(null);

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

  useEffect(() => {
    if (selectedCountry) {
      const selectedPolygon = countries.find(
        (country) => getCountryName(country) === selectedCountry
      );
      setSelectedD(selectedPolygon);
    } else {
      setSelectedD(null);
    }
  }, [selectedCountry, countries]);

  const handleCountryClick = (polygon) => {
    if (polygon) {
      const countryName = getCountryName(polygon);
      if (typeof onCountrySelect === 'function') {
        onCountrySelect(countryName);
      }
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
        backgroundColor="#87CEEB" // Light sky blue
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
        onPolygonClick={(d) => handleCountryClick(d)}
        polygonsTransitionDuration={300}
        controls={{
          enableZoom: true,
          autoRotate: true,
          autoRotateSpeed: 0.2,
        }}
      />
    </div>
  );
};

export default GlobeComponent;
