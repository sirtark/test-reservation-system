using System.ComponentModel.DataAnnotations;

namespace SurisCode.Entities{
    public class Schedule
    {
        [Key]
        public required string Time { get; set; }
    }
}