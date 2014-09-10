function Weapon( image, type, power, stun, ammo, extra, extra2 ) {
	Item.call( this, Item.Types.WEAPON, image );

	this.player = null;
	this.weaponType = type;
	this.ammo = ammo;
	this.power = power;
	this.stun = stun;
	this.ammo = ammo;
	this.extra = extra;
	this.extra2 = extra2;
}

Weapon.prototype = Object.create( Item.prototype );
Weapon.prototype.constructor = Weapon;

Weapon.prototype.attack = function( attackPower ) {
	switch( this.weaponType ) {
		case Weapon.Types.GUN:
			var world = this.player._world,
	      pos = this.player.state.pos,
	      bullet = Physics.body( 'bullet', {
	        image: 'bullet.png',
	        power: this.power,
	        stun: this.stun,
					gameType: this.extra,
					player: this.player
	      });

      bullet.state.pos.set( pos.get( 0 ) + this.player.orientation * 40, pos.get( 1 ) - 6 );
      bullet.state.vel.set( this.player.orientation * 3, 0 );

      setTimeout(function () {
        bullet.explode();
      }, 500);
      world.add( bullet );

      // animate fire
      var anim = PIXI.Sprite.fromImage( Game.IMAGES_PATH + 'muzzle.png' );
      anim.alpha = 0.8;
      anim.anchor = {
        x: 0.5,
        y: 0.5
      };
      anim.x = this.player.state.pos.x + this.player.orientation * 35;
      anim.y = this.player.state.pos.y - 6;
      anim.rotation = this.player.orientation > 0 ? Math.PI : 0;
      world._renderer.stage.addChild( anim );
      
      var tween = new TWEEN.Tween( { x: 0, y: 0 } )
        .to( { x: 1, y: 1 }, 100 )
        .onUpdate(function () {
            anim.scale.x = this.x;
            anim.scale.y = this.y;
        })
        .onComplete(function () {
          world.emit( 'removeBody', anim );
        })
        .start();
			break;

		case Weapon.Types.CONTACT:
			var world = this.player._world,
				slash = Physics.body( 'contact-weapon', {
			    x: this.player.state.pos.x + this.player.orientation * 33,
			    y: this.player.state.pos.y,
			    power: this.power,
			    stun: this.stun,
			    player: this.player,
			    tint: this.extra
				});

			world.add( slash );
			setTimeout(function () {
				world.emit( 'removeBody', slash );
			}, 20);
			break;

		case Weapon.Types.DROP:
			this.player._world.add( Physics.body( 'drop-weapon', {
				x: this.player.state.pos.x + this.player.orientation * 55,
				y: this.player.state.pos.y,
				vx: this.player.orientation * attackPower * 0.1,
				vy: - 0.1 * attackPower,
				image: this.image,
				power: this.power,
				stun: this.stun,
				player: this.player
			}));
			break;

		case Weapon.Types.THROW:
		  var world = this.player._world,
	      pos = this.player.state.pos,
	      scratch = Physics.scratchpad(),
	      rnd = scratch.vector();

      rnd.set( this.player.orientation * 40, -0.7 * 40 );        

      var throwingWeapon = Physics.body( 'throw-weapon', {
        image: this.image,
        power: this.power,
        stun: this.stun,
				gameType: this.extra,
				player: this.player
      });
      throwingWeapon.state.pos.set( pos.get( 0 ) + rnd.get( 0 ), pos.get( 1 ) + rnd.get( 1 ) );
      throwingWeapon.state.vel.set( this.player.orientation * attackPower * 1.2, - 0.16 * attackPower );
      throwingWeapon.state.angular.vel = ( Math.random() - 0.5 ) * 0.06;

      setTimeout(function () {
        throwingWeapon.explode();
      }, this.extra2);
      world.add( throwingWeapon );
      scratch.done();
		break;
	}

	// consume ammo
	if ( this.ammo ) {
		this.ammo--;
	}

	// check if player still has some ammo left
	if ( this.ammo == 0 ) {
		this.player.equip( Item.buildBaseWeapon() );
	} else if ( this.ammo > 0 ) {
		this.player._world.emit( 'updateGUI', {
			type: 'item_update',
			target: this.player
		});
	}
};

Weapon.Types = {
	GUN: 0,
	CONTACT: 1,
	DROP: 2,
	THROW: 3
};
