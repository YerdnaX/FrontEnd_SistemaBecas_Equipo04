# Despliegue del frontend en Plesk

El frontend (`FrontEnd/`) es una aplicación React compilada por Vite: el resultado de `npm run build` es un puñado de archivos **estáticos** (HTML/CSS/JS). Plesk solo necesita servir esos archivos — no necesita ejecutar Node.js en el servidor de Plesk para nada. Esto es importante porque Plesk suele traer una extensión de "Node.js" que, si se activa por error, intenta ejecutar el proyecto como una app Node en vez de servir los archivos compilados (ver sección 3).

El backend (API) vive aparte, en Render — ver `BackEnd/RENDER.md`. Este documento es solo para el frontend.

## 0. Prerrequisitos

- Acceso al panel de Plesk (usuario/contraseña o SSO institucional) con un dominio o subdominio ya asignado (por ejemplo `becas.cuc.ac.cr` o `sgbe.cuc.ac.cr`).
- El backend **ya desplegado en Render** y su URL pública a mano (en este proyecto: `https://sistemabecas-equipo04.onrender.com`, ver `FrontEnd/.env`).
- Node.js 18+ en la máquina donde vayas a compilar (tu laptop, por ejemplo — **no** hace falta que sea el propio servidor de Plesk).
- Acceso de escritura al repositorio Git del frontend si vas a usar el método de despliegue por Git (opcional, ver sección 4.3): `https://github.com/YerdnaX/FrontEnd_SistemaBecas_Equipo04`.

## 1. Elegir y preparar el dominio/subdominio en Plesk

1. Entra a Plesk → **Sitios web y dominios**.
2. Si vas a usar un subdominio dedicado (recomendado, por ejemplo `sgbe.tudominio.cr`): **Agregar subdominio** → asigna el nombre → el documento raíz por defecto suele quedar en `httpdocs` dentro de la carpeta del subdominio.
3. Si vas a usar un dominio ya existente, simplemente ubica su tarjeta en el listado; usarás su **Administrador de archivos** y sus **Configuraciones de hosting**.
4. Anota la ruta del **document root** (raíz de documentos) del dominio/subdominio — normalmente `httpdocs`. Ahí es donde va a terminar el contenido de `dist/`.

## 2. Compilar el frontend con la URL del backend correcta

`VITE_API_URL` se incrusta en el código en tiempo de compilación (Vite no lee variables de entorno en tiempo de ejecución en el navegador), así que hay que compilar apuntando ya a la URL real del backend en Render.

```bash
cd FrontEnd
npm ci
VITE_API_URL=https://sistemabecas-equipo04.onrender.com/api/v1 npm run build
```

En Windows PowerShell:

```powershell
cd FrontEnd
npm ci
$env:VITE_API_URL="https://sistemabecas-equipo04.onrender.com/api/v1"; npm run build
```

Esto genera `FrontEnd/dist/` con `index.html` + una carpeta `assets/` con JS/CSS con nombre "hasheado". No hay ningún secreto ahí dentro — solo la URL pública de la API.

> Si el backend está en otra URL (por ejemplo un dominio propio en vez de `*.onrender.com`), usa esa URL en su lugar. Recuerda: **si cambia la URL del backend, hay que recompilar** (no basta con cambiar algo en Plesk).

## 3. Importante: que Plesk sirva archivos estáticos, no que intente "ejecutar" el proyecto

Como `FrontEnd/package.json` existe, algunas versiones de Plesk (extensión "Node.js") pueden ofrecer configurarlo como una "aplicación Node.js" con un botón de **Enable Node.js**. **No lo actives para este dominio.** Si Plesk ya lo detectó y lo activó automáticamente:

1. Ve a **Sitios web y dominios** → tu dominio → pestaña **Node.js**.
2. Si aparece habilitado, haz clic en **Deshabilitar Node.js** (o "Disable Node.js").
3. Confirma que el dominio quede sirviendo archivos como un sitio estático normal (Apache/Nginx), no como una app proxied a un puerto Node.

Esto es porque el frontend no tiene servidor propio en producción: es HTML/CSS/JS puro que cualquier servidor web sirve directamente desde disco.

## 4. Subir el contenido de `dist/` al servidor

Tienes tres formas de hacerlo; usa la que te resulte más cómoda para *este* despliegue, y la misma para los siguientes.

### 4.1 Administrador de archivos de Plesk (más simple para una primera subida)

1. En tu máquina, comprime el **contenido** de `FrontEnd/dist/` (los archivos, no la carpeta `dist` en sí) en un `.zip`.
2. En Plesk: **Sitios web y dominios** → tu dominio → **Administrador de archivos**.
3. Entra a la carpeta del document root (`httpdocs`). Si ya había un despliegue anterior, **selecciona y elimina su contenido** antes de subir el nuevo (para no dejar archivos `assets/*.js` viejos mezclados con los nuevos).
4. **Subir archivo** → selecciona el `.zip` → una vez subido, clic derecho → **Extraer**.
5. Verifica que `index.html` quede directamente en `httpdocs/index.html` (no dentro de una subcarpeta `httpdocs/dist/index.html`).

### 4.2 FTP/SFTP (cómodo si vas a automatizar con un script)

1. En Plesk: **Sitios web y dominios** → tu dominio → **Cuentas FTP**, para obtener/crear las credenciales.
2. Con un cliente FTP/SFTP (FileZilla, WinSCP, o `scp`/`rsync` si tienes SSH), sincroniza el contenido de `FrontEnd/dist/` local contra `httpdocs/` remoto.
3. Igual que arriba: asegúrate de limpiar archivos `assets/*` de builds anteriores para no acumular basura (los nombres de archivo cambian en cada build porque Vite les agrega un hash).

### 4.3 Git (opcional, útil si vas a redeployar seguido)

Si tu plan de Plesk tiene la extensión **Git**:

1. **Sitios web y dominios** → tu dominio → **Git**.
2. Conecta el repositorio `https://github.com/YerdnaX/FrontEnd_SistemaBecas_Equipo04` (rama `main` u otra que uses para producción).
3. Como Plesk por defecto solo hace `git pull` (no build), en **Acciones de implementación adicionales** agrega un script tipo:
   ```bash
   npm ci
   VITE_API_URL=https://sistemabecas-equipo04.onrender.com/api/v1 npm run build
   rsync -a --delete dist/ ../httpdocs/
   ```
   (ajusta la ruta relativa de `httpdocs` según dónde Plesk clone el repo).
4. Esto te permite hacer `git push` y que Plesk recompile y publique solo automáticamente. Si tu plan de Plesk no tiene Node.js disponible como herramienta de build (aparte del hosting Node.js que desactivamos en la sección 3), sigue compilando localmente y usa 4.1/4.2 en su lugar — no es obligatorio automatizarlo.

## 5. Configurar el fallback de rutas de React Router (obligatorio)

La app usa `BrowserRouter` (`FrontEnd/src/main.jsx`), es decir, rutas como `/aspirante` o `/admin/usuarios` no existen como archivos físicos — las resuelve React en el navegador. **Sin este paso, recargar cualquier ruta que no sea `/` da 404**, porque el servidor busca un archivo que no existe.

**Si Plesk usa Apache** (lo más común), crea `httpdocs/.htaccess`:

```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Evita que el navegador cachee index.html (así los usuarios reciben
# siempre las referencias a los assets del último build), mientras que
# los assets con hash sí pueden cachearse agresivamente.
<IfModule mod_headers.c>
  <FilesMatch "index\.html$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </FilesMatch>
</IfModule>
```

**Si el dominio usa Nginx** (proxy delante de Apache, o Nginx puro): **Sitios web y dominios** → tu dominio → **Configuración de Apache y nginx** → **Directivas nginx adicionales**:

```nginx
location / {
  try_files $uri /index.html;
}
```

> Si cambias entre Apache y Nginx más adelante, recuerda que solo una de las dos configuraciones aplica según cuál esté sirviendo realmente las peticiones — revisa cuál usa tu plan en **Configuración de hosting** del dominio.

## 6. Activar HTTPS

1. **Sitios web y dominios** → tu dominio → **Certificados SSL/TLS**.
2. Si no hay uno emitido: **Instalar** → **Let's Encrypt** (gratis) → incluye también el subdominio `www.` si aplica → **Obtener**.
3. En **Configuración de hosting** del dominio, activa **Redirigir de HTTP a HTTPS** (o la opción equivalente "Permanent SEO-safe 301 redirect").

Esto es importante porque el backend en Render ya sirve por HTTPS; si el frontend queda en HTTP plano, el navegador puede bloquear las peticiones "mixtas" (mixed content) hacia la API HTTPS, o al menos generar advertencias.

## 7. Sincronizar CORS con el backend (paso que se olvida seguido)

El backend valida el origen de las peticiones con coincidencia **exacta** (`BackEnd/src/app.js`, `cors({ origin: URL_FRONTEND, credentials: true })`) — no usa `*` porque las peticiones llevan credenciales. Si no coincide exactamente, el navegador bloquea todas las llamadas a la API con un error de CORS, aunque el backend esté funcionando perfectamente.

1. Define la URL final del frontend, por ejemplo `https://sgbe.tudominio.cr` (**sin** slash final, **con** `https://`).
2. En Render → tu servicio de backend → **Environment** → variable `URL_FRONTEND` → pon exactamente esa URL.
3. Guarda — Render reinicia el backend automáticamente con el nuevo valor.

Si más adelante cambias el dominio del frontend, hay que repetir este paso o el backend seguirá rechazando las peticiones del dominio nuevo.

## 8. Verificar que todo quedó bien

Checklist mínimo tras el primer despliegue (y después de cada redeploy grande):

- [ ] Abrir el dominio → carga el `LandingPublico` con convocatorias/noticias reales (confirma que `VITE_API_URL` apunta al backend correcto, no a `localhost`).
- [ ] Recargar (F5) una ruta interna directamente, por ejemplo `/convocatorias` o `/login` → no debe dar 404 (confirma el paso 5).
- [ ] Iniciar sesión como administrador → el menú superior debe mostrar los submenús agrupados (Beneficios, Personas, Trabajo social, Sistema, Reportes) sin errores en consola.
- [ ] Recargar una ruta **protegida** estando logueado, por ejemplo `/admin/usuarios` → debe seguir mostrando la pantalla, no expulsar a `/login` ni dar 404.
- [ ] Abrir el botón de chat 💬 (esquina inferior derecha) → debe abrir el panel (aunque diga "no disponible" si `ASISTENTE_IA_API_KEY` no está configurada en Render, eso es esperado).
- [ ] En las herramientas de desarrollador (pestaña Network), confirmar que las peticiones van al dominio de Render configurado y responden 200, no un error de CORS en consola.
- [ ] Confirmar que el candado HTTPS aparece sin advertencias de contenido mixto.

## 9. Actualizar el frontend en despliegues futuros

Cada vez que haya cambios en `FrontEnd/src`:

1. `npm run build` de nuevo (con la misma `VITE_API_URL`, salvo que el backend haya cambiado de URL).
2. Reemplazar el contenido de `httpdocs/` con el nuevo `dist/` (métodos de la sección 4) — **borra los `assets/*` viejos primero** si subes manualmente, porque Vite genera nombres de archivo distintos en cada build y los viejos quedan huérfanos (no rompen nada funcionalmente, pero acumulan basura).
3. No hace falta tocar `.htaccess` ni el certificado SSL de nuevo — esos quedan configurados una sola vez.

## 10. Solución de problemas

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| Pantalla en blanco, consola muestra 404 en `/assets/index-XXXX.js` | Quedaron archivos de un build anterior mezclados con el nuevo, o `index.html` quedó en una subcarpeta en vez de la raíz | Limpia `httpdocs/` por completo antes de subir el `dist/` nuevo; confirma que `index.html` esté en `httpdocs/index.html` |
| Recargar cualquier ruta que no sea `/` da 404 del servidor (no de React) | Falta el fallback SPA (sección 5) | Crear/revisar el `.htaccess` o las directivas nginx |
| Plesk muestra una página de error de Node.js / "Application failed to start" | Se activó por error la extensión Node.js del dominio | Deshabilita Node.js para ese dominio (sección 3); este sitio es estático |
| Error de CORS en consola ("blocked by CORS policy") al llamar a la API | `URL_FRONTEND` en Render no coincide exactamente con el dominio del frontend (protocolo, `www.`, o slash final distintos) | Ajustar `URL_FRONTEND` en Render (sección 7) para que sea idéntica a la URL real del navegador |
| Las peticiones van a `localhost:3000` en producción | Se compiló sin `VITE_API_URL`, o se subió un `dist/` viejo compilado en local | Recompilar con `VITE_API_URL` apuntando a Render (sección 2) y volver a subir |
| Advertencia de "contenido mixto" o recursos bloqueados | El frontend quedó en HTTP mientras la API está en HTTPS | Activar HTTPS y la redirección forzada (sección 6) |
| El botón de chat siempre dice "no disponible" | Falta `ASISTENTE_IA_API_KEY` en el backend (Render), no es un problema del frontend | Ver `documentacion/GUIA_ASISTENTE_IA.md` |
| Cambié algo en el código pero el navegador sigue mostrando la versión vieja | Cache del navegador sobre `index.html`, o no se limpiaron los `assets/*` viejos | Revisar el `Cache-Control` de `index.html` (sección 5) y forzar recarga (Ctrl+Shift+R) |

## Notas

- No incluyas `DB_PASSWORD`, `JWT_SECRET`, `ASISTENTE_IA_API_KEY` ni ningún secreto del backend en variables del frontend: React (Vite) solo necesita `VITE_API_URL`, y todo lo que empiece con `VITE_` termina visible en el bundle público — nunca pongas un secreto ahí.
- El frontend no necesita base de datos, PHP, ni ningún runtime del lado del servidor: es 100% archivos estáticos.
- Si en algún momento quieres mover el frontend a otro proveedor (Netlify, Vercel, Cloudflare Pages, el propio Render como "Static Site"), el único paso específico de Plesk que no aplica en otros lados es la sección 3 (Node.js) — el resto (build, fallback SPA, CORS) es igual en cualquier hosting estático.
