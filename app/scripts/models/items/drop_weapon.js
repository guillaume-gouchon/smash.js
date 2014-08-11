Physics.body('drop-weapon', 'rectangle', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
        gameType: 'explosive',
        width: 38,
        height: 15,
        restitution: 0.0,
        mass: 1,
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
      Item.explode(this, 15, 2, 0.05, 1, 500);
    }
  };
  
});
