using BackEnd.Models;
using System.Collections.Generic;

namespace BackEnd.Data
{
    public interface IUser
    {
        bool SaveChanges();
        User Authenticate(string username,string password);
        IEnumerable<User> GetAllUsers();
        User GetUserById(int id);
        User CreateUser(User user, string password);
        void Update(User user, string password = null);
        void Delete(int id);

    }
}