import React from "react";

export default function Trend1() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-orange-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center animate-fade-in">
        <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1934&auto=format&fit=crop" alt="Festival Culinaire Congolais" className="w-full h-48 object-cover rounded-2xl mb-6 shadow" />
        <span className="inline-block bg-red-500/20 text-red-600 font-semibold px-4 py-1 rounded-full mb-2">Événement</span>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Festival Culinaire Congolais</h1>
        <p className="text-gray-600 mb-4 text-center">Venez vivre une expérience gustative unique et festive, au cœur de Brazzaville, avec les meilleurs chefs et artisans locaux.</p>
        <div className="flex items-center gap-4 mb-6">
          <span className="flex items-center text-gray-500"><svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>28-30 Juin</span>
          <span className="flex items-center text-gray-500"><svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>4 529 vues</span>
        </div>
        <button className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-red-600 transition">Je participe !</button>
      </div>
    </div>
  );
} 