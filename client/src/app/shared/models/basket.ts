import { v4 as uuidv4 } from 'uuid';

export interface IBasket {
    id: string;
    //Basket contains items of IBasket
    items: IBasketItem[];
}
export interface IBasketItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}
export class Basket implements IBasket{
    //will create new id always guid like type
    id=uuidv4();
    items:IBasketItem[]=[];
}

export interface IBasketTotals{
    shipping:number;
    subtotal:number;
    total:number;
}