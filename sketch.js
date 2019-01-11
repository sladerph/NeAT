const screen_w = 1700;
const screen_h = 800;
const brain_h  = 0;

var shooting = false;
var shooting_t = 0;

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
  },
  // plugins: {
  //   scene: [{
  //     plugin: PhaserMatterCollisionPlugin,
  //     key: 'matterCollision',
  //     mapping: 'matterCollision'
  //   }]
  // }
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

  ball = this.matter.add.sprite(screen_w / 2, 100, 'ball');

  player = this.matter.add.sprite(screen_w / 2 - 500, 400, 'idle');
  player.setCircle();
  player.setBounce(0);
  player.setFriction(1);
  // player.setGravityY(300);

  ball.setCircle();
  ball.setFriction(0.05);
  ball.setFrictionAir(0.001);
  ball.setBounce(0.7);
  // ball.setGravityY(500);

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

  this.anims.create({
    key: 'Shoot',
    frames: [{key: 'kick'}],
    frameRate: 20
  });

  player.anims.play('Down', true);

  cursors = this.input.keyboard.createCursorKeys();

  this.matter.world.setBounds(0, 0, screen_w, screen_h);

  this.matter.world.on('collisionstart', function (event, a, b) {
    if ((a == player || b == player) && (a == ball || b == ball)) {
      if (shooting) {
        if (ball.body.position.x > player.body.position.x) {
          ball.body.velocity.multiply(2);
        }
      }
    }
  });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-5);
  } else if (cursors.right.isDown) {
    player.setVelocityX(5);
  }

  if (cursors.up.isDown && player.body.position.y >= 701) {
    player.setVelocityY(-10);
    player.anims.play('Up', true);
  } else if (player.body.velocity.y > 0 && player.body.position.y < 701) {
    player.anims.play('Down', true);
  } else if (player.body.position.y >= 701 && Math.abs(player.body.velocity.x) <= 2) {
    player.anims.play('Idle', true);
  } else if (player.body.velocity.x < -2 && player.body.position.y >= 701) { // Going left.
    player.anims.play('Left', true);
  } else if (player.body.position.y >= 602 && player.body.velocity.x > 2) {
    player.anims.play('Right', true);
  }
  if (cursors.space.isDown && !shooting) {
    player.anims.play('Shoot', true);
    shooting = true;
    shooting_t = 0;
  }

  if (shooting) {
    shooting_t++;
    if (shooting_t > 25) {
      shooting = false;
    }
    player.anims.play('Shoot', true);
  }

  player.setAngle(0);
  player.body.angularVelocity = 0;
  player.body.angularSpeed    = 0;
}










//
