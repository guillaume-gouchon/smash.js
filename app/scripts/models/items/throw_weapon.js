Physics.body('throw-weapon', 'circle', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
        gameType: 'explosive',
        radius: 10,
        restitution: 0.5,
        mass: 0.1,
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
      if (this.gameType == 'bomb') {
        Item.explode(this, 25, 6, 0.05, 1.5, 500);
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
