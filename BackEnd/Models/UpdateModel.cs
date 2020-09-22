namespace BackEnd.Models
{
    public class UpdateModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public int Number { get; set; }
        public string City { get; set; }
        public string Hobby { get; set; }
        public string Country { get; set; }

        public Task Tasks { get; set; }
    }
}