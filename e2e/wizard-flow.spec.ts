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

test.describe("Wizard full flow — Spanish", () => {
  test("completes all 4 phases and submits", async ({ page }) => {
    await page.goto("/es");

    // TRIAGE phase
    await expect(page.getByText("Triage de Emergencia Técnica")).toBeVisible();

    // Select client profile and urgency
    await page.getByText("Particular afectado directamente").click();
    await page.getByText("Consulta informativa / preventiva").click();

    // Proceed to COGNITIVE
    await page.getByText("Siguiente Paso: Evaluación de Contexto").click();

    // COGNITIVE phase
    await expect(page.getByText("Evaluación de Estabilidad")).toBeVisible();

    await page.getByText("Siguiente Paso: Contexto").click();

    // CONTEXT phase
    await expect(page.getByText("Contexto del Incidente")).toBeVisible();

    await page.getByText("Siguiente Paso: Detalles").click();

    // DETAILS phase
    await expect(page.getByText("Detalles del Incidente")).toBeVisible();

    // Select incident type
    await page.getByText("Acoso / hostigamiento").click();
    // Select device count
    await page.getByText("1 dispositivo").click();
    // Select objective
    await page.getByText("Documentar / preservar pruebas").click();

    // Submit
    await page.getByText("Finalizar Informe Triage").click();
  });

  test("navigates back through all phases", async ({ page }) => {
    await page.goto("/es");

    // TRIAGE → COGNITIVE
    await page.getByText("Particular afectado directamente").click();
    await page.getByText("Consulta informativa / preventiva").click();
    await page.getByText("Siguiente Paso: Evaluación de Contexto").click();

    // COGNITIVE → CONTEXT
    await page.getByText("Siguiente Paso: Contexto").click();

    // CONTEXT → DETAILS
    await page.getByText("Siguiente Paso: Detalles").click();

    // DETAILS back → CONTEXT
    await page.getByRole("button", { name: "Volver" }).click();
    await expect(page.getByText("Contexto del Incidente")).toBeVisible();

    // CONTEXT back → COGNITIVE
    await page.getByRole("button", { name: "Volver" }).click();
    await expect(page.getByText("Evaluación de Estabilidad")).toBeVisible();

    // COGNITIVE back → TRIAGE
    await page.getByRole("button", { name: "Volver" }).click();
    await expect(page.getByText("Triage de Emergencia Técnica")).toBeVisible();
  });
});

test.describe("Wizard full flow — English", () => {
  test("completes all 4 phases and submits in English", async ({ page }) => {
    await page.goto("/en");

    // TRIAGE phase
    await expect(page.getByText("Technical Emergency Triage")).toBeVisible();

    await page.getByText("Directly affected individual").click();
    await page.getByText("Informational / preventive inquiry").click();
    await page.getByText("Next Step: Context Assessment").click();

    // COGNITIVE phase
    await expect(page.getByText("Stability Assessment")).toBeVisible();
    await page.getByText("Next Step: Context").click();

    // CONTEXT phase
    await expect(page.getByText("Incident Context")).toBeVisible();
    await page.getByText("Next Step: Details").click();

    // DETAILS phase
    await expect(page.getByText("Incident Details")).toBeVisible();
    await page.getByText("Harassment").click();
    await page.getByText("1 device").click();
    await page.getByText("Document / preserve evidence").click();

    // Submit
    await page.getByText("Finalize Triage Report").click();
  });
});
