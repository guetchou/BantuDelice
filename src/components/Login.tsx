
import React, { useState } from 'react';
import pb from '../lib/pocketbase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      alert('Connexion réussie !');
      console.log(authData);
    } catch (err: any) {
      console.error('Erreur connexion:', err);
      alert(err.message || 'Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="p-4 space-y-2">
      <h2>Connexion</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}
