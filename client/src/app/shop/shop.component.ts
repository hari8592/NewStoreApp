import { ThrowStmt } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  @ViewChild('search',{static:false}) searchTerm:ElementRef;
  products: IProduct[];
  brands:IBrand[];
  types:IType[];
  //shop Params 
  shopParams=new ShopParams();  
  //Count
  totalCount:number;
  //make value is correct because based on this sorting will only work
  sortOptions=[
    {name:'Alphabetical',value:'name'},
    {name:'Price Low to High',value:'priceAsc'},
    {name:'Price High to Low',value:'priceDesc'}
  ];

  constructor(private shopService:ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts(){
    //return obesevable is observable<IPagination>
    this.shopService.getProducts(this.shopParams).subscribe(res=>{
      ////below we are observing response so we have map data field from response     
      this.products=res.data; 
      this.shopParams.pageNumber=res.pageIndex;
      this.shopParams.pageSize=res.pageSize;
      this.totalCount=res.count;
    },err=>{
      console.log(err);
    })
  }

  getBrands(){
    //return obesevable is observable<IBrand[]>
    this.shopService.getBrands().subscribe(result=>{
      //spread operator
      //it spreads all of the objects from that array and is simply adding
      //on and other objects at the front here
      this.brands=[{id:0,name:'All'},...result];
    },error=>{
      console.log(error);
    })
  }

  getTypes(){
    //return obesevable is observable<IType[]>
    this.shopService.getTypes().subscribe(result=>{
      this.types=[{id:0,name:'All'},...result];
    },error=>{
      console.log(error);
    })
  }

  //filter brandwise
  onBrandSelected(brandId:number){
    this.shopParams.brandId=brandId;
    this.shopParams.pageNumber=1;
    this.getProducts();
  }

  //filter typewise
  onTypeSelected(typeId:number){
    this.shopParams.typeId=typeId;
    this.shopParams.pageNumber=1;
    this.getProducts();
  }

  //sorting 
  onSortSelected(sort:string){
    this.shopParams.sort=sort;
    this.getProducts();
  }

  //pagination
  onPageChanged(event:any){
    //here page no will given by child i.e pager.component
    //page number is not equal to event then only do logic
    if(this.shopParams.pageNumber !==event){
      this.shopParams.pageNumber=event;    
      this.getProducts();
    }
  }

  //search
  onSearch(){
    this.shopParams.search=this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber=1;
    this.getProducts();
  }

  //reset filter
  onReset(){
    this.searchTerm.nativeElement.value='';
    this.shopParams=new ShopParams();
    this.getProducts();
  }

}
