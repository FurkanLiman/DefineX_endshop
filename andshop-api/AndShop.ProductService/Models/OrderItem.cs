using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AndShop.ProductService.Models
{
    public class OrderItem
    {
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int Quantity { get; set; } = 1;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [MaxLength(50)]
        public string? Size { get; set; }

        [MaxLength(50)]
        public string? Color { get; set; }

        // Navigation properties - nullable olarak işaretlendi
        [JsonIgnore] // Serialization döngüsünü önlemek için
        public virtual Order? Order { get; set; }
        
        public virtual Product? Product { get; set; }
    }
} 