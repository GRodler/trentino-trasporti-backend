import Route from './route.mjs';
import Extractor from "../extractor.mjs";

export default class RoutesManager {
    constructor() {
        this.e = new Extractor();
        this.routes = this.createRoutesArray();
    }
    /*
    creates a new route objects
     */
    async createRouteObject(route){
        return new Route(route.routeId,route.routeLongName,route.routeShortName,route.type);

    }
    /*
    creates a new array of routeobject
     */
    async createRoutesArray(){

        const raw_routes = await this.e.getRoutes();

        const routes = [];
        for (let i in raw_routes){
            routes.push(await this.createRouteObject(raw_routes[i]));
        }
        return routes;
    }
    /*
    given an id gives back a route objetc
     */
    async findRoute(id){
        const routes = await this.routes;

        let output = null;
        for (let i in routes){
            if (parseInt(routes[i].id)  === parseInt(id)  ){
                output = routes[i];
            }
        }
        return output;
    }
}