class RouteProducts {

    constructor(payload) {
        this.nationalExpress = payload.nationalExpress;
        this.national = payload.national;
        this.regionalExp = payload.regionalExp;
        this.regional = payload.regional;
        this.suburban = payload.suburban;
        this.bus = payload.bus;
        this.ferry = payload.ferry;
        this.subway = payload.subway;
        this.tram = payload.tram;
        this.taxi = payload.taxi;
    }

}

module.exports = RouteProducts;
