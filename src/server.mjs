import express, {query, request, response, Router} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import StationsManager from "./data/stations/stationsManager.mjs";
import TripsHandler from "./data/trips/tripsHandler.mjs";
import routesManager from "./data/routes/routesManager.mjs";


const app = express();
const port = 4000;
const router = express.Router();

//inizializzazione stazioni
console.log("sincronizzando le stazioni...")
const m = new StationsManager();
//inizializzazione route
console.log("sincronizzando le routes...")
export const r = new routesManager();


//inizializzazione roba di default express
app.use(bodyParser.json()); //e necessario abilitare il middleware con la funzione use

app.use(cors());//lo vuole react quindi lo abilito su tutte le sorgenti

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});


//endpoint api
router.get("/v1/fermate",async (request,response)=>{//usa i metodi basati sulla classe stations_manager
    const stopName = request.query.stopName;
    if (typeof(stopName) === 'undefined' || stopName === ""){
        response.send(await m.stations)
    }else {
        response.send(await m.getStations(stopName));
    }
});

router.get("/v1/viaggi_fermata",async (request,response)=>{
    const stopId = request.query.stopId;
    const stopName = request.query.stopName;
    const t = new TripsHandler(m,r);
    response.send(await t.getTrips(stopId,stopName));
});

router.get("/v1/viaggi",async (request,response)=>{
    const start = request.query.start;
    const arrival = request.query.arrival;
    const time = request.query.time;
    const t = new TripsHandler(m,r);
    response.send(await t.getFinalTrip(start,arrival,time));
});

router.get("/v1/polyline",async (request,response)=>{
    const start = request.query.start;
    const arrival = request.query.arrival;
    const time = request.query.time;
    const t = new TripsHandler(m,r);
    response.send(await t.getFinalPolyline(start,arrival,time));
});

app.use(router);