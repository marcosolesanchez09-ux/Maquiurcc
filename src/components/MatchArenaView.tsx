import React, { useEffect, useState } from 'react';
import { FastForward, Play, Sliders, Swords, Trophy, Zap } from 'lucide-react';
import type {
  BotDifficulty,
  ClubProfile,
  Formation,
  MatchResult,
  MatchTactics,
  MentalityId,
  PlayStyleId,
  Player,
} from '../shared/types';
import { calculateTeamChemistry } from '../shared/chemistry';
import { DEFAULT_TACTICS, MENTALITIES, PLAY_STYLES } from '../shared/tactics';
import { playGoalFanfare, playWhistleSound } from '../utils/soundFx';

interface MatchArenaViewProps {
  club: ClubProfile;
  formation: Formation;
  ownedPlayers: Record<string, Player>;
  onUpdateTactics: (tactics: MatchTactics) => Promise<void>;
  onPlayMatch: (difficulty: BotDifficulty) => Promise<MatchResult>;
  onGoToSquad: () => void;
}

const DIFFICULTIES: Array<{
  id: BotDifficulty;
  label: string;
  botName: string;
  botOvr: number;
  win: number;
  draw: number;
  loss: number;
  description: string;
}> = [
  {
    id: 'amateur',
    label: 'Amateur',
    botName: 'CD Valle Nuevo Bot',
    botOvr: 76,
    win: 18,
    draw: 7,
    loss: 2,
    description: 'Rival asequible ideal para empezar a sumar millones con tu primer once.',
  },
  {
    id: 'profesional',
    label: 'Profesional',
    botName: 'Real Iberia Bot',
    botOvr: 82,
    win: 35,
    draw: 14,
    loss: 4,
    description: 'Bloque ordenado de primera división. Exige equilibrio entre defensa y ataque.',
  },
  {
    id: 'clase_mundial',
    label: 'Clase Mundial',
    botName: 'Milano Élite Bot',
    botOvr: 86,
    win: 60,
    draw: 22,
    loss: 6,
    description: 'Nivel de eliminatoria europea con gran recompensa por victoria.',
  },
  {
    id: 'leyenda',
    label: 'Leyenda',
    botName: 'Europa Galáctica XI',
    botOvr: 90,
    win: 95,
    draw: 35,
    loss: 8,
    description: 'Máxima exigencia táctica frente a un once de estrellas. El mayor premio en juego.',
  },
];

export const MatchArenaView: React.FC<MatchArenaViewProps> = ({
  club,
  formation,
  ownedPlayers,
  onUpdateTactics,
  onPlayMatch,
  onGoToSquad,
}) => {
  const [difficulty, setDifficulty] = useState<BotDifficulty>('profesional');
  const [isRequesting, setIsRequesting] = useState(false);
  const [savingTactics, setSavingTactics] = useState(false);
  const [activeMatch, setActiveMatch] = useState<MatchResult | null>(null);
  const [liveMinute, setLiveMinute] = useState<number>(0);
  const [isPlayingLive, setIsPlayingLive] = useState(false);
  const [simSpeed, setSimSpeed] = useState<'1x' | '3x'>('1x');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const tactics: MatchTactics = club.tactics || DEFAULT_TACTICS;

  const starterPlayers = club.starters
    .filter((id): id is string => Boolean(id))
    .map((id) => ownedPlayers[id])
    .filter((p): p is Player => Boolean(p));

  const startersCount = starterPlayers.length;
  const userAvgOvr =
    startersCount > 0
      ? (starterPlayers.reduce((s, p) => s + p.overall, 0) / startersCount).toFixed(1)
      : '0.0';

  const chemistry = calculateTeamChemistry(formation, club.starters, ownedPlayers);

  useEffect(() => {
    if (!isPlayingLive || !activeMatch) return;

    const intervalMs = simSpeed === '3x' ? 75 : 180;
    const stepMin = simSpeed === '3x' ? 4 : 2;

    const timer = setInterval(() => {
      setLiveMinute((prev) => {
        const next = Math.min(90, prev + stepMin);
        const justHitGoal = activeMatch.events.some(
          (ev) =>
            (ev.type === 'goal' || ev.type === 'penalty') &&
            ev.team === 'user' &&
            ev.minute > prev &&
            ev.minute <= next
        );
        if (justHitGoal) {
          playGoalFanfare();
        }
        if (next >= 90) {
          setIsPlayingLive(false);
          playWhistleSound();
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlayingLive, activeMatch, simSpeed]);

  const handleTacticChange = async (patch: Partial<MatchTactics>) => {
    setSavingTactics(true);
    try {
      await onUpdateTactics({
        ...tactics,
        ...patch,
      });
    } finally {
      setSavingTactics(false);
    }
  };

  const handleStartSimulation = async (instant: boolean) => {
    setErrorMsg(null);
    setIsRequesting(true);
    try {
      const result = await onPlayMatch(difficulty);
      setActiveMatch(result);
      if (instant) {
        setLiveMinute(90);
        setIsPlayingLive(false);
        playWhistleSound();
      } else {
        setLiveMinute(0);
        setIsPlayingLive(true);
        playWhistleSound();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo iniciar la simulación.');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkipToEnd = () => {
    setLiveMinute(90);
    setIsPlayingLive(false);
  };

  const visibleEvents = activeMatch
    ? activeMatch.events.filter((ev) => ev.minute <= liveMinute)
    : [];

  const liveUserGoals = activeMatch
    ? visibleEvents.filter(
        (ev) => (ev.type === 'goal' || ev.type === 'penalty') && ev.team === 'user'
      ).length
    : 0;
  const liveBotGoals = activeMatch
    ? visibleEvents.filter((ev) => ev.type === 'goal' && ev.team === 'bot').length
    : 0;

  // Compute simulated ball x-position (10..90%) for the live tactical radar
  const latestEvent = visibleEvents[visibleEvents.length - 1];
  const ballZonePct = !activeMatch
    ? 50
    : liveMinute === 0
    ? 50
    : latestEvent
    ? latestEvent.team === 'user'
      ? latestEvent.type === 'goal' || latestEvent.type === 'penalty'
        ? 88
        : 72
      : latestEvent.type === 'goal'
      ? 12
      : 28
    : 50 + Math.sin(liveMinute * 0.4) * 18;

  const selectedStyle = PLAY_STYLES.find((s) => s.id === tactics.playStyle) || PLAY_STYLES[0];

  return (
    <div className="space-y-6">
      {/* Stadium hero banner */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 min-h-[210px] flex items-end">
        <img
          src="/src/assets/images/stadium_hero_banner_1795024689429.jpg"
          alt="Estadio europeo nocturno para simulación contra Bots"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1117] via-[#0B1117]/75 to-[#0B1117]/30" />

        <div className="relative z-10 w-full p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-400">
              Simulador táctico contra Bots · 100% simulación de pizarra
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1">
              Centro de Simulación y Táctica
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Define tu estilo de juego, mentalidad, capitán y lanzador de penaltis. Los partidos se simulan automáticamente en función de tu once, química y plan táctico.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 shrink-0">
            <div>
              <span className="text-xs text-slate-300 block">Tu once · Química</span>
              <span className="font-mono-nums text-xl font-bold text-white">
                {startersCount}/11 · OVR {userAvgOvr} (+{chemistry.ovrBonus})
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-300 block">Presupuesto</span>
              <span className="font-mono-nums text-xl font-bold text-amber-400">
                €{club.budget.toFixed(1)}M
              </span>
            </div>
          </div>
        </div>
      </div>

      {startersCount < 11 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-amber-200">
            Necesitas completar los <strong>11 titulares</strong> en tu campo antes de simular un partido (llevas {startersCount}/11).
          </p>
          <button
            type="button"
            onClick={onGoToSquad}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-400 text-[#0B1117] hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Ir a Mi Plantilla
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-200">
          {errorMsg}
        </div>
      )}

      {/* Real Match Tactics Board */}
      <section className="p-5 rounded-xl bg-[#151E29] border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h2 className="font-display text-2xl font-bold text-white">
              Táctica real de partido · {formation.name}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {savingTactics
              ? 'Guardando pizarra...'
              : `Química activa: ${chemistry.totalScore}/100 (+${chemistry.ovrBonus} OVR)`}
          </span>
        </div>

        {/* Play style selector */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-300">Estilo de juego</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {PLAY_STYLES.map((style) => {
              const active = tactics.playStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  disabled={savingTactics}
                  onClick={() => handleTacticChange({ playStyle: style.id as PlayStyleId })}
                  className={`text-left p-3.5 rounded-xl border transition-colors flex flex-col justify-between gap-2 ${
                    active
                      ? 'bg-emerald-500/15 border-emerald-400'
                      : 'bg-[#0F1620] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-white">{style.label}</p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {style.shortDesc}
                    </p>
                  </div>
                  <p className="text-[11px] font-medium text-emerald-300 pt-1 border-t border-white/10">
                    {style.effectSummary}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mentality + Captain + Penalty Taker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Mentalidad del equipo
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-[#0B1117] p-1 rounded-lg border border-white/15">
              {MENTALITIES.map((m) => {
                const active = tactics.mentality === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={savingTactics}
                    onClick={() => handleTacticChange({ mentality: m.id as MentalityId })}
                    className={`py-2 px-2 rounded-md text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-emerald-500 text-[#07130D]'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              {MENTALITIES.find((m) => m.id === tactics.mentality)?.summary}
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="captain-select"
              className="text-xs font-semibold text-slate-300 block"
            >
              Capitán del once (+0.6 liderazgo)
            </label>
            <select
              id="captain-select"
              value={tactics.captainId || ''}
              disabled={savingTactics || starterPlayers.length === 0}
              onChange={(e) => handleTacticChange({ captainId: e.target.value || null })}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="">Automático (sin brazalete fijo)</option>
              {starterPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.shortName} · {p.position} · OVR {p.overall}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              El capitán aparece con la «C» en tu campo táctico.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="penalty-select"
              className="text-xs font-semibold text-slate-300 block"
            >
              Lanzador de penaltis y faltas
            </label>
            <select
              id="penalty-select"
              value={tactics.penaltyTakerId || ''}
              disabled={savingTactics || starterPlayers.length === 0}
              onChange={(e) => handleTacticChange({ penaltyTakerId: e.target.value || null })}
              className="w-full px-3 py-2.5 rounded-lg bg-[#0B1117] border border-white/15 text-sm text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="">Automático (mejor tiro del once)</option>
              {starterPlayers
                .slice()
                .sort((a, b) => b.stats.shooting - a.stats.shooting)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.shortName} · Tiro {p.stats.shooting} · OVR {p.overall}
                  </option>
                ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Ejecuta los penaltis y faltas directas en la simulación.
            </p>
          </div>
        </div>
      </section>

      {/* Difficulty selection */}
      <section className="space-y-3">
        <h2 className="font-display text-2xl font-bold text-white">
          Elige el rival Bot para simular
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIFFICULTIES.map((d) => {
            const active = d.id === difficulty;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficulty(d.id)}
                className={`text-left p-5 rounded-xl border transition-colors flex flex-col justify-between gap-4 ${
                  active
                    ? 'bg-emerald-500/15 border-emerald-400'
                    : 'bg-[#151E29] border-white/10 hover:border-white/25'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xl font-bold text-white">
                      {d.label}
                    </span>
                    <span className="font-mono-nums text-xs font-bold text-amber-400">
                      OVR {d.botOvr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{d.botName}</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{d.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Victoria</span>
                    <span className="font-mono-nums font-bold text-emerald-400">+€{d.win}M</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Empate</span>
                    <span className="font-mono-nums font-bold text-white">+€{d.draw}M</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Derrota</span>
                    <span className="font-mono-nums font-bold text-slate-300">+€{d.loss}M</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <p className="text-xs text-slate-400">
            Plan activo: <strong className="text-white">{selectedStyle.label}</strong> · Química{' '}
            <strong className="text-emerald-400">{chemistry.totalScore}/100</strong>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={startersCount < 11 || isRequesting || isPlayingLive}
              onClick={() => handleStartSimulation(true)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-lg text-xs font-semibold bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Simulación instantánea</span>
            </button>
            <button
              type="button"
              disabled={startersCount < 11 || isRequesting || isPlayingLive}
              onClick={() => handleStartSimulation(false)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-emerald-500 text-[#07130D] hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {isRequesting
                  ? 'Calculando simulación...'
                  : isPlayingLive
                  ? `Simulando minuto ${liveMinute}'`
                  : 'Simular partido en vivo'}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Active Match Scoreboard, Live Tactical Radar & Commentary */}
      {activeMatch && (
        <section className="p-6 rounded-xl bg-[#151E29] border border-white/15 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Swords className="w-4 h-4 text-emerald-400" />
              <span>
                Simulación {activeMatch.difficultyLabel} · {activeMatch.playStyleLabel} · Minuto{' '}
                <strong className="font-mono-nums text-white">{liveMinute}&apos;</strong>
              </span>
            </div>

            {isPlayingLive ? (
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg bg-[#0B1117] border border-white/15 p-0.5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setSimSpeed('1x')}
                    className={`px-2 py-1 rounded ${
                      simSpeed === '1x' ? 'bg-emerald-500 text-[#07130D]' : 'text-slate-300'
                    }`}
                  >
                    1x
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimSpeed('3x')}
                    className={`px-2 py-1 rounded ${
                      simSpeed === '3x' ? 'bg-emerald-500 text-[#07130D]' : 'text-slate-300'
                    }`}
                  >
                    3x
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSkipToEnd}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  Ir al resultado final
                </button>
              </div>
            ) : (
              <div className="text-xs font-semibold text-emerald-400 font-mono-nums">
                Simulación finalizada · Premio ingresado: +€{activeMatch.reward}M
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 items-center text-center gap-4">
            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-white truncate">
                {club.name}
              </p>
              <p className="text-xs text-slate-400 font-mono-nums">
                OVR {activeMatch.userOverall} · Química {activeMatch.chemistryScore}/100 (+
                {activeMatch.chemistryBonus})
              </p>
            </div>

            <div className="font-display text-4xl sm:text-5xl font-extrabold text-white font-mono-nums">
              {liveUserGoals} - {liveBotGoals}
            </div>

            <div>
              <p className="font-display text-xl sm:text-2xl font-bold text-white truncate">
                {activeMatch.botTeamName}
              </p>
              <p className="text-xs text-slate-400 font-mono-nums">
                OVR {activeMatch.botOverall}
              </p>
            </div>
          </div>

          {/* Mini 2D Tactical Simulation Pitch Radar */}
          <div className="space-y-2">
            <div className="relative h-14 rounded-lg bg-[#0D3B23] border border-white/15 overflow-hidden flex items-center">
              <div className="absolute inset-y-0 left-1/2 w-px bg-white/25" />
              <div className="absolute left-0 inset-y-2 w-6 border border-l-0 border-white/25" />
              <div className="absolute right-0 inset-y-2 w-6 border border-r-0 border-white/25" />
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md ring-4 ring-emerald-400/40 transition-all duration-200"
                style={{ left: `${ballZonePct}%` }}
                aria-hidden="true"
              />
              <div className="relative z-10 w-full px-3 flex items-center justify-between text-[11px] font-medium text-white/80 pointer-events-none">
                <span>Tu área</span>
                <span>Zona táctica ({liveMinute}&apos;/90&apos;)</span>
                <span>Área rival</span>
              </div>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0B1117] overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-150"
                style={{ width: `${(liveMinute / 90) * 100}%` }}
              />
            </div>
          </div>

          {!isPlayingLive && (
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10 text-center text-xs">
              <div>
                <span className="text-slate-400 block">Posesión</span>
                <span className="font-mono-nums font-bold text-white">
                  {activeMatch.possessionUser}% - {100 - activeMatch.possessionUser}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Remates</span>
                <span className="font-mono-nums font-bold text-white">
                  {activeMatch.shotsUser} - {activeMatch.shotsBot}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Recompensa</span>
                <span className="font-mono-nums font-bold text-emerald-400">
                  +€{activeMatch.reward}M
                </span>
              </div>
            </div>
          )}

          {/* Minute-by-minute events */}
          <div className="space-y-2 pt-2 border-t border-white/10 max-h-60 overflow-y-auto">
            {visibleEvents.length > 0 ? (
              visibleEvents.map((ev, idx) => (
                <div
                  key={`${ev.minute}-${idx}`}
                  className="flex items-start gap-3 py-2 px-3 rounded-lg bg-[#0F1620] text-xs"
                >
                  <span className="font-mono-nums font-bold text-amber-400 w-9 shrink-0">
                    {ev.minute}&apos;
                  </span>
                  <div>
                    <p className="font-semibold text-white">{ev.title}</p>
                    <p className="text-slate-400 mt-0.5">{ev.detail}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-2">
                Simulando inicio del encuentro según tu táctica y química...
              </p>
            )}
          </div>
        </section>
      )}

      {/* Recent Match History */}
      {club.matchHistory && club.matchHistory.length > 0 && (
        <section className="p-5 rounded-xl bg-[#151E29] border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h2 className="font-display text-xl font-bold text-white">
              Últimas simulaciones disputadas
            </h2>
          </div>
          <div className="divide-y divide-white/10">
            {club.matchHistory.slice(0, 6).map((m) => (
              <div
                key={m.id}
                className="py-2.5 flex items-center justify-between gap-4 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">
                    {club.name}{' '}
                    <span className="font-mono-nums text-amber-400">
                      {m.userGoals} - {m.botGoals}
                    </span>{' '}
                    {m.botTeamName}
                  </p>
                  <p className="text-slate-400">
                    {m.difficultyLabel}
                    {m.playStyleLabel ? ` · ${m.playStyleLabel}` : ''}
                    {typeof m.chemistryScore === 'number' ? ` · Química ${m.chemistryScore}/100` : ''}
                  </p>
                </div>
                <span className="font-mono-nums font-bold text-emerald-400 shrink-0">
                  +€{m.reward}M
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
