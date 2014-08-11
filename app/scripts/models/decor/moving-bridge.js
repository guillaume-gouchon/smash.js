Physics.body('moving-bridge', 'bridge', function (parent) {

  var iX, iY;// initial positions

  return {

    init: function (options) {
      options.treatment = 'kinematic';
      iX = options.x;
      iY = options.y;

      parent.init.call(this, options);

      // initiate movement
      if (this.orientation == 0) {
        this.state.vel.x = this.speed;
      } else if (this.orientation == 1) {
        this.state.vel.y = this.speed;
      }     
    },

    move: function () {
      if (this.orientation == 0) {// horizontal movement
        if (this.state.pos.x > this.max + iX) {
          this.state.vel.x = -this.speed;
        } else if (this.state.pos.x < this.min + iX) {
          this.state.vel.x = this.speed;
        }
      } else if (this.orientation == 1) {// vertical movement
        if (this.state.pos.y > this.max + iY) {
          this.state.vel.y = -this.speed;
        } else if (this.state.pos.y < this.min + iY) {
          this.state.vel.y = this.speed;
        }
      }
    }
  };
  
});

Physics.behavior('moving-bridge', function (parent) {

  return {

    init: function (options) {
      parent.init.call(this, options);
      this.bridge = options.bridge;
    },

    behave: function(data){
      this.bridge.move();
    },
  };
});
