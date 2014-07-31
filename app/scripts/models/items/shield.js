Physics.body('shield', 'convex-polygon', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
        gameType: 'shield',
        treatment: 'kinematic',
        restitution: 1.0,
        cof: 1.0,
        styles: {
          lineWidth: 2,
          fillStyle: 0x35ccbb,
          strokeStyle: 0x3680DF
        },
        vertices: [
          {x: 0, y: 0},
          {x: 4, y: 6},
          {x: 4, y: 34},
          {x: 0, y: 40}
        ],
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.power = options.power;
    },

    takeDamage: function (damage) {
      this.power -= damage;
      if (this.power <= 0) {
        this.destroy();
      }
    },

    destroy: function () {
      this._world.emit('removeBody', this);
    }
  }
  
});

/**
* BEHAVIOUR
*/
Physics.behavior('shield-behavior', function (parent) {

  return {

    init: function (options) {
      parent.init.call(this, options);

      this.player = options.player;
      this.shield = options.shield;
    },

    behave: function (data) {
      this.shield.state.pos.y = this.player.state.pos.y;
      this.shield.state.pos.x =  this.player.state.pos.x + this.player.orientation * 30;
      this.shield.state.angular.pos = this.player.orientation == 1 ? -0.15 : Math.PI + 0.15;
      this.shield.recalc();
    }
  };
});
