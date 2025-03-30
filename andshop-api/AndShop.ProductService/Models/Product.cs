using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AndShop.ProductService.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountPrice { get; set; }

        // Kategori ilişkisi
        public int? CategoryId { get; set; }

        [MaxLength(100)]
        public string Category { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Image { get; set; } = string.Empty;

        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        public string[] Sizes { get; set; } = Array.Empty<string>();

        public string[] Colors { get; set; } = Array.Empty<string>();

        [Column(TypeName = "decimal(18,2)")]
        public decimal Discount { get; set; }

        public bool IsSale => Discount > 0;

        [MaxLength(100)]
        public string Collection { get; set; } = string.Empty;

        public int Stock { get; set; }

        [Column(TypeName = "decimal(3,1)")]
        public decimal Rating { get; set; }

        public bool New { get; set; }

        public bool Hot { get; set; }

        [MaxLength(100)]
        public string Brand { get; set; } = string.Empty;

        // Navigation properties
        public virtual Category? CategoryNavigation { get; set; }
        
        [JsonIgnore] // API cevaplarında döngüsel referansı önle
        public virtual ICollection<OrderItem>? OrderItems { get; set; }
        
        [JsonIgnore] // API cevaplarında döngüsel referansı önle
        public virtual ICollection<Review>? Reviews { get; set; }
    }
} 