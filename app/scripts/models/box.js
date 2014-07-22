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

      this.view = new Image();
      this.view.src = "images/box.png";
    },

    explode: function () {
      var world = this._world;

      var scratch = Physics.scratchpad();
      var rnd = scratch.vector();
      var pos = this.state.pos;
      var n = 4;
      var r = this.width * 0.6;
      var mass = 0.00001;
      var d;
      var debris = [];

      // create debris
      while (n--){
        rnd.set(Math.random() - 0.5, Math.random() - 0.5).mult(r);
        d = Physics.body('rectangle', {
          x: pos.get(0) + rnd.get(0),
          y: pos.get(1) + rnd.get(1),
          vx: this.state.vel.get(0) + (Math.random() - 0.5),
          vy: this.state.vel.get(1) + (Math.random() - 0.5),
          angularVelocity: (Math.random()-0.5) * 0.06,
          height: r * Math.random(),
          width: r * Math.random(),
          mass: mass,
          restitution: 0,
          styles: {
            lineWidth: 4,
            strokeStyle: '#8b5c22',
            fillStyle: '#cd9945'
          }
        });
        debris.push(d);
      }

      setTimeout(function() {
        for (var i = 0, l = debris.length; i < l; ++i){
          world.removeBody(debris[i]);
        }
        debris = undefined;
      }, 1000);

      world.add(debris);
      world.removeBody(this);
      scratch.done();
    }
  };
  
});