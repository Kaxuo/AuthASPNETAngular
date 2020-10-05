using System.Collections;
using System;
using System.Collections.Generic;
using System.Linq;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class MySQLMethods : IUser
    {

        protected readonly UserContext _context;
        public MySQLMethods(UserContext context)
        {
            _context = context;
        }

        public User Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;
            var user = _context.Users.SingleOrDefault(x => x.Username == username);
            if (user == null)
                return null;
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;
            return user;
        }

        public User CreateUser(User user, string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");
            if (_context.Users.Any(x => x.Username == user.Username))
                throw new AppException($"Username {user.Username} is already taken");
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }

        public void Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users.Include(s => s.Tasks);
        }

        public User GetUserById(int id)
        {
            var user = _context.Users.Include(s => s.Tasks).FirstOrDefault(s => s.Id == id);
            return user;
        }

        public void Update(User userParam)
        {
            var user = _context.Users.Find(userParam.Id);
            if (user == null)
                throw new AppException("User not found");
            // update username if it has changed
            if (!string.IsNullOrWhiteSpace(userParam.Username) && userParam.Username != user.Username)
            {
                // throw error if the new username is already taken
                if (_context.Users.Any(x => x.Username == userParam.Username))
                    throw new AppException($"Username {userParam.Username} is already taken");
                user.Username = userParam.Username.Trim();
            }
            // update user properties if provided
            if (!string.IsNullOrWhiteSpace(userParam.FirstName))
                user.FirstName = userParam.FirstName;

            if (!string.IsNullOrWhiteSpace(userParam.LastName))
                user.LastName = userParam.LastName;

            if (userParam.Number != 0)
                user.Number = userParam.Number;

            if (!string.IsNullOrWhiteSpace(userParam.Country))
                user.Country = userParam.Country;

            if (!string.IsNullOrWhiteSpace(userParam.City))
                user.City = userParam.City;

            if (!string.IsNullOrWhiteSpace(userParam.Hobby))
                user.Hobby = userParam.Hobby;

            _context.Users.Update(user);
            _context.SaveChanges();
        }

        // Task Handling //
        public IEnumerable<Task> GetAllTasks(int id)
        {
            var tasks = _context.Tasks.Where(x => x.UserId == id);
            return tasks;
        }
        public Task GetOneTask(int id, int taskId)
        {
            var user = _context.Users.Include(s => s.Tasks).FirstOrDefault(s => s.Id == id);
            var task = user.Tasks.FirstOrDefault(x => x.TaskId == taskId);
            return task;
        }
        public IEnumerable<Task> AddTask(int id, Task task)
        {
            var user = _context.Users.Find(id);
            user.Tasks.Add(task);
            _context.Update(user);
            _context.SaveChanges();
            return user.Tasks;
        }

        public void DeleteTask(int id, int TaskId)
        {
            var user = _context.Users.Find(id);
            var task = _context.Tasks.Find(TaskId);
            if (task != null && user.Id == task.UserId)
            {
                _context.Tasks.Remove(task);
                _context.SaveChanges();
            }
        }

        public Task EditTask(int id, int taskId, TaskModel newtask)
        {
            var user = _context.Users.Include(s => s.Tasks).FirstOrDefault(s => s.Id == id);
            var task = user.Tasks.FirstOrDefault(x => x.TaskId == taskId);
            if (task == null)
                throw new AppException("Task do not exist");
            if (task.Description != newtask.Description)
                task.Description = newtask.Description;
            if (task.Completed != newtask.Completed)
                task.Completed = newtask.Completed;
            if (task.Importance != newtask.Importance)
                task.Importance = newtask.Importance;
            _context.Update(task);
            _context.SaveChanges();
            return task;
        }

        // private helper methods
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }
            return true;
        }
    }
}

