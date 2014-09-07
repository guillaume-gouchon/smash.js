function AI( world ) {

	var step = 0;

	// game interesting info
	var platforms = [];
	var players = [];
	var boxes = [];

	var updateCommands = function ( player ) {
		var commands = new Controller( player.id ).toJSON();
		
		var nearestEnemy = getNearestEnemy( player );
		var nearestBox = getNearestBox( player );

		if ( !isPlatformUnder ) {
			// target nearest reachable platform
		} else if ( !player.weapon || player.weapon.image == Item.buildBaseWeapon().image ) {
			if ( nearestBox.obj && (!nearestEnemy.obj || nearestBox.distance < nearestEnemy.distance)) {
				// target nearest box
			} else if ( nearestEnemy.obj ) {
				// target nearest enemy
			}
		} else {
			switch ( player.weapon.weaponType ) {
				case Weapon.Types.CONTACT:
					if ( nearestEnemy.obj ) {
						if ( nearestEnemy.distance < 50 ) {
							// attack enemy
						} else {
							// target enemy
						}
					}
					break;

				case Weapon.Types.DROP:
					break;

				case Weapon.Types.GUN:
					if ( nearestEnemy.obj ) {
						if ( nearestEnemy.distance < 100 ) {
							// avoid enemy
						} else {
							// reach its Y
						}
					}
					break;
			}
		}

		player.commands = commands;
	};

	var updateInfo = function () {
		// update players (when adding new players retro-actively)
		players = [];// TODO

		// update boxes
		boxes = [];// TODO

		// add platforms the first time
		if ( platforms.length == 0 ) {
			platforms = [];// TODO
		}
	};

	var isPlatformUnder = function ( player ) {
		var platform;
		for ( var i in platforms ) {
			platform = platforms[i];
			if ( platform.state.pos.y + platform.height / 2 < player.state.pos.y - player.height / 2 
				&& platform.state.pos.x - platform.width / 2 < player.state.pos.x 
				&& platform.state.pos.x + platform.width / 2 > player.state.pos.x ) {
				return true;
			}
		}

		return false;
	};

	var getNearestEnemy = function ( player ) {
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

	var getNearestBox = function ( player ) {
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

	var getDistance = function ( object1, object2 ) {
		return Math.sqrt( Math.pow( object1.state.pos.x - object2.state.pos.x, 2 ) + Math.pow( object1.state.pos.y - object2.state.pos.y, 2 ) );
	};


	/**
	*	PUBLIC METHODS
	*/

	this.update = function ( players ) {
		step = step > 100 ? 0 : step++;

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
	};
}

AI.UPDATE_FREQUENCY = 10;

AI.Levels = {
	EASY: {
		id: 0,
		frequency: 20
	},
	MEDIUM: {
		id: 1,
		frequency: 10
	},
	HARD: {
		id: 2,
		frequency: 5
	}
};
