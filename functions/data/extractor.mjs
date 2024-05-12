import Connection from "./connection.mjs"
import {getShiftedData} from "../utils/extractor_utils.mjs"

export default class Extractor{
    constructor() {
        //api parameters
        this.APP_URL = "https://app-tpl.tndigit.it/gtlservice";
        this.SITE_STOPS = "fermate";
        this.STOPS_PATH = "stops";
        this.LINES_PATH = "routes";
        this.TRIPS_PATH = "trips_new";
        this.DATE_NOW = getShiftedData(10);
        this.TRIP_PATH = "trips/";
        this.DIRECTION = "direction";
        this.LANG = "it";
    }

    /*
    gets the raw json file of the stations
    */
    async getStations(limit = -1,urban= "",){
        let url = this.APP_URL + "/" + this.STOPS_PATH + "/?";
        limit !== -1 ? url += "size=" + limit : url;
        urban !== "" ? url += "type=" + urban : url;
        const connection = new Connection(url);
        return await connection.getData();
    }

    /*
    gives the direction raw data
     */
    async getDirections(start_location,end_location,time=this.DATE_NOW){
        let url = this.APP_URL + "/" + this.DIRECTION + "/?from=" + start_location + "&to=" + end_location + "&lang=" + this.LANG + "&refDateTime="+ time;
        const connection = new Connection(url);
        return await connection.getData();
    }

    /*
    dato il stop id della stazione returna tutti i viaggi di quella stazione
     */
    async getTrips(stopId,type,time=this.DATE_NOW,limit=30,){
        let url = this.APP_URL + "/" + this.TRIPS_PATH + "/?stopId=" + stopId + "&type=" + type + "&limit=" + limit + "&refDateTime="+ time ;
        const connection = new Connection(url);
        return await connection.getData();
    }
    /*
    dato il route id restituisce i viaggi su quella route
     */
    async getTripsRoute(routeId,type,time=this.DATE_NOW,limit=30,){
        let url = this.APP_URL + "/" + this.TRIPS_PATH + "/?routeId=" + routeId + "&type=" + type + "&limit=" + limit + "&refDateTime="+ time ;
        const connection = new Connection(url);
        return await connection.getData();
    }

    async getRoutes(){
        let url = this.APP_URL + "/" + this.LINES_PATH
        const connection = new Connection(url);
        return await connection.getData();
    }


}
