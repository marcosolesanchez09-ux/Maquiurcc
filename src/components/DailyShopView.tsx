import React, { useEffect, useState } from 'react';
import { Clock, ShoppingBag, CheckCircle2 } from 'lucide-react';
import type { ClubProfile, DailyShopResponse, Player, PositionGroup } from '../shared/types';
import { JerseyIcon } from './JerseyIcon';

interface DailyShopViewProps {
  club: ClubProfile;
  dailyShop: DailyShopResponse;
  ownedPlayers: Record<string, Player>;
  initialPositionFilter?: PositionGroup | 'ALL';
  onBuyFromShop: (playerId: string) => Promise<void>;
}

function formatCountdown(refreshAtIso: string): string {
  const diffMs = Math.max(0, new Date(refreshAtIso).getTime() - Date.now());
  const totalSec = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const DailyShopView: React.FC<DailyShopViewProps> = ({
  club,
  dailyShop,
  ownedPlayers,
  initialPositionFilter = 'ALL',
  onBuyFromShop,
}) => {
  const [posFilter, setPosFilter] = useState<PositionGroup | 'ALL'>(initialPositionFilter);
  const [countdown, setCountdown] = useState<string>(() => formatCountdown(dailyShop.refreshAt));
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    setPosFilter(initialPositionFilter);
  }, [initialPositionFilter]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(formatCountdown(dailyShop.refreshAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [dailyShop.refreshAt]);

  const filtered = dailyShop.players.filter(
    (p) => posFilter === 'ALL' || p.position === posFilter
  );

  const handleBuy = async (playerId: string) => {
    setBuyingId(playerId);
    try {
      await onBuyFromShop(playerId);
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl bg-[#151E29] border border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShoppingBag className="w-4 h-4" />
            <span>Rotación diaria automática · {dailyShop.dateKey}</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white mt-1">
            Tienda diaria de las grandes ligas
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Cada día se seleccionan 12 futbolistas al azar de LaLiga, Premier League, Serie A, Bundesliga y Ligue 1. Ningún jugador de ligas menores desconocidas aparece aquí.
          </p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Próxima tienda en</span>
            </p>
            <p className="font-mono-nums text-2xl font-bold text-white mt-0.5">{countdown}</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <p className="text-xs text-slate-400">Tu presupuesto</p>
            <p className="font-mono-nums text-2xl font-bold text-amber-400 mt-0.5">
              €{club.budget.toFixed(1)}M
            </p>
          </div>
        </div>
      </div>

      {/* Position filter segmented control */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#151E29] border border-white/10">
          {(['ALL', 'POR', 'DEF', 'MED', 'DEL'] as const).map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => setPosFilter(pos)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                posFilter === pos
                  ? 'bg-emerald-500 text-[#07130D]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {pos === 'ALL' ? 'Todos' : pos}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 font-mono-nums">
          Mostrando {filtered.length} de {dailyShop.players.length} futbolistas disponibles hoy
        </span>
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((player) => {
          const isOwned = Boolean(ownedPlayers[player.id]);
          const purchasedToday = club.dailyPurchasedKeys.includes(
            `${dailyShop.dateKey}:${player.id}`
          );
          const canAfford = club.budget >= player.marketValue;
          const isBusy = buyingId === player.id;

          return (
            <article
              key={player.id}
              className="p-5 rounded-xl bg-[#151E29] border border-white/10 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <JerseyIcon
                      primaryColor={player.clubColor}
                      accentColor={player.clubAccent}
                      shirtNumber={player.shirtNumber}
                      size="md"
                    />
                    <div className="min-w-0">
                      <h2 className="font-display text-xl font-bold text-white truncate">
                        {player.name}
                      </h2>
                      <p className="text-xs text-slate-400 truncate">
                        {player.club} · {player.league}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono-nums text-xl font-bold text-amber-400 block leading-none">
                      {player.overall}
                    </span>
                    <span className="text-[11px] text-slate-400">OVR</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span>{player.position} ({player.role})</span>
                  <span aria-hidden="true">·</span>
                  <span>{player.nationality}</span>
                  <span aria-hidden="true">·</span>
                  <span>{player.age} años</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-slate-400">RIT </span>
                    <span className="font-mono-nums font-semibold text-white">{player.stats.pace}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">TIR </span>
                    <span className="font-mono-nums font-semibold text-white">{player.stats.shooting}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">PAS </span>
                    <span className="font-mono-nums font-semibold text-white">{player.stats.passing}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div>
                  <span className="text-[11px] text-slate-400 block">Precio oficial</span>
                  <span className="font-mono-nums text-lg font-bold text-white">
                    €{player.marketValue}M
                  </span>
                </div>

                {isOwned || purchasedToday ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    En tu club
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!canAfford || isBusy}
                    onClick={() => handleBuy(player.id)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                  >
                    {isBusy
                      ? 'Fichando...'
                      : canAfford
                      ? 'Fichar jugador'
                      : 'Sin saldo'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
