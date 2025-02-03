import { Negozio } from "./Negozio";

export interface Magazzino {
    id: number;
    sede: string;
    indirizzo: string;
    telefono: string;
    negozio: Negozio;
    }