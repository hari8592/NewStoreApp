using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Errors
{
    public class ApiException : ApiResponse
    {

        //as base having paramterized ctor so we have to provide derived class ctor
        public ApiException(int statusCode, string message = null,string details=null)
                           : base(statusCode, message)
        {
            Details = details;
        }

        public string Details { get; set; }

    }
}
