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
        
        // Título del juego
        const title = this.add.text(width / 2, height * 0.15, '🍌 Banana Party 🍌', {
            fontSize: '64px',
            fontFamily: UI.BANANA_TEXT_FONT_FAMILY,
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        });
        title.setOrigin(0.5);
        
        // Subtítulo
        const subtitle = this.add.text(width / 2, height * 0.25, 'Selecciona un nivel', {
            fontSize: '32px',
            fontFamily: UI.BANANA_TEXT_FONT_FAMILY,
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        });
        subtitle.setOrigin(0.5);
        
        // Crear botones para cada nivel en formato grid
        const levelCount = LEVELS.PRESETS.length;
        const buttonWidth = 250;
        const buttonHeight = 80;
        const buttonSpacingX = 280; // Espaciado horizontal entre botones
        const buttonSpacingY = 120; // Espaciado vertical entre botones
        const cols = 3; // Número de columnas en el grid
        const rows = Math.ceil(levelCount / cols); // Número de filas necesarias
        
        // Calcular posición inicial para centrar el grid
        const gridWidth = (cols - 1) * buttonSpacingX + buttonWidth;
        const gridHeight = (rows - 1) * buttonSpacingY + buttonHeight;
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
                fontSize: '36px',
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
        
        // Instrucciones
        const instructions = this.add.text(width / 2, height * 0.9, 'Haz clic en un nivel para comenzar', {
            fontSize: '24px',
            fontFamily: UI.BANANA_TEXT_FONT_FAMILY,
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        });
        instructions.setOrigin(0.5);
    }
}
