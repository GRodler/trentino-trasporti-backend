import Extractor from "../extractor.mjs";
import Station from "./station.mjs";
import Route from "../routes/route.mjs";
import {SortString,CalculateDistance} from "../../utils/station_utils.mjs"


export default class StationsManager {
    constructor() {
        this.e = new Extractor();
        this.stations = this.createStationsArray();
    }

    async extractRoutes(array){
        let routes = [];
        for (let i in array){
            routes.push(new Route(array[i].routeId,array[i].routeLongName,array[i].routeShortName,array[i].type))
        }
        return routes;
    }
    async createStationsArray(){
        const stops = await this.e.getStations();
        let output = [];
        for (let i in stops){
            output.push(new Station(stops[i].stopId,stops[i].stopName,parseInt(i) ,stops[i].stopLat,stops[i].stopLon,await this.extractRoutes(stops[i].routes),stops[i].type))
        }
        return output;
    }

    /*
    restituisce le fermate con autocompletamento per Modena
     */
    async getStations(name){
        let output = [];
        const stops = await this.stations;
        for (let i in stops){
            if (stops[i].name.toLowerCase().includes(name.toLowerCase())) {
                output.push(stops[i]);
            }
        }
        output = SortString(output,name);
        return output;
    }

    /*
   returns a single object station given an id
     */
    async getStationId(id){
        let output = null;
        const stops = await this.stations;
        for (let i in stops){
            if (parseInt(stops[i].id) === parseInt(id)) {
                output = stops[i];
                break;
            }
        }

        return output;
    }

    /*
  returns a single object station given an api_id
    */
    async getStationApiId(api_id){
        let output = null;
        const stops = await this.stations;
        for (let i in stops){
            if (parseInt(stops[i].api_id) === parseInt(api_id)) {
                output = stops[i];
                break;
            }
        }

        return output;
    }
    /*
    given a coordinate finds the nearest station
     */
    async FindNearest(lat,lon){
        const stops = await this.stations;
        let nearest = stops[0];//using geolib library it calculates the nearest known stop to the one given by the direction api

        let nearest_meter = CalculateDistance(stops[0].lat,stops[0].lon,lat,lon);

        for (let i in stops){
            let meter = CalculateDistance(stops[i].lat,stops[i].lon,lat,lon);
            if (meter < nearest_meter){
                nearest_meter = meter;
                nearest = stops[i];
            }
        }
        return nearest;
    }




}