var renderer;

function configureWorld( world, game, map ) {

	// setup viewport
	var viewport = {
    el: 'viewport',
    width: window.innerWidth,
    height: window.innerHeight
	};
	world.viewport = viewport;

	// setup renderer
	renderer = Physics.renderer( 'pixi', viewport );
	world.add( renderer );

	// add borders
	var viewportBounds = Physics.aabb( -100, -100, viewport.width + 200, viewport.height + 200 );
	var borderBehaviour = Physics.behavior( 'border-behaviour', {
      aabb: viewportBounds
  } );
  world.add( borderBehaviour );

	// resize window events
  window.addEventListener( 'resize', function () {
      renderer.el.width = window.innerWidth;
      renderer.el.height = window.innerHeight;
      viewportBounds = Physics.aabb( -100, -100, window.innerWidth + 200, window.innerHeight + 200 );
      borderBehaviour.setAABB( viewportBounds );
  }, true);

  // create map
  var mapElements = new Map( map.id, viewport );
  world.add( mapElements );
  world.map = map;

	// ensure objects bounce when edge collision is detected
	world.add( Physics.behavior( 'body-impulse-response' ) );

	// add collisions
	world.add( Physics.behavior( 'body-collision-detection' ) );
	world.add( Physics.behavior( 'sweep-prune' ) );

	// add gravity
	var gravity = Physics.behavior( 'constant-acceleration', {
  	acc: { x: 0, y: 0.0004 }
  });
  world.add( gravity );

  // subscribe to events coming from logic side
	world.on( 'repopPlayer', game.repopPlayer );
	world.on( 'death', game.checkVictory );
	world.on( 'updateGUI', game.updateGUI );
	world.on( 'points', game.winPoints );
	world.on( 'removeBody', function( body ) {
		try {
			renderer.stage.removeChild( ( body.view != null ? body.view : body ) );
		} catch ( e ) {
		}
		world.removeBody( body );
	});

	// load assets
	var spritesToLoad = [],
		character;

	for ( var i in Game.CHARACTERS ) {
		character = Game.CHARACTERS[i];
		spritesToLoad.push( Game.IMAGES_PATH + character + '.png' );
		spritesToLoad.push( Game.IMAGES_PATH + character + '_2.png' );
	}
	spritesToLoad.push( Game.IMAGES_PATH + 'slash.png' );
	renderer.loadSpriteSheets( spritesToLoad, game.onLoaded );

	// subscribe to ticker to advance the simulation
	Physics.util.ticker.on(function( time, dt ) {
    world.step( time );
	}).start();

	// game loop
	world.on( 'step', function( time ) {
		TWEEN.update();
		game.update();
    world.render();
	});
	
}
