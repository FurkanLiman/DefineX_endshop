using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AndShop.ProductService.Models;

namespace AndShop.ProductService.DTOs
{
    public class OrderDTO
    {
        [Required]
        public int UserId { get; set; }

        public int? AddressId { get; set; }

        [MaxLength(50)]
        public string? PaymentMethod { get; set; }

        [MaxLength(50)]
        public string? CouponCode { get; set; }
        
        [Required]
        public List<OrderItemDTO> OrderItems { get; set; } = new List<OrderItemDTO>();
    }
    
    public class OrderItemDTO
    {
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        public int Quantity { get; set; } = 1;
        
        [MaxLength(50)]
        public string? Size { get; set; }
        
        [MaxLength(50)]
        public string? Color { get; set; }
    }
} 