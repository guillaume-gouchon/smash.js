Physics.body('bullet', 'circle', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
        gameType: 'explosive',
        radius: 2,
        restitution: 0,
        mass: 0.3,
        cof: 1.0
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.view = renderer.createDisplay('sprite', {
        texture: Game.IMAGES_PATH + options.image,
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
    },

    explode: function () {
      if (this.gameType == 'bolter') {
        Item.explode(this, 15, 5, 0.05, 1.5, 500);
      } else {
        var world = this._world;
        if (!world) {
          return;
        }
        world.emit('removeBody', this);  
      }
    }
  };
  
});
