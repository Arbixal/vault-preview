import type { CharacterData } from "./_components/characterPanel";
import type { DelveData } from "./_components/delvePanel";
import type { RaidData } from "./_components/raidPanel";
import type { DungeonData } from "./_components/mythicPlusPanel";
import {
  type BossData,
  getBossNames,
} from "./seasonData";
import type {
  CharacterProgressResponse,
  ProgressItem,
  VaultSection,
} from "./api";

/**
 * Keeps the existing activity panels usable while T11 moves them to the
 * normalized section/slot model.
 */
export function toLegacyCharacterData(response: CharacterProgressResponse): CharacterData {
  return {
    raid: toLegacyRaidData(response),
    dungeons: toLegacyDungeonData(response),
    delves: toLegacyDelveData(response),
  };
}

function toLegacyRaidData(response: CharacterProgressResponse): RaidData {
  const bosses = getBossNames(response.season.sourceSeasonId);
  const result: RaidData = {};

  for (const boss of bosses) {
    result[boss.key] = {
      mythic: false,
      heroic: false,
      normal: false,
      lfr: false,
    };
  }

  const section = findSection(response, "raid");
  if (!section) {
    return result;
  }

  for (const item of sectionItems(section)) {
    const boss = bosses.find((candidate) => matchesBoss(candidate.name, candidate.label, item));
    if (!boss) {
      continue;
    }

    result[boss.key] = toBossData(item);
  }

  return result;
}

function toLegacyDungeonData(response: CharacterProgressResponse): DungeonData {
  const section = findSection(response, "mythic-plus");
  if (!section) {
    return [];
  }

  return sectionItems(section)
    .map((item) => ({
      level: numberValue(item.progress?.value),
      name: item.tooltip?.title ?? item.label.replace(/\s+\+\d+$/, ""),
    }))
    .filter((run) => run.level > 0);
}

function toLegacyDelveData(response: CharacterProgressResponse): DelveData {
  const result: DelveData = {};
  for (let level = 1; level <= 11; level += 1) {
    result[level] = 0;
  }

  const section = findSection(response, "delves");
  if (!section) {
    return result;
  }

  for (const item of sectionItems(section)) {
    const level = numberValue(item.progress?.value) || delveLevelFromId(item.id);
    const completed = item.progress?.completed;
    if (level > 0 && completed !== undefined && completed !== null) {
      result[level] = completed;
    }
  }

  return result;
}

function toBossData(item: ProgressItem): BossData {
  const completed = new Set(
    (item.progress?.dimensions ?? [])
      .filter((dimension) => dimension.completed === true || dimension.state.toLowerCase() === "complete")
      .map((dimension) => dimension.id.toLowerCase()),
  );

  return {
    mythic: completed.has("mythic"),
    heroic: completed.has("heroic"),
    normal: completed.has("normal"),
    lfr: completed.has("lfr"),
  };
}

function findSection(response: CharacterProgressResponse, kind: string): VaultSection | undefined {
  return response.sections.find((section) => section.kind.toLowerCase() === kind);
}

function sectionItems(section: VaultSection): ProgressItem[] {
  const items = section.slots.flatMap((slot) => slot.items).concat(section.additionalItems);
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function matchesBoss(name: string, label: string, item: ProgressItem): boolean {
  const itemTitle = item.tooltip?.title ?? item.label;
  const normalizedName = normalize(name);
  const normalizedTitle = normalize(itemTitle);

  return normalizedName === normalizedTitle
    || normalizedName.includes(normalizedTitle)
    || normalizedTitle.includes(normalizedName)
    || label === item.label;
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function numberValue(value: number | string | null | undefined): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function delveLevelFromId(id: string): number {
  const match = /^wow:delve-level:(\d+)$/.exec(id);
  return match ? Number(match[1]) : 0;
}
