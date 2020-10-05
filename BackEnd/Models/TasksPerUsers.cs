using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class TasksPerUsers
    {
        public string Role { get; set; }
        [Key]
        public string Description { get; set; }
        public string Username { get; set; }
    }
}