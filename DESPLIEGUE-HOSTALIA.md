# La web de THE DAMN PSYCHIATRIC — estado actual y tus dominios

## Dónde vive la web ahora (sin Hostalia como hosting)
La web está publicada y mantenida por QwenWork Pages en:
**https://274h7lhu.qwenwork.page/**  (HTTPS incluido, sin coste mientras el servicio exista)

No necesitas ningún hosting: el `.htaccess` que incluye este ZIP solo se usa si algún día
la alojas en un servidor Apache (cPanel/Hostalia/u otro) tú solo.

## 

## Tus dos dominios → la web
`thedamnpsychiatric.es` (principal) y `elpsiquiatricomaldito.com` (secundario).
Como el sitio con marca blanca de terceros que querías ocultar sigue en el tier gratuito
del hosting gestionado, tienes 2 caminos:

**A) Dejar los dominios como redirección a la URL actual (2 minutos, sin tocar código)**
En el panel de tu registrador de dominios (el que sea que gestione hoy `.es` y `.com` —
aunque canceles el *hosting* de Hostalia, los dominios se gestionan aparte):
- Busca "Redirección" / "URL Forwarding" / "Redirect".
- Crea una redirección **301 permanente** del dominio → `https://274h7lhu.qwenwork.page/`.
- Hazlo para ambos (`.es` y `.com`) y con/sin www.
Al escribirla el usuario llega a la web (cambia el dominio en la barra).

**B) Que tu dominio MUESTRE la web con TU dirección (recomiende esto si quieres "oficial de verdad")**
Sube este ZIP a un hosting gratuito que sí permite dominio propio, y luego apuntes:
- **Opción más simple y gratis:** Cloudflare Pages — creas un proyecto Pages, arrastras
  el ZIP descomprimido, y en "Custom domains" añades `thedamnpsychiatric.es` y
  `elpsiquiatricomaldito.com` (poniendo los nameservers de Cloudflare en tu registrador).
  Quedaría `https://thedamnpsychiatric.es/` con tu dominio real, sin marca de terceros,
  y el `.com` redirigido al `.es` con un "Redirect Rule".
- Alternativas equivalentes: Netlify (arrastrar y soltar + dominio), GitHub Pages (solo si el repo es público),
  o cualquier hosting barato que elijas en el futuro (cPanel: descomprime en `public_html`
  y ya está — el `.htaccess` incluido fuerza HTTPS y quita www).

Si algún día me pides "migrar a mi dominio", con la opción B lo dejo apuntando a
`https://thedamnpsychiatric.es/` en toda la web (canonical, sitemap, og, etc.).

## Si cancelas los dominios con Hostalia
- Los dominios los contrataste con ellos como intermediario; puedes conservarlos
  (los `.es` se transfieren a otro agente registrador sin borrar el dominio) o dejarlos morir.
- Antes de que caduquen, saca el **código de transferencia/auth-info** de cada uno.

## Cosas que se actualizan dentro del ZIP
- **Precio de Steam:** buscar `10,79` en `index.html` (hay 3 sitios).
- **Añadir un youtuber a la sección Creadores:** en `index.html` busca `CINTAS_DE_VISITANTES`
 y añade un bloque `tape-box`; en Pages me lo pides y lo hago yo.
- **Cambiar tráiler:** atributo `data-yt` del bloque `video-section`.

