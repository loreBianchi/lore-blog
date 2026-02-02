import { useRef, useState, useCallback } from 'react';
import { GenArtSettings, StatItem } from '@/types/experiments';

export function useSettingsWithStats(initial: GenArtSettings) {
  const settings = useRef<GenArtSettings>(initial);
  const [stats, setStats] = useState<StatItem[]>(() => createStats(initial));
  const [settingsVersion, setSettingsVersion] = useState(0); // Per forzare aggiornamenti

  const updateSettings = useCallback((updates: Partial<GenArtSettings>) => {
    Object.assign(settings.current, updates);
    setStats(prev => updateStats(prev, updates));
    setSettingsVersion(v => v + 1); // Incrementa per forzare re-render
  }, []);

  return { 
    settings: settings.current, 
    stats, 
    updateSettings,
    settingsVersion // Nuova proprietà
  };
}

function createStats(settings: GenArtSettings): StatItem[] {
  return [
    { label: "Particles", value: settings.particleCount.toString(), inline: true, color: "#00FFFF" },
    { label: "Speed", value: settings.speed.toString(), inline: true, color: "#FF00FF" },
    { label: "Size", value: settings.size.toString(), inline: true, color: "#FFFF00" },
    { label: "Pattern", value: settings.pattern, inline: true, color: "#FFFFFF" },
  ];
}

function updateStats(currentStats: StatItem[], updates: Partial<GenArtSettings>): StatItem[] {
  return currentStats.map(stat => {
    switch(stat.label) {
      case "Particles": 
        return updates.particleCount !== undefined 
          ? { ...stat, value: updates.particleCount.toString() }
          : stat;
      case "Speed":
        return updates.speed !== undefined
          ? { ...stat, value: updates.speed.toString() }
          : stat;
      case "Size":
        return updates.size !== undefined
          ? { ...stat, value: updates.size.toString() }
          : stat;
      case "Pattern":
        return updates.pattern !== undefined
          ? { ...stat, value: updates.pattern }
          : stat;
      default:
        return stat;
    }
  });
}