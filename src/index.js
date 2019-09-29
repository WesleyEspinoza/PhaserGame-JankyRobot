import 'phaser';
// initial config
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
//all the vars we need
var BetweenPoints = Phaser.Math.Angle.BetweenPoints;
var SetToAngle = Phaser.Geom.Line.SetToAngle;
var score = 0;
var started = false;
var timer = 0;
var scoreText;
var isPlayerJumping = false;
var platforms
var player;
var yellow;
var red;
var blue;
var green;
var joystick;
var button;
var cursors;
var dinoMaxInset = 250;
var dinoMinInset = 150;
var redDinoSpeed = Phaser.Math.RND.between(dinoMaxInset,dinoMinInset);
var yellowDinoSpeed = Phaser.Math.RND.between(dinoMaxInset,dinoMinInset);
var greenDinoSpeed = Phaser.Math.RND.between(dinoMaxInset,dinoMinInset);
var blueDinoSpeed = Phaser.Math.RND.between(dinoMaxInset,dinoMinInset);
var dinos = [];
var music;
var deathMusic;
var menumusic;

//pre load the images
function preload ()
{
    
    this.load.image('background', './assets/background.png');

    this.load.image('cloud0', './assets/cloud_0.png');
    this.load.image('cloud1', './assets/cloud_1.png');
    this.load.image('cloud2', './assets/cloud_2.png');
    this.load.image('cloud3', './assets/cloud_3.png');

    this.load.image('arcade', './assets/arcade.png');


    this.load.image('button', './assets/button.png');

    this.load.spritesheet('player', './assets/blinky_dino.png', {
        frameWidth: 24,
        frameHeight: 21
    });
    this.load.spritesheet('green', './assets/green_dino.png', {
        frameWidth: 24,
        frameHeight: 21
    });
    this.load.spritesheet('blue', './assets/blue_dino.png', {
        frameWidth: 24,
        frameHeight: 21
    });
    this.load.spritesheet('red', './assets/red_dino.png', {
        frameWidth: 24,
        frameHeight: 21
    });

    this.load.image('joystick', './assets/joystick.png');
    this.load.image('joystick_left', './assets/joystick_left.png');
    this.load.image('joystick_right', './assets/joystick_right.png');
    this.load.image('ground', './assets/border.png');
    this.load.image('verticle_border', './assets/vert_border.png');

    this.load.image('meteor0', './assets/meteor_0.png');
    this.load.image('meteor1', './assets/meteor_1.png');
    this.load.image('meteor2', './assets/meteor_2.png');

    this.load.audio("mainMusic",'./assets/mainMusic.mp3');
    this.load.audio("menuMusic",'./assets/menu.mp3');
    this.load.audio("deathMusic",'./assets/death.mp3');
    this.input.setDefaultCursor('url(./assets/claw.cur), pointer');
    
    resize();
}

// create all the objects we need
function create ()
{
    var centerY = this.cameras.main.centerY;
    var centerX = this.cameras.main.centerX;
    cursors = this.input.keyboard.createCursorKeys();

    

    scoreText = this.add.text(centerX - 100, centerY - 150, 'score: 0', { fontSize: '45px', fill: '#FFF' });
    scoreText.setDepth(12)
    
    var bg = this.add.image(0, 0, 'background');
    bg.setDepth(1);

    bg.displayWidth = 500;bg.displayHeight = 400;
    bg.setPosition(centerX, centerY );

    button = this.add.sprite(centerX + 15, centerY, 'button').setInteractive();
    button.scaleX = 0.05;
    button.scaleY = 0.05;
    button.setDepth(12);
    button.on('pointerdown', startSpawner.bind(this)); 
    

    var arcade = this.add.image(0, 0, 'arcade');
    arcade.setPosition(centerX + 5, centerY + 30);
    arcade.setDepth(11);

    var clouds = this.add.group();
    clouds.create(centerX - 175, centerY - 175, 'cloud0');
    clouds.create(centerX - 55, centerY - 175, 'cloud1');
    clouds.create(centerX + 55 , centerY - 175, 'cloud2');
    clouds.create(centerX + 175, centerY - 175, 'cloud3');
    clouds.setDepth(8);

    platforms = this.physics.add.staticGroup();
    platforms.create(centerX, centerY + 180, 'ground');
    platforms.create(centerX - 270, centerY, 'verticle_border');
    platforms.create(centerX + 269, centerY, 'verticle_border');

    joystick = this.add.image(centerX - 5, centerY + 255, 'joystick');
    joystick.setDepth(13);

    green = this.physics.add.sprite(centerX + 25, centerY + 150, 'green');
    green.setBounce(0.2);
    green.scaleX = 1.5;
    green.scaleY = 1.5;
    green.body.setGravityY(300)
    green.setDepth(4);
    

    blue = this.physics.add.sprite(centerX - 25, centerY + 150, 'blue');
    blue.setBounce(0.2);
    blue.scaleX = 1.5;
    blue.scaleY = 1.5;
    blue.body.setGravityY(300)
    blue.setDepth(5);
    


    red = this.physics.add.sprite(centerX + 10, centerY + 150, 'red');
    red.setBounce(0.2);
    red.scaleX = 1.5;
    red.scaleY = 1.5;
    red.body.setGravityY(300)
    red.setDepth(2);
    

    yellow = this.physics.add.sprite(centerX, centerY + 150, 'player');
    yellow.setBounce(0.2);
    yellow.scaleX = 1.5;
    yellow.scaleY = 1.5;
    yellow.setCollideWorldBounds(true);
    yellow.body.setGravityY(300);
    yellow.setDepth(3);
    

    this.physics.add.collider(red, platforms);
    this.physics.add.collider(yellow, platforms);
    this.physics.add.collider(blue, platforms);
    this.physics.add.collider(green, platforms);

    dinos.push(red);
    dinos.push(yellow);
    dinos.push(green);
    dinos.push(blue);
    player = dinos[dinos.length - 1];

    menumusic = this.sound.add('menuMusic');
    menumusic.setLoop(true);
    menumusic.play();

    
    //animations
    this.anims.create({
        key: 'yellow_walk',
        frames: this.anims.generateFrameNumbers('player', { start: 8, end: 13 }),
        frameRate: 20,
        repeat: -1
    });
    this.anims.create({
        key: 'yellow_idle',
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

    if (started){
        timer ++;
    }
    

    if (timer === 100) {
        score ++;
        scoreText.setText('Score: ' + score);
        timer = 0
    }


    if (dinos.length === 0){
        music.stop();
        deathMusic = this.sound.add('deathMusic');
        deathMusic.setLoop(true);
        deathMusic.play();
        alert("The Dinos Have Gone Extinct! You survived: " + score + " seconds");
        location.reload();
    }
    
    playerControls();

}


function startSpawner(){
    this.time.addEvent({ delay: Phaser.Math.RND.between(200, 700),  loop: true, callback: onEvent, callbackScope: this });
    button.destroy();
    started = true;
    menumusic.stop();
    music = this.sound.add('mainMusic');
    music.setLoop(true);
    music.play();
}


function onEvent(){
    
    var newMeteor = this.physics.add.sprite(this.cameras.main.centerX + Phaser.Math.RND.between(-230, 230) , this.cameras.main.centerY - 250 , 'meteor0');
    newMeteor.play('meteor_fall', true);
    newMeteor.scaleX = 0.05;
    newMeteor.scaleY = 0.05;
    newMeteor.setDepth(7);
    newMeteor.rotation = BetweenPoints(newMeteor, player)+5;
    var angle = BetweenPoints(newMeteor, player);
    SetToAngle(newMeteor, newMeteor.x, newMeteor.y, angle, 180);
    this.physics.moveToObject(newMeteor, player, 240);

    this.physics.add.overlap(red, newMeteor, function(){    removeRed(newMeteor);}, null, this);
    this.physics.add.overlap(green, newMeteor, function(){    removeGreen(newMeteor);}, null, this);
    this.physics.add.overlap(blue, newMeteor, function(){    removeBlue(newMeteor);}, null, this);
    this.physics.add.overlap(yellow, newMeteor, function(){    removeYellow(newMeteor);}, null, this);
    this.physics.add.overlap(platforms, newMeteor, function(){    removeMeteor(newMeteor);}, null, this);
}

function removeMeteor(m){
    m.destroy();
}
function removeRed(m) {
    var index = dinos.indexOf(red);
    if (index > -1) {
        dinos.splice(index, 1);
        player = dinos[dinos.length - 1]
      }
    red.destroy();
    m.destroy();
}
function removeGreen(m) {
    var index = dinos.indexOf(green);
    if (index > -1) {
        dinos.splice(index, 1);
        player = dinos[dinos.length - 1]
      }
    green.destroy();
    m.destroy();
}
function removeBlue(m) {
    var index = dinos.indexOf(blue);
    if (index > -1) {
        dinos.splice(index, 1);
        player = dinos[dinos.length - 1]
      }
      
    blue.destroy();
    m.destroy();
}
function removeYellow(m) {
    var index = dinos.indexOf(yellow);
    if (index > -1) {
        dinos.splice(index, 1);
        player = dinos[dinos.length - 1]
      }
    yellow.destroy();
    m.destroy();
}


function playerControls(){
    if (Phaser.Input.Keyboard.JustDown(cursors.up) & isPlayerJumping === false) {
        dinos.forEach(function(dino) {
            dino.setVelocityY(-250 + Phaser.Math.RND.between(75,50));
        });
        isPlayerJumping = true;
    } else if (player.body.onFloor()) {
        if (isPlayerJumping === true){
            isPlayerJumping = false;
        }
    }
    
     if (cursors.left.isDown)
    {

        dinos.forEach(function(dino) {
             // move left
            dino.flipX= true;// flip the sprite to the left
            if (dino === blue) {
                dino.anims.play('blue_walk', true); // play walk animation
                dino.body.setVelocityX(-1*blueDinoSpeed);
            }
            if (dino === green) {
                dino.anims.play('green_walk', true); // play walk animation
                dino.body.setVelocityX(-1*greenDinoSpeed);
            }
            if (dino === yellow) {
                dino.anims.play('yellow_walk', true); // play walk animation
                dino.body.setVelocityX(-1*yellowDinoSpeed);
            }
            if (dino === red) {
                dino.anims.play('red_walk', true); // play walk animation
                dino.body.setVelocityX(-1*redDinoSpeed);
            }
            
            
        });
        joystick.setTexture('joystick_left');
        
    }
    else if (cursors.right.isDown)
    {

        dinos.forEach(function(dino) {
            
            dino.flipX= false;// flip the sprite to the left
            if (dino === blue) {
                dino.anims.play('blue_walk', true); // play walk animation
                dino.body.setVelocityX(blueDinoSpeed); // move left
            }
            if (dino === green) {
                dino.anims.play('green_walk', true); // play walk animation
                dino.body.setVelocityX(greenDinoSpeed); // move left
            }
            if (dino === yellow) {
                dino.anims.play('yellow_walk', true); // play walk animation
                dino.body.setVelocityX(yellowDinoSpeed); // move left
            }
            if (dino === red) {
                dino.anims.play('red_walk', true); // play walk animation
                dino.body.setVelocityX(redDinoSpeed); // move left
            }
        });        
        joystick.setTexture('joystick_right');
    } else {

        dinos.forEach(function(dino) {
            dino.body.setVelocityX(0);
            if (dino === blue) {
                dino.anims.play('blue_idle', true); // play walk animation
            }
            if (dino === green) {
                dino.anims.play('green_idle', true); // play walk animation
            }
            if (dino === yellow) {
                dino.anims.play('yellow_idle', true); // play walk animation
            }
            if (dino === red) {
                dino.anims.play('red_idle', true); // play walk animation
            }
        });  
        joystick.setTexture('joystick');
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