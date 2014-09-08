Physics.body( 'moving-bridge', 'bridge', function( parent ) {

  var iX,// initial positions
    iY;

  return {

    init: function( options ) {
      options.treatment = 'kinematic';
      iX = options.x;
      iY = options.y;

      parent.init.call( this, options );

      // initiate movement
      switch ( this.orientation ) {
        case Map.Orientations.HORIZONTAL:
          this.state.vel.x = this.speed;
          break;
        case Map.Orientations.VERTICAL:
          this.state.vel.y = this.speed;
          break;
      }     
    },

    move: function() {
      switch ( this.orientation ) {
        case Map.Orientations.HORIZONTAL:
          if ( this.state.pos.x > this.max + iX ) {
            this.state.vel.x = -this.speed;
          } else if ( this.state.pos.x < this.min + iX ) {
            this.state.vel.x = this.speed;
          }
          break;
        case Map.Orientations.VERTICAL:
          if ( this.state.pos.y > this.max + iY ) {
            this.state.vel.y = -this.speed;
          } else if ( this.state.pos.y < this.min + iY ) {
            this.state.vel.y = this.speed;
          }
          break;
      }
    }

  };
  
});

Physics.behavior( 'moving-bridge', function( parent ) {

  return {

    init: function( options ) {
      parent.init.call( this, options );
      this.bridge = options.bridge;
    },

    behave: function( data ) {
      this.bridge.move();
    }

  };

});
