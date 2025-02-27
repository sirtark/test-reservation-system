using System.ComponentModel.DataAnnotations;

namespace SurisCode.Entities{
    public class Service{
        [Key]
        public int Id { get; set; }
        public required string Name{ get; set; }
    }
}