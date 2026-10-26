import { chromium } from "playwright";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const pressDir = join(root, "public", "press");
const tempDir = join(tmpdir(), "el-clasico-press");
const photosDir = join(tempDir, "fotos");
await mkdir(pressDir, { recursive: true });
await mkdir(photosDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

/* ------------------------------------------------------------------ */
/* 1. Stage plot / technical rider — one page, print friendly          */
/* ------------------------------------------------------------------ */

const stagePlotHtml = String.raw`<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    width: 297mm; height: 210mm; padding: 11mm 13mm 9mm;
    background: #f4f2ec; color: #121212;
    font-family: "Helvetica Neue", Arial, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .top { display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 2px solid #121212; padding-bottom: 4mm; }
  .brand { font-family: "Arial Narrow", "Helvetica Neue", sans-serif; font-weight: 900; font-size: 38pt; line-height: .8; letter-spacing: -.01em; text-transform: uppercase; }
  .brand span { color: #d4113b; }
  .doc { text-align: right; }
  .doc h1 { margin: 0; font-family: "Arial Narrow", sans-serif; font-size: 16pt; letter-spacing: .06em; text-transform: uppercase; }
  .doc p { margin: 1.6mm 0 0; font-family: "Courier New", monospace; font-size: 6.6pt; letter-spacing: .14em; text-transform: uppercase; color: #5b5b5b; }
  .meta { display: flex; gap: 6mm; align-items: center; border-bottom: 1px solid #c9c6bc; padding: 2.6mm 0; font-family: "Courier New", monospace; font-size: 6.4pt; letter-spacing: .1em; text-transform: uppercase; color: #3c3c3c; }
  .meta b { color: #d4113b; font-weight: 700; }
  .grid { display: grid; grid-template-columns: 176mm 1fr; gap: 8mm; margin-top: 5mm; }
  .plot { border: 1px solid #121212; background: #fbfaf7; }
  .plot svg { display: block; width: 100%; height: auto; }
  .legend { display: flex; gap: 5mm; margin-top: 2.4mm; font-family: "Courier New", monospace; font-size: 6pt; letter-spacing: .08em; text-transform: uppercase; color: #4a4a4a; }
  .legend i { display: inline-block; width: 3mm; height: 3mm; border: 1px solid #d4113b; margin-right: 1.2mm; vertical-align: -.4mm; background: rgba(212,17,59,.08); }
  .legend i.amber { border-color: #b87700; background: rgba(184,119,0,.12); }
  .side h2 { margin: 0 0 2mm; font-family: "Arial Narrow", sans-serif; font-size: 13pt; letter-spacing: .05em; text-transform: uppercase; }
  .side h2:not(:first-child) { margin-top: 5mm; border-top: 1px solid #c9c6bc; padding-top: 3.4mm; }
  .side ol { list-style: none; counter-reset: item; margin: 0; padding: 0; }
  .side li { counter-increment: item; display: grid; grid-template-columns: 6mm 1fr; gap: 2mm; padding: 1.55mm 0; border-bottom: 1px solid #ddd9cf; }
  .side li::before { content: counter(item, decimal-leading-zero); font-family: "Courier New", monospace; font-size: 6.2pt; color: #d4113b; padding-top: .3mm; }
  .side li b { display: block; font-size: 7.2pt; letter-spacing: .03em; text-transform: uppercase; }
  .side li span { display: block; margin-top: .5mm; font-size: 6.4pt; line-height: 1.35; color: #4e4e4e; }
  .note { margin-top: 3mm; padding: 2.6mm 3mm; background: #121212; color: #f4f2ec; font-family: "Courier New", monospace; font-size: 6.2pt; line-height: 1.5; letter-spacing: .05em; text-transform: uppercase; }
  .note b { color: #f0a223; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4mm; padding-top: 2.6mm; border-top: 1px solid #c9c6bc; font-family: "Courier New", monospace; font-size: 6pt; letter-spacing: .1em; text-transform: uppercase; color: #5b5b5b; }
  .foot b { color: #121212; }
</style>
</head>
<body>
  <div class="top">
    <div class="brand">EL CLÁSICO<span>.</span></div>
    <div class="doc">
      <h1>Stage plot &amp; rider técnico</h1>
      <p>Gira 2026 · Argentina / Uruguay</p>
    </div>
  </div>

  <div class="meta">
    <span><b>FORMACIÓN</b> 5 MÚSICOS</span>
    <span><b>ESCENARIO MÍN.</b> 8 × 6 M</span>
    <span><b>DURACIÓN</b> 90 MIN</span>
    <span><b>CONTACTO</b> CONTACTO@ELCLASICO.COM</span>
  </div>

  <div class="grid">
    <div>
      <div class="plot">
        <svg viewBox="0 0 800 465" role="img" aria-label="Planta escénica">
          <defs>
            <pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" stroke="#121212" stroke-opacity=".055" />
            </pattern>
          </defs>
          <rect width="800" height="465" fill="#fbfaf7" />
          <rect width="800" height="465" fill="url(#g)" />
          <rect x="34" y="34" width="732" height="330" fill="none" stroke="#121212" stroke-width="1.4" />
          <text x="46" y="24" font-family="Courier New, monospace" font-size="8" letter-spacing="1.6" fill="#6a6a6a">FONDO / BACKLINE</text>
          <text x="754" y="24" text-anchor="end" font-family="Courier New, monospace" font-size="8" letter-spacing="1.6" fill="#6a6a6a">NO A ESCALA</text>

          <!-- backline -->
          <rect x="64" y="92" width="112" height="74" fill="rgba(212,17,59,.06)" stroke="#d4113b" stroke-width="1" />
          <text x="120" y="122" text-anchor="middle" font-family="Courier New, monospace" font-size="9" letter-spacing="1.2" fill="#121212">GUITARRA</text>
          <text x="120" y="138" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing="1" fill="#6a6a6a">AMP 4×12</text>
          <text x="120" y="152" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing="1" fill="#6a6a6a">SM57</text>

          <rect x="624" y="92" width="112" height="74" fill="rgba(212,17,59,.06)" stroke="#d4113b" stroke-width="1" />
          <text x="680" y="122" text-anchor="middle" font-family="Courier New, monospace" font-size="9" letter-spacing="1.2" fill="#121212">BAJO</text>
          <text x="680" y="138" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing="1" fill="#6a6a6a">AMP 8×10</text>
          <text x="680" y="152" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing="1" fill="#6a6a6a">DI + MIC</text>

          <rect x="316" y="66" width="168" height="118" fill="rgba(184,119,0,.07)" stroke="#b87700" stroke-width="1" />
          <text x="400" y="60" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing="1" fill="#8a5a00">RISER 3 × 2,5 M</text>
          <circle cx="400" cy="112" r="22" fill="none" stroke="#121212" stroke-width="1.2" />
          <circle cx="400" cy="112" r="15" fill="none" stroke="#121212" stroke-opacity=".5" stroke-width="1" />
          <text x="400" y="160" text-anchor="middle" font-family="Courier New, monospace" font-size="9" letter-spacing="1.2" fill="#121212">BATERÍA</text>
          <text x="400" y="174" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing="1" fill="#6a6a6a">KICK · SNARE · 3 TOMS</text>

          <!-- front line -->
          <rect x="352" y="268" width="96" height="42" fill="rgba(18,18,18,.04)" stroke="#121212" stroke-width="1" />
          <text x="400" y="286" text-anchor="middle" font-family="Courier New, monospace" font-size="9" letter-spacing="1.2" fill="#121212">VOZ</text>
          <text x="400" y="300" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing="1" fill="#6a6a6a">SM58</text>

          <rect x="210" y="276" width="58" height="26" fill="rgba(184,119,0,.12)" stroke="#b87700" stroke-width="1" />
          <text x="239" y="293" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing=".8" fill="#8a5a00">MIX 1</text>
          <rect x="532" y="276" width="58" height="26" fill="rgba(184,119,0,.12)" stroke="#b87700" stroke-width="1" />
          <text x="561" y="293" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing=".8" fill="#8a5a00">MIX 2</text>
          <rect x="184" y="318" width="58" height="26" fill="rgba(184,119,0,.12)" stroke="#b87700" stroke-width="1" />
          <text x="213" y="335" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing=".8" fill="#8a5a00">MIX 3</text>
          <rect x="558" y="318" width="58" height="26" fill="rgba(184,119,0,.12)" stroke="#b87700" stroke-width="1" />
          <text x="587" y="335" text-anchor="middle" font-family="Courier New, monospace" font-size="7" letter-spacing=".8" fill="#8a5a00">MIX 4</text>

          <!-- pa -->
          <rect x="10" y="110" width="14" height="180" fill="rgba(212,17,59,.09)" stroke="#d4113b" stroke-width="1" />
          <text x="24" y="330" font-family="Courier New, monospace" font-size="7" letter-spacing="1" fill="#d4113b">PA IZQ</text>
          <rect x="776" y="110" width="14" height="180" fill="rgba(212,17,59,.09)" stroke="#d4113b" stroke-width="1" />
          <text x="752" y="330" text-anchor="end" font-family="Courier New, monospace" font-size="7" letter-spacing="1" fill="#d4113b">PA DER</text>

          <!-- audience -->
          <line x1="34" y1="382" x2="766" y2="382" stroke="#121212" stroke-opacity=".35" stroke-dasharray="5 5" />
          <text x="400" y="404" text-anchor="middle" font-family="Courier New, monospace" font-size="8" letter-spacing="4" fill="#6a6a6a">PÚBLICO</text>
          <path d="M380 424h40M400 414v20M391 427l9 9 9-9" stroke="#6a6a6a" stroke-width="1" fill="none" />
        </svg>
      </div>
      <div class="legend"><span><i></i> BACKLINE / PA</span><span><i class="amber"></i> MONITOREO / RISER</span><span>ESCENARIO: 8 × 6 M MÍNIMO</span></div>
    </div>

    <div class="side">
      <h2>Canales / monitoreo</h2>
      <ol>
        <li><div><b>Kick</b><span>Beta 52 · canal 1</span></div></li>
        <li><div><b>Snare</b><span>SM57 · canal 2</span></div></li>
        <li><div><b>Hi-hat / overhead</b><span>Condensador · canales 3—4</span></div></li>
        <li><div><b>Bajo</b><span>DI + mic amp · canal 5</span></div></li>
        <li><div><b>Guitarra</b><span>SM57 · canal 6</span></div></li>
        <li><div><b>Voz principal</b><span>SM58 · canal 7</span></div></li>
        <li><div><b>Coros</b><span>2 × SM58 · canales 8—9</span></div></li>
      </ol>

      <h2>Requerimientos</h2>
      <ol>
        <li><div><b>PA</b><span>Line array o punto por punto según venue.</span></div></li>
        <li><div><b>Monitoreo</b><span>4 mezclas independientes. Cuñas o in-ear.</span></div></li>
        <li><div><b>Backline</b><span>Batería completa, amplis de guitarra y bajo.</span></div></li>
        <li><div><b>Iluminación</b><span>Contraluces rojo y ámbar sobre backline.</span></div></li>
      </ol>

      <div class="note"><b>IMPORTANTE</b> — Enviar rider completo y planta aprobada a producción con 15 días de anticipación. Prueba de sonido: 2 horas.</div>
    </div>
  </div>

  <div class="foot">
    <span><b>EL CLÁSICO</b> · GUALEGUAYCHÚ · ENTRE RÍOS · ARGENTINA</span>
    <span>CONTACTO@ELCLASICO.COM · +54 9 3446 123456</span>
    <span>PLANTA 01 / 01</span>
  </div>
</body>
</html>`;

const printPage = await browser.newPage();
await printPage.setContent(stagePlotHtml, { waitUntil: "load" });
await printPage.evaluate(() => document.fonts.ready);
await printPage.pdf({
  path: join(pressDir, "el-clasico-stage-plot.pdf"),
  format: "A4",
  landscape: true,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await printPage.close();

/* ------------------------------------------------------------------ */
/* 2. Press photos — high-resolution renders of the gallery art        */
/* ------------------------------------------------------------------ */

const photos = [
  { index: 0, name: "01-guitarra" },
  { index: 1, name: "02-banda" },
  { index: 2, name: "03-bateria" },
  { index: 3, name: "04-vocalista" },
];

const captureContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1.5,
});
const capturePage = await captureContext.newPage();
await capturePage.goto("http://localhost:3000", { waitUntil: "networkidle" });
await capturePage.evaluate(() => document.fonts.ready);
await capturePage.locator("#fotos").scrollIntoViewIfNeeded();
await capturePage.waitForTimeout(900);

for (const photo of photos) {
  const rect = await capturePage.evaluate((index) => {
    const button = document.querySelectorAll("#fotos button[aria-label^='Ampliar foto']")[index];
    const scene = button?.querySelector(".relative.isolate.overflow-hidden");
    if (!scene) return null;
    const old = document.getElementById("press-capture");
    old?.remove();
    const stage = document.createElement("div");
    stage.id = "press-capture";
    stage.style.cssText =
      "position:fixed;left:0;top:0;width:1600px;height:2000px;z-index:99999;overflow:hidden;background:#070707;";
    const clone = scene.cloneNode(true);
    clone.style.width = "1600px";
    clone.style.height = "2000px";
    stage.appendChild(clone);
    document.body.appendChild(stage);
    document.documentElement.style.overflow = "hidden";
    return { width: 1600, height: 2000 };
  }, photo.index);

  if (!rect) throw new Error(`Gallery scene ${photo.index} not found`);
  await capturePage.waitForTimeout(250);
  await capturePage
    .locator("#press-capture")
    .screenshot({ path: join(photosDir, `${photo.name}.jpg`), type: "jpeg", quality: 90 });
  await capturePage.evaluate(() => {
    document.getElementById("press-capture")?.remove();
    document.documentElement.style.overflow = "";
  });
}

await captureContext.close();

await writeFile(
  join(photosDir, "LEEME.txt"),
  `EL CLÁSICO — FOTOS DE PRENSA / GIRA 2026
=========================================

Contenido:
  01-guitarra.jpg     Guitarra y humo — soundcheck
  02-banda.jpg        La banda en el Centro Cultural — 2025
  03-bateria.jpg      La batería marca el pulso
  04-vocalista.jpg    Voz y silencio — antes de salir

Formato: JPEG, 2400 × 3000 px, perfil sRGB.
Crédito obligatorio: "Foto: El Clásico / Archivo de prensa".

NOTA: esta es una versión de muestra del sitio. Las imágenes son arte
promocional generado para el lanzamiento. Reemplazar por fotografía
oficial de la banda antes de publicar el press kit definitivo.

Contacto: prensa@elclasico.com
`,
  "utf8",
);

/* ------------------------------------------------------------------ */
/* 3. ZIP packaging                                                    */
/* ------------------------------------------------------------------ */

const zipPhotos = join(pressDir, "el-clasico-fotos.zip");
const zipEpk = join(pressDir, "el-clasico-epk.zip");
await rm(zipPhotos, { force: true });
await rm(zipEpk, { force: true });

const { execFileSync } = await import("node:child_process");
const ps = (script) =>
  execFileSync("powershell.exe", ["-NoProfile", "-Command", script], {
    stdio: "inherit",
  });

ps(
  `Compress-Archive -Path '${photosDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipPhotos.replace(/'/g, "''")}' -CompressionLevel Optimal`,
);

await writeFile(
  join(tempDir, "LEEME.txt"),
  `EL CLÁSICO — EPK / DOSSIER DE PRENSA
====================================

Bio completa .............. el-clasico-bio.pdf
Rider técnico ............. el-clasico-rider.pdf
Planta escénica ........... el-clasico-stage-plot.pdf
Fotos de prensa ........... el-clasico-fotos.zip

FICHA ARTÍSTICA
  Origen: Gualeguaychú, Entre Ríos, Argentina
  Activos desde: 2018
  Género: rock clásico / moderno
  Formación: 5 músicos
  Último lanzamiento: Fuego Interior (2025)

DISCO — FUEGO INTERIOR (2025)
  01. Fuego Interior       4:12
  02. Calles de Asfalto    3:45
  03. Sin Retorno          5:01
  04. La Hermandad         4:33
  05. Despertar            3:58
  06. Último Round         4:47

CONTACTO
  Prensa: prensa@elclasico.com
  Contrataciones: contacto@elclasico.com
  WhatsApp: +54 9 3446 123456

Todo el material puede usarse libremente con crédito a El Clásico.
`,
  "utf8",
);

ps(
  `Compress-Archive -Path '${join(pressDir, "el-clasico-bio.pdf").replace(/'/g, "''")}','${join(pressDir, "el-clasico-rider.pdf").replace(/'/g, "''")}','${join(pressDir, "el-clasico-stage-plot.pdf").replace(/'/g, "''")}','${join(tempDir, "LEEME.txt").replace(/'/g, "''")}' -DestinationPath '${zipEpk.replace(/'/g, "''")}' -CompressionLevel Optimal`,
);

await browser.close();

console.log(
  JSON.stringify(
    {
      stagePlot: join(pressDir, "el-clasico-stage-plot.pdf"),
      photosZip: zipPhotos,
      epkZip: zipEpk,
    },
    null,
    2,
  ),
);
