import station from '../data/stations/station.mjs';
import trip from '../data/trips/trip.mjs';
import polyline from "@mapbox/polyline"
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
                    line: routes[i].legs[0].steps[j].transitDetails.line.shortName,
                    step_number : n_steps,
                    departure_time : convertMillis(routes[i].legs[0].steps[j].transitDetails.departureTime.millis),
                    arrival_time: convertMillis(routes[i].legs[0].steps[j].transitDetails.departureTime.millis),
                    vehicle : routes[i].legs[0].steps[j].transitDetails.line.vehicle.name,
                    stations:{
                        departure : createCostumStations(routes[i].legs[0].steps[j].transitDetails.departureStop,parseInt(j)),
                        arrival : createCostumStations(routes[i].legs[0].steps[j].transitDetails.arrivalStop,parseInt(j)+1 )}
                });
                n_steps ++;
            }
        }
        output.push(step)
    }
    return output;
}

/*
returns an array of point to follow for any steps
 */
export function CutDirectionPoly(data){
    let output = [];
    let routes = data.routes;

    for (let i in routes){
        let transit = routes[i].legs[0].steps
        let step = [];
        let n_steps = 1;
        for (let j in transit){
            if (transit[j].travelMode === "TRANSIT" ){
                step.push({
                    line: routes[i].legs[0].steps[j].transitDetails.line.shortName,
                    step_number : n_steps,
                    stations:{
                        departure : createCostumStations(routes[i].legs[0].steps[j].transitDetails.departureStop,parseInt(j)),
                        arrival : createCostumStations(routes[i].legs[0].steps[j].transitDetails.arrivalStop,parseInt(j)+1 )
                    },
                    map_points :convertPoly(routes[i].legs[0].steps[j].polyline.encodedPath)
                });
                n_steps ++;
            }
        }
        output.push(step)
    }
    return output;
}
/*
converts the polyline into an array
 */
function convertPoly(path){
    return polyline.decode(path);

}

/*
creates a new costum stations with a costum id
 */
function createCostumStations(raw_station,j){
    return new station(null,raw_station.name, 10000 + j, raw_station.location.lat, raw_station.location.lng);
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
async function convertTrip(raw_data,manager,routes){
    let stations = [];
    const delay = raw_data.delay;
    const position_index = raw_data.lastSequenceDetection;
    let tmp = await routes.findRoute(raw_data.routeId)
    const line = await tmp.longName;
    const end_arrival = raw_data.tripHeadsign;
    const routeId = raw_data.routeId;
    for (let i in raw_data.stopTimes){
        const station = await manager.getStationApiId(raw_data.stopTimes[i].stopId)
        stations.push({
            station: {name : station.name ,id:station.id,lat:station.lat,lon:station.lon},
            arrival : checkDelay(raw_data.stopTimes[i].arrivalTime,i,position_index,delay),
            departure : checkDelay(raw_data.stopTimes[i].arrivalTime,i,position_index,delay)
        });
    }

    return new trip(line,delay,position_index,stations,end_arrival,routeId);
}

/*
iterates in an array of trips raw data
 */
export async function convertTrips(raw_data,manager,routes){
    let output = [];

    for (let i in raw_data){
        output.push(await convertTrip(raw_data[i],manager,routes));
    }
    return output;
}