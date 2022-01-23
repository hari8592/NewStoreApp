
using API.DTOs;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IGenericRepository<ProductBrand> _productbrandsRepo;
        private readonly IGenericRepository<ProductBrand> _productTypesRepo;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> productsRepo,
                                  IGenericRepository<ProductBrand> productbrandsRepo,
                                  IGenericRepository<ProductBrand> productTypesRepo,
                                  IMapper mapper) 
        {
            _productsRepo = productsRepo;
            _productbrandsRepo = productbrandsRepo;
            _productTypesRepo = productTypesRepo;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts([FromQuery]ProductSpecParams productParams)
        {
            //filter such as where,sort,paging
            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
            //only countwise spec
            var countSpec = new ProductWithFiltersForCountSpecification(productParams);
            var totalItems = await _productsRepo.CountAsync(countSpec);
            var products = await _productsRepo.ListAsync(spec);
            var data = _mapper
                .Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);

            return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex,
                              productParams.PageSize, totalItems, data));

        }
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse),StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            //here creating specification - include,and criteria(where)
            var spec = new ProductsWithTypesAndBrandsSpecification(id);

            //sending specification to method
            var product= await _productsRepo.GetEntityWithSpec(spec);
            if (product == null) return NotFound(new ApiResponse(404));
            return _mapper.Map<Product, ProductToReturnDto>(product);
        }
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            var productBrands = await _productbrandsRepo.ListAllAsync();
            return Ok(productBrands);
        }
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            var productTypes = await _productTypesRepo.ListAllAsync();
            return Ok(productTypes);
        }

    }
}
