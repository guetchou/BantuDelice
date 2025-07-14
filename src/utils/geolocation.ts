
export interface GeolocationResult {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export const getCurrentPosition = (): Promise<GeolocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: -1,
        message: 'La géolocalisation n\'est pas supportée par votre navigateur'
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000 // Cache for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        let message = 'Erreur de géolocalisation inconnue';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permission de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Position non disponible';
            break;
          case error.TIMEOUT:
            message = 'Délai de géolocalisation dépassé';
            break;
        }
        reject({ code: error.code, message });
      },
      options
    );
  });
};

export const watchPosition = (
  callback: (position: GeolocationResult) => void,
  errorCallback?: (error: GeolocationError) => void
): number | null => {
  if (!navigator.geolocation) return null;

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 30000
  };

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
    },
    (error) => {
      if (errorCallback) {
        let message = 'Erreur de géolocalisation inconnue';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permission de géolocalisation refusée';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Position non disponible';
            break;
          case error.TIMEOUT:
            message = 'Délai de géolocalisation dépassé';
            break;
        }
        errorCallback({ code: error.code, message });
      }
    },
    options
  );
};

export const clearWatch = (watchId: number) => {
  navigator.geolocation.clearWatch(watchId);
};
