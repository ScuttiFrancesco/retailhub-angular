import { Cliente } from "./Cliente";
import { Negozio } from "./Negozio";
import { Operatore } from "./Operatore";
import { Prodotto } from "./Prodotto";

export class Order {
    id: number | undefined;
    totale: number  | undefined;
    dataOrdine: string | undefined;
    statoOrdine: string | undefined;
    pagamentoOrdine: string | undefined;
    cliente: Cliente | undefined;
    operatore: Operatore | undefined;
    negozio: Negozio | undefined;
    prodotti: Prodotto[] = [];
    }