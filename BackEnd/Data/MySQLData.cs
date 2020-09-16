using System.Collections.Generic;
using System.Linq;
using BackEnd.Models;

namespace BackEnd.Data
{
    public class MySQLData : IUser
    {

        private readonly UserContext _context;

        public MySQLData(UserContext context)
        {
            _context = context;
        }

        public User Authenticate(string username, string password)
        {
            throw new System.NotImplementedException();
        }

        public User CreateUser(User user, string password)
        {
            throw new System.NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<User> GetAllUsers()
        {
             return _context.Users.ToList();
        }

        public User GetUserById(int id)
        {
            throw new System.NotImplementedException();
        }

        public bool SaveChanges()
        {
            throw new System.NotImplementedException();
        }

        public void Update(User user, string password = null)
        {
            throw new System.NotImplementedException();
        }
    }
}