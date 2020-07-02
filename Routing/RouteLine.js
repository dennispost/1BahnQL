class RouteLine {

    constructor(payload) {
        this.type = payload.type;
        this.id = payload.id;
        this.fahrtNr = payload.fahrtNr;
        this.name = payload.name;
        this.public = payload.public;
        this.adminCode = payload.adminCode;
        this.mode = payload.mode;
        this.product = payload.product;
        this.additionalName = payload.additionalName;
    }

}

module.exports = RouteLine;
