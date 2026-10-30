import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const out = ".screens";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];

/**
 * Element screenshots of tall sections are stitched by Playwright, so the
 * fixed header can land in the middle of the image. Hide it while capturing a
 * section, then restore it for viewport screenshots and interactions.
 */
async function captureSection(target, id, name) {
  const section = target.locator(`#${id}`);
  await section.scrollIntoViewIfNeeded();
  await target.waitForTimeout(700);
  await target.evaluate(() => {
    const header = document.querySelector("body > header");
    if (header instanceof HTMLElement) header.style.visibility = "hidden";
  });
  await section.screenshot({ path: `${out}/${name}.png` });
  await target.evaluate(() => {
    const header = document.querySelector("body > header");
    if (header instanceof HTMLElement) header.style.visibility = "";
  });
}

const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await desktop.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2600);
await page.screenshot({ path: `${out}/01-hero.png` });

for (const [id, name] of [
  ["historia", "02-history"],
  ["la-hermandad", "03-hermandad"],
  ["apoyar", "03b-support"],
  ["musica", "04-music"],
  ["shows", "05-shows"],
  ["fotos", "06-gallery"],
  ["epk", "07-epk"],
  ["contacto", "08-contact"],
]) {
  await captureSection(page, id, name);
}

const footer = page.getByRole("contentinfo");
await footer.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.evaluate(() => {
  const header = document.querySelector("body > header");
  if (header instanceof HTMLElement) header.style.visibility = "hidden";
});
await footer.screenshot({ path: `${out}/09-footer.png` });
await page.evaluate(() => {
  const header = document.querySelector("body > header");
  if (header instanceof HTMLElement) header.style.visibility = "";
});

// Interactions: discography selector
await page.locator("#musica").scrollIntoViewIfNeeded();
await page.getByRole("tab", { name: /Que Se Pudra/i }).click();
await page.waitForTimeout(600);
await page.locator("#musica").screenshot({ path: `${out}/10-music-selected.png` });

// Shows filter
await page.locator("#shows").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: /URUGUAY/ }).click();
await page.waitForTimeout(600);
await page.locator("#shows").screenshot({ path: `${out}/11-shows-uruguay.png` });

// Support: free amount + QR modal (el QR sólo existe si hay imagen cargada)
await page.locator("#apoyar").scrollIntoViewIfNeeded();
await page.getByLabel("Monto libre en pesos argentinos").fill("12000");
await page.waitForTimeout(500);
await page.locator("#apoyar").screenshot({ path: `${out}/15-support-free.png` });

const qrTrigger = page.getByRole("button", { name: /VER QR EN GRANDE/i });
if (await qrTrigger.count()) {
  await qrTrigger.first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${out}/16-support-qr.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
}

// Gallery lightbox
await page.locator("#fotos").scrollIntoViewIfNeeded();
await page.locator("#fotos button[aria-label^='Ampliar foto']").first().click();
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/12-lightbox.png` });
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/13-lightbox-next.png` });
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// Contact form validation
await page.locator("#contacto").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: /Enviar mensaje/ }).click();
await page.waitForTimeout(400);
await page.locator("#contacto").screenshot({ path: `${out}/14-contact-validation.png` });

// Mobile
const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const m = await mobile.newPage();
m.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`mobile console: ${msg.text()}`);
});
m.on("pageerror", (err) => errors.push(`mobile pageerror: ${err.message}`));
await m.goto("http://localhost:3000", { waitUntil: "networkidle" });
await m.evaluate(() => document.fonts.ready);
await m.waitForTimeout(2400);
await m.screenshot({ path: `${out}/20-mobile-hero.png` });

for (const [id, name] of [
  ["historia", "21-mobile-history"],
  ["apoyar", "21b-mobile-support"],
  ["musica", "22-mobile-music"],
  ["shows", "23-mobile-shows"],
  ["fotos", "24-mobile-gallery"],
  ["epk", "25-mobile-epk"],
  ["contacto", "26-mobile-contact"],
]) {
  await captureSection(m, id, name);
}

await m.locator("#inicio").scrollIntoViewIfNeeded();
await m.getByRole("button", { name: /Abrir menú/ }).click();
await m.waitForTimeout(700);
await m.screenshot({ path: `${out}/27-mobile-menu.png` });

console.log(JSON.stringify({ errors }, null, 2));
await browser.close();
