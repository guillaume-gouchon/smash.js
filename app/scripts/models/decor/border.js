Physics.behavior( 'border-behaviour', 'edge-collision-detection', function( parent ) {

  return {

    init: function( options ) {
    	var defaults = {
    		channel: 'border-collisions:detected',
				restitution: 0,
	      cof: 0
    	};

      parent.init.call( this, $.extend( {}, defaults, options ) );
    },

    connect: function( world ) {
    	world.on( 'integrate:velocities', this.checkAll, this );
      world.on( 'border-collisions:detected', this.checkCollisions, this );
    },

    disconnect: function( world ) {
    	world.off( 'integrate:velocities', this.checkAll );
      world.off( 'border-collisions:detected', this.checkCollisions );
    },

    checkCollisions: function( data ) {
    	var self = this,
      world = self._world,
      collisions = data.collisions,
      col,
      element,
      l = collisions.length;

      for ( var i = 0; i < l; ++i ) {
        col = collisions[i];
        element = col.bodyA.gameType != null ? col.bodyA : col.bodyB;
        switch ( element.gameType ) {
          case 'player':
            element.die();
            break;
          case 'flag':
            element.reset();
            break;
          default:
            world.emit( 'removeBody', element );
            break;
        }
      }
    }

  };

});
