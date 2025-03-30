using AndShop.ProductService.Models;

namespace AndShop.ProductService.DTOs
{
    public class CouponValidationResponseDto
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public Coupon Coupon { get; set; }
        public decimal DiscountAmount { get; set; }
    }
} 