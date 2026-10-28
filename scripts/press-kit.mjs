import { chromium } from "playwright";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const pressDir = join(root, "public", "press");
const tempDir = join(tmpdir(), "el-clasico-press");
const photosDir = join(tempDir, "fotos");
await rm(tempDir, { recursive: true, force: true });
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
/* 1b. Bio / dossier — two A4 pages, print friendly                    */
/* ------------------------------------------------------------------ */

const bioHtml = String.raw`<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<style>
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: #f4f2ec; color: #121212;
    font-family: "Helvetica Neue", Arial, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page {
    position: relative; width: 210mm; height: 296.8mm; padding: 13mm 15mm 11mm;
    display: flex; flex-direction: column; overflow: hidden;
    break-after: page;
  }
  .page:last-child { break-after: auto; }
  .page::before {
    content: ""; position: absolute; top: 0; bottom: 0; left: 7mm;
    width: 1px; background: rgba(18,18,18,.12);
  }
  .top { display: flex; align-items: flex-end; justify-content: space-between; gap: 8mm; border-bottom: 2px solid #121212; padding-bottom: 3.4mm; }
  .brand { font-family: "Arial Narrow", "Helvetica Neue", sans-serif; font-weight: 900; font-size: 30pt; line-height: .8; letter-spacing: -.01em; text-transform: uppercase; }
  .brand span { color: #d4113b; }
  .doc { text-align: right; }
  .doc h1 { margin: 0; font-family: "Arial Narrow", sans-serif; font-size: 13pt; letter-spacing: .07em; text-transform: uppercase; }
  .doc p { margin: 1.4mm 0 0; font-family: "Courier New", monospace; font-size: 6.2pt; letter-spacing: .16em; text-transform: uppercase; color: #5b5b5b; }

  .kicker { margin-top: 9mm; font-family: "Courier New", monospace; font-size: 6.4pt; letter-spacing: .2em; text-transform: uppercase; color: #5b5b5b; }
  .headline { margin-top: 4mm; font-family: "Arial Narrow", "Helvetica Neue", sans-serif; font-weight: 900; font-size: 45pt; line-height: .84; letter-spacing: -.015em; text-transform: uppercase; }
  .headline em { font-style: normal; color: #d4113b; }
  .hero { display: grid; grid-template-columns: 1fr 52mm; gap: 8mm; align-items: end; margin-top: 4mm; padding-bottom: 4mm; border-bottom: 1px solid #c9c6bc; }
  .hero .meta { display: flex; flex-direction: column; gap: 1.4mm; font-family: "Courier New", monospace; font-size: 6pt; letter-spacing: .1em; text-transform: uppercase; color: #3c3c3c; }
  .hero .meta b { color: #d4113b; font-weight: 700; }

  .lede { margin: 6mm 0 0; max-width: 160mm; font-size: 11pt; line-height: 1.4; letter-spacing: -.005em; }
  .bio { margin-top: 5mm; columns: 2; column-gap: 8mm; column-rule: 1px solid #ddd9cf; }
  .bio p { margin: 0 0 3.2mm; font-size: 8.3pt; line-height: 1.55; color: #2e2e2e; text-align: justify; }
  .bio p:first-child::first-letter { float: left; margin: .4mm 1.6mm 0 0; font-family: "Arial Narrow", sans-serif; font-weight: 900; font-size: 30pt; line-height: .8; color: #d4113b; }

  .facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; margin-top: auto; border-top: 1px solid #121212; border-left: 1px solid #ddd9cf; }
  .fact { padding: 3mm 3mm 2.6mm; border-right: 1px solid #ddd9cf; border-bottom: 1px solid #ddd9cf; }
  .fact span { display: block; font-family: "Courier New", monospace; font-size: 5.6pt; letter-spacing: .16em; text-transform: uppercase; color: #d4113b; }
  .fact b { display: block; margin-top: 1.4mm; font-family: "Arial Narrow", sans-serif; font-size: 10.5pt; letter-spacing: .02em; text-transform: uppercase; }

  .foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 6mm; margin-top: 4mm; padding-top: 3mm; border-top: 1px solid #c9c6bc; font-family: "Courier New", monospace; font-size: 5.8pt; letter-spacing: .12em; text-transform: uppercase; color: #5b5b5b; }
  .foot b { color: #121212; }

  .section-title { margin: 10mm 0 0; font-family: "Arial Narrow", sans-serif; font-weight: 900; font-size: 36pt; line-height: .86; letter-spacing: -.01em; text-transform: uppercase; }
  .section-title span { color: #d4113b; }
  .section-sub { margin: 3.4mm 0 0; max-width: 150mm; font-size: 8.6pt; line-height: 1.5; color: #3c3c3c; }

  .albums { margin-top: 7mm; border-top: 2px solid #121212; }
  .album { display: grid; grid-template-columns: 16mm 1fr 42mm; gap: 4mm; align-items: center; padding: 4.1mm 0 3.9mm; border-bottom: 1px solid #ccc8be; }
  .album .num { font-family: "Arial Narrow", sans-serif; font-weight: 900; font-size: 20pt; line-height: .8; color: #d4113b; }
  .album h3 { margin: 0; font-family: "Arial Narrow", sans-serif; font-size: 16pt; font-weight: 700; line-height: .95; letter-spacing: .01em; text-transform: uppercase; }
  .album p { margin: 1.2mm 0 0; font-family: "Courier New", monospace; font-size: 5.8pt; letter-spacing: .14em; text-transform: uppercase; color: #6a6a6a; }
  .album .status { text-align: right; font-family: "Courier New", monospace; font-size: 6pt; letter-spacing: .12em; text-transform: uppercase; color: #3c3c3c; }
  .album .status b { display: block; font-size: 6.6pt; color: #121212; }
  .album.pending .num, .album.pending .status b { color: #b87700; }
  .album.pending h3 { color: #3c3c3c; }

  .live { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin-top: 9mm; padding: 4.4mm 0; border-top: 1px solid #121212; border-bottom: 1px solid #c9c6bc; }
  .live div { font-family: "Courier New", monospace; font-size: 5.8pt; letter-spacing: .14em; text-transform: uppercase; color: #6a6a6a; }
  .live b { display: block; margin-top: 1.4mm; font-family: "Arial Narrow", sans-serif; font-size: 13pt; letter-spacing: .02em; color: #121212; }

  .contact { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 9mm; }
  .contact h4 { margin: 0 0 2.4mm; font-family: "Courier New", monospace; font-size: 6pt; letter-spacing: .18em; text-transform: uppercase; color: #d4113b; }
  .contact p { margin: 0; font-family: "Arial Narrow", sans-serif; font-size: 11pt; line-height: 1.45; text-transform: uppercase; }
  .contact small { display: block; margin-top: 1.6mm; font-family: "Courier New", monospace; font-size: 5.8pt; letter-spacing: .12em; text-transform: uppercase; color: #6a6a6a; }
  .stamp { margin-top: 10mm; padding: 3.4mm 4mm; background: #121212; color: #f4f2ec; font-family: "Courier New", monospace; font-size: 6.2pt; line-height: 1.55; letter-spacing: .1em; text-transform: uppercase; }
  .stamp b { color: #f0a223; }

  .outro { display: flex; align-items: flex-end; justify-content: space-between; gap: 8mm; margin-top: 11mm; padding-top: 4mm; border-top: 2px solid #121212; }
  .outro span { font-family: "Courier New", monospace; font-size: 6.2pt; letter-spacing: .18em; text-transform: uppercase; color: #5b5b5b; }
  .outro p { margin: 0; font-family: "Arial Narrow", sans-serif; font-weight: 900; font-size: 27pt; line-height: .86; letter-spacing: -.01em; text-transform: uppercase; text-align: right; }
  .outro em { font-style: normal; color: #d4113b; }
  .page:last-child .foot { margin-top: auto; }
</style>
</head>
<body>
  <section class="page">
    <div class="top">
      <div class="brand">EL CLÁSICO<span>.</span></div>
      <div class="doc"><h1>Press kit / 2026</h1><p>Biografía oficial</p></div>
    </div>

    <p class="kicker">Rock desde Gualeguaychú · Entre Ríos · Argentina</p>

    <div class="hero">
      <div class="headline">Rock de <em>acá.</em><br>Hecho para<br>arder.</div>
      <div class="meta">
        <span><b>Formación</b> 5 músicos</span>
        <span><b>Activos desde</b> 2018</span>
        <span><b>Gira</b> Argentina + Uruguay</span>
        <span><b>Discografía</b> 5 discos · 40 canciones</span>
      </div>
    </div>

    <p class="lede">Rock de Gualeguaychú para toda la región. Guitarras de filo clásico, pulso moderno y una comunidad que crece en cada show.</p>

    <div class="bio">
      <p>El Clásico nació en 2018 en Gualeguaychú, Entre Ríos, con una idea simple y obstinada: devolverle al rock el volumen, la mística y las ganas de cantar hasta quedarse sin voz. La banda construyó su sonido entre guitarras de filo clásico, ritmos modernos y letras que hablan de calles de provincia, noches largas y fuegos que no se apagan.</p>
      <p>Desde los primeros shows en clubes y centros culturales hasta la gira que hoy recorre Argentina y Uruguay, El Clásico convirtió cada presentación en un ritual compartido. Ese vínculo tiene nombre propio: La Hermandad, la comunidad de fans que creció show tras show y que hoy es parte inseparable del proyecto.</p>
      <p>A lo largo de cinco discos, El Clásico condensó su identidad: rock directo, estribillos para cantar en vivo y una producción que respeta la crudeza del escenario. El próximo capítulo se escribe en vivo.</p>
    </div>

    <div class="facts">
      <div class="fact"><span>Origen</span><b>Gualeguaychú,<br>Entre Ríos</b></div>
      <div class="fact"><span>Activos desde</span><b>2018</b></div>
      <div class="fact"><span>Género</span><b>Rock clásico<br>/ moderno</b></div>
      <div class="fact"><span>Discografía</span><b>5 discos</b></div>
      <div class="fact"><span>Zona de gira</span><b>Argentina<br>y Uruguay</b></div>
      <div class="fact"><span>Contacto</span><b>contacto@<br>elclasico.com</b></div>
    </div>

    <div class="foot">
      <span><b>EL CLÁSICO</b> · GUALEGUAYCHÚ · ENTRE RÍOS · ARGENTINA</span>
      <span>BIOGRAFÍA 01 / 02</span>
    </div>
  </section>

  <section class="page">
    <div class="top">
      <div class="brand">EL CLÁSICO<span>.</span></div>
      <div class="doc"><h1>Discografía</h1><p>Press kit / 2026</p></div>
    </div>

    <h2 class="section-title">Cinco discos<span>.</span></h2>
    <p class="section-sub">Cuarenta canciones de rock directo, grabadas con la urgencia del escenario. El quinto disco completa la serie y se anuncia próximamente.</p>

    <div class="albums">
      <div class="album"><div class="num">01</div><div><h3>Acá Nadie Se Rinde</h3><p>Rock de provincia · orden de batalla</p></div><div class="status"><b>8 canciones</b>Editado</div></div>
      <div class="album"><div class="num">02</div><div><h3>Resistiendo en la Trinchera</h3><p>Pulso moderno · resistencia</p></div><div class="status"><b>8 canciones</b>Editado</div></div>
      <div class="album"><div class="num">03</div><div><h3>Que Se Pudra</h3><p>Filo clásico · sin concesiones</p></div><div class="status"><b>8 canciones</b>Editado</div></div>
      <div class="album"><div class="num">04</div><div><h3>Con La Sangre Del Enemigo</h3><p>Crudeza de escenario · nocturno</p></div><div class="status"><b>8 canciones</b>Editado</div></div>
      <div class="album pending"><div class="num">05</div><div><h3>La Patria No Se Vende</h3><p>Cierre de la serie · en preparación</p></div><div class="status"><b>8 canciones</b>Próximamente</div></div>
    </div>

    <div class="live">
      <div>Formato <b>5 músicos</b></div>
      <div>Show <b>90 minutos</b></div>
      <div>Gira <b>Argentina + Uruguay</b></div>
    </div>

    <div class="contact">
      <div>
        <h4>Prensa</h4>
        <p>prensa@elclasico.com</p>
        <small>Entrevistas · material · acreditaciones</small>
      </div>
      <div>
        <h4>Contrataciones</h4>
        <p>contacto@elclasico.com</p>
        <small>+54 9 3446 123456 · @elclasico.banda</small>
      </div>
    </div>

    <div class="stamp"><b>El Clásico</b> — Gualeguaychú, Entre Ríos, Argentina. Rider técnico, planta escénica y fotos de prensa disponibles en el dossier completo. Todo el material puede usarse libremente con crédito a la banda.</div>

    <div class="outro">
      <span>El próximo capítulo</span>
      <p>Se escribe<br><em>en vivo.</em></p>
    </div>

    <div class="foot">
      <span><b>EL CLÁSICO</b> · ROCK DE ACÁ · GIRA 2026</span>
      <span>BIOGRAFÍA 02 / 02</span>
    </div>
  </section>
</body>
</html>`;

const bioPage = await browser.newPage();
await bioPage.setContent(bioHtml, { waitUntil: "load" });
await bioPage.evaluate(() => document.fonts.ready);
await bioPage.pdf({
  path: join(pressDir, "el-clasico-bio.pdf"),
  format: "A4",
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});
await bioPage.close();

/* ------------------------------------------------------------------ */
/* 2. Press photos — high-resolution renders of the gallery art        */
/* ------------------------------------------------------------------ */

const baseUrl = (process.env.PRESS_BASE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "foto";

const captureContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1.5,
});
const capturePage = await captureContext.newPage();
await capturePage.goto(baseUrl, { waitUntil: "networkidle" });
await capturePage.evaluate(() => document.fonts.ready);
await capturePage.locator("#fotos").scrollIntoViewIfNeeded();
await capturePage.waitForTimeout(900);

const gallery = await capturePage.evaluate(() =>
  Array.from(
    document.querySelectorAll("#fotos button[aria-label^='Ampliar foto']"),
  ).map((button) => ({
    alt: (button.getAttribute("aria-label") || "")
      .replace(/^Ampliar foto:\s*/, "")
      .trim(),
    caption: (button.getAttribute("data-caption") || "").trim(),
  })),
);

if (!gallery.length) {
  throw new Error(`No gallery images found at ${baseUrl}/#fotos`);
}

const photos = gallery.map((image, index) => ({
  index,
  name: `${String(index + 1).padStart(2, "0")}-${slugify(image.caption || image.alt)}`,
  caption: image.caption || image.alt,
}));

for (const photo of photos) {
  const rect = await capturePage.evaluate((index) => {
    const button = document.querySelectorAll("#fotos button[aria-label^='Ampliar foto']")[index];
    const scene = button?.matches(".relative.isolate.overflow-hidden")
      ? button
      : button?.querySelector(".relative.isolate.overflow-hidden");
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

Contenido (${photos.length} ${photos.length === 1 ? "imagen" : "imágenes"}):
${photos
  .map((photo) => `  ${`${photo.name}.jpg`.padEnd(52)} ${photo.caption}`)
  .join("\n")}

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
  Discografía: 5 discos

DISCOGRAFÍA
  01. Acá Nadie Se Rinde .............. 8 canciones
  02. Resistiendo en la Trinchera ..... 8 canciones
  03. Que Se Pudra .................... 8 canciones
  04. Con La Sangre Del Enemigo ....... 8 canciones
  05. La Patria No Se Vende ........... 8 canciones (próximamente)

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
