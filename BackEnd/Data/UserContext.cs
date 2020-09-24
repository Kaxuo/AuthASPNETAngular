using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> opt) : base(opt)
        {
        }

        public UserContext()
        {
        }

        // protected override void OnModelCreating(ModelBuilder modelBuilder)
        // {
        //     modelBuilder.Entity<Task>()
        //         .HasOne<User>(s => s.User)
        //         .WithMany(e => e.Tasks)
        //         .HasForeignKey(s => s.UserId)
        //         .OnDelete(DeleteBehavior.Cascade)
        //         .IsRequired();
        // }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasMany<Task>(s => s.Tasks)
                .WithOne(e => e.User)
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        }



        public DbSet<User> Users { get; set; }
        public DbSet<Task> Tasks { get; set; }
    }
}