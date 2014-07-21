Physics.body('player', 'circle', function (parent) {


  var isJumping = false, isPunching = false;

  return {
   init: function (options) {
      options.radius = 15;
      options.mass = 10.0;
      parent.init.call(this, options);
    },

    moveLeft: function () {
      if (!isJumping) {
        isJumping = true;
        this.state.vel.x = -0.1;
        setTimeout(function () {
          isJumping =  false;
        }, 400);
      }
    },

    moveRight: function () {
      if (!isJumping) {
        isJumping = true;
        this.state.vel.x = 0.1;
        setTimeout(function () {
          isJumping =  false;
        }, 400);
      }
    },

    punch: function () {
      if (!isPunching) {
        isPunching = true;
        this.geometry.radius = 30;
        this.recalc();
        this.view = undefined;
        var _this = this;
        setTimeout(function () {
          isPunching =  false;
          _this.geometry.radius = 15;
          _this.recalc();
          _this.view = undefined;
        }, 300);
      }
    }
  };

});