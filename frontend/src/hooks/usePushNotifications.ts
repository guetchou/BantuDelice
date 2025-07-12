import { useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '../firebase';

const VAPID_KEY = 'VOTRE_CLE_VAPID_PUBLIC'; // À remplacer par ta clé VAPID Web Push

export function usePushNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState(Notification.permission);
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    if (permission === 'granted') {
      getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: window.navigator.serviceWorker.ready })
        .then((currentToken) => {
          if (currentToken) {
            setToken(currentToken);
          } else {
            setToken(null);
          }
        })
        .catch((err) => {
          setToken(null);
        });
    }
  }, [permission]);

  useEffect(() => {
    onMessage(messaging, (payload) => {
      setMessage(payload);
    });
  }, []);

  const askPermission = () => {
    Notification.requestPermission().then(setPermission);
  };

  return { token, permission, askPermission, message };
} 