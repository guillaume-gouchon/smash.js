function getMassColor(percentage) {
	if (percentage < 40) {
		return 'high';
	} else if (percentage < 80) {
		return 'medium';
	} else if (percentage < 120) {
		return 'low';
	} else {
		return 'lowest';
	}
}

var DEFAULT_TEAM_COLORS = ['red', 'blue', 'green', 'yellow'];

function createPlayerElement(player) {
	return '<div class="player ' + DEFAULT_TEAM_COLORS[player.team] + '" data-id="' + player.id + '">'
        + '<img src="images/character.png"/>'
        + '<img src="images/character.png"/>'
        + '<img src="images/character.png"/>'
        + '<strong class="name">' + player.name + '</strong>'
        + '<strong class="mass ' + getMassColor(getMassPercent(player.mass)) + '">' + getMassPercent(player.mass) + '%</strong>'
      + '</div>';
}

function getMassPercent(mass) {
	return Math.round(1 / mass - 1);
}

function getPlayerElement(playerId) {
	return $('#players .player[data-id="' + playerId + '"');
}

// TODO : refactor
var GUI = {

	addPlayer: function (player) {
		$('#players').append(createPlayerElement(player));
	},

	updateLife: function (player) {
		var playerElement = getPlayerElement(player.id);

		// animate UI
		playerElement.addClass('loseLife');
		setTimeout(function () {
			playerElement.removeClass('loseLife');
		}, 500);

		if (player.life == 0) {
			// player has lost
			$('img', playerElement).addClass('invisible');
			playerElement.addClass('defeat');
		} else {
			$('img', playerElement).removeClass('invisible');
			$('img:gt(' + (player.life - 1) + ')', playerElement).addClass('invisible');
		}
	},

	updateMass: function (player) {
		var playerElement = getPlayerElement(player.id);
		var massElement = $('.mass', playerElement);
		var percent = getMassPercent(player.mass);
		massElement.html(percent + '%');
		massElement.removeClass('lowest low medium high');
		massElement.addClass(getMassColor(percent));
	},

	updateTeam: function (player) {
		var playerElement = getPlayerElement(player.id);
		var nameElement = $('.name', playerElement);
		nameElement.removeClass('blue red green yellow');
		nameElement.addClass(DEFAULT_TEAM_COLORS[player.team]);
	},

	showRoundStart: function (callback) {
		roundStartAnimation(['Round starts in', '3', '2', '1', 'GO !'], 800, 200, callback);
	},

	showVictory: function (player) {
		var victory = $('#victory');
		$('#victory span').html(player.name).removeClass('blue red green yellow').addClass(DEFAULT_TEAM_COLORS[player.team]);
		victory.removeClass('hide');
	}

};

function roundStartAnimation(labels, duration, delay, callback) {
	var message = $('#message');
	message.removeClass('hide');
	message.removeClass('grow');
	setTimeout(function () {
		if (labels.length == 0) {
			message.addClass('hide');
		} else {
			message.html(labels[0]).addClass('grow');
			labels.splice(0, 1);
			if (labels.length == 0) {
				callback();
			}
			setTimeout(function () {
				roundStartAnimation(labels, duration, delay, callback);
			}, duration);
		}
	}, delay);
}
