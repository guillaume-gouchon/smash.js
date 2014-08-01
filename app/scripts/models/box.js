Physics.body('box', 'rectangle', function (parent) {

  return {

    init: function (options) {
      var defaults = {
        gameType: 'box',
        height: 30,
        width: 30,
        restitution: 0,
        mass: 10,
        cof: 1.0
      };

      parent.init.call(this, $.extend({}, defaults, options));

      this.view = renderer.createDisplay('sprite', {
        texture: 'images/box.png',
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });

      this.isTrap = Math.random() < 0.15;
      this.power = 40;
      this.stun = 300;
    },

    open: function () {
      var world = this._world;

      var scratch = Physics.scratchpad();
      var rnd = scratch.vector()
      ,pos = this.state.pos
      ,n = 4
      ,r = this.width * 0.6
      ,mass = 0.00001
      ,d
      ,width
      ,height
      ,debris = [];

      // create debris
      while (n--){
        width = r * Math.random();
        height = r * Math.random();
        rnd.set(Math.random() - 0.5, Math.random() - 0.5).mult(r);
        d = Physics.body('convex-polygon', {
          x: pos.get(0) + rnd.get(0),
          y: pos.get(1) + rnd.get(1),
          vx: this.state.vel.get(0) + (Math.random() - 0.5),
          vy: this.state.vel.get(1) + (Math.random() - 0.5),
          angularVelocity: (Math.random()-0.5) * 0.06,
          mass: mass,
          restitution: 0,
          styles: {
            lineWidth: 2,
            strokeStyle: 0x8b5c22,
            fillStyle: 0xcd9945
          },
          vertices: [
            {x: 0, y: 0},
            {x: width, y: 0},
            {x: width, y: height},
            {x: 0, y: height}
          ],
        });
        debris.push(d);
      }

      setTimeout(function() {
        for (var i = 0, l = debris.length; i < l; ++i){
          world.emit('removeBody', debris[i]);
        }
        debris = undefined;
      }, 1000);

      world.add(debris);
      world.emit('removeBody', this);
      scratch.done();
    },

    explode: function () {
      var world = this._world;
      if (!world) {
        return;
      }
      var pos = this.state.pos
      ,n = 20
      ,r = 5
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
            gameType: 'damage',
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
            power: this.power
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
