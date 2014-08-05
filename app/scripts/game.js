function Game (world) {
	
	var world = world;
 	var players = {};
	var teams = [0, 0, 0, 0];
	var gui = new GUI();

	var started = false;

	var _this = this;
	
	var input = new Input(this, {
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
    	if (_this.loaded && players[playerId] == null) {
    		addPlayer(playerId);
    	}
    },

    playerDisconnected: function (playerId) {
    	removePlayer(playerId);
    },

    commandsReceived: function (commands) {
    	var player = players[commands.pId];
    	if (player) {
				player.commands = commands;
			}
    }
	});

	var addPlayer = function (playerId) {
		var player = Physics.body('player', {
	    id: playerId,
	    team: Object.keys(players).length % world.map.teams,
	    life: world.map.life
	  });
	  _this.repopPlayer(player);
		players[player.id] = player;
	  var playerBehavior = Physics.behavior('player-behavior', { player: player });
		world.add([player, playerBehavior]);
		player.animateRepop();
		gui.addPlayer(player);
	};

	var removePlayer = function (playerId) {
		var player = players[playerId];
		if (player.buff) {
			player.buff.destroy();
		}
		world.emit('removeBody', player);
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
		if (Math.random() < 0.006) {
			var element = Physics.body('box', {
		    x: (world._renderer.renderer.width + world.map.width * (2 * Math.random() - 1)) / 2,
		    y: 0
		  });
			world.add(element);
		}
	};

	this.loaded = false;

	this.repopPlayer = function (player) {
		var viewport = world._renderer.renderer;
		player.state.pos.set((viewport.width + world.map.width * (2 * Math.random() - 1)) / 2, Math.random() < 0.5 ? viewport.height / 2 - 50 : viewport.height / 2 + 105);
	};

	this.onLoaded = function () {
		_this.loaded = true;
		gui.hideLoading();
	};

	this.update = function () {
		popBox();
		input.update(players);
	};

	this.checkVictory = function () {
		if (started && world.map.id != 1) {
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
				if (started && world.map.id != 1) {
					gui.updateLife(data.target);
				}
				break;
			case 'team':
				gui.updateTeam(data.target);
				break;
			case 'damage':
				gui.updateDamage(data.target);
				break;
			case 'item_add':
				gui.addItem(data.target);
				break;
			case 'item_remove':
				gui.removeItem(data.target);
				break;
			case 'item_update':
				gui.updateItem(data.target);
				break;
		}
	};

	this.winPoints = function (team) {
		if (started) {
			// update gui
			// add animation
			if (++teams[team] == 3) {
				gui.showVictory('Team ' + (team + 1));
			}
		}
	};

}

Game.TEAM_COLORS = ['#ED1818', '#CFCC36', '#48CF36', '#3680CF'];
Game.TINT_COLORS = [0xED1818, 0xCFCC36, 0x48CF36,  0x3680CF];
Game.CHARACTERS = ['tomato', 'lemon', 'tomato', 'lemon'];
