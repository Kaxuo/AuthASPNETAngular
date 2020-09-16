namespace BackEnd.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }

        public int Number { get; set; }
        public string City { get; set; }
        public string Hobby { get; set; }
        public string Country { get; set; }
    }
}