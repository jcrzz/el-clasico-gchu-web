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
await page.waitForTimeout(1200);
const data = await page.evaluate(() => {
  const limit = document.documentElement.clientWidth;
  const offenders = [];
  for (const el of document.querySelectorAll("body *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > limit + 1 || r.left < -1) {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" && cs.visibility === "hidden") continue;
      offenders.push({
        tag: el.tagName,
        cls: el.className?.toString().slice(0, 120),
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        pos: cs.position,
        overflowX: cs.overflowX,
      });
    }
  }
  return {
    docW: document.documentElement.clientWidth,
    scrollW: document.documentElement.scrollWidth,
    innerWidth,
    offenders: offenders.slice(0, 40),
    count: offenders.length,
  };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
