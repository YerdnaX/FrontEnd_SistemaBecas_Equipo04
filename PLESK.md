# Despliegue del frontend en Plesk

## 1. Compilar

En un entorno con Node.js 18+ (puede ser local, no es necesario que sea el propio Plesk):

```bash
cd FrontEnd
npm ci
VITE_API_URL=https://<dominio-del-backend-en-render>/api/v1 npm run build
```

En Windows PowerShell:

```powershell
$env:VITE_API_URL="https://<dominio-del-backend-en-render>/api/v1"; npm run build
```

Esto genera la carpeta `FrontEnd/dist` con los archivos estáticos listos para producción. `VITE_API_URL` se incrusta en el bundle en tiempo de compilación: no hay secretos en el frontend, solo la URL pública de la API.

## 2. Subir a Plesk

1. En Plesk, entre al dominio o subdominio asignado al frontend.
2. Suba **todo el contenido** de `FrontEnd/dist` (no la carpeta en sí, sino su contenido) al directorio raíz del hosting (`httpdocs` o el configurado).
3. Verifique que `index.html` quede en la raíz del sitio.

## 3. Configurar el fallback de rutas de React Router

Sin esta configuración, recargar una ruta como `/aspirante` devuelve 404 porque el servidor busca ese archivo físico.

Si Plesk usa Apache con `.htaccess`, cree `httpdocs/.htaccess` con:

```apache
RewriteEngine On
RewriteBase /
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

Si Plesk usa Nginx como proxy o el "Nginx settings" del dominio, agregue en "Additional nginx directives":

```nginx
location / {
  try_files $uri /index.html;
}
```

## 4. Verificar

- Abra el dominio y confirme que `LandingPublico` carga y consume `GET /api/v1/publico/inicio`.
- Recargue una ruta interna (por ejemplo `/convocatorias`) directamente en el navegador y confirme que no da 404.
- Confirme en las herramientas de desarrollador que las peticiones van a la URL de Render configurada, no a `localhost`.

## Notas

- No incluya `DB_PASSWORD`, `JWT_SECRET` ni ningún secreto del backend en variables del frontend: React solo necesita `VITE_API_URL`.
- Si cambia la URL del backend, debe volver a compilar (`npm run build`) porque `VITE_API_URL` se incrusta en el bundle, no se lee en tiempo de ejecución.
