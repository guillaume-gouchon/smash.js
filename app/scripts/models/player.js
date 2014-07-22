
/**
* BODY
*/
Physics.body('player', 'rectangle', function (parent) {

  var START_LIFE = 3;
  var INITIAL_MASS = 1.0;

  var isGoingRight = false, isGoingLeft = false, orientation = 1;
  var currentJump = 0, currentBomb = 0;

  var speed = 0.2;
  var nbJumps = 2;
  var jumpSkill = 0.25;
  var nbBombs = 1;
  var chargeAttack = -1;

  return {

   init: function (options) {
      var startPosition = this.getStartPosition();
      var defaults = {
        gameType: 'player',
        restitution: 0.2,
        cof: 0.3,
        height: 30,
        width: 30,
        mass: INITIAL_MASS,
        x: startPosition.x,
        y: startPosition.y
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.life = START_LIFE;

      this.view = new Image();
      this.view.src = "images/character.png";
    },

    moveLeft: function () {
      isGoingLeft = true, isGoingRight = false;
      this.state.vel.x = -speed;
      orientation = -1;
    },

    moveRight: function () {
      isGoingLeft = false, isGoingRight = true;
      this.state.vel.x = speed;
      orientation = 1;
    },

    stopLeft: function () {
      isGoingLeft = false;
      if (!isGoingRight) {
        this.state.vel.x = 0;
        this.state.acc.x = 0;
      }
    },

    stopRight: function () {
      isGoingRight = false;
      if (!isGoingLeft) {
        this.state.vel.x = 0;
        this.state.acc.x = 0;
      }
    },

    chargeAttack: function () {
      if (chargeAttack == -1) {
        chargeAttack = new Date().getTime();
      }
    },

    attack: function () {
      if (currentBomb < nbBombs && chargeAttack > 0) {
        var world = this._world;
        var pos = this.state.pos;
        var scratch = Physics.scratchpad();
        var rnd = scratch.vector();
        rnd.set(orientation, -0.7);

        var power = 0.2 + (new Date().getTime() - chargeAttack) / 1000;

        var bomb = Physics.body('bomb', {
          x: this.state.pos.get(0),
          y: this.state.pos.get(1),
        });
        bomb.state.pos.set(pos.get(0) + rnd.get(0), pos.get(1) + rnd.get(1));
        bomb.state.vel.set(orientation * power * 0.7, - 0.3 * power);
        bomb.state.angular.vel = (Math.random() - 0.5) * 0.06;

        setTimeout(function() {
          bomb.explode();
          currentBomb = currentBomb - 1 < 0 ? 0 : currentBomb - 1;
        }, bomb.duration);

        currentBomb++;
        world.add(bomb);
        scratch.done();
      }
      chargeAttack = -1;
    },

    jump: function () {
      if (currentJump < nbJumps) {
        currentJump++;
        this.state.vel.y = -jumpSkill;
      }      
    },

    resetJump: function () {
      currentJump = 0;
    },

    openBox: function (box) {
      console.log('whooohooo, a box !')
      box.explode();
      // TODO : add item animation
      // add item to player
    },

    getStartPosition: function () {
      return {
        x: (viewport.width + 500 * (2 * Math.random() - 1)) / 2,
        y: Math.random() < 0.5 ? viewport.height / 2 - 50 : viewport.height / 2 + 105
      };
    },

    die: function () {
      this.life--;
      this.mass = INITIAL_MASS;
      currentJump = 0;
      currentBomb = 0;
      var _this = this;
      setTimeout(function () {
        var startPosition = _this.getStartPosition();
        _this.state.pos.set(startPosition.x, startPosition.y);
      }, 1000);
    },
  };

});


/**
* BEHAVIOUR
*/
Physics.behavior('player-behavior', function (parent) {

  return {
    init: function (options) {
      var self = this;
      parent.init.call(this, options);
      self.player = options.player;
    },

    // this is automatically called by the world
    // when this behavior is added to the world
    connect: function (world){
      // we want to subscribe to world events
      world.on('collisions:detected', this.checkPlayerCollision, this);
    },

    // this is automatically called by the world
    // when this behavior is removed from the world
    disconnect: function (world){
      // we want to unsubscribe from world events
      world.off('collisions:detected', this.checkPlayerCollision);
    },

    // check to see if the player has collided
    checkPlayerCollision: function (data){
      var self = this
      ,world = self._world
      ,collisions = data.collisions
      ,col
      ,player = this.player
      ,element
      ;

      for (var i = 0, l = collisions.length; i < l; ++i) {
        col = collisions[i];
        if (col.bodyA === player || col.bodyB === player) {
          element = col.bodyA != player ? col.bodyA : col.bodyB;
          if (element.gameType === 'box') {
            // collision with a box
            player.openBox(element);
          } else if (element.gameType == 'player' || element.gameType == 'decor') {
            // reset jump
            if (col.norm.y > 0) {
              player.resetJump();
            }
          } else if (element.gameType == 'explosion') {
            // take damage
            player.mass *= element.power;
            player.recalc();
          } else if (element.gameType == 'border') {
            player.die();
          }
        }
      }
    },
  };
});
