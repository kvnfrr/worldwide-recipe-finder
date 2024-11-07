export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      
      {/* Page Title */}
      <h1 style={{ fontSize: '2.5rem'}}>• World Recipe Finder •</h1>
      
      {/* Search Bar Container */}
      <div style={{ 
        display: 'flex',
        alignItems: 'center', 
        backgroundColor: '#2c2c2c', 
        borderRadius: '25px', 
        padding: '5px 15px',
        width: 'fit-content',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
      }}>
        {/* Magnifying Glass Icon */}
        <span style={{
          color: 'white', 
          fontSize: '1.5rem', 
          marginRight: '10px',
        }}>
          🔍
        </span>

        {/* Search Bar */}
        <input 
          type="text" 
          placeholder="Search for a country or recipe..." 
          style={{ 
            width: '300px',
            padding: '10px', 
            fontSize: '1rem', 
            borderRadius: '5px', 
            border: 'none', 
            outline: 'none',
            color: '#ECE9DB',
          }} 
        />
      </div>
      
      {/* Globe Placeholder */}
      <div 
        style={{ 
          width: '400px', 
          height: '400px', 
          backgroundColor: '#333', 
          borderRadius: '50%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          color: '#ccc',
          fontSize: '1.2rem',
          textAlign: 'center',
          marginTop: '20vh'
        }}
      >
        Globe Placeholder
      </div>
      
    </div>
  );
}
