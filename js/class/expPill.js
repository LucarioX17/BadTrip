class ExpPill extends Phaser.Physics.Arcade.Sprite {
    constructor(_scene, _posX, _posY, _keyCache) {
        super(_scene, _posX, _posY, _keyCache);

        _scene.add.existing(this);
        _scene.physics.add.existing(this);

        this.body.setAllowGravity(false);

        this.offset = 0;
        this.add = 0.5;
        
        this.rotationSpeed = 0.05;
    }

    update() {
        this.offset += 0.1;
        var scale = Math.sin(this.offset)+this.add;

        if (scale > 1) {
            this.setScale(scale);
        }

        this.rotation += this.rotationSpeed;
    }
}