export type PositionGroup = 'POR' | 'DEF' | 'MED' | 'DEL';

export type RoleCode =
  | 'POR'
  | 'LD'
  | 'DFC'
  | 'LI'
  | 'CAD'
  | 'CAI'
  | 'MCD'
  | 'MC'
  | 'MCO'
  | 'MD'
  | 'MI'
  | 'ED'
  | 'EI'
  | 'DC'
  | 'SD';

export type LeagueName =
  | 'LaLiga'
  | 'Premier League'
  | 'Serie A'
  | 'Bundesliga'
  | 'Ligue 1'
  | 'Liga Profesional Argentina'
  | 'Brasileirão'
  | 'MLS'
  | 'Saudi Pro League'
  | 'Liga Portugal'
  | 'Eredivisie'
  | 'Süper Lig'
  | 'Liga MX'
  | 'Resto del Mundo';

export type BotDifficulty = 'amateur' | 'profesional' | 'clase_mundial' | 'leyenda';

export type PlayStyleId =
  | 'balanced'
  | 'possession'
  | 'high_press'
  | 'counter'
  | 'low_block';

export type MentalityId = 'defensive' | 'balanced' | 'attacking';

export interface MatchTactics {
  playStyle: PlayStyleId;
  mentality: MentalityId;
  captainId: string | null;
  penaltyTakerId: string | null;
}

export interface PlayerChemistryInfo {
  slotIndex: number;
  playerId: string;
  points: number;
  leagueCount: number;
  nationCount: number;
  clubCount: number;
}

export interface ChemistryLink {
  fromSlot: number;
  toSlot: number;
  strength: 'perfect' | 'strong';
}

export interface TeamChemistrySummary {
  totalScore: number;
  ovrBonus: number;
  strongLinks: number;
  clubMatches: Array<{ label: string; count: number }>;
  leagueMatches: Array<{ label: string; count: number }>;
  nationMatches: Array<{ label: string; count: number }>;
  perStarter: Record<string, PlayerChemistryInfo>;
  links: ChemistryLink[];
}

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  shortName: string;
  position: PositionGroup;
  role: RoleCode;
  overall: number;
  age: number;
  nationality: string;
  club: string;
  league: LeagueName;
  marketValue: number;
  shirtNumber: number;
  clubColor: string;
  clubAccent: string;
  stats: PlayerStats;
  dailyEligible: boolean;
  isExternalScout?: boolean;
}

export interface FormationSlot {
  slotIndex: number;
  role: RoleCode;
  position: PositionGroup;
  label: string;
  x: number;
  y: number;
}

export interface Formation {
  id: string;
  name: string;
  defCount: number;
  medCount: number;
  delCount: number;
  description: string;
  realClubs: string;
  slots: FormationSlot[];
}

export interface MatchEvent {
  minute: number;
  team: 'user' | 'bot';
  type: 'goal' | 'save' | 'sub' | 'yellow' | 'chance' | 'penalty';
  title: string;
  detail: string;
}

export interface MatchResult {
  id: string;
  playedAt: string;
  difficulty: BotDifficulty;
  difficultyLabel: string;
  botTeamName: string;
  botOverall: number;
  userOverall: number;
  chemistryScore: number;
  chemistryBonus: number;
  playStyleLabel: string;
  userGoals: number;
  botGoals: number;
  outcome: 'win' | 'draw' | 'loss';
  reward: number;
  possessionUser: number;
  shotsUser: number;
  shotsBot: number;
  events: MatchEvent[];
}

export interface ClubProfile {
  id: string;
  name: string;
  managerName: string;
  budget: number;
  draftCompleted: boolean;
  formationId: string;
  customFormation?: { def: number; med: number; del: number } | null;
  tactics: MatchTactics;
  starters: Array<string | null>;
  bench: Array<string | null>;
  reserves: string[];
  dailyPurchasedKeys: string[];
  matchHistory: MatchResult[];
  record: { wins: number; draws: number; losses: number };
  createdAt: string;
}

export interface MarketListing {
  id: string;
  playerId: string;
  player: Player;
  sellerClubId: string;
  sellerClubName: string;
  sellerManager: string;
  price: number;
  listedAt: string;
  isSystemClub: boolean;
}

export interface ClubLeaderboardEntry {
  id: string;
  name: string;
  managerName: string;
  formationId: string;
  startersCount: number;
  benchCount: number;
  reservesCount: number;
  avgOverall: number;
  squadValue: number;
  budget: number;
  wins: number;
}

export interface DailyShopResponse {
  dateKey: string;
  refreshAt: string;
  players: Player[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  publishedAt: string;
  url: string;
}

export interface BootstrapPayload {
  club: ClubProfile;
  ownedPlayers: Record<string, Player>;
  dailyShop: DailyShopResponse;
  marketListings: MarketListing[];
  leaderboard: ClubLeaderboardEntry[];
  formations: Formation[];
}

export interface SearchPlayerResult {
  player: Player;
  availability: 'owned' | 'draft_open' | 'daily_shop' | 'market' | 'scout_only';
  marketListingId?: string;
  marketPrice?: number;
  sellerClubName?: string;
}

export interface CareerSummary {
  id: string;
  name: string;
  managerName: string;
  budget: number;
  draftCompleted: boolean;
  formationId: string;
  playStyle: PlayStyleId;
  startersCount: number;
  benchCount: number;
  avgOverall: number;
  record: { wins: number; draws: number; losses: number };
  createdAt: string;
}

