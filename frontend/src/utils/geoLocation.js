// Colombia's approximate bounding box coordinates
const COLOMBIA_BOUNDS = {
  north: 13.39, // Northernmost point
  south: -4.23, // Southernmost point
  west: -82.12, // Westernmost point
  east: -66.87  // Easternmost point
};

export const isLocationInColombia = (latitude, longitude) => {
  return (
    latitude >= COLOMBIA_BOUNDS.south &&
    latitude <= COLOMBIA_BOUNDS.north &&
    longitude >= COLOMBIA_BOUNDS.west &&
    longitude <= COLOMBIA_BOUNDS.east
  );
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (isLocationInColombia(latitude, longitude)) {
          resolve({ latitude, longitude, isInColombia: true });
        } else {
          reject(new Error('Lo sentimos, este servicio solo está disponible en Colombia.'));
        }
      },
      (error) => {
        reject(new Error('Error al obtener la ubicación: ' + error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};
