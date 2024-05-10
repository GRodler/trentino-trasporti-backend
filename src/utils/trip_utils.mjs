import station from '../data/stations/station.mjs';
import trip from '../data/trips/trip.mjs';

/*
given the information from the direction api return an array of steps to take from a point to a point b
 */
export function CutDirectionArray(data){
    let output = [];
    let routes = data.routes;

    for (let i in routes){
        let transit = routes[i].legs[0].steps
        let step = [];
        let n_steps = 1;
        for (let j in transit){
            if (transit[j].travelMode === "TRANSIT" ){
                step.push({
                    linea: routes[i].legs[0].steps[j].transitDetails.line.shortName,
                    numero_passaggio : n_steps,
                    ora_partenza : convertMillis(routes[i].legs[0].steps[j].transitDetails.departureTime.millis),
                    ora_arrivo: convertMillis(routes[i].legs[0].steps[j].transitDetails.departureTime.millis),
                    mezzo : routes[i].legs[0].steps[j].transitDetails.line.vehicle.name,
                    stazioni:{
                        partenza : createCostumStations(routes[i].legs[0].steps[j].transitDetails.departureStop,parseInt(j)),
                        arrivo : createCostumStations(routes[i].legs[0].steps[j].transitDetails.arrivalStop,parseInt(j)+1 )}
                });
                n_steps ++;
            }
        }
        output.push(step)
    }
    return output;
}

/*
creates a new costum stations with a costum id
 */
function createCostumStations(raw_station,j){
    return new station(raw_station.name, 10000 + j, raw_station.location.lat, raw_station.location.lng);
}
/*
convert a data into ISO 8601 from the millis from the 1970
*/
function convertMillis(millis){
    const date = new Date(millis);
    return date.toISOString();
}

/*
checks if a station has already been passed if no adds the delay to the arrival time
 */
function checkDelay(time,index,position_index,delay){
    if (index => position_index){
        return time;
    }else if (index < position_index){
        return shiftDelay(time,delay) ;
    }
}
/*
adds the delay to an arrival or a departure date for a trip
 */
function shiftDelay(time,delay){
    return time.setMinutes(time.getMinutes() + delay);
}
/*
convert the json result into a trip object
 */
async function convertTrip(raw_data,manager){
    let stations = [];
    const delay = raw_data.delay;
    const position_index = raw_data.lastSequenceDetection;
    console.log(raw_data.tripHeadsign)
    const trip_name =  raw_data.tripHeadsign;
    for (let i in raw_data.stopTimes){
        const station = await manager.getStationId(raw_data.stopTimes[i].stopId)
        stations.push({
            stazione: {name : station.name ,id:station.id,lat:station.lat,lon:station.lon},
            arrivo : checkDelay(raw_data.stopTimes[i].arrivalTime,i,position_index,delay),
            partenza : checkDelay(raw_data.stopTimes[i].arrivalTime,i,position_index,delay)
        });
    }
    return new trip(trip_name,delay,position_index,stations);
}

/*
iterates in an array of trips raw data
 */
export async function convertTrips(raw_data,manager){
    let output = [];

    for (let i in raw_data){
        output.push(await convertTrip(raw_data[i],manager));
    }
    return output;
}