# 🍌 Banana Party - Videojuego 2D para Niños

## Compatibilidad y acceso educativo (25 septiembre 2026)

Adaptación aprobada: funciona como sitio estático de GitHub Pages, sin Ubuntu,
CDN ni fuentes remotas. Salir conduce a https://cmlozanos.github.io/games/.
Phaser 3.70.0 se distribuye localmente sin modificaciones y con su licencia MIT
en `vendor/LICENSE-Phaser.txt`. Los recursos gráficos del juego siguen siendo propios.

- Retos del sistema compartido al entrar y cada 10 minutos de reloj real; se
  pausa el motor completo y se limpian teclas y dedos antes de reanudar.
- Botones táctiles independientes ← → ↑, teclado conservado y selector de
  niveles desplazable con el dedo. El botón ▦ vuelve al selector, ⌂ sale al portal.
- Canvas 2D evita requisitos de WebGL de GPUs antiguas; el cielo es un color de
  cámara, no una textura de miles de píxeles de altura.
- La simulación mantiene un mundo lógico de 800×600 y escala con FIT. Las 50
  pistas, constantes y físicas no cambian: alturas y alcance son iguales a la
  versión original a 800×600. Al rotar se escala la imagen, no se alteran los
  obstáculos ni la partida. Puede haber bandas libres en pantallas verticales.
- PWA instalable y arranque sin red tras la primera carga completa. El service
  worker borra únicamente cachés con prefijo `banana-party-`. Sonido apagado
  (este juego no utiliza pistas de audio).

Herramientas: `npm install`, `make build`, `make icons`, `make check`, `make test`.
`CHROME95_PATH=/ruta/a/Chromium make test` ejecuta la misma prueba en ese navegador.
`make build` genera el script clásico versionado desde `src/`; no requiere
import maps ni descarga módulos en ejecución. `make test` levanta un servidor
temporal local y comprueba la interfaz real, retos, pausa, controles y offline.
La compatibilidad del motor Chromium 95 no sustituye una prueba física de la
tablet Android 5.0.2 SM-T530NU.

Las secciones históricas siguientes describen la primera versión; ya no se usa CDN
ni es necesario servir módulos ES6 individuales.

Un videojuego 2D de ascensión vertical diseñado especialmente para niños de 5 años. El objetivo es hacer que un mono salte de plataforma en plataforma hacia arriba, recolectando bananas mientras asciende.

## 🎮 Características

- **Diseño amigable**: Estilo cartoon con colores vivos y personajes simpáticos
- **Fácil de jugar**: Controles simples con las flechas del teclado
- **Sin presión**: El mono nunca muere, solo continúa jugando
- **Progresivo**: La dificultad aumenta gradualmente mientras subes
- **Recursos SVG**: Todos los gráficos están en formato SVG escalable

## 🎯 Objetivo del Juego

- Controla al mono con las flechas del teclado
- Salta de plataforma en plataforma hacia arriba
- Recolecta todas las bananas que puedas
- Alcanza la mayor altura posible

## ⌨️ Controles

- **Flecha Izquierda** (←): Mover el mono a la izquierda
- **Flecha Derecha** (→): Mover el mono a la derecha
- **Flecha Arriba** (↑): Saltar

El mono puede moverse lateralmente incluso mientras está saltando.

## 🚀 Cómo Ejecutar el Juego

### Opción 1: Usando Make (Recomendado)

La forma más sencilla de ejecutar el juego:

1. Descomprime el archivo ZIP del juego
2. Abre una terminal en la carpeta raíz del proyecto
3. **Primera vez:** Instala las dependencias:
```bash
make install
```

Esto creará un entorno virtual de Python y instalará las dependencias de Node.js.

4. Ejecuta el servidor:
```bash
make run
```

El Makefile usará automáticamente el entorno virtual si existe, o detectará Python/Node.js instalado.

5. Abre tu navegador y ve a: `http://localhost:8000`

**Opciones adicionales:**
```bash
# Ejecutar en un puerto diferente
PORT=8080 make run

# Escuchar en todas las interfaces (útil para acceso desde otros dispositivos)
HOST=0.0.0.0 make run

# Ver ayuda
make help

# Solo crear entorno virtual (sin instalar dependencias)
make venv
```

### Opción 2: Servidor Local Manual

Si prefieres ejecutar el servidor manualmente:

1. Descomprime el archivo ZIP del juego
2. Abre una terminal en la carpeta raíz del proyecto
3. Ejecuta uno de estos comandos según tu sistema:

**Python 3:**
```bash
python -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Node.js:**
```bash
npx http-server -p 8000
```

4. Abre tu navegador y ve a: `http://localhost:8000`

### Opción 3: Servidor Web Local

Si tienes un servidor web local (como XAMPP, WAMP, o MAMP), simplemente coloca la carpeta del proyecto en el directorio de tu servidor web y accede a través del navegador.

### Opción 3: Abrir Directamente (Limitado)

Puedes intentar abrir `index.html` directamente en el navegador, pero algunas funciones pueden no funcionar debido a las restricciones CORS. Se recomienda usar un servidor local.

## 📁 Estructura del Proyecto

```
banana-party/
├── assets/
│   ├── sprites/
│   │   ├── monos/          # Sprites de los 5 monos con animaciones
│   │   ├── plataformas/    # Variaciones de plataformas
│   │   └── bananas/        # Sprite de banana
│   └── backgrounds/        # Fondo con cielo y montañas
├── src/
│   ├── game.js             # Lógica principal del juego
│   ├── player.js           # Control del personaje
│   ├── physics.js          # Gestión de físicas
│   └── ui.js               # Interfaz de usuario
├── venv/                   # Entorno virtual de Python (se crea con make install)
├── node_modules/            # Dependencias de Node.js (se crea con make install)
├── index.html              # Archivo HTML principal
├── style.css               # Estilos CSS
├── Makefile                # Makefile para ejecutar el servidor
├── package.json            # Configuración de Node.js
├── requirements.txt        # Dependencias de Python
└── README.md               # Este archivo
```

## 🎨 Recursos Gráficos

Todos los recursos gráficos están en formato SVG, lo que permite:
- Escalado sin pérdida de calidad
- Archivos pequeños y optimizados
- Fácil modificación

### Personajes
- 5 monos diferentes, cada uno con 4 animaciones:
  - Idle (reposo)
  - Caminar
  - Salto
  - Aterrizaje

### Plataformas
- 6 variaciones diferentes de plataformas flotantes
- Diseño único para cada plataforma

### Otros Elementos
- Banana con animación de flotación
- Fondo con cielo, nubes y montañas para scroll vertical

## 🛠️ Tecnologías Utilizadas

- **JavaScript ES6+**: Lenguaje de programación
- **Phaser 3**: Motor de juego 2D con físicas Arcade
- **HTML5 Canvas**: Renderizado del juego
- **SVG**: Formato de gráficos vectoriales
- **CSS3**: Estilos y animaciones

## 📝 Notas Técnicas

- El juego utiliza módulos ES6, por lo que requiere un servidor web para funcionar correctamente
- Phaser 3 se carga desde CDN para facilitar la ejecución
- Las físicas utilizan el motor Arcade de Phaser 3
- El scroll vertical es continuo y se genera contenido dinámicamente

## 🎯 Características de Diseño para Niños

- **Sin violencia**: El juego es completamente pacífico
- **Sin presión**: No hay temporizadores ni penalizaciones
- **Colores vivos**: Paleta de colores alegre y llamativa
- **Tipografía infantil**: Uso de Comic Sans MS para texto amigable
- **Feedback visual**: Efectos visuales al recolectar bananas
- **Progreso visible**: Contador grande de bananas y altura

## 🐛 Solución de Problemas

### El juego no carga
- Asegúrate de estar usando un servidor web local
- Verifica que todos los archivos estén en sus ubicaciones correctas
- Abre la consola del navegador (F12) para ver errores

### Los gráficos no se ven
- Verifica que la carpeta `assets` esté completa
- Asegúrate de que el servidor web pueda servir archivos SVG

### Los controles no funcionan
- Asegúrate de que la ventana del juego tenga el foco
- Verifica que estés usando las flechas del teclado

## 📄 Licencia

Este juego fue creado como proyecto educativo y de entretenimiento para niños.

## 👨‍💻 Créditos

Desarrollado como un videojuego 2D profesional para niños de 5 años, utilizando JavaScript moderno y Phaser 3.

---

¡Diviértete saltando y recolectando bananas! 🍌🐵
