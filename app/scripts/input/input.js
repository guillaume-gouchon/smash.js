function Input( game, callbacks ) {

	var KEYS_MAP = {
		ai: {
			addPlayer: 107,
			removePlayer: 109,
			addPlayerBis: 187,
			removePlayerBis: 189
		},
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

	var KEYBOARD_PLAYER_1_ID = 'keyboard1',
		KEYBOARD_PLAYER_2_ID = 'keyboard2',
		KEYBOARD_PLAYER_3_ID = 'keyboard3';
	
	var keyboardControllers = [new Controller( KEYBOARD_PLAYER_1_ID ), new Controller( KEYBOARD_PLAYER_2_ID ), new Controller( KEYBOARD_PLAYER_3_ID )],
		keyboardPlayers = [];

	// init phonepad.js (= gamepads + phonepads)
	var phonepad = Phonepad.getInstance();
	phonepad.on( 'connected', callbacks.connected );
	phonepad.on( 'padNotSupported', callbacks.padNotSupported );
	phonepad.on( 'playerConnected', callbacks.playerConnected );
	phonepad.on( 'playerDisconnected', callbacks.playerDisconnected );
	phonepad.on( 'commandsReceived', callbacks.commandsReceived );
	phonepad.start();

	// setup keyboard keys
	$( document ).keydown(function ( event ) {
		if ( !game.loaded ) return true;
console.log(event.keyCode)
		switch( event.keyCode ) {
			case KEYS_MAP.player1.left:
				keyboardControllers[0].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, -1 );
				callbacks.commandsReceived( keyboardControllers[0].toJSON() );
				break;
			case KEYS_MAP.player1.right:
				keyboardControllers[0].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, 1 );
				callbacks.commandsReceived( keyboardControllers[0].toJSON() );
				break;
			case KEYS_MAP.player2.left:
				keyboardControllers[1].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, -1 );
				callbacks.commandsReceived( keyboardControllers[1].toJSON() );
				break;
			case KEYS_MAP.player2.right:
				keyboardControllers[1].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, 1 );
				callbacks.commandsReceived( keyboardControllers[1].toJSON() );
				break;
			case KEYS_MAP.player3.left:
				keyboardControllers[2].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, -1 );
				callbacks.commandsReceived( keyboardControllers[2].toJSON() );
				break;
			case KEYS_MAP.player3.right:
				keyboardControllers[2].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, 1 );
				callbacks.commandsReceived( keyboardControllers[2].toJSON() );
				break;
			case KEYS_MAP.player1.jump:
				keyboardControllers[0].updateButtonState( Controller.Buttons.A, true );
				callbacks.commandsReceived( keyboardControllers[0].toJSON() );
				break;
			case KEYS_MAP.player1.attack:
				keyboardControllers[0].updateButtonState( Controller.Buttons.B, true );
				callbacks.commandsReceived( keyboardControllers[0].toJSON() );
				break;
			case KEYS_MAP.player2.jump:
				keyboardControllers[1].updateButtonState( Controller.Buttons.A, true );
				callbacks.commandsReceived( keyboardControllers[1].toJSON() );
				break;
			case KEYS_MAP.player2.attack:
				keyboardControllers[1].updateButtonState( Controller.Buttons.B, true );
				callbacks.commandsReceived( keyboardControllers[1].toJSON() );
				break;
			case KEYS_MAP.player3.jump:
				keyboardControllers[2].updateButtonState( Controller.Buttons.A, true );
				callbacks.commandsReceived( keyboardControllers[2].toJSON() );
				break;
			case KEYS_MAP.player3.attack:
				keyboardControllers[2].updateButtonState( Controller.Buttons.B, true );
				callbacks.commandsReceived( keyboardControllers[2].toJSON() );
				break;
			case KEYS_MAP.player1.addPlayer:
				var index = keyboardPlayers.indexOf( KEYBOARD_PLAYER_1_ID );
				if ( index >= 0 ) {
					keyboardPlayers.splice( index, 1 );
					callbacks.playerDisconnected( KEYBOARD_PLAYER_1_ID );
				} else {
					keyboardPlayers.push( KEYBOARD_PLAYER_1_ID);
					callbacks.playerConnected( KEYBOARD_PLAYER_1_ID, 2 );
				}
				break;
			case KEYS_MAP.player1.addPlayerBis:
				var index = keyboardPlayers.indexOf( KEYBOARD_PLAYER_1_ID );
				if ( index >= 0 ) {
					keyboardPlayers.splice( index, 1 );
					callbacks.playerDisconnected( KEYBOARD_PLAYER_1_ID );
				} else {
					keyboardPlayers.push( KEYBOARD_PLAYER_1_ID );
					callbacks.playerConnected( KEYBOARD_PLAYER_1_ID, 2);
				}
				break;
			case KEYS_MAP.player2.addPlayer:
				var index = keyboardPlayers.indexOf( KEYBOARD_PLAYER_2_ID );
				if ( index >= 0 ) {
					keyboardPlayers.splice( index, 1 );
					callbacks.playerDisconnected( KEYBOARD_PLAYER_2_ID );
				} else {
					keyboardPlayers.push( KEYBOARD_PLAYER_2_ID);
					callbacks.playerConnected( KEYBOARD_PLAYER_2_ID, 2);
				}
				break;
			case KEYS_MAP.player2.addPlayerBis:
				var index = keyboardPlayers.indexOf( KEYBOARD_PLAYER_2_ID);
				if ( index >= 0 ) {
					keyboardPlayers.splice( index, 1 );
					callbacks.playerDisconnected( KEYBOARD_PLAYER_2_ID);
				} else {
					keyboardPlayers.push( KEYBOARD_PLAYER_2_ID);
					callbacks.playerConnected( KEYBOARD_PLAYER_2_ID, 2);
				}
				break;
			case KEYS_MAP.player3.addPlayer:
				var index = keyboardPlayers.indexOf( KEYBOARD_PLAYER_3_ID);
				if ( index >= 0 ) {
					keyboardPlayers.splice( index, 1 );
					callbacks.playerDisconnected( KEYBOARD_PLAYER_3_ID);
				} else {
					keyboardPlayers.push( KEYBOARD_PLAYER_3_ID);
					callbacks.playerConnected( KEYBOARD_PLAYER_3_ID, 2);
				}
				break;
			case KEYS_MAP.player3.addPlayerBis:
				var index = keyboardPlayers.indexOf( KEYBOARD_PLAYER_3_ID);
				if ( index >= 0 ) {
					keyboardPlayers.splice( index, 1 );
					callbacks.playerDisconnected( KEYBOARD_PLAYER_3_ID);
				} else {
					keyboardPlayers.push( KEYBOARD_PLAYER_3_ID);
					callbacks.playerConnected( KEYBOARD_PLAYER_3_ID, 2);
				}
				break;
			case KEYS_MAP.ai.addPlayer:
					game.addAIPlayer();
				break;
			case KEYS_MAP.ai.removePlayer:
					game.removeAIPlayer();
				break;
			case KEYS_MAP.ai.addPlayerBis:
					game.addAIPlayer();
				break;
			case KEYS_MAP.ai.removePlayerBis:
					game.removeAIPlayer();
				break;
		}
	});

	$( document ).keyup(function ( event ) {
		if ( !game.loaded ) return true;

		switch( event.keyCode ) {
			case KEYS_MAP.player1.left:
				if ( keyboardControllers[0].axes[Controller.Buttons.AXIS_HORIZONTAL] == -1 ) {
					keyboardControllers[0].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, 0 );
					callbacks.commandsReceived( keyboardControllers[0].toJSON() );
				}
				break;
			case KEYS_MAP.player1.right:
				if ( keyboardControllers[0].axes[Controller.Buttons.AXIS_HORIZONTAL] == 1 ) {
					keyboardControllers[0].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, 0 );
					callbacks.commandsReceived( keyboardControllers[0].toJSON() );
				}
				break;
			case KEYS_MAP.player2.left:
				if ( keyboardControllers[1].axes[Controller.Buttons.AXIS_HORIZONTAL] == -1 ) {
					keyboardControllers[1].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, 0 );
					callbacks.commandsReceived( keyboardControllers[1].toJSON() );
				}
				break;
			case KEYS_MAP.player2.right:
				if ( keyboardControllers[1].axes[Controller.Buttons.AXIS_HORIZONTAL] == 1 ) {
					keyboardControllers[1].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, 0 );
					callbacks.commandsReceived( keyboardControllers[1].toJSON() );
				}
				break;
			case KEYS_MAP.player3.left:
				if ( keyboardControllers[2].axes[Controller.Buttons.AXIS_HORIZONTAL] == -1 ) {
					keyboardControllers[2].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, 0 );
					callbacks.commandsReceived( keyboardControllers[2].toJSON() );
				}
				break;
			case KEYS_MAP.player3.right:
				if ( keyboardControllers[2].axes[Controller.Buttons.AXIS_HORIZONTAL] == 1 ) {
					keyboardControllers[2].updateAxisState( Controller.Buttons.AXIS_HORIZONTAL, 0 );
					callbacks.commandsReceived( keyboardControllers[2].toJSON() );
				}
				break;
			case KEYS_MAP.player1.jump:
				keyboardControllers[0].updateButtonState( Controller.Buttons.A, false );
				callbacks.commandsReceived( keyboardControllers[0].toJSON() );
				break;
			case KEYS_MAP.player1.attack:
				keyboardControllers[0].updateButtonState( Controller.Buttons.B, false );
				callbacks.commandsReceived( keyboardControllers[0].toJSON() );
				break;
			case KEYS_MAP.player2.jump:
				keyboardControllers[1].updateButtonState( Controller.Buttons.A, false );
				callbacks.commandsReceived( keyboardControllers[1].toJSON() );
				break;
			case KEYS_MAP.player2.attack:
				keyboardControllers[1].updateButtonState( Controller.Buttons.B, false );
				callbacks.commandsReceived( keyboardControllers[1].toJSON() );
				break;
			case KEYS_MAP.player3.jump:
				keyboardControllers[2].updateButtonState( Controller.Buttons.A, false );
				callbacks.commandsReceived( keyboardControllers[2].toJSON() );
				break;
			case KEYS_MAP.player3.attack:
				keyboardControllers[2].updateButtonState( Controller.Buttons.B, false );
				callbacks.commandsReceived( keyboardControllers[2].toJSON() );
				break;
		}
	});

	/**
	*	Called in the game loop.
	* Transforms players inputs into commands.
	*/
	this.update = function( players ) {
		var player,
			commands;
			
		for ( var i in players ) {
			player = players[i];
			if ( player.enabled ) {
				commands = player.commands;
				if ( commands.axes[Controller.Buttons.AXIS_HORIZONTAL] < -AXIS_THRESHOLD ) {
					player.moveLeft();
				} else if ( commands.axes[Controller.Buttons.AXIS_HORIZONTAL] > AXIS_THRESHOLD ) {
					player.moveRight();
				} else {
					player.stop();
				}

				if ( commands.buttons[Controller.Buttons.A].pressed ) {
					player.jump();
				} else {
					player.releaseJump();
				}

				if ( commands.buttons[Controller.Buttons.B].pressed ) {
					player.attack();
				} else {
					player.releaseAttack();
				}
			}
		}
	};

}
