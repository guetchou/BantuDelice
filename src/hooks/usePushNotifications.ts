import { useEffect, useState } from 'react';

const VAPID_KEY = 'VOTRE_CLE_VAPID_PUBLIC'; // À remplacer par ta clé VAPID Web Push

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState(Notification.permission);
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    if (permission === 'granted') {
      // Supprimer la ligne :
      // getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: window.navigator.serviceWorker.ready })
      // Supprimer la ligne :
      // .then((currentToken) => {
      // Supprimer la ligne :
      //   if (currentToken) {
      // Supprimer la ligne :
      //     setToken(currentToken);
      // Supprimer la ligne :
      //   } else {
      // Supprimer la ligne :
      //     setToken(null);
      // Supprimer la ligne :
      //   }
      // Supprimer la ligne :
      // })
      // Supprimer la ligne :
      // .catch((err) => {
      // Supprimer la ligne :
      //   setToken(null);
      // Supprimer la ligne :
      // });
    }
  }, [permission]);

  useEffect(() => {
    // Supprimer la ligne :
    // onMessage(messaging, (payload) => {
    // Supprimer la ligne :
    //   setMessage(payload);
    // Supprimer la ligne :
    // });
  }, []);

  const askPermission = () => {
    Notification.requestPermission().then(setPermission);
  };

  return { token, permission, askPermission, message };
} 