import { chromium } from "playwright";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1400, height: 900 },
  deviceScaleFactor: 1,
});
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);

const buildPoster = async (width, height, kind) => {
  await page.evaluate(
    ({ width, height, kind }) => {
      document.getElementById("og-stage")?.remove();

      const stage = document.createElement("div");
      stage.id = "og-stage";
      stage.style.cssText = `position:fixed;left:0;top:0;width:${width}px;height:${height}px;z-index:99999;overflow:hidden;background:#070707;color:#f4f4f5;`;

      if (kind === "og") {
        const hero = document.querySelector("#inicio .relative.isolate.overflow-hidden");
        if (hero) {
          const clone = hero.cloneNode(true);
          clone.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:.72;";
          stage.appendChild(clone);
        }

        const shade = document.createElement("div");
        shade.style.cssText =
          "position:absolute;inset:0;background:linear-gradient(90deg,rgba(7,7,7,.94) 0%,rgba(7,7,7,.72) 48%,rgba(7,7,7,.3) 100%),linear-gradient(0deg,rgba(7,7,7,.95) 0%,transparent 42%);";
        stage.appendChild(shade);

        const grain = document.createElement("div");
        grain.className = "scene-grain";
        grain.style.cssText = "position:absolute;inset:0;opacity:.35;pointer-events:none;";
        stage.appendChild(grain);

        const frame = document.createElement("div");
        frame.style.cssText = `position:absolute;inset:30px;border:1px solid rgba(244,244,245,.24);`;
        stage.appendChild(frame);

        const mark = (x, y) => {
          const el = document.createElement("div");
          el.style.cssText = `position:absolute;${x};${y};width:22px;height:22px;`;
          el.innerHTML =
            '<span style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(244,244,245,.55)"></span><span style="position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(244,244,245,.55)"></span>';
          stage.appendChild(el);
        };
        mark("left:20px", "top:20px");
        mark("right:20px", "top:20px");
        mark("left:20px", "bottom:20px");
        mark("right:20px", "bottom:20px");

        const content = document.createElement("div");
        content.style.cssText =
          "position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:58px 64px 54px;";
        content.innerHTML = `
          <div style="display:flex;align-items:flex-end;justify-content:space-between;border-bottom:1px solid rgba(244,244,245,.22);padding-bottom:18px;">
            <div style="font-family:var(--font-poster),sans-serif;font-weight:800;font-size:46px;line-height:.8;letter-spacing:-.01em;text-transform:uppercase;">
              EL CLÁSICO<span style="color:#e11d48">.</span>
            </div>
            <div style="font-family:var(--font-jetbrains),monospace;font-size:12px;letter-spacing:.24em;color:#b7b7bc;text-transform:uppercase;">
              GUALEGUAYCHÚ · ENTRE RÍOS · AR
            </div>
          </div>

          <div style="position:relative;">
            <div aria-hidden="true" style="position:absolute;left:5px;top:4px;font-family:var(--font-poster),sans-serif;font-weight:800;font-size:132px;line-height:.8;letter-spacing:-.012em;text-transform:uppercase;color:#e11d48;opacity:.85;white-space:nowrap;">
              DONDE EL ROCK<br/>SE VIVE
            </div>
            <div style="position:relative;font-family:var(--font-poster),sans-serif;font-weight:800;font-size:132px;line-height:.8;letter-spacing:-.012em;text-transform:uppercase;color:#f4f4f5;white-space:nowrap;">
              DONDE EL ROCK<br/>SE VIVE
            </div>
          </div>

          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:24px;">
            <div style="font-family:var(--font-jetbrains),monospace;font-size:12px;line-height:1.8;letter-spacing:.2em;text-transform:uppercase;">
              <span style="color:#f59e0b">FUEGO INTERIOR</span><br/>
              <span style="color:#8b8b90">NUEVO DISCO · 2025</span>
            </div>
            <div style="font-family:var(--font-jetbrains),monospace;font-size:12px;line-height:1.8;letter-spacing:.2em;text-transform:uppercase;text-align:center;">
              <span style="color:#f4f4f5">GIRA 2026</span><br/>
              <span style="color:#8b8b90">ARGENTINA + URUGUAY</span>
            </div>
            <div style="font-family:var(--font-jetbrains),monospace;font-size:12px;line-height:1.8;letter-spacing:.2em;text-transform:uppercase;text-align:right;">
              <span style="color:#f4f4f5">ELCLASICO.COM.AR</span><br/>
              <span style="color:#e11d48">ROCK DE ACÁ</span>
            </div>
          </div>`;
        stage.appendChild(content);
      } else {
        stage.style.background = "#070707";
        stage.style.display = "grid";
        stage.style.placeItems = "center";
        stage.style.border = "10px solid #070707";
        stage.innerHTML = `
          <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,rgba(225,29,72,.35),transparent 70%)"></div>
          <div style="position:absolute;inset:14px;border:1px solid rgba(244,244,245,.25)"></div>
          <div style="position:relative;font-family:var(--font-poster),sans-serif;font-weight:800;font-size:92px;line-height:.8;letter-spacing:-.01em;color:#f4f4f5;text-transform:uppercase;text-align:center;">
            EC<span style="color:#e11d48">.</span>
          </div>`;
      }

      document.body.appendChild(stage);
      document.documentElement.style.overflow = "hidden";
    },
    { width, height, kind },
  );
  await page.waitForTimeout(350);
  return page.locator("#og-stage");
};

const og = await buildPoster(1200, 630, "og");
await og.screenshot({ path: resolve(root, "public/og-el-clasico.png") });

const icon = await buildPoster(180, 180, "icon");
await icon.screenshot({ path: resolve(root, "app/apple-icon.png") });

await page.evaluate(() => {
  document.getElementById("og-stage")?.remove();
  document.documentElement.style.overflow = "";
});

await browser.close();
console.log("OK");
