$(function () {

	Physics(function (world) {
		var game = new Game(world);

		initWorld(world, game, Map.MAP_TYPES.standard);

		$('#startGame').click(game.start);
		$('#replay').click(game.start);
	});

});
