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
	    el: viewportElement[0].id,
	    width: viewportElement.width(),
	    height: viewportElement.height()
		};

		// setup renderer
  	var renderer = Physics.renderer('canvas', viewport);
		world.add(renderer);

		// subscribe to ticker to advance the simulation
		Physics.util.ticker.on(function(time, dt){
	    world.step(time);
		});
		Physics.util.ticker.start();

		// game loop
		world.on('step', function (){
	    world.render();
		});

		var square = Physics.body('rectangle', {
	    x: 250,
	    y: 250,
	    vx: 0.01,
	    width: 50,
	    height: 50
		});
		gameElements.push(square);
		world.add(square);


		// add gravity
		var gravity = Physics.behavior('constant-acceleration', {
    	acc: { x: 0, y: 0.0004 }
    }).applyTo(gameElements);
    world.add(gravity);

		// add game bounds
		var bounds = Physics.aabb(0, 0, viewport.width, viewport.height);
		world.add( Physics.behavior('edge-collision-detection', {
	    aabb: bounds,
	    restitution: 0.
1		}) );
		// ensure objects bounce when edge collision is detected
		world.add(Physics.behavior('body-impulse-response'));

		// add collisions
		world.add(Physics.behavior('body-collision-detection'));
		world.add(Physics.behavior('sweep-prune'));


	});

});
