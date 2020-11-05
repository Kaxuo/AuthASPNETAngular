using System;
namespace BackEnd.Hub
{
    public class Model
    {
        public string user { get; set; }
        public string message { get; set; }
        public DateTime created { get; set; } = DateTime.Now;
    }
}