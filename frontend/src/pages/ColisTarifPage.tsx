import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { calculerTarifColis, exporterColisPDF, exporterColisCSV } from "@/services/colisService";
import { Send, Copy, Plus, Trash2, MapPin, Sparkles, Star, Share2, Layers, Download, Globe2 } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "/images/logo/logo.png";

const MOCK_DHL = 6000;
const MOCK_CHRONOPOST = 5000;
const defaultColis = { from: "", to: "", weight: "", dimensions: "" };

const ColisTarifPage: React.FC = () => {
  const [colisList, setColisList] = useState([ { ...defaultColis } ]);
  const [results, setResults] = useState<number[]>([]);
  const [promo, setPromo] = useState("");
  const [shared, setShared] = useState(false);
  const [showMap, setShowMap] = useState<{ idx: number; type: 'from' | 'to' } | null>(null);
  const [geoLoading, setGeoLoading] = useState<number | null>(null);

  React.useEffect(() => {
    (async () => {
      const res = await Promise.all(colisList.map(async c => {
        if (!c.from || !c.to || !c.weight) return 0;
        return await calculerTarifColis({ ...c, weight: parseFloat(c.weight) });
      }));
      setResults(res);
    })();
  }, [colisList]);

  const handleAddColis = () => setColisList(list => [ ...list, { ...defaultColis } ]);
  const handleRemoveColis = (idx: number) => setColisList(list => list.filter((_, i) => i !== idx));

  const handleShare = () => {
    const text = colisList.map((c, i) => `Colis ${i+1}: ${c.from} → ${c.to}, ${c.weight}kg, ${c.dimensions}cm, Tarif: ${results[i] || 0} FCFA`).join("\n");
    navigator.clipboard.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };
  const handleWhatsApp = () => {
    const text = encodeURIComponent(colisList.map((c, i) => `Colis ${i+1}: ${c.from} → ${c.to}, ${c.weight}kg, ${c.dimensions}cm, Tarif: ${results[i] || 0} FCFA`).join("\n"));
    window.open(`https://wa.me/?text=${text}`);
  };

  const handleExportPDF = async () => {
    const blob = await exporterColisPDF();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation_colis.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleExportCSV = () => {
    const csv = exporterColisCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation_colis.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleGeoloc = (idx: number) => {
    setGeoLoading(idx);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setColisList(list => list.map((c, i) => i === idx ? { ...c, from: `Lat:${latitude.toFixed(5)},Lng:${longitude.toFixed(5)}` } : c));
        setGeoLoading(null);
      },
      () => setGeoLoading(null)
    );
  };

  const getPromoDiscount = () => promo === "BANTU10" ? 0.1 : 0;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image + overlay */}
      <div className="fixed inset-0 z-0 animate-fade-in">
        <img src="/images/thedrop24BG.jpg" alt="bg" className="w-full h-full object-cover scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/80 via-orange-100/80 to-yellow-200/90" />
      </div>
      {/* Bouton/logo retour accueil */}
      <Link to="/" className="fixed top-2 left-2 z-20 flex items-center gap-2 bg-white/80 rounded-full shadow px-2 py-1 sm:px-3 sm:py-2 hover:bg-orange-100 transition-all duration-300 animate-fade-in">
        <img src={Logo} alt="Accueil" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full animate-bounce" />
        <span className="font-bold text-orange-700 hidden sm:inline text-base sm:text-lg">Accueil</span>
      </Link>
      {/* Hero section */}
      <section className="flex flex-col items-center justify-center py-8 sm:py-12 px-2 sm:px-4 z-10 animate-slide-down w-full">
        <div className="flex items-center gap-3 mb-2 animate-fade-in-up">
          <Sparkles className="text-orange-400 animate-pulse" size={32} />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-700 drop-shadow text-center">Calculateur de tarif colis</h1>
          <span className="ml-2 bg-gradient-to-r from-orange-400 to-yellow-300 text-white text-xs font-bold px-3 py-1 rounded-full shadow animate-bounce">Nouveau</span>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl text-center mb-4 sm:mb-8 animate-fade-in delay-200">Simulez, partagez et exportez vos tarifs colis en un clin d'œil.<br />Service rapide, transparent, local et fiable.</p>
      </section>
      <main className="flex-1 flex items-center justify-center z-10 w-full">
        <Card className="w-full max-w-lg sm:max-w-xl md:max-w-2xl shadow-2xl border-0 bg-white/70 backdrop-blur-xl animate-fade-in-up mx-2 sm:mx-0 transition-all duration-500 hover:shadow-3xl hover:bg-white/90">
          <CardHeader className="flex flex-row items-center gap-2 animate-fade-in-up">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Star className="text-yellow-400 animate-spin-slow" />
              Calculateur de tarif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full">
              <Button variant="outline" onClick={handleExportCSV} className="flex-1 transition-transform duration-300 hover:scale-110 hover:bg-yellow-100 shadow hover:shadow-lg"><Download className="mr-2 h-4 w-4" />CSV</Button>
              <Button variant="outline" onClick={handleExportPDF} className="flex-1 transition-transform duration-300 hover:scale-110 hover:bg-yellow-100 shadow hover:shadow-lg"><Download className="mr-2 h-4 w-4" />PDF</Button>
            </div>
            <div className="flex flex-col gap-6">
              {colisList.map((colis, idx) => (
                <div key={idx} className="bg-white/80 rounded-xl shadow-lg p-3 sm:p-4 mb-2 relative animate-fade-in-up transition-all duration-500 hover:shadow-2xl hover:bg-white/95 group">
                  <div className="flex flex-col sm:flex-row gap-2 mb-2 items-center w-full">
                    <Input placeholder="Adresse d'envoi" value={colis.from} onChange={e => setColisList(list => list.map((c, i) => i === idx ? { ...c, from: e.target.value } : c))} className="flex-1 min-w-0 transition-all duration-300 focus:ring-2 focus:ring-orange-400 group-hover:ring-2 group-hover:ring-orange-300" />
                    <Button variant="ghost" size="icon" title="Utiliser ma position" onClick={() => handleGeoloc(idx)} disabled={geoLoading === idx} className="hover:bg-orange-100 animate-pulse">
                      <MapPin className={geoLoading === idx ? "animate-pulse text-orange-400" : "text-orange-500"} />
                    </Button>
                    <Input placeholder="Adresse de destination" value={colis.to} onChange={e => setColisList(list => list.map((c, i) => i === idx ? { ...c, to: e.target.value } : c))} className="flex-1 min-w-0 transition-all duration-300 focus:ring-2 focus:ring-orange-400 group-hover:ring-2 group-hover:ring-orange-300" />
                    <Button variant="ghost" size="icon" title="Voir sur la carte" onClick={() => setShowMap({ idx, type: 'from' })} className="hover:bg-blue-100 animate-fade-in"><Globe2 className="text-blue-500" /></Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2 w-full">
                    <Input placeholder="Poids (kg)" value={colis.weight} onChange={e => setColisList(list => list.map((c, i) => i === idx ? { ...c, weight: e.target.value } : c))} className="flex-1 min-w-0 transition-all duration-300 focus:ring-2 focus:ring-orange-400 group-hover:ring-2 group-hover:ring-orange-300" />
                    <Input placeholder="Dimensions (cm)" value={colis.dimensions} onChange={e => setColisList(list => list.map((c, i) => i === idx ? { ...c, dimensions: e.target.value } : c))} className="flex-1 min-w-0 transition-all duration-300 focus:ring-2 focus:ring-orange-400 group-hover:ring-2 group-hover:ring-orange-300" />
                    {colisList.length > 1 && (
                      <Button variant="destructive" size="icon" onClick={() => handleRemoveColis(idx)} className="hover:scale-125 transition-transform animate-fade-in-up"><Trash2 className="h-4 w-4" /></Button>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
                    <span className="text-sm text-gray-500">Tarif estimé :</span>
                    <span className="font-bold text-lg text-orange-600 animate-fade-in group-hover:scale-110 transition-transform">{results[idx] ? Math.round(results[idx] * (1 - getPromoDiscount())) : "-"} FCFA</span>
                    {getPromoDiscount() > 0 && <span className="ml-2 text-green-600 font-semibold animate-fade-in">-10% promo</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Détail : base + poids × 300 FCFA</div>
                </div>
              ))}
              <Button variant="outline" className="flex items-center gap-2 self-start transition-transform duration-300 hover:scale-110 animate-fade-in-up bg-gradient-to-r from-yellow-100 to-orange-100 hover:from-orange-200 hover:to-yellow-200 shadow hover:shadow-lg" onClick={handleAddColis}><Layers className="h-4 w-4" /> Ajouter un colis</Button>
              <div className="flex flex-col sm:flex-row gap-2 items-center mt-2 animate-fade-in-up w-full">
                <Input placeholder="Code promo" value={promo} onChange={e => setPromo(e.target.value)} className="w-full sm:w-40 transition-all duration-300 focus:ring-2 focus:ring-orange-400" />
                <Button variant="outline" onClick={handleShare} className="flex-1 transition-transform duration-300 hover:scale-110 hover:bg-yellow-100 shadow hover:shadow-lg"><Share2 className="h-4 w-4 mr-1" /> Copier le tarif</Button>
                <Button variant="outline" onClick={handleWhatsApp} className="flex-1 transition-transform duration-300 hover:scale-110 hover:bg-yellow-100 shadow hover:shadow-lg"><Send className="h-4 w-4 mr-1" /> WhatsApp</Button>
                {shared && <span className="text-green-600 font-semibold ml-2 animate-fade-in">Copié !</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      {/* Fonctions avancées animées */}
      {showMap && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-[95vw] max-w-2xl h-[60vh] flex flex-col animate-fade-in-up">
            <button className="absolute top-2 right-2 text-gray-500" onClick={() => setShowMap(null)}>✕</button>
            <div className="flex-1 flex items-center justify-center">
              {/* Carte mockée, à remplacer par Mapbox/Leaflet si besoin */}
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center rounded-lg animate-fade-in">
                <span className="text-blue-700 font-bold text-lg">Carte (mock) - {colisList[showMap.idx][showMap.type]}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Animations CSS */}
      <style>{`
        .animate-fade-in { animation: fadeIn 1s both; }
        .animate-fade-in-up { animation: fadeInUp 1s both; }
        .animate-slide-down { animation: slideDown 1.2s both; }
        .animate-spin-slow { animation: spin 2.5s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: none; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-60px);} to { opacity: 1; transform: none; } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ColisTarifPage; 