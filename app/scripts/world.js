function initWorld (world, game, mapType) {

	// setup viewport
	var viewport = {
    el: 'viewport',
    width: window.innerWidth,
    height: window.innerHeight
	};

	// setup renderer
	var renderer = Physics.renderer('canvas', viewport);
	world.add(renderer);

	// resize window events
  window.addEventListener('resize', function () {
      renderer.el.width = window.innerWidth;
      renderer.el.height = window.innerHeight;
  }, true);

	// add borders
	var viewportBounds = Physics.aabb(0, -100, viewport.width, viewport.height + 200);
  world.add(Physics.behavior('border-behaviour', {
      aabb: viewportBounds
  }));

  // create map
  world.add(new Map(mapType, viewport));

	// ensure objects bounce when edge collision is detected
	world.add(Physics.behavior('body-impulse-response'));

	// add collisions
	world.add(Physics.behavior('body-collision-detection'));
	world.add(Physics.behavior('sweep-prune'));

	// add gravity
	var gravity = Physics.behavior('constant-acceleration', {
  	acc: { x: 0, y: 0.0004 }
  });
  world.add(gravity);

  // subscribe to events coming from logic side
	world.on('death', game.checkVictory);
	world.on('updateGUI', game.updateGUI);

	// subscribe to ticker to advance the simulation
	Physics.util.ticker.on(function (time, dt) {
    world.step(time);
	}).start();

	// game loop
	world.on('step', function () {
		game.update();
    world.render();
	});
	
}
