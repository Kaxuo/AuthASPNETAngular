using System.Collections.Generic;
using BackEnd.Models;

namespace BackEnd.Data
{
    public class MockData : IUser
    {
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
            var items = new List<User>
            {
                new User { Id = 1, desc ="bob"}
            };
            return items;
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