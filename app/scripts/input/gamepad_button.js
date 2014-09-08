/**
*		Represents a Gamepad button
*/
function GamepadButton() {
	this.pressed = false;
	this.value = 0.0;
}

GamepadButton.prototype.updateState = function( isPressed ) {
	if ( isPressed === this.pressed ) { 
		return false;
	} else {
		this.pressed = isPressed;
		this.value = isPressed ? 1.0 : 0.0;
		return true;
	}
};
