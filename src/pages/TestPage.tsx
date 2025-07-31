import React from 'react';

export default function TestPage() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'white', 
      color: 'black',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1>Test Page - Buntudelice</h1>
      <p>Si vous voyez cette page, React fonctionne correctement.</p>
      <p>Timestamp: {new Date().toLocaleString()}</p>
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => alert('Test button works!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#00C49A',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
} 