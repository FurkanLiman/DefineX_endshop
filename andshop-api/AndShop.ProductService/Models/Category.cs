using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AndShop.ProductService.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        [MaxLength(255)]
        public string? ImageUrl { get; set; }

        // Navigation Properties
        [JsonIgnore] // API cevaplarında döngüsel referansı önle
        public virtual ICollection<Product>? Products { get; set; }
    }
} 