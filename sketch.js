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
    create: create,
    update: update,
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.image('idle', 'Sprites/idle.png');
  this.load.image('move_right', 'Sprites/right.png');
  this.load.image('move_left', 'Sprites/left.png');
  this.load.image('jump_up', 'Sprites/jumping.png');
  this.load.image('jump_down', 'Sprites/falling.png');
  this.load.image('kick', 'Sprites/shooting.png');
  // this.load.image('dude', 'Sprites/sprite_sheet.png');
  this.load.image('hills', 'Sprites/hills.jpg');
}

function create() {
  this.add.image(0, 0, 'hills').setOrigin(0, 0);

  player = this.physics.add.sprite(screen_w / 2, 200, 'idle');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.setGravityY(300);

  this.anims.create({
    key: 'Right',
    frames: [{ key: 'idle'}, {key: 'move_right'}, {key: 'idle'}],
    frameRate: 5,
    repeat: 0
  });

  this.anims.create({
    key: 'Left',
    frames: [{key: 'idle'}, {key: 'move_left'}, {key: 'idle'}],
    frameRate: 5,
    repeat: 0
  });

  this.anims.create({
    key: 'Up',
    frames: [{key: 'jump_up'}],
    frameRate: 20
  });

  this.anims.create({
    key: 'Down',
    frames: [{key: 'jump_down'}],
    frameRate: 20
  });

  player.anims.play('Down', true);

  cursors = this.input.keyboard.createCursorKeys();

}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('Left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('Right', true);
  }

  if (cursors.up.isDown && player.body.position.y >= 602) {
    player.setVelocityY(-330);
  }
}










//
