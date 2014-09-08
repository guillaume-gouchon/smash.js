function Item( type, image ) {
	this.type = type;
	this.image = image;	
}

Item.Types = {
	WEAPON: 0,
	BUFF: 1
};

Item.pickRandomItem = function () {
	var items = [
		new Buff( 0, 'shield.png' ),
		new Buff( 1, 'feather.png' ),
		new Buff( 2, 'medical-pack.png' ),
		new Buff( 3, 'muscle-up.png' ),
		new Weapon( 'wolf-trap.png', Weapon.Types.DROP, 30, 1000, 2 ),
		new Weapon( 'land-mine.png', Weapon.Types.DROP, 80, 500, 3 ),
		new Weapon( 'axe.png', Weapon.Types.CONTACT, 60, 200, null, 0xFF0000 ),
		new Weapon( 'trefoil-shuriken.png', Weapon.Types.THROW, 70, 400, 7, 'explosive', 3000 ),
		new Weapon( 'bomb.png', Weapon.Types.THROW, 25, 500, 5, 'bomb', 1000 ),
		new Weapon( 'flash-grenade.png', Weapon.Types.THROW, 5, 3000, 3, 'bomb', 1500 ),
		new Weapon( 'pistol.png', Weapon.Types.GUN, 15, 300, 20 ),
		new Weapon( 'bolter-gun.png', Weapon.Types.GUN, 15, 100, 10, 'bolter' ),
		new Weapon( 'minigun.png', Weapon.Types.GUN, 25, 80, 40 ),
	];
	return items[parseInt( items.length * Math.random() )];
	// return items[6];
};

Item.buildBaseWeapon = function () {
	return new Weapon( null, Weapon.Types.CONTACT, 30, 100, null, 0xFFFFFF );
};

Item.explode = function ( body, nbFragments, fragmentRadius, fragmentMass, fragmentSpeed, duration ) {
	var world = body._world;
  if ( !world ) {
    return;
  }

  var pos = body.state.pos,
    n = nbFragments,
    r = fragmentRadius,
    mass = fragmentMass,
    d,
    width,
    height,
    debris = [];

  // create debris
  while ( n-- ) {
    width = r * Math.random();
    height = r * Math.random();
    d = Physics.body( 'convex-polygon', {
        gameType: 'damage',
        x: pos.get( 0 ),
        y: pos.get( 1 ),
        vx: fragmentSpeed * ( Math.random() - 0.5 ),
        vy: fragmentSpeed * ( Math.random() - 0.5 ),
        vertices: [
          {x: 0, y: 0},
          {x: width, y: 0},
          {x: width, y: height},
          {x: 0, y: height}
        ],
        mass: mass,
        restitution: 0.9,
        styles: {
          lineWidth: 3,
          strokeStyle: 0xFF8E0D,
          fillStyle: 0xff0000
        },
        power: body.power,
        stun: body.stun
    });
    debris.push( d );
  }

  setTimeout(function() {
    if ( world && debris ) {
      for ( var i = 0, l = debris.length; i < l; ++i ) {
        world.emit( 'removeBody', debris[i] );
      }
      debris = undefined;
    }
  }, duration);

  world.add( debris );
  world.emit( 'removeBody', body );
};
