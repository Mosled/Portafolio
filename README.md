# Mosled — Portfolio

Portfolio personal de **Mosled** — Product Designer que programa. Construido como tarjeta de presentación digital: sitio estático, rápido, accesible y sin dependencias.

**Live:** [mosled.github.io/Portafolio](https://mosled.github.io/Portafolio/)

---

## Características

- **Bilingüe** — Toggle ES/EN con persistencia en `localStorage`
- **Dark / Light mode** — Respeta la preferencia del sistema por defecto
- **100% vanilla** — HTML + CSS + JavaScript. Sin frameworks, sin build step
- **Editorial** — Tipografía variable (Fraunces + Figtree + JetBrains Mono)
- **Performant** — Un solo archivo JS, CSS con custom properties, fuentes vía Google Fonts con `preconnect`
- **Accesible** — Semántica correcta, focus visible, `prefers-reduced-motion` respetado
- **Responsive** — Mobile-first, adaptado a tablet y desktop
- **Cursor custom** — Se activa solo en dispositivos con puntero fino

---

## Estructura

```
.
├── index.html      # Estructura y contenido
├── styles.css      # Design tokens, temas y todos los estilos
├── script.js       # Toggles, reveals y cursor
└── README.md       # Este archivo
```

---

## Deploy en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `mosled.github.io` para dominio de usuario, o cualquier nombre si usarás un subdirectorio).
2. Sube los archivos al branch `main`.
3. Ve a **Settings → Pages**.
4. En **Source** selecciona `main` y carpeta `/ (root)`.
5. Guarda. En uno o dos minutos tu sitio estará en vivo.

---

## Personalización rápida

Los colores y espaciados están centralizados como CSS variables al inicio de `styles.css`:

```css
:root {
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Figtree", sans-serif;
  /* ... */
}

[data-theme="light"] { --bg: #FAF8F5; /* ... */ }
[data-theme="dark"]  { --bg: #0A1628; /* ... */ }
```

Para traducir contenido, añade los atributos `data-es` y `data-en` a cualquier elemento:

```html
<h2 data-es="Hola" data-en="Hello">Hola</h2>
```

---

## Contacto

- **Email:** tamaa3295@gmail.com
- **WhatsApp:** +52 771 330 6543
- **GitHub:** [@Mosled](https://github.com/Mosled)

---

*Diseñado y construido desde Zacualtipán, México.*
