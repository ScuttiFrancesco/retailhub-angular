export interface MqttInsert {
   date : Date;
   idCliente : number;
   idNegozio : number;
   idOperatore : number;
   prodotti:[
        {
             idProdotto : number;
             quantita : number
        }
   ]
} 