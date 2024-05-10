import express, {query, request, response, Router} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Extractor from "./data/extractor.mjs";
import StationsManager from "./data/stations/stationsManager.mjs";
import TripsHandler from "./data/trips/tripsHandler.mjs";


const app = express();
const port = 4000;

//inizializzazione stazioni
console.log("sincronizzando le stazioni...")
const m = new StationsManager();

//inizializzazione roba di default express
app.use(bodyParser.json()); //e necessario abilitare il middleware con la funzione use

app.use(cors());//lo vuole react quindi lo abilito su tutte le sorgenti

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});


//endpoint api
app.get("/v1/fermate",async (request,response)=>{//usa i metodi basati sulla classe stations_manager
    const stopName = request.query.stopName;
    if (typeof(stopName) === 'undefined' || stopName === ""){
        response.send(await m.stops)
    }else {
        response.send(await m.getStations(stopName));
    }
});

app.get("/v1/viaggi_fermata",async (request,response)=>{
    const stopId = request.query.stopId;
    const stopName = request.query.stopName;
    const t = new TripsHandler(m);
    response.send(await t.getTrips(stopId,stopName));
});

app.get("/v1/viaggi",async (request,response)=>{
    const start = request.query.start;
    const arrival = request.query.arrival;
    const t = new TripsHandler(m);
    response.send(await t.getFinalTrip(start,arrival));

});