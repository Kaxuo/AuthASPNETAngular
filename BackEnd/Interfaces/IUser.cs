using System.Collections.Generic;
using BackEnd.Models;

namespace BackEnd.Interfaces
{
    public interface IUser
    {
        IEnumerable<User> Get();
        User GetById(string id);
        void Post(User body);
        void Update(string id, User body);
        void Delete(string id);
    }
}