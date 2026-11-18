import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  PRESET_FORMATIONS,
  buildCustomFormation,
  getFormationById,
  isPositionCompatible,
  validateCustomFormation,
} from './src/shared/formations.ts';
import { calculateTeamChemistry } from './src/shared/chemistry.ts';
import {
  DEFAULT_TACTICS,
  MENTALITIES,
  PLAY_STYLES,
  getMentalityConfig,
  getPlayStyleConfig,
} from './src/shared/tactics.ts';
import { PLAYERS_BY_ID, PLAYERS_CATALOG } from './src/shared/playersCatalog.ts';
import type {
  BotDifficulty,
  CareerSummary,
  ClubLeaderboardEntry,
  ClubProfile,
  LeagueName,
  MarketListing,
  MatchEvent,
  MatchResult,
  MatchTactics,
  MentalityId,
  NewsArticle,
  PlayStyleId,
  Player,
  PositionGroup,
  RoleCode,
  SearchPlayerResult,
} from './src/shared/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const INITIAL_BUDGET = 750;
const POST_DRAFT_BUDGET = 50;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'elevendraft-db.json');

interface PersistedState {
  clubs: Record<string, ClubProfile>;
  marketListings: MarketListing[];
  externalPlayers: Record<string, Player>;
  seededMarketDate: string;
}

interface DifficultyConfig {
  id: BotDifficulty;
  label: string;
  botTeamName: string;
  botOverall: number;
  winReward: number;
  drawReward: number;
  lossReward: number;
}

const BOT_DIFFICULTIES: Record<BotDifficulty, DifficultyConfig> = {
  amateur: {
    id: 'amateur',
    label: 'Amateur',
    botTeamName: 'CD Valle Nuevo Bot',
    botOverall: 76,
    winReward: 18,
    drawReward: 7,
    lossReward: 2,
  },
  profesional: {
    id: 'profesional',
    label: 'Profesional',
    botTeamName: 'Real Iberia Bot',
    botOverall: 82,
    winReward: 35,
    drawReward: 14,
    lossReward: 4,
  },
  clase_mundial: {
    id: 'clase_mundial',
    label: 'Clase Mundial',
    botTeamName: 'Milano Élite Bot',
    botOverall: 86,
    winReward: 60,
    drawReward: 22,
    lossReward: 6,
  },
  leyenda: {
    id: 'leyenda',
    label: 'Leyenda',
    botTeamName: 'Europa Galáctica XI',
    botOverall: 90,
    winReward: 95,
    drawReward: 35,
    lossReward: 8,
  },
};

function getTodayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getNextUtcMidnightIso(): string {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  return next.toISOString();
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createPrng(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function pickDeterministic<T>(items: T[], count: number, rng: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function getDailyShopPlayers(dateKey: string): Player[] {
  const rng = createPrng(hashSeed(`daily-shop-${dateKey}`));
  const eligible = PLAYERS_CATALOG.filter((p) => p.dailyEligible);

  const por = pickDeterministic(eligible.filter((p) => p.position === 'POR'), 2, rng);
  const def = pickDeterministic(eligible.filter((p) => p.position === 'DEF'), 4, rng);
  const med = pickDeterministic(eligible.filter((p) => p.position === 'MED'), 3, rng);
  const del = pickDeterministic(eligible.filter((p) => p.position === 'DEL'), 3, rng);

  return [...por, ...def, ...med, ...del];
}

const RIVAL_CLUBS = [
  { id: 'rival-norte', name: 'Atlético Norte', manager: 'M. Mendoza' },
  { id: 'rival-milano', name: 'Calcio Milano', manager: 'L. Conti' },
  { id: 'rival-riviera', name: 'Olympique Riviera', manager: 'T. Moreau' },
  { id: 'rival-baviera', name: 'Sportverein Süd', manager: 'K. Weber' },
  { id: 'rival-london', name: 'Thames United', manager: 'J. Sterling' },
];

function generateRivalListings(dateKey: string, dailyIds: Set<string>): MarketListing[] {
  const rng = createPrng(hashSeed(`rival-market-${dateKey}`));
  const pool = PLAYERS_CATALOG.filter((p) => p.dailyEligible && !dailyIds.has(p.id));
  const picked = pickDeterministic(pool, 14, rng);

  return picked.map((player, index) => {
    const rival = RIVAL_CLUBS[index % RIVAL_CLUBS.length];
    const multiplier = 0.92 + rng() * 0.24;
    const price = Math.max(10, Math.round(player.marketValue * multiplier));
    return {
      id: `mkt-${dateKey}-${player.id}`,
      playerId: player.id,
      player,
      sellerClubId: rival.id,
      sellerClubName: rival.name,
      sellerManager: rival.manager,
      price,
      listedAt: new Date(Date.now() - Math.floor(rng() * 18000000)).toISOString(),
      isSystemClub: true,
    };
  });
}

function resolvePlayer(state: PersistedState, playerId: string): Player | undefined {
  return PLAYERS_BY_ID[playerId] || state.externalPlayers?.[playerId];
}

function checkAndFinalizeDraft(club: ClubProfile): boolean {
  if (club.draftCompleted) return false;
  const startersCount = club.starters.filter(Boolean).length;
  const benchCount = club.bench.filter(Boolean).length;
  if (startersCount === 11 && benchCount === 3) {
    club.draftCompleted = true;
    club.budget = POST_DRAFT_BUDGET;
    return true;
  }
  return false;
}

function normalizeClub(club: ClubProfile): ClubProfile {
  const startersCount = (club.starters || []).filter(Boolean).length;
  const benchCount = (club.bench || []).filter(Boolean).length;
  const tactics: MatchTactics = {
    playStyle: club.tactics?.playStyle || DEFAULT_TACTICS.playStyle,
    mentality: club.tactics?.mentality || DEFAULT_TACTICS.mentality,
    captainId: club.tactics?.captainId ?? null,
    penaltyTakerId: club.tactics?.penaltyTakerId ?? null,
  };
  return {
    ...club,
    tactics,
    draftCompleted:
      typeof club.draftCompleted === 'boolean'
        ? club.draftCompleted
        : startersCount === 11 && benchCount === 3,
    matchHistory: Array.isArray(club.matchHistory) ? club.matchHistory : [],
    record: club.record || { wins: 0, draws: 0, losses: 0 },
  };
}

function loadState(): PersistedState {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const today = getTodayDateKey();
  const dailyIds = new Set(getDailyShopPlayers(today).map((p) => p.id));

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as PersistedState;
      const clubs: Record<string, ClubProfile> = {};
      for (const [id, club] of Object.entries(parsed.clubs || {})) {
        clubs[id] = normalizeClub(club);
      }
      const userListings = (parsed.marketListings || []).filter((l) => !l.isSystemClub);
      if (parsed.seededMarketDate !== today) {
        const refreshedRivals = generateRivalListings(today, dailyIds);
        const state: PersistedState = {
          clubs,
          marketListings: [...userListings, ...refreshedRivals],
          externalPlayers: parsed.externalPlayers || {},
          seededMarketDate: today,
        };
        saveState(state);
        return state;
      }
      return {
        clubs,
        marketListings: parsed.marketListings || [],
        externalPlayers: parsed.externalPlayers || {},
        seededMarketDate: parsed.seededMarketDate || today,
      };
    } catch {
      // Fallback to fresh state if file is unreadable
    }
  }

  const initialState: PersistedState = {
    clubs: {},
    marketListings: generateRivalListings(today, dailyIds),
    externalPlayers: {},
    seededMarketDate: today,
  };
  saveState(initialState);
  return initialState;
}

function saveState(state: PersistedState): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

function ensureDailyMarketSynced(state: PersistedState): void {
  const today = getTodayDateKey();
  if (state.seededMarketDate !== today) {
    const dailyIds = new Set(getDailyShopPlayers(today).map((p) => p.id));
    const userListings = state.marketListings.filter((l) => !l.isSystemClub);
    state.marketListings = [...userListings, ...generateRivalListings(today, dailyIds)];
    state.seededMarketDate = today;
    saveState(state);
  }
}

function getAllClubPlayerIds(club: ClubProfile): string[] {
  const ids: string[] = [];
  for (const id of club.starters) {
    if (id) ids.push(id);
  }
  for (const id of club.bench) {
    if (id) ids.push(id);
  }
  for (const id of club.reserves) {
    if (id) ids.push(id);
  }
  return ids;
}

function buildOwnedPlayersMap(state: PersistedState, club: ClubProfile): Record<string, Player> {
  const map: Record<string, Player> = {};
  for (const id of getAllClubPlayerIds(club)) {
    const p = resolvePlayer(state, id);
    if (p) map[id] = p;
  }
  return map;
}

function createClubRecord(
  name?: string,
  managerName?: string,
  formationId?: string,
  playStyle?: PlayStyleId
): ClubProfile {
  const cleanName = (name || 'Atlético Estrella').trim().slice(0, 32) || 'Atlético Estrella';
  const cleanManager = (managerName || 'Míster').trim().slice(0, 24) || 'Míster';
  const id = `club-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const validFormation = PRESET_FORMATIONS.some((f) => f.id === formationId) ? formationId! : '4-3-3';
  const validPlayStyle = PLAY_STYLES.some((s) => s.id === playStyle)
    ? playStyle!
    : DEFAULT_TACTICS.playStyle;
  return {
    id,
    name: cleanName,
    managerName: cleanManager,
    budget: INITIAL_BUDGET,
    draftCompleted: false,
    formationId: validFormation,
    customFormation: null,
    tactics: {
      ...DEFAULT_TACTICS,
      playStyle: validPlayStyle,
    },
    starters: Array(11).fill(null),
    bench: Array(3).fill(null),
    reserves: [],
    dailyPurchasedKeys: [],
    matchHistory: [],
    record: { wins: 0, draws: 0, losses: 0 },
    createdAt: new Date().toISOString(),
  };
}

function buildCareerSummary(state: PersistedState, club: ClubProfile): CareerSummary {
  const starterPlayers = club.starters
    .filter((id): id is string => Boolean(id))
    .map((id) => resolvePlayer(state, id))
    .filter((p): p is Player => Boolean(p));

  const avgOverall =
    starterPlayers.length > 0
      ? Math.round((starterPlayers.reduce((sum, p) => sum + p.overall, 0) / starterPlayers.length) * 10) / 10
      : 0;

  return {
    id: club.id,
    name: club.name,
    managerName: club.managerName,
    budget: club.budget,
    draftCompleted: club.draftCompleted,
    formationId: club.formationId,
    playStyle: club.tactics?.playStyle || 'balanced',
    startersCount: starterPlayers.length,
    benchCount: club.bench.filter(Boolean).length,
    avgOverall,
    record: club.record || { wins: 0, draws: 0, losses: 0 },
    createdAt: club.createdAt,
  };
}

function computeClubLeaderboard(state: PersistedState): ClubLeaderboardEntry[] {
  const userEntries: ClubLeaderboardEntry[] = Object.values(state.clubs).map((club) => {
    const starterPlayers = club.starters
      .filter((id): id is string => Boolean(id))
      .map((id) => resolvePlayer(state, id))
      .filter((p): p is Player => Boolean(p));

    const allPlayers = getAllClubPlayerIds(club)
      .map((id) => resolvePlayer(state, id))
      .filter((p): p is Player => Boolean(p));

    const avgOverall =
      starterPlayers.length > 0
        ? Math.round((starterPlayers.reduce((sum, p) => sum + p.overall, 0) / starterPlayers.length) * 10) / 10
        : 0;

    const squadValue = allPlayers.reduce((sum, p) => sum + p.marketValue, 0);

    return {
      id: club.id,
      name: club.name,
      managerName: club.managerName,
      formationId: club.formationId,
      startersCount: starterPlayers.length,
      benchCount: club.bench.filter(Boolean).length,
      reservesCount: club.reserves.length,
      avgOverall,
      squadValue,
      budget: club.budget,
      wins: club.record?.wins || 0,
    };
  });

  return userEntries
    .sort((a, b) => b.avgOverall - a.avgOverall || b.wins - a.wins || b.squadValue - a.squadValue)
    .slice(0, 20);
}

function placePurchasedPlayer(club: ClubProfile, player: Player): void {
  const formation = getFormationById(club.formationId, club.customFormation);

  const emptyStarterIdx = formation.slots.findIndex(
    (slot, idx) => club.starters[idx] === null && isPositionCompatible(player.position, slot.position)
  );
  if (emptyStarterIdx !== -1) {
    club.starters[emptyStarterIdx] = player.id;
    return;
  }

  const emptyBenchIdx = club.bench.findIndex((id) => id === null);
  if (emptyBenchIdx !== -1) {
    club.bench[emptyBenchIdx] = player.id;
    return;
  }

  club.reserves.push(player.id);
}

function removePlayerFromClub(club: ClubProfile, playerId: string): boolean {
  let removed = false;
  club.starters = club.starters.map((id) => {
    if (id === playerId) {
      removed = true;
      return null;
    }
    return id;
  });
  club.bench = club.bench.map((id) => {
    if (id === playerId) {
      removed = true;
      return null;
    }
    return id;
  });
  const beforeLen = club.reserves.length;
  club.reserves = club.reserves.filter((id) => id !== playerId);
  if (club.reserves.length !== beforeLen) removed = true;
  return removed;
}

function mapExternalPosition(rawPos?: string | null): { pos: PositionGroup; role: RoleCode } {
  const p = (rawPos || '').toLowerCase();
  if (p.includes('goalkeeper') || p.includes('keeper') || p === 'gk') {
    return { pos: 'POR', role: 'POR' };
  }
  if (p.includes('back') || p.includes('defender') || p.includes('centre-back')) {
    if (p.includes('left')) return { pos: 'DEF', role: 'LI' };
    if (p.includes('right')) return { pos: 'DEF', role: 'LD' };
    return { pos: 'DEF', role: 'DFC' };
  }
  if (p.includes('midfield') || p.includes('winger')) {
    if (p.includes('attacking')) return { pos: 'MED', role: 'MCO' };
    if (p.includes('defensive')) return { pos: 'MED', role: 'MCD' };
    return { pos: 'MED', role: 'MC' };
  }
  if (p.includes('forward') || p.includes('striker') || p.includes('wing')) {
    return { pos: 'DEL', role: 'DC' };
  }
  return { pos: 'MED', role: 'MC' };
}

// ---------- Breaking Football News (Live RSS + Fallback) ----------
let newsCache: { fetchedAt: number; articles: NewsArticle[] } | null = null;
const NEWS_CACHE_MS = 10 * 60 * 1000;

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)))
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractXmlTag(block: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = block.match(regex);
  return match ? decodeHtmlEntities(match[1]) : '';
}

function parseRssItems(xml: string, sourceName: string, category: string): NewsArticle[] {
  const items: NewsArticle[] = [];
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  for (let i = 0; i < Math.min(itemMatches.length, 8); i++) {
    const raw = itemMatches[i];
    const title = extractXmlTag(raw, 'title');
    const link = extractXmlTag(raw, 'link');
    const description = extractXmlTag(raw, 'description');
    const pubDate = extractXmlTag(raw, 'pubDate');
    if (!title || !link) continue;

    let isoDate = new Date().toISOString();
    if (pubDate) {
      const parsed = new Date(pubDate);
      if (!Number.isNaN(parsed.getTime())) {
        isoDate = parsed.toISOString();
      }
    }

    const summary =
      description && description.length > 20
        ? description.slice(0, 195) + (description.length > 195 ? '…' : '')
        : `Última hora recogida por ${sourceName} sobre la actualidad futbolística.`;

    items.push({
      id: `rss-${hashSeed(link)}`,
      title,
      summary,
      source: sourceName,
      category,
      publishedAt: isoDate,
      url: link,
    });
  }
  return items;
}

const FALLBACK_NEWS: NewsArticle[] = [
  {
    id: 'fb-1',
    title: 'LaLiga y la Champions League aprietan el calendario de rotaciones en la recta decisiva',
    summary:
      'Los clubes españoles ajustan cargas físicas entre jornada liguera y competiciones europeas dando más minutos al banquillo y a los extremos jóvenes.',
    source: 'MARCA Fútbol',
    category: 'LaLiga',
    publishedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    url: 'https://www.marca.com/futbol/primera-division.html',
  },
  {
    id: 'fb-2',
    title: 'El pulso táctico de la Premier League: los sistemas 4-2-3-1 y 3-4-3 ganan terreno',
    summary:
      'El análisis de la jornada inglesa confirma el dominio de los carrileros largos y los mediapuntas interiores para romper bloques bajos.',
    source: 'BBC Sport Football',
    category: 'Premier League',
    publishedAt: new Date(Date.now() - 68 * 60000).toISOString(),
    url: 'https://www.bbc.com/sport/football',
  },
  {
    id: 'fb-3',
    title: 'Serie A: Inter, Napoli y Juventus mantienen la pugna cerrada por el Scudetto',
    summary:
      'La igualdad en la zona alta de Italia convierte cada enfrentamiento directo en un examen de solidez defensiva y eficacia en las áreas.',
    source: 'ESPN Fútbol',
    category: 'Serie A',
    publishedAt: new Date(Date.now() - 115 * 60000).toISOString(),
    url: 'https://www.espn.com/soccer/league/_/name/ita.1',
  },
  {
    id: 'fb-4',
    title: 'Bundesliga y Ligue 1 disparan el valor de mercado de los centrocampistas sub-23',
    summary:
      'La irrupción de interiores creativos y pivotes posicionales en Alemania y Francia marca la agenda de ojeadores de toda Europa.',
    source: 'AS Fútbol',
    category: 'Mercado Europeo',
    publishedAt: new Date(Date.now() - 180 * 60000).toISOString(),
    url: 'https://as.com/futbol/',
  },
  {
    id: 'fb-5',
    title: 'Claves de la ventana de traspasos: por qué los delanteros móviles cotizan al alza',
    summary:
      'Las direcciones deportivas priorizan atacantes capaces de caer a banda y presionar la salida rival por encima del nueve estático tradicional.',
    source: 'UEFA.com',
    category: 'Internacional',
    publishedAt: new Date(Date.now() - 240 * 60000).toISOString(),
    url: 'https://www.uefa.com/uefachampionsleague/news/',
  },
  {
    id: 'fb-6',
    title: 'Balance de porterías a cero: la importancia del portero con buen juego de pies',
    summary:
      'Los datos de las cinco grandes ligas muestran cómo el primer pase desde el área propia reduce pérdidas y mejora el xG por posesión.',
    source: 'BBC Sport Football',
    category: 'Táctica',
    publishedAt: new Date(Date.now() - 310 * 60000).toISOString(),
    url: 'https://www.bbc.com/sport/football/tables',
  },
];

const translationCache = new Map<string, string>();

async function translateToSpanish(text: string): Promise<string | null> {
  const clean = text.trim();
  if (!clean) return clean;
  const cached = translationCache.get(clean);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const resp = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURIComponent(clean)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    if (!resp.ok) return null;
    const data = (await resp.json()) as unknown[];
    const segments = Array.isArray(data?.[0]) ? (data[0] as unknown[][]) : [];
    const translated = segments
      .map((seg) => (typeof seg?.[0] === 'string' ? seg[0] : ''))
      .join('')
      .trim();
    if (!translated) return null;
    translationCache.set(clean, translated);
    return translated;
  } catch {
    return null;
  }
}

async function fetchFootballNews(): Promise<{ articles: NewsArticle[]; live: boolean }> {
  if (newsCache && Date.now() - newsCache.fetchedAt < NEWS_CACHE_MS) {
    return { articles: newsCache.articles, live: true };
  }

  const feeds = [
    {
      url: 'https://e00-marca.uecdn.es/rss/futbol/primera-division.xml',
      source: 'MARCA',
      category: 'LaLiga',
      lang: 'es' as const,
    },
    {
      url: 'https://espndeportes.espn.com/espn/rss/futbol/news',
      source: 'ESPN Deportes',
      category: 'Fútbol Mundial',
      lang: 'es' as const,
    },
    {
      url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
      source: 'BBC Sport',
      category: 'Fútbol Europeo',
      lang: 'en' as const,
    },
    {
      url: 'https://www.espn.com/espn/rss/soccer/news',
      source: 'ESPN Soccer',
      category: 'Internacional',
      lang: 'en' as const,
    },
  ];

  const collected: NewsArticle[] = [];

  await Promise.all(
    feeds.map(async (feed) => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const resp = await fetch(feed.url, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Maquiurcc-FootballHub/1.0' },
        });
        clearTimeout(timeout);
        if (resp.ok) {
          const xml = await resp.text();
          const parsed = parseRssItems(xml, feed.source, feed.category).slice(0, 3);
          if (feed.lang === 'es') {
            collected.push(...parsed);
          } else {
            const translatedItems = await Promise.all(
              parsed.map(async (item) => {
                const [esTitle, esSummary] = await Promise.all([
                  translateToSpanish(item.title),
                  translateToSpanish(item.summary),
                ]);
                if (!esTitle) return null;
                return {
                  ...item,
                  title: esTitle,
                  summary:
                    esSummary ||
                    `Última hora recogida por ${item.source} sobre la actualidad futbolística.`,
                };
              })
            );
            for (const t of translatedItems) {
              if (t) collected.push(t);
            }
          }
        }
      } catch {
        // Ignore single feed failure
      }
    })
  );

  if (collected.length >= 3) {
    collected.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
    const unique: NewsArticle[] = [];
    const seen = new Set<string>();
    for (const item of collected) {
      if (!seen.has(item.title)) {
        seen.add(item.title);
        unique.push(item);
      }
    }
    const finalArticles = unique.slice(0, 9);
    newsCache = { fetchedAt: Date.now(), articles: finalArticles };
    return { articles: finalArticles, live: true };
  }

  return { articles: FALLBACK_NEWS, live: false };
}

// ---------- Bot Match Simulation (Chemistry + Real Tactics) ----------
function simulateBotMatch(state: PersistedState, club: ClubProfile, difficulty: BotDifficulty): MatchResult {
  const cfg = BOT_DIFFICULTIES[difficulty];
  const formation = getFormationById(club.formationId, club.customFormation);
  const ownedMap = buildOwnedPlayersMap(state, club);
  const chemistry = calculateTeamChemistry(formation, club.starters, ownedMap);

  const playStyle = getPlayStyleConfig(club.tactics?.playStyle);
  const mentality = getMentalityConfig(club.tactics?.mentality);

  const starterPlayers = club.starters
    .filter((id): id is string => Boolean(id))
    .map((id) => ownedMap[id])
    .filter((p): p is Player => Boolean(p));

  const benchPlayers = club.bench
    .filter((id): id is string => Boolean(id))
    .map((id) => ownedMap[id])
    .filter((p): p is Player => Boolean(p));

  const userAvg = starterPlayers.reduce((sum, p) => sum + p.overall, 0) / starterPlayers.length;
  const benchBonus = benchPlayers.length * 0.3;
  const captainPlayer = club.tactics?.captainId
    ? starterPlayers.find((p) => p.id === club.tactics.captainId)
    : undefined;
  const captainBonus = captainPlayer ? 0.6 : 0;

  const effectiveUserOvr = userAvg + chemistry.ovrBonus + benchBonus + captainBonus;
  const diff = effectiveUserOvr - cfg.botOverall;
  const expectedAdvantage = Math.max(-0.35, Math.min(0.42, diff * 0.032));

  const attackers = starterPlayers.filter((p) => p.position === 'DEL' || p.position === 'MED');
  const defenders = starterPlayers.filter((p) => p.position === 'DEF' || p.position === 'MED');
  const gk = starterPlayers.find((p) => p.position === 'POR') || starterPlayers[0];

  const designatedPenaltyTaker =
    (club.tactics?.penaltyTakerId &&
      starterPlayers.find((p) => p.id === club.tactics.penaltyTakerId)) ||
    attackers.slice().sort((a, b) => b.stats.shooting - a.stats.shooting)[0] ||
    starterPlayers[0];

  const pickScorer = () => {
    const pool = attackers.length > 0 ? attackers : starterPlayers;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const botScorerNames = ['L. Navarro', 'M. Rinaldi', 'K. Brandt', 'D. Costa', 'T. Lefèvre'];
  const pickBotScorer = () => botScorerNames[Math.floor(Math.random() * botScorerNames.length)];

  const userAttackLambda = Math.max(
    0.45,
    1.4 + expectedAdvantage * 2.3 + playStyle.attackMod + mentality.attackMod
  );
  const botAttackLambda = Math.max(
    0.35,
    1.35 - expectedAdvantage * 2.0 - playStyle.defenseMod - mentality.defenseMod
  );

  const sampleGoals = (lambda: number) => {
    let goals = 0;
    for (let i = 0; i < 6; i++) {
      if (Math.random() < lambda / 6) goals++;
    }
    return goals;
  };

  let userGoals = sampleGoals(userAttackLambda);
  const botGoals = sampleGoals(botAttackLambda);

  const events: MatchEvent[] = [];
  const usedMinutes = new Set<number>();
  const pickMinute = (min: number, max: number) => {
    for (let attempt = 0; attempt < 25; attempt++) {
      const m = min + Math.floor(Math.random() * (max - min + 1));
      if (!usedMinutes.has(m)) {
        usedMinutes.add(m);
        return m;
      }
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // Optional penalty / set-piece event showcasing designated taker
  let penaltyScoredAsGoal = false;
  if (userGoals > 0 && Math.random() < 0.45) {
    const penMinute = pickMinute(22, 84);
    const convertProb = Math.min(0.92, Math.max(0.62, designatedPenaltyTaker.stats.shooting / 100));
    if (Math.random() < convertProb) {
      penaltyScoredAsGoal = true;
      events.push({
        minute: penMinute,
        team: 'user',
        type: 'penalty',
        title: `¡Gol de penalti de ${designatedPenaltyTaker.shortName}!`,
        detail: `${designatedPenaltyTaker.name} asume la responsabilidad y engaña al portero rival (Tiro ${designatedPenaltyTaker.stats.shooting}).`,
      });
    } else {
      events.push({
        minute: penMinute,
        team: 'user',
        type: 'chance',
        title: `Falta peligrosa ejecutada por ${designatedPenaltyTaker.shortName}`,
        detail: `El especialista roza la escuadra con un lanzamiento potente (${playStyle.label}).`,
      });
    }
  } else if (userGoals === 0 && Math.random() < 0.35) {
    const penMinute = pickMinute(52, 85);
    const convertProb = Math.min(0.85, Math.max(0.55, designatedPenaltyTaker.stats.shooting / 102));
    if (Math.random() < convertProb) {
      userGoals = 1;
      penaltyScoredAsGoal = true;
      events.push({
        minute: penMinute,
        team: 'user',
        type: 'penalty',
        title: `¡Gol de penalti de ${designatedPenaltyTaker.shortName}!`,
        detail: `${designatedPenaltyTaker.name} convierte desde los once metros gracias a su temple.`,
      });
    }
  }

  const remainingOpenPlayGoals = penaltyScoredAsGoal ? Math.max(0, userGoals - 1) : userGoals;
  for (let i = 0; i < remainingOpenPlayGoals; i++) {
    const scorer = pickScorer();
    const minute = pickMinute(6, 89);
    const styleNote =
      playStyle.id === 'counter'
        ? 'tras una transición eléctrica'
        : playStyle.id === 'possession'
        ? 'culminando una larga secuencia de pases'
        : playStyle.id === 'high_press'
        ? 'tras robo en campo contrario'
        : 'con definición precisa en el área';
    events.push({
      minute,
      team: 'user',
      type: 'goal',
      title: `¡Gol de ${scorer.shortName}!`,
      detail: `${club.name} marca ${styleNote} por medio de ${scorer.name} (${scorer.role}).`,
    });
  }

  for (let i = 0; i < botGoals; i++) {
    const botPlayer = pickBotScorer();
    const minute = pickMinute(8, 90);
    events.push({
      minute,
      team: 'bot',
      type: 'goal',
      title: `Gol de ${botPlayer} (${cfg.botTeamName})`,
      detail: `${cfg.botTeamName} culmina un ataque rápido ante ${gk.shortName}.`,
    });
  }

  // Tactical highlights: chemistry link chance, GK save, captain/yellow, bench subs
  if (chemistry.totalScore >= 55 && attackers.length > 0) {
    const linkStar = attackers[0];
    events.push({
      minute: pickMinute(12, 34),
      team: 'user',
      type: 'chance',
      title: `Conexión de Química (${chemistry.totalScore}/100)`,
      detail: `${linkStar.shortName} aprovecha la sintonía del bloque (+${chemistry.ovrBonus} OVR) para generar una ocasión clara.`,
    });
  }

  events.push({
    minute: pickMinute(18, 43),
    team: 'user',
    type: 'save',
    title: `Parada decisiva de ${gk.shortName}`,
    detail: `${gk.shortName} evita el tanto rival con una estirada abajo.`,
  });

  if (captainPlayer) {
    events.push({
      minute: pickMinute(46, 59),
      team: 'user',
      type: 'chance',
      title: `Liderazgo del capitán ${captainPlayer.shortName}`,
      detail: `El capitán ordena al equipo en el esquema ${formation.name} (${playStyle.label} · ${mentality.label}).`,
    });
  } else if (defenders.length > 0) {
    const d = defenders[Math.floor(Math.random() * defenders.length)];
    events.push({
      minute: pickMinute(35, 78),
      team: 'user',
      type: 'yellow',
      title: `Tarjeta amarilla para ${d.shortName}`,
      detail: `Corte táctico en campo contrario para frenar la contra rival.`,
    });
  }

  if (benchPlayers.length > 0) {
    const subIn = benchPlayers[0];
    events.push({
      minute: pickMinute(62, 72),
      team: 'user',
      type: 'sub',
      title: `Cambio táctico: entra ${subIn.shortName}`,
      detail: `Refresco desde el banquillo para sostener el plan ${playStyle.label}.`,
    });
  }
  if (benchPlayers.length > 1) {
    const subIn2 = benchPlayers[1];
    events.push({
      minute: pickMinute(74, 83),
      team: 'user',
      type: 'sub',
      title: `Segundo cambio: entra ${subIn2.shortName}`,
      detail: `Aporta piernas frescas en la recta final del encuentro.`,
    });
  }

  events.sort((a, b) => a.minute - b.minute);

  const outcome: 'win' | 'draw' | 'loss' =
    userGoals > botGoals ? 'win' : userGoals === botGoals ? 'draw' : 'loss';

  const reward =
    outcome === 'win' ? cfg.winReward : outcome === 'draw' ? cfg.drawReward : cfg.lossReward;

  const possessionUser = Math.max(
    32,
    Math.min(72, Math.round(50 + expectedAdvantage * 24 + playStyle.possessionMod + (Math.random() * 6 - 3)))
  );
  const shotsUser = Math.max(
    userGoals + 2,
    Math.round(7 + expectedAdvantage * 8 + playStyle.shotsMod + Math.random() * 4)
  );
  const shotsBot = Math.max(
    botGoals + 2,
    Math.round(7 - expectedAdvantage * 6 - playStyle.defenseMod * 4 + Math.random() * 4)
  );

  return {
    id: `match-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
    playedAt: new Date().toISOString(),
    difficulty,
    difficultyLabel: cfg.label,
    botTeamName: cfg.botTeamName,
    botOverall: cfg.botOverall,
    userOverall: Math.round(userAvg * 10) / 10,
    chemistryScore: chemistry.totalScore,
    chemistryBonus: chemistry.ovrBonus,
    playStyleLabel: `${playStyle.label} (${mentality.label})`,
    userGoals,
    botGoals,
    outcome,
    reward,
    possessionUser,
    shotsUser,
    shotsBot,
    events,
  };
}

function buildBootstrap(state: PersistedState, club: ClubProfile) {
  const dateKey = getTodayDateKey();
  return {
    club,
    ownedPlayers: buildOwnedPlayersMap(state, club),
    dailyShop: {
      dateKey,
      refreshAt: getNextUtcMidnightIso(),
      players: getDailyShopPlayers(dateKey),
    },
    marketListings: state.marketListings.sort((a, b) => (a.listedAt < b.listedAt ? 1 : -1)),
    leaderboard: computeClubLeaderboard(state),
    formations: PRESET_FORMATIONS,
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  const state = loadState();

  app.get('/api/bootstrap', (req, res) => {
    ensureDailyMarketSynced(state);
    const requestedId = typeof req.query.clubId === 'string' ? req.query.clubId.trim() : '';
    let club = requestedId ? state.clubs[requestedId] : undefined;

    if (!club) {
      club = createClubRecord('Atlético Estrella', 'Míster');
      state.clubs[club.id] = club;
      saveState(state);
    }

    res.json(buildBootstrap(state, club));
  });

  app.get('/api/clubs', (req, res) => {
    const rawIds = typeof req.query.ids === 'string' ? req.query.ids : '';
    const ids = rawIds
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 10);

    const careers: CareerSummary[] = [];
    for (const id of ids) {
      const club = state.clubs[id];
      if (club) {
        careers.push(buildCareerSummary(state, club));
      }
    }
    res.json({ careers });
  });

  app.post('/api/club/create', (req, res) => {
    ensureDailyMarketSynced(state);
    const { name, managerName, formationId, playStyle } = req.body as {
      name?: string;
      managerName?: string;
      formationId?: string;
      playStyle?: PlayStyleId;
    };
    const club = createClubRecord(name, managerName, formationId, playStyle);
    state.clubs[club.id] = club;
    saveState(state);
    res.json(buildBootstrap(state, club));
  });

  app.post('/api/club/restore', (req, res) => {
    ensureDailyMarketSynced(state);
    const { club: incomingClub, externalPlayers } = req.body as {
      club?: ClubProfile;
      externalPlayers?: Record<string, Player>;
    };
    if (!incomingClub || !incomingClub.id || !incomingClub.name) {
      res.status(400).json({ error: 'Datos de carrera inválidos.' });
      return;
    }

    if (externalPlayers && typeof externalPlayers === 'object') {
      for (const [pid, p] of Object.entries(externalPlayers)) {
        if (p && p.id && p.name && !state.externalPlayers[pid]) {
          state.externalPlayers[pid] = p;
        }
      }
    }

    // Prefer existing server record if already present; otherwise restore client snapshot
    let target = state.clubs[incomingClub.id];
    if (!target) {
      target = normalizeClub(incomingClub);
      state.clubs[target.id] = target;
      saveState(state);
    }

    res.json(buildBootstrap(state, target));
  });

  app.delete('/api/club/:id', (req, res) => {
    const id = (req.params.id || '').trim();
    if (!id || !state.clubs[id]) {
      res.status(404).json({ error: 'Carrera no encontrada.' });
      return;
    }
    delete state.clubs[id];
    state.marketListings = state.marketListings.filter((l) => l.sellerClubId !== id);
    saveState(state);
    res.json({ ok: true, deletedId: id });
  });

  app.post('/api/club/update', (req, res) => {
    const { clubId, name, managerName } = req.body as {
      clubId?: string;
      name?: string;
      managerName?: string;
    };
    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }
    if (typeof name === 'string' && name.trim().length >= 2) {
      club.name = name.trim().slice(0, 32);
    }
    if (typeof managerName === 'string' && managerName.trim().length >= 2) {
      club.managerName = managerName.trim().slice(0, 24);
    }
    saveState(state);
    res.json(buildBootstrap(state, club));
  });

  app.post('/api/club/formation', (req, res) => {
    const { clubId, formationId, custom } = req.body as {
      clubId?: string;
      formationId?: string;
      custom?: { def: number; med: number; del: number };
    };
    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }

    let targetFormation = null;
    if (custom) {
      const check = validateCustomFormation(custom.def, custom.med, custom.del);
      if (!check.valid) {
        res.status(400).json({ error: check.error || 'Formación inválida.' });
        return;
      }
      targetFormation = buildCustomFormation(custom.def, custom.med, custom.del);
    } else if (formationId) {
      targetFormation = PRESET_FORMATIONS.find((f) => f.id === formationId) || null;
    }

    if (!targetFormation) {
      res.status(400).json({ error: 'Formación táctica no reconocida en el fútbol actual.' });
      return;
    }

    const currentStarterIds = club.starters.filter((id): id is string => Boolean(id));
    const newStarters: Array<string | null> = Array(11).fill(null);
    const displaced: string[] = [];

    for (const pid of currentStarterIds) {
      const p = resolvePlayer(state, pid);
      if (!p) continue;
      const compatibleIdx = targetFormation.slots.findIndex(
        (slot, idx) => newStarters[idx] === null && isPositionCompatible(p.position, slot.position)
      );
      if (compatibleIdx !== -1) {
        newStarters[compatibleIdx] = pid;
      } else {
        displaced.push(pid);
      }
    }

    for (const pid of displaced) {
      const emptyBenchIdx = club.bench.findIndex((b) => b === null);
      if (emptyBenchIdx !== -1) {
        club.bench[emptyBenchIdx] = pid;
      } else {
        club.reserves.push(pid);
      }
    }

    club.formationId = targetFormation.id;
    club.customFormation = custom ? { def: custom.def, med: custom.med, del: custom.del } : null;
    club.starters = newStarters;
    saveState(state);
    res.json(buildBootstrap(state, club));
  });

  app.post('/api/club/tactics', (req, res) => {
    const { clubId, playStyle, mentality, captainId, penaltyTakerId } = req.body as {
      clubId?: string;
      playStyle?: PlayStyleId;
      mentality?: MentalityId;
      captainId?: string | null;
      penaltyTakerId?: string | null;
    };
    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }

    const validStyle = PLAY_STYLES.some((s) => s.id === playStyle) ? playStyle! : club.tactics.playStyle;
    const validMentality = MENTALITIES.some((m) => m.id === mentality)
      ? mentality!
      : club.tactics.mentality;

    const ownedIds = new Set(getAllClubPlayerIds(club));
    const safeCaptain = captainId && ownedIds.has(captainId) ? captainId : captainId === null ? null : club.tactics.captainId;
    const safePenalty =
      penaltyTakerId && ownedIds.has(penaltyTakerId)
        ? penaltyTakerId
        : penaltyTakerId === null
        ? null
        : club.tactics.penaltyTakerId;

    club.tactics = {
      playStyle: validStyle,
      mentality: validMentality,
      captainId: safeCaptain,
      penaltyTakerId: safePenalty,
    };

    saveState(state);
    res.json(buildBootstrap(state, club));
  });

  app.post('/api/club/lineup', (req, res) => {
    const { clubId, action, playerId, targetType, targetIndex } = req.body as {
      clubId?: string;
      action?: 'assign' | 'move_to_reserves' | 'move_to_bench';
      playerId?: string;
      targetType?: 'starter' | 'bench' | 'reserves';
      targetIndex?: number;
    };
    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }
    if (!playerId || !getAllClubPlayerIds(club).includes(playerId)) {
      res.status(400).json({ error: 'El jugador no pertenece a tu plantilla.' });
      return;
    }

    const player = resolvePlayer(state, playerId);
    if (!player) {
      res.status(404).json({ error: 'Jugador no encontrado.' });
      return;
    }

    const formation = getFormationById(club.formationId, club.customFormation);

    if (action === 'move_to_reserves' || targetType === 'reserves') {
      removePlayerFromClub(club, playerId);
      club.reserves.push(playerId);
      saveState(state);
      res.json(buildBootstrap(state, club));
      return;
    }

    if (action === 'move_to_bench' || targetType === 'bench') {
      const idx =
        typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex < 3
          ? targetIndex
          : club.bench.findIndex((b) => b === null);

      if (idx === -1) {
        res.status(400).json({
          error: 'El banquillo solo admite 3 suplentes. Mueve uno a reservas antes de añadir otro.',
        });
        return;
      }

      const occupant = club.bench[idx];
      removePlayerFromClub(club, playerId);
      club.bench[idx] = playerId;
      if (occupant && occupant !== playerId) {
        club.reserves.push(occupant);
      }
      checkAndFinalizeDraft(club);
      saveState(state);
      res.json(buildBootstrap(state, club));
      return;
    }

    if (targetType === 'starter' && typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex < 11) {
      const targetSlot = formation.slots[targetIndex];
      if (!isPositionCompatible(player.position, targetSlot.position)) {
        res.status(400).json({
          error: `${player.shortName} (${player.position}) no puede ocupar la posición de ${targetSlot.label} (${targetSlot.position}).`,
        });
        return;
      }

      const previousStarter = club.starters[targetIndex];
      const oldStarterIdx = club.starters.findIndex((id) => id === playerId);
      const oldBenchIdx = club.bench.findIndex((id) => id === playerId);

      removePlayerFromClub(club, playerId);
      club.starters[targetIndex] = playerId;

      if (previousStarter && previousStarter !== playerId) {
        const prevPlayer = resolvePlayer(state, previousStarter);
        if (
          oldStarterIdx !== -1 &&
          prevPlayer &&
          isPositionCompatible(prevPlayer.position, formation.slots[oldStarterIdx].position)
        ) {
          club.starters[oldStarterIdx] = previousStarter;
        } else if (oldBenchIdx !== -1) {
          club.bench[oldBenchIdx] = previousStarter;
        } else {
          const freeBench = club.bench.findIndex((b) => b === null);
          if (freeBench !== -1) {
            club.bench[freeBench] = previousStarter;
          } else {
            club.reserves.push(previousStarter);
          }
        }
      }

      checkAndFinalizeDraft(club);
      saveState(state);
      res.json(buildBootstrap(state, club));
      return;
    }

    res.status(400).json({ error: 'Acción de alineación no válida.' });
  });

  // Initial Draft signing: freely pick any player in the world until 11 starters + 3 subs are filled, then budget resets to 50M
  app.post('/api/draft/sign', (req, res) => {
    const { clubId, playerId, playerData, targetType, targetIndex } = req.body as {
      clubId?: string;
      playerId?: string;
      playerData?: Player;
      targetType?: 'starter' | 'bench';
      targetIndex?: number;
    };

    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }

    if (club.draftCompleted) {
      res.status(400).json({
        error: 'El Draft Inicial (11 titulares y 3 suplentes) ya está completado. Ahora ficha en la Tienda Diaria o en el Mercado.',
      });
      return;
    }

    let player = playerId ? resolvePlayer(state, playerId) : undefined;
    if (!player && playerData && playerData.id && playerData.name) {
      const sanitizedVal = Math.max(5, Math.min(180, Number(playerData.marketValue) || 15));
      player = {
        ...playerData,
        marketValue: sanitizedVal,
      };
      state.externalPlayers[player.id] = player;
    }

    if (!player) {
      res.status(404).json({ error: 'Jugador no encontrado.' });
      return;
    }

    if (getAllClubPlayerIds(club).includes(player.id)) {
      res.status(400).json({ error: `${player.shortName} ya forma parte de tu plantilla.` });
      return;
    }

    if (club.budget < player.marketValue) {
      res.status(400).json({
        error: `Presupuesto insuficiente en el Draft: cuesta €${player.marketValue}M y te quedan €${club.budget.toFixed(1)}M.`,
      });
      return;
    }

    const formation = getFormationById(club.formationId, club.customFormation);
    let placed = false;

    if (targetType === 'starter' && typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex < 11) {
      const slot = formation.slots[targetIndex];
      if (!isPositionCompatible(player.position, slot.position)) {
        res.status(400).json({
          error: `${player.shortName} (${player.position}) no encaja en el puesto de ${slot.label} (${slot.position}).`,
        });
        return;
      }
      if (club.starters[targetIndex] !== null) {
        res.status(400).json({ error: 'Ese hueco del once titular ya está ocupado.' });
        return;
      }
      club.starters[targetIndex] = player.id;
      placed = true;
    } else if (targetType === 'bench' && typeof targetIndex === 'number' && targetIndex >= 0 && targetIndex < 3) {
      if (club.bench[targetIndex] !== null) {
        res.status(400).json({ error: 'Ese hueco del banquillo ya está ocupado.' });
        return;
      }
      club.bench[targetIndex] = player.id;
      placed = true;
    } else {
      const compatibleStarterIdx = formation.slots.findIndex(
        (slot, idx) => club.starters[idx] === null && isPositionCompatible(player!.position, slot.position)
      );
      if (compatibleStarterIdx !== -1) {
        club.starters[compatibleStarterIdx] = player.id;
        placed = true;
      } else {
        const emptyBenchIdx = club.bench.findIndex((b) => b === null);
        if (emptyBenchIdx !== -1) {
          club.bench[emptyBenchIdx] = player.id;
          placed = true;
        }
      }
    }

    if (!placed) {
      res.status(400).json({
        error: `Ya tienes completas tus plazas de ${player.position} y los 3 suplentes. Elige jugadores para los huecos que faltan en tu once.`,
      });
      return;
    }

    club.budget = Math.round((club.budget - player.marketValue) * 10) / 10;
    const draftJustCompleted = checkAndFinalizeDraft(club);
    saveState(state);

    res.json({
      draftJustCompleted,
      bootstrap: buildBootstrap(state, club),
    });
  });

  app.post('/api/draft/release', (req, res) => {
    const { clubId, playerId } = req.body as { clubId?: string; playerId?: string };
    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }
    if (club.draftCompleted) {
      res.status(400).json({
        error: 'El Draft Inicial ya está cerrado; para dar salida a un jugador usa el Mercado.',
      });
      return;
    }
    if (!playerId || !getAllClubPlayerIds(club).includes(playerId)) {
      res.status(400).json({ error: 'El jugador no está en tu plantilla.' });
      return;
    }

    const player = resolvePlayer(state, playerId);
    const refund = player ? player.marketValue : 0;
    removePlayerFromClub(club, playerId);
    club.budget = Math.min(INITIAL_BUDGET, Math.round((club.budget + refund) * 10) / 10);
    saveState(state);

    res.json(buildBootstrap(state, club));
  });

  app.post('/api/shop/buy', (req, res) => {
    ensureDailyMarketSynced(state);
    const { clubId, playerId } = req.body as { clubId?: string; playerId?: string };
    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }
    if (!playerId) {
      res.status(400).json({ error: 'Falta el identificador del jugador.' });
      return;
    }

    const today = getTodayDateKey();
    const dailyPlayers = getDailyShopPlayers(today);
    const player = dailyPlayers.find((p) => p.id === playerId);
    if (!player) {
      res.status(400).json({ error: 'Este jugador no está en la tienda diaria de hoy.' });
      return;
    }

    if (getAllClubPlayerIds(club).includes(player.id)) {
      res.status(400).json({ error: `${player.shortName} ya forma parte de tu plantilla.` });
      return;
    }

    const purchaseKey = `${today}:${player.id}`;
    if (club.dailyPurchasedKeys.includes(purchaseKey)) {
      res.status(400).json({ error: 'Ya fichaste a este jugador de la tienda diaria de hoy.' });
      return;
    }

    if (club.budget < player.marketValue) {
      res.status(400).json({
        error: `Presupuesto insuficiente: necesitas €${player.marketValue}M y dispones de €${club.budget.toFixed(1)}M.`,
      });
      return;
    }

    club.budget = Math.round((club.budget - player.marketValue) * 10) / 10;
    club.dailyPurchasedKeys.push(purchaseKey);
    placePurchasedPlayer(club, player);
    checkAndFinalizeDraft(club);
    saveState(state);

    res.json(buildBootstrap(state, club));
  });

  app.post('/api/market/list', (req, res) => {
    ensureDailyMarketSynced(state);
    const { clubId, playerId, price } = req.body as {
      clubId?: string;
      playerId?: string;
      price?: number;
    };
    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }
    if (!club.draftCompleted) {
      res.status(400).json({
        error: 'Completa primero tus 11 titulares y 3 suplentes del Draft Inicial antes de vender jugadores en el mercado.',
      });
      return;
    }
    if (!playerId || !getAllClubPlayerIds(club).includes(playerId)) {
      res.status(400).json({ error: 'El jugador no está en tu club.' });
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 1 || numericPrice > 500) {
      res.status(400).json({ error: 'El precio de venta debe estar entre €1M y €500M.' });
      return;
    }

    const player = resolvePlayer(state, playerId);
    if (!player) {
      res.status(404).json({ error: 'Jugador no encontrado.' });
      return;
    }

    removePlayerFromClub(club, playerId);

    const listing: MarketListing = {
      id: `lst-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      playerId: player.id,
      player,
      sellerClubId: club.id,
      sellerClubName: club.name,
      sellerManager: club.managerName,
      price: Math.round(numericPrice * 10) / 10,
      listedAt: new Date().toISOString(),
      isSystemClub: false,
    };

    state.marketListings.unshift(listing);
    saveState(state);
    res.json(buildBootstrap(state, club));
  });

  app.post('/api/market/cancel', (req, res) => {
    const { clubId, listingId } = req.body as { clubId?: string; listingId?: string };
    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }

    const idx = state.marketListings.findIndex(
      (l) => l.id === listingId && l.sellerClubId === club.id
    );
    if (idx === -1) {
      res.status(404).json({ error: 'Anuncio de venta no encontrado o no te pertenece.' });
      return;
    }

    const [listing] = state.marketListings.splice(idx, 1);
    const player = resolvePlayer(state, listing.playerId) || listing.player;
    placePurchasedPlayer(club, player);
    saveState(state);
    res.json(buildBootstrap(state, club));
  });

  app.post('/api/market/buy', (req, res) => {
    ensureDailyMarketSynced(state);
    const { clubId, listingId } = req.body as { clubId?: string; listingId?: string };
    const buyerClub = clubId ? state.clubs[clubId] : undefined;
    if (!buyerClub) {
      res.status(404).json({ error: 'Club comprador no encontrado.' });
      return;
    }

    const listingIdx = state.marketListings.findIndex((l) => l.id === listingId);
    if (listingIdx === -1) {
      res.status(404).json({ error: 'Este jugador ya fue vendido o retirado del mercado.' });
      return;
    }

    const listing = state.marketListings[listingIdx];
    if (listing.sellerClubId === buyerClub.id) {
      res.status(400).json({ error: 'No puedes comprar un jugador que tú mismo pusiste en venta.' });
      return;
    }

    if (getAllClubPlayerIds(buyerClub).includes(listing.playerId)) {
      res.status(400).json({ error: `Ya tienes a ${listing.player.shortName} en tu plantilla.` });
      return;
    }

    if (buyerClub.budget < listing.price) {
      res.status(400).json({
        error: `Presupuesto insuficiente: cuesta €${listing.price}M y tienes €${buyerClub.budget.toFixed(1)}M.`,
      });
      return;
    }

    buyerClub.budget = Math.round((buyerClub.budget - listing.price) * 10) / 10;
    const sellerClub = state.clubs[listing.sellerClubId];
    if (sellerClub) {
      sellerClub.budget = Math.round((sellerClub.budget + listing.price) * 10) / 10;
    }

    state.marketListings.splice(listingIdx, 1);
    const player = resolvePlayer(state, listing.playerId) || listing.player;
    placePurchasedPlayer(buyerClub, player);
    checkAndFinalizeDraft(buyerClub);

    saveState(state);
    res.json(buildBootstrap(state, buyerClub));
  });

  // Play match vs Bot & earn prize money
  app.post('/api/match/play', (req, res) => {
    const { clubId, difficulty } = req.body as {
      clubId?: string;
      difficulty?: BotDifficulty;
    };
    const club = clubId ? state.clubs[clubId] : undefined;
    if (!club) {
      res.status(404).json({ error: 'Club no encontrado.' });
      return;
    }

    if (!difficulty || !(difficulty in BOT_DIFFICULTIES)) {
      res.status(400).json({ error: 'Dificultad no válida.' });
      return;
    }

    const starterCount = club.starters.filter(Boolean).length;
    if (starterCount < 11) {
      res.status(400).json({
        error: `Necesitas completar los 11 titulares en el campo antes de jugar (tienes ${starterCount}/11).`,
      });
      return;
    }

    const result = simulateBotMatch(state, club, difficulty);
    club.budget = Math.round((club.budget + result.reward) * 10) / 10;
    if (result.outcome === 'win') club.record.wins += 1;
    else if (result.outcome === 'draw') club.record.draws += 1;
    else club.record.losses += 1;

    club.matchHistory = [result, ...(club.matchHistory || [])].slice(0, 15);
    saveState(state);

    res.json({
      match: result,
      bootstrap: buildBootstrap(state, club),
    });
  });

  // Breaking football news
  app.get('/api/news', async (_req, res) => {
    const { articles, live } = await fetchFootballNews();
    res.json({
      live,
      updatedAt: new Date().toISOString(),
      articles,
    });
  });

  // Worldwide player search
  app.get('/api/players/search', async (req, res) => {
    ensureDailyMarketSynced(state);
    const q = (typeof req.query.q === 'string' ? req.query.q : '').trim();
    const position = (typeof req.query.position === 'string' ? req.query.position : 'ALL').toUpperCase();
    const league = typeof req.query.league === 'string' ? req.query.league : 'ALL';
    const clubId = typeof req.query.clubId === 'string' ? req.query.clubId : '';
    const club = clubId ? state.clubs[clubId] : undefined;

    const today = getTodayDateKey();
    const dailyIds = new Set(getDailyShopPlayers(today).map((p) => p.id));
    const ownedIds = new Set(club ? getAllClubPlayerIds(club) : []);
    const marketByPlayerId = new Map<string, MarketListing>();
    for (const lst of state.marketListings) {
      if (!marketByPlayerId.has(lst.playerId)) {
        marketByPlayerId.set(lst.playerId, lst);
      }
    }

    const qLower = q.toLowerCase();
    const localMatches = PLAYERS_CATALOG.filter((p) => {
      if (position !== 'ALL' && p.position !== position) return false;
      if (league !== 'ALL' && p.league !== league) return false;
      if (!qLower) return true;
      return (
        p.name.toLowerCase().includes(qLower) ||
        p.shortName.toLowerCase().includes(qLower) ||
        p.club.toLowerCase().includes(qLower) ||
        p.nationality.toLowerCase().includes(qLower) ||
        p.league.toLowerCase().includes(qLower)
      );
    }).sort((a, b) => b.overall - a.overall);

    const isDraftPhase = club ? !club.draftCompleted : req.query.draft === '1';

    const annotate = (p: Player): SearchPlayerResult => {
      if (ownedIds.has(p.id)) {
        return { player: p, availability: 'owned' };
      }
      if (isDraftPhase) {
        return { player: p, availability: 'draft_open' };
      }
      if (dailyIds.has(p.id)) {
        return { player: p, availability: 'daily_shop' };
      }
      const mkt = marketByPlayerId.get(p.id);
      if (mkt) {
        return {
          player: p,
          availability: 'market',
          marketListingId: mkt.id,
          marketPrice: mkt.price,
          sellerClubName: mkt.sellerClubName,
        };
      }
      return { player: p, availability: 'scout_only' };
    };

    const results: SearchPlayerResult[] = localMatches.slice(0, 80).map(annotate);

    if (q.length >= 3 && localMatches.length < 12 && league === 'ALL') {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3200);
        const resp = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        clearTimeout(timer);

        if (resp.ok) {
          const data = (await resp.json()) as {
            player?: Array<{
              idPlayer: string;
              strPlayer: string;
              strNationality?: string;
              strTeam?: string;
              strSport?: string;
              strPosition?: string;
              dateBorn?: string;
              strNumber?: string;
            }> | null;
          };

          const existingNames = new Set(results.map((r) => r.player.name.toLowerCase()));
          const externalSoccer = (data.player || [])
            .filter((item) => item.strSport === 'Soccer' && item.strPlayer)
            .slice(0, 10);

          for (const ext of externalSoccer) {
            if (existingNames.has(ext.strPlayer.toLowerCase())) continue;
            const mappedPos = mapExternalPosition(ext.strPosition);
            if (position !== 'ALL' && mappedPos.pos !== position) continue;

            const birthYear = ext.dateBorn ? Number(ext.dateBorn.slice(0, 4)) : 1998;
            const age = Number.isFinite(birthYear) && birthYear > 1970 ? Math.max(17, 2026 - birthYear) : 26;
            const seededOvr = 74 + (hashSeed(ext.strPlayer) % 10);
            const extPlayer: Player = {
              id: `ext-${ext.idPlayer}`,
              name: ext.strPlayer,
              shortName: ext.strPlayer.split(' ').slice(-1)[0] || ext.strPlayer,
              position: mappedPos.pos,
              role: mappedPos.role,
              overall: seededOvr,
              age,
              nationality: ext.strNationality || 'Internacional',
              club: ext.strTeam && ext.strTeam !== '_Retired Soccer' ? ext.strTeam : 'Agente Libre / Mundial',
              league: 'Resto del Mundo' as LeagueName,
              marketValue: 10 + (seededOvr - 74) * 3,
              shirtNumber: Number(ext.strNumber) || 10,
              clubColor: '#334155',
              clubAccent: '#F8FAFC',
              stats: {
                pace: seededOvr,
                shooting: mappedPos.pos === 'DEL' ? seededOvr + 2 : seededOvr - 8,
                passing: seededOvr - 2,
                dribbling: seededOvr - 1,
                defending: mappedPos.pos === 'DEF' ? seededOvr + 2 : seededOvr - 15,
                physical: seededOvr - 3,
              },
              dailyEligible: false,
              isExternalScout: true,
            };
            results.push({
              player: extPlayer,
              availability: ownedIds.has(extPlayer.id)
                ? 'owned'
                : isDraftPhase
                ? 'draft_open'
                : 'scout_only',
            });
          }
        }
      } catch {
        // Silently rely on local database if external search times out
      }
    }

    res.json({
      query: q,
      total: results.length,
      results,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ElevenDraft server running at http://localhost:${PORT}`);
  });
}

startServer();
