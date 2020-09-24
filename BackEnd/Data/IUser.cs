using BackEnd.Models;
using System.Collections.Generic;

namespace BackEnd.Data
{
    public interface IUser
    {
        User Authenticate(string username,string password);
        IEnumerable<User> GetAllUsers();
        User GetUserById(int id);
        IEnumerable<Task> GetAllTasks(int id);
        IEnumerable<Task> AddTask(int id, Task task);
        Task EditTask(int id, int taskId, TaskModel task);
        void DeleteTask(int id, int TaskId);
        User CreateUser(User user, string password);
        void Update(User user);
        void Delete(int id);

    }
}