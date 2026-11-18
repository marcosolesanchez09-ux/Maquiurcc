import React from 'react';
import { Plus } from 'lucide-react';
import type { Formation, Player, TeamChemistrySummary } from '../shared/types';
import { JerseyIcon } from './JerseyIcon';

interface TacticalPitchProps {
  formation: Formation;
  starters: Array<string | null>;
  ownedPlayers: Record<string, Player>;
  selectedSlotIndex: number | null;
  onSelectSlot: (slotIndex: number) => void;
  chemistry?: TeamChemistrySummary;
  captainId?: string | null;
}

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  formation,
  starters,
  ownedPlayers,
  selectedSlotIndex,
  onSelectSlot,
  chemistry,
  captainId,
}) => {
  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[5/6] max-h-[680px] rounded-xl overflow-hidden border border-white/15 bg-[#0D3B23] select-none">
      {/* Mowed grass horizontal bands */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, rgba(16, 85, 48, 0.85) 0px, rgba(16, 85, 48, 0.85) 48px, rgba(12, 68, 38, 0.92) 48px, rgba(12, 68, 38, 0.92) 96px)',
        }}
      />

      {/* Regulation pitch markings + Chemistry Links */}
      <svg
        viewBox="0 0 100 120"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        {/* Outer touchline */}
        <rect
          x="4"
          y="4"
          width="92"
          height="112"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />
        {/* Halfway line */}
        <line
          x1="4"
          y1="60"
          x2="96"
          y2="60"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />
        {/* Center circle */}
        <circle
          cx="50"
          cy="60"
          r="11"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />
        <circle cx="50" cy="60" r="0.8" fill="rgba(255,255,255,0.4)" />

        {/* Top attacking penalty box */}
        <rect
          x="23"
          y="4"
          width="54"
          height="18"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />
        <rect
          x="36"
          y="4"
          width="28"
          height="6.5"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />
        <path
          d="M 39 22 A 12 12 0 0 0 61 22"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />

        {/* Bottom defending penalty box */}
        <rect
          x="23"
          y="98"
          width="54"
          height="18"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />
        <rect
          x="36"
          y="109.5"
          width="28"
          height="6.5"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />
        <path
          d="M 39 98 A 12 12 0 0 1 61 98"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="0.6"
        />

        {/* Chemistry links between connected starters */}
        {chemistry?.links.map((link, idx) => {
          const a = formation.slots[link.fromSlot];
          const b = formation.slots[link.toSlot];
          if (!a || !b) return null;
          const x1 = a.x;
          const y1 = a.y * 1.2;
          const x2 = b.x;
          const y2 = b.y * 1.2;
          return (
            <line
              key={`chem-link-${idx}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={
                link.strength === 'perfect'
                  ? 'rgba(52, 211, 153, 0.72)'
                  : 'rgba(251, 191, 36, 0.45)'
              }
              strokeWidth={link.strength === 'perfect' ? '0.85' : '0.55'}
              strokeDasharray={link.strength === 'perfect' ? undefined : '1.6 1.2'}
            />
          );
        })}
      </svg>

      {/* Subtle top scrim for formation label */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none">
        <span className="text-xs font-medium text-white/80 tracking-wide">
          Esquema {formation.name}
          {chemistry ? ` · Química ${chemistry.totalScore}/100` : ''}
        </span>
        <span className="text-xs font-mono-nums text-white/80">
          {starters.filter(Boolean).length}/11 titulares
        </span>
      </div>

      {/* 11 Tactical Slots */}
      {formation.slots.map((slot, index) => {
        const playerId = starters[index];
        const player = playerId ? ownedPlayers[playerId] : undefined;
        const isSelected = selectedSlotIndex === index;
        const chemPts = player && chemistry ? chemistry.perStarter[player.id]?.points ?? 0 : 0;
        const isCaptain = Boolean(player && captainId === player.id);

        return (
          <button
            key={`${formation.id}-${slot.slotIndex}`}
            type="button"
            onClick={() => onSelectSlot(index)}
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute group flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg transition-transform duration-150 ${
              isSelected ? 'scale-105 z-20' : 'hover:scale-105 z-10'
            }`}
            aria-label={
              player
                ? `${slot.label}: ${player.name}, media ${player.overall}`
                : `Hueco vacío ${slot.label}`
            }
          >
            {player ? (
              <div className="flex flex-col items-center">
                <div
                  className={`relative rounded-lg p-1 transition-colors ${
                    isSelected
                      ? 'bg-[#0B1117]/90 ring-2 ring-emerald-400'
                      : 'bg-[#0B1117]/65 group-hover:bg-[#0B1117]/85'
                  }`}
                >
                  <JerseyIcon
                    primaryColor={player.clubColor}
                    accentColor={player.clubAccent}
                    shirtNumber={player.shirtNumber}
                    size="md"
                  />
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-[#0B1117] font-mono-nums text-[10px] font-bold px-1 rounded">
                    {player.overall}
                  </span>
                  {isCaptain && (
                    <span
                      title="Capitán"
                      className="absolute -top-1.5 -left-1.5 bg-white text-[#0B1117] font-mono-nums text-[9px] font-extrabold px-1 rounded"
                    >
                      C
                    </span>
                  )}
                </div>
                <div className="mt-1 px-2 py-0.5 rounded bg-[#0B1117]/85 border border-white/10 max-w-[92px]">
                  <p className="text-[11px] font-semibold text-white truncate leading-tight">
                    {player.shortName}
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-0.5 leading-none">
                  <span className="text-[10px] font-medium text-emerald-200/90">
                    {slot.role}
                  </span>
                  {chemistry && (
                    <span
                      className="inline-flex items-center gap-0.5"
                      title={`Química individual: ${chemPts}/3`}
                    >
                      {[0, 1, 2].map((dot) => (
                        <span
                          key={dot}
                          className={`w-1.5 h-1.5 rounded-full ${
                            dot < chemPts ? 'bg-emerald-400' : 'bg-white/25'
                          }`}
                        />
                      ))}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div
                  className={`w-11 h-11 rounded-lg border border-dashed flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/30 border-emerald-300 text-white'
                      : 'bg-[#0B1117]/55 border-white/40 text-white/80 group-hover:bg-emerald-500/20 group-hover:border-emerald-300'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded bg-[#0B1117]/80 border border-white/10">
                  <span className="text-[11px] font-semibold text-white/90 whitespace-nowrap">
                    {slot.role}
                  </span>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
