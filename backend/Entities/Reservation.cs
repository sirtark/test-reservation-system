using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SurisCode.Entities
{
    [Index(nameof(FK_Service), nameof(Date), nameof(FK_Schedule), IsUnique = true)]
    public class Reservation
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required string ClientName { get; set; }
        public DateOnly Date { get; set; }
        [ForeignKey(nameof(FK_Service))] public Service? Service { get; set; } 
        [Required] public int FK_Service { get; set; }

        [ForeignKey(nameof(FK_Schedule))] public Schedule? Schedule { get; set; }
        [Required] public required string FK_Schedule { get; set; }
    }
    namespace Immutable{
        internal record ReservationRecord(string ClientName, int Service, DateOnly Date, string Time);
    }
}