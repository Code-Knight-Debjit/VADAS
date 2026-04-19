import { useEffect, useState } from "react";
import api from "../api/client";
import { saveLastLocation } from "../lib/storage";

export function useGeolocation(user) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!user || !window.navigator.geolocation) {
      return undefined;
    }

    const watchId = window.navigator.geolocation.watchPosition(
      async ({ coords }) => {
        const nextLocation = {
          lat: coords.latitude,
          lng: coords.longitude,
          accuracy: coords.accuracy
        };

        setLocation(nextLocation);
        saveLastLocation(nextLocation);

        try {
          await api.post("/location", { ...nextLocation, isLastKnown: true });
        } catch (error) {
          console.error("Location sync failed", error);
        }
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000
      }
    );

    return () => {
      window.navigator.geolocation.clearWatch(watchId);
    };
  }, [user]);

  return location;
}
