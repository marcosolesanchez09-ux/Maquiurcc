import React, { useCallback, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import type {
  BootstrapPayload,
  BotDifficulty,
  CareerSummary,
  ClubProfile,
  MatchResult,
  MatchTactics,
  PlayStyleId,
  Player,
  PositionGroup,
} from './shared/types';
import { getFormationById } from './shared/formations';
import { SquadView } from './components/SquadView';
import { DailyShopView } from './components/DailyShopView';
import { MarketView } from './components/MarketView';
import { MatchArenaView } from './components/MatchArenaView';
import { WorldSearchView } from './components/WorldSearchView';
import { BreakingNewsSection } from './components/BreakingNewsSection';
import { ClubSettingsModal } from './components/ClubSettingsModal';
import { WelcomeGuideModal } from './components/WelcomeGuideModal';
import { playSigningChime } from './utils/soundFx';

type ActiveTab = 'squad' | 'shop' | 'market' | 'matches' | 'search';

const STORAGE_CLUB_KEY = 'elevendraft_club_id';
const STORAGE_INTRO_KEY = 'maquiurcc_intro_seen';
const STORAGE_CAREERS_KEY = 'maquiurcc_careers_v1';
const MAX_CAREERS = 5;

interface LocalCareerStore {
  order: string[];
  snapshots: Record<
    string,
    {
      club: ClubProfile;
      externalPlayers: Record<string, Player>;
    }
  >;
}

function readCareerStore(): LocalCareerStore {
  try {
    const raw = localStorage.getItem(STORAGE_CAREERS_KEY);
    if (!raw) return { order: [], snapshots: {} };
    const parsed = JSON.parse(raw) as LocalCareerStore;
    return {
      order: Array.isArray(parsed.order) ? parsed.order.slice(0, MAX_CAREERS) : [],
      snapshots: parsed.snapshots && typeof parsed.snapshots === 'object' ? parsed.snapshots : {},
    };
  } catch {
    return { order: [], snapshots: {} };
  }
}

function writeCareerStore(store: LocalCareerStore): void {
  try {
    const trimmedOrder = store.order.slice(0, MAX_CAREERS);
    const trimmedSnapshots: LocalCareerStore['snapshots'] = {};
    for (const id of trimmedOrder) {
      if (store.snapshots[id]) {
        trimmedSnapshots[id] = store.snapshots[id];
      }
    }
    localStorage.setItem(
      STORAGE_CAREERS_KEY,
      JSON.stringify({ order: trimmedOrder, snapshots: trimmedSnapshots })
    );
  } catch {
    // Ignore quota errors
  }
}

function upsertCareerSnapshot(payload: BootstrapPayload): LocalCareerStore {
  const store = readCareerStore();
  const extPlayers: Record<string, Player> = {};
  for (const [pid, p] of Object.entries(payload.ownedPlayers || {})) {
    if (p && p.isExternalScout) {
      extPlayers[pid] = p;
    }
  }
  const existingIdx = store.order.indexOf(payload.club.id);
  if (existingIdx === -1) {
    if (store.order.length >= MAX_CAREERS) {
      const evicted = store.order.pop();
      if (evicted) delete store.snapshots[evicted];
    }
    store.order.unshift(payload.club.id);
  }
  store.snapshots[payload.club.id] = {
    club: payload.club,
    externalPlayers: extPlayers,
  };
  writeCareerStore(store);
  return store;
}

export default function App() {
  const [data, setData] = useState<BootstrapPayload | null>(null);
  const [careers, setCareers] = useState<CareerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('squad');
  const [shopPosFilter, setShopPosFilter] = useState<PositionGroup | 'ALL'>('ALL');
  const [marketPosFilter, setMarketPosFilter] = useState<PositionGroup | 'ALL'>('ALL');
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_INTRO_KEY) !== '1';
    } catch {
      return true;
    }
  });

  const handleCloseGuide = useCallback(() => {
    setGuideOpen(false);
    try {
      localStorage.setItem(STORAGE_INTRO_KEY, '1');
    } catch {
      // Ignore storage failures
    }
  }, []);

  const showToast = useCallback((type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const refreshCareersList = useCallback(async (store?: LocalCareerStore) => {
    const activeStore = store || readCareerStore();
    if (activeStore.order.length === 0) {
      setCareers([]);
      return;
    }
    try {
      const resp = await fetch(`/api/clubs?ids=${encodeURIComponent(activeStore.order.join(','))}`);
      if (resp.ok) {
        const json = (await resp.json()) as { careers: CareerSummary[] };
        if (Array.isArray(json.careers) && json.careers.length > 0) {
          setCareers(json.careers);
          return;
        }
      }
    } catch {
      // Fallback to local snapshot summaries
    }
    const fallback: CareerSummary[] = activeStore.order
      .map((id) => activeStore.snapshots[id]?.club)
      .filter((c): c is ClubProfile => Boolean(c))
      .map((c) => ({
        id: c.id,
        name: c.name,
        managerName: c.managerName,
        budget: c.budget,
        draftCompleted: c.draftCompleted,
        formationId: c.formationId,
        playStyle: c.tactics?.playStyle || 'balanced',
        startersCount: (c.starters || []).filter(Boolean).length,
        benchCount: (c.bench || []).filter(Boolean).length,
        avgOverall: 0,
        record: c.record || { wins: 0, draws: 0, losses: 0 },
        createdAt: c.createdAt,
      }));
    setCareers(fallback);
  }, []);

  // Automatically persist active career snapshot locally on every update
  useEffect(() => {
    if (!data) return;
    localStorage.setItem(STORAGE_CLUB_KEY, data.club.id);
    const updatedStore = upsertCareerSnapshot(data);
    refreshCareersList(updatedStore);
  }, [data, refreshCareersList]);

  const loadBootstrap = useCallback(async () => {
    setLoading(true);
    try {
      const store = readCareerStore();
      const savedId = localStorage.getItem(STORAGE_CLUB_KEY) || store.order[0] || '';

      // Restore any locally backed-up careers that the server doesn't have (e.g. after server restart)
      if (store.order.length > 0) {
        const checkResp = await fetch(`/api/clubs?ids=${encodeURIComponent(store.order.join(','))}`);
        const existingIds = new Set<string>();
        if (checkResp.ok) {
          const checkJson = (await checkResp.json()) as { careers: CareerSummary[] };
          for (const c of checkJson.careers || []) existingIds.add(c.id);
        }
        for (const id of store.order) {
          if (!existingIds.has(id) && store.snapshots[id]) {
            await fetch('/api/club/restore', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(store.snapshots[id]),
            });
          }
        }
      }

      const url = savedId ? `/api/bootstrap?clubId=${encodeURIComponent(savedId)}` : '/api/bootstrap';
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Error al conectar con el servidor del club.');
      const payload = (await resp.json()) as BootstrapPayload;
      localStorage.setItem(STORAGE_CLUB_KEY, payload.club.id);
      setData(payload);
    } catch (err) {
      showToast('err', err instanceof Error ? err.message : 'No se pudo cargar tu club.');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadBootstrap();
  }, [loadBootstrap]);

  const postAction = async <T = BootstrapPayload>(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<T> => {
    const doFetch = async () => {
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = (await resp.json()) as T & { error?: string };
      return { resp, json };
    };

    let { resp, json } = await doFetch();

    // Auto-recover transparently if server restarted or a Cloud Run instance didn't have the club yet
    if (
      !resp.ok &&
      resp.status === 404 &&
      endpoint !== '/api/club/restore' &&
      data?.club
    ) {
      const extPlayers: Record<string, Player> = {};
      for (const [pid, p] of Object.entries(data.ownedPlayers || {})) {
        if (p && p.isExternalScout) extPlayers[pid] = p;
      }
      const restoreResp = await fetch('/api/club/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ club: data.club, externalPlayers: extPlayers }),
      });
      if (restoreResp.ok) {
        ({ resp, json } = await doFetch());
      }
    }

    if (!resp.ok) {
      const msg = json.error || 'Operación no permitida.';
      showToast('err', msg);
      throw new Error(msg);
    }
    return json;
  };

  const handleChangeFormationPreset = async (formationId: string) => {
    if (!data) return;
    const next = await postAction<BootstrapPayload>('/api/club/formation', {
      clubId: data.club.id,
      formationId,
    });
    setData(next);
    showToast('ok', `Formación actualizada a ${formationId}.`);
  };

  const handleChangeFormationCustom = async (def: number, med: number, del: number) => {
    if (!data) return;
    const next = await postAction<BootstrapPayload>('/api/club/formation', {
      clubId: data.club.id,
      custom: { def, med, del },
    });
    setData(next);
    showToast('ok', `Esquema táctico ${def}-${med}-${del} aplicado.`);
  };

  const handleUpdateTactics = async (tactics: MatchTactics) => {
    if (!data) return;
    const next = await postAction<BootstrapPayload>('/api/club/tactics', {
      clubId: data.club.id,
      ...tactics,
    });
    setData(next);
    showToast('ok', 'Pizarra táctica actualizada para el próximo partido.');
  };

  const handleUpdateLineup = async (payload: {
    action: 'assign' | 'move_to_reserves' | 'move_to_bench';
    playerId: string;
    targetType?: 'starter' | 'bench' | 'reserves';
    targetIndex?: number;
  }) => {
    if (!data) return;
    const next = await postAction<BootstrapPayload>('/api/club/lineup', {
      clubId: data.club.id,
      ...payload,
    });
    setData(next);
  };

  const handleDraftSign = async (
    player: import('./shared/types').Player,
    targetType?: 'starter' | 'bench',
    targetIndex?: number
  ) => {
    if (!data) return;
    const res = await postAction<{ draftJustCompleted: boolean; bootstrap: BootstrapPayload }>(
      '/api/draft/sign',
      {
        clubId: data.club.id,
        playerId: player.id,
        playerData: player,
        targetType,
        targetIndex,
      }
    );
    setData(res.bootstrap);
    playSigningChime();
    if (res.draftJustCompleted) {
      showToast(
        'ok',
        '¡11 titulares y 3 suplentes completados! Tu presupuesto se ha fijado en €50.0M para la Tienda Diaria y el Mercado.'
      );
    } else {
      showToast('ok', `${player.shortName} fichado en el Draft Inicial.`);
    }
  };

  const handleDraftRelease = async (playerId: string) => {
    if (!data) return;
    const next = await postAction<BootstrapPayload>('/api/draft/release', {
      clubId: data.club.id,
      playerId,
    });
    setData(next);
    showToast('ok', 'Jugador descartado y saldo devuelto al presupuesto del Draft.');
  };

  const handleBuyFromShop = async (playerId: string) => {
    if (!data) return;
    const wasDraft = !data.club.draftCompleted;
    const next = await postAction<BootstrapPayload>('/api/shop/buy', {
      clubId: data.club.id,
      playerId,
    });
    setData(next);
    playSigningChime();
    if (wasDraft && next.club.draftCompleted) {
      showToast(
        'ok',
        '¡11 titulares y 3 suplentes completados! Tu presupuesto se ha fijado en €50.0M.'
      );
    } else {
      const signed = next.ownedPlayers[playerId];
      showToast('ok', `Fichaje cerrado: ${signed ? signed.shortName : 'Jugador'} se une a tu club.`);
    }
  };

  const handleListPlayer = async (playerId: string, price: number) => {
    if (!data) return;
    const next = await postAction<BootstrapPayload>('/api/market/list', {
      clubId: data.club.id,
      playerId,
      price,
    });
    setData(next);
    showToast('ok', `Jugador publicado en el mercado por €${price}M.`);
  };

  const handleCancelListing = async (listingId: string) => {
    if (!data) return;
    const next = await postAction<BootstrapPayload>('/api/market/cancel', {
      clubId: data.club.id,
      listingId,
    });
    setData(next);
    showToast('ok', 'Jugador retirado del mercado y devuelto a tu plantilla.');
  };

  const handleBuyFromMarket = async (listingId: string) => {
    if (!data) return;
    const wasDraft = !data.club.draftCompleted;
    const next = await postAction<BootstrapPayload>('/api/market/buy', {
      clubId: data.club.id,
      listingId,
    });
    setData(next);
    playSigningChime();
    if (wasDraft && next.club.draftCompleted) {
      showToast(
        'ok',
        '¡11 titulares y 3 suplentes completados! Tu presupuesto se ha fijado en €50.0M.'
      );
    } else {
      showToast('ok', 'Traspaso completado en el mercado de clubes.');
    }
  };

  const handlePlayMatch = async (difficulty: BotDifficulty): Promise<MatchResult> => {
    if (!data) throw new Error('Club no disponible.');
    const res = await postAction<{ match: MatchResult; bootstrap: BootstrapPayload }>(
      '/api/match/play',
      {
        clubId: data.club.id,
        difficulty,
      }
    );
    setData(res.bootstrap);
    return res.match;
  };

  const handleUpdateClub = async (name: string, managerName: string) => {
    if (!data) return;
    const next = await postAction<BootstrapPayload>('/api/club/update', {
      clubId: data.club.id,
      name,
      managerName,
    });
    setData(next);
    showToast('ok', 'Datos del club actualizados.');
  };

  const handleCreateNewClub = async (
    name: string,
    managerName: string,
    formationId: string,
    playStyle: PlayStyleId
  ) => {
    const store = readCareerStore();
    if (store.order.length >= MAX_CAREERS) {
      showToast('err', `Máximo de ${MAX_CAREERS} carreras alcanzado. Elimina una primero.`);
      return;
    }
    const next = await postAction<BootstrapPayload>('/api/club/create', {
      name,
      managerName,
      formationId,
      playStyle,
    });
    localStorage.setItem(STORAGE_CLUB_KEY, next.club.id);
    setData(next);
    showToast('ok', `Nueva carrera "${next.club.name}" creada con €750M.`);
  };

  const handleLoadCareer = async (targetClubId: string) => {
    const store = readCareerStore();
    const resp = await fetch(`/api/bootstrap?clubId=${encodeURIComponent(targetClubId)}`);
    if (!resp.ok) {
      showToast('err', 'No se pudo cargar la carrera seleccionada.');
      return;
    }
    let payload = (await resp.json()) as BootstrapPayload;
    if (payload.club.id !== targetClubId && store.snapshots[targetClubId]) {
      payload = await postAction<BootstrapPayload>(
        '/api/club/restore',
        store.snapshots[targetClubId]
      );
    }
    localStorage.setItem(STORAGE_CLUB_KEY, payload.club.id);
    setData(payload);
    showToast('ok', `Carrera cargada: ${payload.club.name}`);
  };

  const handleDeleteCareer = async (targetClubId: string) => {
    const store = readCareerStore();
    const remainingIds = store.order.filter((id) => id !== targetClubId);
    if (remainingIds.length === 0) {
      showToast('err', 'Debes conservar al menos una carrera activa.');
      return;
    }

    try {
      await fetch(`/api/club/${encodeURIComponent(targetClubId)}`, { method: 'DELETE' });
    } catch {
      // Ignore if already absent on server
    }

    delete store.snapshots[targetClubId];
    store.order = remainingIds;
    writeCareerStore(store);

    if (data?.club.id === targetClubId) {
      await handleLoadCareer(remainingIds[0]);
    } else {
      await refreshCareersList(store);
    }
    showToast('ok', 'Carrera eliminada.');
  };

  const activeFormation = data
    ? getFormationById(data.club.formationId, data.club.customFormation)
    : getFormationById('4-3-3');

  return (
    <div className="min-h-screen flex flex-col bg-[#0B1117] text-[#F1F5F9]">
      {/* Strict 3-Zone Single-Row Top Bar */}
      <header className="sticky top-0 z-40 bg-[#0B1117]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Wordmark only */}
          <button
            type="button"
            onClick={() => setActiveTab('squad')}
            className="font-display text-2xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
          >
            Maquiurcc.com
          </button>

          {/* Zone 2: 5 concise single-line nav links */}
          <nav
            aria-label="Navegación principal"
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar"
          >
            {(
              [
                { id: 'squad', label: 'Mi Plantilla' },
                { id: 'shop', label: 'Tienda Diaria' },
                { id: 'market', label: 'Mercado' },
                { id: 'matches', label: 'Partidos' },
                { id: 'search', label: 'Buscador' },
              ] as const
            ).map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-white border-emerald-400'
                      : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Top-right Gear for Careers & Settings (always visible) */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Carreras y ajustes del club"
              title="Carreras y ajustes"
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#151E29] border border-white/15 text-white hover:border-emerald-400/60 hover:bg-[#1A2533] transition-colors whitespace-nowrap shrink-0"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Carreras</span>
            </button>
          </div>
        </div>
      </header>

      {/* Non-blocking feedback toast */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-xl border text-sm font-medium shadow-lg ${
            toast.type === 'ok'
              ? 'bg-[#10261C] border-emerald-500/40 text-emerald-100'
              : 'bg-[#291315] border-red-500/40 text-red-100'
          }`}
        >
          {toast.text}
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12">
        {loading || !data ? (
          <div className="space-y-6">
            <div className="h-24 rounded-xl bg-[#151E29] border border-white/10 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 h-[540px] rounded-xl bg-[#151E29] border border-white/10 animate-pulse" />
              <div className="lg:col-span-5 h-[540px] rounded-xl bg-[#151E29] border border-white/10 animate-pulse" />
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'squad' && (
              <SquadView
                club={data.club}
                formation={activeFormation}
                formations={data.formations}
                ownedPlayers={data.ownedPlayers}
                onChangeFormationPreset={handleChangeFormationPreset}
                onChangeFormationCustom={handleChangeFormationCustom}
                onUpdateLineup={handleUpdateLineup}
                onDraftSign={handleDraftSign}
                onDraftRelease={handleDraftRelease}
                onListPlayerForSale={handleListPlayer}
                onGoToShop={(pos) => {
                  setShopPosFilter(pos || 'ALL');
                  setActiveTab('shop');
                }}
                onGoToMarket={(pos) => {
                  setMarketPosFilter(pos || 'ALL');
                  setActiveTab('market');
                }}
                onGoToSearch={() => setActiveTab('search')}
                onOpenGuide={() => setGuideOpen(true)}
              />
            )}

            {activeTab === 'shop' && (
              <DailyShopView
                club={data.club}
                dailyShop={data.dailyShop}
                ownedPlayers={data.ownedPlayers}
                initialPositionFilter={shopPosFilter}
                onBuyFromShop={handleBuyFromShop}
              />
            )}

            {activeTab === 'market' && (
              <MarketView
                club={data.club}
                ownedPlayers={data.ownedPlayers}
                marketListings={data.marketListings}
                leaderboard={data.leaderboard}
                initialPositionFilter={marketPosFilter}
                onBuyListing={handleBuyFromMarket}
                onCancelListing={handleCancelListing}
                onListPlayer={handleListPlayer}
              />
            )}

            {activeTab === 'matches' && (
              <MatchArenaView
                club={data.club}
                formation={activeFormation}
                ownedPlayers={data.ownedPlayers}
                onUpdateTactics={handleUpdateTactics}
                onPlayMatch={handlePlayMatch}
                onGoToSquad={() => setActiveTab('squad')}
              />
            )}

            {activeTab === 'search' && (
              <WorldSearchView
                clubId={data.club.id}
                clubBudget={data.club.budget}
                draftCompleted={data.club.draftCompleted}
                ownedPlayers={data.ownedPlayers}
                onDraftSign={handleDraftSign}
                onBuyFromShop={handleBuyFromShop}
                onBuyFromMarket={handleBuyFromMarket}
              />
            )}
          </>
        )}

        {/* Breaking Football News Module */}
        <BreakingNewsSection />
      </main>

      <footer className="border-t border-white/10 py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>Maquiurcc.com · Presupuesto inicial 750M € · 11 titulares, 3 suplentes y reservas ilimitadas</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setGuideOpen(true)}
              className="hover:text-white transition-colors"
            >
              Cómo jugar
            </button>
            <a href="#noticias-ultima-hora" className="hover:text-white transition-colors">
              Última hora
            </a>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="hover:text-white transition-colors"
            >
              Ajustes del club
            </button>
          </div>
        </div>
      </footer>

      {data && (
        <ClubSettingsModal
          open={settingsOpen}
          club={data.club}
          careers={careers}
          formations={data.formations}
          maxCareers={MAX_CAREERS}
          onClose={() => setSettingsOpen(false)}
          onLoadCareer={handleLoadCareer}
          onDeleteCareer={handleDeleteCareer}
          onUpdateClub={handleUpdateClub}
          onCreateNewClub={handleCreateNewClub}
        />
      )}

      <WelcomeGuideModal open={guideOpen} onClose={handleCloseGuide} />
    </div>
  );
}
