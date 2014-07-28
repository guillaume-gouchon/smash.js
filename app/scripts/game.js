function Game (world) {
	
	var world = world;
 	var players = {};
	var gui = new GUI();

	var started = false;

	var input = new Input({
    padNotSupported: function (padType) {
    	if (padType == Phonepad.PAD_TYPES.gamepad) {
    		$('#gamepads').addClass('notCompatible');
    	} else if (padType == Phonepad.PAD_TYPES.phonepad) {
    		$('#phonepads').addClass('notCompatible');
    	}
    },

    connected: function (gameId) {
    	$('.gameId').html(gameId);
    },

    playerConnected: function (playerId, padType) {
    	if (players.playerId == null) {
    		addPlayer(playerId);
    	}
    },

    playerDisconnected: function (playerId) {
    	removePlayer(playerId);
    },

    commandsReceived: function (commands) {
    	var player = players[commands.pId];
    	if (player) player.commands = commands;
    }
	});

	var addPlayer = function (playerId) {
		var player = Physics.body('player', {
	    id: playerId,
	    team: Object.keys(players).length % 4,
	    viewport: world._renderer.renderer
	  });
		players[player.id] = player;
	  var playerBehavior = Physics.behavior('player-behavior', { player: player });
		world.add([player, playerBehavior]);
		player.animateRepop();
		gui.addPlayer(player);
	};

	var removePlayer = function (playerId) {
		world.emit('removeBody', players[playerId]);
		gui.removePlayer(playerId);
		delete players[playerId];
		var n = 0;
		for (var i in players) {
			var player = players[i];
			player.updateTeam(n % 4);
			n++;
		}
	};

	var popBox = function () {
		if (Math.random() < 0.003) {
			var element = Physics.body('box', {
		    x: (world._renderer.renderer.width + 600 * (2 * Math.random() - 1)) / 2,
		    y: 0
		  });
			world.add(element);
		}
	};

	this.update = function () {
		popBox();
		input.update(players);
	};

	this.checkVictory = function () {
		if (started) {
			// check if game over
			var playersAlive = [];
			for (var i in players) {
				var player = players[i];
				if (player.life > 0) {
					if (playersAlive.length > 0) return;

					playersAlive.push(player);
				}
			}
			gui.showVictory(playersAlive[0]);
		} else {
			for (var i in players) {
				var player = players[i];
				player.life = 3;
			}
		}
	};

	this.start = function () {
		started = true;
		for (var i in players) {
			var player = players[i];
			player.setEnabled(false);
			player.reset(true);
		}
		$('#gameIdInGame').removeClass('hide');
		$('#victory').addClass('hide');
		$('#instructions').addClass('hide');
		gui.showRoundStart(function () {
			for (var i in players) {
			var player = players[i];
			player.setEnabled(true);
		}
		});
	};

	this.updateGUI = function (data) {
		switch(data.type) {
			case 'life':
				if (started) {
					gui.updateLife(data.target);
				}
				break;
			case 'team':
				gui.updateTeam(data.target);
				break;
			case 'mass':
				gui.updateMass(data.target);
				break;
		}
	};

}
