import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const widths = [320, 360, 390, 414, 768, 834, 1024, 1280, 1440, 1920, 2560];
const report = [];

for (const width of widths) {
  const mobile = width < 500;
  const ctx = await browser.newContext({
    viewport: { width, height: mobile ? 844 : 1000 },
    deviceScaleFactor: 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const layout = await page.evaluate(() => {
    const doc = document.documentElement;
    const clipped = (el) => {
      let p = el;
      while (p && p !== doc) {
        const cs = getComputedStyle(p);
        if (/hidden|clip|scroll|auto/.test(cs.overflowX)) return true;
        p = p.parentElement;
      }
      return false;
    };
    const textOffenders = [];
    for (const el of document.querySelectorAll("body *")) {
      if (el.closest("svg")) continue;
      if (!el.textContent?.trim()) continue;
      if (el.children.length > 0) continue;
      if (el.scrollWidth > el.clientWidth + 1 && !clipped(el)) {
        textOffenders.push({
          tag: el.tagName,
          text: el.textContent.trim().slice(0, 40),
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
        });
      }
    }
    return {
      scrollW: doc.scrollWidth,
      clientW: doc.clientWidth,
      innerW: innerWidth,
      textOffenders: textOffenders.slice(0, 10),
      heroH: document.querySelector("#inicio")?.getBoundingClientRect().height,
      bodyH: document.body.scrollHeight,
    };
  });

  let menu = null;
  if (mobile) {
    const trigger = page.getByRole("button", { name: /Abrir menú/ });
    await trigger.click();
    await page.waitForTimeout(450);
    menu = await page.evaluate(() => {
      const dialog = document.querySelector("#mobile-menu");
      return {
        open: Boolean(dialog),
        links: dialog?.querySelectorAll("nav a").length ?? 0,
        bodyOverflow: document.body.style.overflow,
      };
    });
    await page.getByRole("button", { name: /Cerrar menú/ }).click();
    await page.waitForTimeout(400);
    menu.closed = await page.evaluate(() => !document.querySelector("#mobile-menu"));
  }

  report.push({ width, ...layout, menu, errors });
  await ctx.close();
}

console.log(JSON.stringify(report, null, 2));
await browser.close();
