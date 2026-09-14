import { expect, test, type Page } from "@playwright/test";
import season2Fixture from "../src/app/season2Character.fixture.json";

async function addFixtureCharacter(page: Page) {
  await page.route("**/vault-progress/us/nagrand/bixposter", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        "bixposter-nagrand": season2Fixture["season2-test-character"],
      }),
    });
  });

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

test("can retry a failed character request", async ({ page }) => {
  let attempts = 0;
  await page.route("**/vault-progress/us/nagrand/bixposter", async (route) => {
    attempts += 1;

    if (attempts === 1) {
      await route.fulfill({ status: 500, contentType: "text/plain", body: "API unavailable" });
      return;
    }

    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        "bixposter-nagrand": season2Fixture["season2-test-character"],
      }),
    });
  });

  await page.goto("/");
  await expect(page.getByRole("button", { name: "Add character", exact: true })).toBeEnabled();
  await addCharacter(page, "us", "nagrand", "bixposter");

  await expect(page.getByText("Unable to load data for this character. Try again in a moment.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByRole("heading", { name: "bixposter" })).toBeVisible();
  expect(attempts).toBe(2);
});

test("renders multiple characters and removes only the selected region", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.route("**/vault-progress/us/nagrand/bixposter", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        "bixposter-nagrand": season2Fixture["season2-test-character"],
      }),
    });
  });
  await page.route("**/vault-progress/eu/nagrand/bixposter", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        "bixposter-nagrand": season2Fixture["season2-test-character"],
      }),
    });
  });

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
