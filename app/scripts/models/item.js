
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

Item.Items = [
	new Buff(0, 'aura.png'),
	new Buff(1, 'feather.png'),
	new Buff(2, 'medical-pack.png'),
	new Buff(3, 'muscle-up.png'),
];

Item.pickRandomItem = function () {
	return Item.Items[3];
};


/**
* Buff class
*/
function Buff (id, image) {
	Item.call(this, Item.Types.BUFF, image);

	this.applyBuff = function (player) {
		switch (id) {
			case 0:
				//TODO add protective shield
				player.buff = this;
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
function Weapon (image, type, power, ammo) {
	Item.call(this, Item.Types.WEAPON, image);



	this.attack = function () {

	};
}
Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.Types = {
	RANGE: 0,
	CONTACT: 1,
	DROP: 2
};
