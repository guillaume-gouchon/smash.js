/**
*		Class which contains all the commands information sent to the game (player id, button states, etc...).
*		Must be compliant with W3C GamePad API (https://dvcs.w3.org/hg/gamepad/raw-file/default/gamepad.html)
*/
function Controller( playerId ) {

	this.pId = playerId;

	/**
	*		Axis
	*/
	this.axes = [0.0, 0.0];

	/**
	*		Buttons
	*/
	this.buttons = [new GamepadButton(), new GamepadButton(), new GamepadButton(), new GamepadButton()];
}

Controller.prototype.updateAxisState = function( axis, value ) {
	if ( this.axes[axis] == value ) {
		return false;
	} else {
		this.axes[axis] = value;
		return true;
	}
};

Controller.prototype.updateButtonState = function( button, pressed ) {
	var needsUpdate = this.buttons[button].updateState( pressed );
	return needsUpdate;
};

Controller.prototype.releaseAllAxes = function() {
	var needsUpdate = this.axes[0] != 0.0 || this.axes[1] != 0.0;
	this.axes = [0.0, 0.0];
	return needsUpdate;
}

Controller.prototype.releaseAllButtons = function() {
	for ( var i in this.buttons ) {
		this.buttons[i].updateState( false );
	}
}

Controller.prototype.toJSON = function() {
	return {
		pId: this.pId,
		axes: this.axes,
		buttons: this.buttons
	}
};


/**
*		Maps the different buttons to their indexes in the GamePad API object.
*/
Controller.Buttons = {
	AXIS_HORIZONTAL: 0,
	AXIS_VERTICAL: 1,
	A: 0,
	B: 1,
	X: 2,
	Y: 3
};
