Physics.body('contact-weapon', 'rectangle', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
      	treatment: 'kinematic',
        gameType: 'damage',
        width: 30,
        height: 30,
        restitution: 1.0,
        mass: 1,
        cof: 1.0
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.view = renderer.createDisplay('sprite', {
        texture: 'images/' + options.image,
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
    }
  }
});
