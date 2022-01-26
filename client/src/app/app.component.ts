import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProduct } from './models/product';
import { IPagination } from './models/pagination';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Welcome to Sports Shop';
  products: IProduct[];

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.http.get<IPagination>('https://localhost:44363/api/products')
      .subscribe((response: IPagination) => {
        console.log(response);
        this.products = response.data;
      }, error => {
        console.log(error);
      });
  }
}
