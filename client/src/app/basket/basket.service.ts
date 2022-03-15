import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  //making this observalbel to buffer(BehaviourSubject)
  basket$ = this.basketSource.asObservable();

  //BasketTotal buffer (memory)
  private basketTotalSoruce=new BehaviorSubject<IBasketTotals>(null);
  basketTotal$=this.basketTotalSoruce.asObservable();


  constructor(private http: HttpClient) { }

  //get basket with id
  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          //settinh baseket value from basketSoruce observable
          this.basketSource.next(basket);
          this.calculateTotals();
        })
      );
  }

  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket)
      .subscribe((response: IBasket) => {
        //setting basket value 
        this.basketSource.next(response);
        this.calculateTotals();
      }, error => {
        console.log(error);
      });
  }

  getCurrentBasketValue(){
    //giving current value
    return this.basketSource.value;
  }

  //call this logic into component
  //adding Item To Basket 
  addItemToBasket(item:IProduct,quantity=1){
    //mapping ProductItem to BasketItem
    const itemToAdd:IBasketItem=this.mapProductItemToBasketItem(item,quantity);
    //?? null coleacing operator
    const basket=this.getCurrentBasketValue() ?? this.createBasket();
    basket.items=this.addOrUpdateItem(basket.items,itemToAdd,quantity);
    this.setBasket(basket);
  }

  //Increment Item Quantity
  incrementItemQuantity(item:IBasketItem){
    const basket=this.getCurrentBasketValue();
    const foundItemIndex=basket.items.findIndex(x=>x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  //Decrement Item Quantity
  decrementItemQuantity(item:IBasketItem){
    const basket=this.getCurrentBasketValue();
    const foundItemIndex=basket.items.findIndex(x=>x.id === item.id);
    if(basket.items[foundItemIndex].quantity > 1){
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else{
      this.removeItemFromBasket(item);
    }
  }

  //remove items from basket
  removeItemFromBasket(item: IBasketItem) {
    const basket=this.getCurrentBasketValue();
    //if item id found
    if(basket.items.some(x=>x.id === item.id)){
      //removing  item using filter method
      //it should return  all of other items that do not match
      //this particular id   
      basket.items=basket.items.filter(x=>x.id !== item.id)
      if(basket.items.length > 0){
        this.setBasket(basket);
      }
      //and we've removed all item  and now we have an empty
      //basket and we will delete the basket
      else{
        this.deleteBasket(basket);
      }

    }
  }

  //delete entire basket
  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' +basket.id).subscribe(()=>{
      //above api call remove the basket
      //emty the basketSource,basketTotalSoruce buffer 
      this.basketSource.next(null);
      this.basketTotalSoruce.next(null);
      localStorage.removeItem('basket_id');
    },error=>{
      console.log(error);
    })
  }

  //Calculating Cost of items
  private calculateTotals(){
    const basket=this.getCurrentBasketValue();
    const shipping=0;
    const subtotal=basket.items.reduce((a,b) => (b.price * b.quantity) +a, 0);
    const total=shipping+subtotal;
    this.basketTotalSoruce.next({shipping,total,subtotal})
  }

  //addOrUpdate Item
  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, 
                          quantity: number): IBasketItem[] {
    const index=items.findIndex(i=> i.id === itemToAdd.id);
    if(index === -1){
      itemToAdd.quantity=quantity;
      items.push(itemToAdd);
    }
    else{
      items[index].quantity +=quantity;
    }
    return items;
  }

  //createBasket
  private createBasket(): IBasket {
   const basket=new Basket();
   //stroing basket_id into browsers localStorage
   //localstorage persists even browser closed or computer restarted
   //localstorage specific to broweser
   localStorage.setItem('basket_id',basket.id);
   return basket;
  }

  //will map Product Item properties to BasketItem
  //check all properties of these 2 classess
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id:item.id,
      productName:item.name,
      price:item.price,
      pictureUrl:item.pictureUrl,
      quantity,
      brand:item.productBrand,
      type:item.productType
    }
  }

}
