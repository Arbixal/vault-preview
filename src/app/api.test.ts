import { describe, expect, it, vi } from "vitest";
import {
  ApiError,
  ApiValidationError,
  fetchCharacterProgress,
  parseAppConfigResponse,
  parseCharacterProgressResponse,
} from "./api";

const revisionHash = "sha256:0000000000000000000000000000000000000000000000000000000000000000";

function appConfigFixture() {
  return {
    schemaVersion: 1,
    activeSeason: {
      id: "active-season",
      displayName: "Active Season",
      shortLabel: "Season X",
      expansion: "Expansion",
      revision: "active-season-r1",
      revisionHash,
    },
  };
}

function characterFixture() {
  return {
    schemaVersion: 1,
    character: {
      region: "us",
      realm: "nagrand",
      name: "bixposter",
      class: "shaman",
    },
    season: {
      id: "historical-season",
      displayName: "Historical Season",
      shortLabel: "Season H",
      expansion: "Expansion",
      revision: "historical-season-r4",
      revisionHash,
    },
    progressPeriod: {
      resetAt: "2026-09-15T15:00:00Z",
      asOf: "2026-09-16T03:00:00Z",
    },
    futureOptionalMetadata: { source: "test" },
    sections: [
      {
        id: "future-activity",
        title: "Future Activity",
        subtitle: null,
        kind: "future-kind",
        status: "future-status",
        freshness: "future-freshness",
        slots: [
          {
            id: "future-slot",
            requirement: { unit: "events", required: 3, label: "3 events" },
            progress: { completed: 1, state: "future-progress-state" },
            reward: { itemLevel: null, rarity: "future-rarity" },
            items: [
              {
                id: "future:item:1",
                label: "Future item",
                state: "future-item-state",
                progress: {
                  value: 1,
                  completed: 1,
                  required: 3,
                  dimensions: [],
                },
                tooltip: {
                  title: "Future item",
                  rows: [{ label: "Progress", value: "1/3" }],
                },
              },
            ],
          },
        ],
        additionalItems: [],
      },
    ],
  };
}

describe("versioned API data layer", () => {
  it("validates and parses the runtime app configuration", () => {
    const response = parseAppConfigResponse(appConfigFixture());

    expect(response.activeSeason.id).toBe("active-season");
    expect(response.activeSeason.revisionHash).toBe(revisionHash);
  });

  it("preserves a character's season snapshot independently from active config", () => {
    const response = parseCharacterProgressResponse(characterFixture());

    expect(response.season.id).toBe("historical-season");
    expect(response.season.revision).toBe("historical-season-r4");
    expect(response.progressPeriod).toEqual({
      resetAt: "2026-09-15T15:00:00Z",
      asOf: "2026-09-16T03:00:00Z",
    });
    expect(response.sections[0].kind).toBe("future-kind");
    expect(response.sections[0].slots[0].items[0].rarity).toBeUndefined();
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
