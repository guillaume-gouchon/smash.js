
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
		new Weapon('land-mine.png', Weapon.Types.DROP, 80, 500, 3),
		new Weapon('axe.png', Weapon.Types.CONTACT, 60, 200, null, 'slash_axe'),
		new Weapon('trefoil-shuriken.png', Weapon.Types.THROW, 70, 400, 7, 'explosive', 3000),
		new Weapon('bomb.png', Weapon.Types.THROW, 25, 500, 5, 'bomb', 1000),
		new Weapon('flash-grenade.png', Weapon.Types.THROW, 5, 3000, 3, 'bomb', 1500),
		new Weapon('pistol.png', Weapon.Types.GUN, 15, 300, 20),
		new Weapon('bolter-gun.png', Weapon.Types.GUN, 15, 100, 35, 'bolter'),
		new Weapon('minigun.png', Weapon.Types.GUN, 25, 80, 100),
	];
	return items[parseInt((items.length - 1) * Math.random())];
	// return items[6];
};

Item.getBaseWeapon = function () {
	return new Weapon(null, Weapon.Types.CONTACT, 30, 100, null, 'slash');
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
				player.jumpSkill *= 1.2;
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
function Weapon (image, type, power, stun, ammo, extra, extra2) {
	Item.call(this, Item.Types.WEAPON, image);

	this.player = null;
	this.ammo = ammo;

	this.equip = function (player) {
		this.player = player;
		if (this.player.weapon) {
			this.player.weapon.unequip(this.player);
		}
		this.player.weapon = this;
		if (this.image) {
			this.player._world.emit('updateGUI', {
				type: 'item_add',
				target: this.player
			});
		}
	};

	this.unequip = function () {
		this.player._world.emit('updateGUI', {
			type: 'item_remove',
			target: this.player
		});
		this.player.weapon = Item.baseWeapon;
	};

	this.attack = function (attackPower) {
		switch(type) {
			case Weapon.Types.GUN:
				var world = this.player._world;
        var pos = this.player.state.pos;
        var bullet = Physics.body('bullet', {
          x: pos.get(0),
          y: pos.get(1),
          image: 'bullet.png',
          power: power,
          stun: stun,
					gameType: extra
        });
        bullet.state.pos.set(pos.get(0) + this.player.orientation * 40, pos.get(1) - 6);
        bullet.state.vel.set(this.player.orientation * 3, 0);

        setTimeout(function () {
          bullet.explode();
        }, 500);
        world.add(bullet);

        // animate fire
        var anim = PIXI.Sprite.fromImage("images/muzzle.png");
	      anim.alpha = 0.8;
	      anim.anchor = {
	        x: 0.5,
	        y: 0.5
	      };
	      anim.x = this.player.state.pos.x + this.player.orientation * 35;
	      anim.y = this.player.state.pos.y - 6;
	      anim.rotation = this.player.orientation > 0 ? Math.PI : 0;
	      world._renderer.stage.addChild(anim);
	      
	      var tween = new TWEEN.Tween( { x: 0, y: 0 } )
	        .to( { x: 1, y: 1 }, 100)
	        .onUpdate(function () {
	            anim.scale.x = this.x;
	            anim.scale.y = this.y;
	        })
	        .onComplete(function () {
	          world.emit('removeBody', anim);
	        })
	        .start();
				break;
			case Weapon.Types.CONTACT:
				var slash = Physics.body('contact-weapon', {
			    x: this.player.state.pos.x + this.player.orientation * 33,
			    y: this.player.state.pos.y,
			    image: extra + (this.player.orientation > 0 ? '.png' : '_l.png'),
			    power: power,
			    stun: stun,
			    player: this.player
				});
				slash.view.alpha = 0.9;
				var world = this.player._world;
				world.add(slash);
				setTimeout(function () {
					world.emit('removeBody', slash);
				}, 20);
				break;
			case Weapon.Types.DROP:
				this.player._world.add(Physics.body('drop-weapon', {
					x: this.player.state.pos.x + this.player.orientation * 55,
					y: this.player.state.pos.y,
					vx: this.player.orientation * attackPower * 0.1,
					vy: - 0.1 * attackPower,
					image: image,
					power: power,
					stun: stun
				}));
				break;
			case Weapon.Types.THROW:
			  var world = this.player._world;
        var pos = this.player.state.pos;
        var scratch = Physics.scratchpad();
        var rnd = scratch.vector();
        rnd.set(this.player.orientation * 40, -0.7 * 40);        

        var throwingWeapon = Physics.body('throw-weapon', {
          x: pos.get(0),
          y: pos.get(1),
          image: image,
          power: power,
          stun: stun,
					gameType: extra
        });
        throwingWeapon.state.pos.set(pos.get(0) + rnd.get(0), pos.get(1) + rnd.get(1));
        throwingWeapon.state.vel.set(this.player.orientation * attackPower * 1.5, - 0.2 * attackPower);
        throwingWeapon.state.angular.vel = (Math.random() - 0.5) * 0.06;

        setTimeout(function () {
          throwingWeapon.explode();
        }, extra2);
        world.add(throwingWeapon);
        scratch.done();
			break;
		}

		// consume ammo
		if (this.ammo) {
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
	GUN: 0,
	CONTACT: 1,
	DROP: 2,
	THROW: 3
};
