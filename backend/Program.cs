using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SurisCode.Data;
using SurisCode.Entities;
using SurisCode.Entities.Immutable;

/*
Este programa asume que:
Solo se puede atender a un solo cliente independientemente del servicio.
No se puede tener dos citas el mismo dia pese a ser de distintos servicios.
*/
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSqlite<AppDbContext>(builder.Configuration.GetConnectionString("LOCAL"));
builder.Services.AddCors(cors => cors.AddDefaultPolicy(policy => 
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader()));

var app = builder.Build();
app.UseCors();

app.MapGet("/", () => "Reservation API is working!"); // Verificar si al api se en buen estado

app.MapGet("api/services", async (AppDbContext ctx) => Results.Json(await ctx.Services.ToArrayAsync())); // Devuelve los servicio
app.MapGet("/api/unavailable-dates", async (AppDbContext ctx) => 
{
    int totalTimeSlots = await ctx.Schedules.CountAsync(); // Obtener la cantidad total de horarios disponibles
    return Results.Ok(await ctx.Reservations.Where(r => r.Date >= DateOnly.FromDateTime(DateTime.Now))
        .GroupBy(r => r.Date) // Sea grupa por fecha
        .Where(g => g.Count() == totalTimeSlots) // Verifica que la cantidad de reservas esa fecha sea la maxima posible
        .Select(g => g.Key) // Selecciona solo las fechas
        .ToListAsync());
});
app.MapGet("/api/reservations", (AppDbContext ctx) => {
    return ctx.Reservations.Include(s => s.Service)
            .Select(r => new {
                r.Id, 
                r.ClientName,
                Service = r.Service!.Name, 
                r.Date, 
                Time = r.FK_Schedule 
                });
});
app.MapGet("/api/available-times", async (AppDbContext ctx, [FromQuery] DateOnly date) =>
{
    var allTimeSlots = await ctx.Schedules.Select(s => s.Time).ToListAsync();
    var reservedTimeSlots = await ctx.Reservations
        .Where(r => r.Date == date)
        .Select(r => r.FK_Schedule)
        .ToListAsync();
    return Results.Ok(
        allTimeSlots
        .Except(reservedTimeSlots)
        .ToList());
});
app.MapPost("/api/reservations", async (AppDbContext ctx, [FromBody] ReservationRecord reservation) => {
    try{
        if(await ctx.Reservations.AnyAsync(r => r.Date == reservation.Date && r.ClientName == reservation.ClientName))
            return Results.Conflict($"Client {reservation.ClientName} has already a reservation on {reservation.Date}.");
        ctx.Reservations.Add(new Reservation(){
            ClientName = reservation.ClientName,
            Date = reservation.Date,
            FK_Service = reservation.Service,
            FK_Schedule = reservation.Time
        });
        await ctx.SaveChangesAsync();
        return Results.Ok($"{reservation.ClientName} your shift has been successfully reserved on {reservation.Date} - {reservation.Time}.");
    }
    catch{
        return Results.Conflict($"Invalid data has been received.");
    }
});

app.Run(app.Configuration["Host"]);