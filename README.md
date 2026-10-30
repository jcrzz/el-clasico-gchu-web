# EL CLÁSICO — Sitio oficial

Sitio web y cabina de contenido de **El Clásico**, banda de rock de Gualeguaychú,
Entre Ríos. La dirección de arte sigue el concepto **“el afiche mal impreso”**:
tipografía condensada, rojo de registro desalineado, textura de papel y grilla
editorial.

La landing pública está completa. El panel protegido vive en `/admin` y permite
gestionar fechas, galería y press kit sin tocar el código.

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components, Proxy)
- **React 19** + **TypeScript**
- **Tailwind CSS 4** con tokens propios en `app/globals.css`
- **Motion** (`motion/react`) para animaciones
- **Supabase** para base de datos, Storage y autenticación del panel
- **Resend** para el formulario de contacto
- **Zod** para validación
- **Playwright** para QA visual y generación de assets

## Empezar

Requiere Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local   # opcional: sin credenciales usa datos mock
npm run dev
```

Abrí <http://localhost:3000>.

El sitio funciona **sin ninguna variable de entorno**: `lib/data.ts` detecta que
no hay Supabase y devuelve `lib/mock-data.ts`. El formulario de contacto responde
en modo demo durante el desarrollo.

## Panel `/admin`

Con Supabase configurado, el acceso es con email y contraseña:

1. Creá el usuario en **Supabase → Authentication → Users**.
2. Agregá ese email a `ADMIN_EMAILS` (separado por coma si hay más de uno).
3. Entrá a <http://localhost:3000/admin/login>.

`proxy.ts` protege `/admin` y sus subrutas, y cada Server Action vuelve a validar
la sesión. En producción la allowlist es obligatoria: si `ADMIN_EMAILS` está
vacío, nadie puede entrar.

### Modo demo

Sin `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` y con
`NODE_ENV !== "production"`, el login muestra **Entrar en modo demo**. El modo
demo:

- guarda textos y metadatos en `localStorage`;
- permite probar todo el CRUD sin base de datos;
- mantiene las imágenes y archivos subidos sólo durante la sesión (no persisten
  al recargar);
- nunca se habilita en producción.

Con Supabase configurado pero sin `SUPABASE_SERVICE_ROLE_KEY`, el panel entra en
**modo lectura**: se puede revisar el contenido, pero no guardar ni subir
archivos.

### Qué se puede editar

- **Fechas:** fecha, horario, ciudad, país, venue, link de venta y switch de
  sold out. Incluye edición y eliminación.
- **Galería:** subida con vista previa inmediata, descripción, epígrafe, formato
  bento, escena de respaldo, blanco y negro, orden y eliminación.
- **Press kit:** biografía corta, biografía completa por párrafos, rider técnico,
  reemplazo de PDFs/ZIPs y planta escénica.

Los archivos se suben directo del navegador a Supabase Storage con URLs firmadas
generadas por el servidor. Así se evita el límite de body de las Server Actions
de Vercel. Al finalizar, el servidor valida la ruta y guarda la URL pública.

## Variables de entorno

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Producción | URL canónica, sitemap, Open Graph |
| `NEXT_PUBLIC_SUPABASE_URL` | Panel | Proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Panel | Cliente público / auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Panel | Sólo servidor: CRUD y uploads firmados |
| `SUPABASE_GALLERY_BUCKET` | No | Bucket de fotos (default `gallery`) |
| `SUPABASE_PRESS_BUCKET` | No | Bucket de descargables (default `press`) |
| `SUPABASE_SUPPORT_BUCKET` | No | Bucket del QR de aportes (default `support`) |
| `AUDIO_BASE_URL` | No | Base pública de los audios de la discografía |
| `RESEND_API_KEY` | Producción | Envío del formulario |
| `CONTACT_TO_EMAIL` | No | Destino de los mensajes |
| `CONTACT_FROM_EMAIL` | No | Remitente verificado en Resend |
| `ADMIN_EMAILS` | Producción | Emails habilitados para `/admin` |

Sin `RESEND_API_KEY`:

- en desarrollo el formulario devuelve `{ ok: true, demo: true }` y muestra un
  aviso de modo demo;
- en producción devuelve `503` y sugiere WhatsApp.

La misma lógica de envío se comparte entre `app/actions/contact.ts` (formulario)
y `app/api/contact/route.ts` (endpoint JSON).

En Vercel cargá las variables en **Project Settings → Environment Variables** y
volvé a desplegar. `SUPABASE_SERVICE_ROLE_KEY` no debe llevar el prefijo
`NEXT_PUBLIC_`.

## Configurar Supabase

1. Creá un proyecto en Supabase.
2. Abrí **SQL Editor** y ejecutá `supabase/schema.sql` completo.
3. Verificá en **Storage** que existan los buckets públicos `gallery` y `press`.
4. Creá el usuario del panel en **Authentication → Users**.
5. Copiá la URL, la anon key y la service role key a `.env.local` o Vercel.
6. Agregá el email del usuario a `ADMIN_EMAILS`.
7. En producción, desactivá el registro público de Auth si no lo necesitás.

El SQL crea las tablas, índices, políticas de lectura pública y buckets:

- `shows`
- `gallery_images`
- `epk_content` (fila única `id = 'main'`)

Si ya tenías tablas creadas, revisá que coincidan con las columnas del SQL antes
de ejecutarlo. Las políticas RLS permiten leer al sitio público con la anon key;
la escritura queda para la service role.

## Datos y cache

`lib/data.ts` consulta las tablas y cae a mock si hay error o no hay cliente:

- `shows`: `id, date, time, city, country, venue, ticket_url, status, notes`
- `gallery_images`: `id, src, alt, caption, scene, span, position, mono`
- `epk_content`: `bio, bio_short, facts, rider, stage_plot_url, downloads`

Los tipos viven en `lib/types.ts`. Las filas snake_case se mapean a camelCase en
`lib/content-mappers.ts`, compartido por el sitio público y el panel.

El contenido público se cachea con `"use cache"`, `cacheLife("hours")` y los tags
`site-data`, `shows`, `gallery`, `epk`. Las mutaciones del panel llaman a
`updateTag("shows" | "gallery" | "epk")` para invalidar el cache y mostrar los
cambios de inmediato.

## Discografía y audio

Los cinco discos y sus tracklists viven en `lib/discography.ts`. Cada pista
declara el archivo esperado, y `lib/audio.ts` resuelve la URL en el servidor:

- sin `AUDIO_BASE_URL`, busca `public/audio/<disco>/<pista>.m4a` (también
  `.mp3`, `.ogg` y `.wav`);
- con `AUDIO_BASE_URL`, arma `<base>/<disco>/<pista>.m4a` (o el nombre completo
  si la pista ya incluye extensión), pensado para un bucket o CDN público.

```text
public/audio/
  01-aca-nadie-se-rinde/
    01-1-en-32.m4a
    02-camalote.m4a
    ...
```

Si el archivo no existe, la pista queda con `audioUrl: null` y la UI muestra
`AUDIO PENDIENTE` o `PRÓXIMAMENTE` (Disco 5). Un único `<audio>` global vive en
`components/audio/audio-provider.tsx`, así que la reproducción sigue al cambiar
de disco o al salir de la sección; `components/audio/floating-player.tsx` es el
mini-player fijo que aparece fuera de `#musica`.

## Estructura

```text
app/
  page.tsx                 landing completa + JSON-LD
  layout.tsx               fuentes, metadata, viewport, grano global
  globals.css              tokens, utilidades, animaciones
  actions/contact.ts       Server Action del formulario
  api/contact/route.ts     endpoint JSON + Resend
  admin/
    login/page.tsx         acceso con Supabase o demo
    (cabina)/              layout protegido + dashboard
      page.tsx
      shows/page.tsx
      galeria/page.tsx
      epk/page.tsx
  robots.ts, sitemap.ts
components/
  site/                    navbar, hero, historia, hermandad, música,
                           shows, galería, EPK, contacto, footer
  audio/                   provider global + mini-player flotante
  admin/                   provider, shell, login, dashboard y managers
  art/                     escenas SVG, tapa de disco, stage plot
  ui/                      iconos de marca, crop marks, encabezados
lib/
  admin/                   auth, config, datos, schemas, acciones, formato
  email/                   plantilla y envío compartido con Resend
  discography.ts           catálogo de discos y tracklists
  audio.ts                 resolución server-side de las URLs de audio
  mock-data.ts             contenido inicial
  data.ts                  capa cacheada con fallback a mock
  content-mappers.ts       filas Supabase → tipos del sitio
  types.ts                 contratos de datos
  supabase/                clientes browser/server/auth/admin/proxy
proxy.ts                   protección de /admin (Next.js 16)
supabase/schema.sql        tablas, RLS y buckets
public/
  press/                   PDFs y ZIPs descargables
  audio/                   pistas locales (se crean al cargar los audios)
  textures/grain.svg
scripts/
  review.mjs               screenshots e interacciones (Playwright)
  audit.mjs                overflow, menú y errores por breakpoint
  press-kit.mjs            stage plot PDF + ZIPs de prensa
  og-image.mjs             OG 1200×630 + apple icon
```

## Assets de prensa

Los descargables iniciales están en `public/press/`:

- `el-clasico-bio.pdf`
- `el-clasico-rider.pdf`
- `el-clasico-stage-plot.pdf`
- `el-clasico-fotos.zip`
- `el-clasico-epk.zip`

Para regenerar la biografía, la planta escénica y los ZIPs (con el servidor de
desarrollo corriendo):

```bash
node scripts/press-kit.mjs
```

El script toma las fotos de la galería publicada en `#fotos`, así que la cantidad
de archivos sigue a las imágenes disponibles (con Supabase configurado usa esa
galería; sin credenciales usa el arte SVG del mock). Para apuntar a otro puerto o
entorno, definí `PRESS_BASE_URL` (por ejemplo `http://localhost:3100`) antes de
ejecutar el script.

Las fotos del ZIP son placeholders hasta reemplazarlas por fotografía oficial de
la banda. Una vez que subís archivos desde `/admin`, el sitio usa primero las URLs
de Supabase y cae al mock sólo si esa fila está vacía.

## QA

```bash
npm run lint
npx tsc --noEmit
npm run build
node scripts/audit.mjs        # requiere dev server en :3000
node scripts/review.mjs       # capturas en .screens/
node scripts/links.mjs        # revisa links locales
```

No hay `npm test` ni CI. La QA de navegador requiere Google Chrome instalado
porque los scripts usan Playwright con `channel: "chrome"`.

## Deploy en Vercel

1. Importá el repositorio en Vercel.
2. Framework preset: **Next.js** (sin configuración extra).
3. Cargá las variables de entorno, incluida `SUPABASE_SERVICE_ROLE_KEY`.
4. Deploy.

`NEXT_PUBLIC_SITE_URL` debe ser el dominio final para que canonical, sitemap y
Open Graph apunten al lugar correcto.

## Placeholders a reemplazar antes del lanzamiento

- WhatsApp: `5493446123456`
- Emails: `contacto@elclasico.com`, `prensa@elclasico.com`
- Redes y links de venta: `@elclasico.banda` / WhatsApp
- Spotify / YouTube / Apple Music: hoy son búsquedas
- Fotos de galería y prensa: arte SVG provisorio
- `spotifyEmbedUrl: null`: al cargar el embed real se muestra el player
- Fechas de shows y datos de la banda en `lib/mock-data.ts`

## Notas de implementación

- El año de la gira está fijado en `2026` en hero, shows, galería, footer,
  metadata y `lib/site.ts`. Cambiar fechas no actualiza esos textos.
- `next dev` regenera el bloque administrado al inicio de `AGENTS.md`; dejalo
  intacto.
- `.screens/` está versionado. Las capturas de secciones ocultan el header fijo
  a propósito.
- El build emite warnings no fatales de `font override` para Big Shoulders /
  Stencil; sólo investigar si las fuentes se rompen de verdad.
