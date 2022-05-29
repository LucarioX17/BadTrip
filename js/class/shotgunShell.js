class ShotgunShell extends Phaser.Physics.Arcade.Sprite {
    constructor(_scene, _posX, _posY, _keyCache) {
        super(_scene, _posX, _posY, _keyCache);

        this.shotgunX = _posX;
        this.shotgunY = _posY;

        _scene.add.existing(this);
        _scene.physics.add.existing(this);

        this.setDepth(1);

        this.setScale(0.5, 0.5).refreshBody();

        this.dirX = game.input.mousePointer.x - this.shotgunX;
        this.dirY = game.input.mousePointer.y - this.shotgunY;
        var vec = new Phaser.Math.Vector2(this.dirX, this.dirY);
        vec.normalize();

        var offset = 150;
        var randomOffsetX = Math.random() * (offset - (-offset)) + -offset;
        var randomOffsetY = Math.random() * (offset - (-offset)) + -offset;

        this.speed = 500;
        this.setVelocity(-vec.x * this.speed + randomOffsetX, -vec.y * this.speed + randomOffsetY);
        
        this.rotationSpeed = 0.5;
    }

    update() {
        if (this.dirX < 0) {
            this.rotation += this.rotationSpeed;
        } else {
            this.rotation -= this.rotationSpeed;
        }
    }
}