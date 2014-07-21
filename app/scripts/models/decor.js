Physics.body('decor', 'convex-polygon', function (parent) {

  return {
    init: function (options) {
      options.treatment = 'static';
      options.styles = {
        restitution: 0.2,
       	lineWidth: 15,
      	strokeStyle: 'rgba(30, 189, 30, 0.6)',
      	fillStyle: 'rgba(92, 61, 8, 0.7)'
      };

      parent.init.call(this, options);
    },
  };
  
});

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

Physics.body('movingPlatform', 'platform', function (parent) {

  return {
    init: function (options) {
      options.treatment = 'kinematic';
      parent.init.call(this, options);
    },
  };
  
});