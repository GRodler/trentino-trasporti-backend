export default class Station{
    constructor(api_id,name,id,lat,lon,routes,type) {
        this.name = name;
        this.id = id;
        this.api_id = api_id; //seems like that the id are duplicated and no unique
        this.lat = lat;
        this.lon = lon;
        this.routes = routes;
        this.type = type;

    }
}
