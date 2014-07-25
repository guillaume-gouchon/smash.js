function Map (mapType, viewport) {

	var addPlatform = function (x, y, w, h) {
		elements.push(Physics.body('platform', {
	    x: x,
	    y: y,
	    width: w,
	    height: h
	  }));
	};

	var addBridge = function (x, y, w, h) {
		elements.push(Physics.body('bridge', {
	    x: x,
	    y: y,
	    width: w,
	    height: h
	  }));
	};

	var addMovingBridge = function (x, y, w, h, min, max, orientation, speed) {
		var element = Physics.body('movingBridge', {
	    x: x,
	    y: y,
	    width: w,
	    height: h,
	    min: min,
	    max: max,
	    orientation: orientation,
	    speed: speed
	  });
		elements.push(Physics.behavior('platform-moving', { platform: element }));
    elements.push(element);
	};

	var elements = [];

	switch (mapType) {
		case Map.MAP_TYPES.standard:
			addPlatform(viewport.width / 2, viewport.height / 2 + 195, 700, 140);
			addBridge(viewport.width / 2 - 200, viewport.height / 2, 200, 50);
			addBridge(viewport.width / 2 + 200, viewport.height / 2, 200, 50);
			addMovingBridge(viewport.width / 2, viewport.height / 2 -125, 200, 50, -100, 100, 0, 0.07);
			break;
	}

	return elements;
}

Map.MAP_TYPES = {
	standard: 0
};
