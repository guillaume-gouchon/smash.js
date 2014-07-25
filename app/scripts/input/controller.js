/**
*		Class which contains all the commands information sent to the game (player id, button states, etc...).
*		Must be compliant with W3C GamePad API (https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html)
*/
function Controller(playerId) {

	this.pId = playerId;

	/**
	*		Axis
	*/
	this.axes = [0.0, 0.0];

	/**
	*		Buttons
	*/
	var buttons = [new GamepadButton(), new GamepadButton(), new GamepadButton(), new GamepadButton()];

	this.updateAxisState = function (axis, value) {
		if (this.axes[axis] == value) {
			return false;
		} else {
			this.axes[axis] = value;
			return true;
		}
	};

	this.updateButtonState = function (button, pressed) {
		var needsUpdate = buttons[button].updateState(pressed);
		return needsUpdate;
	};

	this.releaseAllAxes = function () {
		var needsUpdate = this.axes[0] != 0.0 || this.axes[1] != 0.0;
		this.axes = [0.0, 0.0];
		return needsUpdate;
	}

	this.releaseAllButtons = function () {
		for (var i in buttons) {
			buttons[i].updateState(false);
		}
	}

	this.toJSON = function () {
		return {
			pId: this.pId,
			axes: this.axes,
			buttons: buttons
		}
	};

}


/**
*		Represents a Gamepad button
*/
function GamepadButton () {

	this.pressed = false;
	this.value = 0.0;

	this.updateState = function (isPressed) {
		if (isPressed == this.pressed) { 
			return false;
		} else {
			this.pressed = isPressed;
			this.value = isPressed ? 1.0 : 0.0;
			return true;
		}
	}

}


/**
*		Maps the different inputs to their indexes in the GamePad API object.
*/
Controller.BUTTONS_MAP = {
	axisHorizontal: 0,
	axisVertical: 1,
	A: 0,
	B: 1,
	X: 2,
	Y: 3
};
