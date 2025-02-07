import { Magazzino } from "./Magazzino";

export class Prodotto{
    id: number | undefined;
    nome: string | undefined;
    marca: string   | undefined;
    lotto: string | undefined;
    dataScadenza: string    | undefined;
    prezzo: number  | undefined;
    tipo: string | undefined;
    quantita: number | undefined;
    vecchiaQuantita : number | undefined;
    magazzino: Magazzino | undefined;    

    constructor(){}
}