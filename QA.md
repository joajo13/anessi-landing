# Verificación de la revisión

- Sintaxis JavaScript: `node --check dist/app.js`, correcta.
- Enlaces internos, IDs únicos y archivos de imágenes/fuentes: comprobados.
- Cuatro cards de producto: abren un detalle distinto, sin navegación al panel global.
- Tres fichas corporativas: imagen, texto, fuente oficial y aviso sobre el alcance sin documentar.
- Desktop 1440 × 900: modal de componente inspeccionado visualmente.
- Móvil 390 × 844: cuatro modales de producto y tres fichas de empresa; no hay overflow horizontal dentro del diálogo.
- Móvil 320 × 740: modal de pequeña serie con scroll interno, cierre de 44 px y CTA hacia contacto; categoría “Pequeña serie” seleccionada correctamente.
- Cierre repetido: restaura el scroll con diferencia inferior a 0,01 px y quita el bloqueo del body. El foco vuelve a la card.
- Secuencia de trabajo: galería y panel oscuro se mantienen en top=0 durante la expansión; la grilla conserva opacidad=1 debajo del recorte oscuro.
- Opiniones: tres ejemplos, sin autores o clientes atribuidos y con aviso visible.
- El navegador devolvió timeouts intermitentes al guardar capturas móviles; las comprobaciones funcionales y geométricas se completaron mediante el navegador y el DOM.

Se corrigió una carrera al abrir/cerrar diálogos rápidamente: la restauración del body y del scroll ahora ocurre de forma síncrona, sin depender del evento close diferido o del fin de una animación en segundo plano.
