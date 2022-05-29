class Enemy1 extends Phaser.Physics.Arcade.Sprite {
    constructor(_scene, _posX, _posY, _keyCache) {
        super(_scene, _posX, _posY, _keyCache);

        _scene.add.existing(this);
        _scene.physics.add.existing(this);
        this.body.setAllowGravity(false);

        this.setDepth(2);

        this.speed = 150;
        this.health = 1;

        this.targetRotation = 0;
        
        this.scene = _scene;
        this.blade = false;
    }

    update(playerX, playerY) {
        this.dirX = playerX - this.body.position.x;
        this.dirY = playerY - this.body.position.y;
        var vec = new Phaser.Math.Vector2(this.dirX, this.dirY);
        vec.normalize();

        this.setVelocity(vec.x * this.speed, vec.y * this.speed);

        if (this.body.position.x > playerX) { this.flipY = true; } else { this.flipY = false; }
    }
}