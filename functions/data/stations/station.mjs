export default class Station{
    constructor(name,id,lat,lon,routes,type) { //bisogna ricordarsi in fututo di gestire i vari duplicati
        this.name = name;
        this.id = id;
        this.lat = lat;
        this.lon = lon;
        this.routes = routes;
        this.type = type;
    }
}