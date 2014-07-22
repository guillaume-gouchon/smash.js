
/**
* BODY
*/
Physics.body('player', 'circle', function (parent) {


  var isJumping = false, isPunching = false;

  return {
   init: function (options) {
      options.gameType = 'player';
      options.radius = 15;
      options.mass = 10.0;
      parent.init.call(this, options);
      console.log(this)
    },

    moveLeft: function () {
      if (!isJumping) {
        isJumping = true;
        this.state.vel.x = -0.1;
        setTimeout(function () {
          isJumping =  false;
        }, 400);
      }
    },

    moveRight: function () {
      if (!isJumping) {
        isJumping = true;
        this.state.vel.x = 0.1;
        setTimeout(function () {
          isJumping =  false;
        }, 400);
      }
    },

    punch: function () {
      if (!isPunching) {
        isPunching = true;
        this.geometry.radius = 30;
        this.recalc();
        this.view = undefined;
        var _this = this;
        setTimeout(function () {
          isPunching =  false;
          _this.geometry.radius = 15;
          _this.recalc();
          _this.view = undefined;
        }, 300);
      }
    },

    openBox: function (box) {
      console.log('whooohooo, a box !')
      box.explode();
      // TODO : add item animation
      // add item to player
    }
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
      // the player will be passed in via the config options
      // so we need to store the player
      var player = self.player = options.player;

      // events
      document.addEventListener('keydown', function (e) {
        switch (e.keyCode){
          case 38: // up
          self.movePlayer();
          break;
          case 40: // down
          break;
          case 37: // left
          player.turn( -1 );
          break;
          case 39: // right
          player.turn( 1 );
          break;
          case 90: // z
          player.shoot();
          break;
        }
        return false;
      });
      document.addEventListener('keyup', function (e) {
        switch (e.keyCode){
          case 38: // up
          self.movePlayer( false );
          break;
          case 40: // down
          break;
          case 37: // left
          player.turn( 0 );
          break;
          case 39: // right
          player.turn( 0 );
          break;
          case 32: // space
          break;
        }
        return false;
      });
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
      ;

      for (var i = 0, l = collisions.length; i < l; ++i) {
        col = collisions[ i ];
        if ((col.bodyA.gameType === 'box' || col.bodyB.gameType === 'box') && (col.bodyA === player || col.bodyB === player)){
          player.openBox(col.bodyA.gameType === 'box' ? col.bodyA : col.bodyB);
        }
      }
    },
  };
});
