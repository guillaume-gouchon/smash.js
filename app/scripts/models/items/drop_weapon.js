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
        texture: 'images/' + options.image,
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
    },

    explode: function () {
      var world = this._world;
      if (!world) {
        return;
      }
      var pos = this.state.pos
      ,n = 15
      ,r = 2
      ,mass = 0.05
      ,d
      ,width
      ,height
      ,debris = [];

      // create debris
      while ( n-- ){
        width = r * Math.random();
        height = r * Math.random();
        d = Physics.body('convex-polygon', {
            x: pos.get(0),
            y: pos.get(1),
            vx: Math.random() - 0.5,
            vy: Math.random() - 0.5,
            vertices: [
              {x: 0, y: 0},
              {x: width, y: 0},
              {x: width, y: height},
              {x: 0, y: height}
            ],
            mass: mass,
            restitution: 0.9,
            styles: {
              lineWidth: 3,
              strokeStyle: 0xFF8E0D,
              fillStyle: 0xff0000
            },
            power: this.power,
            stun: this.stun
        });
        debris.push(d);
      }

      setTimeout(function() {
        if (world && debris) {
          for (var i = 0, l = debris.length; i < l; ++i) {
            world.emit('removeBody', debris[i]);
          }
          debris = undefined;
        }
      }, 500);

      world.add(debris);
      world.emit('removeBody', this);
    }
  };
  
});