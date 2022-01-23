using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public interface ISpecification<T>
    {
        //where
        Expression<Func<T, bool>> Criteria { get; }

        //include other properties such object such as ProductType,ProductBrand
        List<Expression<Func<T,object>>> Includes { get; }

        //sort
        Expression<Func<T,object>> OrderBy { get; }
        Expression<Func<T, object>> OrderByDescending { get; }

        //pagination
        int Take { get; }
        int Skip { get; }
        bool IsPagingEnabled { get; }

    }
}
