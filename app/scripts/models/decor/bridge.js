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
        texture: Game.IMAGES_PATH + 'bridge.png',
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
    },
  };
  
});
