# EL CLÁSICO — Sitio oficial

Sitio web y futuro panel de administración de **El Clásico**, banda de rock de
Gualeguaychú, Entre Ríos. La dirección de arte sigue el concepto **“el afiche mal
impreso”**: tipografía condensada, rojo de registro desalineado, textura de papel
y grilla editorial.

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components)
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

## Variables de entorno

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Producción | URL canónica, sitemap, Open Graph |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Cliente público / auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin | Sólo servidor: uploads y CRUD |
| `RESEND_API_KEY` | Producción | Envío del formulario |
| `CONTACT_TO_EMAIL` | No | Destino de los mensajes |
| `CONTACT_FROM_EMAIL` | No | Remitente verificado en Resend |
| `ADMIN_EMAILS` | Admin | Emails habilitados para `/admin` |

Sin `RESEND_API_KEY`:

- en desarrollo el formulario devuelve `{ ok: true, demo: true }`;
- en producción devuelve `503` y sugiere WhatsApp.

En Vercel cargá las variables en **Project Settings → Environment Variables** y
volvé a desplegar.

## Datos y Supabase

`lib/data.ts` consulta estas tablas y cae a mock si hay error o no hay cliente:

- `shows`: `id, date, time, city, country, venue, ticket_url, status, notes`
- `gallery_images`: `id, src, alt, caption, scene, span, position, mono`
- `epk_content`: fila `id = 'main'` con `bio, bio_short, facts, rider, stage_plot_url, downloads`

Los tipos viven en `lib/types.ts`. Las imágenes subidas a Storage se sirven desde
`*.supabase.co/storage/v1/object/public/**`, ya permitido en `next.config.ts`.

El contenido público se cachea con `"use cache"`, `cacheLife("hours")` y los tags
`site-data`, `shows`, `gallery`, `epk`. Al conectar el panel, revalidá esos tags
después de cada mutación.

## Estructura

```text
app/
  page.tsx              landing completa + JSON-LD
  layout.tsx            fuentes, metadata, viewport, grano global
  globals.css           tokens, utilidades, animaciones
  api/contact/route.ts  Server Route + Resend + honeypot
  robots.ts, sitemap.ts
components/
  site/                 navbar, hero, historia, hermandad, música,
                        shows, galería, EPK, contacto, footer
  art/                  escenas SVG, tapa de disco, stage plot
  ui/                   iconos de marca, crop marks, encabezados
lib/
  mock-data.ts          contenido inicial
  data.ts               capa cacheada con fallback a mock
  types.ts              contratos de datos
  supabase/             clientes browser/server/auth
public/
  press/                PDFs y ZIPs descargables
  textures/grain.svg
scripts/
  review.mjs            screenshots e interacciones (Playwright)
  audit.mjs             overflow, menú y errores por breakpoint
  press-kit.mjs         stage plot PDF + ZIPs de prensa
  og-image.mjs          OG 1200×630 + apple icon
```

## Assets de prensa

Los descargables están en `public/press/`:

- `el-clasico-bio.pdf`
- `el-clasico-rider.pdf`
- `el-clasico-stage-plot.pdf`
- `el-clasico-fotos.zip`
- `el-clasico-epk.zip`

Para regenerar la planta escénica y los ZIPs (con el servidor de desarrollo
corriendo):

```bash
node scripts/press-kit.mjs
```

Las fotos del ZIP se generan a partir del arte SVG de la galería. Son placeholders
hasta reemplazarlas por fotografía oficial de la banda.

## QA

```bash
npm run lint
npx tsc --noEmit
npm run build
node scripts/audit.mjs        # requiere dev server en :3000
node scripts/review.mjs       # capturas en .screens/
```

## Deploy en Vercel

1. Importá el repositorio en Vercel.
2. Framework preset: **Next.js** (sin configuración extra).
3. Cargá las variables de entorno.
4. Deploy.

`NEXT_PUBLIC_SITE_URL` debe ser el dominio final para que canonical, sitemap y
Open Graph apunten al lugar correcto.

## Placeholders a reemplazar antes del lanzamiento

- WhatsApp: `5493446123456`
- Emails: `contacto@elclasico.com`, `prensa@elclasico.com`
- Redes: `@elclasico.banda`
- URLs de entradas: hoy apuntan a WhatsApp
- Spotify / YouTube / Apple Music: hoy son búsquedas
- Fotos de galería y prensa: arte SVG provisorio
- `spotifyEmbedUrl: null`: al cargar el embed real se muestra el player
- Fechas de shows y datos de la banda en `lib/mock-data.ts`

## Próximos pasos

- **Paso 3:** pulir integración Resend (plantilla, confirmación al remitente,
  rate limit y antispam).
- **Paso 4:** panel `/admin` con login Supabase, CRUD de shows, uploads de
  galería con posición bento y edición de textos/archivos del EPK.
