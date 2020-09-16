using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> opt): base(opt)
        {

        }

        public DbSet<User> Users { get ; set; }
    }
}