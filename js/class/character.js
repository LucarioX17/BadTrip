class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(_scene, _posX, _posY, _keyCache) {
        super(_scene, _posX, _posY, _keyCache);

        _scene.add.existing(this);
        _scene.physics.add.existing(this);

        this.setDepth(1);

        this.playerSpeed = 450, this.playerJump = 550, this.canJump = 0, this.canJumpMax = 10;
        this.friction = 0.00005, this.airResistance = 0.2;
        this.targetRotation = 0, this.defaultRotation = 0.2, this.rotation_speed_min = 0.05, this.rotation_speed = this.rotation_speed_min;
        this.lastDir = 1, this.rolling = false, this.rollingCooldownMax = 60, this.rollingCooldown = 0;
        this.ledgeGrab = false;
        this.moving = false, this.movingCDMax = 6, this.movingCD = 0;
        this.enemyknockback = false, this.enemyknockbackTimerMax = 12, this.enemyknockbackTimer = this.enemyknockbackTimerMax;
        this.shoot = false;
        this.shotgunKnockbackImpulse = 250;

        this.mouse = 0;

        this.body.useDamping = true;
    }

    move(cursors, keyA, keyD, keyS, keyW) {
        if (!this.enemyknockback) {
            // LEFT & RIGHT
            if (!this.rolling) {
                if (keyA.isDown) {
                    this.lastDir = -1;
                    this.moving = true;
                    this.setVelocityX(-this.playerSpeed);
                }
                else if (keyD.isDown) {
                    this.lastDir = 1;
                    this.moving = true;
                    this.setVelocityX(this.playerSpeed);
                }
                else {
                    this.moving = false;
                    this.targetRotation = 0;
                    this.setDragX(this.body.touching.down ? this.friction : this.airResistance);
                }

                if (!this.ledgeGrab && this.body.touching.down) {
                    if (this.moving && this.movingCD == 0) {
                        if (this.targetRotation <= 0) {
                            this.targetRotation = this.defaultRotation;
                        } else {
                            this.targetRotation = -this.defaultRotation;
                        }
                        this.movingCD = this.movingCDMax;
                    } else if (this.moving > 0) {
                        this.movingCD -= 1;
                    }
                } else if (!this.body.touching.down) {
                    if (this.lastDir == 1) {
                        this.targetRotation = this.defaultRotation;
                    } else {
                        this.targetRotation = -this.defaultRotation;
                    }
                }
            }

            // LEDGE GRAB
            if (!this.body.touching.down && !this.rolling) {
                if (this.body.blocked.right || this.body.blocked.left) {
                    this.setVelocityY(0);
                    this.body.setAllowGravity(false);
                    this.rotation_speed *= 2;
                    this.ledgeGrab = true;
                } else {
                    this.body.setAllowGravity(true);
                    this.rotation_speed = this.rotation_speed_min;
                    this.ledgeGrab = false;
                }
            }

            // JUMP
            if (keyW.isDown || cursors.space.isDown) {
                if (!this.rolling) {
                    if (this.canJump > 0) {
                        this.canJump = 0;
                        this.setVelocityY(-this.playerJump);
                        sfxJump.play();
                    }
                    
                    if (this.body.blocked.right || this.body.blocked.left) {
                        this.body.setAllowGravity(true);
                        this.setVelocityY(-this.playerJump);
                    }
                }
            } else if (this.body.velocity.y < 0 && this.canJump == 0) {
                this.canJump = -1;
                this.setVelocityY(-this.playerJump/6);
            }
        } else {
            this.targetRotation = 0;
            if (this.enemyknockbackTimer > 0) {
                this.enemyknockbackTimer -= 1;
            } else {
                this.setTexture("player");
                this.enemyknockback = false;
                this.enemyknockbackTimer = this.enemyknockbackTimerMax;
            }
        }

        if (!this.body.touching.down) {
            if (this.canJump > 0) { this.canJump -= 1; }
        } else if (this.body.touching.down) {
            this.canJump = this.canJumpMax;
        }

        if (keyS.isDown) {
            this.setVelocityY(this.playerJump);
        }

        // ROLL
        if (cursors.shift.isDown && this.rollingCooldown == 0 && !this.ledgeGrab && !this.body.blocked.right && !this.body.blocked.left) {
            switch(this.lastDir) {
                case 1:
                    if (this.targetRotation < 9) {
                        this.targetRotation = 9;
                    }
                    break;
                case -1:
                    if (this.targetRotation > -9) {
                        this.targetRotation = -9;
                    }
                    break;
            }

            this.rolling = true;
            this.setVelocityX(this.playerSpeed * this.lastDir);
            this.targetRotation += (this.defaultRotation) * this.lastDir;
        } else if (this.rolling) {
            this.canJump = -1;
            this.rolling = false;
            this.body.position.y -= 10;
            this.setVelocityY(-this.playerJump);
            this.rollingCooldown = this.rollingCooldownMax;
        } else if (this.rollingCooldown > 0) {
            this.rollingCooldown -= 1;
        }

        // SPRITE ROTATION
        this.rotation = Phaser.Math.Angle.RotateTo(this.rotation, this.targetRotation, this.rotation_speed);
    }

    shotgunKnockback(shotgunX, shotgunY) {
        if (this.mouse == 0) {
            this.mouseX = game.input.mousePointer.x; 
            this.mouseY = game.input.mousePointer.y;

            this.velX = this.body.velocity.x;
            this.velY = this.body.velocity.y;
            
            this.mouse = 1;
        }
        
        var dirX = this.mouseX - shotgunX;
        var dirY = this.mouseY - shotgunY;
        var vec = new Phaser.Math.Vector2(dirX, dirY);
        vec.normalize();

        this.setVelocity(this.velX + (-vec.x * this.shotgunKnockbackImpulse), this.velY + (-vec.y * this.shotgunKnockbackImpulse));
    }

    enemyKnockback(enemyX, enemyY) {
        var dirX = enemyX - this.body.x;
        var dirY = enemyY - this.body.y;
        var vec = new Phaser.Math.Vector2(dirX, dirY);
        vec.normalize();

        var impulse = 800;

        this.setVelocity(-vec.x * impulse, -vec.y * impulse);

        this.enemyknockback = true;

        this.setTexture("playerHit");
    }
}