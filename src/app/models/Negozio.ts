import { Magazzino } from "./Magazzino";

export interface Negozio {
    id: number;
    sede: string;
    indirizzo: string;
    telefono: string;
    magazzino: Magazzino;
    }