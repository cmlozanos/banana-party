# Banana Party 2.0.0

## Cambios de esta versión

- Kit Family V2 local: fuente, tema claro/oscuro/sistema, viewport y puntos de sesión de una hora.
- Inicio vuelve al selector de este juego: no cambia la URL ni borra datos. El catálogo queda en el panel adulto.
- Pausa de adultos independiente del reto educativo y de la pausa manual; puntos únicamente en la llegada nativa, 10 por nivel y sin premiar el selector.
- Ajustes existentes trasladados sin clonar controles ni perder listeners. Audio apagado en cada carga; modo ligero por defecto (la preferencia explícita de Jump se conserva).
- Caché PWA v2.0.0 con los cuatro recursos locales exactos del kit, incluida la licencia OFL. Sin módulos ni CDN de ejecución.
- Corregida la colisión unidireccional: Phaser entrega GameObjects al callback; antes se interpretaba su velocidad como ausente y el mono chocaba desde abajo con la primera plataforma. Ahora asciende a través de ella y aterriza al caer.
- Corregidos toques de salto muy rápidos: soltar antes del siguiente frame ya no borra el salto pendiente. Caer al suelo y volver a saltar tiene regresión de navegador.
- HUD sin diagnóstico permanente (disponible con `?debug`), controles separados de la barra y fuente manuscrita local.
- Regresión: ruta con física Phaser real, movimiento de flechas y eventos del control de salto hasta completar la primera misión y entrar al nivel 2. No se teletransporta el jugador ni se invoca la meta desde la prueba.
- Los 50 presets siguen disponibles. Las alturas se validan estructuralmente; no se afirma que se hayan completado las 50 misiones.

## Validación y publicación

Ejecutar `make build check` y `make test` en este checkout. No se crea tag ni GitHub Release; esa coordinación es independiente.
Las pruebas de ruta acreditan la primera misión/pista, no una campaña completa ni hardware Android.

## Evidencia de esta entrega

- `make build check`: correcto; recursos locales y cuatro archivos del kit precargados.
- `make test`: correcto en Chromium 151.0.7922.34.
- Banana: 1280×800, 800×1280, 360×740 y 740×360; rotación, teclado, tacto, reto recurrente, pausa, Home local y recarga offline. Ruta real de misión 1 → nivel 2, 10 puntos; caída y salto posterior.
- No ejecutado en Chrome 95 ni tablet física. No se han recorrido todas las misiones ni combinaciones coche/pista. No se declara ausencia de otros fallos.
