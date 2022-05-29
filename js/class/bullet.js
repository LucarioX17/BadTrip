class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(_scene, _posX, _posY, _keyCache) {
        super(_scene, _posX, _posY, _keyCache);

        this.shotgunX = _posX;
        this.shotgunY = _posY;

        this.setDepth(1);

        _scene.add.existing(this);
        _scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.setScale(0.5, 0.5).refreshBody();

        var dirX = game.input.mousePointer.x - this.shotgunX;
        var dirY = game.input.mousePointer.y - this.shotgunY;
        var vec = new Phaser.Math.Vector2(dirX, dirY);
        vec.normalize();

        var offset = 150;
        var randomOffsetX = Math.random() * (offset - (-offset)) + -offset;
        var randomOffsetY = Math.random() * (offset - (-offset)) + -offset;

        this.speed = 1000;
        this.setVelocity(vec.x * this.speed + randomOffsetX, vec.y * this.speed + randomOffsetY);
    }
}