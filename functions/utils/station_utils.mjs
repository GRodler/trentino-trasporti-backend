import geolib from "geolib";


/*
    given the stations and the names orders the stations by affinity with the name with self-completion
 */
export function SortString(stops,name){
    let output= [];
    if (stops.length === 1){
        return stops;
    }else {
        //Prende l'indice della parola e la posizione dell'oggetto nell'array
        let WordIndex = [];
        let index = [];
        for (let i in stops){
            WordIndex.push(stops[i].name.toLowerCase().indexOf(name.toLowerCase()));
            index.push(i);
        }

        const keyValuePairs = index.map((key, index) => [key, WordIndex[index]]);
        keyValuePairs.sort((a, b) => a[1] - b[1]);

        const sortedKeys = keyValuePairs.map(pair => pair[0]);

        for (let j in stops){
            output.push(stops[sortedKeys[j]]);
        }

        return output;
    }
}

/*
given two coordinates returns the distance in meters
 */
export function CalculateDistance(lat1,lon1,lat2,lon2){
    const point1 = { latitude: lat1, longitude: lon1 };
    const point2 = { latitude: lat2, longitude: lon2 };
    return geolib.getDistance(point1,point2);
}
