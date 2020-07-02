class RouteLocation {

    constructor(payload) {
        this.type = payload.type;
        this.id = payload.id;
        this.latitude = payload.latitude;
        this.longitude = payload.longitude;
    }

}

module.exports = RouteLocation;
