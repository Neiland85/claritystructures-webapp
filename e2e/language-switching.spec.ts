import { test, expect } from "@playwright/test";

// Dismiss cookie consent banner before each test
const CONSENT_VALUE = JSON.stringify({
  necessary: true,
  analytical: false,
  marketing: false,
});

test.beforeEach(async ({ page }) => {
  await page.addInitScript((value) => {
    localStorage.setItem("clarity_cookie_consent", value);
  }, CONSENT_VALUE);
});

test.describe("Language switching", () => {
  test("Spanish page shows Spanish content", async ({ page }) => {
    await page.goto("/es");

    await expect(page.getByText("Triage de Emergencia Técnica")).toBeVisible();
    await expect(page.getByText("Situación Actual")).toBeVisible();
    await expect(page.getByText("Nivel de Urgencia")).toBeVisible();
  });

  test("English page shows English content", async ({ page }) => {
    await page.goto("/en");

    await expect(page.getByText("Technical Emergency Triage")).toBeVisible();
    await expect(page.getByText("Current Situation")).toBeVisible();
    await expect(page.getByText("Urgency Level")).toBeVisible();
  });

  test("navigation labels update per language", async ({ page }) => {
    // Spanish
    await page.goto("/es");
    const navEs = page.getByLabel("Progreso del formulario");
    await expect(navEs).toBeAttached();

    // English
    await page.goto("/en");
    const navEn = page.getByLabel("Form progress");
    await expect(navEn).toBeAttached();
  });
});
