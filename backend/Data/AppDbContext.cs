using Microsoft.EntityFrameworkCore;
using SurisCode.Entities;

#pragma warning disable
namespace SurisCode.Data;
public sealed class AppDbContext(DbContextOptions options) : DbContext(options){ // Ctor principal
    internal DbSet<Reservation> Reservations { get; set; }
    internal DbSet<Service> Services { get; set; }
    internal DbSet<Schedule> Schedules { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Reservation>().ToTable("Reservations");
        modelBuilder.Entity<Service>().ToTable("Services").HasData([
            new Service(){ Id = 1, Name = "Kinesiologia" },
            new Service(){ Id = 2, Name = "Psicología" },
            new Service(){ Id = 3, Name = "Nutrición" },
            new Service(){ Id = 4, Name = "Osteopatía" } /* Todo esto que obviamente se podria 
                                                          * gestionar desde un administrador que
                                                          * podria agregar otros nuevos servicios */ 
            ]);
        modelBuilder.Entity<Schedule>().ToTable("Schedules").HasData([
            new Schedule(){ Time = "11:00" }, /* DEBUG ONLY Existe la posibilidad de que el sistema pueda
                                                            ampliar su horario de atención */
            new Schedule(){ Time = "12:00" },
            new Schedule(){ Time = "13:00" },
            new Schedule(){ Time = "14:00" },
            new Schedule(){ Time = "15:00" },
            new Schedule(){ Time = "16:00" },
            new Schedule(){ Time = "17:00" }
        ]);
    }
}