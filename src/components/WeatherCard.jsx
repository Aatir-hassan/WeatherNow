import { weatherCodeToText } from '../lib/api';

export default function WeatherCard({ cityLabel, weather, units }) {
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'km/h' : 'mph';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{cityLabel}</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
            {new Date(weather.timeISO).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Metric label="Temperature" value={`${Math.round(weather.temperature)}${tempUnit}`} />
        <Metric label="Condition" value={weatherCodeToText(weather.weatherCode)} />
        <Metric label="Wind" value={`${Math.round(weather.windSpeed)} ${windUnit}`} />
        <Metric label="Wind Dir" value={`${Math.round(weather.windDirection)}°`} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">{label}</p>
      <p className="mt-1 text-lg font-medium">{value}</p>
    </div>
  );
}





