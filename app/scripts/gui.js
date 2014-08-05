function GUI () {

	var DEFAULT_TEAM_COLORS = ['red', 'yellow', 'green', 'blue'];

	var getDamageColor = function (damage) {
		if (damage < 70) {
			return 'high';
		} else if (damage < 140) {
			return 'medium';
		} else if (damage < 210) {
			return 'low';
		} else {
			return 'lowest';
		}
	};

	var createPlayerElement = function (player) {
		var s = '<div class="player ' + DEFAULT_TEAM_COLORS[player.team] + ' grow" data-id="' + player.id + '">';
		for (var i = 0; i < player.life; i++) {
			s += '<img src="images/' + player.character + '.png"/>';
		}
	  s += '<strong class="name">' + player.name + '</strong>'
      + '<strong class="damage ' + getDamageColor(player.damage) + '">' + player.damage + '%</strong>'
      + '<div class="items invisible"></div>'
    + '</div>';
    return s;
	};

	var getPlayerElement = function (playerId) {
		return $('#players .player[data-id="' + playerId + '"]');
	};

	var roundStartAnimation = function (labels, duration, delay, callback) {
		var message = $('#message');
		message.removeClass('hide');
		message.removeClass('grow');
		setTimeout(function () {
			if (labels.length == 0) {
				message.addClass('hide');
				message.html('');
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
	};

	this.addPlayer = function (player) {
		$('#players').append(createPlayerElement(player));
		setTimeout(function () {
			getPlayerElement(player.id).removeClass('grow');
		}, 100);
	};

	this.removePlayer = function (playerId) {
		getPlayerElement(playerId).addClass('shrink');
		setTimeout(function () {
			getPlayerElement(playerId)[0].remove();
		}, 300);
	};

	this.updateLife = function (player, isReset) {
		var playerElement = getPlayerElement(player.id);

		// animate UI
		if (!isReset) {
			playerElement.addClass('loseLife');
			setTimeout(function () {
				playerElement.removeClass('loseLife');
			}, 500);
		}

		if (player.life == 0) {
			// player has lost
			$('img', playerElement).addClass('invisible');
			playerElement.addClass('dead');
		} else {
			playerElement.removeClass('dead');
			$('img', playerElement).removeClass('invisible');
			$('img:gt(' + (player.life - 1) + ')', playerElement).addClass('invisible');
		}
	};

	this.updateDamage = function (player) {
		var playerElement = getPlayerElement(player.id);
		var massElement = $('.damage', playerElement);
		massElement.html(player.damage + '%');
		massElement.removeClass('lowest low medium high');
		massElement.addClass(getDamageColor(player.damage));
	};

	this.updateTeam = function (player) {
		var playerElement = getPlayerElement(player.id);
		var nameElement = $('.name', playerElement);
		nameElement.removeClass('blue red green yellow');
		nameElement.addClass(DEFAULT_TEAM_COLORS[player.team]);
	};

	this.showRoundStart = function (callback) {
		roundStartAnimation(['Round starts in', '3', '2', '1', 'GO !'], 700, 200, callback);
	};

	this.showVictory = function (player) {
		var victory = $('#victory');
		$('#victory span').html(player.name).removeClass('blue red green yellow').addClass(DEFAULT_TEAM_COLORS[player.team]);
		victory.removeClass('hide');
	};

	this.hideLoading = function () {
		$('#loading').addClass('invisible')
		setTimeout(function () {
			$('#loading').addClass('hide');
		}, 500);
	};

	this.addItem = function (player) {
		var weapon = player.weapon;
		$('.items', getPlayerElement(player.id)).addClass('invisible').html('<img src="images/items/' + weapon.image + '"/>');//.attr('data-content', weapon.ammo);
		setTimeout(function () {
			$('.items', getPlayerElement(player.id)).removeClass('invisible');
		}, 100);
	};

	this.updateItem = function (player) {
		// var weapon = player.weapon;
		// $('.items', getPlayerElement(player.id)).attr('data-content', weapon.ammo);
	};

	this.removeItem = function (player) {
		$('.items', getPlayerElement(player.id)).html('');//.attr('data-content', '');
	};

}
