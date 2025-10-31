import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import { getCurrentWeather } from './lib/api.js';

export default function App() {
  const [selected, setSelected] = useState(null);
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();
    getCurrentWeather(selected.latitude, selected.longitude, units, ctrl.signal)
      .then(setWeather)
      .catch((e) => {
        if (e.name !== 'AbortError') setError('Failed to load weather');
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [selected, units]);

  const cityLabel = selected ? `${selected.name}${selected.admin1 ? ', ' + selected.admin1 : ''}, ${selected.country}` : '';

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const cur = { id: 0, name: 'My Location', latitude, longitude, country: '' };
        setSelected(cur);
      },
      () => {
        setError('Could not get your location');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur dark:border-gray-800 dark:bg-gray-900/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
          <h1 className="text-2xl font-semibold">Weather Now</h1>
          <div className="flex items-center gap-2">
            <button
              className={`rounded-md px-3 py-1 text-lg ${units === 'metric' ? 'bg-sky-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              onClick={() => setUnits('metric')}
            >
              °C
            </button>
            <button
              className={`rounded-md px-3 py-1 text-lg ${units === 'imperial' ? 'bg-sky-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              onClick={() => setUnits('imperial')}
            >
              °F
            </button>
            <button
              className="ml-2 rounded-md bg-emerald-600 px-4 py-2 text-8px text-white hover:bg-emerald-700"
              onClick={useMyLocation}
            >
              Use my location
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <SearchBar onSelect={(place) => { setSelected(place); setWeather(null); }} />

        <div className="mt-12">
          {loading && <p className="text-gray-500">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && selected && weather && (
            <WeatherCard cityLabel={cityLabel} weather={weather} units={units} />
          )}
          {!loading && !error && selected && !weather && (
            <p className="text-gray-500">Fetching weather for {cityLabel}...</p>
          )}
          {!loading && !error && !selected && (
            <p className="text-gray-600">Search a city to see current conditions.</p>
          )}
        </div>
      </main>

      <footer className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-500">
        Data by Open‑Meteo.
      </footer>
    </div>
  );
}





