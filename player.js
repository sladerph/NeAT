function Player(x, y, id, parent) {
  this.id     = id;
  this.parent = parent;
  this.shooting = false;
  this.shooting_t = 0;

  // this.body   = parent.matter.add.sprite(x, y, 'idle', null, {shape: shapes.shooting});
  this.body   = parent.matter.add.sprite(x, y, 'idle');
  this.body.setCircle();
  this.body.setBounce(0);
  this.body.setFriction(1);
  this.body.body.label = "Player" + id.toString();

  this.foot = parent.matter.add.sprite(x, y, 'foot');
  this.foot

  this.shoot = function() {
  }
}

function resetBall() {
  ball.setCircle();
  ball.setPosition(screen_w / 2, 100);
  ball.setVelocity(0, 0);
}
