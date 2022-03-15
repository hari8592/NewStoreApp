import { Component } from '@angular/core';
import { BasketService } from './basket/basket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Welcome to Sports Shop';
 

  constructor(private basketService:BasketService) {

  }

  ngOnInit(): void {
    const basketId=localStorage.getItem('basket_id');

    if(basketId){
      //as in getBasket we used pipe and map so just check we can go and use .subscribe()
      this.basketService.getBasket(basketId).subscribe( () =>{
        console.log('initialised basket');
      },error=>{
        console.log(error);
      })
    }
  }
  
}
