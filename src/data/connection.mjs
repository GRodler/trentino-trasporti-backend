import fetch from "node-fetch";

export default class Connection{
    constructor(url) {
        //dati di accesso
        this.username = "mittmobile";
        this.password = "ecGsp.RHB3";
        this.auth = "Basic " + new Buffer.from(this.username + ":" +this.password).toString("base64");//va convertito in base 64
        this.url = url;
        this.json_option = {
            method : 'GET',
            headers : {
                Authorization : this.auth
            }
        }
    }
    async getData(){
        try{
            console.log("chiamata a :"+ this.url)
            const data =  await fetch(this.url ,this.json_option);
            return await data.json();
        }catch (error){
            console.error(error);
        }
    }

}