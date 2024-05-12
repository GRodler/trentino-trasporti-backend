export default class Trip{
    constructor(name,delay,position_index,stop_times) {
        this.name = name;
        this.delay = delay;
        this.position_index = position_index;
        this.stop_times = stop_times;
    }
}