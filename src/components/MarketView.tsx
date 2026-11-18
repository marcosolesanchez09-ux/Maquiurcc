import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, Tag, Trophy } from 'lucide-react';
import type {
  ClubLeaderboardEntry,
  ClubProfile,
  MarketListing,
  Player,
  PositionGroup,
} from '../shared/types';
import { JerseyIcon } from './JerseyIcon';

interface MarketViewProps {
  club: ClubProfile;
  ownedPlayers: Record<string, Player>;
  marketListings: MarketListing[];
  leaderboard: ClubLeaderboardEntry[];
  initialPositionFilter?: PositionGroup | 'ALL';
  onBuyListing: (listingId: string) => Promise<void>;
  onCancelListing: (listingId: string) => Promise<void>;
  onListPlayer: (playerId: string, price: number) => Promise<void>;
}

export const MarketView: React.FC<MarketViewProps> = ({
  club,
  ownedPlayers,
  marketListings,
  leaderboard,
  initialPositionFilter = 'ALL',
  onBuyListing,
  onCancelListing,
  onListPlayer,
}) => {
  const [posFilter, setPosFilter] = useState<PositionGroup | 'ALL'>(initialPositionFilter);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedSellId, setSelectedSellId] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');

  useEffect(() => {
    setPosFilter(initialPositionFilter);
  }, [initialPositionFilter]);

  const ownedList = Object.values(ownedPlayers);

  useEffect(() => {
    if (ownedList.length > 0 && !ownedPlayers[selectedSellId]) {
      setSelectedSellId(ownedList[0].id);
      setSellPrice(String(ownedList[0].marketValue));
    }
  }, [ownedList.length, ownedPlayers, selectedSellId]);

  const myListings = marketListings.filter((l) => l.sellerClubId === club.id);
  const otherListings = marketListings.filter(
    (l) =>
      l.sellerClubId !== club.id &&
      (posFilter === 'ALL' || l.player.position === posFilter)
  );

  const handleBuy = async (listingId: string) => {
    setBusyId(listingId);
    try {
      await onBuyListing(listingId);
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (listingId: string) => {
    setBusyId(listingId);
    try {
      await onCancelListing(listingId);
    } finally {
      setBusyId(null);
    }
  };

  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSellId) return;
    const num = Number(sellPrice);
    if (!Number.isFinite(num) || num < 1) return;
    setBusyId('sell-form');
    try {
      await onListPlayer(selectedSellId, num);
      setSelectedSellId('');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Sell Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#151E29] border border-white/10 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <ArrowRightLeft className="w-4 h-4" />
              <span>Mercado abierto entre clubes</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white mt-1">
              Mercado de transferencias
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Ficha jugadores puestos en venta por otros clubes o publica futbolistas de tu plantilla al precio que consideres justo.
            </p>
          </div>
          <div className="flex items-center gap-6 pt-3 border-t border-white/10">
            <div>
              <span className="text-xs text-slate-400 block">Presupuesto disponible</span>
              <span className="font-mono-nums text-2xl font-bold text-amber-400">
                €{club.budget.toFixed(1)}M
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">En venta ahora</span>
              <span className="font-mono-nums text-2xl font-bold text-white">
                {marketListings.length}
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSellSubmit}
          className="lg:col-span-5 p-5 rounded-xl bg-[#151E29] border border-white/10 flex flex-col justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-xl font-bold text-white">
              Poner jugador en venta
            </h2>
          </div>

          {!club.draftCompleted ? (
            <p className="text-xs text-slate-400 py-3">
              Completa primero tus 11 titulares y 3 suplentes del Draft Inicial antes de poder poner jugadores en venta en el mercado.
            </p>
          ) : ownedList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-400 mb-1">
                    Jugador de tu club
                  </label>
                  <select
                    value={selectedSellId}
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setSelectedSellId(nextId);
                      const p = ownedPlayers[nextId];
                      if (p) setSellPrice(String(p.marketValue));
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {ownedList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.shortName} ({p.position} · {p.overall}) — Ref. €{p.marketValue}M
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Precio (M €)</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    step="0.5"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white font-mono-nums focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={busyId === 'sell-form' || !selectedSellId}
                className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold bg-amber-400 text-[#0B1117] hover:bg-amber-300 disabled:opacity-40 transition-colors"
              >
                {busyId === 'sell-form' ? 'Publicando...' : 'Publicar en el mercado'}
              </button>
            </>
          ) : (
            <p className="text-xs text-slate-400 py-3">
              Aún no tienes jugadores en plantilla. Ficha primero en la Tienda Diaria o en este mercado para poder vender después.
            </p>
          )}
        </form>
      </div>

      {/* My active listings */}
      {myListings.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-white">
            Tus jugadores en venta ({myListings.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((lst) => (
              <div
                key={lst.id}
                className="p-4 rounded-xl bg-[#151E29] border border-amber-400/30 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <JerseyIcon
                    primaryColor={lst.player.clubColor}
                    accentColor={lst.player.clubAccent}
                    shirtNumber={lst.player.shirtNumber}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{lst.player.name}</p>
                    <p className="text-xs text-slate-400 font-mono-nums">
                      {lst.player.position} · OVR {lst.player.overall} · Pides €{lst.price}M
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={busyId === lst.id}
                  onClick={() => handleCancel(lst.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
                >
                  Retirar
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Market + Online Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
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
              {otherListings.length} ofertas de otros clubes
            </span>
          </div>

          {otherListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherListings.map((lst) => {
                const alreadyOwned = Boolean(ownedPlayers[lst.playerId]);
                const canAfford = club.budget >= lst.price;
                return (
                  <article
                    key={lst.id}
                    className="p-4 rounded-xl bg-[#151E29] border border-white/10 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <JerseyIcon
                          primaryColor={lst.player.clubColor}
                          accentColor={lst.player.clubAccent}
                          shirtNumber={lst.player.shirtNumber}
                          size="md"
                        />
                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-bold text-white truncate">
                            {lst.player.name}
                          </h3>
                          <p className="text-xs text-slate-400 truncate">
                            {lst.player.club} · {lst.player.league}
                          </p>
                          <p className="text-xs text-slate-300 mt-0.5">
                            {lst.player.position} ({lst.player.role}) · Media{' '}
                            <span className="font-mono-nums font-bold text-amber-400">
                              {lst.player.overall}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 truncate">
                          Vende: {lst.sellerClubName}
                        </p>
                        <p className="font-mono-nums text-lg font-bold text-white">
                          €{lst.price}M
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={alreadyOwned || !canAfford || busyId === lst.id}
                        onClick={() => handleBuy(lst.id)}
                        className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0"
                      >
                        {alreadyOwned
                          ? 'Ya es tuyo'
                          : busyId === lst.id
                          ? 'Comprando...'
                          : canAfford
                          ? 'Comprar'
                          : 'Sin saldo'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#151E29] border border-white/10 text-center">
              <p className="text-sm text-slate-300">
                No hay futbolistas en venta para esa posición ahora mismo.
              </p>
            </div>
          )}
        </div>

        {/* Connected Online Clubs Leaderboard */}
        <aside className="lg:col-span-4 p-5 rounded-xl bg-[#151E29] border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-xl font-bold text-white">
              Clubes en la liga online
            </h2>
          </div>
          <div className="divide-y divide-white/10">
            {leaderboard.slice(0, 8).map((entry, idx) => (
              <div
                key={entry.id}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">
                    {idx + 1}. {entry.name}{' '}
                    {entry.id === club.id && (
                      <span className="text-emerald-400 font-normal">(Tú)</span>
                    )}
                  </p>
                  <p className="text-slate-400 truncate">
                    {entry.formationId} · {entry.startersCount}/11 titulares · {entry.wins}V
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono-nums font-bold text-amber-400">
                    {entry.avgOverall > 0 ? `OVR ${entry.avgOverall}` : '—'}
                  </p>
                  <p className="font-mono-nums text-slate-400">€{entry.squadValue}M</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
