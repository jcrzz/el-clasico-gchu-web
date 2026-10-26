import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
const links = await page.evaluate(() =>
  [...document.querySelectorAll("a[href]")].map((a) => ({
    text: a.textContent?.trim().replace(/\s+/g, " ").slice(0, 60),
    href: a.getAttribute("href"),
  })),
);
const unique = [...new Map(links.map((l) => [l.href, l])).values()];
const local = unique.filter((l) => l.href?.startsWith("/"));
const results = [];
for (const l of local) {
  const res = await page.request.get(`http://localhost:3000${l.href}`);
  results.push({ ...l, status: res.status() });
}
console.log(JSON.stringify({ total: unique.length, local: results }, null, 2));
await browser.close();
