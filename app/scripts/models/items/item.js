
/**
*	Item class
*/
function Item (type, image) {
	this.type = type;
	this.image = image;	
}

Item.Types = {
	WEAPON: 0,
	BUFF: 1
};

Item.pickRandomItem = function () {
	var items = [
		new Buff(0, 'shield.png'),
		new Buff(1, 'feather.png'),
		new Buff(2, 'medical-pack.png'),
		new Buff(3, 'muscle-up.png'),
		new Weapon('wolf-trap.png', Weapon.Types.DROP, 30, 1000, 2),
		new Weapon('land-mine.png', Weapon.Types.DROP, 100, 500, 3),
	]
	return items[5];
};


/**
* Buff class
*/
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
			    power: 50
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
				player.updateMass(1.0);
				break;
			case 3:
				// boost
				player.jumpSkill *= 1.5;
				player.speed *= 1.5;
				break;
		}
	};

}
Buff.prototype = Object.create(Item.prototype);
Buff.prototype.constructor = Buff;


/**
* Weapon class
*/
function Weapon (image, type, power, stun, ammo) {
	Item.call(this, Item.Types.WEAPON, image);

	this.player = null;
	this.ammo = ammo;

	this.equip = function (player) {
		this.player = player;
		if (this.player.weapon) {
			this.player.weapon.unequip(this.player);
		}
		this.player.weapon = this;
		this.player._world.emit('updateGUI', {
			type: 'item_add',
			target: this.player
		});
	};

	this.unequip = function () {
		this.player._world.emit('updateGUI', {
			type: 'item_remove',
			target: this.player
		});
		this.player.weapon = null;
	};

	this.attack = function () {
		switch(type) {
			case Weapon.Types.RANGE:
				break;
			case Weapon.Types.CONTACT:
				break;
			case Weapon.Types.DROP:
				this.player._world.add(Physics.body('drop-weapon', {
					x: this.player.state.pos.x + this.player.orientation * 65,
					y: this.player.state.pos.y,
					image: image,
					power: power,
					stun: stun
				}));
				break;
		}

		// widthdraw ammo
		if (this.ammo > 0) {
			this.ammo--;
		}

		// check if still have ammo
		if (this.ammo == 0) {
			this.unequip();
		} else if (this.ammo > 0) {
			this.player._world.emit('updateGUI', {
				type: 'item_update',
				target: this.player
			});
		}
	};
}
Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.Types = {
	RANGE: 0,
	CONTACT: 1,
	DROP: 2,
	THROW: 3
};
