import type { LeagueName, PositionGroup, RoleCode } from './types.ts';

export interface CompactPlayerSeed {
  id: string;
  name: string;
  shortName: string;
  pos: PositionGroup;
  role: RoleCode;
  ovr: number;
  age: number;
  nat: string;
  club: string;
  league: LeagueName;
  val: number;
  num: number;
  c1: string;
  c2: string;
  daily: boolean;
}

export const FIFA_EXTRA_SEEDS: CompactPlayerSeed[] = [
  // ================= LIGA PROFESIONAL ARGENTINA =================
  { id: 'franco-armani', name: 'Franco Armani', shortName: 'Armani', pos: 'POR', role: 'POR', ovr: 79, age: 40, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 8, num: 1, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'sergio-romero', name: 'Sergio Romero', shortName: 'S. Romero', pos: 'POR', role: 'POR', ovr: 77, age: 39, nat: 'Argentina', club: 'Boca Juniors', league: 'Liga Profesional Argentina', val: 6, num: 1, c1: '#1D4ED8', c2: '#EAB308', daily: false },
  { id: 'jeremias-ledesma', name: 'Jeremías Ledesma', shortName: 'Ledesma', pos: 'POR', role: 'POR', ovr: 79, age: 33, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 11, num: 25, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'gabriel-arias', name: 'Gabriel Arias', shortName: 'G. Arias', pos: 'POR', role: 'POR', ovr: 78, age: 39, nat: 'Chile', club: 'Racing Club', league: 'Liga Profesional Argentina', val: 7, num: 21, c1: '#38BDF8', c2: '#FFFFFF', daily: false },
  { id: 'rodrigo-rey', name: 'Rodrigo Rey', shortName: 'R. Rey', pos: 'POR', role: 'POR', ovr: 78, age: 35, nat: 'Argentina', club: 'Independiente', league: 'Liga Profesional Argentina', val: 8, num: 33, c1: '#DC2626', c2: '#FFFFFF', daily: false },

  { id: 'german-pezzella', name: 'Germán Pezzella', shortName: 'Pezzella', pos: 'DEF', role: 'DFC', ovr: 80, age: 35, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 12, num: 6, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'marcos-acuna', name: 'Marcos Acuña', shortName: 'Acuña', pos: 'DEF', role: 'LI', ovr: 81, age: 35, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 14, num: 21, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'paulo-diaz', name: 'Paulo Díaz', shortName: 'P. Díaz', pos: 'DEF', role: 'DFC', ovr: 79, age: 32, nat: 'Chile', club: 'River Plate', league: 'Liga Profesional Argentina', val: 13, num: 17, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'fabricio-bustos', name: 'Fabricio Bustos', shortName: 'Bustos', pos: 'DEF', role: 'LD', ovr: 78, age: 30, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 12, num: 16, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'gonzalo-montiel', name: 'Gonzalo Montiel', shortName: 'Montiel', pos: 'DEF', role: 'LD', ovr: 79, age: 29, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 14, num: 4, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'marcos-rojo', name: 'Marcos Rojo', shortName: 'M. Rojo', pos: 'DEF', role: 'DFC', ovr: 78, age: 36, nat: 'Argentina', club: 'Boca Juniors', league: 'Liga Profesional Argentina', val: 9, num: 6, c1: '#1D4ED8', c2: '#EAB308', daily: false },
  { id: 'luis-advincula', name: 'Luis Advíncula', shortName: 'Advíncula', pos: 'DEF', role: 'LD', ovr: 78, age: 36, nat: 'Perú', club: 'Boca Juniors', league: 'Liga Profesional Argentina', val: 10, num: 17, c1: '#1D4ED8', c2: '#EAB308', daily: false },
  { id: 'lautaro-blanco', name: 'Lautaro Blanco', shortName: 'L. Blanco', pos: 'DEF', role: 'LI', ovr: 77, age: 27, nat: 'Argentina', club: 'Boca Juniors', league: 'Liga Profesional Argentina', val: 11, num: 23, c1: '#1D4ED8', c2: '#EAB308', daily: false },
  { id: 'valentin-gomez', name: 'Valentín Gómez', shortName: 'V. Gómez', pos: 'DEF', role: 'DFC', ovr: 78, age: 23, nat: 'Argentina', club: 'Vélez Sarsfield', league: 'Liga Profesional Argentina', val: 16, num: 31, c1: '#F8FAFC', c2: '#1D4ED8', daily: false },
  { id: 'kevin-lomonaco', name: 'Kevin Lomónaco', shortName: 'Lomónaco', pos: 'DEF', role: 'DFC', ovr: 78, age: 24, nat: 'Argentina', club: 'Independiente', league: 'Liga Profesional Argentina', val: 15, num: 26, c1: '#DC2626', c2: '#FFFFFF', daily: false },

  { id: 'iker-muniain', name: 'Iker Muniain', shortName: 'Muniain', pos: 'MED', role: 'MCO', ovr: 79, age: 33, nat: 'España', club: 'San Lorenzo', league: 'Liga Profesional Argentina', val: 12, num: 80, c1: '#1E3A8A', c2: '#DC2626', daily: false },
  { id: 'kevin-zenon', name: 'Kevin Zenón', shortName: 'Zenón', pos: 'MED', role: 'MI', ovr: 79, age: 25, nat: 'Argentina', club: 'Boca Juniors', league: 'Liga Profesional Argentina', val: 18, num: 22, c1: '#1D4ED8', c2: '#EAB308', daily: false },
  { id: 'cristian-medina', name: 'Cristian Medina', shortName: 'C. Medina', pos: 'MED', role: 'MC', ovr: 79, age: 24, nat: 'Argentina', club: 'Estudiantes LP', league: 'Liga Profesional Argentina', val: 19, num: 36, c1: '#DC2626', c2: '#FFFFFF', daily: false },
  { id: 'santiago-ascacibar', name: 'Santiago Ascacíbar', shortName: 'Ascacíbar', pos: 'MED', role: 'MCD', ovr: 79, age: 29, nat: 'Argentina', club: 'Estudiantes LP', league: 'Liga Profesional Argentina', val: 15, num: 5, c1: '#DC2626', c2: '#FFFFFF', daily: false },
  { id: 'juanfer-quintero', name: 'Juan Fernando Quintero', shortName: 'Quintero', pos: 'MED', role: 'MCO', ovr: 79, age: 33, nat: 'Colombia', club: 'Racing Club', league: 'Liga Profesional Argentina', val: 13, num: 8, c1: '#38BDF8', c2: '#FFFFFF', daily: false },
  { id: 'manuel-lanzini', name: 'Manuel Lanzini', shortName: 'Lanzini', pos: 'MED', role: 'MCO', ovr: 78, age: 33, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 11, num: 10, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'maximilian-meza', name: 'Maximiliano Meza', shortName: 'Meza', pos: 'MED', role: 'MD', ovr: 78, age: 33, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 12, num: 8, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'santiago-sosa', name: 'Santiago Sosa', shortName: 'S. Sosa', pos: 'MED', role: 'MCD', ovr: 78, age: 27, nat: 'Argentina', club: 'Racing Club', league: 'Liga Profesional Argentina', val: 14, num: 13, c1: '#38BDF8', c2: '#FFFFFF', daily: false },
  { id: 'felipe-loyola', name: 'Felipe Loyola', shortName: 'Loyola', pos: 'MED', role: 'MC', ovr: 78, age: 26, nat: 'Chile', club: 'Independiente', league: 'Liga Profesional Argentina', val: 15, num: 5, c1: '#DC2626', c2: '#FFFFFF', daily: false },

  { id: 'edinson-cavani', name: 'Edinson Cavani', shortName: 'Cavani', pos: 'DEL', role: 'DC', ovr: 80, age: 39, nat: 'Uruguay', club: 'Boca Juniors', league: 'Liga Profesional Argentina', val: 10, num: 10, c1: '#1D4ED8', c2: '#EAB308', daily: false },
  { id: 'miguel-borja', name: 'Miguel Borja', shortName: 'Borja', pos: 'DEL', role: 'DC', ovr: 80, age: 33, nat: 'Colombia', club: 'River Plate', league: 'Liga Profesional Argentina', val: 14, num: 9, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'miguel-merentiel', name: 'Miguel Merentiel', shortName: 'Merentiel', pos: 'DEL', role: 'DC', ovr: 79, age: 30, nat: 'Uruguay', club: 'Boca Juniors', league: 'Liga Profesional Argentina', val: 15, num: 16, c1: '#1D4ED8', c2: '#EAB308', daily: false },
  { id: 'adrian-martinez', name: 'Adrián Maravilla Martínez', shortName: 'A. Martínez', pos: 'DEL', role: 'DC', ovr: 79, age: 34, nat: 'Argentina', club: 'Racing Club', league: 'Liga Profesional Argentina', val: 14, num: 9, c1: '#38BDF8', c2: '#FFFFFF', daily: false },
  { id: 'facundo-colidio', name: 'Facundo Colidio', shortName: 'Colidio', pos: 'DEL', role: 'EI', ovr: 78, age: 26, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 16, num: 11, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'sebastian-driussi', name: 'Sebastián Driussi', shortName: 'Driussi', pos: 'DEL', role: 'SD', ovr: 79, age: 30, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 16, num: 15, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'pablo-solari', name: 'Pablo Solari', shortName: 'Solari', pos: 'DEL', role: 'ED', ovr: 77, age: 25, nat: 'Argentina', club: 'River Plate', league: 'Liga Profesional Argentina', val: 14, num: 36, c1: '#F8FAFC', c2: '#DC2626', daily: false },
  { id: 'guido-carrillo', name: 'Guido Carrillo', shortName: 'Carrillo', pos: 'DEL', role: 'DC', ovr: 77, age: 35, nat: 'Argentina', club: 'Estudiantes LP', league: 'Liga Profesional Argentina', val: 9, num: 9, c1: '#DC2626', c2: '#FFFFFF', daily: false },

  // ================= BRASILEIRAO =================
  { id: 'weverton', name: 'Weverton Pereira', shortName: 'Weverton', pos: 'POR', role: 'POR', ovr: 80, age: 38, nat: 'Brasil', club: 'Palmeiras', league: 'Brasileirão', val: 10, num: 21, c1: '#15803D', c2: '#FFFFFF', daily: false },
  { id: 'agustin-rossi', name: 'Agustín Rossi', shortName: 'A. Rossi', pos: 'POR', role: 'POR', ovr: 79, age: 31, nat: 'Argentina', club: 'Flamengo', league: 'Brasileirão', val: 13, num: 1, c1: '#DC2626', c2: '#111827', daily: false },
  { id: 'gustavo-gomez', name: 'Gustavo Gómez', shortName: 'G. Gómez', pos: 'DEF', role: 'DFC', ovr: 81, age: 33, nat: 'Paraguay', club: 'Palmeiras', league: 'Brasileirão', val: 15, num: 15, c1: '#15803D', c2: '#FFFFFF', daily: false },
  { id: 'guilherme-arana', name: 'Guilherme Arana', shortName: 'Arana', pos: 'DEF', role: 'LI', ovr: 80, age: 29, nat: 'Brasil', club: 'Atlético Mineiro', league: 'Brasileirão', val: 18, num: 13, c1: '#111827', c2: '#FFFFFF', daily: false },
  { id: 'gerson', name: 'Gerson Santos', shortName: 'Gerson', pos: 'MED', role: 'MC', ovr: 81, age: 29, nat: 'Brasil', club: 'Flamengo', league: 'Brasileirão', val: 26, num: 8, c1: '#DC2626', c2: '#111827', daily: false },
  { id: 'arrascaeta', name: 'Giorgian de Arrascaeta', shortName: 'Arrascaeta', pos: 'MED', role: 'MCO', ovr: 82, age: 32, nat: 'Uruguay', club: 'Flamengo', league: 'Brasileirão', val: 24, num: 14, c1: '#DC2626', c2: '#111827', daily: false },
  { id: 'raphael-veiga', name: 'Raphael Veiga', shortName: 'R. Veiga', pos: 'MED', role: 'MCO', ovr: 81, age: 31, nat: 'Brasil', club: 'Palmeiras', league: 'Brasileirão', val: 25, num: 23, c1: '#15803D', c2: '#FFFFFF', daily: false },
  { id: 'pedro-flamengo', name: 'Pedro Guilherme', shortName: 'Pedro', pos: 'DEL', role: 'DC', ovr: 82, age: 29, nat: 'Brasil', club: 'Flamengo', league: 'Brasileirão', val: 30, num: 9, c1: '#DC2626', c2: '#111827', daily: false },
  { id: 'hulk', name: 'Givanildo Hulk', shortName: 'Hulk', pos: 'DEL', role: 'DC', ovr: 81, age: 40, nat: 'Brasil', club: 'Atlético Mineiro', league: 'Brasileirão', val: 12, num: 7, c1: '#111827', c2: '#FFFFFF', daily: false },
  { id: 'memphis-depay', name: 'Memphis Depay', shortName: 'Memphis', pos: 'DEL', role: 'DC', ovr: 82, age: 32, nat: 'Países Bajos', club: 'Corinthians', league: 'Brasileirão', val: 20, num: 94, c1: '#F8FAFC', c2: '#111827', daily: false },
  { id: 'lucas-moura', name: 'Lucas Moura', shortName: 'Lucas Moura', pos: 'DEL', role: 'ED', ovr: 81, age: 34, nat: 'Brasil', club: 'São Paulo', league: 'Brasileirão', val: 16, num: 7, c1: '#DC2626', c2: '#111827', daily: false },

  // ================= MLS =================
  { id: 'hugo-lloris', name: 'Hugo Lloris', shortName: 'Lloris', pos: 'POR', role: 'POR', ovr: 81, age: 39, nat: 'Francia', club: 'LAFC', league: 'MLS', val: 10, num: 1, c1: '#111827', c2: '#EAB308', daily: false },
  { id: 'roman-burki', name: 'Roman Bürki', shortName: 'Bürki', pos: 'POR', role: 'POR', ovr: 80, age: 36, nat: 'Suiza', club: 'St. Louis City', league: 'MLS', val: 11, num: 1, c1: '#DC2626', c2: '#1E293B', daily: false },
  { id: 'jordi-alba', name: 'Jordi Alba', shortName: 'Jordi Alba', pos: 'DEF', role: 'LI', ovr: 82, age: 37, nat: 'España', club: 'Inter Miami', league: 'MLS', val: 12, num: 18, c1: '#EC4899', c2: '#111827', daily: false },
  { id: 'sergio-busquets', name: 'Sergio Busquets', shortName: 'Busquets', pos: 'MED', role: 'MCD', ovr: 82, age: 38, nat: 'España', club: 'Inter Miami', league: 'MLS', val: 12, num: 5, c1: '#EC4899', c2: '#111827', daily: false },
  { id: 'riqui-puig', name: 'Riqui Puig', shortName: 'Riqui Puig', pos: 'MED', role: 'MC', ovr: 81, age: 27, nat: 'España', club: 'LA Galaxy', league: 'MLS', val: 26, num: 10, c1: '#F8FAFC', c2: '#1D4ED8', daily: false },
  { id: 'marco-reus', name: 'Marco Reus', shortName: 'Reus', pos: 'MED', role: 'MCO', ovr: 81, age: 37, nat: 'Alemania', club: 'LA Galaxy', league: 'MLS', val: 14, num: 18, c1: '#F8FAFC', c2: '#1D4ED8', daily: false },
  { id: 'luciano-acosta', name: 'Luciano Acosta', shortName: 'L. Acosta', pos: 'MED', role: 'MCO', ovr: 81, age: 32, nat: 'Argentina', club: 'FC Cincinnati', league: 'MLS', val: 18, num: 10, c1: '#1D4ED8', c2: '#F97316', daily: false },
  { id: 'luis-suarez', name: 'Luis Suárez', shortName: 'L. Suárez', pos: 'DEL', role: 'DC', ovr: 83, age: 39, nat: 'Uruguay', club: 'Inter Miami', league: 'MLS', val: 14, num: 9, c1: '#EC4899', c2: '#111827', daily: false },
  { id: 'denis-bouanga', name: 'Denis Bouanga', shortName: 'Bouanga', pos: 'DEL', role: 'EI', ovr: 81, age: 32, nat: 'Gabón', club: 'LAFC', league: 'MLS', val: 20, num: 99, c1: '#111827', c2: '#EAB308', daily: false },
  { id: 'cucho-hernandez', name: 'Cucho Hernández', shortName: 'Cucho', pos: 'DEL', role: 'DC', ovr: 81, age: 27, nat: 'Colombia', club: 'Columbus Crew', league: 'MLS', val: 24, num: 9, c1: '#EAB308', c2: '#111827', daily: false },

  // ================= SAUDI PRO LEAGUE =================
  { id: 'yassine-bounou', name: 'Yassine Bounou', shortName: 'Bono', pos: 'POR', role: 'POR', ovr: 85, age: 35, nat: 'Marruecos', club: 'Al-Hilal', league: 'Saudi Pro League', val: 24, num: 37, c1: '#1D4ED8', c2: '#FFFFFF', daily: false },
  { id: 'edouard-mendy', name: 'Édouard Mendy', shortName: 'É. Mendy', pos: 'POR', role: 'POR', ovr: 83, age: 34, nat: 'Senegal', club: 'Al-Ahli', league: 'Saudi Pro League', val: 18, num: 16, c1: '#15803D', c2: '#FFFFFF', daily: false },
  { id: 'joao-cancelo', name: 'João Cancelo', shortName: 'Cancelo', pos: 'DEF', role: 'LD', ovr: 86, age: 32, nat: 'Portugal', club: 'Al-Hilal', league: 'Saudi Pro League', val: 38, num: 20, c1: '#1D4ED8', c2: '#FFFFFF', daily: false },
  { id: 'aymeric-laporte', name: 'Aymeric Laporte', shortName: 'Laporte', pos: 'DEF', role: 'DFC', ovr: 84, age: 32, nat: 'España', club: 'Al-Nassr', league: 'Saudi Pro League', val: 28, num: 27, c1: '#EAB308', c2: '#1D4ED8', daily: false },
  { id: 'kalidou-koulibaly', name: 'Kalidou Koulibaly', shortName: 'Koulibaly', pos: 'DEF', role: 'DFC', ovr: 83, age: 35, nat: 'Senegal', club: 'Al-Hilal', league: 'Saudi Pro League', val: 18, num: 3, c1: '#1D4ED8', c2: '#FFFFFF', daily: false },
  { id: 'nacho-fernandez', name: 'Nacho Fernández', shortName: 'Nacho', pos: 'DEF', role: 'DFC', ovr: 82, age: 36, nat: 'España', club: 'Al-Qadsiah', league: 'Saudi Pro League', val: 14, num: 6, c1: '#DC2626', c2: '#EAB308', daily: false },
  { id: 'ngolo-kante', name: "N'Golo Kanté", shortName: 'Kanté', pos: 'MED', role: 'MCD', ovr: 85, age: 35, nat: 'Francia', club: 'Al-Ittihad', league: 'Saudi Pro League', val: 24, num: 7, c1: '#EAB308', c2: '#111827', daily: false },
  { id: 'ruben-neves', name: 'Rúben Neves', shortName: 'R. Neves', pos: 'MED', role: 'MCD', ovr: 85, age: 29, nat: 'Portugal', club: 'Al-Hilal', league: 'Saudi Pro League', val: 44, num: 8, c1: '#1D4ED8', c2: '#FFFFFF', daily: false },
  { id: 'milinkovic-savic', name: 'Sergej Milinković-Savić', shortName: 'Milinković-Savić', pos: 'MED', role: 'MC', ovr: 85, age: 31, nat: 'Serbia', club: 'Al-Hilal', league: 'Saudi Pro League', val: 40, num: 22, c1: '#1D4ED8', c2: '#FFFFFF', daily: false },
  { id: 'fabinho', name: 'Fabinho Tavares', shortName: 'Fabinho', pos: 'MED', role: 'MCD', ovr: 83, age: 33, nat: 'Brasil', club: 'Al-Ittihad', league: 'Saudi Pro League', val: 24, num: 8, c1: '#EAB308', c2: '#111827', daily: false },
  { id: 'karim-benzema', name: 'Karim Benzema', shortName: 'Benzema', pos: 'DEL', role: 'DC', ovr: 86, age: 38, nat: 'Francia', club: 'Al-Ittihad', league: 'Saudi Pro League', val: 26, num: 9, c1: '#EAB308', c2: '#111827', daily: false },
  { id: 'riyad-mahrez', name: 'Riyad Mahrez', shortName: 'Mahrez', pos: 'DEL', role: 'ED', ovr: 85, age: 35, nat: 'Argelia', club: 'Al-Ahli', league: 'Saudi Pro League', val: 24, num: 7, c1: '#15803D', c2: '#FFFFFF', daily: false },
  { id: 'sadio-mane', name: 'Sadio Mané', shortName: 'Mané', pos: 'DEL', role: 'EI', ovr: 84, age: 34, nat: 'Senegal', club: 'Al-Nassr', league: 'Saudi Pro League', val: 24, num: 10, c1: '#EAB308', c2: '#1D4ED8', daily: false },
  { id: 'aleksandar-mitrovic', name: 'Aleksandar Mitrović', shortName: 'Mitrović', pos: 'DEL', role: 'DC', ovr: 84, age: 32, nat: 'Serbia', club: 'Al-Hilal', league: 'Saudi Pro League', val: 34, num: 9, c1: '#1D4ED8', c2: '#FFFFFF', daily: false },
  { id: 'moussa-diaby', name: 'Moussa Diaby', shortName: 'Diaby', pos: 'DEL', role: 'ED', ovr: 84, age: 27, nat: 'Francia', club: 'Al-Ittihad', league: 'Saudi Pro League', val: 46, num: 19, c1: '#EAB308', c2: '#111827', daily: false },
  { id: 'ivan-toney', name: 'Ivan Toney', shortName: 'Toney', pos: 'DEL', role: 'DC', ovr: 82, age: 30, nat: 'Inglaterra', club: 'Al-Ahli', league: 'Saudi Pro League', val: 32, num: 99, c1: '#15803D', c2: '#FFFFFF', daily: false },

  // ================= SUPER LIG (TURQUIA) =================
  { id: 'fernando-muslera', name: 'Fernando Muslera', shortName: 'Muslera', pos: 'POR', role: 'POR', ovr: 81, age: 40, nat: 'Uruguay', club: 'Galatasaray', league: 'Süper Lig', val: 10, num: 1, c1: '#DC2626', c2: '#EAB308', daily: false },
  { id: 'lucas-torreira', name: 'Lucas Torreira', shortName: 'Torreira', pos: 'MED', role: 'MCD', ovr: 83, age: 30, nat: 'Uruguay', club: 'Galatasaray', league: 'Süper Lig', val: 26, num: 34, c1: '#DC2626', c2: '#EAB308', daily: false },
  { id: 'fred-santos', name: 'Fred Rodrigues', shortName: 'Fred', pos: 'MED', role: 'MC', ovr: 82, age: 33, nat: 'Brasil', club: 'Fenerbahçe', league: 'Süper Lig', val: 22, num: 35, c1: '#EAB308', c2: '#1E3A8A', daily: false },
  { id: 'dusan-tadic', name: 'Dušan Tadić', shortName: 'Tadić', pos: 'MED', role: 'MCO', ovr: 82, age: 37, nat: 'Serbia', club: 'Fenerbahçe', league: 'Süper Lig', val: 14, num: 10, c1: '#EAB308', c2: '#1E3A8A', daily: false },
  { id: 'victor-osimhen', name: 'Victor Osimhen', shortName: 'Osimhen', pos: 'DEL', role: 'DC', ovr: 88, age: 27, nat: 'Nigeria', club: 'Galatasaray', league: 'Süper Lig', val: 85, num: 45, c1: '#DC2626', c2: '#EAB308', daily: false },
  { id: 'mauro-icardi', name: 'Mauro Icardi', shortName: 'Icardi', pos: 'DEL', role: 'DC', ovr: 84, age: 33, nat: 'Argentina', club: 'Galatasaray', league: 'Süper Lig', val: 24, num: 9, c1: '#DC2626', c2: '#EAB308', daily: false },
  { id: 'edin-dzeko', name: 'Edin Džeko', shortName: 'Džeko', pos: 'DEL', role: 'DC', ovr: 82, age: 40, nat: 'Bosnia', club: 'Fenerbahçe', league: 'Süper Lig', val: 12, num: 9, c1: '#EAB308', c2: '#1E3A8A', daily: false },
  { id: 'ciro-immobile', name: 'Ciro Immobile', shortName: 'Immobile', pos: 'DEL', role: 'DC', ovr: 82, age: 36, nat: 'Italia', club: 'Beşiktaş', league: 'Süper Lig', val: 14, num: 17, c1: '#111827', c2: '#FFFFFF', daily: false },

  // ================= LIGA PORTUGAL, EREDIVISIE & LIGA MX =================
  { id: 'nicolas-otamendi', name: 'Nicolás Otamendi', shortName: 'Otamendi', pos: 'DEF', role: 'DFC', ovr: 82, age: 38, nat: 'Argentina', club: 'Benfica', league: 'Liga Portugal', val: 12, num: 30, c1: '#DC2626', c2: '#FFFFFF', daily: false },
  { id: 'angel-di-maria', name: 'Ángel Di María', shortName: 'Di María', pos: 'DEL', role: 'ED', ovr: 84, age: 38, nat: 'Argentina', club: 'Benfica', league: 'Liga Portugal', val: 14, num: 11, c1: '#DC2626', c2: '#FFFFFF', daily: false },
  { id: 'samu-omorodion', name: 'Samu Aghehowa', shortName: 'Samu', pos: 'DEL', role: 'DC', ovr: 82, age: 22, nat: 'España', club: 'FC Porto', league: 'Liga Portugal', val: 46, num: 9, c1: '#1D4ED8', c2: '#FFFFFF', daily: false },
  { id: 'pedro-goncalves', name: 'Pedro Gonçalves', shortName: 'Pote', pos: 'MED', role: 'MCO', ovr: 83, age: 28, nat: 'Portugal', club: 'Sporting CP', league: 'Liga Portugal', val: 40, num: 8, c1: '#15803D', c2: '#FFFFFF', daily: false },
  { id: 'luuk-de-jong', name: 'Luuk de Jong', shortName: 'L. de Jong', pos: 'DEL', role: 'DC', ovr: 81, age: 36, nat: 'Países Bajos', club: 'PSV Eindhoven', league: 'Eredivisie', val: 12, num: 9, c1: '#DC2626', c2: '#FFFFFF', daily: false },
  { id: 'malik-tillman', name: 'Malik Tillman', shortName: 'Tillman', pos: 'MED', role: 'MCO', ovr: 81, age: 24, nat: 'EE. UU.', club: 'PSV Eindhoven', league: 'Eredivisie', val: 32, num: 7, c1: '#DC2626', c2: '#FFFFFF', daily: false },
  { id: 'sergio-canales', name: 'Sergio Canales', shortName: 'Canales', pos: 'MED', role: 'MCO', ovr: 81, age: 35, nat: 'España', club: 'Monterrey', league: 'Liga MX', val: 16, num: 10, c1: '#1E3A8A', c2: '#FFFFFF', daily: false },
  { id: 'alvaro-fidalgo', name: 'Álvaro Fidalgo', shortName: 'Fidalgo', pos: 'MED', role: 'MC', ovr: 80, age: 29, nat: 'España', club: 'Club América', league: 'Liga MX', val: 18, num: 8, c1: '#EAB308', c2: '#1E3A8A', daily: false },
  { id: 'henry-martin', name: 'Henry Martín', shortName: 'H. Martín', pos: 'DEL', role: 'DC', ovr: 79, age: 33, nat: 'México', club: 'Club América', league: 'Liga MX', val: 12, num: 21, c1: '#EAB308', c2: '#1E3A8A', daily: false },
  { id: 'andre-pierre-gignac', name: 'André-Pierre Gignac', shortName: 'Gignac', pos: 'DEL', role: 'DC', ovr: 79, age: 40, nat: 'Francia', club: 'Tigres UANL', league: 'Liga MX', val: 10, num: 10, c1: '#EAB308', c2: '#1D4ED8', daily: false },

  // ================= EXTRA TOP-5 LEAGUE STARS (FIFA) =================
  { id: 'ter-stegen', name: 'Marc-André ter Stegen', shortName: 'Ter Stegen', pos: 'POR', role: 'POR', ovr: 88, age: 34, nat: 'Alemania', club: 'FC Barcelona', league: 'LaLiga', val: 38, num: 1, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'ederson-moraes', name: 'Ederson Moraes', shortName: 'Ederson', pos: 'POR', role: 'POR', ovr: 88, age: 33, nat: 'Brasil', club: 'Manchester City', league: 'Premier League', val: 40, num: 31, c1: '#38BDF8', c2: '#FFFFFF', daily: true },
  { id: 'andre-onana', name: 'André Onana', shortName: 'Onana', pos: 'POR', role: 'POR', ovr: 85, age: 30, nat: 'Camerún', club: 'Manchester United', league: 'Premier League', val: 38, num: 24, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'ronald-araujo', name: 'Ronald Araújo', shortName: 'Araújo', pos: 'DEF', role: 'DFC', ovr: 86, age: 27, nat: 'Uruguay', club: 'FC Barcelona', league: 'LaLiga', val: 65, num: 4, c1: '#1D4ED8', c2: '#991B1B', daily: true },
  { id: 'eder-militao', name: 'Éder Militão', shortName: 'Militão', pos: 'DEF', role: 'DFC', ovr: 86, age: 28, nat: 'Brasil', club: 'Real Madrid', league: 'LaLiga', val: 60, num: 3, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'jose-maria-gimenez', name: 'José María Giménez', shortName: 'Giménez', pos: 'DEF', role: 'DFC', ovr: 84, age: 31, nat: 'Uruguay', club: 'Atlético de Madrid', league: 'LaLiga', val: 34, num: 2, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'dean-huijsen', name: 'Dean Huijsen', shortName: 'Huijsen', pos: 'DEF', role: 'DFC', ovr: 81, age: 21, nat: 'España', club: 'Bournemouth', league: 'Premier League', val: 40, num: 2, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'kevin-de-bruyne', name: 'Kevin De Bruyne', shortName: 'De Bruyne', pos: 'MED', role: 'MCO', ovr: 89, age: 35, nat: 'Bélgica', club: 'Manchester City', league: 'Premier League', val: 52, num: 17, c1: '#38BDF8', c2: '#FFFFFF', daily: true },
  { id: 'rodrigo-de-paul', name: 'Rodrigo De Paul', shortName: 'De Paul', pos: 'MED', role: 'MC', ovr: 85, age: 32, nat: 'Argentina', club: 'Atlético de Madrid', league: 'LaLiga', val: 38, num: 5, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'arda-guler', name: 'Arda Güler', shortName: 'A. Güler', pos: 'MED', role: 'MCO', ovr: 82, age: 21, nat: 'Turquía', club: 'Real Madrid', league: 'LaLiga', val: 52, num: 15, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'endrick', name: 'Endrick Felipe', shortName: 'Endrick', pos: 'DEL', role: 'DC', ovr: 81, age: 20, nat: 'Brasil', club: 'Real Madrid', league: 'LaLiga', val: 54, num: 16, c1: '#E2E8F0', c2: '#1E293B', daily: true },
  { id: 'iago-aspas', name: 'Iago Aspas', shortName: 'Aspas', pos: 'DEL', role: 'DC', ovr: 83, age: 39, nat: 'España', club: 'RC Celta', league: 'LaLiga', val: 14, num: 10, c1: '#38BDF8', c2: '#FFFFFF', daily: true },
  { id: 'ayoze-perez', name: 'Ayoze Pérez', shortName: 'Ayoze', pos: 'DEL', role: 'DC', ovr: 82, age: 33, nat: 'España', club: 'Villarreal CF', league: 'LaLiga', val: 22, num: 22, c1: '#EAB308', c2: '#1E3A8A', daily: true },
  { id: 'alexander-sorloth', name: 'Alexander Sørloth', shortName: 'Sørloth', pos: 'DEL', role: 'DC', ovr: 83, age: 30, nat: 'Noruega', club: 'Atlético de Madrid', league: 'LaLiga', val: 36, num: 9, c1: '#DC2626', c2: '#FFFFFF', daily: true },
  { id: 'alejandro-garnacho', name: 'Alejandro Garnacho', shortName: 'Garnacho', pos: 'DEL', role: 'EI', ovr: 82, age: 22, nat: 'Argentina', club: 'Manchester United', league: 'Premier League', val: 52, num: 17, c1: '#DC2626', c2: '#111827', daily: true },
  { id: 'jeremy-doku', name: 'Jérémy Doku', shortName: 'Doku', pos: 'DEL', role: 'EI', ovr: 83, age: 24, nat: 'Bélgica', club: 'Manchester City', league: 'Premier League', val: 58, num: 11, c1: '#38BDF8', c2: '#FFFFFF', daily: true },
  { id: 'savinho', name: 'Savinho Moreira', shortName: 'Savinho', pos: 'DEL', role: 'ED', ovr: 82, age: 22, nat: 'Brasil', club: 'Manchester City', league: 'Premier League', val: 54, num: 26, c1: '#38BDF8', c2: '#FFFFFF', daily: true },
  { id: 'omar-marmoush', name: 'Omar Marmoush', shortName: 'Marmoush', pos: 'DEL', role: 'DC', ovr: 85, age: 27, nat: 'Egipto', club: 'Manchester City', league: 'Premier League', val: 68, num: 7, c1: '#38BDF8', c2: '#FFFFFF', daily: true },
];
