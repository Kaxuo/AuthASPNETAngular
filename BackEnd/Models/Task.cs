using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Task
    {
        [Key]
        public int TaskId { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public bool Completed { get; set; }
        [Required]
        public bool Importance { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public User User { get; set; }
    }
}