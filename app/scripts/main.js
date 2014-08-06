$(function () {

	Physics(function (world) {
		var game = new Game(world);

		initWorld(world, game, Map.MAP_TYPES.standard);

		$('#startGame').click(game.start);
		$('#replay').click(game.start);

		$('#switchMode').click(function () {
			var map = world.map.id == Map.MAP_TYPES.flag.id ? Map.MAP_TYPES.standard : Map.MAP_TYPES.flag;
			$('#switchMode').html(map.id == Map.MAP_TYPES.flag.id ? 'Switch to Battle mode' : 'Switch to Capture the Flag mode');
			
			world.pause();

			// reset world
			world.remove(world.getBodies());
      // world.remove(world.getBehaviors());
      while (renderer.stage.children.length > 0) {
      	renderer.stage.removeChild(renderer.stage.children[0]);
      }

      // create new map
		  var mapElements = new Map(map.id, world.viewport);
		  world.add(mapElements);
		  world.map = map;

      game.reset();

			world.unpause();
		});
	});

});
