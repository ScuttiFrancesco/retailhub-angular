import { Cliente } from "./Cliente";
import { Negozio } from "./Negozio";
import { Operatore } from "./Operatore";

export interface Order {
    id: number;
    totale: number;
    dataOrdine: string;
    statoOrdine: string;
    pagamentoOrdine: string;
    cliente: Cliente;
    operatore: Operatore;
    negozio: Negozio;
    }