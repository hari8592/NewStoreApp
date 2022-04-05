using System.ComponentModel.DataAnnotations;

namespace Core.Entities.Identity
{
    public class Address
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }

        //we want this related to user
        //ef create 1-1 relation correctly for us
        //gives this particular table a foreign key constraint
        //what we dont want to do is allow this to be null in the db
        //because string is by defualt
        [Required]
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}