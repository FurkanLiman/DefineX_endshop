using Microsoft.EntityFrameworkCore;
using AndShop.ProductService.Data;
using AndShop.ProductService.Models;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Navigasyon özellikleri için referans döngülerini yoksay
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        // Null değerleri yanıttan çıkar
        options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });

// CORS politikası ekleme - Vue.js uygulaması için
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVueApp",
        builder => builder
            .WithOrigins(
                "http://localhost:3000", 
                "http://localhost:3001", 
                "http://localhost:8080", 
                "http://localhost:8081",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:3001",
                "http://127.0.0.1:8080",
                "http://127.0.0.1:8081"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// SQL Server veritabanı ekleme
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseSqlServer(connectionString));

// AppDbContext'i servislere ekle
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// Swagger/OpenAPI ekleme
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS politikası uygulama
app.UseCors("AllowVueApp");

app.UseAuthorization();

app.MapControllers();

// Veritabanını ve tablolarını oluştur
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ProductDbContext>();
        // Veritabanı ve tablolarını oluştur
        context.Database.EnsureCreated();
        // Örnek verileri ekle
        DbInitializer.Initialize(context);

        // Uygulama başladığında veritabanı migration'ları otomatik uygulama kodu
        if (context.Database.IsSqlServer())
        {
            context.Database.Migrate();
            Console.WriteLine("Database migrations applied successfully.");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Veritabanı oluşturulurken bir hata oluştu.");
    }
}

app.Run(); 