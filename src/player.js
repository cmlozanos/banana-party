/**
 * Player.js - Control del personaje mono
 */

import { PLAYER } from './constants.js';

export class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        
        if (!scene.textures.exists(PLAYER.TEXTURE_MONO_CUADRADO)) {
            const graphics = scene.add.graphics();
            graphics.fillStyle(PLAYER.COLOR, 1);
            graphics.lineStyle(PLAYER.BORDER_WIDTH, PLAYER.BORDER_COLOR, 1);
            
            // Triángulo apuntando hacia arriba
            const centerX = PLAYER.WIDTH / 2;
            graphics.beginPath();
            graphics.moveTo(centerX, 0);
            graphics.lineTo(PLAYER.WIDTH, PLAYER.HEIGHT);
            graphics.lineTo(0, PLAYER.HEIGHT);
            graphics.closePath();
            graphics.fillPath();
            graphics.strokePath();
            
            graphics.generateTexture(PLAYER.TEXTURE_MONO_CUADRADO, PLAYER.WIDTH, PLAYER.HEIGHT);
            graphics.destroy();
        }
        
        this.sprite = scene.physics.add.sprite(x, y, PLAYER.TEXTURE_MONO_CUADRADO);
        this.setupSpriteProperties();
    }
    
    setupSpriteProperties() {
        this.sprite.setScale(PLAYER.SCALE);
        this.sprite.setCollideWorldBounds(true);
        this.speed = PLAYER.SPEED;
        this.jumpPower = PLAYER.JUMP_POWER;
        this.isGrounded = false;
        this.currentAnimation = 'idle';
        this.setupAnimations();
        this.sprite.setBounce(PLAYER.BOUNCE);
        this.sprite.body.setSize(PLAYER.BODY_WIDTH, PLAYER.BODY_HEIGHT);
        this.sprite.body.setOffset(PLAYER.BODY_OFFSET_X, PLAYER.BODY_OFFSET_Y);
        this.sprite.body.setGravityY(PLAYER.GRAVITY);
        this.sprite.body.setCollideWorldBounds(true);
        this.sprite.body.setBounce(PLAYER.BOUNCE);
        this.sprite.body.setMaxVelocity(PLAYER.MAX_VELOCITY_X, PLAYER.MAX_VELOCITY_Y);
        this.sprite.setDepth(PLAYER.DEPTH);
        this.sprite.setAlpha(PLAYER.ALPHA);
        this.sprite.setVisible(true);
        this.sprite.setOrigin(PLAYER.ORIGIN_X, PLAYER.ORIGIN_Y);
    }

    setupAnimations() {
        this.animations = {
            idle: PLAYER.TEXTURE_MONO_CUADRADO,
            caminar: PLAYER.TEXTURE_MONO_CUADRADO,
            salto: PLAYER.TEXTURE_MONO_CUADRADO,
            aterrizaje: PLAYER.TEXTURE_MONO_CUADRADO
        };
    }

    update(cursors) {
        const touchingDown = this.sprite.body.touching.down;
        const velocityY = this.sprite.body.velocity.y;
        this.isGrounded = touchingDown || (Math.abs(velocityY) < PLAYER.GROUND_VELOCITY_THRESHOLD && this.sprite.body.blocked.down);
        
        if (cursors.left.isDown) {
            this.sprite.setVelocityX(-this.speed);
            this.setAnimation('caminar');
            this.sprite.setFlipX(true);
        } else if (cursors.right.isDown) {
            this.sprite.setVelocityX(this.speed);
            this.setAnimation('caminar');
            this.sprite.setFlipX(false);
        } else {
            this.sprite.setVelocityX(this.sprite.body.velocity.x * PLAYER.FRICTION);
            if (this.isGrounded) {
                this.setAnimation('idle');
            }
        }
        
        if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.isGrounded) {
            this.sprite.setVelocityY(this.jumpPower);
            this.setAnimation('salto');
            this.isGrounded = false;
        }
        
        if (!this.isGrounded) {
            this.setAnimation('salto');
        } else if (Math.abs(this.sprite.body.velocity.x) < PLAYER.IDLE_VELOCITY_THRESHOLD) {
            this.setAnimation('idle');
        }
        
        // Redondear posición solo cuando está en el suelo para evitar saltos visuales durante el movimiento
        if (this.isGrounded) {
            this.sprite.x = Math.round(this.sprite.x);
            this.sprite.y = Math.round(this.sprite.y);
        }
    }

    setAnimation(animationName) {
        if (this.currentAnimation !== animationName) {
            this.currentAnimation = animationName;
            const textureKey = this.animations[animationName] || PLAYER.TEXTURE_MONO_CUADRADO;
            if (this.scene.textures.exists(textureKey)) {
                this.sprite.setTexture(textureKey);
            }
        }
    }
}
