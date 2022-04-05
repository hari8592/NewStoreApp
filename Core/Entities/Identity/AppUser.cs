using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities.Identity
{
    public class AppUser:IdentityUser
    {
        //from IdentityUser we will get  properites
        public string DisplayName { get; set; }

        //User has single address
        public Address Address { get; set; }
    }
}
