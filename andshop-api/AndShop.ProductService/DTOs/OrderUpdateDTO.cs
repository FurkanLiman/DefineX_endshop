using System;
using System.ComponentModel.DataAnnotations;

namespace AndShop.ProductService.DTOs
{
    public class OrderUpdateDTO
    {
        [Required]
        public int Id { get; set; }
        
        // Adres ID (değiştirilmek istenirse)
        public int? AddressId { get; set; }
        
        // Durum bilgileri
        public string Status { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentStatus { get; set; }
        
        // Takip ve lojistik bilgileri
        public string TrackingNumber { get; set; }
        public string CarrierName { get; set; }
        public string InvoiceNumber { get; set; }
        
        // Notlar ve iptal bilgileri
        public string Notes { get; set; }
        public string CancellationReason { get; set; }
        
        // Tarih bilgileri
        public DateTime? PaymentDate { get; set; }
        public DateTime? ShippingDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public DateTime? CancelDate { get; set; }
    }
} 