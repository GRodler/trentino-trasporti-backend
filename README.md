# trentino-trasporti-backend

## istruzioni per quella talpa di modena
url base: ```https://trentinotrasportibackend.netlify.app/.netlify/functions/server```


End-point funzionanti:
* ```/v1/fermate```:
  * restituisce una lista di stazioni utilizzando l'autocompletamento
  * prende come query stopName={nome completo/nome parziale}
  * con stopName= o senza parametro restituisce tutte le stazioni
* ```/v1/viaggi_fermata```:
  * restituisce una lista di trip in partenza dalla stazione in quel determinato momento
  * prende come parametro stopName={nome completo/nome parziale}(utilizza auto completamento) oppure stopId={id_stazione}
  * ```position_index``` indica la posizione attuale del bus nell'array di stazioni
  * esempio risultato per ```https://trentinotrasportibackend.netlify.app/.netlify/functions/server/v1/viaggi_fermata?stopId=1```:
      <br />
 ```json
 {
    "name": "Ospedale P.Dante Sopramonte",
    "routeId": 536,
    "end_arrival": "Sopramonte Piazza Oveno",
    "delay": null,
    "position_index": 0,
    "stop_times": [
      {
        "station": {
          "name": "Piazza Dante Stazione Fs",
          "id": 247,
          "lat": 46.071756,
          "lon": 11.119511
        },
        "arrival": "22:43:00",
        "departure": "22:43:00"
      },
      {
        "station": {
          "name": "Trento Ftm",
          "id": 2426,
          "lat": 46.074289,
          "lon": 11.120764
        },
        "arrival": "22:44:00",
        "departure": "22:44:00"
      }, ...

   ```
  <br />
  
  * ```/v1/viaggi```:
  * restituisce una lista di step da compiere da una stazione di partenza a una stazione di arrivo
  * prende come query start={id stazione di partenza} e arrival={id stazione di arrivo}
  * al momento prende solo la data attuale come parametro di default 
  * esempio risultato per ``` https://trentinotrasportibackend.netlify.app/.netlify/functions/server/v1/viaggi?start=16&arrival=977```:
  
  
  ```json
  [
  [
    {
      "line": "B101",
      "step_number": 1,
      "departure_time": "2024-05-14T04:02:00.000Z",
      "arrival_time": "2024-05-14T04:02:00.000Z",
      "vehicle": "Autobus",
      "stations": {
        "departure": {
          "name": "Cavalese, Autostazione",
          "id": 10000,
          "lat": 46.287981,
          "lon": 11.463242
        },
        "arrival": {
          "name": "Trento-Autostaz.",
          "id": 10001,
          "lat": 46.070785,
          "lon": 11.118457
        }
      }
    },
    {
      "line": "B401",
      "step_number": 2,
      "departure_time": "2024-05-14T05:40:00.000Z",
      "arrival_time": "2024-05-14T05:40:00.000Z",
      "vehicle": "Autobus",
      "stations": {
        "departure": {
          "name": "Trento-Autostaz.",
          "id": 10001,
          "lat": 46.070785,
          "lon": 11.118457
        },
        "arrival": {
          "name": "Stazione di Borgo Valsugana Centro",
          "id": 10002,
          "lat": 46.051456,
          "lon": 11.4541644
        }
      }
    }
  ],
   ``` 
    
  
