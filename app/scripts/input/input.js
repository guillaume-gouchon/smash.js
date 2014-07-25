function Input(callbacks) {

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
		}
	};
	var KEYBOARD_PLAYER_1_ID = 'keyboard1';
	var KEYBOARD_PLAYER_2_ID = 'keyboard2';

	var AXIS_THRESHOLD = 0.3;

	var keyboardControllers = [new Controller(KEYBOARD_PLAYER_1_ID), new Controller(KEYBOARD_PLAYER_2_ID)];
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
		switch(event.keyCode) {
			case KEYS_MAP.player1.left:
				keyboardControllers[0].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, -1);
				callbacks.commandsReceived(keyboardControllers[0]);
				break;
			case KEYS_MAP.player1.right:
				keyboardControllers[0].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 1);
				callbacks.commandsReceived(keyboardControllers[0]);
				break;
			case KEYS_MAP.player2.left:
				keyboardControllers[1].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, -1);
				callbacks.commandsReceived(keyboardControllers[1]);
				break;
			case KEYS_MAP.player2.right:
				keyboardControllers[1].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 1);
				callbacks.commandsReceived(keyboardControllers[1]);
				break;
			case KEYS_MAP.player1.jump:
				keyboardControllers[0].updateButtonState(Controller.BUTTONS_MAP.A, true);
				callbacks.commandsReceived(keyboardControllers[0]);
				break;
			case KEYS_MAP.player1.attack:
				keyboardControllers[0].updateButtonState(Controller.BUTTONS_MAP.X, true);
				callbacks.commandsReceived(keyboardControllers[0]);
				break;
			case KEYS_MAP.player2.jump:
				keyboardControllers[1].updateButtonState(Controller.BUTTONS_MAP.A, true);
				callbacks.commandsReceived(keyboardControllers[1]);
				break;
			case KEYS_MAP.player2.attack:
				keyboardControllers[1].updateButtonState(Controller.BUTTONS_MAP.X, true);
				callbacks.commandsReceived(keyboardControllers[1]);
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
		}
	});

	$(document).keyup(function (event) {
		switch(event.keyCode) {
			case KEYS_MAP.player1.left:
				if (keyboardControllers[0].axes[Controller.BUTTONS_MAP.axisHorizontal] == -1) {
					keyboardControllers[0].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[0]);
				}
				break;
			case KEYS_MAP.player1.right:
				if (keyboardControllers[0].axes[Controller.BUTTONS_MAP.axisHorizontal] == 1) {
					keyboardControllers[0].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[0]);
				}
				break;
			case KEYS_MAP.player2.left:
				if (keyboardControllers[1].axes[Controller.BUTTONS_MAP.axisHorizontal] == -1) {
					keyboardControllers[1].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[1]);
				}
				break;
			case KEYS_MAP.player2.right:
				if (keyboardControllers[1].axes[Controller.BUTTONS_MAP.axisHorizontal] == 1) {
					keyboardControllers[1].updateAxisState(Controller.BUTTONS_MAP.axisHorizontal, 0);
					callbacks.commandsReceived(keyboardControllers[1]);
				}
				break;
			case KEYS_MAP.player1.jump:
				keyboardControllers[0].updateButtonState(Controller.BUTTONS_MAP.A, false);
				callbacks.commandsReceived(keyboardControllers[0]);
				break;
			case KEYS_MAP.player1.attack:
				keyboardControllers[0].updateButtonState(Controller.BUTTONS_MAP.X, false);
				callbacks.commandsReceived(keyboardControllers[0]);
				break;
			case KEYS_MAP.player2.jump:
				keyboardControllers[1].updateButtonState(Controller.BUTTONS_MAP.A, false);
				callbacks.commandsReceived(keyboardControllers[1]);
				break;
			case KEYS_MAP.player2.attack:
				keyboardControllers[1].updateButtonState(Controller.BUTTONS_MAP.X, false);
				callbacks.commandsReceived(keyboardControllers[1]);
				break;
		}
	});

	/**
	*	Called in the game loop
	*/
	this.update = function (players) {
		for (var i in players) {
			var player = players[i];
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

			if (commands.buttons[Controller.BUTTONS_MAP.X].pressed) {
				player.attack();
			} else {
				player.releaseAttack();
			}
		}
	};

}
