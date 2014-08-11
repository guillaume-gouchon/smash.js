$(function () {

	Physics(function (world) {
		var game = new Game(world);

		configureWorld(world, game, Map.MAP_TYPES.STANDARD);

		// setup UI interactions
		$('#startGame').click(game.start);
		$('#replay').click(game.start);
		$('#switchMode').click(game.changeMap);
	});

});
