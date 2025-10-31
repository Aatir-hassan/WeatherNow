const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE = 'https://api.open-meteo.com/v1/forecast';

export async function searchCity(query, signal) {
    const url = new URL(GEO_BASE);
    url.searchParams.set('name', query);
    url.searchParams.set('count', '10');
    url.searchParams.set('language', 'en');
    url.searchParams.set('format', 'json');

    const res = await fetch(url.toString(), { signal });
    if (!res.ok) throw new Error('Failed to search locations');
    const data = await res.json();
    const results = data.results || [];
    return results.map((r, idx) => ({
        id: r.id || idx,
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        country: r.country,
        admin1: r.admin1,
    }));
}

export async function getCurrentWeather(latitude, longitude, unitSystem, signal) {
    const isMetric = unitSystem === 'metric';
    const tempUnit = isMetric ? 'celsius' : 'fahrenheit';
    const windUnit = isMetric ? 'kmh' : 'mph';

    const url = new URL(WEATHER_BASE);
    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set('current', 'temperature_2m,wind_speed_10m,wind_direction_10m,weather_code');
    url.searchParams.set('temperature_unit', tempUnit);
    url.searchParams.set('wind_speed_unit', windUnit);
    url.searchParams.set('timezone', 'auto');

    const res = await fetch(url.toString(), { signal });
    if (!res.ok) throw new Error('Failed to fetch weather');
    const data = await res.json();

    const cw = data.current;
    return {
        temperature: cw.temperature_2m,
        windSpeed: cw.wind_speed_10m,
        windDirection: cw.wind_direction_10m,
        weatherCode: cw.weather_code,
        timeISO: cw.time,
    };
}

export function weatherCodeToText(code) {
    const map = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        95: 'Thunderstorm',
    };
    return map[code] || `Code ${code}`;
}