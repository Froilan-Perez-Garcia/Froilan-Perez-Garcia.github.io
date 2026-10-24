# Portafolio — Froilan Perez Garcia

Sitio estático (HTML, CSS y JS, sin build) publicado en https://froilan-perez-garcia.github.io/

> **Privacidad:** no subas pólizas, capturas ni datos reales de clientes a este repositorio público.

## Ver en local

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python -m http.server 8000
```

y visita http://localhost:8000. (`404.html` usa rutas absolutas, así que solo se ve bien servido desde la raíz.)

## Desplegar en GitHub Pages

El repo `Froilan-Perez-Garcia.github.io` publica la rama `main` desde la raíz (Settings → Pages → Deploy from a branch → `main` / `/ (root)`). Un push a `main` publica el sitio.

## Configurar el formulario de contacto

En `script.js`, reemplaza `FORM_ENDPOINT` (hoy `'REEMPLAZA_CON_TU_ENDPOINT'`; mientras sea así el formulario muestra "aún no configurado"):

- **Formspree:** crea un formulario en https://formspree.io y usa su URL `https://formspree.io/f/XXXX`.
- **Web3Forms:** usa `https://api.web3forms.com/submit` y agrega dentro del `<form>` un input oculto con tu clave pública:
  `<input type="hidden" name="access_key" value="TU_ACCESS_KEY">`.

El formulario envía JSON con todos sus campos (incluido el honeypot `botcheck`, que debe ir vacío).

El asunto del correo es "Conexión desde portafolio" (inputs ocultos `subject` y `_subject` del formulario). El correo de destino **no va en el código**: se define al crear el formulario en Formspree o Web3Forms (cuenta con el correo que recibirá los mensajes).
