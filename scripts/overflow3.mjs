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
  const sections = [...document.querySelectorAll("main > section")];
  sections.forEach((el) => (el.style.display = "none"));
  const base = document.documentElement.scrollWidth;
  const results = [];
  for (const el of sections) {
    el.style.display = "";
    results.push({
      id: el.id,
      scrollW: document.documentElement.scrollWidth,
      innerWidth,
      bodyW: document.body.getBoundingClientRect().width,
    });
    el.style.display = "none";
  }
  sections.forEach((el) => (el.style.display = ""));
  return { base, results };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
