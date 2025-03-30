using Microsoft.EntityFrameworkCore;
using AndShop.ProductService.Models;

namespace AndShop.ProductService.Data
{
    public class ProductDbContext : DbContext
    {
        public ProductDbContext(DbContextOptions<ProductDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<Address> Addresses { get; set; } = null!;
        public DbSet<Coupon> Coupons { get; set; } = null!;
        public DbSet<Review> Reviews { get; set; } = null!;

        // Modelleri ve ilişkileri yapılandırma
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Kompleks tipleri (array) yapılandırma
            modelBuilder.Entity<Product>()
                .Property(p => p.Sizes)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));

            modelBuilder.Entity<Product>()
                .Property(p => p.Colors)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries));

            // Product - Category ilişkisi
            modelBuilder.Entity<Product>()
                .HasOne(p => p.CategoryNavigation)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId);

            // Order - User ilişkisi
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId);

            // OrderItem - Order ilişkisi
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // OrderItem - Product ilişkisi
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(oi => oi.ProductId);

            // Address - User ilişkisi
            modelBuilder.Entity<Address>()
                .HasOne(a => a.User)
                .WithMany(u => u.Addresses)
                .HasForeignKey(a => a.UserId);

            // Review - Product ilişkisi
            modelBuilder.Entity<Review>()
                .HasOne(r => r.Product)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.ProductId);

            // Review - User ilişkisi
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId);

            // Her kullanıcı için yalnızca bir varsayılan adres olabilir
            modelBuilder.Entity<Address>()
                .HasIndex(a => new { a.UserId, a.IsDefault })
                .IsUnique()
                .HasFilter("IsDefault = 1");

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