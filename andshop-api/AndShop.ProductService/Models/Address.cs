using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AndShop.ProductService.Models
{
    public class Address
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public string Title { get; set; } = string.Empty; // Ev Adresi, İş Adresi vb.

        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required, MaxLength(20)]
        public string Phone { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string District { get; set; } = string.Empty;

        [Required, MaxLength(500)]
        public string AddressDetail { get; set; } = string.Empty;

        [MaxLength(20)]
        public string ZipCode { get; set; } = string.Empty;

        public bool IsDefault { get; set; } = false;

        // Navigasyon özellikleri
        [JsonIgnore]
        [ForeignKey("UserId")]
        public virtual User? User { get; set; } = null;
        
        // Order ilişkisi
        [JsonIgnore]
        public virtual ICollection<Order>? Orders { get; set; }
    }
} 