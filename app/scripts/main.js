$(function() {

	var phonepad = Phonepad.getInstance();
	phonepad.on('connected', function (gameId) { });
	phonepad.on('padNotSupported', function (gamepadType) { });
	phonepad.on('playerConnected', function (playerId, gamepadType) { });
	phonepad.on('playerDisconnected', function (playerId) { });
	phonepad.on('commandsReceived', function (commands) { });
	phonepad.start();


	var gameElements = [];

	Physics(function(world) {

		// setup viewport
		var viewportElement = $('#viewport');
		var viewport = {
	    el: 'viewport',
	    width: window.innerWidth,
	    height: window.innerHeight
		};

		// setup renderer
  	var renderer = Physics.renderer('canvas', viewport);
		world.add(renderer);

		// subscribe to ticker to advance the simulation
		Physics.util.ticker.on(function (time, dt) {
	    world.step(time);
		});
		Physics.util.ticker.start();

		// game loop
		world.on('step', function () {
	    world.render();
		});

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

		addMovingPlatform(world, viewport.width / 2, viewport.height / 2 - 120, 200, 20);
		addBridge(world, viewport.width / 2 - 200, viewport.height / 2, 200, 30);
		addBridge(world, viewport.width / 2 + 200, viewport.height / 2, 200, 30);
		addPlatform(world, viewport.width / 2, viewport.height / 2 + 170, 700, 100);

		// Physics.integrator('my-integrator', function( parent ){

		//     return {

		//         integrateVelocities: function( bodies, dt ){
		//         	console.log(bodies)
		//             // update the velocities of all bodies according to timestep dt
		//             // store previous velocities in .state.old.vel
		//             // and .state.old.angular.vel
		//         },

		//         integratePositions: function( bodies, dt ){
		//         	console.log(bodies)

		//             // update the positions of all bodies according to timestep dt
		//             // store the previous positions in .state.old.pos
		//             // and .state.old.angular.pos
		//             // also set the accelerations to zero
		//         }
		//     };
		// });
		// var i = Physics.integrator('my-integrator');
		// i.setWorld(world);

		


		// resize events
	  window.addEventListener('resize', function () {
	      renderer.el.width = window.innerWidth;
	      renderer.el.height = window.innerHeight;
	  }, true);


		addPlayer(world, viewport.width / 3, 0, 'sdfsdf');
		addPlayer(world, viewport.width / 3, 0, 'sdfsdf');
		addPlayer(world, viewport.width / 3, 0, 'sdfsdf');
		addPlayer(world, viewport.width / 3, 0, 'sdfsdf');
	});

	function addBridge(world, x, y, w, h) {
		var decor = Physics.body('bridge', {
	    x: x,
	    y: y,
	    width: w,
	    height: h
	  });
		world.add(decor);
	}

	function addPlatform(world, x, y, w, h) {
		var decor = Physics.body('platform', {
	    x: x,
	    y: y,
	    width: w,
	    height: h
	  });
		world.add(decor);
	}

	function addMovingPlatform(world, x, y, w, h) {
		var decor = Physics.body('movingPlatform', {
	    x: x,
	    y: y,
	    width: w,
	    height: h
	  });
		world.add(decor);
	}

	function addPlayer(world, x, y, id) {
		var player = Physics.body('player', {
	    // default config options
	    x: x,
	    y: y,
	    id: id
	  });
		gameElements.push(player);
		world.add(player);
	}

	$(window).keydown(function (e) {
		switch (e.keyCode) {
			case 65: 
				gameElements[0].moveLeft();
				break;
			case 68: 
				gameElements[0].moveRight();
				break;
			case 83:
				gameElements[0].punch(); 
				break;
		}
	});

});
