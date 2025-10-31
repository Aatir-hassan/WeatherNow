import { useEffect, useRef, useState } from 'react';
import { searchCity } from '../lib/api';

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    controllerRef.current?.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    searchCity(debouncedQuery, ctrl.signal)
      .then(setResults)
      .catch((e) => {
        if (e.name !== 'AbortError') setError('Could not search.');
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city (e.g., Delhi)"
          className="w-full rounded-lg border border-gray-300 bg-white/80 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-800"
        />
        {loading && (
          <div className="absolute right-3 top-2.5 h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500" />
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {results.length > 0 && (
        <ul className="mt-3 max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
          {results.map((r) => (
            <li
              key={`${r.id}-${r.latitude}-${r.longitude}`}
              className="cursor-pointer px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => onSelect(r)}
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-gray-500 dark:text-gray-300">{` — ${r.admin1 ? r.admin1 + ', ' : ''}${r.country}`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}





