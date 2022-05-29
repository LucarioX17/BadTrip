class SawBlade extends Phaser.Physics.Arcade.Sprite {
    constructor(_scene, _posX, _posY, _keyCache) {
        super(_scene, _posX, _posY, _keyCache);

        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.setDepth(2);

        this.speed = 350;
        
        this.scene = _scene;
        this.rotationSpeed = 0.1;
        this.startPosList = ["up", "down", "left", "right"];
        this.startPos = "up";
        this.alreadyInPos = false;
        this.move = false;
        this.blade = true;
    }

    update() {
        if (this.move) {
            switch(this.startPos) {
                case "up":
                    if (!this.alreadyInPos) {
                        this.x = 640;
                        this.y = -128;
                        this.alreadyInPos = true;
                    }
                    this.setVelocityY(this.speed);
                    this.setVelocityX(0);
                    break;
                case "down":
                    if (!this.alreadyInPos) {
                        this.x = 640;
                        this.y = 848;
                        this.alreadyInPos = true;
                    }
                    this.setVelocityY(-this.speed);
                    this.setVelocityX(0);
                    break;
                case "left":
                    if (!this.alreadyInPos) {
                        this.y = 360;
                        this.x = -128;
                        this.alreadyInPos = true;
                    }
                    this.setVelocityX(this.speed);
                    this.setVelocityY(0);
                    break;
                case "right":
                    if (!this.alreadyInPos) {
                        this.y = 360;
                        this.x = 1408;
                        this.alreadyInPos = true;
                    }
                    this.setVelocityX(-this.speed);
                    this.setVelocityY(0);
                    break;
            }
        }

        this.rotation += this.rotationSpeed;
    }
}