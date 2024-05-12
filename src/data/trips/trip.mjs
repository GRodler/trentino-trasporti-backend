export default class Trip{
    constructor(line,delay,position_index,stop_times,end_arrival,routeId) {
        this.name = line;
        this.routeId = routeId;
        this.end_arrival = end_arrival;
        this.delay = delay;
        this.position_index = position_index;
        this.stop_times = stop_times;
    }
}