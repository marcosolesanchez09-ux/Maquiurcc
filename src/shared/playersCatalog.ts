import type { LeagueName, Player, PositionGroup, RoleCode } from './types.ts';
import { FIFA_EXTRA_SEEDS, type CompactPlayerSeed } from './fifaExtraCatalog.ts';

const SEEDS: CompactPlayerSeed[] = [
  // ================= LALIGA =================
  { id: 'unai-simon', name: 'Unai Simón', shortName: 'U. Simón', pos: 'POR', role: 'POR', ovr: 85, age: 29, nat: 'España', club: 'Athletic Club', league: 'LaLiga', val: 34, num: 1, c1: '#B91C1C', c2: '#FFFFFF', daily: true },
  { id: 'jan-oblak', name: 'Jan Oblak', shortName: 'Oblak', pos: 'POR', role: 'POR', ovr: 88, age: 33, nat: 'Eslovenia', club: 'Atlético de Madrid', league: 'LaLiga', val: 42, num: 13, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'courtois', name: 'Thibaut Courtois', shortName: 'Courtois', pos: 'POR', role: 'POR', ovr: 89, age: 34, nat: 'Bélgica', club: 'Real Madrid', league: 'LaLiga', val: 46, num: 1, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'alex-remiro', name: 'Álex Remiro', shortName: 'Remiro', pos: 'POR', role: 'POR', ovr: 83, age: 31, nat: 'España', club: 'Real Sociedad', league: 'LaLiga', val: 25, num: 1, c1: '#1D4ED8', c2: '#FFFFFF', daily: true },
  { id: 'joan-garcia', name: 'Joan García', shortName: 'J. García', pos: 'POR', role: 'POR', ovr: 81, age: 25, nat: 'España', club: 'RCD Espanyol', league: 'LaLiga', val: 22, num: 1, c1: '#2563EB', c2: '#FFFFFF', daily: true },
  { id: 'mamardashvili', name: 'Giorgi Mamardashvili', shortName: 'Mamardashvili', pos: 'POR', role: 'POR', ovr: 85, age: 26, nat: 'Georgia', club: 'Valencia CF', league: 'LaLiga', val: 40, num: 25, c1: '#F8FAFC', c2: '#111827', daily: true },

  { id: 'pau-cubarsi', name: 'Pau Cubarsí', shortName: 'Cubarsí', pos: 'DEF', role: 'DFC', ovr: 84, age: 19, nat: 'España', club: 'FC Barcelona', league: 'LaLiga', val: 58, num: 2, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'jules-kounde', name: 'Jules Koundé', shortName: 'Koundé', pos: 'DEF', role: 'LD', ovr: 86, age: 27, nat: 'Francia', club: 'FC Barcelona', league: 'LaLiga', val: 56, num: 23, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'alejandro-balde', name: 'Alejandro Balde', shortName: 'Balde', pos: 'DEF', role: 'LI', ovr: 83, age: 23, nat: 'España', club: 'FC Barcelona', league: 'LaLiga', val: 48, num: 3, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'dani-carvajal', name: 'Dani Carvajal', shortName: 'Carvajal', pos: 'DEF', role: 'LD', ovr: 86, age: 34, nat: 'España', club: 'Real Madrid', league: 'LaLiga', val: 30, num: 2, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'antonio-rudiger', name: 'Antonio Rüdiger', shortName: 'Rüdiger', pos: 'DEF', role: 'DFC', ovr: 88, age: 33, nat: 'Alemania', club: 'Real Madrid', league: 'LaLiga', val: 44, num: 22, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'robin-le-normand', name: 'Robin Le Normand', shortName: 'Le Normand', pos: 'DEF', role: 'DFC', ovr: 84, age: 29, nat: 'España', club: 'Atlético de Madrid', league: 'LaLiga', val: 42, num: 24, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'dani-vivian', name: 'Dani Vivian', shortName: 'Vivian', pos: 'DEF', role: 'DFC', ovr: 83, age: 27, nat: 'España', club: 'Athletic Club', league: 'LaLiga', val: 36, num: 3, c1: '#B91C1C', c2: '#FFFFFF', daily: true },
  { id: 'miguel-gutierrez', name: 'Miguel Gutiérrez', shortName: 'M. Gutiérrez', pos: 'DEF', role: 'LI', ovr: 82, age: 25, nat: 'España', club: 'Girona FC', league: 'LaLiga', val: 32, num: 3, c1: '#DC2626', c2: '#F8FAFC', daily: true },
  { id: 'pedro-porro', name: 'Pedro Porro', shortName: 'P. Porro', pos: 'DEF', role: 'LD', ovr: 84, age: 27, nat: 'España', club: 'Tottenham', league: 'Premier League', val: 45, num: 23, c1: '#F1F5F9', c2: '#0F172A', daily: true },
  { id: 'jose-gaya', name: 'José Gayà', shortName: 'Gayà', pos: 'DEF', role: 'LI', ovr: 82, age: 31, nat: 'España', club: 'Valencia CF', league: 'LaLiga', val: 24, num: 14, c1: '#F8FAFC', c2: '#111827', daily: true },

  { id: 'pedri', name: 'Pedri González', shortName: 'Pedri', pos: 'MED', role: 'MC', ovr: 88, age: 23, nat: 'España', club: 'FC Barcelona', league: 'LaLiga', val: 85, num: 8, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'gavi', name: 'Pablo Páez Gavi', shortName: 'Gavi', pos: 'MED', role: 'MC', ovr: 85, age: 22, nat: 'España', club: 'FC Barcelona', league: 'LaLiga', val: 72, num: 6, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'dani-olmo', name: 'Dani Olmo', shortName: 'D. Olmo', pos: 'MED', role: 'MCO', ovr: 86, age: 28, nat: 'España', club: 'FC Barcelona', league: 'LaLiga', val: 62, num: 20, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'fede-valverde', name: 'Federico Valverde', shortName: 'Valverde', pos: 'MED', role: 'MC', ovr: 89, age: 28, nat: 'Uruguay', club: 'Real Madrid', league: 'LaLiga', val: 95, num: 8, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'eduardo-camavinga', name: 'Eduardo Camavinga', shortName: 'Camavinga', pos: 'MED', role: 'MCD', ovr: 85, age: 24, nat: 'Francia', club: 'Real Madrid', league: 'LaLiga', val: 68, num: 6, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'jude-bellingham', name: 'Jude Bellingham', shortName: 'Bellingham', pos: 'MED', role: 'MCO', ovr: 90, age: 23, nat: 'Inglaterra', club: 'Real Madrid', league: 'LaLiga', val: 120, num: 5, c1: '#E2E8F0', c2: '#1E293B', daily: false },
  { id: 'martin-zubimendi', name: 'Martín Zubimendi', shortName: 'Zubimendi', pos: 'MED', role: 'MCD', ovr: 85, age: 27, nat: 'España', club: 'Real Sociedad', league: 'LaLiga', val: 58, num: 4, c1: '#1D4ED8', c2: '#FFFFFF', daily: true },
  { id: 'alex-baena', name: 'Álex Baena', shortName: 'Baena', pos: 'MED', role: 'MI', ovr: 84, age: 25, nat: 'España', club: 'Villarreal CF', league: 'LaLiga', val: 50, num: 16, c1: '#EAB308', c2: '#1E3A8A', daily: true },
  { id: 'oihan-sancet', name: 'Oihan Sancet', shortName: 'Sancet', pos: 'MED', role: 'MCO', ovr: 83, age: 26, nat: 'España', club: 'Athletic Club', league: 'LaLiga', val: 44, num: 8, c1: '#B91C1C', c2: '#FFFFFF', daily: true },
  { id: 'pablo-barrios', name: 'Pablo Barrios', shortName: 'Barrios', pos: 'MED', role: 'MC', ovr: 81, age: 23, nat: 'España', club: 'Atlético de Madrid', league: 'LaLiga', val: 38, num: 8, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'isco', name: 'Isco Alarcón', shortName: 'Isco', pos: 'MED', role: 'MCO', ovr: 84, age: 34, nat: 'España', club: 'Real Betis', league: 'LaLiga', val: 22, num: 22, c1: '#16A34A', c2: '#FFFFFF', daily: true },

  { id: 'lamine-yamal', name: 'Lamine Yamal', shortName: 'L. Yamal', pos: 'DEL', role: 'ED', ovr: 88, age: 19, nat: 'España', club: 'FC Barcelona', league: 'LaLiga', val: 110, num: 19, c1: '#1D4ED8', c2: '#991B1B', daily: false },
  { id: 'raphinha', name: 'Raphinha Belloli', shortName: 'Raphinha', pos: 'DEL', role: 'ED', ovr: 87, age: 29, nat: 'Brasil', club: 'FC Barcelona', league: 'LaLiga', val: 72, num: 11, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'lewandowski', name: 'Robert Lewandowski', shortName: 'Lewandowski', pos: 'DEL', role: 'DC', ovr: 87, age: 38, nat: 'Polonia', club: 'FC Barcelona', league: 'LaLiga', val: 28, num: 9, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'kylian-mbappe', name: 'Kylian Mbappé', shortName: 'Mbappé', pos: 'DEL', role: 'DC', ovr: 91, age: 27, nat: 'Francia', club: 'Real Madrid', league: 'LaLiga', val: 145, num: 9, c1: '#E2E8F0', c2: '#1E293B', daily: false },
  { id: 'vinicius-jr', name: 'Vinícius Júnior', shortName: 'Vinícius Jr.', pos: 'DEL', role: 'EI', ovr: 90, age: 26, nat: 'Brasil', club: 'Real Madrid', league: 'LaLiga', val: 135, num: 7, c1: '#E2E8F0', c2: '#1E293B', daily: false },
  { id: 'rodrygo', name: 'Rodrygo Goes', shortName: 'Rodrygo', pos: 'DEL', role: 'ED', ovr: 86, age: 25, nat: 'Brasil', club: 'Real Madrid', league: 'LaLiga', val: 82, num: 11, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'brahim-diaz', name: 'Brahim Díaz', shortName: 'Brahim', pos: 'DEL', role: 'ED', ovr: 83, age: 27, nat: 'Marruecos', club: 'Real Madrid', league: 'LaLiga', val: 42, num: 21, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'julian-alvarez', name: 'Julián Álvarez', shortName: 'J. Álvarez', pos: 'DEL', role: 'DC', ovr: 87, age: 26, nat: 'Argentina', club: 'Atlético de Madrid', league: 'LaLiga', val: 80, num: 19, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'antoine-griezmann', name: 'Antoine Griezmann', shortName: 'Griezmann', pos: 'DEL', role: 'SD', ovr: 86, age: 35, nat: 'Francia', club: 'Atlético de Madrid', league: 'LaLiga', val: 32, num: 7, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'nico-williams', name: 'Nico Williams', shortName: 'N. Williams', pos: 'DEL', role: 'EI', ovr: 86, age: 24, nat: 'España', club: 'Athletic Club', league: 'LaLiga', val: 70, num: 10, c1: '#B91C1C', c2: '#FFFFFF', daily: true },
  { id: 'takefusa-kubo', name: 'Takefusa Kubo', shortName: 'Kubo', pos: 'DEL', role: 'ED', ovr: 83, age: 25, nat: 'Japón', club: 'Real Sociedad', league: 'LaLiga', val: 46, num: 14, c1: '#1D4ED8', c2: '#FFFFFF', daily: true },
  { id: 'mikel-oyarzabal', name: 'Mikel Oyarzabal', shortName: 'Oyarzabal', pos: 'DEL', role: 'DC', ovr: 83, age: 29, nat: 'España', club: 'Real Sociedad', league: 'LaLiga', val: 36, num: 10, c1: '#1D4ED8', c2: '#FFFFFF', daily: true },

  // ================= PREMIER LEAGUE =================
  { id: 'david-raya', name: 'David Raya', shortName: 'Raya', pos: 'POR', role: 'POR', ovr: 86, age: 31, nat: 'España', club: 'Arsenal', league: 'Premier League', val: 40, num: 22, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'alisson', name: 'Alisson Becker', shortName: 'Alisson', pos: 'POR', role: 'POR', ovr: 89, age: 34, nat: 'Brasil', club: 'Liverpool', league: 'Premier League', val: 42, num: 1, c1: '#B91C1C', c2: '#FEF08A', daily: true },
  { id: 'emiliano-martinez', name: 'Emiliano Martínez', shortName: 'E. Martínez', pos: 'POR', role: 'POR', ovr: 87, age: 34, nat: 'Argentina', club: 'Aston Villa', league: 'Premier League', val: 34, num: 23, c1: '#7C2D12', c2: '#93C5FD', daily: true },
  { id: 'guglielmo-vicario', name: 'Guglielmo Vicario', shortName: 'Vicario', pos: 'POR', role: 'POR', ovr: 84, age: 30, nat: 'Italia', club: 'Tottenham', league: 'Premier League', val: 32, num: 1, c1: '#F1F5F9', c2: '#0F172A', daily: true },

  { id: 'william-saliba', name: 'William Saliba', shortName: 'Saliba', pos: 'DEF', role: 'DFC', ovr: 88, age: 25, nat: 'Francia', club: 'Arsenal', league: 'Premier League', val: 82, num: 2, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'gabriel-magalhaes', name: 'Gabriel Magalhães', shortName: 'Gabriel', pos: 'DEF', role: 'DFC', ovr: 87, age: 28, nat: 'Brasil', club: 'Arsenal', league: 'Premier League', val: 70, num: 6, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'virgil-van-dijk', name: 'Virgil van Dijk', shortName: 'Van Dijk', pos: 'DEF', role: 'DFC', ovr: 89, age: 35, nat: 'Países Bajos', club: 'Liverpool', league: 'Premier League', val: 45, num: 4, c1: '#B91C1C', c2: '#FEF08A', daily: true },
  { id: 'trent-arnold', name: 'Trent Alexander-Arnold', shortName: 'Alexander-Arnold', pos: 'DEF', role: 'LD', ovr: 87, age: 28, nat: 'Inglaterra', club: 'Liverpool', league: 'Premier League', val: 72, num: 66, c1: '#B91C1C', c2: '#FEF08A', daily: true },
  { id: 'ruben-dias', name: 'Rúben Dias', shortName: 'Rúben Dias', pos: 'DEF', role: 'DFC', ovr: 88, age: 29, nat: 'Portugal', club: 'Manchester City', league: 'Premier League', val: 76, num: 3, c1: '#38BDF8', c2: '#FFFFFF', daily: true },
  { id: 'josko-gvardiol', name: 'Joško Gvardiol', shortName: 'Gvardiol', pos: 'DEF', role: 'LI', ovr: 86, age: 24, nat: 'Croacia', club: 'Manchester City', league: 'Premier League', val: 74, num: 24, c1: '#38BDF8', c2: '#FFFFFF', daily: true },
  { id: 'marc-cucurella', name: 'Marc Cucurella', shortName: 'Cucurella', pos: 'DEF', role: 'LI', ovr: 83, age: 28, nat: 'España', club: 'Chelsea', league: 'Premier League', val: 38, num: 3, c1: '#1D4ED8', c2: '#FFFFFF', daily: true },
  { id: 'micky-van-de-ven', name: 'Micky van de Ven', shortName: 'Van de Ven', pos: 'DEF', role: 'DFC', ovr: 84, age: 25, nat: 'Países Bajos', club: 'Tottenham', league: 'Premier League', val: 54, num: 37, c1: '#F1F5F9', c2: '#0F172A', daily: true },
  { id: 'lisandro-martinez', name: 'Lisandro Martínez', shortName: 'L. Martínez', pos: 'DEF', role: 'DFC', ovr: 84, age: 28, nat: 'Argentina', club: 'Manchester United', league: 'Premier League', val: 48, num: 6, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'murillo', name: 'Murillo Santiago', shortName: 'Murillo', pos: 'DEF', role: 'DFC', ovr: 82, age: 24, nat: 'Brasil', club: 'Nottingham Forest', league: 'Premier League', val: 42, num: 5, c1: '#DC2626', c2: '#FFFFFF', daily: true },

  { id: 'rodri', name: 'Rodrigo Hernández', shortName: 'Rodri', pos: 'MED', role: 'MCD', ovr: 91, age: 30, nat: 'España', club: 'Manchester City', league: 'Premier League', val: 115, num: 16, c1: '#38BDF8', c2: '#FFFFFF', daily: false },
  { id: 'martin-odegaard', name: 'Martin Ødegaard', shortName: 'Ødegaard', pos: 'MED', role: 'MCO', ovr: 89, age: 27, nat: 'Noruega', club: 'Arsenal', league: 'Premier League', val: 92, num: 8, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'declan-rice', name: 'Declan Rice', shortName: 'Rice', pos: 'MED', role: 'MCD', ovr: 88, age: 27, nat: 'Inglaterra', club: 'Arsenal', league: 'Premier League', val: 90, num: 41, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'cole-palmer', name: 'Cole Palmer', shortName: 'Palmer', pos: 'MED', role: 'MCO', ovr: 88, age: 24, nat: 'Inglaterra', club: 'Chelsea', league: 'Premier League', val: 95, num: 20, c1: '#1D4ED8', c2: '#FFFFFF', daily: true },
  { id: 'moises-caicedo', name: 'Moisés Caicedo', shortName: 'Caicedo', pos: 'MED', role: 'MCD', ovr: 85, age: 25, nat: 'Ecuador', club: 'Chelsea', league: 'Premier League', val: 68, num: 25, c1: '#1D4ED8', c2: '#FFFFFF', daily: true },
  { id: 'enzo-fernandez', name: 'Enzo Fernández', shortName: 'Enzo', pos: 'MED', role: 'MC', ovr: 84, age: 25, nat: 'Argentina', club: 'Chelsea', league: 'Premier League', val: 64, num: 8, c1: '#1D4ED8', c2: '#FFFFFF', daily: true },
  { id: 'alexis-mac-allister', name: 'Alexis Mac Allister', shortName: 'Mac Allister', pos: 'MED', role: 'MC', ovr: 87, age: 27, nat: 'Argentina', club: 'Liverpool', league: 'Premier League', val: 76, num: 10, c1: '#B91C1C', c2: '#FEF08A', daily: true },
  { id: 'ryan-gravenberch', name: 'Ryan Gravenberch', shortName: 'Gravenberch', pos: 'MED', role: 'MCD', ovr: 84, age: 24, nat: 'Países Bajos', club: 'Liverpool', league: 'Premier League', val: 56, num: 38, c1: '#B91C1C', c2: '#FEF08A', daily: true },
  { id: 'bruno-guimaraes', name: 'Bruno Guimarães', shortName: 'B. Guimarães', pos: 'MED', role: 'MC', ovr: 86, age: 28, nat: 'Brasil', club: 'Newcastle United', league: 'Premier League', val: 72, num: 39, c1: '#111827', c2: '#FFFFFF', daily: true },
  { id: 'bruno-fernandes', name: 'Bruno Fernandes', shortName: 'B. Fernandes', pos: 'MED', role: 'MCO', ovr: 87, age: 32, nat: 'Portugal', club: 'Manchester United', league: 'Premier League', val: 58, num: 8, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'morgan-rogers', name: 'Morgan Rogers', shortName: 'M. Rogers', pos: 'MED', role: 'MCO', ovr: 81, age: 24, nat: 'Inglaterra', club: 'Aston Villa', league: 'Premier League', val: 40, num: 27, c1: '#7C2D12', c2: '#93C5FD', daily: true },

  { id: 'erling-haaland', name: 'Erling Haaland', shortName: 'Haaland', pos: 'DEL', role: 'DC', ovr: 91, age: 26, nat: 'Noruega', club: 'Manchester City', league: 'Premier League', val: 145, num: 9, c1: '#38BDF8', c2: '#FFFFFF', daily: false },
  { id: 'phil-foden', name: 'Phil Foden', shortName: 'Foden', pos: 'DEL', role: 'ED', ovr: 88, age: 26, nat: 'Inglaterra', club: 'Manchester City', league: 'Premier League', val: 95, num: 47, c1: '#38BDF8', c2: '#FFFFFF', daily: true },
  { id: 'bukayo-saka', name: 'Bukayo Saka', shortName: 'Saka', pos: 'DEL', role: 'ED', ovr: 89, age: 25, nat: 'Inglaterra', club: 'Arsenal', league: 'Premier League', val: 105, num: 7, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'mohamed-salah', name: 'Mohamed Salah', shortName: 'Salah', pos: 'DEL', role: 'ED', ovr: 90, age: 34, nat: 'Egipto', club: 'Liverpool', league: 'Premier League', val: 65, num: 11, c1: '#B91C1C', c2: '#FEF08A', daily: true },
  { id: 'luis-diaz', name: 'Luis Díaz', shortName: 'L. Díaz', pos: 'DEL', role: 'EI', ovr: 86, age: 29, nat: 'Colombia', club: 'Liverpool', league: 'Premier League', val: 70, num: 7, c1: '#B91C1C', c2: '#FEF08A', daily: true },
  { id: 'alexander-isak', name: 'Alexander Isak', shortName: 'Isak', pos: 'DEL', role: 'DC', ovr: 87, age: 27, nat: 'Suecia', club: 'Newcastle United', league: 'Premier League', val: 85, num: 14, c1: '#111827', c2: '#FFFFFF', daily: true },
  { id: 'anthony-gordon', name: 'Anthony Gordon', shortName: 'Gordon', pos: 'DEL', role: 'EI', ovr: 84, age: 25, nat: 'Inglaterra', club: 'Newcastle United', league: 'Premier League', val: 58, num: 10, c1: '#111827', c2: '#FFFFFF', daily: true },
  { id: 'ollie-watkins', name: 'Ollie Watkins', shortName: 'Watkins', pos: 'DEL', role: 'DC', ovr: 85, age: 30, nat: 'Inglaterra', club: 'Aston Villa', league: 'Premier League', val: 55, num: 11, c1: '#7C2D12', c2: '#93C5FD', daily: true },
  { id: 'heung-min-son', name: 'Heung-min Son', shortName: 'Son', pos: 'DEL', role: 'EI', ovr: 86, age: 34, nat: 'Corea del Sur', club: 'Tottenham', league: 'Premier League', val: 42, num: 7, c1: '#F1F5F9', c2: '#0F172A', daily: true },
  { id: 'matheus-cunha', name: 'Matheus Cunha', shortName: 'Cunha', pos: 'DEL', role: 'DC', ovr: 83, age: 27, nat: 'Brasil', club: 'Wolverhampton', league: 'Premier League', val: 48, num: 10, c1: '#D97706', c2: '#111827', daily: true },

  // ================= SERIE A =================
  { id: 'mike-maignan', name: 'Mike Maignan', shortName: 'Maignan', pos: 'POR', role: 'POR', ovr: 87, age: 31, nat: 'Francia', club: 'AC Milan', league: 'Serie A', val: 40, num: 16, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'yann-sommer', name: 'Yann Sommer', shortName: 'Sommer', pos: 'POR', role: 'POR', ovr: 85, age: 37, nat: 'Suiza', club: 'Inter de Milán', league: 'Serie A', val: 16, num: 1, c1: '#1D4ED8', c2: '#0F172A', daily: true },
  { id: 'michele-di-gregorio', name: 'Michele Di Gregorio', shortName: 'Di Gregorio', pos: 'POR', role: 'POR', ovr: 83, age: 29, nat: 'Italia', club: 'Juventus', league: 'Serie A', val: 28, num: 29, c1: '#F8FAFC', c2: '#0F172A', daily: true },
  { id: 'marco-carnesecchi', name: 'Marco Carnesecchi', shortName: 'Carnesecchi', pos: 'POR', role: 'POR', ovr: 83, age: 26, nat: 'Italia', club: 'Atalanta', league: 'Serie A', val: 26, num: 29, c1: '#1E40AF', c2: '#111827', daily: true },

  { id: 'alessandro-bastoni', name: 'Alessandro Bastoni', shortName: 'Bastoni', pos: 'DEF', role: 'DFC', ovr: 88, age: 27, nat: 'Italia', club: 'Inter de Milán', league: 'Serie A', val: 75, num: 95, c1: '#1D4ED8', c2: '#0F172A', daily: true },
  { id: 'federico-dimarco', name: 'Federico Dimarco', shortName: 'Dimarco', pos: 'DEF', role: 'LI', ovr: 86, age: 29, nat: 'Italia', club: 'Inter de Milán', league: 'Serie A', val: 58, num: 32, c1: '#1D4ED8', c2: '#0F172A', daily: true },
  { id: 'theo-hernandez', name: 'Theo Hernández', shortName: 'Theo', pos: 'DEF', role: 'LI', ovr: 87, age: 29, nat: 'Francia', club: 'AC Milan', league: 'Serie A', val: 60, num: 19, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'gleison-bremer', name: 'Gleison Bremer', shortName: 'Bremer', pos: 'DEF', role: 'DFC', ovr: 86, age: 29, nat: 'Brasil', club: 'Juventus', league: 'Serie A', val: 56, num: 3, c1: '#F8FAFC', c2: '#0F172A', daily: true },
  { id: 'alessandro-buongiorno', name: 'Alessandro Buongiorno', shortName: 'Buongiorno', pos: 'DEF', role: 'DFC', ovr: 84, age: 27, nat: 'Italia', club: 'Napoli', league: 'Serie A', val: 46, num: 4, c1: '#0284C7', c2: '#FFFFFF', daily: true },
  { id: 'giovanni-di-lorenzo', name: 'Giovanni Di Lorenzo', shortName: 'Di Lorenzo', pos: 'DEF', role: 'LD', ovr: 83, age: 33, nat: 'Italia', club: 'Napoli', league: 'Serie A', val: 24, num: 22, c1: '#0284C7', c2: '#FFFFFF', daily: true },
  { id: 'denzel-dumfries', name: 'Denzel Dumfries', shortName: 'Dumfries', pos: 'DEF', role: 'LD', ovr: 83, age: 30, nat: 'Países Bajos', club: 'Inter de Milán', league: 'Serie A', val: 34, num: 2, c1: '#1D4ED8', c2: '#0F172A', daily: true },
  { id: 'giorgio-scalvini', name: 'Giorgio Scalvini', shortName: 'Scalvini', pos: 'DEF', role: 'DFC', ovr: 82, age: 22, nat: 'Italia', club: 'Atalanta', league: 'Serie A', val: 42, num: 42, c1: '#1E40AF', c2: '#111827', daily: true },

  { id: 'nicolo-barella', name: 'Nicolò Barella', shortName: 'Barella', pos: 'MED', role: 'MC', ovr: 88, age: 29, nat: 'Italia', club: 'Inter de Milán', league: 'Serie A', val: 80, num: 23, c1: '#1D4ED8', c2: '#0F172A', daily: true },
  { id: 'hakan-calhanoglu', name: 'Hakan Çalhanoğlu', shortName: 'Çalhanoğlu', pos: 'MED', role: 'MCD', ovr: 87, age: 32, nat: 'Turquía', club: 'Inter de Milán', league: 'Serie A', val: 48, num: 20, c1: '#1D4ED8', c2: '#0F172A', daily: true },
  { id: 'tijjani-reijnders', name: 'Tijjani Reijnders', shortName: 'Reijnders', pos: 'MED', role: 'MC', ovr: 85, age: 28, nat: 'Países Bajos', club: 'AC Milan', league: 'Serie A', val: 54, num: 14, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'teun-koopmeiners', name: 'Teun Koopmeiners', shortName: 'Koopmeiners', pos: 'MED', role: 'MCO', ovr: 84, age: 28, nat: 'Países Bajos', club: 'Juventus', league: 'Serie A', val: 52, num: 8, c1: '#F8FAFC', c2: '#0F172A', daily: true },
  { id: 'ederson-silva', name: 'Éderson Lourenço', shortName: 'Éderson', pos: 'MED', role: 'MCD', ovr: 84, age: 27, nat: 'Brasil', club: 'Atalanta', league: 'Serie A', val: 50, num: 13, c1: '#1E40AF', c2: '#111827', daily: true },
  { id: 'scott-mctominay', name: 'Scott McTominay', shortName: 'McTominay', pos: 'MED', role: 'MC', ovr: 83, age: 29, nat: 'Escocia', club: 'Napoli', league: 'Serie A', val: 40, num: 8, c1: '#0284C7', c2: '#FFFFFF', daily: true },
  { id: 'nico-paz', name: 'Nico Paz', shortName: 'Nico Paz', pos: 'MED', role: 'MCO', ovr: 81, age: 22, nat: 'Argentina', club: 'Como 1907', league: 'Serie A', val: 38, num: 79, c1: '#2563EB', c2: '#FFFFFF', daily: true },
  { id: 'manu-kone', name: 'Manu Koné', shortName: 'M. Koné', pos: 'MED', role: 'MC', ovr: 82, age: 25, nat: 'Francia', club: 'AS Roma', league: 'Serie A', val: 36, num: 17, c1: '#991B1B', c2: '#F59E0B', daily: true },

  { id: 'lautaro-martinez', name: 'Lautaro Martínez', shortName: 'Lautaro', pos: 'DEL', role: 'DC', ovr: 89, age: 29, nat: 'Argentina', club: 'Inter de Milán', league: 'Serie A', val: 95, num: 10, c1: '#1D4ED8', c2: '#0F172A', daily: true },
  { id: 'marcus-thuram', name: 'Marcus Thuram', shortName: 'M. Thuram', pos: 'DEL', role: 'DC', ovr: 86, age: 29, nat: 'Francia', club: 'Inter de Milán', league: 'Serie A', val: 68, num: 9, c1: '#1D4ED8', c2: '#0F172A', daily: true },
  { id: 'rafael-leao', name: 'Rafael Leão', shortName: 'R. Leão', pos: 'DEL', role: 'EI', ovr: 87, age: 27, nat: 'Portugal', club: 'AC Milan', league: 'Serie A', val: 78, num: 10, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'christian-pulisic', name: 'Christian Pulisic', shortName: 'Pulisic', pos: 'DEL', role: 'ED', ovr: 85, age: 28, nat: 'EE. UU.', club: 'AC Milan', league: 'Serie A', val: 54, num: 11, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'dusan-vlahovic', name: 'Dušan Vlahović', shortName: 'Vlahović', pos: 'DEL', role: 'DC', ovr: 85, age: 26, nat: 'Serbia', club: 'Juventus', league: 'Serie A', val: 58, num: 9, c1: '#F8FAFC', c2: '#0F172A', daily: true },
  { id: 'kenan-yildiz', name: 'Kenan Yıldız', shortName: 'Yıldız', pos: 'DEL', role: 'EI', ovr: 82, age: 21, nat: 'Turquía', club: 'Juventus', league: 'Serie A', val: 48, num: 10, c1: '#F8FAFC', c2: '#0F172A', daily: true },
  { id: 'ademola-lookman', name: 'Ademola Lookman', shortName: 'Lookman', pos: 'DEL', role: 'SD', ovr: 85, age: 29, nat: 'Nigeria', club: 'Atalanta', league: 'Serie A', val: 55, num: 11, c1: '#1E40AF', c2: '#111827', daily: true },
  { id: 'paulo-dybala', name: 'Paulo Dybala', shortName: 'Dybala', pos: 'DEL', role: 'SD', ovr: 85, age: 32, nat: 'Argentina', club: 'AS Roma', league: 'Serie A', val: 30, num: 21, c1: '#991B1B', c2: '#F59E0B', daily: true },
  { id: 'mateo-retegui', name: 'Mateo Retegui', shortName: 'Retegui', pos: 'DEL', role: 'DC', ovr: 83, age: 27, nat: 'Italia', club: 'Atalanta', league: 'Serie A', val: 44, num: 32, c1: '#1E40AF', c2: '#111827', daily: true },

  // ================= BUNDESLIGA =================
  { id: 'gregor-kobel', name: 'Gregor Kobel', shortName: 'Kobel', pos: 'POR', role: 'POR', ovr: 87, age: 28, nat: 'Suiza', club: 'Borussia Dortmund', league: 'Bundesliga', val: 44, num: 1, c1: '#EAB308', c2: '#111827', daily: true },
  { id: 'manuel-neuer', name: 'Manuel Neuer', shortName: 'Neuer', pos: 'POR', role: 'POR', ovr: 85, age: 40, nat: 'Alemania', club: 'Bayern Múnich', league: 'Bundesliga', val: 14, num: 1, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'lukas-hradecky', name: 'Lukáš Hrádecký', shortName: 'Hrádecký', pos: 'POR', role: 'POR', ovr: 82, age: 36, nat: 'Finlandia', club: 'Bayer Leverkusen', league: 'Bundesliga', val: 15, num: 1, c1: '#DC2626', c2: '#111827', daily: true },

  { id: 'jeremie-frimpong', name: 'Jeremie Frimpong', shortName: 'Frimpong', pos: 'DEF', role: 'LD', ovr: 86, age: 25, nat: 'Países Bajos', club: 'Bayer Leverkusen', league: 'Bundesliga', val: 58, num: 30, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'alejandro-grimaldo', name: 'Alejandro Grimaldo', shortName: 'Grimaldo', pos: 'DEF', role: 'LI', ovr: 86, age: 31, nat: 'España', club: 'Bayer Leverkusen', league: 'Bundesliga', val: 48, num: 20, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'jonathan-tah', name: 'Jonathan Tah', shortName: 'Tah', pos: 'DEF', role: 'DFC', ovr: 85, age: 30, nat: 'Alemania', club: 'Bayer Leverkusen', league: 'Bundesliga', val: 40, num: 4, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'alphonso-davies', name: 'Alphonso Davies', shortName: 'Davies', pos: 'DEF', role: 'LI', ovr: 85, age: 26, nat: 'Canadá', club: 'Bayern Múnich', league: 'Bundesliga', val: 56, num: 19, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'dayot-upamecano', name: 'Dayot Upamecano', shortName: 'Upamecano', pos: 'DEF', role: 'DFC', ovr: 85, age: 28, nat: 'Francia', club: 'Bayern Múnich', league: 'Bundesliga', val: 52, num: 2, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'nico-schlotterbeck', name: 'Nico Schlotterbeck', shortName: 'Schlotterbeck', pos: 'DEF', role: 'DFC', ovr: 84, age: 26, nat: 'Alemania', club: 'Borussia Dortmund', league: 'Bundesliga', val: 46, num: 4, c1: '#EAB308', c2: '#111827', daily: true },
  { id: 'castello-lukeba', name: 'Castello Lukeba', shortName: 'Lukeba', pos: 'DEF', role: 'DFC', ovr: 83, age: 23, nat: 'Francia', club: 'RB Leipzig', league: 'Bundesliga', val: 48, num: 23, c1: '#F8FAFC', c2: '#DC2626', daily: true },

  { id: 'florian-wirtz', name: 'Florian Wirtz', shortName: 'Wirtz', pos: 'MED', role: 'MCO', ovr: 89, age: 23, nat: 'Alemania', club: 'Bayer Leverkusen', league: 'Bundesliga', val: 115, num: 10, c1: '#DC2626', c2: '#111827', daily: false },
  { id: 'jamal-musiala', name: 'Jamal Musiala', shortName: 'Musiala', pos: 'MED', role: 'MCO', ovr: 89, age: 23, nat: 'Alemania', club: 'Bayern Múnich', league: 'Bundesliga', val: 115, num: 42, c1: '#DC2626', c2: '#FFFFFF', daily: false },
  { id: 'joshua-kimmich', name: 'Joshua Kimmich', shortName: 'Kimmich', pos: 'MED', role: 'MCD', ovr: 88, age: 31, nat: 'Alemania', club: 'Bayern Múnich', league: 'Bundesliga', val: 62, num: 6, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'granit-xhaka', name: 'Granit Xhaka', shortName: 'Xhaka', pos: 'MED', role: 'MCD', ovr: 85, age: 34, nat: 'Suiza', club: 'Bayer Leverkusen', league: 'Bundesliga', val: 28, num: 34, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'xavi-simons', name: 'Xavi Simons', shortName: 'X. Simons', pos: 'MED', role: 'MCO', ovr: 85, age: 23, nat: 'Países Bajos', club: 'RB Leipzig', league: 'Bundesliga', val: 74, num: 10, c1: '#F8FAFC', c2: '#DC2626', daily: true },
  { id: 'angelo-stiller', name: 'Angelo Stiller', shortName: 'Stiller', pos: 'MED', role: 'MCD', ovr: 82, age: 25, nat: 'Alemania', club: 'VfB Stuttgart', league: 'Bundesliga', val: 38, num: 6, c1: '#F8FAFC', c2: '#DC2626', daily: true },
  { id: 'julian-brandt', name: 'Julian Brandt', shortName: 'Brandt', pos: 'MED', role: 'MCO', ovr: 83, age: 30, nat: 'Alemania', club: 'Borussia Dortmund', league: 'Bundesliga', val: 36, num: 10, c1: '#EAB308', c2: '#111827', daily: true },

  { id: 'harry-kane', name: 'Harry Kane', shortName: 'H. Kane', pos: 'DEL', role: 'DC', ovr: 90, age: 33, nat: 'Inglaterra', club: 'Bayern Múnich', league: 'Bundesliga', val: 92, num: 9, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'michael-olise', name: 'Michael Olise', shortName: 'Olise', pos: 'DEL', role: 'ED', ovr: 86, age: 24, nat: 'Francia', club: 'Bayern Múnich', league: 'Bundesliga', val: 72, num: 17, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'karim-adeyemi', name: 'Karim Adeyemi', shortName: 'Adeyemi', pos: 'DEL', role: 'EI', ovr: 82, age: 24, nat: 'Alemania', club: 'Borussia Dortmund', league: 'Bundesliga', val: 42, num: 27, c1: '#EAB308', c2: '#111827', daily: true },
  { id: 'serhou-guirassy', name: 'Serhou Guirassy', shortName: 'Guirassy', pos: 'DEL', role: 'DC', ovr: 85, age: 30, nat: 'Guinea', club: 'Borussia Dortmund', league: 'Bundesliga', val: 46, num: 9, c1: '#EAB308', c2: '#111827', daily: true },
  { id: 'benjamin-sesko', name: 'Benjamin Šeško', shortName: 'Šeško', pos: 'DEL', role: 'DC', ovr: 84, age: 23, nat: 'Eslovenia', club: 'RB Leipzig', league: 'Bundesliga', val: 62, num: 30, c1: '#F8FAFC', c2: '#DC2626', daily: true },
  { id: 'victor-boniface', name: 'Victor Boniface', shortName: 'Boniface', pos: 'DEL', role: 'DC', ovr: 84, age: 25, nat: 'Nigeria', club: 'Bayer Leverkusen', league: 'Bundesliga', val: 50, num: 22, c1: '#DC2626', c2: '#111827', daily: true },

  // ================= LIGUE 1 =================
  { id: 'donnarumma', name: 'Gianluigi Donnarumma', shortName: 'Donnarumma', pos: 'POR', role: 'POR', ovr: 88, age: 27, nat: 'Italia', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 48, num: 1, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'lucas-chevalier', name: 'Lucas Chevalier', shortName: 'Chevalier', pos: 'POR', role: 'POR', ovr: 83, age: 25, nat: 'Francia', club: 'Lille OSC', league: 'Ligue 1', val: 32, num: 30, c1: '#DC2626', c2: '#1E3A8A', daily: true },
  { id: 'geronimo-rulli', name: 'Gerónimo Rulli', shortName: 'Rulli', pos: 'POR', role: 'POR', ovr: 81, age: 34, nat: 'Argentina', club: 'Olympique Marsella', league: 'Ligue 1', val: 16, num: 1, c1: '#0284C7', c2: '#FFFFFF', daily: true },

  { id: 'achraf-hakimi', name: 'Achraf Hakimi', shortName: 'Hakimi', pos: 'DEF', role: 'LD', ovr: 87, age: 28, nat: 'Marruecos', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 68, num: 2, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'marquinhos', name: 'Marquinhos Corrêa', shortName: 'Marquinhos', pos: 'DEF', role: 'DFC', ovr: 87, age: 32, nat: 'Brasil', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 48, num: 5, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'willian-pacho', name: 'Willian Pacho', shortName: 'Pacho', pos: 'DEF', role: 'DFC', ovr: 84, age: 25, nat: 'Ecuador', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 52, num: 51, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'nuno-mendes', name: 'Nuno Mendes', shortName: 'N. Mendes', pos: 'DEF', role: 'LI', ovr: 85, age: 24, nat: 'Portugal', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 60, num: 25, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'leonardo-balerdi', name: 'Leonardo Balerdi', shortName: 'Balerdi', pos: 'DEF', role: 'DFC', ovr: 82, age: 27, nat: 'Argentina', club: 'Olympique Marsella', league: 'Ligue 1', val: 30, num: 5, c1: '#0284C7', c2: '#FFFFFF', daily: true },
  { id: 'vanderson', name: 'Vanderson Campos', shortName: 'Vanderson', pos: 'DEF', role: 'LD', ovr: 81, age: 25, nat: 'Brasil', club: 'AS Mónaco', league: 'Ligue 1', val: 28, num: 2, c1: '#DC2626', c2: '#FFFFFF', daily: true },

  { id: 'vitinha', name: 'Vítor Ferreira Vitinha', shortName: 'Vitinha', pos: 'MED', role: 'MC', ovr: 87, age: 26, nat: 'Portugal', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 76, num: 17, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'joao-neves', name: 'João Neves', shortName: 'J. Neves', pos: 'MED', role: 'MCD', ovr: 85, age: 22, nat: 'Portugal', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 72, num: 87, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'fabian-ruiz', name: 'Fabián Ruiz', shortName: 'Fabián', pos: 'MED', role: 'MC', ovr: 84, age: 30, nat: 'España', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 42, num: 8, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'warren-zaire-emery', name: 'Warren Zaïre-Emery', shortName: 'Zaïre-Emery', pos: 'MED', role: 'MC', ovr: 84, age: 20, nat: 'Francia', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 65, num: 33, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'adrien-rabiot', name: 'Adrien Rabiot', shortName: 'Rabiot', pos: 'MED', role: 'MC', ovr: 83, age: 31, nat: 'Francia', club: 'Olympique Marsella', league: 'Ligue 1', val: 30, num: 25, c1: '#0284C7', c2: '#FFFFFF', daily: true },
  { id: 'rayan-cherki', name: 'Rayan Cherki', shortName: 'Cherki', pos: 'MED', role: 'MCO', ovr: 82, age: 23, nat: 'Francia', club: 'Olympique Lyon', league: 'Ligue 1', val: 38, num: 18, c1: '#F8FAFC', c2: '#1D4ED8', daily: true },
  { id: 'maghnes-akliouche', name: 'Maghnes Akliouche', shortName: 'Akliouche', pos: 'MED', role: 'MCO', ovr: 81, age: 24, nat: 'Francia', club: 'AS Mónaco', league: 'Ligue 1', val: 36, num: 11, c1: '#DC2626', c2: '#FFFFFF', daily: true },

  { id: 'ousmane-dembele', name: 'Ousmane Dembélé', shortName: 'Dembélé', pos: 'DEL', role: 'ED', ovr: 87, age: 29, nat: 'Francia', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 65, num: 10, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'bradley-barcola', name: 'Bradley Barcola', shortName: 'Barcola', pos: 'DEL', role: 'EI', ovr: 85, age: 24, nat: 'Francia', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 72, num: 29, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'kvaratskhelia', name: 'Khvicha Kvaratskhelia', shortName: 'Kvaratskhelia', pos: 'DEL', role: 'EI', ovr: 87, age: 25, nat: 'Georgia', club: 'Paris Saint-Germain', league: 'Ligue 1', val: 82, num: 7, c1: '#1E3A8A', c2: '#DC2626', daily: true },
  { id: 'jonathan-david', name: 'Jonathan David', shortName: 'J. David', pos: 'DEL', role: 'DC', ovr: 84, age: 26, nat: 'Canadá', club: 'Lille OSC', league: 'Ligue 1', val: 48, num: 9, c1: '#DC2626', c2: '#1E3A8A', daily: true },
  { id: 'mason-greenwood', name: 'Mason Greenwood', shortName: 'Greenwood', pos: 'DEL', role: 'ED', ovr: 83, age: 25, nat: 'Inglaterra', club: 'Olympique Marsella', league: 'Ligue 1', val: 42, num: 10, c1: '#0284C7', c2: '#FFFFFF', daily: true },
  { id: 'alexandre-lacazette', name: 'Alexandre Lacazette', shortName: 'Lacazette', pos: 'DEL', role: 'DC', ovr: 82, age: 35, nat: 'Francia', club: 'Olympique Lyon', league: 'Ligue 1', val: 14, num: 10, c1: '#F8FAFC', c2: '#1D4ED8', daily: true },

  // ================= OTRAS LIGAS (Buscables en Buscador, no en Tienda Diaria aleatoria) =================
  { id: 'viktor-gyokeres', name: 'Viktor Gyökeres', shortName: 'Gyökeres', pos: 'DEL', role: 'DC', ovr: 87, age: 28, nat: 'Suecia', club: 'Sporting CP', league: 'Liga Portugal', val: 78, num: 9, c1: '#15803D', c2: '#FFFFFF', daily: false },
  { id: 'diogo-costa', name: 'Diogo Costa', shortName: 'D. Costa', pos: 'POR', role: 'POR', ovr: 85, age: 27, nat: 'Portugal', club: 'FC Porto', league: 'Liga Portugal', val: 44, num: 99, c1: '#1D4ED8', c2: '#FFFFFF', daily: false },
  { id: 'morten-hjulmand', name: 'Morten Hjulmand', shortName: 'Hjulmand', pos: 'MED', role: 'MCD', ovr: 83, age: 27, nat: 'Dinamarca', club: 'Sporting CP', league: 'Liga Portugal', val: 45, num: 42, c1: '#15803D', c2: '#FFFFFF', daily: false },
  { id: 'quinten-timber', name: 'Quinten Timber', shortName: 'Q. Timber', pos: 'MED', role: 'MC', ovr: 81, age: 25, nat: 'Países Bajos', club: 'Feyenoord', league: 'Eredivisie', val: 34, num: 8, c1: '#DC2626', c2: '#FFFFFF', daily: false },
  { id: 'jorrel-hato', name: 'Jorrel Hato', shortName: 'Hato', pos: 'DEF', role: 'DFC', ovr: 80, age: 20, nat: 'Países Bajos', club: 'Ajax', league: 'Eredivisie', val: 36, num: 4, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'lionel-messi', name: 'Lionel Messi', shortName: 'Messi', pos: 'DEL', role: 'ED', ovr: 88, age: 39, nat: 'Argentina', club: 'Inter Miami', league: 'Resto del Mundo', val: 35, num: 10, c1: '#EC4899', c2: '#111827', daily: false },
  { id: 'cristiano-ronaldo', name: 'Cristiano Ronaldo', shortName: 'C. Ronaldo', pos: 'DEL', role: 'DC', ovr: 86, age: 41, nat: 'Portugal', club: 'Al-Nassr', league: 'Resto del Mundo', val: 24, num: 7, c1: '#EAB308', c2: '#1D4ED8', daily: false },
  { id: 'estevao', name: 'Estêvão Willian', shortName: 'Estêvão', pos: 'DEL', role: 'ED', ovr: 81, age: 19, nat: 'Brasil', club: 'Palmeiras', league: 'Resto del Mundo', val: 52, num: 41, c1: '#15803D', c2: '#FFFFFF', daily: false },
  { id: 'franco-mastantuono', name: 'Franco Mastantuono', shortName: 'Mastantuono', pos: 'MED', role: 'MCO', ovr: 79, age: 19, nat: 'Argentina', club: 'River Plate', league: 'Resto del Mundo', val: 32, num: 30, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'neymar-jr', name: 'Neymar Jr.', shortName: 'Neymar', pos: 'DEL', role: 'EI', ovr: 85, age: 34, nat: 'Brasil', club: 'Santos FC', league: 'Resto del Mundo', val: 28, num: 10, c1: '#F8FAFC', c2: '#111827', daily: false },
];

function computeStats(seed: CompactPlayerSeed) {
  const base = seed.ovr;
  if (seed.pos === 'POR') {
    return {
      pace: Math.max(48, base - 30),
      shooting: Math.max(35, base - 42),
      passing: Math.min(92, base - 4),
      dribbling: Math.max(50, base - 25),
      defending: Math.min(93, base),
      physical: Math.min(90, base - 2),
    };
  }
  if (seed.pos === 'DEF') {
    return {
      pace: Math.min(93, seed.role === 'LI' || seed.role === 'LD' ? base + 2 : base - 6),
      shooting: Math.max(52, base - 22),
      passing: Math.min(90, base - 5),
      dribbling: Math.min(88, base - 8),
      defending: Math.min(94, base + 2),
      physical: Math.min(92, base - 1),
    };
  }
  if (seed.pos === 'MED') {
    return {
      pace: Math.min(90, base - 6),
      shooting: Math.min(89, base - 7),
      passing: Math.min(95, base + 3),
      dribbling: Math.min(93, base + 1),
      defending: seed.role === 'MCD' ? Math.min(90, base) : Math.max(60, base - 14),
      physical: Math.min(89, base - 5),
    };
  }
  return {
    pace: Math.min(96, base + 2),
    shooting: Math.min(94, base + 1),
    passing: Math.min(90, base - 6),
    dribbling: Math.min(94, base + 1),
    defending: Math.max(35, base - 42),
    physical: Math.min(88, base - 7),
  };
}

const ALL_SEEDS: CompactPlayerSeed[] = [];
const seenIds = new Set<string>();
for (const s of [...SEEDS, ...FIFA_EXTRA_SEEDS]) {
  if (!seenIds.has(s.id)) {
    seenIds.add(s.id);
    ALL_SEEDS.push(s);
  }
}

export const PLAYERS_CATALOG: Player[] = ALL_SEEDS.map((s) => ({
  id: s.id,
  name: s.name,
  shortName: s.shortName,
  position: s.pos,
  role: s.role,
  overall: s.ovr,
  age: s.age,
  nationality: s.nat,
  club: s.club,
  league: s.league,
  marketValue: s.val,
  shirtNumber: s.num,
  clubColor: s.c1,
  clubAccent: s.c2,
  stats: computeStats(s),
  dailyEligible: s.daily,
}));

export const PLAYERS_BY_ID: Record<string, Player> = Object.fromEntries(
  PLAYERS_CATALOG.map((p) => [p.id, p])
);
