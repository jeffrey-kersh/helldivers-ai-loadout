# Loadout Builder UI

React.js front end for the Helldivers 2 loadout builder.

## Run it

from /frontend/ run:
```
npm install
npm run dev
```
With no backend set, the app shows sample data.

## Connect the backend
Create a `.env` file with `VITE_API_URL=http://localhost:8000` (or wherever the backend is), then restart `npm run dev`.

## Where things live
- `/frontend/src/data.js`: playstyles, enemies, armor classes and required gear
- `/frontend/src/api.js`: the call to the backend, plus sample data
- `/frontend/src/App.jsx`: the three screens
- `/frontend/src/styles.css`: the theme
