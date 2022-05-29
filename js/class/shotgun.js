class Shotgun extends Phaser.Physics.Arcade.Sprite {
    constructor(_scene, _posX, _posY, _keyCache) {
        super(_scene, _posX, _posY, _keyCache);

        _scene.add.existing(this);
        _scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.setScale(0.4, 0.45).refreshBody();

        this.setDepth(3);

        this.recoilMax = 40;
        this.recoil = this.recoilMax;
        this.canRecoil = false;

        this.rotation_speed = 0.05;
    }
    
    knockback() {
        if (this.recoil == this.recoilMax) {
            this.mouseX = game.input.mousePointer.x;
            this.mouseY = game.input.mousePointer.y;

            this.shotgunX = this.body.x;
            this.shotgunY = this.body.y;
        }

        var dirX = this.mouseX - this.shotgunX;
        var dirY = this.mouseY - this.shotgunY;
        var vec = new Phaser.Math.Vector2(dirX, dirY);
        vec.normalize();

        this.body.x -= vec.x * this.recoil;
        this.body.y -= vec.y * this.recoil;

        this.recoil -= 5;
        if (this.recoil == 0) {
            this.canRecoil = false;
            this.recoil = this.recoilMax;
        }
    }
}