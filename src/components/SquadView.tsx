import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  ChevronRight,
  Plus,
  Search,
  Shield,
  SlidersHorizontal,
  Tag,
  Trash2,
  Users,
} from 'lucide-react';
import type {
  ClubProfile,
  Formation,
  Player,
  PositionGroup,
  SearchPlayerResult,
} from '../shared/types';
import { isPositionCompatible } from '../shared/formations';
import { calculateTeamChemistry } from '../shared/chemistry';
import { TacticalPitch } from './TacticalPitch';
import { JerseyIcon } from './JerseyIcon';
import { FormationSelectorModal } from './FormationSelectorModal';

interface SquadViewProps {
  club: ClubProfile;
  formation: Formation;
  formations: Formation[];
  ownedPlayers: Record<string, Player>;
  onChangeFormationPreset: (formationId: string) => Promise<void>;
  onChangeFormationCustom: (def: number, med: number, del: number) => Promise<void>;
  onUpdateLineup: (payload: {
    action: 'assign' | 'move_to_reserves' | 'move_to_bench';
    playerId: string;
    targetType?: 'starter' | 'bench' | 'reserves';
    targetIndex?: number;
  }) => Promise<void>;
  onDraftSign: (
    player: Player,
    targetType?: 'starter' | 'bench',
    targetIndex?: number
  ) => Promise<void>;
  onDraftRelease: (playerId: string) => Promise<void>;
  onListPlayerForSale: (playerId: string, price: number) => Promise<void>;
  onGoToShop: (posFilter?: PositionGroup) => void;
  onGoToMarket: (posFilter?: PositionGroup) => void;
  onGoToSearch: () => void;
  onOpenGuide: () => void;
}

export const SquadView: React.FC<SquadViewProps> = ({
  club,
  formation,
  formations,
  ownedPlayers,
  onChangeFormationPreset,
  onChangeFormationCustom,
  onUpdateLineup,
  onDraftSign,
  onDraftRelease,
  onListPlayerForSale,
  onGoToShop,
  onGoToMarket,
  onGoToSearch,
  onOpenGuide,
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
  const [selectedBenchIndex, setSelectedBenchIndex] = useState<number | null>(null);
  const [formationModalOpen, setFormationModalOpen] = useState(false);
  const [sellingPlayerId, setSellingPlayerId] = useState<string | null>(null);
  const [salePrice, setSalePrice] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const advanceAfterSignRef = useRef(false);

  // Quick Draft Picker state (active during initial 11 + 3 Draft)
  const [draftQuery, setDraftQuery] = useState('');
  const [draftShowAllPositions, setDraftShowAllPositions] = useState(false);
  const [draftCandidates, setDraftCandidates] = useState<SearchPlayerResult[]>([]);
  const [draftLoading, setDraftLoading] = useState(false);

  const starterPlayers = club.starters
    .filter((id): id is string => Boolean(id))
    .map((id) => ownedPlayers[id])
    .filter((p): p is Player => Boolean(p));

  const benchCount = club.bench.filter(Boolean).length;
  const avgOverall =
    starterPlayers.length > 0
      ? (starterPlayers.reduce((sum, p) => sum + p.overall, 0) / starterPlayers.length).toFixed(1)
      : '—';

  const totalClubPlayers = starterPlayers.length + benchCount + club.reserves.length;
  const chemistry = calculateTeamChemistry(formation, club.starters, ownedPlayers);

  const selectedSlot = selectedSlotIndex !== null ? formation.slots[selectedSlotIndex] : null;
  const selectedStarterId =
    selectedSlotIndex !== null ? club.starters[selectedSlotIndex] : null;
  const selectedStarter = selectedStarterId ? ownedPlayers[selectedStarterId] : undefined;

  const isSelectingEmptyBench =
    selectedBenchIndex !== null && club.bench[selectedBenchIndex] === null;
  const isSelectingEmptyStarter = selectedSlot !== null && !selectedStarter;

  const activeDraftPositionFilter: PositionGroup | 'ALL' =
    isSelectingEmptyBench || draftShowAllPositions
      ? 'ALL'
      : selectedSlot
      ? selectedSlot.position
      : 'ALL';

  useEffect(() => {
    if (club.draftCompleted) return;
    if (!isSelectingEmptyStarter && !isSelectingEmptyBench) return;

    let active = true;
    const timer = setTimeout(async () => {
      setDraftLoading(true);
      try {
        const params = new URLSearchParams({
          q: draftQuery,
          position: activeDraftPositionFilter,
          league: 'ALL',
          clubId: club.id,
          draft: '1',
        });
        const resp = await fetch(`/api/players/search?${params.toString()}`);
        if (resp.ok && active) {
          const data = (await resp.json()) as { results: SearchPlayerResult[] };
          setDraftCandidates(
            (data.results || []).filter((r) => !ownedPlayers[r.player.id] && r.availability !== 'owned')
          );
        }
      } finally {
        if (active) setDraftLoading(false);
      }
    }, 180);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    club.draftCompleted,
    club.id,
    draftQuery,
    activeDraftPositionFilter,
    isSelectingEmptyStarter,
    isSelectingEmptyBench,
    ownedPlayers,
  ]);

  // Auto-advance ONLY right after signing a player in Draft mode (never hijack when clicking an occupied slot)
  useEffect(() => {
    if (!advanceAfterSignRef.current) return;
    advanceAfterSignRef.current = false;
    if (club.draftCompleted) return;

    const nextStarter = club.starters.findIndex((id) => id === null);
    if (nextStarter !== -1) {
      setSelectedSlotIndex(nextStarter);
      setSelectedBenchIndex(null);
    } else {
      const nextBench = club.bench.findIndex((id) => id === null);
      if (nextBench !== -1) {
        setSelectedSlotIndex(null);
        setSelectedBenchIndex(nextBench);
      }
    }
  }, [club.draftCompleted, club.starters, club.bench]);

  const benchAndReservesIds: Array<{ id: string; location: 'bench' | 'reserves'; benchIdx?: number }> = [];
  club.bench.forEach((id, idx) => {
    if (id) benchAndReservesIds.push({ id, location: 'bench', benchIdx: idx });
  });
  club.reserves.forEach((id) => {
    benchAndReservesIds.push({ id, location: 'reserves' });
  });

  const compatibleCandidates = selectedSlot
    ? benchAndReservesIds
        .map((entry) => ({ ...entry, player: ownedPlayers[entry.id] }))
        .filter((entry) => entry.player && isPositionCompatible(entry.player.position, selectedSlot.position))
    : [];

  const handleAssignToSelectedSlot = async (playerId: string) => {
    if (selectedSlotIndex === null) return;
    setBusy(true);
    try {
      await onUpdateLineup({
        action: 'assign',
        playerId,
        targetType: 'starter',
        targetIndex: selectedSlotIndex,
      });
    } finally {
      setBusy(false);
    }
  };

  const handleMoveToBench = async (playerId: string) => {
    setBusy(true);
    try {
      await onUpdateLineup({
        action: 'move_to_bench',
        playerId,
        targetType: 'bench',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleMoveToReserves = async (playerId: string) => {
    setBusy(true);
    try {
      await onUpdateLineup({
        action: 'move_to_reserves',
        playerId,
        targetType: 'reserves',
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDraftSignHere = async (player: Player) => {
    setBusy(true);
    try {
      advanceAfterSignRef.current = true;
      if (isSelectingEmptyBench && selectedBenchIndex !== null) {
        await onDraftSign(player, 'bench', selectedBenchIndex);
      } else if (
        isSelectingEmptyStarter &&
        selectedSlotIndex !== null &&
        selectedSlot &&
        isPositionCompatible(player.position, selectedSlot.position)
      ) {
        await onDraftSign(player, 'starter', selectedSlotIndex);
      } else {
        await onDraftSign(player);
      }
      setDraftQuery('');
    } catch {
      advanceAfterSignRef.current = false;
    } finally {
      setBusy(false);
    }
  };

  const handleDraftReleaseHere = async (playerId: string) => {
    setBusy(true);
    try {
      await onDraftRelease(playerId);
    } finally {
      setBusy(false);
    }
  };

  const openSellBox = (player: Player) => {
    setSellingPlayerId(player.id);
    setSalePrice(String(player.marketValue));
  };

  const submitSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellingPlayerId) return;
    const numeric = Number(salePrice);
    if (!Number.isFinite(numeric) || numeric < 1) return;
    setBusy(true);
    try {
      await onListPlayerForSale(sellingPlayerId, numeric);
      setSellingPlayerId(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Draft Inicial explanation banner */}
      {!club.draftCompleted && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-400/35 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-300">
              Fase 1 · Draft Inicial libre ({starterPlayers.length}/11 titulares · {benchCount}/3 suplentes)
            </p>
            <p className="text-sm text-white">
              Usa tus <strong>750M €</strong> iniciales para fichar a cualquier futbolista del mundo y llenar tus 11 titulares y 3 suplentes. Al completar los 14 puestos, tu presupuesto pasará automáticamente a <strong>€50.0M</strong> y se abrirá la etapa de Tienda Diaria y Mercado.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToSearch}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto"
          >
            Abrir Buscador Mundial
          </button>
        </div>
      )}

      {/* Club summary strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl bg-[#151E29] border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/15 bg-[#0B1117] shrink-0 flex items-center justify-center">
            <img
              src="/src/assets/images/club_crest_emblem_1795024688585.jpg"
              alt={`Escudo de ${club.name}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              {club.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Míster: {club.managerName} · {totalClubPlayers} jugadores · Balance {club.record.wins}V-{club.record.draws}E-{club.record.losses}D
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 lg:gap-5 items-center">
          <div>
            <p className="text-xs text-slate-400">
              {club.draftCompleted ? 'Presupuesto' : 'Saldo Draft'}
            </p>
            <p className="font-mono-nums text-xl font-bold text-amber-400">
              €{club.budget.toFixed(1)}M
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Media del XI</p>
            <p className="font-mono-nums text-xl font-bold text-white">{avgOverall}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Química</p>
            <p className="font-mono-nums text-xl font-bold text-emerald-400">
              {chemistry.totalScore}/100
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Once + Banquillo</p>
            <p className="font-mono-nums text-xl font-bold text-white">
              {starterPlayers.length}/11 · {benchCount}/3
            </p>
          </div>
          <div className="flex items-center gap-2 col-span-2 sm:col-span-1 justify-start sm:justify-end">
            <button
              type="button"
              onClick={() => setFormationModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#0F1620] border border-white/15 hover:border-emerald-400/60 text-sm font-semibold text-white transition-colors whitespace-nowrap shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>{formation.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-column tactical workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center Dominant Anchor: Tactical Pitch + Chemistry Summary */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Campo táctico · {formation.name}
              </h2>
              <p className="text-xs text-slate-400">
                {club.draftCompleted
                  ? 'Pulsa cualquier hueco del campo para alinear un jugador o buscar refuerzos.'
                  : 'Pulsa cualquier hueco vacío del campo para fichar directamente al jugador que quieras.'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={onOpenGuide}
                className="text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Cómo jugar
              </button>
              <button
                type="button"
                onClick={() => setFormationModalOpen(true)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
              >
                Cambiar esquema
              </button>
            </div>
          </div>

          <TacticalPitch
            formation={formation}
            starters={club.starters}
            ownedPlayers={ownedPlayers}
            selectedSlotIndex={selectedSlotIndex}
            onSelectSlot={(idx) => {
              setSelectedSlotIndex(idx);
              setSelectedBenchIndex(null);
            }}
            chemistry={chemistry}
            captainId={club.tactics?.captainId}
          />

          {/* Team Chemistry Card */}
          <section className="p-4 rounded-xl bg-[#151E29] border border-white/10 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Química del equipo ·{' '}
                  <span className="font-mono-nums text-emerald-400">
                    {chemistry.totalScore}/100
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Conecta jugadores de la misma liga, país o club en tu once para sumar media en las simulaciones.
                </p>
              </div>
              <span className="font-mono-nums text-sm font-bold text-amber-400">
                +{chemistry.ovrBonus} OVR en partidos
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#0B1117] overflow-hidden border border-white/10">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${chemistry.totalScore}%` }}
              />
            </div>

            <div className="text-xs text-slate-300 space-y-1 pt-1">
              {chemistry.leagueMatches.length > 0 && (
                <p>
                  <strong className="text-white">Ligas conectadas:</strong>{' '}
                  {chemistry.leagueMatches.map((m) => `${m.label} (${m.count})`).join(' · ')}
                </p>
              )}
              {chemistry.nationMatches.length > 0 && (
                <p>
                  <strong className="text-white">Países conectados:</strong>{' '}
                  {chemistry.nationMatches.map((m) => `${m.label} (${m.count})`).join(' · ')}
                </p>
              )}
              {chemistry.clubMatches.length > 0 && (
                <p>
                  <strong className="text-white">Mismo club:</strong>{' '}
                  {chemistry.clubMatches.map((m) => `${m.label} (${m.count})`).join(' · ')}
                </p>
              )}
              {chemistry.leagueMatches.length === 0 &&
                chemistry.nationMatches.length === 0 &&
                chemistry.clubMatches.length === 0 && (
                  <p className="text-slate-400">
                    Alinea al menos 2 titulares de la misma liga, nacionalidad o club para activar enlaces de química.
                  </p>
                )}
            </div>
          </section>
        </div>

        {/* Right Column: Slot Inspector + Draft Picker / Bench / Reserves */}
        <div className="lg:col-span-5 space-y-5">
          {/* Slot Inspector */}
          <section className="p-5 rounded-xl bg-[#151E29] border border-white/10 space-y-4">
            {isSelectingEmptyBench ? (
              <>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <p className="text-xs text-emerald-400 font-semibold">
                      Draft Inicial · Banquillo
                    </p>
                    <h3 className="font-display text-xl font-bold text-white">
                      Suplente {(selectedBenchIndex ?? 0) + 1} (cualquier posición)
                    </h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="search"
                      value={draftQuery}
                      onChange={(e) => setDraftQuery(e.target.value)}
                      placeholder="Busca cualquier jugador del mundo..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {draftLoading ? (
                      <p className="text-xs text-slate-400 py-2">Buscando futbolistas...</p>
                    ) : draftCandidates.length > 0 ? (
                      draftCandidates.slice(0, 18).map(({ player }) => {
                        const affordable = club.budget >= player.marketValue;
                        return (
                          <div
                            key={player.id}
                            className="flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg bg-[#0F1620] border border-white/10"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <JerseyIcon
                                primaryColor={player.clubColor}
                                accentColor={player.clubAccent}
                                shirtNumber={player.shirtNumber}
                                size="sm"
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                  {player.name}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">
                                  {player.position} · OVR {player.overall} · {player.club} · {player.league}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={busy || !affordable}
                              onClick={() => handleDraftSignHere(player)}
                              className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 font-mono-nums"
                            >
                              {affordable ? `€${player.marketValue}M` : 'Sin saldo'}
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 py-2">
                        Escribe el nombre de cualquier jugador del mundo para ficharlo.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : selectedSlot ? (
              <>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <p className="text-xs text-emerald-400 font-semibold">
                      Hueco seleccionado · {selectedSlot.position}
                    </p>
                    <h3 className="font-display text-xl font-bold text-white">
                      {selectedSlot.label} ({selectedSlot.role})
                    </h3>
                  </div>
                  {club.draftCompleted && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onGoToShop(selectedSlot.position)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 transition-colors whitespace-nowrap shrink-0"
                      >
                        Tienda ({selectedSlot.position})
                      </button>
                      <button
                        type="button"
                        onClick={() => onGoToMarket(selectedSlot.position)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
                      >
                        Mercado
                      </button>
                    </div>
                  )}
                </div>

                {selectedStarter ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <JerseyIcon
                          primaryColor={selectedStarter.clubColor}
                          accentColor={selectedStarter.clubAccent}
                          shirtNumber={selectedStarter.shirtNumber}
                          size="lg"
                        />
                        <div className="min-w-0">
                          <p className="text-base font-bold text-white truncate">
                            {selectedStarter.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {selectedStarter.club} · {selectedStarter.league} · {selectedStarter.nationality}
                          </p>
                          <p className="text-xs text-slate-300 font-mono-nums mt-0.5">
                            Media {selectedStarter.overall} · Valor €{selectedStarter.marketValue}M
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        disabled={busy || club.bench.every(Boolean)}
                        onClick={() => handleMoveToBench(selectedStarter.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 disabled:opacity-40 transition-colors whitespace-nowrap"
                      >
                        Pasar a suplentes
                      </button>
                      {!club.draftCompleted ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleDraftReleaseHere(selectedStarter.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-400/25 text-red-200 hover:bg-red-500/20 disabled:opacity-40 transition-colors whitespace-nowrap"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Descartar (+€{selectedStarter.marketValue}M)</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleMoveToReserves(selectedStarter.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 disabled:opacity-40 transition-colors whitespace-nowrap"
                          >
                            Enviar a reserva
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => openSellBox(selectedStarter)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 border border-amber-400/30 text-amber-200 hover:bg-amber-500/25 transition-colors whitespace-nowrap"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            Vender en mercado
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : !club.draftCompleted ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs text-slate-300">
                        Saldo Draft: <strong className="text-amber-300 font-mono-nums">€{club.budget.toFixed(1)}M</strong>
                      </p>
                      <div className="inline-flex rounded-lg bg-[#0B1117] border border-white/15 p-0.5 text-[11px] font-semibold">
                        <button
                          type="button"
                          onClick={() => setDraftShowAllPositions(false)}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            !draftShowAllPositions
                              ? 'bg-emerald-500 text-[#07130D]'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          Solo {selectedSlot.position}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDraftShowAllPositions(true)}
                          className={`px-2.5 py-1 rounded-md transition-colors ${
                            draftShowAllPositions
                              ? 'bg-emerald-500 text-[#07130D]'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          Todas las posiciones
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="search"
                        value={draftQuery}
                        onChange={(e) => setDraftQuery(e.target.value)}
                        placeholder={
                          draftShowAllPositions
                            ? 'Busca cualquier jugador FIFA (Cavani, Armani, River, Liga Argentina...)'
                            : `Buscar ${selectedSlot.position} por nombre, club o liga...`
                        }
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                      {draftLoading ? (
                        <p className="text-xs text-slate-400 py-2">Buscando futbolistas...</p>
                      ) : draftCandidates.length > 0 ? (
                        draftCandidates.slice(0, 24).map(({ player }) => {
                          const affordable = club.budget >= player.marketValue;
                          return (
                            <div
                              key={player.id}
                              className="flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg bg-[#0F1620] border border-white/10"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <JerseyIcon
                                  primaryColor={player.clubColor}
                                  accentColor={player.clubAccent}
                                  shirtNumber={player.shirtNumber}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-white truncate">
                                    {player.name}
                                  </p>
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {player.position} ({player.role}) · OVR {player.overall} · {player.club} · {player.league}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                disabled={busy || !affordable}
                                onClick={() => handleDraftSignHere(player)}
                                className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 transition-colors whitespace-nowrap shrink-0 font-mono-nums"
                              >
                                {affordable ? `€${player.marketValue}M` : 'Sin saldo'}
                              </button>
                            </div>
                          );
                        })
                      ) : (
                        <div className="py-2 space-y-2">
                          <p className="text-xs text-slate-400">
                            Sin resultados {!draftShowAllPositions ? `en ${selectedSlot.position}` : ''} para "{draftQuery}".
                          </p>
                          {!draftShowAllPositions && (
                            <button
                              type="button"
                              onClick={() => setDraftShowAllPositions(true)}
                              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                            >
                              Buscar en todas las posiciones →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Este puesto está libre. Asigna un jugador compatible de tu banquillo/reservas o ficha uno nuevo.
                  </p>
                )}

                {/* Compatible players from bench/reserves */}
                {compatibleCandidates.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs font-semibold text-slate-300 mb-2">
                      Ya en tu club para {selectedSlot.position}
                    </p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {compatibleCandidates.map(({ player, location }) => (
                        <div
                          key={player.id}
                          className="flex items-center justify-between gap-2 py-2 px-2.5 rounded-lg bg-[#0F1620] border border-white/10"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <JerseyIcon
                              primaryColor={player.clubColor}
                              accentColor={player.clubAccent}
                              shirtNumber={player.shirtNumber}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white truncate">
                                {player.shortName}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {player.role} · Media {player.overall} ·{' '}
                                {location === 'bench' ? 'Suplente' : 'Reserva'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleAssignToSelectedSlot(player.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors whitespace-nowrap shrink-0"
                          >
                            <ArrowLeftRight className="w-3 h-3" />
                            Alinear
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-slate-400">
                Selecciona una posición del campo o un hueco del banquillo para gestionarlo.
              </p>
            )}
          </section>

          {/* Sell price inline form */}
          {club.draftCompleted && sellingPlayerId && ownedPlayers[sellingPlayerId] && (
            <form
              onSubmit={submitSell}
              className="p-4 rounded-xl bg-[#1A2431] border border-amber-400/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">
                  Poner en venta a {ownedPlayers[sellingPlayerId].shortName}
                </p>
                <button
                  type="button"
                  onClick={() => setSellingPlayerId(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Valor de referencia: €{ownedPlayers[sellingPlayerId].marketValue}M. El jugador aparecerá en el mercado para que otros clubes lo fichen.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={500}
                  step="0.5"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="w-32 px-3 py-2 rounded-lg bg-[#0B1117] border border-white/15 text-white font-mono-nums text-sm focus:outline-none focus:border-amber-400"
                  aria-label="Precio de venta en millones"
                />
                <span className="text-xs text-slate-300">M €</span>
                <button
                  type="submit"
                  disabled={busy}
                  className="ml-auto px-4 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-[#0B1117] hover:bg-amber-300 transition-colors whitespace-nowrap"
                >
                  Publicar venta
                </button>
              </div>
            </form>
          )}

          {/* 3 Substitutes Bench */}
          <section className="p-5 rounded-xl bg-[#151E29] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h3 className="font-display text-lg font-bold text-white">
                  Banquillo (3 suplentes)
                </h3>
              </div>
              <span className="text-xs font-mono-nums text-slate-400">
                {benchCount}/3 ocupados
              </span>
            </div>

            <div className="space-y-2">
              {club.bench.map((pid, idx) => {
                const p = pid ? ownedPlayers[pid] : undefined;
                const isSelectedBench = selectedBenchIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                      isSelectedBench
                        ? 'bg-emerald-500/10 border-emerald-400/50'
                        : 'bg-[#0F1620] border-white/10'
                    }`}
                  >
                    {p ? (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <JerseyIcon
                            primaryColor={p.clubColor}
                            accentColor={p.clubAccent}
                            shirtNumber={p.shirtNumber}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {p.shortName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {p.position} · {p.role} · Media {p.overall}
                            </p>
                          </div>
                        </div>
                        {club.draftCompleted ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleMoveToReserves(p.id)}
                              className="px-2.5 py-1 rounded text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              A reserva
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => openSellBox(p)}
                              className="px-2.5 py-1 rounded text-xs text-amber-300 hover:bg-amber-500/15 transition-colors"
                            >
                              Vender
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDraftReleaseHere(p.id)}
                            className="px-2.5 py-1 rounded text-xs text-red-300 hover:bg-red-500/15 transition-colors shrink-0"
                          >
                            Descartar
                          </button>
                        )}
                      </>
                    ) : !club.draftCompleted ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSlotIndex(null);
                          setSelectedBenchIndex(idx);
                        }}
                        className="w-full flex items-center justify-between text-xs text-emerald-300 hover:text-emerald-200 py-1"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Fichar suplente {idx + 1} (cualquier jugador del mundo)</span>
                        </span>
                        <span className="font-semibold">Elegir</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2.5 text-xs text-slate-500 py-1">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Hueco de suplente {idx + 1} vacío</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Unlimited Reserves (active once Draft completes) */}
          <section className="p-5 rounded-xl bg-[#151E29] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-300" />
                <h3 className="font-display text-lg font-bold text-white">
                  Reservas (ilimitadas)
                </h3>
              </div>
              <span className="text-xs font-mono-nums text-slate-400">
                {club.reserves.length} jugadores
              </span>
            </div>

            {club.reserves.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {club.reserves.map((pid) => {
                  const p = ownedPlayers[pid];
                  if (!p) return null;
                  const canAddToBench = club.bench.some((b) => b === null);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[#0F1620] border border-white/10"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <JerseyIcon
                          primaryColor={p.clubColor}
                          accentColor={p.clubAccent}
                          shirtNumber={p.shirtNumber}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {p.shortName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {p.position} · Media {p.overall} · €{p.marketValue}M
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {canAddToBench && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleMoveToBench(p.id)}
                            className="px-2.5 py-1 rounded text-xs text-emerald-300 hover:bg-emerald-500/15 transition-colors"
                          >
                            Al banquillo
                          </button>
                        )}
                        {club.draftCompleted && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => openSellBox(p)}
                            className="px-2.5 py-1 rounded text-xs text-amber-300 hover:bg-amber-500/15 transition-colors"
                          >
                            Vender
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : !club.draftCompleted ? (
              <p className="text-xs text-slate-400 py-2">
                Completa primero los 11 titulares y 3 suplentes del Draft Inicial. Después podrás acumular tantos jugadores en reserva como quieras fichando en la Tienda Diaria y en el Mercado.
              </p>
            ) : (
              <div className="py-4 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  Aquí aparecerán todos los jugadores extra que fiches cuando el once y los 3 suplentes estén completos.
                </p>
                <button
                  type="button"
                  onClick={() => onGoToShop()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Explorar tienda diaria</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <FormationSelectorModal
        open={formationModalOpen}
        formations={formations}
        currentFormationId={club.formationId}
        onClose={() => setFormationModalOpen(false)}
        onSelectPreset={onChangeFormationPreset}
        onSelectCustom={onChangeFormationCustom}
      />
    </div>
  );
};
