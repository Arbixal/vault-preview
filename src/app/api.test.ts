import { describe, expect, it, vi } from "vitest";
import {
  ApiError,
  ApiValidationError,
  fetchCharacterProgress,
  parseAppConfigResponse,
  parseCharacterProgressResponse,
  type CharacterProgressResponse,
} from "./api";
import { contractManifest, readContractFixture } from "../../test/contract-fixtures";

function characterFixture(): CharacterProgressResponse {
  return parseCharacterProgressResponse(readContractFixture("current-season"));
}

describe("versioned API data layer", () => {
  for (const fixture of contractManifest.fixtures) {
    it(`parses the published ${fixture.name} fixture`, () => {
      const value = readContractFixture(fixture.name);

      if (fixture.responseType === "AppConfigResponse") {
        expect(parseAppConfigResponse(value).schemaVersion).toBe(1);
      } else if (fixture.responseType === "CharacterProgressResponse") {
        expect(parseCharacterProgressResponse(value).schemaVersion).toBe(1);
      } else if (fixture.responseType === "LegacyProgressResponse") {
        expect(value).toMatchObject({
          "bixposter-nagrand": {
            raid: expect.any(Object),
            dungeons: expect.any(Array),
            delves: expect.any(Object),
            season: expect.any(Number),
          },
        });
      } else {
        throw new Error(`Unsupported contract response type: ${fixture.responseType}`);
      }
    });
  }

  it("validates and parses the runtime app configuration", () => {
    const response = parseAppConfigResponse(readContractFixture("app-config"));

    expect(response.activeSeason.id).toBe("midnight-s2");
    expect(response.activeSeason.revisionHash).toMatch(/^sha256:[0-9a-f]{64}$/);
  });

  it("preserves future activity values and ignores additive response data", () => {
    const currentSeason = readContractFixture("current-season");
    const response = parseCharacterProgressResponse(readContractFixture("unknown-activity-kind"));

    expect(response.season.id).toBe("midnight-s2");
    expect(response.progressPeriod).toEqual({
      resetAt: "2026-09-15T15:00:00Z",
      asOf: "2026-09-16T07:00:00Z",
    });
    expect(response.sections[0].kind).toBe("future-account-activity");
    expect(response.sections[0].status).toBe("future-status");
    expect(response.sections[0].slots[0].items[0].rarity).toBe("future-rarity");
    expect(currentSeason).toHaveProperty("futureOptionalMetadata");
    expect(parseCharacterProgressResponse(currentSeason)).not.toHaveProperty("futureOptionalMetadata");
  });

  it("rejects malformed versioned responses", () => {
    const malformed = {
      ...characterFixture(),
      season: {
        ...characterFixture().season,
        revisionHash: "not-a-hash",
      },
    };

    expect(() => parseCharacterProgressResponse(malformed)).toThrow(ApiValidationError);
  });

  it("treats omitted empty reward fields as an empty reward", () => {
    const fixture = characterFixture();
    const response = parseCharacterProgressResponse({
      ...fixture,
      sections: fixture.sections.map((section) => ({
        ...section,
        slots: section.slots.map((slot) => ({ ...slot, reward: {} })),
      })),
    });

    expect(response.sections[0].slots[0].reward).toEqual({ itemLevel: null, rarity: null });
  });

  it("turns structured HTTP errors into typed API errors", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({
      schemaVersion: 1,
      error: {
        code: "CHARACTER_NOT_FOUND",
        message: "Character data is not available.",
        requestId: "request-123",
      },
    }), { status: 404, headers: { "Content-Type": "application/json" } })));

    const request = fetchCharacterProgress({ region: "us", realm: "nagrand", name: "missing" });
    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({
        status: 404,
        code: "CHARACTER_NOT_FOUND",
        requestId: "request-123",
      });

    vi.unstubAllGlobals();
  });
});
