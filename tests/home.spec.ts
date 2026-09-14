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
  const textInputs = page.locator('input[type="text"]');
  await textInputs.nth(0).fill("nagrand");
  await textInputs.nth(1).fill("bixposter");
  await page.getByRole("button", { name: "Add" }).click();
}

test("renders Season 2 character progress from a static export", async ({ page }) => {
  await addFixtureCharacter(page);

  await expect(page.getByRole("heading", { name: "bixposter nagrand" })).toBeVisible();
  await expect(page.getByText("Raids", { exact: true })).toBeVisible();
  await expect(page.getByText("M+", { exact: true })).toBeVisible();
  await expect(page.getByText("Delves", { exact: true })).toBeVisible();
  await expect(page.getByText("NW", { exact: true })).toBeVisible();
  await expect(page.getByText("Temple of Sethraliss", { exact: true })).toBeAttached();
});

test("renders the character card at a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await addFixtureCharacter(page);

  await expect(page.getByRole("heading", { name: "bixposter nagrand" })).toBeVisible();
  await expect(page.getByText("Raids", { exact: true })).toBeVisible();
});
