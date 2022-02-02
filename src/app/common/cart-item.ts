import { Product } from "./product";

export class CartItem {
    id: string;
    name:string;
    imageUrl: string;
    unitPrice: number;
    quantity: number;

    // o construtor so funciona com classe (por isso mudei de interface para classe)
    // sem construtor nao é possivel atribuir no servico "undefined"
    constructor(product: Product){
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;
        this.quantity = 1;
    }
}
