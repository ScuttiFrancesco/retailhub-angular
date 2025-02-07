import { Magazzino } from "./Magazzino";

export class Negozio {
    id: number | undefined;
    sede: string | undefined;
    indirizzo: string | undefined;
    telefono: string | undefined;
    magazzino: Magazzino | undefined;
    }