import React from "react";

export default function Trend3() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-yellow-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center animate-fade-in">
        <img src="/images/taxi-bzv.jpg" alt="Programme de fidélité taxi" className="w-full h-48 object-cover rounded-2xl mb-6 shadow" />
        <span className="inline-block bg-green-500/20 text-green-700 font-semibold px-4 py-1 rounded-full mb-2">Service</span>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Programme de fidélité taxi</h1>
        <p className="text-gray-600 mb-4 text-center">Accumulez des points à chaque course et profitez de trajets gratuits, d’offres exclusives et d’avantages réservés à nos membres fidèles.</p>
        <div className="flex items-center gap-4 mb-6">
          <span className="flex items-center text-gray-500"><svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>2 976 vues</span>
        </div>
        <button className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-green-700 transition">Profiter du programme</button>
      </div>
    </div>
  );
} 