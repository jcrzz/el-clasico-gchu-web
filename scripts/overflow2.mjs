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
  const out = [];
  const main = document.querySelector("main");
  const sections = [...(main?.children ?? [])];
  for (const el of sections) {
    const prev = el.style.display;
    el.style.display = "none";
    out.push({
      tag: el.tagName,
      id: el.id,
      cls: el.className?.toString().slice(0, 60),
      scrollW: document.documentElement.scrollWidth,
      innerWidth,
    });
    el.style.display = prev;
  }
  // also test all body children
  const bodyOut = [];
  for (const el of [...document.body.children]) {
    const prev = el.style.display;
    el.style.display = "none";
    bodyOut.push({
      tag: el.tagName,
      id: el.id,
      cls: el.className?.toString().slice(0, 60),
      scrollW: document.documentElement.scrollWidth,
    });
    el.style.display = prev;
  }
  return { sections: out, body: bodyOut };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
