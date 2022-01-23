using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class ProductSpecParams
    {
        private const int MaxPageSize = 50;
        //setting pageindex default as 1
        //i.e very first page
        public int PageIndex { get; set; } = 1;


        private int _pageSize = 6;
        public int PageSize
        {
            get => _pageSize;
            //if value is greater than 50 it will take max 50 as size else value will be less than 50
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        public int? BrandId { get; set; }
        public int? TypeId { get; set; }
        public string Sort { get; set; }

        private string _search;

        public string Search
        {
            get => _search;
            set => _search = value.ToLower();
        }
    }
}
