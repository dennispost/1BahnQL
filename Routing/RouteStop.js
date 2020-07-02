const RouteLocation = require("./RouteLocation.js");
const RouteProducts = require("./RouteProducts.js");

class RouteStop {

    constructor(payload) {
        this.type = payload.type;
        this.id = payload.id;
        this.name = payload.name;
        this.location = new RouteLocation(payload.location);
        this.products = new RouteProducts(payload.products);
    }

}

module.exports = RouteStop;
