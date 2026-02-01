/**
 * menu.js - Escena de menú principal con selector de niveles
 */

import { LEVELS, UI } from './constants.js';

export class LevelSelectMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectMenu' });
    }

    create() {
        const { width, height } = this.cameras.main;
        
        // Fondo con color del nivel 1
        const bgColor = LEVELS.LEVEL_COLORS[0].sky;
        this.cameras.main.setBackgroundColor(bgColor);
        
        // Configurar cámara para permitir scroll
        const levelCount = LEVELS.PRESETS.length;
        const buttonHeight = 80;
        const buttonSpacingY = 120;
        const cols = 5; // Más columnas en el grid
        const rows = Math.ceil(levelCount / cols);
        
        // Calcular altura total del contenido
        const totalContentHeight = height * 0.4 + (rows - 1) * buttonSpacingY + buttonHeight + height * 0.1;
        const worldHeight = Math.max(height, totalContentHeight);
        
        // Configurar límites del mundo y cámara para scroll
        this.cameras.main.setBounds(0, 0, width, worldHeight);
        this.cameras.main.setScroll(0, 0);
        
        // Título del juego (con scroll)
        const title = this.add.text(width / 2, height * 0.15, '🍌 Banana Party 🍌', {
            fontSize: '64px',
            fontFamily: UI.BANANA_TEXT_FONT_FAMILY,
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        });
        title.setOrigin(0.5);
        
        // Crear botones para cada nivel en formato grid
        const buttonWidth = 200; // Botones más pequeños para más columnas
        const buttonSpacingX = 220; // Espaciado horizontal entre botones
        
        // Calcular posición inicial para centrar el grid
        const gridWidth = (cols - 1) * buttonSpacingX + buttonWidth;
        const startX = (width - gridWidth) / 2 + buttonWidth / 2;
        const startY = height * 0.4;
        
        this.levelButtons = [];
        
        for (let i = 0; i < levelCount; i++) {
            // Calcular posición en el grid
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = startX + (col * buttonSpacingX);
            const y = startY + (row * buttonSpacingY);
            
            const levelNumber = i + 1;
            const levelColors = LEVELS.LEVEL_COLORS[i];
            
            // Crear fondo del botón con color del nivel
            const buttonBg = this.add.graphics();
            buttonBg.fillStyle(levelColors.grass, 1);
            buttonBg.fillRoundedRect(
                x - buttonWidth / 2,
                y - buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                15
            );
            buttonBg.lineStyle(4, 0x000000, 1);
            buttonBg.strokeRoundedRect(
                x - buttonWidth / 2,
                y - buttonHeight / 2,
                buttonWidth,
                buttonHeight,
                15
            );
            
            // Texto del botón
            const buttonText = this.add.text(x, y, `Nivel ${levelNumber}`, {
                fontSize: '28px',
                fontFamily: UI.BANANA_TEXT_FONT_FAMILY,
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center'
            });
            buttonText.setOrigin(0.5);
            
            // Crear zona interactiva
            const buttonZone = this.add.zone(x, y, buttonWidth, buttonHeight);
            buttonZone.setInteractive({ useHandCursor: true });
            
            // Efectos hover
            buttonZone.on('pointerover', () => {
                buttonBg.clear();
                buttonBg.fillStyle(levelColors.dirt, 1);
                buttonBg.fillRoundedRect(
                    x - buttonWidth / 2,
                    y - buttonHeight / 2,
                    buttonWidth,
                    buttonHeight,
                    15
                );
                buttonBg.lineStyle(4, 0xFFFFFF, 1);
                buttonBg.strokeRoundedRect(
                    x - buttonWidth / 2,
                    y - buttonHeight / 2,
                    buttonWidth,
                    buttonHeight,
                    15
                );
                buttonText.setScale(1.1);
            });
            
            buttonZone.on('pointerout', () => {
                buttonBg.clear();
                buttonBg.fillStyle(levelColors.grass, 1);
                buttonBg.fillRoundedRect(
                    x - buttonWidth / 2,
                    y - buttonHeight / 2,
                    buttonWidth,
                    buttonHeight,
                    15
                );
                buttonBg.lineStyle(4, 0x000000, 1);
                buttonBg.strokeRoundedRect(
                    x - buttonWidth / 2,
                    y - buttonHeight / 2,
                    buttonWidth,
                    buttonHeight,
                    15
                );
                buttonText.setScale(1.0);
            });
            
            // Click para iniciar nivel
            buttonZone.on('pointerdown', () => {
                // Guardar el nivel seleccionado en el registro de datos
                this.registry.set('selectedLevel', levelNumber);
                
                // Iniciar el juego
                this.scene.start('BananaPartyGame');
            });
            
            // Guardar referencias para poder destruirlas después
            this.levelButtons.push({
                bg: buttonBg,
                text: buttonText,
                zone: buttonZone
            });
        }
        
        // Habilitar scroll con la rueda del ratón
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const currentScrollY = this.cameras.main.scrollY;
            const maxScrollY = worldHeight - height;
            const newScrollY = Phaser.Math.Clamp(currentScrollY - deltaY * 0.5, 0, maxScrollY);
            this.cameras.main.setScroll(0, newScrollY);
        });
    }
}
