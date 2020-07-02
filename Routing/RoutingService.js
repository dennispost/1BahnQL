const Route = require("./Route.js");
const createHafas = require('db-hafas');
const hafas = createHafas('routing-service');

class RoutingService {

	routes(from, to, departure, arrival) {
		let opt = {
			results: 10,
		};
		if(departure) {
			opt.departure = new Date(departure);
		}
		if(arrival) {
			opt.arrival = new Date(arrival);
		}
		return hafas.journeys(from + "", to + "", opt)
			.then(result => result.journeys.map(element => new Route(element)));
	}

}

module.exports = RoutingService;
