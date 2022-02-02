import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { map } from 'rxjs/operators'
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'https://localhost:44363/api/';

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    //filtering
    if (shopParams.brandId !== 0) {
      params = params.append('brandId', shopParams.brandId.toString())
    }

    if (shopParams.typeId !== 0) {
      params = params.append('typeId', shopParams.typeId.toString())
    }

    //searching
    if(shopParams.search){
      params=params.append('search',shopParams.search);
    }

    //sorting
    params = params.append('sort', shopParams.sort);

    //pagination
    params=params.append('pageIndex',shopParams.pageNumber.toString());
    params=params.append('pageSize',shopParams.pageSize.toString()) ;

    

    //below we are observing response so we have map data field from response
    ////we have to extract body out of this
    //in order to use rx js methods inside pipe() we can use other methods
    //we have HTTP response at the moment and we want to map
    //this into IPagination object
    return this.http.get<IPagination>(this.baseUrl + 'products', { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getBrands() {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getTypes() {
    return this.http.get<IType[]>(this.baseUrl + 'products/types');
  }

  getProduct(id:number){
    return this.http.get<IProduct>(this.baseUrl+'products/'+id)
  }

}
