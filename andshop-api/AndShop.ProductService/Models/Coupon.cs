using System;
using System.ComponentModel.DataAnnotations;

namespace AndShop.ProductService.Models
{
    public class Coupon
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(20)]
        public string Code { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Description { get; set; }
        
        // İndirim tipi: 1 = Sabit indirim, 2 = Yüzde indirim
        [Required]
        public int DiscountType { get; set; }
        
        // İndirim değeri: Sabit indirim için TL değeri, Yüzde indirim için % değeri
        [Required]
        public decimal DiscountValue { get; set; }
        
        // Minimum sepet tutarı (bu tutarın üzerindeki siparişlerde geçerli)
        public decimal? MinimumOrderAmount { get; set; }
        
        // Maksimum indirim tutarı (sadece yüzde indirim için, opsiyonel)
        public decimal? MaximumDiscountAmount { get; set; }
        
        // Kuponun aktif olup olmadığı
        public bool IsActive { get; set; } = true;
        
        // Kuponun başlangıç tarihi
        public DateTime? StartDate { get; set; }
        
        // Kuponun bitiş tarihi
        public DateTime? EndDate { get; set; }
        
        // Kullanım sayısı limiti
        public int? UsageLimit { get; set; }
        
        // Şu ana kadar kullanım sayısı
        public int UsageCount { get; set; } = 0;
        
        // Oluşturulma tarihi
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        // Güncellenme tarihi
        public DateTime? UpdatedAt { get; set; }
    }
} 