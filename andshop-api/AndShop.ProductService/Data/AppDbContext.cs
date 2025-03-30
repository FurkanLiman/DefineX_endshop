using Microsoft.EntityFrameworkCore;
using AndShop.ProductService.Models;

namespace AndShop.ProductService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Coupon> Coupons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Kupon alanları için özel ayarlar
            modelBuilder.Entity<Coupon>()
                .Property(c => c.IsActive)
                .HasDefaultValue(true);

            modelBuilder.Entity<Coupon>()
                .Property(c => c.UsageCount)
                .HasDefaultValue(0);

            modelBuilder.Entity<Coupon>()
                .Property(c => c.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            // Kupon kodu için benzersiz index
            modelBuilder.Entity<Coupon>()
                .HasIndex(c => c.Code)
                .IsUnique();
        }
    }
} 