function Buff (id, image) {
	Item.call(this, Item.Types.BUFF, image);

	this.applyBuff = function (player) {
		switch (id) {
			case 0:
				// shield
				if (player.buff != null) {
					player.buff.destroy();
				}
				var shield = Physics.body('shield', {
			    x: player.state.pos.x + player.orientation * 20,
			    y: player.state.pos.y,
			    power: 150
				});
	      player._world.add([
	      	shield, 
	      	Physics.behavior('shield-behavior', {
		      	player: player,
		      	shield: shield
		      })
	      ]);
	      player.buff = shield;
				break;
			case 1:
				// third jump
				player.nbJumps = 3;
				break;
			case 2:
				// health
				player.updateDamage(0);
				break;
			case 3:
				// boost
				player.jumpSkill *= 1.1;
				player.speed *= 1.5;
				break;
		}
	};

}

Buff.prototype = Object.create(Item.prototype);
Buff.prototype.constructor = Buff;
