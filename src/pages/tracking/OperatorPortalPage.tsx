import React, { useState } from 'react';
import TrackingScanUpdate from '@/components/tracking/TrackingScanUpdate';

export default function OperatorPortalPage() {
  const [step, setStep] = useState(1);
  // MVP : simple navigation entre création de compte et gestion de colis
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">Portail Opérateur Privé (MVP)</h1>
      <div className="mb-4 flex gap-4">
        <button className={`px-4 py-2 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setStep(1)}>Créer un compte</button>
        <button className={`px-4 py-2 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`} onClick={() => setStep(2)}>Gérer mes colis</button>
      </div>
      {step === 1 && (
        <div className="w-full max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Créer un compte opérateur</h2>
          <form className="space-y-4">
            <input className="border rounded px-2 py-1 w-full" placeholder="Nom de l'opérateur" required />
            <input className="border rounded px-2 py-1 w-full" placeholder="Email" type="email" required />
            <input className="border rounded px-2 py-1 w-full" placeholder="Mot de passe" type="password" required />
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">Créer mon compte</button>
          </form>
        </div>
      )}
      {step === 2 && (
        <div className="w-full max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Gérer mes colis</h2>
          {/* MVP : réutilise le composant de scan/mise à jour */}
          <TrackingScanUpdate />
        </div>
      )}
    </div>
  );
} 