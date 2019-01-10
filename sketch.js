const screen_w = 1700;
const screen_h = 800;
const brain_h  = 0;

var config = {
  type: Phaser.AUTO,
  width: screen_w,
  height: screen_h + brain_h,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 10},
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

var game = new Phaser.Game(config);

function preload() {
  // this.load.image('idle', 'Sprites/idle.png');
  // this.load.image('move_right', 'Sprites/right.png');
  // this.load.image('move_left', 'Sprites/left.png');
  // this.load.image('jump_up', 'Sprites/jumping.png');
  // this.load.image('jump_down', 'Sprites/falling.png');
  // this.load.image('kick', 'Sprites/shooting.png');
  this.load.image('dude', 'Sprites/sprite_sheet.png');
  this.load.image('hills', 'Sprites/hills.jpg');
}

function create() {
  this.add.image(0, 0, 'hills').setOrigin(0, 0);

  var player = this.physics.add.sprite(screen_w / 2, 200, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.setGravityY(300);

  this.anims.create({
    key: 'Right',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 10,
    // repeat: -1
  });
  player.anims.play('Right', true);
}












//
