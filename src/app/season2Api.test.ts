import { describe, expect, it } from "vitest";
import season2Fixture from "./season2Character.fixture.json";
import {
    bossDataToILevel,
    getBossNames,
    levelToILevel,
    BossData,
} from "./seasonData";

const character = season2Fixture["season2-test-character"];

describe("Season 2 API fixture", () => {
    it("matches the live Season 18 response shape", () => {
        expect(character.player_class).toBe("shaman");
        expect(character.season).toBe(18);
        expect(Object.keys(character.raid)).toEqual(getBossNames(18).map((boss) => boss.key));
        expect(character.dungeons).toHaveLength(4);
        expect(Object.keys(character.delves)).toEqual([
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
        ]);
    });

    it("maps the fixture's raid and Mythic+ progress", () => {
        expect(bossDataToILevel(character.raid["nek'zali-the-soulcoiler"] as BossData, character.season)).toBe(318);
        expect(bossDataToILevel(character.raid["ula'tek"] as BossData, character.season)).toBe(305);
        expect(bossDataToILevel(character.raid["nymrissa-wavecaller"] as BossData, character.season)).toBe(318);

        const highestDungeon = Math.max(...character.dungeons.map((dungeon) => dungeon.level));
        expect(levelToILevel(highestDungeon, character.season)).toBe(315);
    });

    it("keeps the fixture independent from live API data", () => {
        expect(Object.values(character.delves).every((count) => count === 0)).toBe(true);
    });
});
