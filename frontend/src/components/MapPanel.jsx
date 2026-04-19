import Map, { Marker } from "react-map-gl";
import { MapPinned } from "lucide-react";

export default function MapPanel({ location }) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN || "";

  if (!location || !token) {
    return (
      <section className="panel flex min-h-[320px] flex-col justify-between p-6">
        <div>
          <h3 className="font-display text-xl">Live Location</h3>
          <p className="mt-2 text-sm text-slate-400">
            Provide a Mapbox token in `VITE_MAPBOX_TOKEN` to enable the interactive map. Current coordinates still update below.
          </p>
        </div>
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
          <p>Latitude: {location?.lat?.toFixed(5) || "--"}</p>
          <p>Longitude: {location?.lng?.toFixed(5) || "--"}</p>
          <p>Accuracy: {Math.round(location?.accuracy || 0)} meters</p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-white/10 p-5">
        <h3 className="font-display text-xl">Live Location</h3>
      </div>
      <div className="h-[360px]">
        <Map
          mapboxAccessToken={token}
          initialViewState={{
            longitude: location.lng,
            latitude: location.lat,
            zoom: 12
          }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
        >
          <Marker longitude={location.lng} latitude={location.lat} anchor="bottom">
            <MapPinned className="text-flare" />
          </Marker>
        </Map>
      </div>
    </section>
  );
}
