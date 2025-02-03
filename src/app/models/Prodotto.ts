import { Magazzino } from "./Magazzino";

export interface Prodotto{
    id: number;
    nome: string;
    marca: string;
    lotto: string;
    dataScadenza: string;
    prezzo: number;
    tipo: string;
    quantita: number;
    magazzino: Magazzino;    
}