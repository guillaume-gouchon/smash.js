Physics.body('bomb', 'circle', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
        gameType: 'bomb',
        treatment: 'dynamic',
        radius: 7,
        restitution: 0.1,
        mass: 0.05,
        cof: 1.0,
        styles: {
          lineWidth: 4,
          strokeStyle: '#000',
          fillStyle: '#d22'
        }
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.duration = 800;
      this.power = 1.2;

      // this.view = new Image();
      // this.view.src = "images/bomb.png";
    },

    explode: function () {
      var world = this._world;
      if (!world) {
        return;
      }
      var pos = this.state.pos;
      var n = 15;
      var r = 6;
      var mass = 0.05;
      var d;
      var debris = [];

      // create debris
      while ( n-- ){
        d = Physics.body('rectangle', {
            gameType: 'explosion',
            x: pos.get(0),
            y: pos.get(1),
            vx: Math.random() - 0.5,
            vy: Math.random() - 0.5,
            height: r * Math.random(),
            width: r * Math.random(),
            mass: mass,
            restitution: 0.9,
            styles: {
              lineWidth: 4,
              strokeStyle: '#FF8E0D',
              fillStyle: '#000'
            },
            power: this.power
        });
        debris.push(d);
      }

      setTimeout(function() {
        if (world && debris) {
          for (var i = 0, l = debris.length; i < l; ++i) {
            world.removeBody(debris[i]);
          }
          debris = undefined;
        }
      }, 500);

      world.add(debris);
      world.removeBody(this);
    }
  };
  
});
