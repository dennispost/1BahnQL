require('dotenv').config();

const { graphql } = require('graphql');
const schema = require('./schema.js');
const express = require('express');
const graphqlHTTP = require('./express-graphql/dist/index');
const expressPlayground = require('graphql-playground-middleware-express').default;

const ParkingspaceLoader = require('./Parkingspace/ParkingspaceLoader');
const FlinksterLoader = require('./Flinkster/FlinksterLoader');
const StationLoader = require('./Station/StationLoader');
const OperationLocationLoader = require('./OperationLocation/OperationLocationLoader');
const TravelCenterLoader = require('./TravelCenter/TravelCenterLoader');
const TimetableLoader = require('./Timetable/TimetableLoader.js');
const FacilityLoader = require('./Facility/FacilityLoader.js');
const StationPictureLoader = require('./StationPicture/StationPictureLoader');

const ParkingspaceService = require('./Parkingspace/ParkingspaceService');
const FlinksterService = require('./Flinkster/FlinksterService');
const OperationLocationService = require('./OperationLocation/OperationLocationService');
const StationService = require('./Station/StationService');
const NearbyStationService = require('./Station/NearbyStationsService');
const TravelCenterService = require('./TravelCenter/TravelCenterService');
const FacilityService = require('./Facility/FacilityService.js');
const RoutingService = require('./Routing/RoutingService.js');
const TimetableService = require('./Timetable/TimetableService.js');
const TrackService = require('./Platforms/TrackService.js');
const StationIdMappingService = require('./Station/StationIdMappingService');
const StationPictureService = require('./StationPicture/StationPictureService');

const StationRelationships = require('./Station/StationRelationships');
const ParkingspaceRelationships = require('./Parkingspace/ParkingspaceRelationships');

const NearbyQuery = require('./NearbyQuery');

// --------- //

const APIToken = process.env.DBDeveloperAuthorization;
const baseURL = process.env.DBBaseURL || 'https://api.deutschebahn.com';

// Loader
const parkingspaceLoader = new ParkingspaceLoader(APIToken, baseURL);
const stationLoader = new StationLoader(APIToken, baseURL);
const timetableLoader = new TimetableLoader(APIToken, baseURL);
const operationLocationLoader = new OperationLocationLoader(APIToken, baseURL);
const travelCenterLoader = new TravelCenterLoader(APIToken, baseURL);
const facilityLoader = new FacilityLoader(APIToken, baseURL);
const flinksterLoader = new FlinksterLoader(APIToken, baseURL);
const stationPictureLoader = new StationPictureLoader(APIToken, baseURL);

// Services
const parkingspaceService = new ParkingspaceService(parkingspaceLoader);
const operationLocationService = new OperationLocationService(operationLocationLoader);
const stationIdMappingService = new StationIdMappingService();
const stationService = new StationService(stationLoader, stationIdMappingService);
const nearbyStationService = new NearbyStationService(stationService);
const travelCenterService = new TravelCenterService(travelCenterLoader);
const facilityService = new FacilityService(facilityLoader);
const routingService = new RoutingService();
const flinksterService = new FlinksterService(flinksterLoader);
const timetableServcie = new TimetableService(timetableLoader);
const trackService = new TrackService(stationIdMappingService);
const stationPictureService = new StationPictureService(stationPictureLoader);

// Relationships
stationService.relationships = new StationRelationships(parkingspaceService, facilityService, timetableServcie, trackService, stationPictureService);
parkingspaceService.relationships = new ParkingspaceRelationships(parkingspaceService, stationService);

// Queries
const root = {
  parkingSpace: args => parkingspaceService.parkingspaceBySpaceId(args.id),
  stationWithEvaId: args => stationService.stationByEvaId(args.evaId),
  stationWithStationNumber: args => stationService.stationByBahnhofsnummer(args.stationNumber),
  stationWithRill100: args => stationService.stationByRil100(args.rill100),
  search: args => ({ stations: stationService.searchStations(args.searchTerm), operationLocations: operationLocationService.searchOperationLocations(args.searchTerm) }),
  nearby: args => new NearbyQuery(args.latitude, args.longitude, args.radius, nearbyStationService, parkingspaceService, flinksterService, travelCenterService),
};

const experimental = process.env.experimental;
if(experimental) {
  root.routing = (args) => {
    return routeSearch = routingService.routes(args.from, args.to, args.departure, args.arrival);
  }
}

const introductionDemoQuery = `
# Welcome to 1BahnQL
#
# GraphiQL is an in-browser IDE for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will
# see intelligent typeaheads aware of the current GraphQL type schema and
# live syntax and validation errors highlighted within the text.
#
# To bring up the auto-complete at any point, just press Ctrl-Space.
#
# Press the run button above, or Cmd-Enter to execute the query, and the result
# will appear in the pane to the right.
#
# Learning resources:
# GraphQL: http://graphql.org
# GraphiQL: https://github.com/graphql/graphiql
# 1BahnQL: https://github.com/dbsystel/1BahnQL
#
#
# Example queries:
# Just comment out the query you would like to test and press the run button above,
# or Cmd-Enter to execute the query
# Requires api subscription: Stationen (StaDa)

{
  stationWithEvaId(evaId: 8000105) {
    name
    location {
      latitude
      longitude
    }
  }
}
`;

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));
app.get('/playground', expressPlayground({ endpoint: 'graphql' }));
// set the port of our application
// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`now browse to localhost:${port}/graphql`));
