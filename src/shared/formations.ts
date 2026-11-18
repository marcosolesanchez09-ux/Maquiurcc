import type { Formation, FormationSlot, PositionGroup, RoleCode } from './types.ts';

export const PRESET_FORMATIONS: Formation[] = [
  {
    id: '4-3-3',
    name: '4-3-3',
    defCount: 4,
    medCount: 3,
    delCount: 3,
    description: 'Esquema equilibrado con extremos abiertos y centro del campo de tres hombres.',
    realClubs: 'Real Madrid, FC Barcelona, Liverpool',
    slots: [
      { slotIndex: 0, role: 'POR', position: 'POR', label: 'Portero', x: 50, y: 89 },
      { slotIndex: 1, role: 'LI', position: 'DEF', label: 'Lateral Izq.', x: 14, y: 70 },
      { slotIndex: 2, role: 'DFC', position: 'DEF', label: 'Central Izq.', x: 37, y: 73 },
      { slotIndex: 3, role: 'DFC', position: 'DEF', label: 'Central Der.', x: 63, y: 73 },
      { slotIndex: 4, role: 'LD', position: 'DEF', label: 'Lateral Der.', x: 86, y: 70 },
      { slotIndex: 5, role: 'MC', position: 'MED', label: 'Interior Izq.', x: 26, y: 47 },
      { slotIndex: 6, role: 'MCD', position: 'MED', label: 'Pivote', x: 50, y: 53 },
      { slotIndex: 7, role: 'MC', position: 'MED', label: 'Interior Der.', x: 74, y: 47 },
      { slotIndex: 8, role: 'EI', position: 'DEL', label: 'Extremo Izq.', x: 18, y: 20 },
      { slotIndex: 9, role: 'DC', position: 'DEL', label: 'Delantero Centro', x: 50, y: 15 },
      { slotIndex: 10, role: 'ED', position: 'DEL', label: 'Extremo Der.', x: 82, y: 20 },
    ],
  },
  {
    id: '4-2-3-1',
    name: '4-2-3-1',
    defCount: 4,
    medCount: 5,
    delCount: 1,
    description: 'Doble pivote defensivo que libera a un mediapunta detrás del nueve.',
    realClubs: 'Bayer Leverkusen, Arsenal, Bayern Múnich',
    slots: [
      { slotIndex: 0, role: 'POR', position: 'POR', label: 'Portero', x: 50, y: 89 },
      { slotIndex: 1, role: 'LI', position: 'DEF', label: 'Lateral Izq.', x: 14, y: 71 },
      { slotIndex: 2, role: 'DFC', position: 'DEF', label: 'Central Izq.', x: 37, y: 74 },
      { slotIndex: 3, role: 'DFC', position: 'DEF', label: 'Central Der.', x: 63, y: 74 },
      { slotIndex: 4, role: 'LD', position: 'DEF', label: 'Lateral Der.', x: 86, y: 71 },
      { slotIndex: 5, role: 'MCD', position: 'MED', label: 'Pivote Izq.', x: 35, y: 54 },
      { slotIndex: 6, role: 'MCD', position: 'MED', label: 'Pivote Der.', x: 65, y: 54 },
      { slotIndex: 7, role: 'MI', position: 'MED', label: 'Mediapunta Izq.', x: 19, y: 34 },
      { slotIndex: 8, role: 'MCO', position: 'MED', label: 'Mediapunta', x: 50, y: 34 },
      { slotIndex: 9, role: 'MD', position: 'MED', label: 'Mediapunta Der.', x: 81, y: 34 },
      { slotIndex: 10, role: 'DC', position: 'DEL', label: 'Delantero Centro', x: 50, y: 15 },
    ],
  },
  {
    id: '4-4-2',
    name: '4-4-2',
    defCount: 4,
    medCount: 4,
    delCount: 2,
    description: 'Dos líneas compactas de cuatro con doble referencia ofensiva arriba.',
    realClubs: 'Atlético de Madrid, Villarreal, Aston Villa',
    slots: [
      { slotIndex: 0, role: 'POR', position: 'POR', label: 'Portero', x: 50, y: 89 },
      { slotIndex: 1, role: 'LI', position: 'DEF', label: 'Lateral Izq.', x: 14, y: 71 },
      { slotIndex: 2, role: 'DFC', position: 'DEF', label: 'Central Izq.', x: 37, y: 74 },
      { slotIndex: 3, role: 'DFC', position: 'DEF', label: 'Central Der.', x: 63, y: 74 },
      { slotIndex: 4, role: 'LD', position: 'DEF', label: 'Lateral Der.', x: 86, y: 71 },
      { slotIndex: 5, role: 'MI', position: 'MED', label: 'Interior Izq.', x: 15, y: 46 },
      { slotIndex: 6, role: 'MC', position: 'MED', label: 'Mediocentro Izq.', x: 38, y: 49 },
      { slotIndex: 7, role: 'MC', position: 'MED', label: 'Mediocentro Der.', x: 62, y: 49 },
      { slotIndex: 8, role: 'MD', position: 'MED', label: 'Interior Der.', x: 85, y: 46 },
      { slotIndex: 9, role: 'DC', position: 'DEL', label: 'Delantero Izq.', x: 35, y: 18 },
      { slotIndex: 10, role: 'DC', position: 'DEL', label: 'Delantero Der.', x: 65, y: 18 },
    ],
  },
  {
    id: '3-5-2',
    name: '3-5-2',
    defCount: 3,
    medCount: 5,
    delCount: 2,
    description: 'Tres centrales fijos, carrileros largos y superioridad numérica en la medular.',
    realClubs: 'Inter de Milán, Atalanta, Girona',
    slots: [
      { slotIndex: 0, role: 'POR', position: 'POR', label: 'Portero', x: 50, y: 89 },
      { slotIndex: 1, role: 'DFC', position: 'DEF', label: 'Central Izq.', x: 25, y: 72 },
      { slotIndex: 2, role: 'DFC', position: 'DEF', label: 'Central Libre', x: 50, y: 74 },
      { slotIndex: 3, role: 'DFC', position: 'DEF', label: 'Central Der.', x: 75, y: 72 },
      { slotIndex: 4, role: 'CAI', position: 'MED', label: 'Carrilero Izq.', x: 13, y: 46 },
      { slotIndex: 5, role: 'MC', position: 'MED', label: 'Interior Izq.', x: 34, y: 48 },
      { slotIndex: 6, role: 'MCD', position: 'MED', label: 'Pivote', x: 50, y: 54 },
      { slotIndex: 7, role: 'MC', position: 'MED', label: 'Interior Der.', x: 66, y: 48 },
      { slotIndex: 8, role: 'CAD', position: 'MED', label: 'Carrilero Der.', x: 87, y: 46 },
      { slotIndex: 9, role: 'DC', position: 'DEL', label: 'Delantero Izq.', x: 36, y: 18 },
      { slotIndex: 10, role: 'DC', position: 'DEL', label: 'Delantero Der.', x: 64, y: 18 },
    ],
  },
  {
    id: '3-4-3',
    name: '3-4-3',
    defCount: 3,
    medCount: 4,
    delCount: 3,
    description: 'Presión alta con tres atacantes natos y amplitud total por bandas.',
    realClubs: 'Sporting CP, Chelsea, Bayer Leverkusen',
    slots: [
      { slotIndex: 0, role: 'POR', position: 'POR', label: 'Portero', x: 50, y: 89 },
      { slotIndex: 1, role: 'DFC', position: 'DEF', label: 'Central Izq.', x: 25, y: 72 },
      { slotIndex: 2, role: 'DFC', position: 'DEF', label: 'Central Libre', x: 50, y: 74 },
      { slotIndex: 3, role: 'DFC', position: 'DEF', label: 'Central Der.', x: 75, y: 72 },
      { slotIndex: 4, role: 'CAI', position: 'MED', label: 'Carrilero Izq.', x: 15, y: 46 },
      { slotIndex: 5, role: 'MC', position: 'MED', label: 'Mediocentro Izq.', x: 38, y: 49 },
      { slotIndex: 6, role: 'MC', position: 'MED', label: 'Mediocentro Der.', x: 62, y: 49 },
      { slotIndex: 7, role: 'CAD', position: 'MED', label: 'Carrilero Der.', x: 85, y: 46 },
      { slotIndex: 8, role: 'EI', position: 'DEL', label: 'Extremo Izq.', x: 19, y: 20 },
      { slotIndex: 9, role: 'DC', position: 'DEL', label: 'Delantero Centro', x: 50, y: 15 },
      { slotIndex: 10, role: 'ED', position: 'DEL', label: 'Extremo Der.', x: 81, y: 20 },
    ],
  },
  {
    id: '4-1-4-1',
    name: '4-1-4-1',
    defCount: 4,
    medCount: 5,
    delCount: 1,
    description: 'Un ancla posicional protege la zaga mientras cuatro centrocampistas llegan de segunda línea.',
    realClubs: 'Manchester City, Arsenal, Selección Española',
    slots: [
      { slotIndex: 0, role: 'POR', position: 'POR', label: 'Portero', x: 50, y: 89 },
      { slotIndex: 1, role: 'LI', position: 'DEF', label: 'Lateral Izq.', x: 14, y: 71 },
      { slotIndex: 2, role: 'DFC', position: 'DEF', label: 'Central Izq.', x: 37, y: 74 },
      { slotIndex: 3, role: 'DFC', position: 'DEF', label: 'Central Der.', x: 63, y: 74 },
      { slotIndex: 4, role: 'LD', position: 'DEF', label: 'Lateral Der.', x: 86, y: 71 },
      { slotIndex: 5, role: 'MCD', position: 'MED', label: 'Pivote Ancla', x: 50, y: 56 },
      { slotIndex: 6, role: 'MI', position: 'MED', label: 'Interior Izq.', x: 16, y: 37 },
      { slotIndex: 7, role: 'MC', position: 'MED', label: 'Volante Izq.', x: 38, y: 39 },
      { slotIndex: 8, role: 'MC', position: 'MED', label: 'Volante Der.', x: 62, y: 39 },
      { slotIndex: 9, role: 'MD', position: 'MED', label: 'Interior Der.', x: 84, y: 37 },
      { slotIndex: 10, role: 'DC', position: 'DEL', label: 'Delantero Centro', x: 50, y: 15 },
    ],
  },
  {
    id: '5-3-2',
    name: '5-3-2',
    defCount: 5,
    medCount: 3,
    delCount: 2,
    description: 'Bloque defensivo de cinco zagueros diseñado para transiciones rápidas con dos puntas.',
    realClubs: 'Juventus, Real Betis (bloques bajos), Osasuna',
    slots: [
      { slotIndex: 0, role: 'POR', position: 'POR', label: 'Portero', x: 50, y: 89 },
      { slotIndex: 1, role: 'LI', position: 'DEF', label: 'Carrilero Izq.', x: 12, y: 65 },
      { slotIndex: 2, role: 'DFC', position: 'DEF', label: 'Central Izq.', x: 31, y: 73 },
      { slotIndex: 3, role: 'DFC', position: 'DEF', label: 'Central Libre', x: 50, y: 75 },
      { slotIndex: 4, role: 'DFC', position: 'DEF', label: 'Central Der.', x: 69, y: 73 },
      { slotIndex: 5, role: 'LD', position: 'DEF', label: 'Carrilero Der.', x: 88, y: 65 },
      { slotIndex: 6, role: 'MC', position: 'MED', label: 'Interior Izq.', x: 28, y: 46 },
      { slotIndex: 7, role: 'MCD', position: 'MED', label: 'Pivote', x: 50, y: 50 },
      { slotIndex: 8, role: 'MC', position: 'MED', label: 'Interior Der.', x: 72, y: 46 },
      { slotIndex: 9, role: 'DC', position: 'DEL', label: 'Delantero Izq.', x: 36, y: 18 },
      { slotIndex: 10, role: 'DC', position: 'DEL', label: 'Delantero Der.', x: 64, y: 18 },
    ],
  },
  {
    id: '4-3-2-1',
    name: '4-3-2-1',
    defCount: 4,
    medCount: 5,
    delCount: 1,
    description: 'Árbol de Navidad: control interior con dos mediapuntas estrechos tras el punta.',
    realClubs: 'AC Milan clásico, PSG (variante interior), RB Leipzig',
    slots: [
      { slotIndex: 0, role: 'POR', position: 'POR', label: 'Portero', x: 50, y: 89 },
      { slotIndex: 1, role: 'LI', position: 'DEF', label: 'Lateral Izq.', x: 14, y: 71 },
      { slotIndex: 2, role: 'DFC', position: 'DEF', label: 'Central Izq.', x: 37, y: 74 },
      { slotIndex: 3, role: 'DFC', position: 'DEF', label: 'Central Der.', x: 63, y: 74 },
      { slotIndex: 4, role: 'LD', position: 'DEF', label: 'Lateral Der.', x: 86, y: 71 },
      { slotIndex: 5, role: 'MC', position: 'MED', label: 'Interior Izq.', x: 26, y: 52 },
      { slotIndex: 6, role: 'MCD', position: 'MED', label: 'Pivote', x: 50, y: 55 },
      { slotIndex: 7, role: 'MC', position: 'MED', label: 'Interior Der.', x: 74, y: 52 },
      { slotIndex: 8, role: 'MCO', position: 'MED', label: 'Mediapunta Izq.', x: 33, y: 32 },
      { slotIndex: 9, role: 'MCO', position: 'MED', label: 'Mediapunta Der.', x: 67, y: 32 },
      { slotIndex: 10, role: 'DC', position: 'DEL', label: 'Delantero Centro', x: 50, y: 15 },
    ],
  },
];

function distributeLineX(count: number, minX = 14, maxX = 86): number[] {
  if (count === 1) return [50];
  const step = (maxX - minX) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(minX + i * step));
}

export function validateCustomFormation(
  def: number,
  med: number,
  del: number
): { valid: boolean; error?: string } {
  if (!Number.isInteger(def) || !Number.isInteger(med) || !Number.isInteger(del)) {
    return { valid: false, error: 'Las líneas deben ser números enteros.' };
  }
  if (def + med + del !== 10) {
    return {
      valid: false,
      error: `El esquema ${def}-${med}-${del} suma ${def + med + del} jugadores de campo; deben ser exactamente 10 (más el portero).`,
    };
  }
  if (def < 3 || def > 5) {
    return {
      valid: false,
      error: `Esquema irreal (${def}-${med}-${del}): ningún equipo profesional juega con ${def} defensas. Debe estar entre 3 y 5.`,
    };
  }
  if (med < 2 || med > 5) {
    return {
      valid: false,
      error: `Esquema irreal (${def}-${med}-${del}): el centro del campo debe tener entre 2 y 5 jugadores.`,
    };
  }
  if (del < 1 || del > 3) {
    return {
      valid: false,
      error: `Esquema irreal (${def}-${med}-${del}): la delantera debe tener entre 1 y 3 atacantes.`,
    };
  }
  return { valid: true };
}

export function buildCustomFormation(def: number, med: number, del: number): Formation | null {
  const check = validateCustomFormation(def, med, del);
  if (!check.valid) return null;

  const id = `${def}-${med}-${del}`;
  const preset = PRESET_FORMATIONS.find((f) => f.id === id);
  if (preset) return preset;

  const slots: FormationSlot[] = [
    { slotIndex: 0, role: 'POR', position: 'POR', label: 'Portero', x: 50, y: 89 },
  ];

  const defXs = distributeLineX(def, def === 3 ? 25 : 14, def === 3 ? 75 : 86);
  defXs.forEach((x, idx) => {
    let role: RoleCode = 'DFC';
    let label = 'Central';
    if (def >= 4 && idx === 0) {
      role = 'LI';
      label = 'Lateral Izq.';
    } else if (def >= 4 && idx === def - 1) {
      role = 'LD';
      label = 'Lateral Der.';
    }
    slots.push({
      slotIndex: slots.length,
      role,
      position: 'DEF',
      label,
      x,
      y: role === 'LI' || role === 'LD' ? 70 : 73,
    });
  });

  const medXs = distributeLineX(med, med >= 4 ? 16 : 26, med >= 4 ? 84 : 74);
  medXs.forEach((x, idx) => {
    let role: RoleCode = 'MC';
    let label = 'Mediocentro';
    if (med >= 4 && idx === 0) {
      role = 'MI';
      label = 'Interior Izq.';
    } else if (med >= 4 && idx === med - 1) {
      role = 'MD';
      label = 'Interior Der.';
    } else if (med === 3 && idx === 1) {
      role = 'MCD';
      label = 'Pivote';
    }
    slots.push({
      slotIndex: slots.length,
      role,
      position: 'MED',
      label,
      x,
      y: role === 'MI' || role === 'MD' ? 46 : 50,
    });
  });

  const delXs = distributeLineX(del, del === 3 ? 19 : 35, del === 3 ? 81 : 65);
  delXs.forEach((x, idx) => {
    let role: RoleCode = 'DC';
    let label = 'Delantero';
    if (del === 3 && idx === 0) {
      role = 'EI';
      label = 'Extremo Izq.';
    } else if (del === 3 && idx === 2) {
      role = 'ED';
      label = 'Extremo Der.';
    } else if (del === 3 && idx === 1) {
      role = 'DC';
      label = 'Delantero Centro';
    }
    slots.push({
      slotIndex: slots.length,
      role,
      position: 'DEL',
      label,
      x,
      y: role === 'EI' || role === 'ED' ? 20 : 16,
    });
  });

  return {
    id,
    name: `${id} (Táctica propia)`,
    defCount: def,
    medCount: med,
    delCount: del,
    description: `Esquema táctico personalizado ${id} validado para el fútbol actual.`,
    realClubs: 'Variante táctica moderna',
    slots,
  };
}

export function getFormationById(
  formationId: string,
  customFormation?: { def: number; med: number; del: number } | null
): Formation {
  const preset = PRESET_FORMATIONS.find((f) => f.id === formationId);
  if (preset) return preset;
  if (customFormation) {
    const built = buildCustomFormation(customFormation.def, customFormation.med, customFormation.del);
    if (built) return built;
  }
  const parts = formationId.split('-').map(Number);
  if (parts.length === 3) {
    const built = buildCustomFormation(parts[0], parts[1], parts[2]);
    if (built) return built;
  }
  return PRESET_FORMATIONS[0];
}

export function isPositionCompatible(playerPos: PositionGroup, slotPos: PositionGroup): boolean {
  return playerPos === slotPos;
}
