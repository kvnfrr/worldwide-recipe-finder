"use client";
import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeComponent = ({ onCountrySelect }) => {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]); // State to hold the countries GeoJSON data

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
      return properties.ADMIN || properties.NAME || properties.sovereignt || properties.iso_a3 || "Unknown Country";
    }
    return "Unknown Country";
  };

  return (
    <div style={{ flex: 1, position: 'relative', width: '100%' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0, 0, 0, 0)"
        polygonsData={countries}
        polygonCapColor={() => 'rgba(0, 255, 0, 0.2)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
        polygonStrokeColor={() => '#ffffff'}
        polygonLabel={(polygon) => getCountryName(polygon)}
        onPolygonClick={(polygon) => handleCountryClick(polygon)}
        onPolygonHover={(polygon) => {
          if (globeRef.current) {
            globeRef.current.controls().autoRotate = !polygon;
            globeRef.current.controls().autoRotateSpeed = polygon ? 0 : 0.1;
          }
        }}
        controls={{
          enableZoom: false,
          autoRotate: true,
          autoRotateSpeed: 0.2,
        }}
      />
    </div>
  );
};

export default GlobeComponent;
