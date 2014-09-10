function AI( world ) {

	var UPDATE_FREQUENCY = 60;

	var step = 0;

	// game interesting info
	var platforms = [];
	var players = [];
	var boxes = [];

	var updateCommands = function( player ) {
		var commands = new Controller( player.id ).toJSON();
		
		var nearestEnemy = getNearestEnemy( player );
		var nearestBox = getNearestBox( player );

		if ( !isPlatformUnder( player ) ) {
			// target nearest reachable platform
			jump( commands );
			if ( player.state.pos.x > window.innerWidth / 2 ) {
				goLeft( commands );
			} else {
				goRight( commands );
			}
		} else if ( !player.weapon || player.weapon.image == Item.buildBaseWeapon().image ) {
			if ( nearestBox.obj && ( !nearestEnemy.obj || nearestBox.distance < nearestEnemy.distance ) ) {
				targetBox( commands, player, nearestBox );
			} else if ( nearestEnemy.obj ) {
				goCloseCombat( commands, player, nearestEnemy );
			}
		} else if ( nearestEnemy.obj ) {
			switch ( player.weapon.weaponType ) {
				case Weapon.Types.CONTACT:
					goCloseCombat( commands, player, nearestEnemy );
					break;
				case Weapon.Types.DROP:
					// TODO
					attack( commands );
					break;
				case Weapon.Types.THROW:
					reachSameHeight( commands, player, nearestEnemy );
					break;
				case Weapon.Types.GUN:
					reachSameHeight( commands, player, nearestEnemy );
					break;
			}
		}

		player.commands = commands;
	};

	var targetBox = function( commands, player, box ) {
		var dx = box.obj.state.pos.x - player.state.pos.x;
		var dy = box.obj.state.pos.y - player.state.pos.y;

		// near the box, jump to break it
		if ( Math.abs( dx ) < 130 && Math.abs( dy ) <= 10 ) {
			jump ( commands );
		}

		if ( dy >= 0 ) {// on the same platform
			if ( dx > 20 ) {
				goRight( commands );
			} else if ( dx < -20 ) {
				goLeft( commands );
			}
		} else {// change platform
			changePlatform( commands, player, box );
		}
		
	};

	var goCloseCombat = function( commands, player, target ) {
		var dx = target.obj.state.pos.x - player.state.pos.x;
		var dy = target.obj.state.pos.y - player.state.pos.y;

		if ( target.distance < 70 ) {
			// attack enemy
			if ( dx > 0 && player.orientation == -1 ) {
				goRight( commands );
			} else if ( dx < 0 && player.orientation == 1 ) {
				goLeft( commands );
			} else {
				stop( commands );
			}
			attack( commands );
		} else {
			if ( Math.abs( dy ) < 60 ) {// on the same platform
				if ( dx > 40 ) {
					goRight( commands );
				} else if ( dx < -40 ) {
					goLeft( commands );
				}
			} else {// change platform
				changePlatform( commands, player, target );
			}
		}
	};

	var reachSameHeight = function ( commands, player, target ) {
		var dx = target.obj.state.pos.x - player.state.pos.x;
		var dy = target.obj.state.pos.y - player.state.pos.y;

		if ( Math.abs( dy ) < 60 ) {// on the same platform
			if ( dy < -20 ) {
				jump( commands );
			} else if ( dy > 20 ) {
				// wait to be at the same height
			} else {
				if ( dx > 0 && player.orientation == -1 ) {
					goRight( commands );
				} else if ( dx < 0 && player.orientation == 1 ) {
					goLeft( commands );
				} else {
					stop( commands );
				}
				attack ( commands );
			}
		} else {// change platform
			changePlatform( commands, player, target );
		}
	};

	var changePlatform = function( commands, player, target ) {
		var dx = target.obj.state.pos.x - player.state.pos.x;
		var dy = target.obj.state.pos.y - player.state.pos.y;

		var targetPlatform = getNearestPlatform( target.obj );
		var side;
		if ( Math.abs( player.state.pos.x - targetPlatform.obj.state.pos.x + targetPlatform.obj.width / 2 ) < Math.abs( player.state.pos.x - targetPlatform.obj.state.pos.x - targetPlatform.obj.width / 2 ) ) {
			side = targetPlatform.obj.state.pos.x - targetPlatform.obj.width / 2 - 15;
		} else {
			side = targetPlatform.obj.state.pos.x + targetPlatform.obj.width / 2 + 15;
		}
		var dx = side - player.state.pos.x;
		if ( dx > 40 ) {
			goRight( commands );
		} else if ( dx < -40 ) {
			goLeft( commands );
		} else {
			jump( commands );
		}
	};

	var updateInfo = function() {
		// update players (when adding new players retro-actively)
		players = world.find(function( body ) {
			return body.gameType == 'player';
		});

		// update boxes
		boxes = world.find(function( body ) {
			return body.gameType == 'box';
		});

		// add platforms the first time
		if ( platforms.length == 0 ) {
			platforms = world.find(function( body ) {
				return body.gameType == 'decor';
			});
		}
	};

	var isPlatformUnder = function( player ) {
		var platform;
		for ( var i in platforms ) {
			platform = platforms[i];
			if ( platform.state.pos.y - platform.height / 2 >= player.state.pos.y  + player.height / 3
				&& platform.state.pos.x - platform.width / 2 < player.state.pos.x 
				&& platform.state.pos.x + platform.width / 2 > player.state.pos.x ) {
				return true;
			}
		}
		return false;
	};

	var getNearestEnemy = function( player ) {
		var nearest = null,
			smallestDistance = -1,
			distance,
			otherPlayer;

		for ( var i in players ) {
			otherPlayer = players[i];
			if ( otherPlayer.team != player.team ) {
				distance = getDistance( player, otherPlayer );
				if ( smallestDistance == -1 || distance < smallestDistance ) {
					smallestDistance = distance;
					nearest = otherPlayer;
				}
			}
		}

		return {
			obj: nearest,
			distance: smallestDistance
		};
	};

	var getNearestBox = function( player ) {
		var nearest = null,
			smallestDistance = -1,
			distance,
			box;
		
		for ( var i in boxes ) {
			box = boxes[i];
			distance = getDistance( player, box );
			if ( smallestDistance == -1 || distance < smallestDistance ) {
				smallestDistance = distance;
				nearest = box;
			}
		}

		return {
			obj: nearest,
			distance: smallestDistance
		};
	};

	var getNearestPlatform = function( object ) {
		var nearest = null,
			smallestDistance = -1,
			distance,
			platform;
		
		for ( var i in platforms ) {
			platform = platforms[i];
			distance = getDistance( object, platform );
			if ( smallestDistance == -1 || distance < smallestDistance ) {
				smallestDistance = distance;
				nearest = platform;
			}
		}

		return {
			obj: nearest,
			distance: smallestDistance
		};
	};

	var getDistance = function( object1, object2 ) {
		return Math.sqrt( Math.pow( object1.state.pos.x - object2.state.pos.x, 2 ) + Math.pow( object1.state.pos.y - object2.state.pos.y, 2 ) );
	};

	var goLeft = function( commands ) {
		commands.axes[Controller.Buttons.AXIS_HORIZONTAL] = -1;
	};

	var goRight = function( commands ) {
		commands.axes[Controller.Buttons.AXIS_HORIZONTAL] = 1;
	};

	var stop = function( commands ) {
		commands.axes[Controller.Buttons.AXIS_HORIZONTAL] = 0;
	};

	var jump = function( commands ) {
		if ( !commands.buttons[Controller.Buttons.A].pressed ) {
			commands.buttons[Controller.Buttons.A].pressed = true;
			setTimeout(function () {
				releaseJump( commands );
			}, 430);
		}
	};

	var releaseJump = function( commands ) {
		commands.buttons[Controller.Buttons.A].pressed = false;
	};

	var attack = function( commands ) {
		commands.buttons[Controller.Buttons.B].pressed = true;
		setTimeout(function () {
				releaseAttack( commands );
			}, 100);
	};

	var releaseAttack = function( commands ) {
		commands.buttons[Controller.Buttons.B].pressed = false;
	};


	/**
	*	PUBLIC METHODS
	*/

	this.init = function ( ) {
		updateInfo();
	};

	this.update = function( players ) {
		if ( players.length > 0 ) { 
			step = step > 1000 ? 0 : step + 1;

			// update info used by AI engine
			if ( step % UPDATE_FREQUENCY == 0 ) {
				updateInfo();
			}

			// update AI players commands
			var player;
			for ( var i in players ) {
				player = players[i];
				if ( step % player.AI.frequency == 0 ) {
					updateCommands( player );
				}
			}
		}
	};
}

AI.Levels = {
	EASY: {
		id: 0,
		frequency: 25
	},
	MEDIUM: {
		id: 1,
		frequency: 15
	},
	HARD: {
		id: 2,
		frequency: 10
	}
};
