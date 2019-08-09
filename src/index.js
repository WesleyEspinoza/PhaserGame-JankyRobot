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
            debug: true
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
var joystick;
var cursors;


function preload ()
{
    
    this.load.image('background', 'assets/backgrounds/background.png');
    this.load.image('arcade', 'assets/backgrounds/arcade.png');
    this.load.spritesheet("player", "assets/dinos/blinky_dino.png", {
        frameWidth: 24,
        frameHeight: 21
    });
    this.load.spritesheet("joystick", 'assets/backgrounds/joystick.png', {
        frameWidth: 125,
        frameHeight: 69
    });
    this.load.image('ground', '/assets/border/border.png');
    this.load.image('verticle_border', '/assets/border/vert_border.png');
    
    resize();
}

function create ()
{
    var centerY = this.cameras.main.centerY;
    var centerX = this.cameras.main.centerX
    

    
    var bg = this.add.image(0, 0, 'background');
    bg.displayWidth = 500;bg.displayHeight = 400;
    bg.setPosition(centerX, centerY);

    var arcade = this.add.image(0, 0, 'arcade');
    arcade.setPosition(centerX, centerY + 25);

    var platforms = this.physics.add.staticGroup();
    platforms.create(this.cameras.main.centerX, this.cameras.main.centerY + 180, 'ground');
    platforms.create(this.cameras.main.centerX - 270, this.cameras.main.centerY, 'verticle_border');
    platforms.create(this.cameras.main.centerX + 269, this.cameras.main.centerY, 'verticle_border');
    player = this.physics.add.sprite(centerX, centerY, 'player');
    joystick = this.add.sprite(centerX - 200, centerY + 290, 'joystick');
    player.setBounce(0.2);
    player.scaleX = 1.5;
    player.scaleY = 1.5;
    player.setCollideWorldBounds(true);
        player.body.setGravityY(300)
        cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platforms);
    
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
        key: 'joystick_flick',
        frames: this.anims.generateFrameNumbers('joystick', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: 0
    });

    this.anims.create({
        key: 'joystick_straight',
        frames: this.anims.generateFrameNumbers('joystick', { start: 0, end: 0 }),
        frameRate: 16,
        repeat: 0
    });
}

function update() 
{
    
    if (Phaser.Input.Keyboard.JustDown(cursors.up) & isPlayerJumping === false) {
        player.setVelocityY(-200);
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
        joystick.anims.play('joystick_flick', true)
        joystick.flipX= true;
        
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(200); // move right
        player.anims.play('walk', true); // play walk animatio
        player.flipX = false; // use the original sprite looking to the right
        joystick.anims.play('joystick_flick', true)
        joystick.flipX= false;
    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
        joystick.anims.play('joystick_straight', true)
    }  

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
