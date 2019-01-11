const screen_w = 1700;
const screen_h = 800;
const brain_h  = 0;

var config = {
  type: Phaser.AUTO,
  width: screen_w,
  height: screen_h + brain_h,
  physics: {
    default: 'matter',
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
  this.load.image('hills', 'Sprites/hills.jpg');
  this.load.image('ball', 'Sprites/ball.png');
}

function create() {
  this.add.image(0, 0, 'hills').setOrigin(0, 0);

  ball = this.physics.add.sprite(screen_w / 2, 100, 'ball').setScale(0.2);

  player = this.physics.add.sprite(screen_w / 2, 200, 'idle');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.setGravityY(300);

  ball.setBounce(0.4);
  ball.setCollideWorldBounds(true);
  ball.setGravityY(500);

  this.anims.create({
    key: 'Right',
    frames: [{key: 'move_right'}, {key: 'idle'}],
    frameRate: 5,
    repeat: -1
  });

  this.anims.create({
    key: 'Left',
    frames: [{key: 'move_left'}, {key: 'idle'}],
    frameRate: 5,
    repeat: -1
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

  this.anims.create({
    key: 'Idle',
    frames: [{key: 'idle'}],
    frameRate: 20
  });

  player.anims.play('Down', true);

  this.physics.add.collider(ball, player);

  cursors = this.input.keyboard.createCursorKeys();

}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  }

  if (cursors.up.isDown && player.body.position.y >= 602) {
    player.setVelocityY(-330);
    player.anims.play('Up', true);
  } else if (player.body.velocity.y > 0 && player.body.position.y < 602) {
    player.anims.play('Down', true);
  } else if (player.body.position.y >= 602 && Math.abs(player.body.velocity.x) <= 2) {
    player.anims.play('Idle', true);
  } else if (player.body.velocity.x < -2 && player.body.position.y >= 602) { // Going left.
    player.anims.play('Left', true);
  } else if (player.body.position.y >= 602 && player.body.velocity.x > 2) {
    player.anims.play('Right', true);
  }
}










//
