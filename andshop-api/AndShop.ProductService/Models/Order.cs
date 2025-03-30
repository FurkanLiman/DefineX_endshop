using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AndShop.ProductService.Models
{
    public class Order
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        // Sipariş adresi
        public int? AddressId { get; set; }

        //[MaxLength(50)]
        //public string Status { get; set; } = "Beklemede";

        [MaxLength(50)]
        public string OrderStatus { get; set; } = "Beklemede";

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? DiscountAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ShippingCost { get; set; }

        [MaxLength(50)]
        public string? PaymentMethod { get; set; }

        [MaxLength(50)]
        public string? PaymentStatus { get; set; } = "Beklemede";

        [MaxLength(100)]
        public string? TrackingNumber { get; set; }

        //[MaxLength(255)]
        //public string? Notes { get; set; }

        [MaxLength(50)]
        public string? CouponCode { get; set; }

        // Ödeme ve teslimat bilgileri
        /*
        public DateTime? PaymentDate { get; set; }
        
        public DateTime? ShippingDate { get; set; }
        
        public DateTime? DeliveryDate { get; set; }
        
        public DateTime? CancelDate { get; set; }
        
        [MaxLength(255)]
        public string? CancellationReason { get; set; }
        
        [MaxLength(100)]
        public string? CarrierName { get; set; }
        
        [MaxLength(100)]
        public string? InvoiceNumber { get; set; }*/

        // Navigation properties
        public virtual User? User { get; set; }
        
        public virtual Address? Address { get; set; }
        
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
} 