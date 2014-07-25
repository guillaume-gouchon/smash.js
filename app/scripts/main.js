$(function() {

	var players = {};

	Physics(function (world) {

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
			popBox(world);
			input.update(players);

	    world.render();
		});

		// add borders
  	var viewportBounds = Physics.aabb(0, -100, viewport.width, viewport.height + 200);
	  world.add(Physics.behavior('border-behaviour', {
	      aabb: viewportBounds
	  }));

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

		addMovingBridge(world, viewport.width / 2, viewport.height / 2 -125, 200, 50);
		addBridge(world, viewport.width / 2 - 200, viewport.height / 2, 200, 50);
		addBridge(world, viewport.width / 2 + 200, viewport.height / 2, 200, 50);
		addPlatform(world, viewport.width / 2, viewport.height / 2 + 195, 700, 140);

		// resize events
	  window.addEventListener('resize', function () {
	      renderer.el.width = window.innerWidth;
	      renderer.el.height = window.innerHeight;
	  }, true);

		addPlayer(world, 'keyboard1');
		addPlayer(world, 'keyboard2');
		// addPlayer(world, viewport.width / 3, 0, 'sdfsdf');
		// addPlayer(world, viewport.width / 3, 0, 'sdfsdf');
	});

	function addBridge(world, x, y, w, h) {
		var element = Physics.body('bridge', {
	    x: x,
	    y: y,
	    width: w,
	    height: h
	  });
		world.add(element);
	}

	function addPlatform(world, x, y, w, h) {
		var element = Physics.body('platform', {
	    x: x,
	    y: y,
	    width: w,
	    height: h
	  });
		world.add(element);
	}

	function addMovingBridge(world, x, y, w, h) {
		var element = Physics.body('movingBridge', {
	    x: x,
	    y: y,
	    width: w,
	    height: h,
	    min: -100,
	    max: 100,
	    orientation: 0,
	    speed: 0.07
	  });
		var movingPlatformBehaviour = Physics.behavior('platform-moving', { platform: element });
    world.add([element, movingPlatformBehaviour]);
	}

	function addPlayer(world, id) {
		var player = Physics.body('player', {
	    id: id,
	    team: Object.keys(players).length % 4
	  });
		players[player.id] = player;
	  var playerBehavior = Physics.behavior('player-behavior', { player: player });
		world.add([player, playerBehavior]);
		GUI.addPlayer(player);
	}

	function popBox(world) {
		if (Math.random() < 0.003) {
			var element = Physics.body('box', {
		    x: (viewport.width + 600 * (2 * Math.random() - 1)) / 2,
		    y: 0
		  });
			world.add(element);
		}
	}

	function startGame() {
		GUI.showRoundStart(function () {
			console.log('start')
		});
	}

	function replay() {
		$('#victory').addClass('hide');
		startGame();
	}

	var input = new Input({
    padNotSupported: null,
    connected: function (gameId) {
    },
    playerConnected: null,
    playerDisconnected: null,
    commandsReceived: function (commands) {
    	players[commands.pId].commands = commands.toJSON();
    }
	});

});
