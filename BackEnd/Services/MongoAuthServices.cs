using System.Collections.Generic;
using BackEnd.Interfaces;
using BackEnd.Models;
using MongoDB.Driver;

namespace BackEnd.Services
{
    public class MongoAuthServices : IUser
    {
        private readonly IMongoCollection<User> _user;

        public MongoAuthServices(IDatabaseSettings settings)
        {

            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            _user = database.GetCollection<User>(settings.CollectionName);
        }

        public void Delete(string id)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<User> Get()
        {
            List<User> data;
            data = _user.Find(data => true).ToList();
            return data;
        }

        public User GetById(string id)
        {
            throw new System.NotImplementedException();
        }

        public void Post(User body)
        {
            throw new System.NotImplementedException();
        }

        public void Update(string id, User body)
        {
            throw new System.NotImplementedException();
        }
    }
}