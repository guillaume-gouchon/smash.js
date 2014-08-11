Physics.body('base-platform', 'decor', function (parent) {

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
        texture: Game.IMAGES_PATH + 'base-platform.png',
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
    },
  };
  
});
