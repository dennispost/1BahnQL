const { GraphQLDateTime } = require('graphql-iso-date');
const { makeExecutableSchema } = require('graphql-tools');
const experimental = process.env.experimental;

const experimentalTypes = experimental ? `
type Route {
  parts: [RoutePart!]!
}

type RoutePart {
  origin: RouteStop!
  destination: RouteStop!
  arrival: String
  plannedArrival: String
  arrivalDelay: String
  departure: String
  plannedDeparture: String
  reachble: Boolean!
  tripId: Int!
  line: RouteLine
  direction: String
  arrivalPlatform: String
  plannedArrivalPlatform: String
  departurePlatform: String
  plannedDeparturePlatform: String
}

type RouteStop {
    type: String!
    id: String!
    name: String!
    location: RouteLocation!
    products: RouteProducts!
}

type RouteLocation {
    type: String!
    id: Int!
    latitude: Float!
    longitude: Float!
}

type RouteProducts {
    nationalExpress: Boolean!
    national: Boolean!
    regionalExp: Boolean!
    regional: Boolean!
    suburban: Boolean!
    bus: Boolean!
    ferry: Boolean!
    subway: Boolean!
    tram: Boolean!
    taxi: Boolean!
}

type RouteLine {
    type: String!
    id: String!
    fahrtNr: Int!
    name: String!
    adminCode: String!
    mode: String!
    product: String!
    additionalName: String
}

type Product {
  name: String
  class: Int
  productCode: Int
  productName: String
}

type HafasStation {
    type: String!
    id: Int!
    name: String!
    location: Location!
}
` : '';

const experimentalScalars = experimental ? `
  scalar DateTime
` : '';

const experimentalQuerys = experimental ? `
  routing(from: Int!, to: Int!, departure: DateTime, arrival: DateTime): [Route!]!
` : '';

const schemaString = `
  ${experimentalScalars}
  type Query {
    ${experimentalQuerys}

    stationWithEvaId(evaId: Int!): Station
    stationWithStationNumber(stationNumber: Int!): Station
    stationWithRill100(rill100: String!): Station

    search(searchTerm: String): Searchable!
    nearby(latitude: Float!, longitude: Float!, radius: Int = 10000): Nearby!
    parkingSpace(id: Int): ParkingSpace
  }

  ${experimentalTypes}

  type Searchable {
	  stations: [Station!]!
    operationLocations: [OperationLocation!]!
  }

  type OperationLocation {
    id: String
    abbrev: String!
    name: String!
    shortName: String!
    type: String!
    status: String
    locationCode: String
    UIC: String!
    regionId: String
    validFrom: String!
    validTill: String
    timeTableRelevant: Boolean
    borderStation: Boolean
  }
  type Station {
	  primaryEvaId: Int
	  stationNumber: Int
	  primaryRil100: String
	  name: String!
	  location: Location
	  category: Int!
    priceCategory: Int!
	  hasParking: Boolean!
	  hasBicycleParking: Boolean!
	  hasLocalPublicTransport: Boolean!
	  hasPublicFacilities: Boolean!
	  hasLockerSystem: Boolean!
	  hasTaxiRank: Boolean!
	  hasTravelNecessities: Boolean!
	  hasSteplessAccess: String!
	  hasMobilityService: String!
	  federalState: String!
	  regionalArea: RegionalArea!
	  facilities: [Facility!]!
	  mailingAddress: MailingAddress!
	  DBInformationOpeningTimes: OpeningTimes
	  localServiceStaffAvailability: OpeningTimes
    aufgabentraeger: StationContact!
	  timeTableOffice: StationContact
	  szentrale: StationContact!
	  stationManagement: StationContact!
	  timetable: Timetable!
    parkingSpaces: [ParkingSpace!]!
    hasSteamPermission: Boolean!
    hasWiFi: Boolean!
    hasTravelCenter: Boolean!
    hasRailwayMission: Boolean!
    hasDBLounge: Boolean!
    hasLostAndFound: Boolean!
    hasCarRental: Boolean!
    tracks: [Track!]!
    picture: Picture
  }

  type Track {
	  platform: String!
	  number: String!
	  name: String!
    # Length of the platform in cm
	  length: Int
    # Height of the platform in cm
	  height: Int!
  }

  type Location {
	  latitude: Float!
	  longitude: Float!
  }

  type Facility {
	  description: String
	  type: FacilityType!
	  state: FacilityState!
	  equipmentNumber: Int
	  location: Location
  }

  type Picture {
    id: Int!
    url: String!
    license: String!
    photographer: Photographer!
  }

  type Photographer {
    name: String!
    url: String!
  }

  enum FacilityState {
    ACTIVE
    INACTIVE
    UNKNOWN
  }

  enum FacilityType {
    ESCALATOR
    ELEVATOR
  }

  type MailingAddress {
	  city: String!
	  zipcode: String!
	  street: String!
  }

  type RegionalArea {
	  number: Int!
	  name: String!
	  shortName: String!
  }

  type OpeningTimes {
	  monday: OpeningTime
	  tuesday: OpeningTime
	  wednesday: OpeningTime
	  thursday: OpeningTime
	  friday: OpeningTime
	  saturday: OpeningTime
	  sunday: OpeningTime
	  holiday: OpeningTime
  }

  type OpeningTime {
	  from: String!
	  to: String!
  }

  type StationContact {
	  name: String!
	  shortName: String
	  email: String
	  number: String
	  phoneNumber: String
  }

  type Nearby {
    stations (count: Int = 10, offset: Int = 0): [Station!]!
    parkingSpaces (count: Int = 10, offset: Int = 0): [ParkingSpace!]!
    travelCenters (count: Int = 10, offset: Int = 0): [TravelCenter!]!
    flinksterCars (count: Int = 10, offset: Int = 0): [FlinksterCar!]!
    bikes (count: Int = 10, offset: Int = 0): [FlinksterBike!]!
  }

  type ParkingSpace {
    type: String
    id: Int!
    name: String
    label: String
    spaceNumber: String
    responsibility: String
    source: String
    nameDisplay: String
    spaceType: String
    spaceTypeEn: String
    spaceTypeName: String
    location: Location
    url: String
    operator: String
    operatorUrl: String
    address: MailingAddress
    distance: String
    facilityType: String
    facilityTypeEn: String
    openingHours: String
    openingHoursEn: String
    numberParkingPlaces: String
    numberHandicapedPlaces: String
    isSpecialProductDb: Boolean!
    isOutOfService: Boolean!
    station: Station
    outOfServiceText: String
    outOfServiceTextEn: String
    reservation: String
    clearanceWidth: String
    clearanceHeight: String
    allowedPropulsions: String
    hasChargingStation: String
    tariffPrices: [ParkingPriceOption!]!
    outOfService: Boolean!
    isDiscountDbBahnCard: Boolean!
    isMonthVendingMachine: Boolean!
    isDiscountDbBahnComfort: Boolean!
    isDiscountDbParkAndRail: Boolean!
    isMonthParkAndRide: Boolean!
    isMonthSeason: Boolean!
    tariffDiscount: String
    tariffFreeParkingTime: String
    tariffDiscountEn: String
    tariffPaymentOptions: String
    tariffPaymentCustomerCards: String
    tariffFreeParkingTimeEn: String
    tariffPaymentOptionsEn: String
    slogan: String
    sloganEn: String
    occupancy: Occupancy
  }

  type ParkingPriceOption {
    id: Int!
    duration: String!
    price: Float
  }

  type Occupancy {
    validData: Boolean!
    timestamp: String!
    timeSegment: String!
    category: Int!
    text: String!
  }

  type Timetable {
	  nextArrivals: [TrainInStation!]!
	  nextDepatures: [TrainInStation!]!
  }

  type TrainInStation {
	  type: String!
	  trainNumber: String!
	  platform: String!
	  time: String!
	  stops: [String!]!
  }

  type TravelCenter {
    id: Int
    name: String
    address: MailingAddress
    type: String
	  location: Location
  }

  type FlinksterCar {
    id: String!
    name: String!
    description: String!
    attributes: CarAttributes!
    location: Location!
    priceOptions: [PriceOption]!
    equipment: CarEquipment!
    rentalModel: String!
    parkingArea: FlinksterParkingArea!
    category: String!
    url: String!
  }

  type FlinksterBike {
    id: String!
    url: String!
    name: String!
    description: String!
    location: Location!
    priceOptions: [PriceOption]!
    attributes: BikeAttributes!
    address: MailingAddress!
    rentalModel: String!
    type: String!
    providerRentalObjectId: Int!
    parkingArea: FlinksterParkingArea!
    bookingUrl: String!
  }

  type CarAttributes {
    seats: Int!
    color: String!
    doors: Int!
    transmissionType: String!
    licensePlate: String
    fillLevel: Int
    fuel: String
  }

  type CarEquipment {
    cdPlayer: Boolean
    airConditioning: Boolean
    navigationSystem: Boolean
    roofRailing: Boolean
    particulateFilter: Boolean
    audioInline: Boolean
    tyreType: String
    bluetoothHandsFreeCalling: Boolean
    cruiseControl: Boolean
    passengerAirbagTurnOff: Boolean
    isofixSeatFittings: Boolean
  }

  type FlinksterParkingArea {
    id: String!
    url: String!
    name: String!
    address: MailingAddress!
    parkingDescription: String
    accessDescription: String
    locationDescription: String
    publicTransport: String
    provider: FlinksterProvider!
    type: String!
    position: Location!
    GeoJSON: GeoJSON
  }

  type GeoJSON {
    type: String!
    features: [GeoFeature!]!
  }

  type GeoFeature {
    type: String!
    properties: GeoProperties!
    geometry: GeoPolygon!
  }

  type GeoPolygon {
    type: String!
    coordinates: [[[[Float]]]]!
  }

  type GeoProperties {
    name: String!
  }

  type FlinksterProvider {
    url: String!
    areaId: Int!
    networkIds: [Int!]!
  }

  type BikeAttributes {
    licensePlate: String!
  }

  type PriceOption {
    interval: Int
    type: String!
    grossamount: Float!
    currency: String!
    taxrate: Float!
    preferredprice: Boolean!
  }
`;

const resolveFunctions = {
    DateTime: GraphQLDateTime
};

const schema = makeExecutableSchema({ typeDefs: schemaString, resolvers: resolveFunctions });

module.exports = schema;
