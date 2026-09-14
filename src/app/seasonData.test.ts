import { describe, expect, it } from "vitest";
import {
    bossDataToILevel,
    delveToILevel,
    getBossNames,
    ilvlToRarity,
    levelToILevel,
    BossData,
} from "./seasonData";

const TWW_S3 = 15;
const MIDNIGHT_S2 = 18;

describe("levelToILevel", () => {
    it.each([
        [10, 707],
        [7, 704],
        [6, 701],
        [4, 697],
        [2, 694],
    ])("maps Mythic+ level %s to item level %s", (level, expected) => {
        expect(levelToILevel(level, TWW_S3)).toBe(expected);
    });

    it("returns -1 below the supported breakpoint", () => {
        expect(levelToILevel(1, TWW_S3)).toBe(-1);
    });

    it("returns -1 for an undefined season", () => {
        expect(levelToILevel(10, undefined)).toBe(-1);
    });
});

describe("delveToILevel", () => {
    it.each([
        [8, 694],
        [7, 691],
        [6, 688],
        [5, 681],
        [4, 678],
        [3, 675],
        [2, 671],
        [1, 668],
    ])("maps Delve tier %s to item level %s", (tier, expected) => {
        expect(delveToILevel(tier, TWW_S3)).toBe(expected);
    });

    it("returns -1 below the supported tier", () => {
        expect(delveToILevel(0, TWW_S3)).toBe(-1);
    });

    it("returns -1 for an undefined season", () => {
        expect(delveToILevel(8, undefined)).toBe(-1);
    });
});

describe("Midnight Season 2 mappings", () => {
    it.each([
        [10, 318],
        [7, 315],
        [6, 311],
        [4, 308],
        [2, 305],
    ])("maps Season 2 Mythic+ level %s to item level %s", (level, expected) => {
        expect(levelToILevel(level, MIDNIGHT_S2)).toBe(expected);
    });

    it.each([
        [8, 305],
        [7, 302],
        [6, 298],
        [5, 292],
        [4, 289],
        [3, 285],
        [2, 282],
        [1, 279],
    ])("maps Season 2 Delve tier %s to item level %s", (tier, expected) => {
        expect(delveToILevel(tier, MIDNIGHT_S2)).toBe(expected);
    });

    it.each([
        [{ mythic: true, heroic: false, normal: false, lfr: false }, 334],
        [{ mythic: false, heroic: true, normal: false, lfr: false }, 318],
        [{ mythic: false, heroic: false, normal: true, lfr: false }, 305],
        [{ mythic: false, heroic: false, normal: false, lfr: true }, 292],
    ])("maps Season 2 raid difficulty to Great Vault item level %s", (data, expected) => {
        expect(bossDataToILevel(data as BossData, MIDNIGHT_S2)).toBe(expected);
    });

    it.each([
        [318, "legendary"],
        [317, "epic"],
        [305, "epic"],
        [304, "rare"],
        [292, "rare"],
        [291, "uncommon"],
        [279, "uncommon"],
        [278, "poor"],
    ])("maps Season 2 item level %s to gear-track rarity %s", (level, expected) => {
        expect(ilvlToRarity(level, MIDNIGHT_S2)).toBe(expected);
    });
});

describe("bossDataToILevel", () => {
    it.each([
        [{ mythic: true, heroic: false, normal: false, lfr: false }, 707],
        [{ mythic: false, heroic: true, normal: false, lfr: false }, 694],
        [{ mythic: false, heroic: false, normal: true, lfr: false }, 681],
        [{ mythic: false, heroic: false, normal: false, lfr: true }, 668],
    ])("maps raid difficulty to item level %s", (data, expected) => {
        expect(bossDataToILevel(data as BossData, TWW_S3)).toBe(expected);
    });

    it("returns -1 when no difficulty is completed", () => {
        expect(bossDataToILevel({ mythic: false, heroic: false, normal: false, lfr: false }, TWW_S3)).toBe(-1);
    });

    it("returns -1 for an undefined season", () => {
        expect(bossDataToILevel({ mythic: true, heroic: false, normal: false, lfr: false }, undefined)).toBe(-1);
    });
});

describe("getBossNames", () => {
    it("returns the Manaforge Omega bosses in order", () => {
        const bosses = getBossNames(TWW_S3);

        expect(bosses).toHaveLength(8);
        expect(bosses[0]).toEqual({ label: "P", key: "plexus-sentinel", name: "Plexus Sentinel" });
        expect(bosses[7]).toEqual({ label: "D", key: "dimensius", name: "Dimensius" });
    });

    it("returns an empty list for an undefined season", () => {
        expect(getBossNames(undefined)).toEqual([]);
    });

    it("returns an empty list for an unknown season", () => {
        expect(getBossNames(999)).toEqual([]);
    });
});

describe("ilvlToRarity", () => {
    it.each([
        [707, "legendary"],
        [706, "epic"],
        [694, "epic"],
        [693, "rare"],
        [681, "rare"],
        [680, "uncommon"],
        [668, "uncommon"],
        [667, "poor"],
    ])("maps item level %s to %s", (level, expected) => {
        expect(ilvlToRarity(level, TWW_S3)).toBe(expected);
    });

    it("returns poor for an undefined season", () => {
        expect(ilvlToRarity(707, undefined)).toBe("poor");
    });
});
