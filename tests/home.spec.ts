import { expect, test, type Page } from "@playwright/test";
import season2Fixture from "../src/app/season2Character.fixture.json";

const appConfigFixture = {
  schemaVersion: 1,
  activeSeason: {
    id: "midnight-s2",
    displayName: "Midnight Season 2",
    shortLabel: "Season 2",
    expansion: "Midnight",
    sourceSeasonId: 18,
    revision: "midnight-s2-r1",
    revisionHash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
  },
};

const versionedCharacterFixture = {
  schemaVersion: 1,
  character: {
    region: "us",
    realm: "nagrand",
    name: "bixposter",
    class: "shaman",
  },
  season: appConfigFixture.activeSeason,
  progressPeriod: {
    resetAt: "2026-09-15T15:00:00Z",
    asOf: "2026-09-16T03:00:00Z",
  },
  sections: [
    {
      id: "raid",
      title: "Raids",
      subtitle: "Vault slots",
      kind: "raid",
      status: "available",
      freshness: "fresh",
      slots: [
        {
          id: "raid-slot-6",
          requirement: { unit: "bosses", required: 6, label: "6 bosses" },
          progress: { completed: 3, state: "incomplete" },
          reward: { itemLevel: null, rarity: null },
          items: [
            {
              id: "wow:journal-encounter:1",
              label: "N",
              state: "complete",
              progress: {
                dimensions: [
                  { id: "heroic", label: "Heroic", state: "complete", completed: true },
                ],
              },
              tooltip: { title: "Nek'zali the Soulcoiler", rows: [] },
            },
            {
              id: "wow:journal-encounter:2",
              label: "NW",
              state: "complete",
              progress: {
                dimensions: [
                  { id: "heroic", label: "Heroic", state: "complete", completed: true },
                ],
              },
              tooltip: { title: "Nymrissa Wavecaller", rows: [] },
            },
            {
              id: "wow:journal-encounter:3",
              label: "U",
              state: "complete",
              progress: {
                dimensions: [
                  { id: "normal", label: "Normal", state: "complete", completed: true },
                ],
              },
              tooltip: { title: "Ula'tek", rows: [] },
            },
          ],
        },
      ],
      additionalItems: [],
    },
    {
      id: "mythic-plus",
      title: "Mythic+",
      subtitle: "Weekly runs",
      kind: "mythic-plus",
      status: "available",
      freshness: "fresh",
      slots: [
        {
          id: "mythic-plus-slot-4",
          requirement: { unit: "runs", required: 4, label: "4 runs" },
          progress: { completed: 4, state: "complete" },
          reward: { itemLevel: 315, rarity: "epic" },
          items: season2Fixture["season2-test-character"].dungeons.map((run, index) => ({
            id: `raiderio:run:${index + 1}`,
            label: `${run.name} +${run.level}`,
            state: "complete",
            progress: { value: run.level },
          })),
        },
      ],
      additionalItems: [],
    },
    {
      id: "delves",
      title: "Delves",
      subtitle: "Weekly completions",
      kind: "delves",
      status: "empty",
      freshness: "fresh",
      slots: [
        {
          id: "delves-slot-2",
          requirement: { unit: "delves", required: 2, label: "2 delves" },
          progress: { completed: 0, state: "incomplete" },
          reward: { itemLevel: null, rarity: null },
          items: [],
        },
      ],
      additionalItems: [],
    },
  ],
};

async function routeAppConfig(page: Page) {
  await page.route("**/v1/app-config", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(appConfigFixture),
    });
  });
}

async function routeCharacter(page: Page, region = "us") {
  await page.route(`**/v1/vault-progress/${region}/nagrand/bixposter`, async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ...versionedCharacterFixture,
        character: { ...versionedCharacterFixture.character, region },
      }),
    });
  });
}

async function addFixtureCharacter(page: Page) {
  await routeAppConfig(page);
  await routeCharacter(page);

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await page.locator("#realm").fill("nagrand");
  await page.locator("#character").fill("bixposter");
  await expect(page.locator("#realm")).toHaveValue("nagrand");
  await expect(page.locator("#character")).toHaveValue("bixposter");
  await page.getByRole("button", { name: "Add character", exact: true }).click();
}

async function addCharacter(page: Page, region: string, realm: string, name: string) {
  await page.locator("#region").selectOption(region);
  await page.locator("#realm").fill(realm);
  await page.locator("#character").fill(name);
  await page.getByRole("button", { name: "Add character", exact: true }).click();
}

test("renders Season 2 character progress from a static export", async ({ page }) => {
  await addFixtureCharacter(page);

  await expect(page.getByRole("heading", { name: "bixposter" })).toBeVisible();
  await expect(page.getByTestId("season-snapshot")).toContainText("midnight-s2-r1");
  await expect(page.getByTestId("progress-period")).toContainText("2026-09-16T03:00:00Z");
  await expect(page.getByText("Raids", { exact: true })).toBeVisible();
  await expect(page.getByText("Mythic+", { exact: true })).toBeVisible();
  await expect(page.getByText("Delves", { exact: true })).toBeVisible();
  await expect(page.getByText("Vault tiers", { exact: true })).toHaveCount(3);
  await expect(page.getByText("NW", { exact: true })).toBeVisible();
  await expect(page.getByText("Temple of Sethraliss", { exact: true })).toBeAttached();
  await expect(page.getByText("2 bosses", { exact: true })).toBeVisible();
  await expect(page.getByText("4 runs", { exact: true })).toBeVisible();
  await expect(page.getByText("8 delves", { exact: true })).toBeVisible();
  await expect(page.getByText("Need 6 bosses", { exact: true })).toBeVisible();
  await expect(page.getByText("Need 8 runs", { exact: true })).toBeVisible();
  await expect(page.getByText("Need 2 delves", { exact: true })).toBeVisible();

  const encounter = page.locator("[aria-describedby]").first();
  await encounter.focus();
  await expect(page.locator('[role="tooltip"]').first()).toBeVisible();
});

test("renders the character card at a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await addFixtureCharacter(page);

  await expect(page.getByRole("heading", { name: "bixposter" })).toBeVisible();
  await expect(page.getByText("Raids", { exact: true })).toBeVisible();
});

test("keeps the character snapshot when active configuration changes", async ({ page }) => {
  await page.route("**/v1/app-config", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ...appConfigFixture,
        activeSeason: {
          ...appConfigFixture.activeSeason,
          id: "future-season",
          displayName: "Future Season",
          shortLabel: "Season Future",
          revision: "future-season-r1",
          revisionHash: "sha256:1111111111111111111111111111111111111111111111111111111111111111",
        },
      }),
    });
  });
  await page.route("**/v1/vault-progress/us/nagrand/bixposter", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ...versionedCharacterFixture,
        season: {
          ...versionedCharacterFixture.season,
          id: "previous-season",
          displayName: "Previous Season",
          shortLabel: "Season Previous",
          revision: "previous-season-r2",
        },
      }),
    });
  });

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "nagrand", "bixposter");

  await expect(page.getByText("Future Season", { exact: true })).toBeVisible();
  await expect(page.getByTestId("season-snapshot")).toContainText("Previous Season");
  await expect(page.getByTestId("season-snapshot")).toContainText("previous-season-r2");
  await expect(page.getByTestId("season-snapshot")).toContainText("hash sha256:0000");
});

test("preserves stale and unavailable section states", async ({ page }) => {
  await routeAppConfig(page);
  await page.route("**/v1/vault-progress/us/nagrand/bixposter", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        ...versionedCharacterFixture,
        sections: versionedCharacterFixture.sections.map((section) => {
          if (section.id === "raid") {
            return { ...section, status: "unavailable", freshness: "stale", subtitle: "Raid data is unavailable." };
          }
          if (section.id === "mythic-plus") {
            return { ...section, freshness: "future-freshness" };
          }
          return section;
        }),
      }),
    });
  });

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "nagrand", "bixposter");

  await expect(page.getByText("Raid data is unavailable.", { exact: true })).toBeVisible();
  await expect(page.getByText("Mythic+ is using stale data.", { exact: true })).toHaveCount(0);
});

test("can retry a failed character request", async ({ page }) => {
  let attempts = 0;
  await routeAppConfig(page);
  await page.route("**/v1/vault-progress/us/nagrand/bixposter", async (route) => {
    attempts += 1;

    if (attempts === 1) {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          schemaVersion: 1,
          error: { code: "UPSTREAM_UNAVAILABLE", message: "Required upstream data is unavailable." },
        }),
      });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(versionedCharacterFixture),
    });
  });

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "nagrand", "bixposter");

  await expect(page.getByText("The upstream progress service is unavailable.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByRole("heading", { name: "bixposter" })).toBeVisible();
  expect(attempts).toBe(2);
});

test("renders multiple characters and removes only the selected region", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await routeAppConfig(page);
  await routeCharacter(page, "us");
  await routeCharacter(page, "eu");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "nagrand", "bixposter");
  await addCharacter(page, "eu", "nagrand", "bixposter");

  await expect(page.locator("article")).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "bixposter" })).toHaveCount(2);
  const firstCard = await page.locator("article").nth(0).boundingBox();
  const secondCard = await page.locator("article").nth(1).boundingBox();
  expect(firstCard).not.toBeNull();
  expect(secondCard).not.toBeNull();
  expect(secondCard!.x).toBeGreaterThan(firstCard!.x);
  expect(Math.abs(secondCard!.y - firstCard!.y)).toBeLessThan(2);

  await page.getByRole("button", { name: "Remove bixposter nagrand US" }).click();

  await expect(page.locator("article")).toHaveCount(1);
  await expect(page.locator("article").getByText("EU", { exact: true })).toBeVisible();
  await expect(page.locator("article").getByText("US", { exact: true })).toHaveCount(0);
  const savedCharacters = await page.evaluate(() => localStorage.getItem("characters"));
  expect(savedCharacters).toBe(JSON.stringify([
    { region: "eu", realm: "nagrand", name: "bixposter" },
  ]));
});
