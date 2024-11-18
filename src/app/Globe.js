"use client";
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Globe from 'three-globe';

const GlobeComponent = () => {
  const globeRef = useRef();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const hoveredCountryRef = useRef(null);

  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    globeRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 250;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const globe = new Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .polygonsData([]) // Placeholder for country polygons
      .polygonCapColor((polygon) => (polygon === hoveredCountryRef.current ? 'rgba(0, 255, 0, 0.5)' : 'rgba(0, 255, 0, 0.2)'))
      .polygonSideColor(() => 'rgba(255, 255, 255, 0.1)')
      .polygonStrokeColor(() => '#111');

    scene.add(globe);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.rotateSpeed = 0.4;
    controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isAnimating = false;

    // Mouse move handler to show pointer on hover
    const onMouseMove = (event) => {
      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(() => {
          isAnimating = false;
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

          raycaster.setFromCamera(mouse, camera);
          const intersects = raycaster.intersectObjects(globe.children, true);

          if (intersects.length > 0) {
            const polygon = intersects[0].object;
            if (hoveredCountryRef.current !== polygon) {
              hoveredCountryRef.current = polygon;
              renderer.domElement.style.cursor = 'pointer';
            }
          } else {
            hoveredCountryRef.current = null;
            renderer.domElement.style.cursor = '';
          }
        });
      }
    };

    // Click handler to show popup near the clicked country
    const onClick = (event) => {
      if (hoveredCountryRef.current && hoveredCountryRef.current.properties) {
        const countryName = hoveredCountryRef.current.properties.ADMIN;
        setSelectedCountry(countryName);
    
        // Calculate 2D screen position of the clicked point
        const { x, y } = calculatePopupPosition(hoveredCountryRef.current, camera);
        setPopupPosition({ x, y });
      }
    };
    

    // Helper function to calculate the screen position for popup
    const calculatePopupPosition = (country, camera) => {
      const countryCenter = new THREE.Vector3().setFromMatrixPosition(country.matrixWorld);
      countryCenter.project(camera);

      const x = (countryCenter.x * 0.5 + 0.5) * window.innerWidth;
      const y = -(countryCenter.y * 0.5 - 0.5) * window.innerHeight;
      return { x, y };
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Fetch and load country polygons from GeoJSON in the public folder
    fetch('/countries.geojson')
      .then(res => res.json())
      .then(countries => {
        globe.polygonsData(countries.features); // Add country polygons to the globe
      });

    return () => {
      renderer.dispose();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      if (globeRef.current) {
        globeRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={globeRef} style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {selectedCountry && (
        <div
          className="popup"
          style={{
            position: 'absolute',
            top: popupPosition.y,
            left: popupPosition.x,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '10px',
            borderRadius: '8px',
            transform: 'translate(-50%, -100%)', // Center above the clicked point
            zIndex: 2,
          }}
        >
          <h2>{selectedCountry}</h2>
          <p>Recipes will be displayed here...</p>
          <button onClick={() => setSelectedCountry(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
