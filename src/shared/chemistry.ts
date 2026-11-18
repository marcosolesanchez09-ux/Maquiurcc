import type {
  ChemistryLink,
  Formation,
  Player,
  PlayerChemistryInfo,
  TeamChemistrySummary,
} from './types.ts';

export function calculateTeamChemistry(
  formation: Formation,
  starters: Array<string | null>,
  ownedPlayers: Record<string, Player>
): TeamChemistrySummary {
  const activeStarters: Array<{ slotIndex: number; player: Player }> = [];
  for (let i = 0; i < formation.slots.length; i++) {
    const pid = starters[i];
    if (pid && ownedPlayers[pid]) {
      activeStarters.push({ slotIndex: i, player: ownedPlayers[pid] });
    }
  }

  const clubCounts = new Map<string, number>();
  const leagueCounts = new Map<string, number>();
  const nationCounts = new Map<string, number>();

  for (const { player } of activeStarters) {
    clubCounts.set(player.club, (clubCounts.get(player.club) || 0) + 1);
    leagueCounts.set(player.league, (leagueCounts.get(player.league) || 0) + 1);
    nationCounts.set(player.nationality, (nationCounts.get(player.nationality) || 0) + 1);
  }

  const perStarter: Record<string, PlayerChemistryInfo> = {};
  let totalPoints = 0;

  for (const { slotIndex, player } of activeStarters) {
    const cCount = clubCounts.get(player.club) || 1;
    const lCount = leagueCounts.get(player.league) || 1;
    const nCount = nationCounts.get(player.nationality) || 1;

    let pts = 0;
    if (cCount >= 3) pts += 3;
    else if (cCount >= 2) pts += 2;

    if (lCount >= 6) pts += 3;
    else if (lCount >= 4) pts += 2;
    else if (lCount >= 2) pts += 1;

    if (nCount >= 6) pts += 3;
    else if (nCount >= 4) pts += 2;
    else if (nCount >= 2) pts += 1;

    const clamped = Math.min(3, pts);
    totalPoints += clamped;

    perStarter[player.id] = {
      slotIndex,
      playerId: player.id,
      points: clamped,
      leagueCount: lCount,
      nationCount: nCount,
      clubCount: cCount,
    };
  }

  // Visual links between nearby formation nodes that share club, league, or nationality
  const links: ChemistryLink[] = [];
  let strongLinks = 0;

  for (let i = 0; i < activeStarters.length; i++) {
    for (let j = i + 1; j < activeStarters.length; j++) {
      const a = activeStarters[i];
      const b = activeStarters[j];
      const slotA = formation.slots[a.slotIndex];
      const slotB = formation.slots[b.slotIndex];
      if (!slotA || !slotB) continue;

      const dist = Math.hypot(slotA.x - slotB.x, slotA.y - slotB.y);
      if (dist > 36) continue;

      const sameClub = a.player.club === b.player.club;
      const sameLeague = a.player.league === b.player.league;
      const sameNation = a.player.nationality === b.player.nationality;

      if (sameClub || (sameLeague && sameNation)) {
        links.push({ fromSlot: a.slotIndex, toSlot: b.slotIndex, strength: 'perfect' });
        strongLinks++;
      } else if (sameLeague || sameNation) {
        links.push({ fromSlot: a.slotIndex, toSlot: b.slotIndex, strength: 'strong' });
      }
    }
  }

  const totalScore = activeStarters.length > 0 ? Math.min(100, Math.round((totalPoints / 33) * 100)) : 0;
  const ovrBonus = Math.round((totalScore / 100) * 4.5 * 10) / 10;

  const sortMatches = (m: Map<string, number>) =>
    Array.from(m.entries())
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([label, count]) => ({ label, count }));

  return {
    totalScore,
    ovrBonus,
    strongLinks,
    clubMatches: sortMatches(clubCounts),
    leagueMatches: sortMatches(leagueCounts),
    nationMatches: sortMatches(nationCounts),
    perStarter,
    links,
  };
}
