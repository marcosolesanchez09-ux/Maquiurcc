import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2, Globe } from 'lucide-react';
import type { LeagueName, Player, PositionGroup, SearchPlayerResult } from '../shared/types';
import { JerseyIcon } from './JerseyIcon';

interface WorldSearchViewProps {
  clubId: string;
  clubBudget: number;
  draftCompleted: boolean;
  ownedPlayers: Record<string, Player>;
  onDraftSign: (player: Player) => Promise<void>;
  onBuyFromShop: (playerId: string) => Promise<void>;
  onBuyFromMarket: (listingId: string) => Promise<void>;
}

const LEAGUES: Array<LeagueName | 'ALL'> = [
  'ALL',
  'LaLiga',
  'Premier League',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'Liga Profesional Argentina',
  'Brasileirão',
  'MLS',
  'Saudi Pro League',
  'Liga Portugal',
  'Eredivisie',
  'Süper Lig',
  'Liga MX',
  'Resto del Mundo',
];

export const WorldSearchView: React.FC<WorldSearchViewProps> = ({
  clubId,
  clubBudget,
  draftCompleted,
  ownedPlayers,
  onDraftSign,
  onBuyFromShop,
  onBuyFromMarket,
}) => {
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState<PositionGroup | 'ALL'>('ALL');
  const [league, setLeague] = useState<LeagueName | 'ALL'>('ALL');
  const [results, setResults] = useState<SearchPlayerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          position,
          league,
          clubId,
          draft: draftCompleted ? '0' : '1',
        });
        const resp = await fetch(`/api/players/search?${params.toString()}`);
        if (resp.ok && active) {
          const data = (await resp.json()) as { results: SearchPlayerResult[] };
          setResults(data.results || []);
        }
      } finally {
        if (active) setLoading(false);
      }
    }, 220);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, position, league, clubId, draftCompleted]);

  const handleAction = async (item: SearchPlayerResult) => {
    setBuyingId(item.player.id);
    try {
      if (item.availability === 'draft_open') {
        await onDraftSign(item.player);
      } else if (item.availability === 'daily_shop') {
        await onBuyFromShop(item.player.id);
      } else if (item.availability === 'market' && item.marketListingId) {
        await onBuyFromMarket(item.marketListingId);
      }
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-xl bg-[#151E29] border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <Globe className="w-4 h-4" />
              <span>
                {draftCompleted
                  ? 'Ojeo internacional en vivo'
                  : 'Draft Inicial activo · Fichaje libre mundial'}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white mt-1">
              Buscador mundial de jugadores
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {draftCompleted
                ? 'Explora futbolistas del catálogo mundial FIFA / EA Sports FC (Europa, Liga Argentina, Brasileirão, MLS, Arabia, Portugal y más). Al haber completado el Draft, solo podrás fichar a quienes estén hoy en la Tienda Diaria o en el Mercado.'
                : 'Mientras completas tus 11 titulares y 3 suplentes con tus 750M € iniciales, busca y ficha cualquier jugador del catálogo FIFA mundial (Liga Argentina, Europa, Brasileirão, MLS, Arabia y más) en cualquier posición.'}
            </p>
          </div>
          <div className="shrink-0">
            <span className="text-xs text-slate-400 block">Presupuesto</span>
            <span className="font-mono-nums text-2xl font-bold text-amber-400">
              €{clubBudget.toFixed(1)}M
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca por nombre, club o liga (ej. Cavani, Armani, Messi, River Plate, Liga Argentina...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as PositionGroup | 'ALL')}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400"
              aria-label="Filtrar por posición"
            >
              <option value="ALL">Todas las posiciones</option>
              <option value="POR">Porteros (POR)</option>
              <option value="DEF">Defensas (DEF)</option>
              <option value="MED">Centrocampistas (MED)</option>
              <option value="DEL">Delanteros (DEL)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={league}
              onChange={(e) => setLeague(e.target.value as LeagueName | 'ALL')}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400"
              aria-label="Filtrar por liga"
            >
              {LEAGUES.map((l) => (
                <option key={l} value={l}>
                  {l === 'ALL' ? 'Todas las ligas' : l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-36 rounded-xl bg-[#151E29] border border-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item) => {
            const p = item.player;
            const isOwned = Boolean(ownedPlayers[p.id]) || item.availability === 'owned';
            const effectiveAvailability = isOwned
              ? 'owned'
              : !draftCompleted && item.availability === 'scout_only'
              ? 'draft_open'
              : item.availability;
            const cost = item.marketPrice ?? p.marketValue;
            const affordable = clubBudget >= cost;
            return (
              <article
                key={p.id}
                className="p-4 rounded-xl bg-[#151E29] border border-white/10 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <JerseyIcon
                      primaryColor={p.clubColor}
                      accentColor={p.clubAccent}
                      shirtNumber={p.shirtNumber}
                      size="md"
                    />
                    <div className="min-w-0">
                      <h2 className="font-display text-xl font-bold text-white truncate">
                        {p.name}
                      </h2>
                      <p className="text-xs text-slate-400 truncate">
                        {p.club} · {p.league}
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {p.position} ({p.role}) · {p.nationality} · {p.age} años
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono-nums text-lg font-bold text-amber-400 block leading-none">
                      {p.overall}
                    </span>
                    <span className="text-[11px] text-slate-400">OVR</span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {effectiveAvailability === 'market'
                        ? `En venta (${item.sellerClubName})`
                        : effectiveAvailability === 'daily_shop'
                        ? 'En Tienda Diaria hoy'
                        : effectiveAvailability === 'draft_open'
                        ? 'Fichaje libre de Draft'
                        : effectiveAvailability === 'owned'
                        ? 'En tu club'
                        : 'Valor estimado'}
                    </span>
                    <span className="font-mono-nums text-base font-bold text-white">
                      €{cost}M
                    </span>
                  </div>

                  {effectiveAvailability === 'owned' && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      En tu plantilla
                    </span>
                  )}

                  {effectiveAvailability === 'draft_open' && (
                    <button
                      type="button"
                      disabled={!affordable || buyingId === p.id}
                      onClick={() => handleAction({ ...item, availability: 'draft_open' })}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                    >
                      {buyingId === p.id
                        ? 'Fichando...'
                        : affordable
                        ? 'Fichar (Draft)'
                        : 'Sin saldo'}
                    </button>
                  )}

                  {effectiveAvailability === 'daily_shop' && (
                    <button
                      type="button"
                      disabled={!affordable || buyingId === p.id}
                      onClick={() => handleAction(item)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 transition-colors whitespace-nowrap"
                    >
                      {buyingId === p.id ? 'Fichando...' : 'Fichar (Tienda)'}
                    </button>
                  )}

                  {effectiveAvailability === 'market' && (
                    <button
                      type="button"
                      disabled={!affordable || buyingId === p.id}
                      onClick={() => handleAction(item)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 text-[#0B1117] hover:bg-amber-300 disabled:opacity-40 transition-colors whitespace-nowrap"
                    >
                      {buyingId === p.id ? 'Comprando...' : 'Comprar (Mercado)'}
                    </button>
                  )}

                  {effectiveAvailability === 'scout_only' && (
                    <span className="text-xs text-slate-400">
                      No disponible hoy
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-[#151E29] border border-white/10 text-center">
          <p className="text-sm text-slate-300">
            No encontramos jugadores con esa búsqueda. Prueba otro nombre o limpia los filtros.
          </p>
        </div>
      )}
    </div>
  );
};
