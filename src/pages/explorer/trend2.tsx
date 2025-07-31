import React from "react";

export default function Trend2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center animate-fade-in">
        <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2940&auto=format&fit=crop" alt="Nouveau restaurant: La Savane" className="w-full h-48 object-cover rounded-2xl mb-6 shadow" />
        <span className="inline-block bg-yellow-500/20 text-yellow-700 font-semibold px-4 py-1 rounded-full mb-2">Restaurant</span>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Nouveau restaurant: La Savane</h1>
        <p className="text-gray-600 mb-4 text-center">Plongez dans une ambiance chaleureuse et découvrez une cuisine afro-européenne créative, à deux pas du centre-ville.</p>
        <div className="flex items-center gap-4 mb-6">
          <span className="flex items-center text-yellow-600 font-bold"><svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" /></svg>4.8</span>
          <span className="flex items-center text-gray-500"><svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>3 218 vues</span>
        </div>
        <button className="bg-yellow-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-yellow-600 transition">Découvrir le restaurant</button>
      </div>
    </div>
  );
} 