/**
 * constants.js - Constantes del juego Banana Party
 * Todas las constantes numéricas, colores y configuraciones centralizadas
 */

export const PLAYER = {
    // Propiedades de movimiento
    SPEED: 300,
    JUMP_POWER: -1400, // Saltos más naturales y controlables
    GRAVITY: 800,
    BOUNCE: 0.1,
    MAX_VELOCITY_X: 500,
    MAX_VELOCITY_Y: 1500, // Velocidad máxima vertical más razonable
    FRICTION: 0.8, // Factor de fricción al dejar de moverse
    
    // Dimensiones del sprite
    WIDTH: 80,
    HEIGHT: 100,
    SCALE: 1.0,
    
    // Cuerpo de colisión
    BODY_WIDTH: 70,
    BODY_HEIGHT: 90,
    BODY_OFFSET_X: 5,
    BODY_OFFSET_Y: 5,
    
    // Detección de suelo
    GROUND_VELOCITY_THRESHOLD: 5, // Velocidad Y mínima para considerar en suelo
    IDLE_VELOCITY_THRESHOLD: 10, // Velocidad X mínima para considerar idle
    
    // Colores del mono (cuadrado simple)
    COLOR: 0xFF6B35, // Naranja/rojo
    BORDER_COLOR: 0x000000,
    BORDER_WIDTH: 4,
    EYE_COLOR: 0x000000,
    EYE_RADIUS: 8,
    EYE_LEFT_X: 20,
    EYE_RIGHT_X: 60,
    EYE_Y: 30,
    MOUTH_RADIUS: 15,
    MOUTH_Y: 60,
    
    // Renderizado
    DEPTH: 10,
    ALPHA: 1,
    ORIGIN_X: 0.5,
    ORIGIN_Y: 0.5,
    
    // Nombre de textura
    TEXTURE_MONO_CUADRADO: 'mono_cuadrado'
};

export const PLATFORM = {
    // Anchos directos de cada tipo de plataforma (más eficiente que calcular)
    WIDTHS: [250, 280, 310, 340, 370, 400], // type 1-6 respectivamente
    
    GRASS_HEIGHT: 20,
    DIRT_HEIGHT: 30,
    NUM_VARIATIONS: 6,
    
    // Prefijo de textura
    TEXTURE_PLATFORM_PREFIX: 'platforma',
    
    // Escala y renderizado
    SCALE: 1.3,
    DEPTH: 5,
    
    // Cuerpo de física (solo superficie superior - césped)
    // La altura visual total es (GRASS_HEIGHT + DIRT_HEIGHT) * SCALE = (20 + 30) * 1.3 = 65 píxeles
    // El cuerpo de colisión debe estar solo en la parte del césped (superficie superior)
    COLLISION_WIDTH_FACTOR: 0.95, // Porcentaje del ancho para colisión
    COLLISION_HEIGHT_BASE: 20, // Altura base del césped (sin escala) - la parte superior donde se puede caminar
    // El offset debe colocar el cuerpo justo en la parte superior de la plataforma
    // Como el sprite tiene origen en el centro, necesitamos mover el cuerpo hacia arriba
    COLLISION_OFFSET_Y: 0, // Se calculará dinámicamente basado en la altura total
    
    // Colores
    DIRT_COLOR: 0x654321, // Marrón tierra oscuro
    GRASS_COLOR: 0x7CB342, // Verde césped
    GRASS_DETAIL_COLOR: 0x558B2F, // Verde más oscuro para hierba
    SHADOW_COLOR: 0x3E2723,
    SHADOW_ALPHA: 0.5,
    SHADOW_HEIGHT: 5,
    
    // Detalles de césped
    GRASS_DETAIL_WIDTH: 3,
    GRASS_DETAIL_HEIGHT: 8,
    GRASS_DETAIL_SPACING: 15,
    GRASS_DETAIL_START_OFFSET: 10,
    
    // Espaciado entre plataformas (suficiente para saltar cómodamente)
    // Con JUMP_POWER de -1200 y GRAVITY de 800, el jugador puede saltar cómodamente
    // Necesitamos espaciado suficiente para que sea alcanzable y cómodo para niños
    // El espaciado vertical debe permitir que el jugador salte cómodamente entre plataformas
    MIN_SPACING: 280, // Espaciado mínimo suficiente para saltos cómodos
    MAX_SPACING: 380, // Espaciado máximo - suficiente espacio vertical para saltar y entrar
    
    // Generación inicial (reducida para evitar demasiadas plataformas)
    INITIAL_COUNT: 12, // Menos plataformas iniciales
    INITIAL_OFFSET_FROM_PLAYER: 200, // Primera plataforma a distancia cómoda
    
    // Generación dinámica
    NEW_PLATFORMS_COUNT: 5, // Plataformas nuevas a la vez
    NEW_PLATFORMS_OFFSET: 500, // Offset mayor para generar con suficiente anticipación
    
    // Colisión unidireccional
    COLLISION_THRESHOLD: 5 // Distancia máxima para considerar colisión desde arriba (pequeño para precisión)
};

export const BANANA = {
    // Escala y renderizado
    SCALE: 1.2,
    DEPTH: 6,
    
    // Cuerpo de física
    COLLISION_WIDTH_FACTOR: 0.8,
    COLLISION_HEIGHT_FACTOR: 0.8,
    
    // Animación de flotación (reducida para mantenerlas cerca de la plataforma)
    FLOAT_DISTANCE: 10, // Menos flotación para mantenerlas alcanzables
    FLOAT_DURATION: 1800,
    
    // Animación de rotación
    ROTATION_ANGLE: 10,
    ROTATION_DURATION: 2200,
    
    // Probabilidad de aparición (aumentada para que haya más bananas)
    SPAWN_PROBABILITY: 0.3, // 70% de probabilidad (Math.random() > 0.3)
    
    // Offset desde plataforma (justo encima de la superficie de la plataforma)
    OFFSET_FROM_PLATFORM: 30, // Muy cerca de la plataforma para fácil alcance
    
    // Colores temporales (si no se carga SVG)
    TEMP_COLOR: 0xFFD700, // Amarillo
    TEMP_STEM_COLOR: 0x90EE90, // Verde
    TEMP_WIDTH: 35,
    TEMP_HEIGHT: 70,
    TEMP_STEM_X: 12,
    TEMP_STEM_Y: -30,
    TEMP_STEM_WIDTH: 10,
    TEMP_STEM_HEIGHT: 18
};

export const WORLD = {
    // Altura del mundo (multiplicador de la altura de pantalla)
    HEIGHT_MULTIPLIER: 10,
    
    // Suelo
    GROUND_Y_OFFSET: 50, // Offset desde el fondo del mundo
    GROUND_HEIGHT: 50,
    GROUND_DIRT_HEIGHT: 30,
    GROUND_GRASS_HEIGHT: 20,
    
    // Paisaje base
    LANDSCAPE_HEIGHT: 100,
    
    // Posición inicial del jugador
    PLAYER_START_OFFSET: 120, // Offset desde el suelo
    
    // Altura para cálculo de metros
    METERS_DIVISOR: 10, // Dividir píxeles entre este valor para obtener metros
    
    // Generación de nuevas plataformas
    PLATFORM_GENERATION_THRESHOLD: 1500, // Distancia desde altura máxima para generar nuevas
    
    // Físicas
    PHYSICS_BOUNDS_X: 0,
    PHYSICS_BOUNDS_Y: 0
};

export const CAMERA = {
    // Scroll factors (velocidad de scroll relativa al jugador)
    BACKGROUND_SCROLL_FACTOR: 0.3,
    CLOUD_SCROLL_FACTOR: 0.2,
    LANDSCAPE_SCROLL_FACTOR: 0.5,
    
    // Seguimiento del jugador
    FOLLOW_LERP_X: 0, // Sin seguimiento horizontal
    FOLLOW_LERP_Y: 0.1, // Seguimiento vertical suave
    
    // Offset para posicionar al jugador en la parte inferior de la pantalla
    // Offset positivo mueve la cámara hacia abajo, manteniendo al jugador arriba en pantalla
    // Offset negativo mueve la cámara hacia arriba, manteniendo al jugador abajo en pantalla
    FOLLOW_OFFSET_Y: 0, // Se calculará dinámicamente para mantener jugador abajo
    
    // Deadzone (área donde la cámara no se mueve)
    // Deadzone grande en Y para mantener al jugador en la parte inferior de la pantalla
    DEADZONE_X: 0,
    DEADZONE_Y: 300 // Deadzone grande para mantener jugador en parte inferior
};

export const BACKGROUND = {
    // Cielo
    SKY_COLOR: 0x87CEEB, // Azul cielo claro
    
    // Nubes
    CLOUD_COUNT: 25,
    CLOUD_MIN_SIZE: 80,
    CLOUD_MAX_SIZE: 150,
    CLOUD_COLOR: 0xFFFFFF,
    CLOUD_ALPHA: 0.9,
    CLOUD_DEPTH: 1,
    
    // Proporciones de nube
    CLOUD_MAIN_RADIUS: 0.4,
    CLOUD_SIDE_RADIUS: 0.35,
    CLOUD_TOP_RADIUS: 0.3,
    CLOUD_SMALL_RADIUS: 0.25,
    CLOUD_SIDE_OFFSET: 0.3,
    CLOUD_TOP_OFFSET: 0.2,
    CLOUD_SMALL_OFFSET: 0.15,
    CLOUD_HEIGHT_FACTOR: 0.6
};

export const UI = {
    // Contador de bananas
    BANANA_TEXT_X: 20, // Offset desde la derecha (se usa con setOrigin)
    BANANA_TEXT_Y: 20,
    BANANA_TEXT_FONT_SIZE: '48px',
    BANANA_TEXT_FONT_FAMILY: 'Roboto, sans-serif',
    BANANA_TEXT_COLOR: '#FFD700',
    BANANA_TEXT_STROKE: '#000000',
    BANANA_TEXT_STROKE_THICKNESS: 4,
    BANANA_TEXT_ORIGIN_X: 1, // Alineado a la derecha
    BANANA_TEXT_ORIGIN_Y: 0,
    
    // Indicador de altura
    HEIGHT_TEXT_X: 20,
    HEIGHT_TEXT_Y: 20,
    HEIGHT_TEXT_FONT_SIZE: '32px',
    HEIGHT_TEXT_FONT_FAMILY: 'Comic Sans MS, cursive',
    HEIGHT_TEXT_COLOR: '#FFFFFF',
    HEIGHT_TEXT_STROKE: '#000000',
    HEIGHT_TEXT_STROKE_THICKNESS: 3,
    
    // Instrucciones
    INSTRUCTIONS_Y: 200,
    INSTRUCTIONS_FONT_SIZE: '28px',
    INSTRUCTIONS_FONT_FAMILY: 'Comic Sans MS, cursive',
    INSTRUCTIONS_COLOR: '#FFFFFF',
    INSTRUCTIONS_STROKE: '#000000',
    INSTRUCTIONS_STROKE_THICKNESS: 3,
    INSTRUCTIONS_FADE_DELAY: 5000, // Milisegundos antes de empezar a desaparecer
    INSTRUCTIONS_FADE_DURATION: 2000, // Duración del fade
    
    // Efecto de recolección de banana
    BANANA_COLLECT_SCALE: 1.3,
    BANANA_COLLECT_DURATION: 200,
    
    // Scroll factor (0 = fijo en pantalla)
    SCROLL_FACTOR: 0
};

export const PHYSICS = {
    // Gravedad global reducida para saltos más flotantes y fáciles de controlar
    GRAVITY_Y: 800, // Gravedad consistente con PLAYER.GRAVITY
    
    // Configuración de mundo
    WORLD_BOUNDS_X: 0,
    WORLD_BOUNDS_Y: 0
};

export const EFFECTS = {
    // Shake de cámara al recolectar banana
    CAMERA_SHAKE_DURATION: 100,
    CAMERA_SHAKE_INTENSITY: 0.01
};

export const ASSETS = {
    TEXTURE_MONO_CUADRADO: 'mono_cuadrado',
    TEXTURE_BANANA: 'banana',
    TEXTURE_FONDO_CIELO: 'fondo_cielo',
    TEXTURE_LANDSCAPE: 'landscape',
    TEXTURE_GROUND: 'ground',
    TEXTURE_PLATFORM_PREFIX: 'platforma',
    TEXTURE_CLOUD_PREFIX: 'cloud_'
};

export const LEVELS = {
    // Meta visual (configuración global)
    GOAL_SIZE: 150, // Tamaño del sprite de meta (más grande y visible)
    GOAL_COLLISION_SIZE: 200, // Tamaño del cuerpo de colisión (más grande para facilitar contacto)
    GOAL_COLOR: 0xFFD700, // Color dorado del sprite
    GOAL_BORDER_COLOR: 0xFFA500, // Color naranja del borde
    GOAL_BORDER_WIDTH: 8, // Grosor del borde
    GOAL_CENTER_CIRCLE_COLOR: 0xFFFFFF, // Color del círculo central
    GOAL_CENTER_CIRCLE_ALPHA: 0.8, // Transparencia del círculo central
    GOAL_CENTER_CIRCLE_RADIUS_FACTOR: 0.15, // Factor del radio del círculo (relativo al tamaño)
    GOAL_DEPTH: 15, // Profundidad de renderizado
    GOAL_TINT: 0xFFFFFF, // Tinte para hacerlo más visible
    
    // Colores por nivel
    LEVEL_COLORS: [
        { // Nivel 1
            sky: 0x87CEEB, // Azul cielo claro
            grass: 0x7CB342, // Verde césped
            dirt: 0x654321 // Marrón tierra
        },
        { // Nivel 2
            sky: 0xFFB6C1, // Rosa claro
            grass: 0x90EE90, // Verde claro
            dirt: 0x8B4513 // Marrón silla
        },
        { // Nivel 3
            sky: 0xFFE4B5, // Amarillo claro
            grass: 0x98FB98, // Verde pálido
            dirt: 0xA0522D // Marrón siena
        },
        { // Nivel 4
            sky: 0xE0E0E0, // Gris claro
            grass: 0xC0C0C0, // Gris plata
            dirt: 0x696969 // Gris oscuro
        },
        { // Nivel 5
            sky: 0xFF69B4, // Rosa hot
            grass: 0xFFB6C1, // Rosa claro
            dirt: 0x8B008B // Magenta oscuro
        },
        { // Nivel 6
            sky: 0x00CED1, // Turquesa oscuro
            grass: 0x7FFFD4, // Aquamarine
            dirt: 0x008B8B // Cyan oscuro
        },
        { // Nivel 7 - ROJO
            sky: 0xFF6B6B, // Rojo claro
            grass: 0xFF4757, // Rojo
            dirt: 0xC92A2A // Rojo oscuro
        },
        { // Nivel 8
            sky: 0x9B59B6, // Púrpura
            grass: 0x8E44AD, // Púrpura oscuro
            dirt: 0x6C3483 // Púrpura muy oscuro
        },
        { // Nivel 9
            sky: 0x3498DB, // Azul
            grass: 0x2980B9, // Azul oscuro
            dirt: 0x1F618D // Azul muy oscuro
        },
        { // Nivel 10
            sky: 0xF39C12, // Naranja
            grass: 0xE67E22, // Naranja oscuro
            dirt: 0xD35400 // Naranja muy oscuro
        },
        { // Nivel 11
            sky: 0xDDEAAD,
            grass: 0xC2E051,
            dirt: 0x95B714
        },
        { // Nivel 12
            sky: 0xADCBEA,
            grass: 0x5198E0,
            dirt: 0x1465B7
        },
        { // Nivel 13
            sky: 0xEAADBA,
            grass: 0xE0516F,
            dirt: 0xB71436
        },
        { // Nivel 14
            sky: 0xADEAB2,
            grass: 0x51E05D,
            dirt: 0x14B722
        },
        { // Nivel 15
            sky: 0xC4ADEA,
            grass: 0x8751E0,
            dirt: 0x5114B7
        },
        { // Nivel 16
            sky: 0xEAD6AD,
            grass: 0xE0B151,
            dirt: 0xB78114
        },
        { // Nivel 17
            sky: 0xADEAE8,
            grass: 0x51E0DA,
            dirt: 0x14B7B1
        },
        { // Nivel 18
            sky: 0xEAADDB,
            grass: 0xE051BC,
            dirt: 0xB7148E
        },
        { // Nivel 19
            sky: 0xC9EAAD,
            grass: 0x92E051,
            dirt: 0x5EB714
        },
        { // Nivel 20
            sky: 0xADB7EA,
            grass: 0x5169E0,
            dirt: 0x142FB7
        },
        { // Nivel 21
            sky: 0xEAB5AD,
            grass: 0xE06351,
            dirt: 0xB72914
        },
        { // Nivel 22
            sky: 0xADEAC7,
            grass: 0x51E08D,
            dirt: 0x14B758
        },
        { // Nivel 23
            sky: 0xD8ADEA,
            grass: 0xB751E0,
            dirt: 0x8814B7
        },
        { // Nivel 24
            sky: 0xEAEAAD,
            grass: 0xDFE051,
            dirt: 0xB7B714
        },
        { // Nivel 25
            sky: 0xADD8EA,
            grass: 0x51B6E0,
            dirt: 0x1487B7
        },
        { // Nivel 26
            sky: 0xEAADC6,
            grass: 0xE0518C,
            dirt: 0xB71457
        },
        { // Nivel 27
            sky: 0xB4EAAD,
            grass: 0x62E051,
            dirt: 0x28B714
        },
        { // Nivel 28
            sky: 0xB7ADEA,
            grass: 0x6951E0,
            dirt: 0x3014B7
        },
        { // Nivel 29
            sky: 0xEAC9AD,
            grass: 0xE09351,
            dirt: 0xB75F14
        },
        { // Nivel 30
            sky: 0xADEADB,
            grass: 0x51E0BD,
            dirt: 0x14B78F
        },
        { // Nivel 31
            sky: 0xEAADE7,
            grass: 0xE051D9,
            dirt: 0xB714B0
        },
        { // Nivel 32
            sky: 0xD5EAAD,
            grass: 0xB0E051,
            dirt: 0x80B714
        },
        { // Nivel 33
            sky: 0xADC4EA,
            grass: 0x5186E0,
            dirt: 0x1450B7
        },
        { // Nivel 34
            sky: 0xEAADB2,
            grass: 0xE0515C,
            dirt: 0xB71421
        },
        { // Nivel 35
            sky: 0xADEABA,
            grass: 0x51E070,
            dirt: 0x14B737
        },
        { // Nivel 36
            sky: 0xCCADEA,
            grass: 0x9951E0,
            dirt: 0x6614B7
        },
        { // Nivel 37
            sky: 0xEADEAD,
            grass: 0xE0C351,
            dirt: 0xB79614
        },
        { // Nivel 38
            sky: 0xADE5EA,
            grass: 0x51D3E0,
            dirt: 0x14A9B7
        },
        { // Nivel 39
            sky: 0xEAADD3,
            grass: 0xE051AA,
            dirt: 0xB71479
        },
        { // Nivel 40
            sky: 0xC1EAAD,
            grass: 0x80E051,
            dirt: 0x49B714
        },
        { // Nivel 41
            sky: 0xADAFEA,
            grass: 0x5156E0,
            dirt: 0x141AB7
        },
        { // Nivel 42
            sky: 0xEABDAD,
            grass: 0xE07651,
            dirt: 0xB73E14
        },
        { // Nivel 43
            sky: 0xADEACE,
            grass: 0x51E09F,
            dirt: 0x14B76D
        },
        { // Nivel 44
            sky: 0xE0ADEA,
            grass: 0xC951E0,
            dirt: 0x9D14B7
        },
        { // Nivel 45
            sky: 0xE2EAAD,
            grass: 0xCDE051,
            dirt: 0xA2B714
        },
        { // Nivel 46
            sky: 0xADD0EA,
            grass: 0x51A4E0,
            dirt: 0x1472B7
        },
        { // Nivel 47
            sky: 0xEAADBE,
            grass: 0xE0517A,
            dirt: 0xB71442
        },
        { // Nivel 48
            sky: 0xADEAAD,
            grass: 0x51E052,
            dirt: 0x14B715
        },
        { // Nivel 49
            sky: 0xBFADEA,
            grass: 0x7C51E0,
            dirt: 0x4514B7
        },
        { // Nivel 50
            sky: 0xEAD1AD,
            grass: 0xE0A551,
            dirt: 0xB77414
        }
    ],
    // Niveles predefinidos con plataformas en posiciones fijas
    // Cálculos basados en física: JUMP_POWER=-1200, GRAVITY=800, SPEED=300
    // Altura máxima del salto: 900px, Distancia horizontal máxima: 900px
    // Para niños de 5 años, usamos saltos más cortos: vertical 200-400px, horizontal 100-400px
    // Cada nivel es un objeto con {platforms, goalHeight}
    // platforms: array de objetos {x, y, type, hasBanana}
    //   x: factor de posición horizontal (0.0 a 1.0, donde 0.5 es el centro)
    //   y: distancia vertical desde el suelo en píxeles
    //   type: número de variación de plataforma (0-5)
    //   hasBanana: si tiene banana encima
    // goalHeight: altura desde el suelo hasta la meta en píxeles
    PRESETS: [
        // Nivel 1 - Saltos fáciles y progresivos (vertical: mínimo 300px, horizontal: moderado)
        // Patrón diseñado para niños de 5 años: desplazamientos horizontales suaves (máx 30%)
        // type: 0=250px, 1=280px, 2=310px, 3=340px, 4=370px, 5=400px
        {
            goalHeight: 3400, // Altura de la meta desde el suelo
            platforms: [
            { x: 0.5, y: 200, type: 1, hasBanana: true },   // 280px ancho - Primera plataforma cerca del suelo (centro)
            { x: 0.4, y: 500, type: 2, hasBanana: false },  // 310px ancho - +300px vertical, -10% horizontal (ligera izquierda)
            { x: 0.6, y: 800, type: 1, hasBanana: true },   // 280px ancho - +300px vertical, +20% horizontal (ligera derecha)
            { x: 0.5, y: 1100, type: 3, hasBanana: false }, // 340px ancho - +300px vertical, centro (descanso)
            { x: 0.35, y: 1400, type: 2, hasBanana: true }, // 310px ancho - +300px vertical, -15% horizontal (izquierda moderada)
            { x: 0.65, y: 1700, type: 1, hasBanana: false }, // 280px ancho - +300px vertical, +15% horizontal (derecha moderada)
            { x: 0.5, y: 2000, type: 4, hasBanana: true },  // 370px ancho - +300px vertical, centro (descanso)
            { x: 0.4, y: 2300, type: 2, hasBanana: false }, // 310px ancho - +300px vertical, -10% horizontal (izquierda suave)
            { x: 0.6, y: 2600, type: 3, hasBanana: true },   // 340px ancho - +300px vertical, +10% horizontal (derecha suave)
            { x: 0.45, y: 2900, type: 1, hasBanana: false }, // 280px ancho - +300px vertical, -5% horizontal (casi centro)
            { x: 0.5, y: 3200, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, plataforma antes de la meta (centro)
            ]
        },
        // Nivel 2 - Saltos más desafiantes (vertical: mínimo 300px, horizontal: más variado)
        // type: 0=250px, 1=280px, 2=310px, 3=340px, 4=370px, 5=400px
        {
            goalHeight: 3400, // Altura de la meta desde el suelo
            platforms: [
            { x: 0.5, y: 200, type: 1, hasBanana: true },   // 280px ancho - Primera plataforma cerca del suelo (centro)
            { x: 0.4, y: 500, type: 2, hasBanana: false },  // 310px ancho - +300px vertical, -10% horizontal (ligera izquierda)
            { x: 0.6, y: 800, type: 1, hasBanana: true },   // 280px ancho - +300px vertical, +20% horizontal (ligera derecha)
            { x: 0.5, y: 1100, type: 3, hasBanana: false }, // 340px ancho - +300px vertical, centro (descanso)
            { x: 0.35, y: 1400, type: 2, hasBanana: true }, // 310px ancho - +300px vertical, -15% horizontal (izquierda moderada)
            { x: 0.65, y: 1700, type: 1, hasBanana: false }, // 280px ancho - +300px vertical, +15% horizontal (derecha moderada)
            { x: 0.5, y: 2000, type: 4, hasBanana: true },  // 370px ancho - +300px vertical, centro (descanso)
            { x: 0.4, y: 2300, type: 2, hasBanana: false }, // 310px ancho - +300px vertical, -10% horizontal (izquierda suave)
            { x: 0.6, y: 2600, type: 3, hasBanana: true },   // 340px ancho - +300px vertical, +10% horizontal (derecha suave)
            { x: 0.45, y: 2900, type: 1, hasBanana: false }, // 280px ancho - +300px vertical, -5% horizontal (casi centro)
            { x: 0.5, y: 3200, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, plataforma antes de la meta (centro)
            ]
        },
        // Nivel 3 - Saltos más largos (vertical: mínimo 300px, horizontal: variado)
        // type: 0=250px, 1=280px, 2=310px, 3=340px, 4=370px, 5=400px
        {
            goalHeight: 3150, // Altura de la meta desde el suelo
            platforms: [
            { x: 0.5, y: 250, type: 1, hasBanana: true },   // 280px ancho
            { x: 0.2, y: 550, type: 2, hasBanana: false },  // 310px ancho - +300px vertical, -30% horizontal
            { x: 0.8, y: 850, type: 1, hasBanana: true },   // 280px ancho - +300px vertical, +60% horizontal
            { x: 0.5, y: 1150, type: 3, hasBanana: false }, // 340px ancho - +300px vertical, -30% horizontal
            { x: 0.1, y: 1450, type: 2, hasBanana: true },  // 310px ancho - +300px vertical, -40% horizontal
            { x: 0.9, y: 1750, type: 3, hasBanana: false }, // 340px ancho - +300px vertical, +80% horizontal
            { x: 0.3, y: 2050, type: 4, hasBanana: true },  // 370px ancho - +300px vertical, -60% horizontal
            { x: 0.7, y: 2350, type: 2, hasBanana: false }, // 310px ancho - +300px vertical, +40% horizontal
            { x: 0.5, y: 2650, type: 3, hasBanana: true },  // 340px ancho - +300px vertical, -20% horizontal
            { x: 0.5, y: 2950, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, plataforma antes de la meta
            ]
        },
        // Nivel 4 - Patrón más complejo (vertical: mínimo 300px, horizontal: extremos)
        // type: 0=250px, 1=280px, 2=310px, 3=340px, 4=370px, 5=400px
        {
            goalHeight: 2900, // Altura de la meta desde el suelo
            platforms: [
            { x: 0.5, y: 300, type: 2, hasBanana: true },   // 310px ancho
            { x: 0.3, y: 600, type: 3, hasBanana: false },  // 340px ancho - +300px vertical, -20% horizontal
            { x: 0.7, y: 900, type: 2, hasBanana: true },   // 310px ancho - +300px vertical, +40% horizontal
            { x: 0.5, y: 1200, type: 4, hasBanana: false },  // 370px ancho - +300px vertical, -20% horizontal
            { x: 0.2, y: 1500, type: 3, hasBanana: true },  // 340px ancho - +300px vertical, -30% horizontal
            { x: 0.8, y: 1800, type: 4, hasBanana: false },  // 370px ancho - +300px vertical, +60% horizontal
            { x: 0.4, y: 2100, type: 3, hasBanana: true },   // 340px ancho - +300px vertical, -40% horizontal
            { x: 0.6, y: 2400, type: 4, hasBanana: false },  // 370px ancho - +300px vertical, +20% horizontal
            { x: 0.5, y: 2700, type: 5, hasBanana: false },  // 400px ancho - +300px vertical, plataforma antes de la meta
            ]
        },
        // Nivel 5 - Patrón rosa con saltos variados (vertical: mínimo 300px)
        // type: 0=250px, 1=280px, 2=310px, 3=340px, 4=370px, 5=400px
        {
            goalHeight: 2900, // Altura de la meta desde el suelo
            platforms: [
            { x: 0.5, y: 350, type: 3, hasBanana: true },   // 340px ancho
            { x: 0.2, y: 650, type: 4, hasBanana: false },  // 370px ancho - +300px vertical, -30% horizontal
            { x: 0.8, y: 950, type: 3, hasBanana: true },   // 340px ancho - +300px vertical, +60% horizontal
            { x: 0.5, y: 1250, type: 5, hasBanana: false },  // 400px ancho - +300px vertical, -30% horizontal
            { x: 0.1, y: 1550, type: 4, hasBanana: true },  // 370px ancho - +300px vertical, -40% horizontal
            { x: 0.9, y: 1850, type: 5, hasBanana: false },  // 400px ancho - +300px vertical, +80% horizontal
            { x: 0.3, y: 2150, type: 4, hasBanana: true },  // 370px ancho - +300px vertical, -60% horizontal
            { x: 0.5, y: 2700, type: 5, hasBanana: false },  // 400px ancho - +300px vertical, plataforma antes de la meta
            ]
        },
        // Nivel 6 - Patrón turquesa con saltos desafiantes (vertical: mínimo 300px)
        // type: 0=250px, 1=280px, 2=310px, 3=340px, 4=370px, 5=400px
        {
            goalHeight: 3100, // Altura de la meta desde el suelo
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },   // 310px ancho - Primera plataforma cerca del suelo
            { x: 0.3, y: 500, type: 3, hasBanana: false },  // 340px ancho - +300px vertical, -20% horizontal
            { x: 0.7, y: 800, type: 4, hasBanana: true },   // 370px ancho - +300px vertical, +40% horizontal
            { x: 0.5, y: 1100, type: 2, hasBanana: false }, // 310px ancho - +300px vertical, centro
            { x: 0.4, y: 1400, type: 5, hasBanana: true },  // 400px ancho - +300px vertical, -10% horizontal
            { x: 0.6, y: 1700, type: 3, hasBanana: false }, // 340px ancho - +300px vertical, +20% horizontal
            { x: 0.2, y: 2000, type: 4, hasBanana: true },  // 370px ancho - +300px vertical, -40% horizontal
            { x: 0.8, y: 2300, type: 2, hasBanana: false }, // 310px ancho - +300px vertical, +60% horizontal
            { x: 0.5, y: 2600, type: 5, hasBanana: true },  // 400px ancho - +300px vertical, centro
            { x: 0.5, y: 2900, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, plataforma antes de la meta
            ]
        },
        // Nivel 7 - ROJO - Patrón intenso con saltos variados (vertical: mínimo 300px)
        // type: 0=250px, 1=280px, 2=310px, 3=340px, 4=370px, 5=400px
        {
            goalHeight: 3150, // Altura de la meta desde el suelo
            platforms: [
            { x: 0.5, y: 250, type: 3, hasBanana: true },   // 340px ancho - Primera plataforma cerca del suelo
            { x: 0.2, y: 550, type: 4, hasBanana: false },  // 370px ancho - +300px vertical, -30% horizontal
            { x: 0.8, y: 850, type: 5, hasBanana: true },   // 400px ancho - +300px vertical, +60% horizontal
            { x: 0.1, y: 1150, type: 3, hasBanana: false }, // 340px ancho - +300px vertical, -40% horizontal
            { x: 0.9, y: 1450, type: 4, hasBanana: true },  // 370px ancho - +300px vertical, +80% horizontal
            { x: 0.3, y: 1750, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, -60% horizontal
            { x: 0.7, y: 2050, type: 2, hasBanana: true },  // 310px ancho - +300px vertical, +40% horizontal
            { x: 0.4, y: 2350, type: 4, hasBanana: false }, // 370px ancho - +300px vertical, -30% horizontal
            { x: 0.6, y: 2650, type: 5, hasBanana: true },  // 400px ancho - +300px vertical, +20% horizontal
            { x: 0.5, y: 2950, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, plataforma antes de la meta
            ]
        },
        // Nivel 8 - Púrpura - Patrón elegante (vertical: mínimo 300px)
        // type: 0=250px, 1=280px, 2=310px, 3=340px, 4=370px, 5=400px
        {
            goalHeight: 3100, // Altura de la meta desde el suelo
            platforms: [
            { x: 0.5, y: 200, type: 4, hasBanana: true },   // 370px ancho - Primera plataforma cerca del suelo
            { x: 0.3, y: 500, type: 5, hasBanana: false },  // 400px ancho - +300px vertical, -20% horizontal
            { x: 0.7, y: 800, type: 3, hasBanana: true },   // 340px ancho - +300px vertical, +40% horizontal
            { x: 0.2, y: 1100, type: 4, hasBanana: false }, // 370px ancho - +300px vertical, -50% horizontal
            { x: 0.8, y: 1400, type: 5, hasBanana: true },  // 400px ancho - +300px vertical, +60% horizontal
            { x: 0.4, y: 1700, type: 2, hasBanana: false }, // 310px ancho - +300px vertical, -40% horizontal
            { x: 0.6, y: 2000, type: 4, hasBanana: true },  // 370px ancho - +300px vertical, +20% horizontal
            { x: 0.1, y: 2300, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, -50% horizontal
            { x: 0.9, y: 2600, type: 3, hasBanana: true },  // 340px ancho - +300px vertical, +80% horizontal
            { x: 0.5, y: 2900, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, plataforma antes de la meta
            ]
        },
        // Nivel 9 - Azul - Patrón acuático (vertical: mínimo 300px)
        // type: 0=250px, 1=280px, 2=310px, 3=340px, 4=370px, 5=400px
        {
            goalHeight: 3150, // Altura de la meta desde el suelo
            platforms: [
            { x: 0.5, y: 250, type: 3, hasBanana: true },   // 340px ancho
            { x: 0.4, y: 550, type: 4, hasBanana: false },  // 370px ancho - +300px vertical, -10% horizontal
            { x: 0.6, y: 850, type: 5, hasBanana: true },   // 400px ancho - +300px vertical, +20% horizontal
            { x: 0.3, y: 1150, type: 2, hasBanana: false }, // 310px ancho - +300px vertical, -20% horizontal
            { x: 0.7, y: 1450, type: 4, hasBanana: true },  // 370px ancho - +300px vertical, +40% horizontal
            { x: 0.2, y: 1750, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, -50% horizontal
            { x: 0.8, y: 2050, type: 3, hasBanana: true },  // 340px ancho - +300px vertical, +60% horizontal
            { x: 0.5, y: 2350, type: 4, hasBanana: false }, // 370px ancho - +300px vertical, centro
            { x: 0.5, y: 2650, type: 5, hasBanana: true },  // 400px ancho - +300px vertical, centro
            { x: 0.5, y: 2950, type: 5, hasBanana: false }, // 400px ancho - +300px vertical, plataforma antes de la meta
            ]
        },
        // Nivel 10 - Patrón variado
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.3, y: 500, type: 3, hasBanana: false },
            { x: 0.7, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.2, y: 1400, type: 3, hasBanana: true },
            { x: 0.8, y: 1700, type: 4, hasBanana: false },
            { x: 0.4, y: 2000, type: 3, hasBanana: true },
            { x: 0.6, y: 2300, type: 4, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 11 - Patrón zigzag
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.5, y: 200, type: 1, hasBanana: true },
            { x: 0.3, y: 500, type: 2, hasBanana: false },
            { x: 0.7, y: 800, type: 1, hasBanana: true },
            { x: 0.3, y: 1100, type: 3, hasBanana: false },
            { x: 0.7, y: 1400, type: 2, hasBanana: true },
            { x: 0.3, y: 1700, type: 4, hasBanana: false },
            { x: 0.7, y: 2000, type: 3, hasBanana: true },
            { x: 0.5, y: 2300, type: 4, hasBanana: false },
            { x: 0.3, y: 2600, type: 5, hasBanana: true },
            { x: 0.7, y: 2900, type: 5, hasBanana: false },
            { x: 0.5, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 12 - Patrón centro-extremos
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.2, y: 500, type: 2, hasBanana: false },
            { x: 0.8, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.1, y: 1400, type: 3, hasBanana: true },
            { x: 0.9, y: 1700, type: 3, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.2, y: 2300, type: 4, hasBanana: false },
            { x: 0.8, y: 2600, type: 4, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 13 - Patrón serpiente
        {
            goalHeight: 3400,
            platforms: [
            { x: 0.2, y: 200, type: 1, hasBanana: true },
            { x: 0.4, y: 500, type: 2, hasBanana: false },
            { x: 0.6, y: 800, type: 1, hasBanana: true },
            { x: 0.8, y: 1100, type: 3, hasBanana: false },
            { x: 0.6, y: 1400, type: 2, hasBanana: true },
            { x: 0.4, y: 1700, type: 4, hasBanana: false },
            { x: 0.2, y: 2000, type: 3, hasBanana: true },
            { x: 0.4, y: 2300, type: 4, hasBanana: false },
            { x: 0.6, y: 2600, type: 5, hasBanana: true },
            { x: 0.8, y: 2900, type: 5, hasBanana: false },
            { x: 0.5, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 14 - Patrón progresivo
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.45, y: 500, type: 2, hasBanana: false },
            { x: 0.4, y: 800, type: 3, hasBanana: true },
            { x: 0.35, y: 1100, type: 3, hasBanana: false },
            { x: 0.3, y: 1400, type: 4, hasBanana: true },
            { x: 0.25, y: 1700, type: 4, hasBanana: false },
            { x: 0.3, y: 2000, type: 5, hasBanana: true },
            { x: 0.4, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 15 - Patrón alternado
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.3, y: 200, type: 1, hasBanana: true },
            { x: 0.7, y: 500, type: 2, hasBanana: false },
            { x: 0.3, y: 800, type: 3, hasBanana: true },
            { x: 0.7, y: 1100, type: 2, hasBanana: false },
            { x: 0.3, y: 1400, type: 4, hasBanana: true },
            { x: 0.7, y: 1700, type: 3, hasBanana: false },
            { x: 0.3, y: 2000, type: 5, hasBanana: true },
            { x: 0.7, y: 2300, type: 4, hasBanana: false },
            { x: 0.3, y: 2600, type: 5, hasBanana: true },
            { x: 0.7, y: 2900, type: 5, hasBanana: false },
            { x: 0.5, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 16 - Patrón variado
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.4, y: 500, type: 2, hasBanana: false },
            { x: 0.6, y: 800, type: 3, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.35, y: 1400, type: 3, hasBanana: true },
            { x: 0.65, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.4, y: 2300, type: 4, hasBanana: false },
            { x: 0.6, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 17 - Patrón zigzag amplio
        {
            goalHeight: 3400,
            platforms: [
            { x: 0.2, y: 200, type: 2, hasBanana: true },
            { x: 0.8, y: 500, type: 2, hasBanana: false },
            { x: 0.2, y: 800, type: 3, hasBanana: true },
            { x: 0.8, y: 1100, type: 3, hasBanana: false },
            { x: 0.2, y: 1400, type: 4, hasBanana: true },
            { x: 0.8, y: 1700, type: 4, hasBanana: false },
            { x: 0.2, y: 2000, type: 5, hasBanana: true },
            { x: 0.8, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.2, y: 2900, type: 5, hasBanana: false },
            { x: 0.8, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 18 - Patrón centro con variaciones
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 1, hasBanana: true },
            { x: 0.5, y: 500, type: 2, hasBanana: false },
            { x: 0.45, y: 800, type: 3, hasBanana: true },
            { x: 0.55, y: 1100, type: 3, hasBanana: false },
            { x: 0.5, y: 1400, type: 4, hasBanana: true },
            { x: 0.4, y: 1700, type: 4, hasBanana: false },
            { x: 0.6, y: 2000, type: 4, hasBanana: true },
            { x: 0.5, y: 2300, type: 5, hasBanana: false },
            { x: 0.45, y: 2600, type: 5, hasBanana: true },
            { x: 0.55, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 19 - Patrón variado
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.3, y: 500, type: 3, hasBanana: false },
            { x: 0.7, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.2, y: 1400, type: 3, hasBanana: true },
            { x: 0.8, y: 1700, type: 4, hasBanana: false },
            { x: 0.4, y: 2000, type: 4, hasBanana: true },
            { x: 0.6, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.3, y: 2900, type: 5, hasBanana: false },
            { x: 0.7, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 20 - Patrón equilibrado
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.4, y: 500, type: 3, hasBanana: false },
            { x: 0.6, y: 800, type: 3, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.35, y: 1400, type: 4, hasBanana: true },
            { x: 0.65, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.4, y: 2300, type: 5, hasBanana: false },
            { x: 0.6, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 21 - Patrón variado
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.35, y: 500, type: 3, hasBanana: false },
            { x: 0.65, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.3, y: 1400, type: 3, hasBanana: true },
            { x: 0.7, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.4, y: 2300, type: 4, hasBanana: false },
            { x: 0.6, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 22 - Patrón zigzag
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.4, y: 200, type: 1, hasBanana: true },
            { x: 0.6, y: 500, type: 2, hasBanana: false },
            { x: 0.4, y: 800, type: 3, hasBanana: true },
            { x: 0.6, y: 1100, type: 2, hasBanana: false },
            { x: 0.4, y: 1400, type: 4, hasBanana: true },
            { x: 0.6, y: 1700, type: 3, hasBanana: false },
            { x: 0.4, y: 2000, type: 5, hasBanana: true },
            { x: 0.6, y: 2300, type: 4, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.4, y: 2900, type: 5, hasBanana: false },
            { x: 0.6, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 23 - Patrón centro-extremos
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.25, y: 500, type: 2, hasBanana: false },
            { x: 0.75, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.15, y: 1400, type: 3, hasBanana: true },
            { x: 0.85, y: 1700, type: 3, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.25, y: 2300, type: 4, hasBanana: false },
            { x: 0.75, y: 2600, type: 4, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 24 - Patrón serpiente
        {
            goalHeight: 3400,
            platforms: [
            { x: 0.25, y: 200, type: 1, hasBanana: true },
            { x: 0.45, y: 500, type: 2, hasBanana: false },
            { x: 0.65, y: 800, type: 1, hasBanana: true },
            { x: 0.75, y: 1100, type: 3, hasBanana: false },
            { x: 0.65, y: 1400, type: 2, hasBanana: true },
            { x: 0.45, y: 1700, type: 4, hasBanana: false },
            { x: 0.25, y: 2000, type: 3, hasBanana: true },
            { x: 0.45, y: 2300, type: 4, hasBanana: false },
            { x: 0.65, y: 2600, type: 5, hasBanana: true },
            { x: 0.75, y: 2900, type: 5, hasBanana: false },
            { x: 0.5, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 25 - Patrón progresivo
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.48, y: 500, type: 2, hasBanana: false },
            { x: 0.45, y: 800, type: 3, hasBanana: true },
            { x: 0.42, y: 1100, type: 3, hasBanana: false },
            { x: 0.38, y: 1400, type: 4, hasBanana: true },
            { x: 0.35, y: 1700, type: 4, hasBanana: false },
            { x: 0.38, y: 2000, type: 5, hasBanana: true },
            { x: 0.45, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 26 - Patrón alternado
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.35, y: 200, type: 1, hasBanana: true },
            { x: 0.65, y: 500, type: 2, hasBanana: false },
            { x: 0.35, y: 800, type: 3, hasBanana: true },
            { x: 0.65, y: 1100, type: 2, hasBanana: false },
            { x: 0.35, y: 1400, type: 4, hasBanana: true },
            { x: 0.65, y: 1700, type: 3, hasBanana: false },
            { x: 0.35, y: 2000, type: 5, hasBanana: true },
            { x: 0.65, y: 2300, type: 4, hasBanana: false },
            { x: 0.35, y: 2600, type: 5, hasBanana: true },
            { x: 0.65, y: 2900, type: 5, hasBanana: false },
            { x: 0.5, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 27 - Patrón variado
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.42, y: 500, type: 2, hasBanana: false },
            { x: 0.58, y: 800, type: 3, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.38, y: 1400, type: 3, hasBanana: true },
            { x: 0.62, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.42, y: 2300, type: 4, hasBanana: false },
            { x: 0.58, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 28 - Patrón zigzag amplio
        {
            goalHeight: 3400,
            platforms: [
            { x: 0.25, y: 200, type: 2, hasBanana: true },
            { x: 0.75, y: 500, type: 2, hasBanana: false },
            { x: 0.25, y: 800, type: 3, hasBanana: true },
            { x: 0.75, y: 1100, type: 3, hasBanana: false },
            { x: 0.25, y: 1400, type: 4, hasBanana: true },
            { x: 0.75, y: 1700, type: 4, hasBanana: false },
            { x: 0.25, y: 2000, type: 5, hasBanana: true },
            { x: 0.75, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.25, y: 2900, type: 5, hasBanana: false },
            { x: 0.75, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 29 - Patrón centro con variaciones
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 1, hasBanana: true },
            { x: 0.5, y: 500, type: 2, hasBanana: false },
            { x: 0.48, y: 800, type: 3, hasBanana: true },
            { x: 0.52, y: 1100, type: 3, hasBanana: false },
            { x: 0.5, y: 1400, type: 4, hasBanana: true },
            { x: 0.42, y: 1700, type: 4, hasBanana: false },
            { x: 0.58, y: 2000, type: 4, hasBanana: true },
            { x: 0.5, y: 2300, type: 5, hasBanana: false },
            { x: 0.48, y: 2600, type: 5, hasBanana: true },
            { x: 0.52, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 30 - Patrón variado
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.32, y: 500, type: 3, hasBanana: false },
            { x: 0.68, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.22, y: 1400, type: 3, hasBanana: true },
            { x: 0.78, y: 1700, type: 4, hasBanana: false },
            { x: 0.42, y: 2000, type: 4, hasBanana: true },
            { x: 0.58, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.32, y: 2900, type: 5, hasBanana: false },
            { x: 0.68, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 31 - Patrón equilibrado
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.42, y: 500, type: 3, hasBanana: false },
            { x: 0.58, y: 800, type: 3, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.38, y: 1400, type: 4, hasBanana: true },
            { x: 0.62, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.42, y: 2300, type: 5, hasBanana: false },
            { x: 0.58, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 32 - Patrón variado
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.38, y: 500, type: 3, hasBanana: false },
            { x: 0.62, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.3, y: 1400, type: 3, hasBanana: true },
            { x: 0.7, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.4, y: 2300, type: 4, hasBanana: false },
            { x: 0.6, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 33 - Patrón zigzag
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.45, y: 200, type: 1, hasBanana: true },
            { x: 0.55, y: 500, type: 2, hasBanana: false },
            { x: 0.45, y: 800, type: 3, hasBanana: true },
            { x: 0.55, y: 1100, type: 2, hasBanana: false },
            { x: 0.45, y: 1400, type: 4, hasBanana: true },
            { x: 0.55, y: 1700, type: 3, hasBanana: false },
            { x: 0.45, y: 2000, type: 5, hasBanana: true },
            { x: 0.55, y: 2300, type: 4, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.45, y: 2900, type: 5, hasBanana: false },
            { x: 0.55, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 34 - Patrón centro-extremos
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.28, y: 500, type: 2, hasBanana: false },
            { x: 0.72, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.18, y: 1400, type: 3, hasBanana: true },
            { x: 0.82, y: 1700, type: 3, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.28, y: 2300, type: 4, hasBanana: false },
            { x: 0.72, y: 2600, type: 4, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 35 - Patrón serpiente
        {
            goalHeight: 3400,
            platforms: [
            { x: 0.28, y: 200, type: 1, hasBanana: true },
            { x: 0.48, y: 500, type: 2, hasBanana: false },
            { x: 0.68, y: 800, type: 1, hasBanana: true },
            { x: 0.78, y: 1100, type: 3, hasBanana: false },
            { x: 0.68, y: 1400, type: 2, hasBanana: true },
            { x: 0.48, y: 1700, type: 4, hasBanana: false },
            { x: 0.28, y: 2000, type: 3, hasBanana: true },
            { x: 0.48, y: 2300, type: 4, hasBanana: false },
            { x: 0.68, y: 2600, type: 5, hasBanana: true },
            { x: 0.78, y: 2900, type: 5, hasBanana: false },
            { x: 0.5, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 36 - Patrón progresivo
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.47, y: 500, type: 2, hasBanana: false },
            { x: 0.44, y: 800, type: 3, hasBanana: true },
            { x: 0.41, y: 1100, type: 3, hasBanana: false },
            { x: 0.37, y: 1400, type: 4, hasBanana: true },
            { x: 0.34, y: 1700, type: 4, hasBanana: false },
            { x: 0.37, y: 2000, type: 5, hasBanana: true },
            { x: 0.44, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 37 - Patrón alternado
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.38, y: 200, type: 1, hasBanana: true },
            { x: 0.62, y: 500, type: 2, hasBanana: false },
            { x: 0.38, y: 800, type: 3, hasBanana: true },
            { x: 0.62, y: 1100, type: 2, hasBanana: false },
            { x: 0.38, y: 1400, type: 4, hasBanana: true },
            { x: 0.62, y: 1700, type: 3, hasBanana: false },
            { x: 0.38, y: 2000, type: 5, hasBanana: true },
            { x: 0.62, y: 2300, type: 4, hasBanana: false },
            { x: 0.38, y: 2600, type: 5, hasBanana: true },
            { x: 0.62, y: 2900, type: 5, hasBanana: false },
            { x: 0.5, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 38 - Patrón variado
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.41, y: 500, type: 2, hasBanana: false },
            { x: 0.59, y: 800, type: 3, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.37, y: 1400, type: 3, hasBanana: true },
            { x: 0.63, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.41, y: 2300, type: 4, hasBanana: false },
            { x: 0.59, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 39 - Patrón zigzag amplio
        {
            goalHeight: 3400,
            platforms: [
            { x: 0.27, y: 200, type: 2, hasBanana: true },
            { x: 0.73, y: 500, type: 2, hasBanana: false },
            { x: 0.27, y: 800, type: 3, hasBanana: true },
            { x: 0.73, y: 1100, type: 3, hasBanana: false },
            { x: 0.27, y: 1400, type: 4, hasBanana: true },
            { x: 0.73, y: 1700, type: 4, hasBanana: false },
            { x: 0.27, y: 2000, type: 5, hasBanana: true },
            { x: 0.73, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.27, y: 2900, type: 5, hasBanana: false },
            { x: 0.73, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 40 - Patrón centro con variaciones
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 1, hasBanana: true },
            { x: 0.5, y: 500, type: 2, hasBanana: false },
            { x: 0.47, y: 800, type: 3, hasBanana: true },
            { x: 0.53, y: 1100, type: 3, hasBanana: false },
            { x: 0.5, y: 1400, type: 4, hasBanana: true },
            { x: 0.43, y: 1700, type: 4, hasBanana: false },
            { x: 0.57, y: 2000, type: 4, hasBanana: true },
            { x: 0.5, y: 2300, type: 5, hasBanana: false },
            { x: 0.47, y: 2600, type: 5, hasBanana: true },
            { x: 0.53, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 41 - Patrón variado
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.33, y: 500, type: 3, hasBanana: false },
            { x: 0.67, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.23, y: 1400, type: 3, hasBanana: true },
            { x: 0.77, y: 1700, type: 4, hasBanana: false },
            { x: 0.43, y: 2000, type: 4, hasBanana: true },
            { x: 0.57, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.33, y: 2900, type: 5, hasBanana: false },
            { x: 0.67, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 42 - Patrón equilibrado
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.43, y: 500, type: 3, hasBanana: false },
            { x: 0.57, y: 800, type: 3, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.39, y: 1400, type: 4, hasBanana: true },
            { x: 0.61, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.43, y: 2300, type: 5, hasBanana: false },
            { x: 0.57, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 43 - Patrón variado
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.39, y: 500, type: 3, hasBanana: false },
            { x: 0.61, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.31, y: 1400, type: 3, hasBanana: true },
            { x: 0.69, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.41, y: 2300, type: 4, hasBanana: false },
            { x: 0.59, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 44 - Patrón zigzag
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.46, y: 200, type: 1, hasBanana: true },
            { x: 0.54, y: 500, type: 2, hasBanana: false },
            { x: 0.46, y: 800, type: 3, hasBanana: true },
            { x: 0.54, y: 1100, type: 2, hasBanana: false },
            { x: 0.46, y: 1400, type: 4, hasBanana: true },
            { x: 0.54, y: 1700, type: 3, hasBanana: false },
            { x: 0.46, y: 2000, type: 5, hasBanana: true },
            { x: 0.54, y: 2300, type: 4, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.46, y: 2900, type: 5, hasBanana: false },
            { x: 0.54, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 45 - Patrón centro-extremos
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.29, y: 500, type: 2, hasBanana: false },
            { x: 0.71, y: 800, type: 2, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.19, y: 1400, type: 3, hasBanana: true },
            { x: 0.81, y: 1700, type: 3, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.29, y: 2300, type: 4, hasBanana: false },
            { x: 0.71, y: 2600, type: 4, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 46 - Patrón serpiente
        {
            goalHeight: 3400,
            platforms: [
            { x: 0.29, y: 200, type: 1, hasBanana: true },
            { x: 0.49, y: 500, type: 2, hasBanana: false },
            { x: 0.69, y: 800, type: 1, hasBanana: true },
            { x: 0.79, y: 1100, type: 3, hasBanana: false },
            { x: 0.69, y: 1400, type: 2, hasBanana: true },
            { x: 0.49, y: 1700, type: 4, hasBanana: false },
            { x: 0.29, y: 2000, type: 3, hasBanana: true },
            { x: 0.49, y: 2300, type: 4, hasBanana: false },
            { x: 0.69, y: 2600, type: 5, hasBanana: true },
            { x: 0.79, y: 2900, type: 5, hasBanana: false },
            { x: 0.5, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 47 - Patrón progresivo
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 2, hasBanana: true },
            { x: 0.46, y: 500, type: 2, hasBanana: false },
            { x: 0.43, y: 800, type: 3, hasBanana: true },
            { x: 0.4, y: 1100, type: 3, hasBanana: false },
            { x: 0.36, y: 1400, type: 4, hasBanana: true },
            { x: 0.33, y: 1700, type: 4, hasBanana: false },
            { x: 0.36, y: 2000, type: 5, hasBanana: true },
            { x: 0.43, y: 2300, type: 5, hasBanana: false },
            { x: 0.5, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 48 - Patrón alternado
        {
            goalHeight: 3300,
            platforms: [
            { x: 0.39, y: 200, type: 1, hasBanana: true },
            { x: 0.61, y: 500, type: 2, hasBanana: false },
            { x: 0.39, y: 800, type: 3, hasBanana: true },
            { x: 0.61, y: 1100, type: 2, hasBanana: false },
            { x: 0.39, y: 1400, type: 4, hasBanana: true },
            { x: 0.61, y: 1700, type: 3, hasBanana: false },
            { x: 0.39, y: 2000, type: 5, hasBanana: true },
            { x: 0.61, y: 2300, type: 4, hasBanana: false },
            { x: 0.39, y: 2600, type: 5, hasBanana: true },
            { x: 0.61, y: 2900, type: 5, hasBanana: false },
            { x: 0.5, y: 3200, type: 5, hasBanana: false },
            ]
        },
        // Nivel 49 - Patrón variado
        {
            goalHeight: 3100,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.4, y: 500, type: 2, hasBanana: false },
            { x: 0.6, y: 800, type: 3, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.36, y: 1400, type: 3, hasBanana: true },
            { x: 0.64, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.4, y: 2300, type: 4, hasBanana: false },
            { x: 0.6, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        },
        // Nivel 50 - Patrón final equilibrado
        {
            goalHeight: 3200,
            platforms: [
            { x: 0.5, y: 200, type: 3, hasBanana: true },
            { x: 0.44, y: 500, type: 3, hasBanana: false },
            { x: 0.56, y: 800, type: 3, hasBanana: true },
            { x: 0.5, y: 1100, type: 4, hasBanana: false },
            { x: 0.4, y: 1400, type: 4, hasBanana: true },
            { x: 0.6, y: 1700, type: 4, hasBanana: false },
            { x: 0.5, y: 2000, type: 5, hasBanana: true },
            { x: 0.44, y: 2300, type: 5, hasBanana: false },
            { x: 0.56, y: 2600, type: 5, hasBanana: true },
            { x: 0.5, y: 2900, type: 5, hasBanana: false },
            ]
        }
    ]
};

export const GAME = {
    // Configuración de Phaser
    PHYSICS_DEBUG: false,
    
    // Configuración de escala
    SCALE_MODE: Phaser.Scale.RESIZE,
    SCALE_AUTO_CENTER: Phaser.Scale.CENTER_BOTH,
    SCALE_WIDTH: '100%',
    SCALE_HEIGHT: '100%'
};
