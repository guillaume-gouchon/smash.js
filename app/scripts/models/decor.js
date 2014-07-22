
/**
*  PARENT DECOR
*/
Physics.body('decor', 'convex-polygon', function (parent) {

  return {
    init: function (options) {
      options.treatment = options.treatment || 'static';
      options.styles = {
        restitution: 0.2,
       	lineWidth: 10,
      	strokeStyle: 'rgba(30, 170, 30, 0.8)',
      	fillStyle: 'rgba(90, 61, 8, 0.8)'
      };

      parent.init.call(this, options);
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
    },
  };
  
});


/**
* MOVING PLATFORM
*/
Physics.body('movingPlatform', 'platform', function (parent) {

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
