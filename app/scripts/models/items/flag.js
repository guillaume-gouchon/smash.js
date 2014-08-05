
/**
*  FLAG BODY
*/
Physics.body('flag', 'rectangle', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
        gameType: 'flag',
        height: 40,
        width: 40,
        restitution: 0.2,
        cof: 1.0
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.initialX = options.x;
      this.initialY = options.y;
      this.goalX = options.goalX;
      this.goalY = options.goalY;

      this.view = renderer.createDisplay('sprite', {
        texture: 'images/flag.png',
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
      this.view.tint = options.color;
      this.view.alpha = 0.9;
    },

    updateBearer: function (player) {
      if (player.team == this.team) {
        if (Math.abs(this.state.pos.x - this.initialX) > 70 || Math.abs(this.state.pos.y - this.initialY) > 70) {
          this.reset();
        }
      } else {
        this.player = player;
      }
    },

    reset: function () {
      this.state.pos.x = this.initialX;
      this.state.pos.y = this.initialY;
      this.state.acc.set(0, 0);
      this.state.vel.set(0, 0);
      this.state.angular.pos = 0;
      this.state.angular.vel = 0;
      this.state.angular.acc = 0;
      this.player = null;
    }
  }; 
  
});


/**
* BEHAVIOUR
*/
Physics.behavior('flag-behavior', function (parent) {

  return {

    init: function (options) {
      parent.init.call(this, options);
      this.flag = options.flag;
    },

    behave: function (data) {
      if (this.flag.player) {
        this.flag.state.pos.y = this.flag.player.state.pos.y - 45;
        this.flag.state.pos.x =  this.flag.player.state.pos.x - 45;
        this.flag.state.angular.pos = 0;
        if (Math.abs(this.flag.state.pos.x - this.flag.goalX) < 50 && Math.abs(this.flag.state.pos.y - this.flag.initialY) < 50) {
          this.flag._world.emit('points', this.flag.team);
          this.flag.reset();
        }
      }
    }
  };
});
