using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Task
    {
        [Key]
        public int TaskId { get; set; }
        public string Description { get; set; }
        public bool Completed { get; set; }
        public bool Importance { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}