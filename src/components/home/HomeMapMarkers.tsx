
import mapboxgl from 'mapbox-gl';

export const addDemoMarkers = (map: mapboxgl.Map, userLocation: [number, number] | null) => {
  // Ajouter quelques marqueurs de démonstration pour les restaurants, taxis, etc.
  const demoLocations = [
    { 
      lng: userLocation ? userLocation[1] + 0.005 : -4.2634 + 0.005, 
      lat: userLocation ? userLocation[0] + 0.003 : 15.2429 + 0.003, 
      type: 'restaurant', 
      name: 'Restaurant Le Gourmet' 
    },
    { 
      lng: userLocation ? userLocation[1] - 0.003 : -4.2634 - 0.003, 
      lat: userLocation ? userLocation[0] + 0.002 : 15.2429 + 0.002, 
      type: 'taxi', 
      name: 'Taxi disponible' 
    },
    { 
      lng: userLocation ? userLocation[1] + 0.002 : -4.2634 + 0.002, 
      lat: userLocation ? userLocation[0] - 0.004 : 15.2429 - 0.004, 
      type: 'covoiturage', 
      name: 'Point de covoiturage' 
    }
  ];

  const markers: mapboxgl.Marker[] = [];

  demoLocations.forEach(location => {
    const el = document.createElement('div');
    el.className = `marker-${location.type}`;
    el.style.backgroundSize = 'cover';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.backgroundImage = location.type === 'restaurant' 
      ? 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTExZDQ4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdXRlbnNpbHMiPjxwYXRoIGQ9Ik0zIDJoM3YxMGwzLTNsMy4wMDEgMyAwLTEwaC8iLz48cGF0aCBkPSJNMTUgMmg2djI0Ii8+PC9zdmc+")'
      : location.type === 'taxi'
      ? 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzQ5N2ZkIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2FyIj48cGF0aCBkPSJNMTQgMTZINW0xNSAwaC0zIi8+PHBhdGggZD0iTTcgTDguMDUgOS4wMCBBMi41IDIuNSAwIDAgMSAxMC4zMSA4aDIuMzhhMi41IDIuNSAwIDAgMSAyLjI2IDEuNDBMNiA4djZhMiAyIDAgMCAwIDIgMmgEVsDIvPjxjaXJjbGUgY3g9IjYuNSIgY3k9IjE2LjUiIHI9IjIuNSIvPjxjaXJjbGUgY3g9IjE2LjUiIGN5PSIxNi41IiByPSIyLjUiLz48L3N2Zz4=")'
      : 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTBiOTgxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdXNlcnMiPjxwYXRoIGQ9Ik0xNiAyMXYtMmE0IDQgMCAwIDAtNC00SDVhNCA0IDAgMCAwLTQgNHYyIi8+PHBhdGggZD0iTSA5YTMgMCAxIDAgMCAxMDMgMyAwIDAgMCAwLTYiLz48cGF0aCBkPSJNMjMgMjF2LTJhNCA0IDAgMCAwLTMtMy44NyIvPjxwYXRoIGQ9Ik0xNiAzLjEzYTQgNCAwIDAgMSAwIDcuNzUiLz48L3N2Zz4=")';
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .setPopup(new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${location.name}</h3>`))
      .addTo(map);
    
    markers.push(marker);
  });

  return markers;
};

export const addUserLocationMarker = (map: mapboxgl.Map, userLocation: [number, number]): mapboxgl.Marker => {
  return new mapboxgl.Marker({ color: '#FF6B35' })
    .setLngLat([userLocation[1], userLocation[0]])
    .addTo(map);
};
