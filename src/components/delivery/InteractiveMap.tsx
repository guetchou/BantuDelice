
import React, { useEffect, useState, useRef, useMemo } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeolocationEnhanced } from '@/hooks/useGeolocationEnhanced';
import { supabase } from '@/lib/supabase';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface InteractiveMapProps {
  initialLat?: number;
  initialLng?: number;
  orderId?: string;
  height?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  initialLat = -4.2634,
  initialLng = 15.2429,
  orderId,
  height = '400px'
}) => {
  const { location, loading, getLocation } = useGeolocationEnhanced();
  const [viewport, setViewport] = useState({
    latitude: initialLat,
    longitude: initialLng,
    zoom: 13
  });
  const [restaurantMarkers, setRestaurantMarkers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [destination, setDestination] = useState<{lat: number, lng: number, label: string} | null>(null);
  const [origin, setOrigin] = useState<{lat: number, lng: number, label: string} | null>(null);
  const [selecting, setSelecting] = useState<'origin' | 'destination'>('destination');
  const [routeInfo, setRouteInfo] = useState<{distance: number, duration: number, price: number} | null>(null);
  const [orderStatus, setOrderStatus] = useState<'idle'|'pending'|'success'|'error'>('idle');
  const [paymentStatus, setPaymentStatus] = useState<'idle'|'pending'|'success'|'error'>('idle');
  const [routeCoords, setRouteCoords] = useState<any[]>([]);

  // Centrage sur la position GPS utilisateur
  useEffect(() => {
    if (location) {
      setViewport(v => ({ ...v, latitude: location.latitude, longitude: location.longitude, zoom: 15 }));
    }
  }, [location]);

  // Charger les restaurants et les afficher sur la carte
  useEffect(() => {
    async function fetchAndDisplayRestaurants() {
      const { data, error } = await supabase.from('restaurants').select('*').eq('is_open', true);
      if (error || !data) return;
      setRestaurantMarkers(data);
    }
    fetchAndDisplayRestaurants();
  }, []);

  // Recherche d'adresse (Mapbox)
  const handleAddressSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);
    setSearchError(null);
    try {
      const resp = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&limit=1`);
      const data = await resp.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const label = data.features[0].place_name;
        setSearchResult({ lat, lng, label });
        setViewport(v => ({ ...v, latitude: lat, longitude: lng, zoom: 16 }));
      } else {
        setSearchError("Adresse non trouvée");
      }
    } catch (err) {
      setSearchError("Erreur lors de la recherche");
    } finally {
      setSearchLoading(false);
    }
  };

  // Calcul d'itinéraire (Mapbox Directions API)
  const handleRoute = async () => {
    if (!origin || !destination) return;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.routes && data.routes.length > 0) {
      const coords = data.routes[0].geometry.coordinates.map(([lng,lat]:[number,number])=>({latitude:lat,longitude:lng}));
      setRouteCoords(coords);
      const distanceKm = data.routes[0].distance / 1000;
      const durationMin = data.routes[0].duration / 60;
      let price = 1000 + Math.ceil(distanceKm * 500 / 100) * 100;
      setRouteInfo({ distance: distanceKm, duration: durationMin, price });
    }
  };

  useEffect(() => {
    if (origin && destination) handleRoute();
  }, [origin, destination]);

  const handleGetLocation = async () => {
    await getLocation();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Carte interactive</span>
          <Button
            size="sm"
            onClick={handleGetLocation}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            {loading ? 'Localisation...' : 'Ma position'}
          </Button>
        </CardTitle>
        {/* Choix du point à sélectionner */}
        <div style={{marginTop:8,display:'flex',gap:8}}>
          <button type="button" onClick={()=>setSelecting('origin')} style={{background:selecting==='origin'?'#fbbf24':'#fff',color:selecting==='origin'?'#fff':'#ea580c',fontWeight:700,padding:'8px 18px',border:'1px solid #fbbf24',borderRadius:999,cursor:'pointer'}}>Départ</button>
          <button type="button" onClick={()=>setSelecting('destination')} style={{background:selecting==='destination'?'#fbbf24':'#fff',color:selecting==='destination'?'#fff':'#ea580c',fontWeight:700,padding:'8px 18px',border:'1px solid #fbbf24',borderRadius:999,cursor:'pointer'}}>Destination</button>
        </div>
        {/* Barre de recherche d'adresse */}
        <form onSubmit={handleAddressSearch} style={{marginTop:16,display:'flex',gap:8}}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher une adresse, un lieu..."
            style={{flex:1,padding:'10px 16px',borderRadius:999,border:'1px solid #fbbf24',fontSize:'1rem'}}
            disabled={searchLoading}
          />
          <button type="submit" style={{background:'linear-gradient(90deg,#ea580c,#fbbf24)',color:'#fff',fontWeight:700,padding:'10px 24px',border:'none',borderRadius:999,cursor:'pointer',fontSize:'1rem'}} disabled={searchLoading}>
            {searchLoading ? 'Recherche...' : 'Chercher'}
          </button>
        </form>
        {searchError && <div style={{color:'#dc2626',marginTop:8,fontSize:'0.95rem'}}>{searchError}</div>}
      </CardHeader>
      <CardContent>
        <div style={{ height, width: '100%' }}>
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={viewport}
            viewState={viewport}
            onMove={evt => setViewport(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            style={{ width: '100%', height }}
          >
            {/* Marker position utilisateur */}
            {location && (
              <Marker latitude={location.latitude} longitude={location.longitude} color="red">
                <MapPin />
              </Marker>
            )}
            {/* Markers restaurants */}
            {restaurantMarkers.map((r, i) => (
              <Marker key={r.id || i} latitude={r.latitude} longitude={r.longitude} color="#ea580c">
                <Popup anchor="bottom" closeButton={false} closeOnClick={false} longitude={r.longitude} latitude={r.latitude} >
                  <b>{r.name}</b><br/>{r.cuisine_type || ''}
                </Popup>
              </Marker>
            ))}
            {/* Marker recherche */}
            {searchResult && (
              <Marker latitude={searchResult.lat} longitude={searchResult.lng} color="#22c55e">
                <Popup anchor="top" longitude={searchResult.lng} latitude={searchResult.lat} >
                  {searchResult.label}<br/>
                  <button onClick={()=>{
                    if (selecting==='origin') setOrigin({lat:searchResult.lat,lng:searchResult.lng,label:searchResult.label});
                    else setDestination({lat:searchResult.lat,lng:searchResult.lng,label:searchResult.label});
                  }} style={{marginTop:8,background:'#22c55e',color:'#fff',fontWeight:700,padding:'6px 18px',border:'none',borderRadius:999,cursor:'pointer'}}>Choisir comme {selecting==='origin'?'départ':'destination'}</button>
                </Popup>
              </Marker>
            )}
            {/* Itinéraire */}
            {routeCoords.length > 0 && (
              <><svg style={{position:'absolute',width:'100%',height:'100%',pointerEvents:'none'}}>
                <polyline
                  points={routeCoords.map(c=>`${c.longitude},${c.latitude}`).join(' ')}
                  fill="none"
                  stroke="#ea580c"
                  strokeWidth="4"
                />
              </svg></>
            )}
          </Map>
        </div>
        {/* Affichage des points sélectionnés */}
        {(origin || destination) && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            {origin && (
              <div className="mb-2">
                <div className="flex items-center gap-2 text-blue-700">
                  <Navigation className="w-4 h-4 rotate-180" />
                  <span className="font-medium">Départ</span>
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {origin.label}<br />
                  Latitude: {origin.lat.toFixed(6)}<br />
                  Longitude: {origin.lng.toFixed(6)}
                </div>
                <button onClick={()=>setOrigin(null)} style={{marginTop:8,background:'#dc2626',color:'#fff',fontWeight:700,padding:'6px 18px',border:'none',borderRadius:999,cursor:'pointer'}}>Annuler</button>
              </div>
            )}
            {destination && (
              <div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Navigation className="w-4 h-4" />
                  <span className="font-medium">Destination</span>
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {destination.label}<br />
                  Latitude: {destination.lat.toFixed(6)}<br />
                  Longitude: {destination.lng.toFixed(6)}
                </div>
                <button onClick={()=>setDestination(null)} style={{marginTop:8,background:'#dc2626',color:'#fff',fontWeight:700,padding:'6px 18px',border:'none',borderRadius:999,cursor:'pointer'}}>Annuler</button>
              </div>
            )}
            {/* Bouton calcul itinéraire */}
            {origin && destination && (
              <button onClick={handleRoute} style={{marginTop:16,background:'linear-gradient(90deg,#ea580c,#fbbf24)',color:'#fff',fontWeight:700,padding:'10px 24px',border:'none',borderRadius:999,cursor:'pointer',fontSize:'1rem'}}>Calculer l'itinéraire</button>
            )}
          </div>
        )}
        {/* Formulaire de commande/livraison avec estimation */}
        {origin && destination && routeInfo && (
          <form className="mt-6 p-4 bg-white rounded-xl shadow flex flex-col gap-3 max-w-xl mx-auto border border-orange-100" onSubmit={async e=>{
            e.preventDefault();
            setOrderStatus('pending');
            setPaymentStatus('idle');
            setTimeout(() => {
              setOrderStatus('success');
            }, 1200);
          }}>
            <div className="font-bold text-orange-600 text-lg mb-2">Résumé de la commande</div>
            <div><b>Départ :</b> {origin.label}</div>
            <div><b>Destination :</b> {destination.label}</div>
            <div><b>Distance :</b> {routeInfo.distance.toFixed(2)} km</div>
            <div><b>Durée estimée :</b> {Math.round(routeInfo.duration)} min</div>
            <div><b>Prix estimé :</b> <span className="text-green-600 font-bold">{routeInfo.price} FCFA</span></div>
            <button type="submit" style={{marginTop:8,background:'linear-gradient(90deg,#22c55e,#fbbf24)',color:'#fff',fontWeight:700,padding:'12px 28px',border:'none',borderRadius:999,cursor:'pointer',fontSize:'1.1rem'}} disabled={orderStatus==='pending'}>{orderStatus==='pending' ? 'Envoi...' : 'Valider la commande'}</button>
            {orderStatus==='success' && (
              <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg">
                Commande enregistrée ! N° {orderId}
                <button type="button" style={{marginLeft:16,background:'#ea580c',color:'#fff',fontWeight:700,padding:'8px 18px',border:'none',borderRadius:999,cursor:'pointer'}} disabled={paymentStatus==='pending'} onClick={async()=>{
                  setPaymentStatus('pending');
                  setTimeout(()=>{
                    if (Math.random()>0.15) { setPaymentStatus('success'); } else { setPaymentStatus('error'); }
                  }, 1200);
                }}>{paymentStatus==='pending' ? 'Paiement...' : 'Payer'}</button>
                {paymentStatus==='success' && <span style={{marginLeft:12,color:'#16a34a',fontWeight:600}}>Paiement réussi !</span>}
                {paymentStatus==='error' && <span style={{marginLeft:12,color:'#dc2626',fontWeight:600}}>Échec du paiement</span>}
              </div>
            )}
            {orderStatus==='error' && <div className="mt-3 p-3 bg-red-50 text-red-700">Erreur lors de l'enregistrement de la commande.</div>}
          </form>
        )}
        {location && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">Position détectée</span>
            </div>
            <div className="text-sm text-green-600 mt-1">
              Latitude: {location.latitude.toFixed(6)}<br />
              Longitude: {location.longitude.toFixed(6)}
              {location.accuracy && (
                <><br />Précision: {Math.round(location.accuracy)}m</>
              )}
            </div>
          </div>
        )}
        {orderId && (
          <div className="mt-2 text-sm text-gray-600">
            Commande: {orderId}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
