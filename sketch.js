const screen_w = 1700;
const screen_h = 800;
const brain_h  = 0;

var glob;

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
  // this.load.image('kick', 'Sprites/shooting.png');
  this.load.image('kick', 'Sprites/shooting-no-foot.png');
  this.load.image('hills', 'Sprites/hills.jpg');
  this.load.image('ball', 'Sprites/ball.png');
  this.load.image('foot', 'Sprites/foot.png')
  this.load.json('shapes', 'Sprites/shapes.json');
}

function create() {
  shapes = this.cache.json.get('shapes');
glob = this;
  this.add.image(0, 0, 'hills').setOrigin(0, 0);

  ball = this.matter.add.sprite(screen_w / 2, 100, 'ball');

  // player = this.matter.add.sprite(screen_w / 2 - 500, 400, 'idle');
  // player.setCircle();
  // player.setBounce(0);
  // player.setFriction(1);
  // player.setGravityY(300);
  player = new Player(screen_w / 2 - 500, 400, 1, this);
  // p = new Player(screen_w / 2 + 500, 400, 2, this);

  ball.setCircle();
  ball.setFriction(0.05);
  ball.setFrictionAir(0.001);
  ball.setBounce(0.7);
  ball.body.label = "Ball";
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

  player.body.anims.play('Down', true);

  cursors = this.input.keyboard.createCursorKeys();

  this.matter.world.setBounds(0, 0, screen_w, screen_h);

  this.matter.world.on('collisionstart', function (event) {
    // console.log(event.pairs[0]);
    if (event.pairs[0].bodyA.label == "Player1") {
      if (event.pairs[0].bodyB.label == "Ball") {
        // Collision between player 1 and the ball.
        // console.log(event.pairs[0]);
        if (player.shooting) {
          console.log(event.pairs[0]);
          if (player.body.body.position.x < ball.body.position.x - ball.width / 2) { // The ball is on the right of the player.
            console.log("SHOOT");

          }
        }
      }
    }
  });
}

function update() {
  player.body.setVelocityX(0);

  if (cursors.left.isDown) {
    player.body.setVelocityX(-5);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(5);
  }

  if (cursors.up.isDown && player.body.body.position.y >= 701) {
    player.body.setVelocityY(-10);
    player.body.anims.play('Up', true);
  } else if (player.body.body.velocity.y > 0 && player.body.body.position.y < 701) {
    player.body.anims.play('Down', true);
  } else if (player.body.body.position.y >= 701 && Math.abs(player.body.body.velocity.x) <= 2) {
    player.body.anims.play('Idle', true);
  } else if (player.body.body.velocity.x < -2 && player.body.body.position.y >= 701) { // Going left.
    player.body.anims.play('Left', true);
  } else if (player.body.body.position.y >= 602 && player.body.body.velocity.x > 2) {
    player.body.anims.play('Right', true);
  }
  if (cursors.space.isDown && !player.shooting) {
    // player.body.anims.play('Shoot', true);
    // player.shooting = true;
    // player.shooting_t = 0;
  }

  if (player.shooting) {
    player.shooting_t++;
    if (player.shooting_t > 25) {
      player.shooting = false;
    }
    player.body.anims.play('Shoot', true);
  }

  player.body.setAngle(0);
  player.body.body.angularVelocity = 0;
  player.body.body.angularSpeed    = 0;
}










//
