import { expect, test, type Page } from "@playwright/test";
import type { AppConfigResponse, CharacterProgressResponse } from "../src/app/api";
import { readContractFixture } from "../test/contract-fixtures";

const appConfigFixture = readContractFixture("app-config") as AppConfigResponse;
const versionedCharacterFixture = readContractFixture("current-season") as CharacterProgressResponse;
type CharacterFixtureName =
  | "current-season"
  | "empty-progress"
  | "future-season"
  | "partial-progress"
  | "stale-metadata"
  | "unavailable-section"
  | "unknown-activity-kind";

function characterFixture(name: CharacterFixtureName): CharacterProgressResponse {
  return readContractFixture(name) as CharacterProgressResponse;
}

async function routeAppConfig(page: Page) {
  await page.route("**/v1/app-config", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify(appConfigFixture),
    });
  });
}

async function routeCharacter(page: Page, fixtureName: CharacterFixtureName = "current-season", region?: string) {
  const fixture = characterFixture(fixtureName);
  const requestRegion = region ?? fixture.character.region;
  const response = requestRegion === fixture.character.region
    ? fixture
    : { ...fixture, character: { ...fixture.character, region: requestRegion } };

  await page.route(
    `**/v1/vault-progress/${requestRegion}/${fixture.character.realm}/${fixture.character.name}`,
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    },
  );
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

test("renders the current API contract fixture from a static export", async ({ page }) => {
  await addFixtureCharacter(page);

  await expect(page.getByRole("heading", { name: "bixposter" })).toBeVisible();
  await expect(page.getByTestId("character-card").getByText("Season 2", { exact: true })).toBeVisible();
  await expect(page.getByTestId("progress-period")).toContainText("2026-09-16T03:00:00Z");
  await expect(page.getByText("Raids", { exact: true })).toBeVisible();
  await expect(page.getByText("Mythic+", { exact: true })).toBeVisible();
  await expect(page.getByText("Delves", { exact: true })).toBeVisible();
  await expect(page.getByTestId("vault-section-raid").locator("h3")).toHaveClass(/border-shaman\/50/);
  await expect(page.getByTestId("vault-section-mythic-plus").locator("h3")).toHaveClass(/border-shaman\/50/);
  await expect(page.getByTestId("vault-section-delves").locator("h3")).toHaveClass(/border-shaman\/50/);
  await expect(page.getByText("Vault slots", { exact: true })).toBeVisible();
  await expect(page.getByText("Weekly runs", { exact: true })).toBeVisible();
  await expect(page.getByText("Weekly completions", { exact: true })).toBeVisible();
  await expect(page.getByText("N", { exact: true })).toBeVisible();
  await expect(page.getByTestId("mythic-plus-progress").getByTitle("The Dawnbreaker +8")).toBeVisible();
  await expect(page.getByText("The Dawnbreaker", { exact: true })).toBeAttached();
  await expect(page.getByText("2 bosses", { exact: true })).toBeVisible();
  await expect(page.getByText("1 run", { exact: true })).toBeVisible();
  await expect(page.getByText("2 Delves", { exact: true })).toBeVisible();
  await expect(page.getByTestId("vault-slot-progress-raid-slot-2")).toHaveText("2 / 2 bosses");
  await expect(page.getByTestId("vault-slot-progress-mythic-plus-slot-1")).toHaveText("1 / 1 run");
  await expect(page.getByTestId("vault-slot-progress-delves-slot-2")).toHaveText("2 / 2 delves");
  await expect(page.getByTestId("raid-progress").locator('[role="list"]').locator(':scope > [role="listitem"]')).toHaveCount(1);
  await expect(page.getByTestId("mythic-plus-progress").locator('[role="list"]').locator(':scope > [role="listitem"]')).toHaveCount(1);
  await expect(page.locator('[data-testid^="vault-slot-mythic-plus-"] [role="list"]')).toHaveCount(0);
  await expect(page.getByTestId("raid-progress").locator('[data-item-id="wow:journal-encounter:2888"]')).toHaveClass(/border-fuchsia-500\/70/);
  await expect(page.getByTestId("mythic-plus-progress").locator('[data-item-id="raiderio:run:1"]')).toHaveClass(/border-emerald-800/);

  const encounter = page.locator("[aria-describedby]").first();
  await encounter.focus();
  const tooltip = page.locator('[role="tooltip"]').first();
  await expect(tooltip).toBeVisible();
  await expect(tooltip.getByText("Heroic", { exact: true })).toHaveCount(1);
  await expect(tooltip.getByText("Mythic", { exact: true })).toHaveCount(1);
  const tooltipBox = await tooltip.boundingBox();
  expect(tooltipBox).not.toBeNull();
  expect(tooltipBox!.x).toBeGreaterThanOrEqual(0);
  expect(tooltipBox!.x + tooltipBox!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("renders the character card at a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await addFixtureCharacter(page);

  await expect(page.getByRole("heading", { name: "bixposter" })).toBeVisible();
  await expect(page.getByText("Raids", { exact: true })).toBeVisible();
});

test("renders unknown activity kinds and values through the generic path", async ({ page }) => {
  await routeAppConfig(page);
  await routeCharacter(page, "unknown-activity-kind");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "malganis", "futurecharacter");

  await expect(page.getByRole("heading", { name: "futurecharacter" })).toBeVisible();
  await expect(page.getByText("Account-wide Activity", { exact: true })).toBeVisible();
  await expect(page.getByText("Future Status", { exact: true })).toBeVisible();
  await expect(page.getByText("3 events", { exact: true })).toBeVisible();
  await expect(page.getByTitle("Future event")).toBeVisible();
  await expect(page.locator('[data-rarity="future-rarity"]')).toHaveCount(1);
  await expect(page.locator('[data-rarity="future-rarity"]').first()).toHaveClass(/border-neutral-700/);
});

test("renders a future season with different activity and slot definitions", async ({ page }) => {
  await routeAppConfig(page);
  await routeCharacter(page, "future-season");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "tichondrius", "futureseasoncharacter");

  await expect(page.getByText("Midnight Season 2", { exact: true })).toBeVisible();
  await expect(page.getByTestId("character-card").getByText("Season 3", { exact: true })).toBeVisible();
  await expect(page.getByText("World Events", { exact: true })).toBeVisible();
  await expect(page.getByText("3 bosses", { exact: true })).toBeVisible();
  await expect(page.getByText("9 bosses", { exact: true })).toBeVisible();
  await expect(page.getByText("5 events", { exact: true })).toBeVisible();
});

test("renders empty and partial progress fixtures", async ({ page }) => {
  await routeAppConfig(page);
  await routeCharacter(page, "empty-progress");
  await routeCharacter(page, "partial-progress");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "nagrand", "newcharacter");
  await addCharacter(page, "eu", "silvermoon", "partialcharacter");

  await expect(page.getByRole("heading", { name: "newcharacter" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "partialcharacter" })).toBeVisible();
  await expect(page.getByText("2 Delves", { exact: true })).toBeVisible();
  await expect(page.getByText("4 runs", { exact: true })).toBeVisible();
});

test("preserves stale and unavailable section states from the contract fixtures", async ({ page }) => {
  await routeAppConfig(page);
  await routeCharacter(page, "unavailable-section");
  await routeCharacter(page, "stale-metadata");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "area-52", "unavailablecharacter");
  await addCharacter(page, "us", "stormrage", "stalecharacter");

  await expect(page.getByText("Raids data is unavailable.", { exact: true })).toBeVisible();
  await expect(page.getByText("Raids is using stale data.", { exact: true })).toBeVisible();
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
  await routeCharacter(page, "current-season", "us");
  await routeCharacter(page, "current-season", "eu");

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "nagrand", "bixposter");
  await addCharacter(page, "eu", "nagrand", "bixposter");

  await expect(page.getByTestId("character-card")).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "bixposter" })).toHaveCount(2);
  const firstCard = await page.getByTestId("character-card").nth(0).boundingBox();
  const secondCard = await page.getByTestId("character-card").nth(1).boundingBox();
  expect(firstCard).not.toBeNull();
  expect(secondCard).not.toBeNull();
  expect(secondCard!.x).toBeGreaterThan(firstCard!.x);
  expect(Math.abs(secondCard!.y - firstCard!.y)).toBeLessThan(2);

  await page.getByRole("button", { name: "Remove bixposter nagrand US" }).click();

  await expect(page.getByTestId("character-card")).toHaveCount(1);
  await expect(page.getByTestId("character-card").getByText("EU", { exact: true })).toBeVisible();
  await expect(page.getByTestId("character-card").getByText("US", { exact: true })).toHaveCount(0);
  const savedCharacters = await page.evaluate(() => localStorage.getItem("characters"));
  expect(savedCharacters).toBe(JSON.stringify([
    { region: "eu", realm: "nagrand", name: "bixposter" },
  ]));
});
