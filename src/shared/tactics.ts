import type { MatchTactics, MentalityId, PlayStyleId } from './types.ts';

export interface PlayStyleConfig {
  id: PlayStyleId;
  label: string;
  shortDesc: string;
  effectSummary: string;
  attackMod: number;
  defenseMod: number;
  possessionMod: number;
  shotsMod: number;
}

export const PLAY_STYLES: PlayStyleConfig[] = [
  {
    id: 'balanced',
    label: 'Equilibrado',
    shortDesc: 'Plan versátil que adapta las líneas al ritmo del rival.',
    effectSummary: 'Sin riesgos extra · Balance ataque/defensa',
    attackMod: 0,
    defenseMod: 0,
    possessionMod: 0,
    shotsMod: 0,
  },
  {
    id: 'possession',
    label: 'Posesión / Tiki-Taka',
    shortDesc: 'Circulación corta y dominio del centro del campo.',
    effectSummary: '+8% posesión · +0.8 control · ritmo pausado',
    attackMod: 0.08,
    defenseMod: 0.06,
    possessionMod: 8,
    shotsMod: 1,
  },
  {
    id: 'high_press',
    label: 'Presión Alta (Gegenpress)',
    shortDesc: 'Robo arriba tras pérdida para asfixiar la salida rival.',
    effectSummary: '+20% ataque · +12% riesgo a la espalda',
    attackMod: 0.24,
    defenseMod: -0.14,
    possessionMod: 3,
    shotsMod: 3,
  },
  {
    id: 'counter',
    label: 'Contraataque Rápido',
    shortDesc: 'Bloque compacto y transiciones verticales con espacios.',
    effectSummary: '+18% pegada arriba · -6% posesión',
    attackMod: 0.16,
    defenseMod: 0.05,
    possessionMod: -6,
    shotsMod: 1,
  },
  {
    id: 'low_block',
    label: 'Bloque Bajo / Cerrojo',
    shortDesc: 'Defensa muy junta cerca del área para blindar el resultado.',
    effectSummary: '+24% solidez defensiva · -12% llegada',
    attackMod: -0.16,
    defenseMod: 0.26,
    possessionMod: -8,
    shotsMod: -2,
  },
];

export const MENTALITIES: Array<{
  id: MentalityId;
  label: string;
  attackMod: number;
  defenseMod: number;
  summary: string;
}> = [
  {
    id: 'defensive',
    label: 'Conservadora',
    attackMod: -0.12,
    defenseMod: 0.16,
    summary: 'Prioriza mantener la portería a cero.',
  },
  {
    id: 'balanced',
    label: 'Neutral',
    attackMod: 0,
    defenseMod: 0,
    summary: 'Reparto clásico entre ataque y repliegue.',
  },
  {
    id: 'attacking',
    label: 'Ofensiva',
    attackMod: 0.18,
    defenseMod: -0.12,
    summary: 'Laterales largos e interior llegando al área.',
  },
];

export const DEFAULT_TACTICS: MatchTactics = {
  playStyle: 'balanced',
  mentality: 'balanced',
  captainId: null,
  penaltyTakerId: null,
};

export function getPlayStyleConfig(id?: PlayStyleId): PlayStyleConfig {
  return PLAY_STYLES.find((s) => s.id === id) || PLAY_STYLES[0];
}

export function getMentalityConfig(id?: MentalityId) {
  return MENTALITIES.find((m) => m.id === id) || MENTALITIES[1];
}
