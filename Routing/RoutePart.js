const RouteStop = require("./RouteStop.js");
const RouteLine = require("./RouteLine.js");

class RoutePart {

	constructor(payload) {
		this.origin = new RouteStop(payload.origin);
		this.destination = new RouteStop(payload.destination);
		this.arrival = payload.arrival;
		this.plannedArrival = payload.plannedArrival;
		this.arrivalDelay = payload.arrivalDelay;
		this.departure = payload.departure;
		this.plannedDeparture = payload.plannedDeparture;
		this.reachble = payload.reachble;
		this.tripId = payload.tripId;
		this.line = (payload.line) ? new RouteLine(payload.line) : null;
		this.direction = payload.direction;
		this.arrivalPlatform = payload.arrivalPlatform;
		this.plannedArrivalPlatform = payload.plannedArrivalPlatform;
		this.departurePlatform = payload.departurePlatform;
		this.plannedDeparturePlatform = payload.plannedDeparturePlatform;
	}

}

module.exports = RoutePart;
