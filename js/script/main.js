// CONFIGURATIONS
var config = {
    type: Phaser.AUTO,
    
    scale: {
        width: 1280,
        height: 720,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.FIT,
    },
    
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// GLOBAL VARIABLES
var game = new Phaser.Game(config);
var cam, platforms, cursors, level;
var keyA, keyD, keyS, keyW, keyEsc;
var player, shotgun, pointer, cursor;
var shootShakeDuration = 100, shootShakeIntensity = 0.005;
var shootingCooldownMax = 20, shootingCooldown = 0, reloading;
var bulletsMax = 3, bullets = bulletsMax, reloadTimerMax = 60, reloadTimer = reloadTimerMax, bulletsPerShot = 2, bulletsUI = [], justLeveledUp = false;
var healthMax = 3, health = healthMax, hearts = [];
var shotgunShells = [], bulletsList = [];
var bulletEmitter;
var enemyList = [];
var spawnSkullTimer = 0, spawnSkullTimerMax = 180, canSpawnSkulls = false, spawnSpiderTimerMax = 3600, spawnSpiderTimer = spawnSpiderTimerMax, spiderHitTimer = 0;
var timerText, totalSeconds = 0;
var expPill, pillX = [110, 640, 1170, 370, 915, 240, 1050, 640], pillY = [130, 160, 130, 280, 280, 440, 440, 600], pizza, lsd, godMode = false;
var playerLevel = 0, requiredPills = 3, currentPills = 0;
var graphics, levelBar1, levelBar2, levelText, levelBarWidth = 220;
var gamePaused = false, upgrade1, upgrade2, upgrade3, levelUpText, pauseText;
var playerDead = false, restart;
var pauseEsc = false;
var lsdTimerMax = 600, lsdTimer = 0;
var sawBlade, sawTimerMax = 1800, sawTimer = sawTimerMax;
var gameStarted = false;

// PRELOAD ASSETS
function preload() {
    this.load.image('woodFloor', 'img/woodFloor.png');
    this.load.image('woodWallLeft', 'img/woodWallLeft.png');
    this.load.image('woodWallRight', 'img/woodWallRight.png');
    this.load.image('woodTop', 'img/woodTop.png');
    this.load.image('woodFloor', 'img/woodFloor.png');
    this.load.image('woodFill', 'img/woodFill.png');
    this.load.image('woodCornerBR', 'img/woodCornerBR.png');
    this.load.image('woodCornerBL', 'img/woodCornerBL.png');
    this.load.image('woodCornerTR', 'img/woodCornerTR.png');
    this.load.image('woodCornerTL', 'img/woodCornerTL.png');
    this.load.image('woodPlatMiddle', 'img/woodPlatMiddle.png');
    this.load.image('woodPlatLeft', 'img/woodPlatLeft.png');
    this.load.image('woodPlatRight', 'img/woodPlatRight.png');
    this.load.image('woodPlatCornerRight', 'img/woodPlatCornerRight.png');
    this.load.image('woodPlatCornerLeft', 'img/woodPlatCornerLeft.png');
    this.load.image('player', 'img/player.png');
    this.load.image('playerHit', 'img/playerHit.png');
    this.load.image('shotgun', 'img/shotgunIdle.png');
    this.load.image('bullet', 'img/bullet.png');
    this.load.image('cursor', 'img/cursor.png');
    this.load.image('heartFull', 'img/heartFull.png');
    this.load.image('heartEmpty', 'img/heartEmpty.png');
    this.load.image('bulletFull', 'img/bulletAvailableFull.png');
    this.load.image('bulletEmpty', 'img/bulletAvailableEmpty.png');
    this.load.image('shell', 'img/shell.png');
    this.load.image('reloading', 'img/reloading.png');
    this.load.image('bulletParticle', 'img/bulletParticle.png');
    this.load.image('enemyParticle', 'img/enemyParticle.png');
    this.load.image('wallpaper', 'img/wallpaper.png');
    this.load.image('sofa', 'img/sofa.png');
    this.load.image('chair', 'img/chair.png');
    this.load.image('tv', 'img/tv.png');
    this.load.image('fridge', 'img/fridge.png');
    this.load.image('bed', 'img/bed.png');
    this.load.image('sideTable', 'img/sideTable.png');
    this.load.image('door', 'img/door.png');
    this.load.image('frame', 'img/frame.png');
    this.load.image('bookshelf', 'img/bookshelf.png');
    this.load.image('box', 'img/box.png');
    this.load.image('skull', 'img/skull.png');
    this.load.image('expPill', 'img/expPill.png');
    this.load.image('pillParticle', 'img/pillParticle.png');
    this.load.image('pizza', 'img/pizza.png');
    this.load.image('pizzaParticle', 'img/pizzaParticle.png');
    this.load.image('bloodParticle', 'img/bloodParticle.png');
    this.load.image('lsd', 'img/lsd.png');
    this.load.image('spider', 'img/spider.png');
    this.load.image('spiderHit', 'img/spiderHit.png');
    this.load.image('sawBlade', 'img/sawBlade.png');
    this.load.image('blueSkull', 'img/blueSkull.png');
    this.load.image('badTripTitle', 'img/badTrip.png');
    this.load.image('tutorial', 'img/tutorial.png');

    this.load.audio('shoot1', 'sfx/shoot1.wav');
    this.load.audio('shoot2', 'sfx/shoot2.wav');
    this.load.audio('hit', 'sfx/hit.wav');
    this.load.audio('death1', 'sfx/death1.wav');
    this.load.audio('death2', 'sfx/death2.wav');
    this.load.audio('button', 'sfx/button.wav');
    this.load.audio('jump', 'sfx/jump.wav');
    this.load.audio('bulletHitWall', 'sfx/bulletHitWall.wav');
    this.load.audio('enemyDeath1', 'sfx/enemyDeath1.wav');
    this.load.audio('enemyDeath2', 'sfx/enemyDeath2.wav');
    this.load.audio('pill', 'sfx/pill.wav');
    this.load.audio('pizza', 'sfx/pizza.wav');
    this.load.audio('levelUp', 'sfx/levelUp.wav');
    this.load.audio('lsd', 'sfx/lsd.wav');
    this.load.audio('music', 'sfx/music.mp3');
}

function create() {
    // TITLE
    title = this.add.image(640, 200, "badTripTitle");
    title.setDepth(9);
    title.setScale(0.7, 0.7);

    // TUTORIAL
    tutorialImg = this.add.image(-1000, -1000, "tutorial");
    tutorialImg.setDepth(9);

    // LOAD SFX
    music = this.sound.add('music', {volume: 0.3});
    music.play();
    music.loop = true;

    sfxShoot1 = this.sound.add('shoot1');
    sfxShoot2 = this.sound.add('shoot2');
    sfxShootList = [sfxShoot1, sfxShoot2];
    sfxHit = this.sound.add('hit');
    sfxDeath1 = this.sound.add('death1');
    sfxDeath2 = this.sound.add('death2');
    sfxButton = this.sound.add('button');
    sfxJump = this.sound.add('jump');
    sfxBulletHitWall = this.sound.add('bulletHitWall');
    sfxEnemyDeath1 = this.sound.add('enemyDeath1');
    sfxEnemyDeath2 = this.sound.add('enemyDeath2');
    sfxEnemyDeathList = [sfxEnemyDeath1, sfxEnemyDeath2];
    sfxPill = this.sound.add('pill');
    sfxPizza = this.sound.add('pizza');
    sfxLevelUp = this.sound.add('levelUp', {volume: 0.5});
    sfxLsd = this.sound.add('lsd');

    // BACKGROUND
    this.add.image(640, 360, "wallpaper");

    // PROPS
    this.add.image(650, 464, "sofa");
    this.add.image(780, 464, "chair");
    this.add.image(500, 436, "tv");
    this.add.image(240, 432, "fridge");
    this.add.image(700, 173, "bed");
    this.add.image(570, 174, "sideTable");
    this.add.image(1050, 434, "door");
    this.add.image(700, 115, "frame");
    this.add.image(1168, 128, "bookshelf");
    this.add.image(80, 624, "box");
    this.add.image(150, 624, "box");
    this.add.image(110, 560, "box");
    this.add.image(1180, 624, "box");
    this.add.image(1200, 560, "box");

    // CREATE PLATFORMS STATIC GROUP
    platforms = this.physics.add.staticGroup();

    // EXP PILL
    var randomIndex = getRandomInt(0, 7);
    expPill = new ExpPill(this, pillX[randomIndex], pillY[randomIndex], "expPill");

    // PIZZA MEDKIT
    pizza = new Pizza(this, -1000, -1000, "pizza");
    pizza.setDepth(2);

    // LSD
    lsd = new Lsd(this, -1000, -1000, "lsd");
    lsd.setDepth(2);

    // SAW BLADE
    enemyList.push(sawBlade = new SawBlade(this, -1000, -1000, "sawBlade"));

    // EXP BAR
    graphics = this.add.graphics();
    graphics.fillStyle(0x010001, 1);
    levelBar1 = graphics.fillRoundedRect(1020, 6, levelBarWidth, 28, 5);
    levelBar1.setDepth(1);
    graphics.fillStyle(0x205799, 1);
    levelBar2 = graphics.fillRoundedRect(1020, 6, 0, 28, 0);
    levelBar2.setDepth(1);

    levelText = this.add.text(1024, 6, 'Level ' + playerLevel.toString(), { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 20,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    });
    levelText.setDepth(1);

    // CREATE LEVEL
    level = sandbox;
    for (var i=0; i<level.length; i++) {
        for (var j=0; j<level[i].length; j++) {
            switch (level[i][j]) {
                case 1:
                    //platforms.create(j*32, i*32, 'square');
                    break;
                
                case 2:
                    player = new Character(this, j*32, i*32, "player");
                    shotgun = new Shotgun(this, -1000, -1000, "shotgun");
                    break;
                
                case 3:
                    platforms.create(j*32, i*32, 'woodFloor');
                    break;
            
                case 4:
                    platforms.create(j*32, i*32, 'woodFill');
                    break;

                case 5:
                    platforms.create(j*32, i*32, 'woodWallLeft');
                    break;
                
                case 6:
                    platforms.create(j*32, i*32, 'woodWallRight');
                    break;
                
                case 7:
                    platforms.create(j*32, i*32, 'woodTop');
                    break;
                
                case 8:
                    platforms.create(j*32, i*32, 'woodCornerBR');
                    break;

                case 9:
                    platforms.create(j*32, i*32, 'woodCornerBL');
                    break;
                
                case 10:
                    platforms.create(j*32, i*32, 'woodCornerTL');
                    break;
                
                case 11:
                    platforms.create(j*32, i*32, 'woodCornerTR');
                    break;
                
                case 12:
                    platforms.create(j*32, i*32, 'woodPlatMiddle');
                    break;
                
                case 13:
                    platforms.create(j*32, i*32, 'woodPlatLeft');
                    break;
                
                case 14:
                    platforms.create(j*32, i*32, 'woodPlatRight');
                    break;
                
                case 15:
                    platforms.create(j*32, i*32, 'woodPlatCornerRight');
                    break;
                
                case 16:
                    platforms.create(j*32, i*32, 'woodPlatCornerLeft');
                    break;
            }
        }
    }

    // INITIALIZE COLLIDERS4
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(enemyList);

    this.physics.add.overlap(bulletsList, platforms, bulletPlatformCollision, null, this);
    this.physics.add.overlap(bulletsList, enemyList, bulletEnemyCollision, null, this);
    this.physics.add.overlap(shotgunShells, platforms, shotgunShellCollision, null, this);
    this.physics.add.overlap(player, enemyList, enemyPlayerCollision, null, this);
    this.physics.add.overlap(player, expPill, expPillCollision, null, this);
    this.physics.add.overlap(player, expPill, expPillCollision, null, this);
    this.physics.add.overlap(player, pizza, pizzaCollision, null, this);
    this.physics.add.overlap(player, lsd, lsdCollision, null, this);

    // DETECT KEYBOARD INPUTS
    cursors = this.input.keyboard.createCursorKeys();

    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyEsc = this.input.keyboard.addKey('Esc');

    // MAIN CAMERA
    cam = this.cameras.main;
    cam.setBackgroundColor('#1b0326');

    // CROSSHAIR
    cursor = this.add.image(10, 10, "cursor");
    cursor.setDepth(10);

    // RELOADING IMG
    reloading = this.add.image(10, 10, "reloading");
    reloading.setScale(0.9, 0.9);
    reloading.setDepth(1);
    reloading.visible = false;

    // PARTICLE EMITTER
    bulletEmitter = this.add.particles('bulletParticle').createEmitter({
        x: -1000,
        y: -1000,
        speed: { min: -400, max: 400 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.5, end: 0 },
        blendMode: 'NORMAL',
        lifespan: 300,
        gravityY: 800
    });

    pillEmitter = this.add.particles('pillParticle').createEmitter({
        x: -1000,
        y: -1000,
        speed: { min: -400, max: 400 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.5, end: 0 },
        blendMode: 'NORMAL',
        lifespan: 300,
        gravityY: 800
    });

    pizzaEmitter = this.add.particles('pizzaParticle').createEmitter({
        x: -1000,
        y: -1000,
        speed: { min: -400, max: 400 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.5, end: 0 },
        blendMode: 'NORMAL',
        lifespan: 300,
        gravityY: 800
    });
    
    enemyEmitter = this.add.particles('enemyParticle').createEmitter({
        x: -1000,
        y: -1000,
        speed: { min: -400, max: 400 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.5, end: 0 },
        blendMode: 'NORMAL',
        lifespan: 450,
        gravityY: 800
    });

    bloodEmitter = this.add.particles('bloodParticle').createEmitter({
        x: -1000,
        y: -1000,
        speed: { min: -500, max: 500 },
        angle: { min: 0, max: 360 },
        scale: { start: 1.5, end: 0 },
        blendMode: 'NORMAL',
        lifespan: 750,
        gravityY: 800
    });

    // TIMER
    timerText = this.add.text(610, -2, '0:0', { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 32,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    });
    setInterval(countTimer, 1000);

    // UPGRADE OPTIONS
    pauseText = this.add.text(-1000, -1000, 'Paused', { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 48,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    }).setOrigin(0.5).setDepth(9);

    levelUpText = this.add.text(-1000, -1000, 'Level UP!', { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 48,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    }).setOrigin(0.5).setDepth(9);

    upgrade1 = this.add.text(-1000, -1000, '+1 Ammo', { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 32,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    })
    .setOrigin(0.5)
    .setPadding(10)
    .setStyle({ backgroundColor: '#010001'})
    .setInteractive()
    .on('pointerdown', resumeGame)
    .on('pointerdown', plusAmmo)
    .on('pointerover', () => upgrade1.setStyle({ fill: '#2c89b3' }))
    .on('pointerout', () => upgrade1.setStyle({ fill: '#ffffff' })).setDepth(9);

    upgrade2 = this.add.text(-1000, -1000, '+1 Heart', { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 32,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    })
    .setOrigin(0.5)
    .setPadding(10)
    .setStyle({ backgroundColor: '#010001'})
    .setInteractive()
    .on('pointerdown', resumeGame)
    .on('pointerdown', plusHealth)
    .on('pointerover', () => upgrade2.setStyle({ fill: '#2c89b3' }))
    .on('pointerout', () => upgrade2.setStyle({ fill: '#ffffff' })).setDepth(9);

    upgrade3 = this.add.text(-1000, -1000, '+1 Bullet', { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 32,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    })
    .setOrigin(0.5)
    .setPadding(10)
    .setStyle({ backgroundColor: '#010001'})
    .setInteractive()
    .on('pointerdown', resumeGame)
    .on('pointerdown', plusBullet)
    .on('pointerover', () => upgrade3.setStyle({ fill: '#2c89b3' }))
    .on('pointerout', () => upgrade3.setStyle({ fill: '#ffffff' })).setDepth(9);

    restart = this.add.text(-1000, -1000, 'Restart', { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 32,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    })
    .setOrigin(0.5)
    .setPadding(10)
    .setStyle({ backgroundColor: '#010001'})
    .setInteractive()
    .on('pointerdown', restartGame)
    .on('pointerover', () => restart.setStyle({ fill: '#2c89b3' }))
    .on('pointerout', () => restart.setStyle({ fill: '#ffffff' })).setDepth(9);

    startButton = this.add.text(540, 360, 'Start', { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 32,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    })
    .setOrigin(0.5)
    .setPadding(10)
    .setStyle({ backgroundColor: '#010001'})
    .setInteractive()
    .on('pointerdown', startGame)
    .on('pointerover', () => startButton.setStyle({ fill: '#2c89b3' }))
    .on('pointerout', () => startButton.setStyle({ fill: '#ffffff' })).setDepth(9);

    tutorialButton = this.add.text(740, 360, 'Tutorial', { 
        fontFamily: 'Verdana',
        fontStyle: 'bold',
        fontSize: 32,
        color: '#ffffff',
        stroke: '#010001',
        strokeThickness: 4
    })
    .setOrigin(0.5)
    .setPadding(10)
    .setStyle({ backgroundColor: '#010001'})
    .setInteractive()
    .on('pointerdown', tutorial)
    .on('pointerover', () => tutorialButton.setStyle({ fill: '#2c89b3' }))
    .on('pointerout', () => tutorialButton.setStyle({ fill: '#ffffff' })).setDepth(9);
}

function update() {
    if (Phaser.Input.Keyboard.JustDown(keyEsc)) {
        pauseEsc = !pauseEsc;

        if (pauseEsc) {
            pauseGame();
        } else {
            resumeGame();
        }
    }

    cursor.x = game.input.mousePointer.x;
    cursor.y = game.input.mousePointer.y;

    if (player != undefined && !gamePaused && gameStarted) {
        if (sawTimer == 0) {
            var randomTimer = getRandomInt(600, 1800);
            var randomIndex = getRandomInt(0, 3);
            sawBlade.startPos = sawBlade.startPosList[randomIndex];
            sawBlade.move = true;
            sawBlade.alreadyInPos = false;
            sawTimer = randomTimer;
        } else {
            sawTimer -= 1;
        }

        if (lsdTimer == 0) {
            godMode = false;
            document.body.style.animation = "psychedelic";
            player.shotgunKnockbackImpulse = 250;
        } else {
            lsdTimer -= 1;
        }

        expPill.update();
        pizza.update();
        lsd.update();
        sawBlade.update();

        player.move(cursors, keyA, keyD, keyS, keyW);

        reloading.x = player.body.x + 16;
        reloading.y = player.body.y - 20;

        if (player.rolling) {
            shotgun.visible = false;
        } else {
            shotgun.visible = true;
        }

        var shotgunAngle = angle(shotgun.body.x, shotgun.body.y, game.input.mousePointer.x, game.input.mousePointer.y);
        shotgun.setAngle(shotgunAngle);
        shotgun.setOrigin(0, 0.5);
        shotgun.body.x = player.body.x+16;
        shotgun.body.y = player.body.y+32;

        if (shotgunAngle > 90 || shotgunAngle < -90) {
            shotgun.flipY = true;
        } else {
            shotgun.flipY = false;
        }

        if (justLeveledUp) {
            shootingCooldown = 6;
            justLeveledUp = false;
        }

        pointer = this.input.activePointer;
        if (shootingCooldown == 0) {
            if (pointer.isDown || godMode) {
                if (!player.shoot && !player.rolling && bullets > 0) {
                    player.shoot = true;
                    shotgun.canRecoil = true;
                    cam.shake(shootShakeDuration, shootShakeIntensity, true);
                    
                    if (!godMode) {
                        bullets -= 1;
                    }
        
                    var randomIndex = getRandomInt(0, sfxShootList.length-1);
                    sfxShootList[randomIndex].play();
        
                    for (var i=0; i<bulletsPerShot; i++) {
                        bulletsList.push(new Bullet(this, shotgun.body.x-18, shotgun.body.y-16, "bullet"));
                    }
        
                    shotgunShells.push(new ShotgunShell(this, shotgun.body.x, shotgun.body.y-16, "shell"));
        
                    shootingCooldown = shootingCooldownMax;
                }
            }
        } else if (shootingCooldown > 0) {
            shootingCooldown -= 1;
        }
        

        if (bullets == 0 && reloadTimer > 0) {
            reloadTimer -= 1;
            reloading.visible = true;
        } else if (bullets == 0) {
            bullets = bulletsMax;
            reloadTimer = reloadTimerMax;
            reloading.visible = false;
        }

        if (shotgun.canRecoil) {
            player.shotgunKnockback(shotgun.body.x, shotgun.body.y);
            shotgun.knockback();
        } else {
            player.mouse = 0;
            player.shoot = false;
        }

        for (var i=0; i<bulletsMax; i++) {
            if (bulletsUI[i] != undefined) { bulletsUI[i].destroy(); }
            if (i+1 <= bullets) {
                bulletsUI[i] = this.add.image(24, 38 * i + 24, "bulletFull");
            } else {
                bulletsUI[i] = this.add.image(24, 38 * i + 24, "bulletEmpty");
            }
        }

        for (var i=0; i<shotgunShells.length; i++) {
            shotgunShells[i].update();
        }

        for (var i=0; i<enemyList.length; i++) {
            enemyList[i].update(player.body.x, player.body.y);
            if (!enemyList[i].blade) {
                enemyList[i].setAngle(angle(enemyList[i].body.position.x, enemyList[i].body.position.y, player.body.position.x, player.body.position.y));
            }
            if (enemyList[i].spider && spiderHitTimer == 0) {
                enemyList[i].setTexture("spider");
            }
        }

        if (canSpawnSkulls) {
            if (spawnSkullTimer <= 0) {
                var randomX = 0;
                var randomY = 0;
                while (randomX >= 0 && randomX <= 1280) {
                    randomX = getRandomNumber(-100, 1380);
                }
                while (randomY >= 0 && randomY <= 720) {
                    randomY = getRandomNumber(-100, 820);
                }
                
                var randomNumber = getRandomInt(1, 10);
                if (randomNumber >= 4) {
                    enemyList.push(new Enemy1(this, randomX, randomY, "skull"));
                } else {
                    enemyList.push(new Enemy3(this, randomX, randomY, "blueSkull"));
                }
                spawnSkullTimer = spawnSkullTimerMax;
                spawnSkullTimerMax -= 0.25;
            } else {
                spawnSkullTimer -= 1;
            }

            if (spawnSpiderTimer <= 0) {
                var randomX = 0;
                var randomY = 0;
                while (randomX >= 0 && randomX <= 1280) {
                    randomX = getRandomNumber(-100, 1380);
                }
                while (randomY >= 0 && randomY <= 720) {
                    randomY = getRandomNumber(-100, 820);
                }
    
                enemyList.push(new Enemy2(this, randomX, randomY, "spider"));
                spawnSpiderTimer = spawnSpiderTimerMax;
                spawnSpiderTimerMax -= 300;
            } else {
                spawnSpiderTimer -= 1;
            }
        }

        if (spiderHitTimer > 0) {
            spiderHitTimer -= 1;
        }
    }

    for (var i=0; i<healthMax; i++) {
        if (hearts[i] != undefined) { hearts[i].destroy(); }
        if (i+1 <= health) {
            hearts[i] = this.add.image(38 * i + 64, 20, "heartFull");
        } else {
            hearts[i] = this.add.image(38 * i + 64, 20, "heartEmpty");
        }
    }
}

function shotgunShellCollision(shell, platform) {
    shell.setVelocity(0, 0);
    shell.body.setAllowGravity(false);
    shell.rotationSpeed = 0;
}

function bulletPlatformCollision(bullet, platform) {
    bullet.destroy();
    bulletEmitter.setPosition(bullet.x, bullet.y);
    bulletEmitter.explode();
    bulletEmitter.explode();

    sfxBulletHitWall.play();
}

function bulletEnemyCollision(bullet, enemy) {
    if (!enemy.blade) {
        bullet.destroy();
        bulletEmitter.setPosition(bullet.x, bullet.y);
        bulletEmitter.explode();
        bulletEmitter.explode();

        enemyEmitter.setPosition(enemy.x, enemy.y);
        for (var i=0; i<20; i++) {
            enemyEmitter.explode();
        }

        if (enemy.spider) {
            enemy.setTexture("spiderHit");
            spiderHitTimer = 10;
        }

        enemy.health -= 1;
        if (enemy.health <= 0) {
            removeItem(enemyList, enemy);
            enemy.destroy();

            if (pizza.body.position.x < 0) {
                var randomChance = getRandomInt(1, 100);

                if (randomChance >= 85) {
                    pizza.body.position.x = enemy.x;
                    pizza.body.position.y = enemy.y;
                }

                if (randomChance <= 2) {
                    lsd.body.position.x = enemy.x;
                    lsd.body.position.y = enemy.y;
                }
            }
        }

        cam.shake(shootShakeDuration*1.5, shootShakeIntensity*1.5, true);

        var randomIndex = getRandomInt(0, sfxEnemyDeathList.length-1);
        sfxEnemyDeathList[randomIndex].play();
    }
}

function enemyPlayerCollision(player, enemy) {
    if (!player.rolling && !player.enemyknockback && !godMode) {
        health -= 1;
        player.enemyKnockback(enemy.body.x, enemy.body.y);
        cam.shake(shootShakeDuration*2, shootShakeIntensity*2, true);

        if (health <= 0) {
            playerDead = true;
            pauseGame();
            sfxDeath1.play();
            sfxDeath2.play();
        } else {
            sfxHit.play();
        }
    }
}

function expPillCollision(player, pill) {
    pillEmitter.setPosition(pill.x, pill.y);
    pillEmitter.explode();
    pillEmitter.explode();

    var randomIndex = getRandomInt(0, 7);
    pill.body.position.x = pillX[randomIndex]; 
    pill.body.position.y = pillY[randomIndex];
    cam.shake(shootShakeDuration, shootShakeIntensity, true);

    currentPills += 1;
    if (currentPills == requiredPills) {
        playerLevel += 1;
        requiredPills += 2;
        currentPills = 0;
        sfxLevelUp.play();
        pauseGame();
    } else {
        sfxPill.play();
    }

    var percent = currentPills / requiredPills;
    graphics.clear();
    graphics.fillStyle(0x010001, 1);
    levelBar1 = graphics.fillRoundedRect(1020, 6, levelBarWidth, 28, 5);
    graphics.fillStyle(0x205799, 1);
    if (levelBarWidth * percent == 0) {
        levelBar2 = graphics.fillRoundedRect(1020, 6, levelBarWidth * percent, 28, 0);
    } else {
        levelBar2 = graphics.fillRoundedRect(1020, 6, levelBarWidth * percent, 28, 5);
    }

    levelText.setText('Level ' + playerLevel.toString());
}

function countTimer() {
    if (!gamePaused && gameStarted) {
        totalSeconds += 1;
        var hour = Math.floor(totalSeconds/3600);
        var minute = Math.floor((totalSeconds - hour*3600)/60);
        var seconds = totalSeconds - (hour*3600 + minute*60);
        timerText.setText(minute + ":" + seconds);
    }

    if (totalSeconds == 180) { // 3 minutes
        spawnSkullTimerMax = spawnSkullTimerMax/2;
    }
}

function pauseGame() {
    gamePaused = true;
    player.setVelocity(0);
    player.body.setAllowGravity(false);

    for (var i=0; i<enemyList.length; i++) {
        enemyList[i].setVelocity(0);
    }

    sawBlade.setVelocity(0);

    if (!pauseEsc) {
        if (!playerDead) {
            levelUpText.x = cam.centerX;
            levelUpText.y = cam.centerY-130;
    
            upgrade1.x = cam.centerX;
            upgrade1.y = cam.centerY-64;
    
            upgrade2.x = cam.centerX;
            upgrade2.y = cam.centerY;
    
            upgrade3.x = cam.centerX;
            upgrade3.y = cam.centerY+64;
        } else {
            bloodEmitter.setPosition(player.x, player.y);
            for (var i=0; i<120; i++) {
                bloodEmitter.explode();
            }
    
            player.destroy();
            shotgun.destroy();
    
            restart.x = cam.centerX;
            restart.y = cam.centerY;
    
            cam.shake(shootShakeDuration*4, shootShakeIntensity*4, true);
        }
    } else {
        pauseText.x = cam.centerX;
        pauseText.y = cam.centerY;
    }
}

function resumeGame() {
    gamePaused = false;

    pauseText.x = -1000;
    pauseText.y = -1000;
    levelUpText.x = -1000;
    levelUpText.y = -1000;
    upgrade1.x = -1000;
    upgrade1.y = -1000;
    upgrade2.x = -1000;
    upgrade2.y = -1000;
    upgrade3.x = -1000;
    upgrade3.y = -1000;
}

function restartGame() {
    sfxButton.play();
    window.location.reload();
}

function plusAmmo() {
    bulletsMax += 1;
    sfxButton.play();
    justLeveledUp = true;
}

function plusHealth() {
    healthMax += 1;
    health += 1;
    sfxButton.play();
    justLeveledUp = true;
}

function plusBullet() {
    bulletsPerShot += 1;
    sfxButton.play();
    justLeveledUp = true;
}

function pizzaCollision(player, pizzaTemp) {
    pizzaEmitter.setPosition(pizzaTemp.x, pizzaTemp.y);
    pizzaEmitter.explode();
    pizzaEmitter.explode();
    pizzaEmitter.explode();
    pizzaEmitter.explode();

    health = healthMax;
    pizza.body.position.x = -1000;
    pizza.body.position.y = -1000;

    cam.shake(shootShakeDuration, shootShakeIntensity, true);
    sfxPizza.play();
}

function lsdCollision(player, lsd) {
    godMode = true;
    shootingCooldownMax = 5;
    player.shotgunKnockbackImpulse = 0;
    bullets = bulletsMax;
    lsdTimer = lsdTimerMax;

    document.body.style.animation = "psychedelic";
    document.body.style.animationDuration = "10s";
    document.body.style.animationTimingFunction = "linear";
    document.body.style.animationIterationCount = "infinite";

    lsd.body.position.x = -1000;
    lsd.body.position.y = -1000;

    sfxLsd.play();
}

function startGame() {
    gameStarted = true;
    canSpawnSkulls = true;
    startButton.destroy();
    tutorialButton.destroy();
    title.destroy();
    tutorialImg.destroy();
    sfxButton.play();
    justLeveledUp = true;
}

function tutorial() {
    tutorialButton.destroy();
    title.destroy();
    sfxButton.play();

    tutorialImg.x = 640;
    tutorialImg.y = 320;
    startButton.x += 100;
    startButton.y += 280;
}

function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx);
    return theta * 180 / Math.PI;
}

function removeItem(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}