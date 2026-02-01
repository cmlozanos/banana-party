/**
 * UI.js - Interfaz de usuario (contador de bananas, altura)
 */

import { UI, WORLD } from './constants.js';

export class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.setupUI();
    }

    setupUI() {
        const { width } = this.scene.cameras.main;
        
        // Contador de bananas - grande y visible
        this.bananaText = this.scene.add.text(width - UI.BANANA_TEXT_X, UI.BANANA_TEXT_Y, '🍌 0', {
            fontSize: UI.BANANA_TEXT_FONT_SIZE,
            fontFamily: UI.BANANA_TEXT_FONT_FAMILY,
            fill: UI.BANANA_TEXT_COLOR,
            stroke: UI.BANANA_TEXT_STROKE,
            strokeThickness: UI.BANANA_TEXT_STROKE_THICKNESS,
            align: 'right'
        });
        this.bananaText.setOrigin(UI.BANANA_TEXT_ORIGIN_X, UI.BANANA_TEXT_ORIGIN_Y);
        this.bananaText.setScrollFactor(UI.SCROLL_FACTOR);
        this.bananaText.setDepth(100); // Depth alto para preservar entre niveles
        
        // Indicador de altura/progreso
        this.heightText = this.scene.add.text(UI.HEIGHT_TEXT_X, UI.HEIGHT_TEXT_Y, 'Altura: 0m', {
            fontSize: UI.HEIGHT_TEXT_FONT_SIZE,
            fontFamily: UI.HEIGHT_TEXT_FONT_FAMILY,
            fill: UI.HEIGHT_TEXT_COLOR,
            stroke: UI.HEIGHT_TEXT_STROKE,
            strokeThickness: UI.HEIGHT_TEXT_STROKE_THICKNESS
        });
        this.heightText.setScrollFactor(UI.SCROLL_FACTOR);
        this.heightText.setDepth(100); // Depth alto para preservar entre niveles
        
        // Indicador de nivel
        this.levelText = this.scene.add.text(UI.HEIGHT_TEXT_X, UI.HEIGHT_TEXT_Y + 50, 'Nivel: 1', {
            fontSize: UI.HEIGHT_TEXT_FONT_SIZE,
            fontFamily: UI.HEIGHT_TEXT_FONT_FAMILY,
            fill: UI.HEIGHT_TEXT_COLOR,
            stroke: UI.HEIGHT_TEXT_STROKE,
            strokeThickness: UI.HEIGHT_TEXT_STROKE_THICKNESS
        });
        this.levelText.setScrollFactor(UI.SCROLL_FACTOR);
        this.levelText.setDepth(100); // Depth alto para preservar entre niveles
    }

    updateBananaCount(count) {
        this.bananaText.setText(`🍌 ${count}`);
        // Sin efectos visuales
    }

    updateHeight(height) {
        // height ya viene en píxeles desde el suelo
        const meters = Math.floor(height / WORLD.METERS_DIVISOR);
        this.heightText.setText(`Altura: ${meters}m`);
    }
    
    updateLevel(level) {
        this.levelText.setText(`Nivel: ${level}`);
    }
}
