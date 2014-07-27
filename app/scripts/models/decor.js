
/**
*  PARENT DECOR
*/
Physics.body('decor', 'convex-polygon', function (parent) {

  return {
    
    init: function (options) {
      var defaults = {
        gameType: 'decor',
        treatment: options.treatment || 'static'
      };

      parent.init.call(this, $.extend({}, defaults, options));
    },
  };
  
});


/**
* STATIC BRIDGE
*/
Physics.body('bridge', 'decor', function (parent) {

  return {

    init: function (options) {
      options.vertices = [
        {x: 0, y: 0},
        {x: options.width, y: 0},
        {x: options.width - options.height, y: options.height},
        {x: options.height, y: options.height}
    	];

      parent.init.call(this, options);

      this.view = renderer.createDisplay('sprite', {
        texture: 'images/platform.png',
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
    },
  };
  
});


/**
* BASE PLATFORM
*/
Physics.body('platform', 'decor', function (parent) {

  return {

    init: function (options) {
      options.vertices = [
        {x: 0, y: 0},
        {x: options.width, y: 0},
        {x: options.width - 40, y: options.height},
        {x: 40, y: options.height}
    	];

      parent.init.call(this, options);

      this.view = renderer.createDisplay('sprite', {
        texture: 'images/base.png',
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
    },
  };
  
});


/**
* MOVING BRIDGE
*/
Physics.body('movingBridge', 'bridge', function (parent) {

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


/**
* BEHAVIOUR
*/
Physics.behavior('platform-moving', function (parent) {

  return {

    init: function (options) {
      parent.init.call(this, options);
      this.platform = options.platform;
    },

    behave: function(data){
      this.platform.move();
    },
  };
});
