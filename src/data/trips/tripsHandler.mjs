import Extractor from "../extractor.mjs";
import {CutDirectionArray,convertTrips,CutDirectionPoly} from  "../../utils/trip_utils.mjs"

export default class TripsHandler{
    constructor(stations,routes) {
        this.e = new Extractor();
        this.stations = stations;
        this.routes = routes;
    }

    /*
    restituisce i trips in partenza piu recenti dalla stazione selezionata tramite nome o id a scelta nel caso del nome o si specifica
    la stazione precisa o prende il primo elemento dell'autocompletamento
     */
    async getTrips(id=null,name=null){
        let stop = null
        if (id !== null){
            stop = await this.stations.getStationId(id);
        }else if (name !== null){
            stop = await this.stations.getStations(name);
            stop = stop[0];
        }else {
            throw new Error("Dati per ricerca invalidi")
        }

        let trips = [];
        let tripsE = await this.e.getTrips(stop.api_id,"E");
        let tripsU = await this.e.getTrips(stop.api_id,"U");

        let filtered_trips = await this.validatesTrips(trips.concat(tripsE,tripsU),stop);
        trips= await convertTrips(filtered_trips,await this.stations,await this.routes);
        return trips;
    }

    /*
    given the stop and the raw trips data excludes the ones that are not in the trip array
     */
    async validatesTrips(trips,stop){
        let output = [];
        let valid_routes = stop.routes;
        let valid_ids = [];
        for (let j in valid_routes){
            valid_ids.push(valid_routes[j].id);
        }
        console.log(valid_ids)
        for (let i in trips){
            console.log(trips[i].routeId)
            if (valid_ids.includes(parseInt(trips[i].routeId))){
                output.push(trips[i]);
            }
        }
        console.log(output)
        return output
    }

    /*
    data una stazione di partenza e una di arrivo restituisce l'elenco delle stazioni per arrivare nei vari punti
     */
    async getDirectionsStations(start, arrival,date){
        const start_loc = start.lat + "," + start.lon;
        const arrival_loc = arrival.lat + "," +arrival.lon;
        return CutDirectionArray(await this.e.getDirections(start_loc,arrival_loc,date));
    }
    /*
     gives the array of coordinates of point to follow from a start id and an arrival id, works even with the non-linked stations
    */
    async getDirectionPoly(start, arrival,date){
        const start_loc = start.lat + "," + start.lon;
        const arrival_loc = arrival.lat + "," +arrival.lon;
        return CutDirectionPoly(await this.e.getDirections(start_loc,arrival_loc,date));
    }

    /*
    gives an array of steps with the coordinates of the array
     */
    async getFinalPolyline(start_id,arrival_id,date){
        const start = await this.stations.getStationId(start_id);
        const arrival = await this.stations.getStationId(arrival_id);
        return await this.getDirectionPoly(start,arrival,date);

    }
    /*
    gives the trips from a start id and an arrival id, works even with the non-linked stations
     */
    async getFinalTrip(start_id,arrival_id,date){
        const start = await this.stations.getStationId(start_id);
        const arrival = await this.stations.getStationId(arrival_id);
        return await this.getDirectionsStations(start,arrival,date) ;
    }


}