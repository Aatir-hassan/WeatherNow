# Weather Now

Quickly check current weather conditions for any city using Open‑Meteo.

## Stack
- React + Vite + TypeScript
- Tailwind CSS
- Open‑Meteo Geocoding + Weather APIs (no auth)

## Getting Started
```bash
# install deps
npm i

# start dev server
npm run dev

# build
npm run build

# preview production build
npm run preview
```

## Features
- City search with suggestions (Open‑Meteo Geocoding API)
- Current conditions: temperature, weather code/summary, wind speed & direction
- Units toggle: °C/°F and km/h or mph
- Use my location: browser geolocation
- Responsive UI, light/dark friendly
- Loading and error states

## Deployment
Import this project into CodeSandbox or StackBlitz. Or run `npm run build` and deploy the `dist/` folder to any static host.

## APIs
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast: `https://api.open-meteo.com/v1/forecast`
- Docs: `https://open-meteo.com/`

## Submission Notes
- Level 1: Share this ChatGPT conversation link as the AI work log.
- Level 2: Deploy via CodeSandbox/StackBlitz and share the URL.
- Level 3: Share this repository with the README.



