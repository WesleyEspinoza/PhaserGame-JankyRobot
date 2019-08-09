import 'phaser';


var config = {
    type: Phaser.AUTO,
    parent: 'gameArea',
	width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};



const game = new Phaser.Game(config);
var isPlayerJumping = false;
var player;
var meteor;
var red;
var blue;
var green;
var joystick;
var cursors;
var dinoMaxInset = 200;
var dinoMinInset = 100;


function preload ()
{
    
    this.load.image('background', 'assets/backgrounds/background.png');
    this.load.image('arcade', 'assets/backgrounds/arcade.png');
    this.load.spritesheet("player", "assets/dinos/blinky_dino.png", {
        frameWidth: 24,
        frameHeight: 21
    });
    this.load.spritesheet("green", "assets/dinos/green_dino.png", {
        frameWidth: 24,
        frameHeight: 21
    });
    this.load.spritesheet("blue", "assets/dinos/blue_dino.png", {
        frameWidth: 24,
        frameHeight: 21
    });
    this.load.spritesheet("red", "assets/dinos/red_dino.png", {
        frameWidth: 24,
        frameHeight: 21
    });
    this.load.image('joystick', 'assets/backgrounds/joystick.png');
    this.load.image('joystick_left', 'assets/backgrounds/joystick_left.png');
    this.load.image('joystick_right', 'assets/backgrounds/joystick_right.png');
    this.load.image('ground', '/assets/border/border.png');
    this.load.image('verticle_border', '/assets/border/vert_border.png');

    this.load.image('meteor0', 'assets/meteor/meteor_0.png');
    this.load.image('meteor1', 'assets/meteor/meteor_1.png');
    this.load.image('meteor2', 'assets/meteor/meteor_2.png');
    
    resize();
}

function create ()
{
    var centerY = this.cameras.main.centerY;
    var centerX = this.cameras.main.centerX
    cursors = this.input.keyboard.createCursorKeys();

    
    var bg = this.add.image(0, 0, 'background');
    bg.displayWidth = 500;bg.displayHeight = 400;
    bg.setPosition(centerX, centerY );


    meteor = this.add.sprite(centerX + 200, centerY - 200, 'meteor0');
    meteor.angle += 65
    
    meteor.scaleX = 0.05;
    meteor.scaleY = 0.05;

    var arcade = this.add.image(0, 0, 'arcade');
    arcade.setPosition(centerX + 5, centerY + 30);

    var platforms = this.physics.add.staticGroup();
    platforms.create(this.cameras.main.centerX, this.cameras.main.centerY + 180, 'ground');
    platforms.create(this.cameras.main.centerX - 270, this.cameras.main.centerY, 'verticle_border');
    platforms.create(this.cameras.main.centerX + 269, this.cameras.main.centerY, 'verticle_border');

    joystick = this.add.image(centerX - 200, centerY + 255, 'joystick');

    green = this.physics.add.sprite(centerX + 25, centerY, 'green');
    green.setBounce(0.2);
    green.scaleX = 1.5;
    green.scaleY = 1.5;
    green.body.setGravityY(300)
    

    blue = this.physics.add.sprite(centerX - 25, centerY, 'blue');
    blue.setBounce(0.2);
    blue.scaleX = 1.5;
    blue.scaleY = 1.5;
    blue.body.setGravityY(300)
    


    red = this.physics.add.sprite(centerX + 10, centerY, 'red');
    red.setBounce(0.2);
    red.scaleX = 1.5;
    red.scaleY = 1.5;
    red.body.setGravityY(300)
    

    player = this.physics.add.sprite(centerX, centerY, 'player');
    player.setBounce(0.2);
    player.scaleX = 1.5;
    player.scaleY = 1.5;
    player.setCollideWorldBounds(true);
    player.body.setGravityY(300)

    this.physics.add.collider(red, platforms);
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(meteor, platforms);
    this.physics.add.collider(blue, platforms);
    this.physics.add.collider(green, platforms);

    
    
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 13 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'red_walk',
        frames: this.anims.generateFrameNumbers('red', { start: 8, end: 13 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'red_idle',
        frames: this.anims.generateFrameNumbers('red', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: 'blue_walk',
        frames: this.anims.generateFrameNumbers('blue', { start: 8, end: 13 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'blue_idle',
        frames: this.anims.generateFrameNumbers('blue', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });


    this.anims.create({
        key: 'green_walk',
        frames: this.anims.generateFrameNumbers('green', { start: 8, end: 13 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'green_idle',
        frames: this.anims.generateFrameNumbers('green', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'meteor_fall',
        frames: [
            { key: 'meteor0', frame: 1 },
            { key: 'meteor1', frame: 2 },
            { key: 'meteor2', frame: 3 },
        ],
        frameRate: 15,
        repeat: -1
    });
}

function update() 
{
    meteor.play('meteor_fall', true);
    playerControls();

}


function playerControls(){
    if (Phaser.Input.Keyboard.JustDown(cursors.up) & isPlayerJumping === false) {
        player.setVelocityY(-250);
        red.setVelocityY(-250 + getNonZeroRandomNumber(75,50));
        blue.setVelocityY(-250 + getNonZeroRandomNumber(75,50));
        green.setVelocityY(-250 + getNonZeroRandomNumber(75,50));
        isPlayerJumping = true;
    } else if (player.body.onFloor()) {
        if (isPlayerJumping === true){
            isPlayerJumping = false;
        }
    }
    
     if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200); // move left
        player.anims.play('walk', true); // play walk animation
        player.flipX= true;// flip the sprite to the left

        red.body.setVelocityX(-200 + getNonZeroRandomNumber(dinoMaxInset,dinoMinInset)); // move left
        red.anims.play('red_walk', true); // play walk animation
        red.flipX= true;// flip the sprite to the left

        blue.body.setVelocityX(-200 + getNonZeroRandomNumber(dinoMaxInset,dinoMinInset)); // move left
        blue.anims.play('blue_walk', true); // play walk animation
        blue.flipX= true;// flip the sprite to the left

        green.body.setVelocityX(-200 + getNonZeroRandomNumber(dinoMaxInset,dinoMinInset)); // move left
        green.anims.play('green_walk', true); // play walk animation
        green.flipX= true;// flip the sprite to the left


        joystick.setTexture('joystick_left');
        
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200); // move right
        player.anims.play('walk', true); // play walk animatio
        player.flipX = false; // use the original sprite looking to the right

        red.body.setVelocityX(200 + getNonZeroRandomNumber(dinoMaxInset,dinoMinInset)); // move left
        red.anims.play('red_walk', true); // play walk animation
        red.flipX= false;// flip the sprite to the left

        blue.body.setVelocityX(200 + getNonZeroRandomNumber(dinoMaxInset,dinoMinInset)); // move left
        blue.anims.play('blue_walk', true); // play walk animation
        blue.flipX= false;// flip the sprite to the left

        green.body.setVelocityX(200 + getNonZeroRandomNumber(dinoMaxInset,dinoMinInset)); // move left
        green.anims.play('green_walk', true); // play walk animation
        green.flipX= false;// flip the sprite to the left
        

        joystick.setTexture('joystick_right');
    } else {

        player.body.setVelocityX(0);
        player.anims.play('idle', true);

        red.body.setVelocityX(0);
        red.anims.play('red_idle', true);

        blue.body.setVelocityX(0);
        blue.anims.play('blue_idle', true);

        green.body.setVelocityX(0);
        green.anims.play('green_idle', true);

        joystick.setTexture('joystick');
    }  
}


function getNonZeroRandomNumber(max, min){
    var random = Math.floor(Math.random()*max) - min;
    if(random==0) return getNonZeroRandomNumber(max, min);
    return random;
}

function resize(){
    let canvas = document.querySelector("canvas");
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let windowRatio = windowWidth / windowHeight;
    let gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
