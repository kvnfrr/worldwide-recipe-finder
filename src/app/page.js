"use client";
import dynamic from 'next/dynamic';

const GlobeComponent = dynamic(() => import('./Globe'), { ssr: false });

export default function HomePage() {
  return (
    <div className="container">
      <h1 className="title">• World Recipe Finder •</h1>
      <div className="search-bar-container">
        <span className="search-bar-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Search for a country or recipe..." 
          className="search-bar"
        />
      </div>

      <div className="globe-container">
        <GlobeComponent />
      </div>
    </div>
  );
}
