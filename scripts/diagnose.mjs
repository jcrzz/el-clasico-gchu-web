import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const data = await page.evaluate(() => {
  const btn = document.querySelector('[aria-label="Abrir menú de navegación"]');
  if (!btn) return { error: "no button" };
  const r = btn.getBoundingClientRect();
  const cx = r.x + r.width / 2;
  const cy = r.y + r.height / 2;
  const hit = document.elementFromPoint(cx, cy);
  const styles = getComputedStyle(btn);
  const stack = [];
  let el = hit;
  while (el && stack.length < 6) {
    stack.push(`${el.tagName}.${el.className?.toString().slice(0, 80)}`);
    el = el.parentElement;
  }
  return {
    scrollY: window.scrollY,
    rect: { x: r.x, y: r.y, w: r.width, h: r.height },
    point: { cx, cy },
    hit: `${hit?.tagName}.${hit?.className?.toString().slice(0, 80)}`,
    stack,
    pointerEvents: styles.pointerEvents,
    dpr: window.devicePixelRatio,
    innerWidth: window.innerWidth,
  };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
