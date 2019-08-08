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


function preload ()
{
    
    this.load.image('background', 'assets/backgrounds/background.png');
    this.load.spritesheet("player", "assets/dinos/blinky_dino.png", {
        frameWidth: 24,
        frameHeight: 21
    });
    this.load.image('ground', '/assets/border/border.png');


    resize();
}

function create ()
{
    // platforms = this.physics.add.staticGroup();
    // platforms.create(600, 400, 'ground');

    var centerY = this.cameras.main.centerY;
    var centerX = this.cameras.main.centerX
    this.cursors = this.input.keyboard.createCursorKeys();

    
    var bg = this.add.image(0, 0, 'background');
    bg.displayWidth = 500;bg.displayHeight = 400;
    bg.setPosition(centerX, centerY);

    var platforms = this.physics.add.staticGroup();
    platforms.create(this.cameras.main.centerX, this.cameras.main.centerY + 180, 'ground');
    let player = this.physics.add.sprite(centerX, centerY, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, platforms);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
}

function update() 
{
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        player.setVelocityY(-330);
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
