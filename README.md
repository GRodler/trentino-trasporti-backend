# trentino-trasporti-backend

## istruzioni per quella talpa di modena

End-point funzionanti:
* ```/v1/fermate```:
  * restituisce una lista di stazioni utilizzando l'autocompletamento
  * prende come query stopName={nome completo/nome parziale}
  * con stopName= o senza parametro restituisce tutte le stazioni
* ```/v1/viaggi_fermata```:
  * restituisce una lista di trip in partenza dalla stazione in quel determinato momento
  * prende come parametro stopName={nome completo/nome parziale}(utilizza auto completamento) oppure stopId={id_stazione}

End-point funzionanti parzialmente:
* ```/v1/viaggi```:
  * restituisce una lista di trip tra due stazioni che sono collegate da delle route dirette ed indirette
  * prende come query start={id stazione di partenza} e arrival={id stazione di arrivo}
  * da rivedere ancora la gestione del tempo
  
