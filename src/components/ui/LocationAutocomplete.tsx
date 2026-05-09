'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { useGalsenRegions, LocationSuggestion } from '@/hooks/useGalsenAPI';
import { getCurrentLocation } from '@/lib/utils';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, suggestion?: LocationSuggestion) => void;
  placeholder?: string;
  showGPS?: boolean;
  style?: React.CSSProperties;
}

const typeLabels: Record<string, string> = {
  region: 'Région',
  department: 'Département',
  commune: 'Commune',
};

const typeColors: Record<string, { bg: string; color: string }> = {
  region: { bg: '#DCFCE7', color: '#166534' },
  department: { bg: '#DBEAFE', color: '#1E40AF' },
  commune: { bg: '#FEF3C7', color: '#92400E' },
};

export default function LocationAutocomplete({ value, onChange, placeholder = 'Rechercher une localité...', showGPS = true, style }: LocationAutocompleteProps) {
  const { searchLocations } = useGalsenRegions();
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [locating, setLocating] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Sync external value
  useEffect(() => { setQuery(value); }, [value]);

  const handleInputChange = (text: string) => {
    setQuery(text);
    const results = searchLocations(text);
    setSuggestions(results);
    setShowDropdown(results.length > 0);
    setHighlightIndex(-1);
  };

  const handleSelect = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.name);
    onChange(suggestion.name, suggestion);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightIndex]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const city = await getCurrentLocation();
      setQuery(city);
      onChange(city);
      // Also search for matching suggestions
      const results = searchLocations(city);
      if (results.length > 0) {
        handleSelect(results[0]);
      }
    } catch (err: any) {
      console.warn(`Erreur GPS : ${err.message}`);
    } finally {
      setLocating(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', ...style }}>
      <div style={{
        display: 'flex', alignItems: 'center', background: 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: 12, padding: '0 12px',
        ...(showDropdown ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderColor: 'var(--primary)' } : {})
      }}>
        <Search size={18} color="#9CA3AF" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ width: '100%', padding: '14px 10px', background: 'transparent', border: 'none', outline: 'none', fontSize: 15 }}
        />
        {showGPS && (
          <button
            onClick={handleLocateMe}
            disabled={locating}
            type="button"
            style={{
              color: locating ? '#9CA3AF' : '#3B82F6', flexShrink: 0, padding: 6,
              animation: locating ? 'spin 1s linear infinite' : 'none',
            }}
            title="Me géolocaliser"
          >
            <Navigation size={18} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: 'var(--surface)', border: '1px solid var(--primary)',
          borderTop: 'none', borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: 280, overflowY: 'auto',
        }}>
          {suggestions.map((s, i) => {
            const tc = typeColors[s.type];
            return (
              <button
                key={`${s.name}-${i}`}
                onClick={() => handleSelect(s)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  width: '100%', textAlign: 'left', borderBottom: '1px solid var(--border)',
                  background: highlightIndex === i ? 'var(--primary-light)' : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <MapPin size={16} color={tc.color} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {highlightMatch(s.name, query)}
                  </p>
                  {s.type !== 'region' && (
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {s.region}
                    </p>
                  )}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                  background: tc.bg, color: tc.color, flexShrink: 0, textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  {typeLabels[s.type]}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Highlight the matching part of text in bold */
function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ color: 'var(--primary)' }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}
