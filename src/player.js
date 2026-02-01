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
        this.wasGroundedLastFrame = false; // Para estabilizar la detección
        this.groundedFrames = 0; // Contador de frames consecutivos en el suelo
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
        const blockedDown = this.sprite.body.blocked.down;
        const velocityY = this.sprite.body.velocity.y;
        
        // Detección estable de suelo usando blockedDown como indicador principal
        // blockedDown es más estable que touchingDown porque indica bloqueo de colisión
        const definitelyOnGround = blockedDown || (touchingDown && Math.abs(velocityY) < 10);
        
        // Sistema de estabilización: usar contador de frames para evitar parpadeo
        if (definitelyOnGround) {
            this.groundedFrames++;
            // Requerir al menos 2 frames consecutivos para considerar como suelo estable
            if (this.groundedFrames >= 2) {
                this.isGrounded = true;
            } else if (this.wasGroundedLastFrame) {
                // Si estaba en el suelo antes, mantenerlo aunque sea solo 1 frame
                this.isGrounded = true;
            }
        } else if (velocityY > 50) {
            // Si está cayendo rápidamente, definitivamente en el aire
            this.isGrounded = false;
            this.groundedFrames = 0;
        } else if (this.wasGroundedLastFrame && Math.abs(velocityY) < 30) {
            // Si estaba en el suelo y la velocidad es pequeña, mantener en suelo
            // Esto previene cambios rápidos cuando hay pequeñas oscilaciones
            this.isGrounded = true;
            this.groundedFrames = Math.min(this.groundedFrames + 1, 5); // Incrementar pero limitar
        } else {
            // En caso de duda, considerar en el aire
            this.isGrounded = false;
            this.groundedFrames = 0;
        }
        
        // Guardar estado para el siguiente frame
        this.wasGroundedLastFrame = this.isGrounded;
        
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
