function Input(game, callbacks) {

	var KEYS_MAP = {
		player1: {
			addPlayer: 49,
			addPlayerBis: 97,
			left: 65,
			right: 68,
			jump: 87,
			attack: 83
		},
		player2: {
			addPlayer: 50,
			addPlayerBis: 98,
			left: 37,
			right: 39,
			jump: 38,
			attack: 40
		},
		player3: {
			addPlayer: 51,
			addPlayerBis: 99,
			left: 72,
			right: 75,
			jump: 85,
			attack: 74
		}
	};
	
	var AXIS_THRESHOLD = 0.3;

	var KEYBOARD_PLAYER_1_ID = 'keyboard1';
	var KEYBOARD_PLAYER_2_ID = 'keyboard2';
	var KEYBOARD_PLAYER_3_ID = 'keyboard3';
	
	var keyboardControllers = [new Controller(KEYBOARD_PLAYER_1_ID), new Controller(KEYBOARD_PLAYER_2_ID), new Controller(KEYBOARD_PLAYER_3_ID)];
	var keyboardPlayers = [];

	// init phonepad.js (= gamepads + phonepads)
	var phonepad = Phonepad.getInstance();
	phonepad.on('connected', callbacks.connected);
	phonepad.on('padNotSupported', callbacks.padNotSupported);
	phonepad.on('playerConnected', callbacks.playerConnected);
	phonepad.on('playerDisconnected', callbacks.playerDisconnected);
	phonepad.on('commandsReceived', callbacks.commandsReceived);
	phonepad.start();

	// init keyboard
	$(document).keydown(function (event) {
		if (!game.loaded) return true;

		switch(event.keyCode) {
			case KEYS_MAP.player1.left:
				keyboardControllers[0].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, -1);
				callbacks.commandsReceived(keyboardControllers[0].toJSON());
				break;
			case KEYS_MAP.player1.right:
				keyboardControllers[0].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 1);
				callbacks.commandsReceived(keyboardControllers[0].toJSON());
				break;
			case KEYS_MAP.player2.left:
				keyboardControllers[1].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, -1);
				callbacks.commandsReceived(keyboardControllers[1].toJSON());
				break;
			case KEYS_MAP.player2.right:
				keyboardControllers[1].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 1);
				callbacks.commandsReceived(keyboardControllers[1].toJSON());
				break;
			case KEYS_MAP.player3.left:
				keyboardControllers[2].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, -1);
				callbacks.commandsReceived(keyboardControllers[2].toJSON());
				break;
			case KEYS_MAP.player3.right:
				keyboardControllers[2].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 1);
				callbacks.commandsReceived(keyboardControllers[2].toJSON());
				break;
			case KEYS_MAP.player1.jump:
				keyboardControllers[0].updateButtonState(Controller.BUTTONS_MAP.A, true);
				callbacks.commandsReceived(keyboardControllers[0].toJSON());
				break;
			case KEYS_MAP.player1.attack:
				keyboardControllers[0].updateButtonState(Controller.BUTTONS_MAP.B, true);
				callbacks.commandsReceived(keyboardControllers[0].toJSON());
				break;
			case KEYS_MAP.player2.jump:
				keyboardControllers[1].updateButtonState(Controller.BUTTONS_MAP.A, true);
				callbacks.commandsReceived(keyboardControllers[1].toJSON());
				break;
			case KEYS_MAP.player2.attack:
				keyboardControllers[1].updateButtonState(Controller.BUTTONS_MAP.B, true);
				callbacks.commandsReceived(keyboardControllers[1].toJSON());
				break;
			case KEYS_MAP.player3.jump:
				keyboardControllers[2].updateButtonState(Controller.BUTTONS_MAP.A, true);
				callbacks.commandsReceived(keyboardControllers[2].toJSON());
				break;
			case KEYS_MAP.player3.attack:
				keyboardControllers[2].updateButtonState(Controller.BUTTONS_MAP.B, true);
				callbacks.commandsReceived(keyboardControllers[2].toJSON());
				break;
			case KEYS_MAP.player1.addPlayer:
				var index = keyboardPlayers.indexOf(KEYBOARD_PLAYER_1_ID);
				if (index >= 0) {
					keyboardPlayers.splice(index, 1);
					callbacks.playerDisconnected(KEYBOARD_PLAYER_1_ID);
				} else {
					keyboardPlayers.push(KEYBOARD_PLAYER_1_ID);
					callbacks.playerConnected(KEYBOARD_PLAYER_1_ID, 2);
				}
				break;
			case KEYS_MAP.player1.addPlayerBis:
				var index = keyboardPlayers.indexOf(KEYBOARD_PLAYER_1_ID);
				if (index >= 0) {
					keyboardPlayers.splice(index, 1);
					callbacks.playerDisconnected(KEYBOARD_PLAYER_1_ID);
				} else {
					keyboardPlayers.push(KEYBOARD_PLAYER_1_ID);
					callbacks.playerConnected(KEYBOARD_PLAYER_1_ID, 2);
				}
				break;
			case KEYS_MAP.player2.addPlayer:
				var index = keyboardPlayers.indexOf(KEYBOARD_PLAYER_2_ID);
				if (index >= 0) {
					keyboardPlayers.splice(index, 1);
					callbacks.playerDisconnected(KEYBOARD_PLAYER_2_ID);
				} else {
					keyboardPlayers.push(KEYBOARD_PLAYER_2_ID);
					callbacks.playerConnected(KEYBOARD_PLAYER_2_ID, 2);
				}
				break;
			case KEYS_MAP.player2.addPlayerBis:
				var index = keyboardPlayers.indexOf(KEYBOARD_PLAYER_2_ID);
				if (index >= 0) {
					keyboardPlayers.splice(index, 1);
					callbacks.playerDisconnected(KEYBOARD_PLAYER_2_ID);
				} else {
					keyboardPlayers.push(KEYBOARD_PLAYER_2_ID);
					callbacks.playerConnected(KEYBOARD_PLAYER_2_ID, 2);
				}
				break;
			case KEYS_MAP.player3.addPlayer:
				var index = keyboardPlayers.indexOf(KEYBOARD_PLAYER_3_ID);
				if (index >= 0) {
					keyboardPlayers.splice(index, 1);
					callbacks.playerDisconnected(KEYBOARD_PLAYER_3_ID);
				} else {
					keyboardPlayers.push(KEYBOARD_PLAYER_3_ID);
					callbacks.playerConnected(KEYBOARD_PLAYER_3_ID, 2);
				}
				break;
			case KEYS_MAP.player3.addPlayerBis:
				var index = keyboardPlayers.indexOf(KEYBOARD_PLAYER_3_ID);
				if (index >= 0) {
					keyboardPlayers.splice(index, 1);
					callbacks.playerDisconnected(KEYBOARD_PLAYER_3_ID);
				} else {
					keyboardPlayers.push(KEYBOARD_PLAYER_3_ID);
					callbacks.playerConnected(KEYBOARD_PLAYER_3_ID, 2);
				}
				break;
		}
	});

	$(document).keyup(function (event) {
		if (!game.loaded) return true;

		switch(event.keyCode) {
			case KEYS_MAP.player1.left:
				if (keyboardControllers[0].axes[Controller.BUTTONS_MAP.axisHorizontal] == -1) {
					keyboardControllers[0].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[0].toJSON());
				}
				break;
			case KEYS_MAP.player1.right:
				if (keyboardControllers[0].axes[Controller.BUTTONS_MAP.axisHorizontal] == 1) {
					keyboardControllers[0].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[0].toJSON());
				}
				break;
			case KEYS_MAP.player2.left:
				if (keyboardControllers[1].axes[Controller.BUTTONS_MAP.axisHorizontal] == -1) {
					keyboardControllers[1].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[1].toJSON());
				}
				break;
			case KEYS_MAP.player2.right:
				if (keyboardControllers[1].axes[Controller.BUTTONS_MAP.axisHorizontal] == 1) {
					keyboardControllers[1].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[1].toJSON());
				}
				break;
			case KEYS_MAP.player3.left:
				if (keyboardControllers[2].axes[Controller.BUTTONS_MAP.axisHorizontal] == -1) {
					keyboardControllers[2].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[2].toJSON());
				}
				break;
			case KEYS_MAP.player3.right:
				if (keyboardControllers[2].axes[Controller.BUTTONS_MAP.axisHorizontal] == 1) {
					keyboardControllers[2].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[2].toJSON());
				}
				break;
			case KEYS_MAP.player1.jump:
				keyboardControllers[0].updateButtonState(Controller.BUTTONS_MAP.A, false);
				callbacks.commandsReceived(keyboardControllers[0].toJSON());
				break;
			case KEYS_MAP.player1.attack:
				keyboardControllers[0].updateButtonState(Controller.BUTTONS_MAP.B, false);
				callbacks.commandsReceived(keyboardControllers[0].toJSON());
				break;
			case KEYS_MAP.player2.jump:
				keyboardControllers[1].updateButtonState(Controller.BUTTONS_MAP.A, false);
				callbacks.commandsReceived(keyboardControllers[1].toJSON());
				break;
			case KEYS_MAP.player2.attack:
				keyboardControllers[1].updateButtonState(Controller.BUTTONS_MAP.B, false);
				callbacks.commandsReceived(keyboardControllers[1].toJSON());
				break;
			case KEYS_MAP.player3.jump:
				keyboardControllers[2].updateButtonState(Controller.BUTTONS_MAP.A, false);
				callbacks.commandsReceived(keyboardControllers[2].toJSON());
				break;
			case KEYS_MAP.player3.attack:
				keyboardControllers[2].updateButtonState(Controller.BUTTONS_MAP.B, false);
				callbacks.commandsReceived(keyboardControllers[2].toJSON());
				break;
		}
	});

	/**
	*	Called in the game loop
	*/
	this.update = function (players) {
		for (var i in players) {
			var player = players[i];
			if (player.enabled) {
				var commands = player.commands;
				if (commands.axes[Controller.BUTTONS_MAP.axisHorizontal] < -AXIS_THRESHOLD) {
					player.moveLeft();
				} else if (commands.axes[Controller.BUTTONS_MAP.axisHorizontal] > AXIS_THRESHOLD) {
					player.moveRight();
				} else {
					player.stop();
				}

				if (commands.buttons[Controller.BUTTONS_MAP.A].pressed) {
					player.jump();
				} else {
					player.releaseJump();
				}

				if (commands.buttons[Controller.BUTTONS_MAP.B].pressed) {
					player.attack();
				} else {
					player.releaseAttack();
				}
			}
		}
	};
	
}
