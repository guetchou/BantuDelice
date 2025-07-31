import React from 'react';

export default function SimpleIndex() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      color: 'black',
      minHeight: '100vh'
    }}>
      <h1>Buntudelice - Page d'accueil simplifiée</h1>
      <p>Cette page est une version simplifiée pour tester le rendu.</p>
      <p>Si vous voyez cette page, le problème n'est pas dans React Router.</p>
      <p>Timestamp: {new Date().toLocaleString()}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Liens de test :</h2>
        <ul>
          <li><a href="/test" style={{ color: 'blue' }}>Page de test simple</a></li>
          <li><a href="/order" style={{ color: 'blue' }}>Page de commande</a></li>
        </ul>
      </div>
    </div>
  );
} 