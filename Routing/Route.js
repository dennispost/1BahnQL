const RoutePart = require("./RoutePart.js");

class Route {

	constructor(data) {
		this.parts = data.legs.map(element => new RoutePart(element));
	}

}

module.exports = Route;
