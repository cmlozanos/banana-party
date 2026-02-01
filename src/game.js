/**
 * Banana Party - Videojuego 2D de ascensión vertical para niños
 * Motor: Phaser 3 con Arcade Physics
 */

import { Player } from './player.js';
import { UIManager } from './ui.js';
import { LevelSelectMenu } from './menu.js';
import { 
    PLAYER,
    PLATFORM, 
    BANANA, 
    WORLD, 
    CAMERA, 
    BACKGROUND, 
    ASSETS, 
    PHYSICS, 
    GAME,
    LEVELS,
    UI
} from './constants.js';

class BananaPartyGame extends Phaser.Scene {
    constructor() {
        super({ key: 'BananaPartyGame' });
        this.bananasCollected = 0;
        this.maxHeight = 0;
        this.platforms = [];
        this.bananas = null; // Se inicializará como grupo de física en create()
        this.bananaSprites = []; // Array de sprites de bananas para overlap
        this.currentLevel = 1; // Nivel actual (se establecerá desde el menú)
        this.goal = null; // Objeto meta
        this.levelHeight = 0; // Altura objetivo del nivel actual
        this.menuButton = null; // Botón para volver al menú
    }
    
    init(data) {
        // Obtener el nivel seleccionado del registro o de los datos de la escena
        const selectedLevel = this.registry.get('selectedLevel') || data?.level || 1;
        this.currentLevel = selectedLevel;
    }

    preload() {
        // No necesitamos cargar assets, todo se genera con polígonos
    }
    
    createSprites() {
        // Obtener colores del nivel actual
        const levelColors = LEVELS.LEVEL_COLORS[(this.currentLevel - 1) % LEVELS.LEVEL_COLORS.length];
        
        // Crear plataformas como polígonos rectangulares simples con colores del nivel
        for (let i = 0; i < PLATFORM.NUM_VARIATIONS; i++) {
            const platformGraphics = this.add.graphics();
            const width = PLATFORM.WIDTHS[i]; // Usar ancho directo del array
            const grassHeight = PLATFORM.GRASS_HEIGHT;
            const dirtHeight = PLATFORM.DIRT_HEIGHT;
            const totalHeight = grassHeight + dirtHeight;
            
            // Rectángulo de tierra con color del nivel
            platformGraphics.fillStyle(levelColors.dirt, 1);
            platformGraphics.fillRect(0, grassHeight, width, dirtHeight);
            
            // Rectángulo de césped (superficie superior) con color del nivel
            platformGraphics.fillStyle(levelColors.grass, 1);
            platformGraphics.fillRect(0, 0, width, grassHeight);
            
            platformGraphics.generateTexture(`${PLATFORM.TEXTURE_PLATFORM_PREFIX}${i + 1}`, width, totalHeight);
            platformGraphics.destroy();
        }
    }
    
    createGoal() {
        const { width } = this.cameras.main;
        const worldHeight = this.cameras.main.height * WORLD.HEIGHT_MULTIPLIER;
        const groundY = worldHeight - WORLD.GROUND_Y_OFFSET;
        
        // Obtener el preset del nivel actual para usar su goalHeight
        const levelIndex = Math.min(this.currentLevel - 1, LEVELS.PRESETS.length - 1);
        const levelPreset = LEVELS.PRESETS[levelIndex];
        const goalHeight = levelPreset.goalHeight || 3000; // Fallback a 3000 si no existe
        
        // Calcular posición de la meta (altura objetivo desde el suelo)
        const goalY = groundY - goalHeight;
        this.levelHeight = goalY;
        
        // Crear sprite de meta como polígono simple (bandera o arco) - MÁS GRANDE Y VISIBLE
        if (!this.textures.exists('goal')) {
            const goalGraphics = this.add.graphics();
            const goalSize = LEVELS.GOAL_SIZE;
            goalGraphics.fillStyle(LEVELS.GOAL_COLOR, 1);
            goalGraphics.lineStyle(LEVELS.GOAL_BORDER_WIDTH, LEVELS.GOAL_BORDER_COLOR, 1);
            
            // Crear polígono de arco/bandera simple pero más grande
            goalGraphics.beginPath();
            goalGraphics.moveTo(goalSize * 0.2, 0);
            goalGraphics.lineTo(goalSize * 0.8, 0);
            goalGraphics.lineTo(goalSize * 0.8, goalSize * 0.6);
            goalGraphics.lineTo(goalSize * 0.5, goalSize);
            goalGraphics.lineTo(goalSize * 0.2, goalSize * 0.6);
            goalGraphics.closePath();
            goalGraphics.fillPath();
            goalGraphics.strokePath();
            
            // Añadir un círculo brillante en el centro para hacerlo más visible
            goalGraphics.fillStyle(LEVELS.GOAL_CENTER_CIRCLE_COLOR, LEVELS.GOAL_CENTER_CIRCLE_ALPHA);
            goalGraphics.fillCircle(goalSize * 0.5, goalSize * 0.3, goalSize * LEVELS.GOAL_CENTER_CIRCLE_RADIUS_FACTOR);
            
            goalGraphics.generateTexture('goal', goalSize, goalSize);
            goalGraphics.destroy();
        }
        
        // Crear meta como sprite estático
        this.goal = this.add.sprite(width / 2, goalY, 'goal');
        this.physics.add.existing(this.goal, true);
        
        // Configurar cuerpo de colisión más grande para facilitar el contacto
        this.goal.body.setSize(LEVELS.GOAL_COLLISION_SIZE, LEVELS.GOAL_COLLISION_SIZE);
        this.goal.body.setOffset(
            (LEVELS.GOAL_SIZE - LEVELS.GOAL_COLLISION_SIZE) / 2,
            (LEVELS.GOAL_SIZE - LEVELS.GOAL_COLLISION_SIZE) / 2
        );
        
        this.goal.setDepth(LEVELS.GOAL_DEPTH);
        this.goal.setOrigin(0.5, 0.5);
        this.goal.setScale(1.0);
        
        // Hacer la meta más visible con un efecto de brillo
        this.goal.setTint(LEVELS.GOAL_TINT);
        
        // Configurar colisión con el jugador
        this.physics.add.overlap(this.player.sprite, this.goal, this.reachGoal, null, this);
        
        console.log(`🎯 Meta creada en Y: ${goalY}, Altura del nivel: ${goalHeight}`);
    }
    
    reachGoal(player, goal) {
        // Avanzar al siguiente nivel
        this.currentLevel++;
        
        // Si se completa el último nivel, volver al menú
        if (this.currentLevel > LEVELS.PRESETS.length) {
            this.scene.start('LevelSelectMenu');
            return;
        }
        
        // NO destruir elementos de UI - preservarlos entre niveles
        // Solo destruir elementos del nivel anterior (plataformas, bananas, meta)
        this.platforms.forEach(platform => {
            if (platform && platform.active) {
                platform.destroy();
            }
        });
        this.platforms = [];
        this.bananas.clear(true, true);
        this.bananaSprites = [];
        if (this.goal) {
            this.goal.destroy();
            this.goal = null;
        }
        
        // Regenerar sprites con nuevos colores
        this.createSprites();
        
        // Regenerar fondo con nuevo color
        const levelColors = LEVELS.LEVEL_COLORS[(this.currentLevel - 1) % LEVELS.LEVEL_COLORS.length];
        const { width, height } = this.cameras.main;
        const worldHeight = height * WORLD.HEIGHT_MULTIPLIER;
        
        // Actualizar fondo
        if (this.background) {
            this.background.destroy();
        }
        const bgGraphics = this.add.graphics();
        bgGraphics.fillStyle(levelColors.sky, 1);
        bgGraphics.fillRect(0, 0, width, worldHeight);
        bgGraphics.generateTexture(ASSETS.TEXTURE_FONDO_CIELO, width, worldHeight);
        bgGraphics.destroy();
        
        this.background = this.add.tileSprite(0, 0, width, worldHeight, ASSETS.TEXTURE_FONDO_CIELO);
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(CAMERA.BACKGROUND_SCROLL_FACTOR, CAMERA.BACKGROUND_SCROLL_FACTOR);
        
        // Regenerar suelo con nuevos colores
        const groundY = worldHeight - WORLD.GROUND_Y_OFFSET;
        if (this.ground) {
            this.ground.clear(true, true);
        }
        this.ground = this.physics.add.staticGroup();
        
        const groundGraphics = this.add.graphics();
        groundGraphics.fillStyle(levelColors.dirt, 1);
        groundGraphics.fillRect(0, 0, width, WORLD.GROUND_DIRT_HEIGHT);
        groundGraphics.fillStyle(levelColors.grass, 1);
        groundGraphics.fillRect(0, 0, width, WORLD.GROUND_GRASS_HEIGHT);
        groundGraphics.generateTexture(ASSETS.TEXTURE_GROUND, width, WORLD.GROUND_HEIGHT);
        groundGraphics.destroy();
        
        const groundSprite = this.add.image(width / 2, groundY, ASSETS.TEXTURE_GROUND);
        this.physics.add.existing(groundSprite, true);
        groundSprite.setDepth(PLATFORM.DEPTH);
        this.ground.add(groundSprite);
        this.physics.add.collider(this.player.sprite, this.ground);
        
        // Reposicionar jugador cerca del suelo
        const playerStartY = groundY - WORLD.PLAYER_START_OFFSET;
        const playerStartX = width / 2;
        this.player.sprite.x = playerStartX;
        this.player.sprite.y = playerStartY;
        this.maxHeight = playerStartY;
        
        // Regenerar plataformas según el preset del nuevo nivel
        this.createInitialPlatforms();
        
        // Crear nueva meta
        this.createGoal();
        
        // Recrear botón de menú si fue destruido
        this.createMenuButton();
        
        // Actualizar UI (asegurar que existe y sus elementos están visibles)
        if (!this.uiManager) {
            this.uiManager = new UIManager(this);
        } else {
            // Asegurar que los elementos de UI estén visibles y actualizados
            if (this.uiManager.bananaText) {
                this.uiManager.bananaText.setVisible(true);
                this.uiManager.bananaText.setDepth(100);
            }
            if (this.uiManager.heightText) {
                this.uiManager.heightText.setVisible(true);
                this.uiManager.heightText.setDepth(100);
            }
            if (this.uiManager.levelText) {
                this.uiManager.levelText.setVisible(true);
                this.uiManager.levelText.setDepth(100);
            }
        }
        this.uiManager.updateLevel(this.currentLevel);
        this.uiManager.updateBananaCount(this.bananasCollected);
        
        // Resetear altura máxima para el nuevo nivel
        this.uiManager.updateHeight(0);
    }
    
    createMenuButton() {
        // Destruir botón anterior si existe
        if (this.menuButton) {
            this.menuButton.destroy();
        }
        
        // Crear botón para volver al menú
        this.menuButton = this.add.text(20, 20, '← Menú', {
            fontSize: '24px',
            fontFamily: UI.BANANA_TEXT_FONT_FAMILY,
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.menuButton.setInteractive({ useHandCursor: true });
        this.menuButton.on('pointerdown', () => {
            this.scene.start('LevelSelectMenu');
        });
        this.menuButton.setScrollFactor(0); // Fijo en pantalla
        this.menuButton.setDepth(100); // Asegurar que esté por encima de todo
    }

    create() {
        this.createSprites();
        
        const { width, height } = this.cameras.main;
        const worldHeight = height * WORLD.HEIGHT_MULTIPLIER;
        this.physics.world.setBounds(WORLD.PHYSICS_BOUNDS_X, WORLD.PHYSICS_BOUNDS_Y, width, worldHeight);
        
        // Crear fondo con color del nivel actual
        const levelColors = LEVELS.LEVEL_COLORS[(this.currentLevel - 1) % LEVELS.LEVEL_COLORS.length];
        const bgGraphics = this.add.graphics();
        bgGraphics.fillStyle(levelColors.sky, 1);
        bgGraphics.fillRect(0, 0, width, worldHeight);
        bgGraphics.generateTexture(ASSETS.TEXTURE_FONDO_CIELO, width, worldHeight);
        bgGraphics.destroy();
        
        this.background = this.add.tileSprite(0, 0, width, worldHeight, ASSETS.TEXTURE_FONDO_CIELO);
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(CAMERA.BACKGROUND_SCROLL_FACTOR, CAMERA.BACKGROUND_SCROLL_FACTOR);
        
        const landscapeGraphics = this.add.graphics();
        landscapeGraphics.fillStyle(PLATFORM.GRASS_COLOR, 1);
        landscapeGraphics.fillRect(0, 0, width, WORLD.LANDSCAPE_HEIGHT);
        landscapeGraphics.generateTexture(ASSETS.TEXTURE_LANDSCAPE, width, WORLD.LANDSCAPE_HEIGHT);
        landscapeGraphics.destroy();
        
        const landscape = this.add.tileSprite(0, worldHeight - WORLD.LANDSCAPE_HEIGHT, width, WORLD.LANDSCAPE_HEIGHT, ASSETS.TEXTURE_LANDSCAPE);
        landscape.setOrigin(0, 0);
        landscape.setScrollFactor(CAMERA.LANDSCAPE_SCROLL_FACTOR, CAMERA.LANDSCAPE_SCROLL_FACTOR);
        landscape.setDepth(2);
        
        this.cameras.main.setBounds(0, 0, width, worldHeight);
        // Deadzone más grande en Y para mantener al jugador en la parte inferior de la pantalla
        // Esto permite ver las siguientes 3 plataformas arriba
        this.cameras.main.setDeadzone(CAMERA.DEADZONE_X, CAMERA.DEADZONE_Y);
        
        const groundY = worldHeight - WORLD.GROUND_Y_OFFSET;
        this.ground = this.physics.add.staticGroup();
        
        // Crear suelo con colores del nivel actual (reutilizar levelColors declarado arriba)
        const groundGraphics = this.add.graphics();
        groundGraphics.fillStyle(levelColors.dirt, 1);
        groundGraphics.fillRect(0, 0, width, WORLD.GROUND_DIRT_HEIGHT);
        groundGraphics.fillStyle(levelColors.grass, 1);
        groundGraphics.fillRect(0, 0, width, WORLD.GROUND_GRASS_HEIGHT);
        groundGraphics.generateTexture(ASSETS.TEXTURE_GROUND, width, WORLD.GROUND_HEIGHT);
        groundGraphics.destroy();
        
        const groundSprite = this.add.image(width / 2, groundY, ASSETS.TEXTURE_GROUND);
        this.physics.add.existing(groundSprite, true);
        groundSprite.setDepth(PLATFORM.DEPTH);
        this.ground.add(groundSprite);
        
        const playerStartY = groundY - WORLD.PLAYER_START_OFFSET;
        const playerStartX = width / 2;
        this.player = new Player(this, playerStartX, playerStartY);
        
        // Crear grupo de bananas estático
        this.bananas = this.physics.add.staticGroup();
        this.uiManager = new UIManager(this);
        this.uiManager.updateLevel(this.currentLevel); // Inicializar nivel en UI
        
        // Crear o recrear botón para volver al menú
        this.createMenuButton();
        
        this.createInitialPlatforms();
        
        // Crear meta al final del nivel
        this.createGoal();
        
        this.physics.add.collider(this.player.sprite, this.ground);
        this.player.sprite.body.setCollideWorldBounds(true);
        this.player.sprite.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 0, width, worldHeight));
        // Usar overlap con el grupo estático de bananas
        this.physics.add.overlap(this.player.sprite, this.bananas, this.collectBanana, null, this);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Configurar cámara para mantener al jugador en la parte inferior de la pantalla
        // Posicionar cámara inicialmente para que el jugador esté en la parte inferior
        const cameraY = Math.max(0, playerStartY - height * 0.75);
        this.cameras.main.setScroll(0, cameraY);
        this.maxHeight = playerStartY;
        
        // Configurar seguimiento con deadzone grande en Y para mantener jugador abajo
        this.cameras.main.startFollow(this.player.sprite, false, CAMERA.FOLLOW_LERP_X, CAMERA.FOLLOW_LERP_Y);
        
        // Offset para mantener al jugador en la parte inferior
        // Offset positivo mueve la cámara hacia abajo relativo al jugador (jugador se ve más arriba)
        // Offset negativo mueve la cámara hacia arriba relativo al jugador (jugador se ve más abajo)
        // Queremos offset negativo pequeño para mantener jugador abajo en pantalla
        this.cameras.main.setFollowOffset(0, -height * 0.2);
        
        // Redondear píxeles para evitar desenfoque al moverse
        this.cameras.main.setRoundPixels(true);
        
        // Crear estadísticas de debug solo en localhost
        this.createDebugStats();
    }
    
    createDebugStats() {
        // Verificar si estamos en localhost
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname === '';
        
        if (!isLocalhost) {
            return; // No crear estadísticas si no estamos en localhost
        }
        
        // Crear texto de debug debajo de los elementos de UI (altura y nivel están en Y=20 y Y=70)
        // Colocarlo en Y=120 para que esté debajo del nivel (Y=70) con un poco de espacio
        this.debugText = this.add.text(20, 120, '', {
            fontSize: '16px',
            fontFamily: 'monospace',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2,
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        });
        this.debugText.setScrollFactor(0); // Fijo en pantalla
        this.debugText.setDepth(200); // Por encima de todo
        this.debugText.setVisible(true);
    }
    
    updateDebugStats() {
        if (!this.debugText || !this.debugText.visible) {
            return;
        }
        
        const player = this.player;
        if (!player || !player.sprite) {
            return;
        }
        
        // Obtener estado del personaje
        const isGrounded = player.isGrounded;
        const velocityX = player.sprite.body.velocity.x;
        const touchingDown = player.sprite.body.touching.down;
        const blockedDown = player.sprite.body.blocked.down;
        
        // Determinar estado vertical
        let estadoVertical = 'AIRE';
        if (isGrounded || touchingDown || blockedDown) {
            estadoVertical = 'SUELO';
        }
        
        // Determinar dirección horizontal
        let direccionHorizontal = 'NINGUNA';
        if (Math.abs(velocityX) > PLAYER.IDLE_VELOCITY_THRESHOLD) {
            if (velocityX < 0) {
                direccionHorizontal = 'IZQUIERDA';
            } else {
                direccionHorizontal = 'DERECHA';
            }
        }
        
        // Actualizar texto
        const debugInfo = [
            `Estado: ${estadoVertical}`,
            `Dirección: ${direccionHorizontal}`,
            `Velocidad X: ${velocityX.toFixed(1)}`,
            `Touching Down: ${touchingDown}`,
            `Blocked Down: ${blockedDown}`
        ].join('\n');
        
        this.debugText.setText(debugInfo);
    }

    // Función auxiliar para configurar el cuerpo de colisión de una plataforma
    setupPlatformCollision(platformSprite) {
        platformSprite.setOrigin(0.5, 0.5);
        
        // Calcular dimensiones esperadas basadas en las constantes
        const totalVisualHeight = (PLATFORM.GRASS_HEIGHT + PLATFORM.DIRT_HEIGHT) * PLATFORM.SCALE;
        const totalVisualWidth = platformSprite.width || (PLATFORM.BASE_WIDTH * PLATFORM.SCALE);
        const grassVisualHeight = PLATFORM.GRASS_HEIGHT * PLATFORM.SCALE;
        const collisionWidth = totalVisualWidth * PLATFORM.COLLISION_WIDTH_FACTOR;
        
        // Configurar el cuerpo de colisión inmediatamente
        platformSprite.body.setSize(collisionWidth, grassVisualHeight);
        platformSprite.body.setOffset(0, -totalVisualHeight / 2);
        
        // Asegurar que el cuerpo se actualice después de que el sprite tenga sus dimensiones reales
        this.time.delayedCall(10, () => {
            const actualHeight = platformSprite.height;
            const actualWidth = platformSprite.width;
            const actualGrassHeight = PLATFORM.GRASS_HEIGHT * PLATFORM.SCALE;
            const actualCollisionWidth = actualWidth * PLATFORM.COLLISION_WIDTH_FACTOR;
            
            platformSprite.body.setSize(actualCollisionWidth, actualGrassHeight);
            platformSprite.body.setOffset(0, -actualHeight / 2);
            platformSprite.body.updateFromGameObject();
        });
    }

    // Callback de proceso para collider: solo permite colisión cuando el jugador viene desde arriba
    processPlatformCollision(body1, body2) {
        // El callback recibe los cuerpos físicos directamente
        // Necesitamos determinar cuál es el cuerpo del jugador
        if (!this.player || !this.player.sprite) {
            return true; // Si el jugador no existe, permitir colisión
        }
        
        const playerSprite = this.player.sprite;
        let playerBody = null;
        
        // Verificar si body1 pertenece al jugador
        if (body1 && body1.gameObject === playerSprite) {
            playerBody = body1;
        }
        // Verificar si body2 pertenece al jugador
        else if (body2 && body2.gameObject === playerSprite) {
            playerBody = body2;
        }
        // Si no encontramos el jugador, asumir que body1 es el jugador (fallback)
        else if (body1 && body1.velocity) {
            playerBody = body1;
        }
        
        // Si no podemos determinar el cuerpo del jugador, permitir colisión por defecto
        if (!playerBody || !playerBody.velocity) {
            return true;
        }
        
        // Permitir pasar desde abajo (jugador subiendo)
        if (playerBody.velocity.y < 0) {
            return false; // No colisionar
        }
        // Solo colisionar si el jugador está cayendo o estático
        return playerBody.velocity.y >= 0;
    }

    checkPlayerOnPlatforms() {
        // Función de estabilización adicional para asegurar que el jugador se mantenga sobre las plataformas
        // Esto es un respaldo en caso de que haya problemas menores con la física
        const playerSprite = this.player.sprite;
        const playerVelocityY = playerSprite.body.velocity.y;
        
        // Solo verificar si el jugador está cayendo muy lentamente o estático
        if (playerVelocityY > 0 && playerVelocityY < 10) {
            for (const platform of this.platforms) {
                if (!platform.body) continue;
                
                const platformTop = platform.y - (platform.height / 2);
                const playerBottom = playerSprite.y + (playerSprite.body.height / 2);
                const playerLeft = playerSprite.x - (playerSprite.body.width / 2);
                const playerRight = playerSprite.x + (playerSprite.body.width / 2);
                const platformBodyWidth = platform.body.width || platform.width * PLATFORM.COLLISION_WIDTH_FACTOR;
                const platformLeft = platform.x - (platformBodyWidth / 2);
                const platformRight = platform.x + (platformBodyWidth / 2);
                
                const isHorizontallyOverPlatform = playerRight > platformLeft && playerLeft < platformRight;
                const isVeryCloseToPlatformTop = playerBottom >= platformTop - 2 && playerBottom <= platformTop + 5;
                
                // Solo ajustar si está muy cerca y horizontalmente sobre la plataforma
                if (isHorizontallyOverPlatform && isVeryCloseToPlatformTop) {
                    playerSprite.body.setVelocityY(0);
                    playerSprite.y = platformTop - (playerSprite.body.height / 2) - 0.5;
                    playerSprite.body.touching.down = true;
                    playerSprite.body.blocked.down = true;
                    this.player.isGrounded = true;
                    break;
                }
            }
        }
    }

    createInitialPlatforms() {
        const { width, height } = this.cameras.main;
        const worldHeight = height * WORLD.HEIGHT_MULTIPLIER;
        const groundY = worldHeight - WORLD.GROUND_Y_OFFSET;
        
        // Obtener el preset del nivel actual
        const levelIndex = Math.min(this.currentLevel - 1, LEVELS.PRESETS.length - 1);
        const levelPreset = LEVELS.PRESETS[levelIndex];
        
        // Limpiar plataformas existentes
        this.platforms.forEach(platform => {
            if (platform && platform.active) {
                platform.destroy();
            }
        });
        this.platforms = [];
        
        // Crear plataformas según el preset del nivel (ahora levelPreset.platforms)
        levelPreset.platforms.forEach((platformData, index) => {
            // x es un factor (0.0 a 1.0) que representa la posición horizontal relativa
            const x = platformData.x * width;
            // y es la distancia desde el suelo hacia arriba
            const y = groundY - platformData.y;
            
            // platformData.type es el índice del array (0-5), pero las texturas son 1-6
            const platformType = `${PLATFORM.TEXTURE_PLATFORM_PREFIX}${platformData.type + 1}`;
            
            const platformSprite = this.add.sprite(x, y, platformType);
            platformSprite.setScale(PLATFORM.SCALE);
            this.physics.add.existing(platformSprite, true);
            platformSprite.setDepth(PLATFORM.DEPTH);
            this.setupPlatformCollision(platformSprite);
            platformSprite.setData('isPlatform', true);
            this.platforms.push(platformSprite);
            
            // Usar collider con callback de proceso para plataformas unidireccionales
            this.physics.add.collider(
                this.player.sprite,
                platformSprite,
                null,
                this.processPlatformCollision,
                this
            );
            
            // Crear banana si está especificado en el preset
            if (platformData.hasBanana) {
                const platformTop = y - ((PLATFORM.GRASS_HEIGHT + PLATFORM.DIRT_HEIGHT) * PLATFORM.SCALE / 2);
                const bananaY = platformTop - BANANA.OFFSET_FROM_PLATFORM;
                this.createBanana(x, bananaY);
            }
            
            // Actualizar lastPlatformY para referencia
            if (index === 0) {
                this.lastPlatformY = y;
            } else {
                this.lastPlatformY = Math.min(this.lastPlatformY, y);
            }
        });
        
        console.log(`📐 Nivel ${this.currentLevel}: ${levelPreset.length} plataformas creadas según preset`);
    }

    createBanana(x, y) {
        if (!this.textures.exists(ASSETS.TEXTURE_BANANA)) {
            const bananaGraphics = this.add.graphics();
            const bananaWidth = 40;
            const bananaHeight = 60;
            
            // Dibujar banana estilo emoji 🍌 - forma curva simple y reconocible
            // Cuerpo principal de la banana (forma curva como el emoji)
            bananaGraphics.fillStyle(BANANA.TEMP_COLOR, 1); // Amarillo #FFD700
            bananaGraphics.lineStyle(2, 0xFFA500, 1); // Borde naranja
            
            // Forma curva de banana estilo emoji - más simple y reconocible
            bananaGraphics.beginPath();
            // Parte superior (estrecha, donde está el tallo)
            bananaGraphics.moveTo(16, 2);      // Superior izquierda
            bananaGraphics.lineTo(24, 2);      // Superior derecha
            // Lado derecho (curva hacia afuera)
            bananaGraphics.lineTo(30, 5);      // 
            bananaGraphics.lineTo(34, 10);     // 
            bananaGraphics.lineTo(36, 18);     // 
            bananaGraphics.lineTo(37, 26);     // 
            bananaGraphics.lineTo(36, 34);     // Punto más ancho
            bananaGraphics.lineTo(34, 42);     // 
            bananaGraphics.lineTo(30, 50);     // 
            bananaGraphics.lineTo(26, 56);     // 
            bananaGraphics.lineTo(22, 59);     // 
            // Parte inferior (punta redondeada)
            bananaGraphics.lineTo(18, 60);     // Punta inferior
            bananaGraphics.lineTo(14, 59);     // 
            bananaGraphics.lineTo(10, 56);     // 
            bananaGraphics.lineTo(6, 50);      // 
            bananaGraphics.lineTo(4, 42);      // 
            bananaGraphics.lineTo(3, 34);      // Punto más ancho izquierdo
            bananaGraphics.lineTo(4, 26);      // 
            bananaGraphics.lineTo(6, 18);      // 
            bananaGraphics.lineTo(10, 10);     // 
            bananaGraphics.lineTo(14, 5);      // 
            bananaGraphics.lineTo(16, 2);      // Cerrar
            bananaGraphics.closePath();
            bananaGraphics.fillPath();
            bananaGraphics.strokePath();
            
            // Líneas características del emoji de banana (3 líneas curvas)
            bananaGraphics.lineStyle(2, 0xFFE55C, 0.8); // Amarillo más claro
            // Línea 1 (superior)
            bananaGraphics.beginPath();
            bananaGraphics.moveTo(12, 8);
            bananaGraphics.lineTo(16, 12);
            bananaGraphics.lineTo(20, 18);
            bananaGraphics.lineTo(22, 24);
            bananaGraphics.lineTo(22, 30);
            bananaGraphics.strokePath();
            // Línea 2 (media)
            bananaGraphics.beginPath();
            bananaGraphics.moveTo(14, 16);
            bananaGraphics.lineTo(18, 22);
            bananaGraphics.lineTo(22, 28);
            bananaGraphics.lineTo(26, 34);
            bananaGraphics.lineTo(26, 40);
            bananaGraphics.strokePath();
            // Línea 3 (inferior)
            bananaGraphics.beginPath();
            bananaGraphics.moveTo(16, 24);
            bananaGraphics.lineTo(20, 30);
            bananaGraphics.lineTo(24, 36);
            bananaGraphics.lineTo(28, 42);
            bananaGraphics.lineTo(28, 48);
            bananaGraphics.strokePath();
            
            // Tallo verde estilo emoji (más pequeño y redondeado)
            bananaGraphics.fillStyle(BANANA.TEMP_STEM_COLOR, 1); // Verde #90EE90
            bananaGraphics.lineStyle(1, 0x6B8E23, 1); // Borde verde oscuro
            // Tallo redondeado
            bananaGraphics.fillCircle(20, -3, 4); // Círculo pequeño para el tallo
            bananaGraphics.strokeCircle(20, -3, 4);
            
            // Generar textura una sola vez
            bananaGraphics.generateTexture(ASSETS.TEXTURE_BANANA, bananaWidth, bananaHeight);
            bananaGraphics.destroy();
        }
        
        // Crear sprite de banana directamente en el grupo estático
        // Esto asegura que sea completamente estático desde el inicio
        const banana = this.bananas.create(x, y, ASSETS.TEXTURE_BANANA);
        banana.setScale(BANANA.SCALE);
        banana.setDepth(BANANA.DEPTH);
        banana.setOrigin(0.5, 0.5);
        
        // Configurar cuerpo de colisión después de que el sprite tenga dimensiones correctas
        this.time.delayedCall(10, () => {
            if (banana && banana.active && banana.body) {
                banana.body.setSize(
                    banana.width * BANANA.COLLISION_WIDTH_FACTOR, 
                    banana.height * BANANA.COLLISION_HEIGHT_FACTOR
                );
            }
        });
        
        this.bananaSprites.push(banana);
    }

    collectBanana(player, banana) {
        if (banana && banana.active) {
            banana.destroy();
            this.bananasCollected++;
            this.uiManager.updateBananaCount(this.bananasCollected);
        }
    }

    update() {
        // Actualizar jugador
        this.player.update(this.cursors);
        
        // Verificar continuamente si el jugador está sobre una plataforma (estabilización)
        this.checkPlayerOnPlatforms();
        
        // Obtener posición del jugador una sola vez
        const playerY = this.player.sprite.y;
        
        // Actualizar altura máxima (el jugador sube cuando Y disminuye)
        if (playerY < this.maxHeight) {
            this.maxHeight = playerY;
            // Calcular altura desde el suelo (groundY es la referencia)
            const worldHeight = this.cameras.main.height * WORLD.HEIGHT_MULTIPLIER;
            const groundY = worldHeight - WORLD.GROUND_Y_OFFSET;
            const heightFromGround = groundY - playerY;
            this.uiManager.updateHeight(Math.floor(heightFromGround / WORLD.METERS_DIVISOR));
        }
        
        // Actualizar estadísticas de debug
        this.updateDebugStats();
        
        // Con niveles predefinidos, no necesitamos generar plataformas dinámicamente
        // Las plataformas ya están todas creadas según el preset del nivel
    }
    
    // Ya no necesitamos esta función porque Phaser maneja las colisiones automáticamente con collider

    // Función eliminada: generateNewPlatforms() ya no se usa con niveles predefinidos
}

// Configuración de Phaser - Pantalla completa
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: PHYSICS.GRAVITY_Y },
            debug: GAME.PHYSICS_DEBUG
        }
    },
    scene: [LevelSelectMenu, BananaPartyGame], // Menú primero, luego el juego
    scale: {
        mode: GAME.SCALE_MODE,
        autoCenter: GAME.SCALE_AUTO_CENTER,
        width: GAME.SCALE_WIDTH,
        height: GAME.SCALE_HEIGHT
    },
    render: {
        antialias: false, // Desactivar antialiasing para evitar desenfoque
        pixelArt: false,
        roundPixels: true // Redondear píxeles globalmente
    }
};

// Inicializar juego
const game = new Phaser.Game(config);
