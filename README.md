# ANESSI — El oficio está en el detalle

Landing editorial en español para la tornería fina de Hugo Anessi. Sitio estático sin dependencias de ejecución, construido con HTML, CSS y JavaScript.

## Dirección de diseño

Público: empresas y laboratorios que necesitan muestras metálicas, pequeñas piezas y pequeñas series. La propuesta pone el foco en el oficio y la atención al detalle, sin atribuir certificaciones, tolerancias o capacidades no confirmadas.

- Marfil `#edede5`: espacio, claridad y protagonismo del metal.
- Grafito `#202321`: carácter industrial y contraste.
- Naranja `#dc4b1d`: llamados a la acción y puntos de atención.
- Verde grisáceo `#cbd0c1`: tono humano para la trayectoria de Hugo.
- Tipografía Liberation Sans, local, bajo SIL Open Font License. Aviso incluido en `dist/assets/FONT-LICENSE.txt`.

## Recorrido y movimiento

1. Piezas recortadas que giran y se aproximan formando una composición abstracta.
2. Grilla de muestras, componentes y proceso que crece con el scroll.
3. Panel de detalle que se abre desde abajo a la derecha y ocupa la pantalla. Tres capítulos relacionan la muestra, el material y el proyecto.
4. Clientes que se revelan de izquierda a derecha con el scroll vertical.
5. Retrato recortado que entra delante de HUGO ANESSI y presentación de la trayectoria.
6. Opiniones de ejemplo, preparación de una consulta y cierre con ANESSI en gran escala.

Las animaciones usan `requestAnimationFrame` y posiciones de scroll, sin capturar la rueda ni impedir la navegación natural. Con `prefers-reduced-motion`, se presenta una versión sin escenas fijadas ni transformaciones de scroll. Los enlaces y formularios funcionan con teclado.

## Ejecución local

```sh
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Abrir `http://127.0.0.1:4173`. Comprobar sintaxis con `node --check dist/app.js`.

## Publicación

GitHub Pages publica `dist/` mediante `.github/workflows/pages.yml` en cada push a `main`. Todos los assets usan rutas relativas para funcionar bajo la URL de proyecto de GitHub Pages. No hay servicios externos, rastreadores, cookies ni claves requeridas.

## Contenido provisional

- Las cuatro imágenes son generadas y se identifican como ilustrativas. El retrato no representa el aspecto real de Hugo; reemplazarlo por una fotografía real cuando esté disponible.
- Los nombres se presentan como Siderar, Sidersa y Ternium, interpretando las denominaciones aproximadas del brief y consultando los sitios oficiales. Confirmar las referencias comerciales y los trabajos realizados. Las fichas no inventan alcances ni piezas entregadas.
- La trayectoria se expresa como “más de 40 años”, basada en el rango aproximado de 40–50 años proporcionado.
- No se proporcionaron correo, teléfono ni dirección. El formulario valida los campos y crea un TXT descargable en el navegador; muestra explícitamente que no envía la consulta. No almacena ni transmite datos. Conectar el destino real cuando el titular lo confirme.
- No se publican medidas, certificaciones, tolerancias, plazos garantizados ni una dirección no verificadas.

## Assets

En `dist/assets/`: `probeta.png`, `buje.png`, `torno.png` y `retrato-ilustrativo.png`. Los tres recortes conservan transparencia real. Las imágenes se generaron mediante la herramienta integrada ImageGen. Los prompts utilizados se conservan en `ASSETS.md`.

## Revisión de interacción

Las cuatro cards abren un `dialog` nativo individual con animación desde su posición. Escape, el botón de cierre y el fondo exterior cierran el modal. El fondo queda inmóvil y al cerrar se restauran scroll y foco. La llamada a la acción lleva al formulario con el tipo de trabajo seleccionado.

Galería y panel oscuro comparten una secuencia superpuesta: la grilla sigue visible detrás durante la expansión, sin una sección vacía entre ambas. Las fichas de empresas incluyen imágenes institucionales y enlaces a las fuentes, diferenciando contexto de empresa y alcance pendiente de documentar.

Las tres opiniones son textos de ejemplo, identificados en cada card y en el encabezado. No son opiniones verificadas ni se atribuyen a personas o empresas reales. Reemplazarlos cuando el titular aporte testimonios autorizados.
