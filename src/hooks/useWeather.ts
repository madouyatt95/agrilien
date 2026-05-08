'use client';

import { useState, useEffect } from 'react';

/**
 * GPS coordinates for Senegalese regions (approximate center).
 */
const REGION_COORDS: Record<string, { lat: number; lon: number }> = {
  'Dakar':        { lat: 14.6928, lon: -17.4467 },
  'Diourbel':     { lat: 14.6553, lon: -16.2314 },
  'Fatick':       { lat: 14.3390, lon: -16.4111 },
  'Kaffrine':     { lat: 14.1059, lon: -15.5506 },
  'Kaolack':      { lat: 14.1520, lon: -16.0726 },
  'Kédougou':     { lat: 12.5605, lon: -12.1747 },
  'Kolda':        { lat: 12.8835, lon: -14.9501 },
  'Louga':        { lat: 15.6166, lon: -16.2280 },
  'Matam':        { lat: 15.6559, lon: -13.2554 },
  'Saint-Louis':  { lat: 16.0326, lon: -16.4818 },
  'Sédhiou':      { lat: 12.7081, lon: -15.5569 },
  'Tambacounda':  { lat: 13.7709, lon: -13.6673 },
  'Thies':        { lat: 14.7910, lon: -16.9359 },
  'Ziguinchor':   { lat: 12.5641, lon: -16.2720 },
};

/**
 * WMO Weather interpretation codes → labels & icons
 * https://open-meteo.com/en/docs
 */
const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0:  { label: 'Ciel dégagé',       icon: '☀️' },
  1:  { label: 'Principalement dégagé', icon: '🌤️' },
  2:  { label: 'Partiellement nuageux', icon: '⛅' },
  3:  { label: 'Couvert',            icon: '☁️' },
  45: { label: 'Brouillard',         icon: '🌫️' },
  48: { label: 'Brouillard givrant', icon: '🌫️' },
  51: { label: 'Bruine légère',      icon: '🌦️' },
  53: { label: 'Bruine modérée',     icon: '🌦️' },
  55: { label: 'Bruine dense',       icon: '🌧️' },
  61: { label: 'Pluie légère',       icon: '🌦️' },
  63: { label: 'Pluie modérée',      icon: '🌧️' },
  65: { label: 'Pluie forte',        icon: '🌧️' },
  71: { label: 'Neige légère',       icon: '🌨️' },
  73: { label: 'Neige modérée',      icon: '🌨️' },
  75: { label: 'Neige forte',        icon: '❄️' },
  80: { label: 'Averses légères',    icon: '🌦️' },
  81: { label: 'Averses modérées',   icon: '🌧️' },
  82: { label: 'Averses violentes',  icon: '⛈️' },
  95: { label: 'Orage',              icon: '⛈️' },
  96: { label: 'Orage avec grêle',   icon: '⛈️' },
  99: { label: 'Orage violent',      icon: '⛈️' },
};

export interface WeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherLabel: string;
  weatherIcon: string;
  precipitation: number;
  isDay: boolean;
  // Daily forecast
  tempMax: number;
  tempMin: number;
  rainProbability: number;
}

/**
 * Fetches real-time weather data from Open-Meteo for a Senegalese region.
 * Free API, no key required.
 */
export function useWeather(regionName: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      setLoading(true);
      setError(null);

      // Find coordinates for region
      const coords = REGION_COORDS[regionName];
      if (!coords) {
        // Fallback: try case-insensitive match
        const key = Object.keys(REGION_COORDS).find(
          k => k.toLowerCase() === regionName.toLowerCase()
        );
        if (!key) {
          setError('Région non reconnue');
          setLoading(false);
          return;
        }
        Object.assign(coords || {}, REGION_COORDS[key]);
        if (!coords) {
          setError('Coordonnées introuvables');
          setLoading(false);
          return;
        }
      }

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,precipitation,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Africa/Dakar&forecast_days=1`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const code = data.current.weather_code;
        const wmo = WMO_CODES[code] || { label: 'Inconnu', icon: '🌡️' };

        if (!cancelled) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            apparentTemperature: Math.round(data.current.apparent_temperature),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCode: code,
            weatherLabel: wmo.label,
            weatherIcon: wmo.icon,
            precipitation: data.current.precipitation,
            isDay: data.current.is_day === 1,
            tempMax: Math.round(data.daily.temperature_2m_max[0]),
            tempMin: Math.round(data.daily.temperature_2m_min[0]),
            rainProbability: data.daily.precipitation_probability_max?.[0] ?? 0,
          });
          setLoading(false);
        }
      } catch (err: any) {
        console.warn('Open-Meteo error:', err.message);
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchWeather();
    return () => { cancelled = true; };
  }, [regionName]);

  return { weather, loading, error };
}
