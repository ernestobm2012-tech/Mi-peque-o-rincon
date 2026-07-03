# Mi Pequeño Rincón — web + reservas

Sitio de una sola página (`index.html`) para la sala de eventos en Chozas de Canales.
Sin build step: es HTML/CSS/JS puro + Supabase JS por CDN, así que se puede abrir
tal cual o subir a cualquier hosting estático (GitHub Pages, Netlify, Vercel...).

## Qué incluye

- Portada con logo, precios (tabla `pricing_plans`), tipos de evento (`event_types`),
  calendario de disponibilidad (vista `availability`) y formulario de reserva que
  escribe directamente en la tabla `reservations` de Supabase.
- Enlaces a Instagram, Facebook, TikTok y Google Maps.
- Todo el contenido de precios/tipos de evento se lee de la base de datos, así que
  puedes cambiar precios sin tocar código (ver más abajo).

## Proyecto Supabase ya creado

- **Project ref:** `ztsdkfwnqrlmsirfvoat`
- **URL:** `https://ztsdkfwnqrlmsirfvoat.supabase.co`
- **Dashboard:** https://supabase.com/dashboard/project/ztsdkfwnqrlmsirfvoat
- La clave `anon` ya está incrustada en `index.html` — es pública por diseño
  (así funciona cualquier app Supabase), y está protegida por Row Level Security:
  - Cualquiera puede **leer** precios, extras, tipos de evento y disponibilidad (solo fechas/horas, no datos personales).
  - Cualquiera puede **crear** una reserva (INSERT), pero **nadie puede leer, editar
    ni borrar** reservas desde el navegador — eso solo lo puedes hacer tú desde el
    dashboard de Supabase (Table Editor → `reservations`).

### Tablas

- `pricing_plans` — tarifas por franja (lunes-jueves / viernes-domingo-festivos).
- `extras` — limpieza, hora extra, menú infantil, decoración.
- `event_types` — lista desplegable del formulario.
- `reservations` — cada solicitud de reserva (estado `pendiente` por defecto).
- `availability` (vista) — solo fecha/hora de reservas activas, para pintar el calendario.

Para cambiar un precio, entra en el dashboard → Table Editor → `pricing_plans` y
edita la fila. Se refleja en la web al recargar, sin tocar código.

Para gestionar reservas entrantes: Table Editor → `reservations`. Puedes cambiar
`status` a `confirmada` o `cancelada` según vayas llamando a la gente.

## Cómo lo pruebas en local

Solo hace falta un servidor estático simple (los módulos ES no funcionan con `file://`):

```bash
cd site
python3 -m http.server 8000
# abre http://localhost:8000
```

## Cómo conectarlo a tu repo de GitHub con Claude Code

No pude hacer `git push` yo mismo porque mi entorno de archivos no tiene acceso a
internet. Estos son los pasos con **Claude Code** (la app de terminal/escritorio):

1. Instala Claude Code si no lo tienes: `npm install -g @anthropic-ai/claude-code`
   (o descarga la app de escritorio).
2. En tu terminal:
   ```bash
   git clone https://github.com/ernestobm2012-tech/Mi-peque-o-rincon.git
   cd Mi-peque-o-rincon
   ```
3. Copia dentro los archivos que te he generado (`index.html`, la carpeta `assets/`
   y este `README.md`).
4. Arranca Claude Code dentro de esa carpeta:
   ```bash
   claude
   ```
   y pídele por ejemplo: *"revisa este index.html, haz commit y push a main"* —
   Claude Code sí tiene acceso a red y a tus credenciales de git locales, así que
   puede ejecutar `git add`, `git commit` y `git push` directamente.
5. Para publicarlo gratis, lo más rápido es **GitHub Pages**:
   - En GitHub → Settings → Pages → Source: rama `main`, carpeta `/root`.
   - En unos minutos tendrás la web en `https://ernestobm2012-tech.github.io/Mi-peque-o-rincon/`.
   - Si prefieres dominio propio, Netlify o Vercel también valen arrastrando la carpeta.

## Pendiente de tu parte / a revisar

- El enlace de TikTok (`@mi_pq_rincon`) lo he puesto por consistencia con el usuario
  de Instagram, pero no he podido verificarlo — confírmalo o corrígelo en el `<a>`
  de la sección de contacto.
- El mapa usa una búsqueda genérica de "Chozas de Canales, Toledo"; si quieres el
  pin exacto de la sala, cámbialo por la dirección completa o el Place ID de Google Maps.
- Sustituye `assets/logo.jpg` por fotos reales del interior de la sala (las que
  tengas en Instagram) para las secciones de eventos y catas — ahora mismo esas
  secciones son solo texto e iconos.
