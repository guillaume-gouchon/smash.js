function Game (world) {
	
	var world = world;
 	var players = {};
	var teamScores = null;
	var gui = new GUI();

	var started = false;

	var _this = this;

	var DEFAULT_NAMES = ['Colonel Heinz', 'Lord Bobby', 'Lemon Alisa',
            'The Red Baron', 'Tom Boy', 'Tommy Toe', 'Lee Mon', 'Sigmund Fruit', 'Al Pacho',
            'Mister Bean', 'Ban Anna', 'General Grape', 'Smoothie', 'Optimus Lime', 'Juicy Luke'];
	
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

  var getPlayerName = function () {
  	var names = DEFAULT_NAMES;
  	var index;
  	for (var i in players) {
  		index = names.indexOf(players[i]);
  		if (index >= 0) {
  			names.splice(index, 1);
  		}
  	}
  	if (names.length > 0) {
    	return names[parseInt(Math.random() * names.length)];
  	} else {
  		return DEFAULT_NAMES[parseInt(Math.random() * DEFAULT_NAMES.length)] + ' IV';
  	}
  };

  var getPlayerTeam = function () {
  	var teams = [];
  	for (var i = 0 ; i < world.map.teams; i++) {
  		teams[i] = 0;
  	}
  	for (var i in players) {
  		if (players[i].team < teams.length) { // used when switching between game modes
  			teams[players[i].team]++;
  		}
  	}
  	return teams.indexOf(Math.min.apply(Math, teams));
  };

	var addPlayer = function (playerId) {
		var player = Physics.body('player', {
	    id: playerId,
	    name: getPlayerName(),
	    team: getPlayerTeam(),
	    life: world.map.life,
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
		var randomZone = world.map.width;
		var extra = 0;
		if (world.map.id == Map.MAP_TYPES.flag.id) {
			// restrict to a particular randomZone depending on the team
			randomZone /= 2;
			extra = (2 * player.team - 1) * world.map.width / 4;
		}
		player.state.pos.set((viewport.width + randomZone * (2 * Math.random() - 1)) / 2 + extra, Math.random() < 0.5 ? viewport.height / 2 - 50 : viewport.height / 2 + 105);
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
		if (started) {
			if (world.map.id == Map.MAP_TYPES.standard.id) {
				// check if game over
				var playersAlive = [];
				for (var i in players) {
					var player = players[i];
					if (player.life > 0) {
						if (playersAlive.length > 0) return;

						playersAlive.push(player);
					}
				}
				gui.showVictory(playersAlive[0].name, playersAlive[0].team);
				started = false;
			}
		} else {
			for (var i in players) {
				var player = players[i];
				player.life = world.map.life;
			}
		}
	};

	this.start = function () {
		started = true;
		gui.init(world.map);
		teamScores = [];
		for (var i = 0; i < world.map.teams; i++) {
			teamScores[i] = 0;
		}
		for (var i in players) {
			var player = players[i];
			player.reset(true);
			player.setActive(false);
		}
		for (var i in world._bodies) {
			if (world._bodies[i].gameType === 'flag') {
				world._bodies[i].reset();
			}
		}
		$('#gameIdInGame').removeClass('hide');
		$('#victory').addClass('hide');
		$('#instructions').addClass('hide');
		gui.showRoundStart(function () {
			for (var i in players) {
				var player = players[i];
				player.setActive(true);
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
			teamScores[team]++;

			gui.updateTeamScore(team, teamScores[team]);

			if (teamScores[team] == 3) {
				gui.showVictory('Team ' + (team + 1), team);
				started = false;
			}
		}
	};

	this.reset = function () {
		teamScores = null;
		var player;
		for (var i in players) {
			player = players[i];
			if (player.team >= world.map.teams) {
				player.team = getPlayerTeam();
				gui.updateTeam(player);
			}
			
			world.add(player);
			renderer.stage.addChild(player.view);
			player.initialLife = world.map.life;
			gui.updateInitialLife(player);
			player.reset(true);
			player.animateRepop();
		}
	};

}

Game.TEAM_COLORS = ['#ee3224', '#fcff00', '#60b038', '#0994ff'];
Game.TINT_COLORS = [0xee3224, 0xfcff00, 0x60b038,  0x0994ff];
Game.CHARACTERS = ['tomato', 'lemon', 'green_tomato', 'blue_lemon'];
