
import React, { useState } from 'react';
import pb from '../lib/pocketbase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const user = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
      });
      alert('Utilisateur inscrit avec succès !');
      console.log(user);
    } catch (err: any) {
      console.error('Erreur inscription:', err);
      alert(err.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="p-4 space-y-2">
      <h2>Inscription</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>S'inscrire</button>
    </div>
  );
}
