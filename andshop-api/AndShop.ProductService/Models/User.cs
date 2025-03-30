using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AndShop.ProductService.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required, MaxLength(100), EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? Phone { get; set; }

        [MaxLength(255)]
        public string? Avatar { get; set; }

        [Required, MaxLength(20)]
        public string Role { get; set; } = "User";
        
        // Cinsiyet alanı (male, female, other)
        [MaxLength(10)]
        public string? Gender { get; set; }
        
        // Doğum tarihi
        public DateTime? Birthday { get; set; }
        
        // Favorileri JSON formatında saklanan favori ürünler
        public string? Favorites { get; set; }

        // Navigation Properties
        [JsonIgnore] // API cevaplarında döngüsel referansı önle
        public virtual ICollection<Order>? Orders { get; set; }

        [JsonIgnore]
        public virtual ICollection<Address>? Addresses { get; set; }

        [JsonIgnore]
        public virtual ICollection<Review>? Reviews { get; set; }
    }
} 