Physics.body('shield', 'convex-polygon', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
        gameType: 'shield',
        treatment: 'kinematic',
        restitution: 1.0,
        cof: 1.0,
        vertices: [
          {x: 0, y: 0},
          {x: 4, y: 6},
          {x: 4, y: 34},
          {x: 0, y: 40}
        ],
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.view = renderer.createDisplay('sprite', {
        texture: 'images/shield.png',
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
      this.view.alpha = 0.9;
    },

    takeDamage: function (damage) {
      this.power -= damage;
      if (this.power <= 0) {
        this.destroy();
      }
    },

    destroy: function () {
      if (this._world) {
        this._world.emit('removeBody', this);
      }
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
      this.shield.view.scale.x = this.player.orientation == 1 ? 1 : -1;
    }
  };
});
