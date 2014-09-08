Physics.body( 'contact-weapon', 'rectangle', function( parent ) {

  return {
    
    init: function( options ) {
      var defaults = {
      	treatment: 'kinematic',
        gameType: 'damage',
        width: 30,
        height: 30,
        restitution: 1.0,
        mass: 1,
        cof: 1.0
      };

      parent.init.call( this, $.extend( {}, defaults, options ) );

      this.view = renderer.createDisplay( 'sprite', {
        texture: Game.IMAGES_PATH + 'slash.png',
        anchor: {
          x: 0.5,
          y: 0.5
        }
      });
      this.view.scale.x = this.player.orientation > 0 ? 1 : -1;
      this.view.tint = options.tint;
      this.view.alpha = 0.9;
    }

  };

});
