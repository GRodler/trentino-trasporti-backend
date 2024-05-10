import Extractor from "../extractor.mjs";
import {CutDirectionArray,convertTrips} from  "../../utils/trip_utils.mjs"

export default class TripsHandler{
    constructor(stations) {
        this.stations = stations;
        this.e = new Extractor();
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
        let tripsE = await this.e.getTrips(stop.id,"E");
        let tripsU = await this.e.getTrips(stop.id,"U");
        trips= await convertTrips(trips.concat(tripsE,tripsU),await this.stations) ;
        return trips;
    }

    /*
    data una stazione di partenza e una di arrivo restituisce l'elenco delle stazioni per arrivare nei vari punti
     */
    async getDirectionsStations(start, arrival){
        const start_loc = start.lat + "," + start.lon;
        const arrival_loc = arrival.lat + "," +arrival.lon;
        return CutDirectionArray(await this.e.getDirections(start_loc,arrival_loc));
    }

    /*
    gives the trips from a start id and an arrival id, works even with the non-linked stations
     */
    async getFinalTrip(start_id,arrival_id,date){
        const start = await this.stations.getStationId(start_id);
        const arrival = await this.stations.getStationId(arrival_id);
        return await this.getDirectionsStations(start,arrival) ;

    }


}