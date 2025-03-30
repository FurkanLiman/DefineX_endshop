using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AndShop.ProductService.Data;
using AndShop.ProductService.Models;
using AndShop.ProductService.DTOs;

namespace AndShop.ProductService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponsController : ControllerBase
    {
        private readonly ProductDbContext _context;

        public CouponsController(ProductDbContext context)
        {
            _context = context;
        }

        // GET: api/Coupons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Coupon>>> GetCoupons()
        {
            return await _context.Coupons.ToListAsync();
        }

        // GET: api/Coupons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Coupon>> GetCoupon(int id)
        {
            var coupon = await _context.Coupons.FindAsync(id);

            if (coupon == null)
            {
                return NotFound();
            }

            return coupon;
        }

        // GET: api/Coupons/validate/CODE123?amount=100
        [HttpGet("validate/{code}")]
        public async Task<ActionResult<CouponValidationResponseDto>> ValidateCoupon(string code, [FromQuery] decimal amount)
        {
            Console.WriteLine($"Kupon doğrulama isteği: Kod={code}, Tutar={amount}");
            
            if (string.IsNullOrWhiteSpace(code))
            {
                Console.WriteLine("Hata: Kupon kodu boş");
                return BadRequest(new { message = "Kupon kodu boş olamaz" });
            }
            
            code = code.Trim().ToUpper();
            
            try 
            {
                var coupon = await _context.Coupons
                    .Where(c => c.Code.ToUpper() == code && c.IsActive)
                    .FirstOrDefaultAsync();

                if (coupon == null)
                {
                    Console.WriteLine($"Hata: {code} kodlu kupon bulunamadı");
                    return NotFound(new { message = "Kupon bulunamadı" });
                }

                Console.WriteLine($"Kupon bulundu: {coupon.Code} - {coupon.Description}");

                // Kuponun geçerliliğini kontrol et
                var response = new CouponValidationResponseDto
                {
                    IsValid = true,
                    Coupon = coupon
                };

                // Tarih kontrolü
                var now = DateTime.Now;
                if (coupon.StartDate.HasValue && coupon.StartDate > now)
                {
                    Console.WriteLine($"Kupon henüz aktif değil. Başlangıç: {coupon.StartDate}");
                    response.IsValid = false;
                    response.Message = "Bu kupon henüz aktif değil";
                    return response;
                }

                if (coupon.EndDate.HasValue && coupon.EndDate < now)
                {
                    Console.WriteLine($"Kupon süresi doldu. Bitiş: {coupon.EndDate}");
                    response.IsValid = false;
                    response.Message = "Bu kuponun süresi dolmuş";
                    return response;
                }

                // Kullanım limiti kontrolü
                if (coupon.UsageLimit.HasValue && coupon.UsageCount >= coupon.UsageLimit)
                {
                    Console.WriteLine($"Kupon kullanım limiti aşıldı. Limit: {coupon.UsageLimit}, Kullanım: {coupon.UsageCount}");
                    response.IsValid = false;
                    response.Message = "Bu kupon maksimum kullanım limitine ulaşmış";
                    return response;
                }

                // Minimum sepet tutarı kontrolü
                if (coupon.MinimumOrderAmount.HasValue && amount < coupon.MinimumOrderAmount)
                {
                    Console.WriteLine($"Sepet tutarı minimum tutardan düşük. Minimum: {coupon.MinimumOrderAmount}, Sepet: {amount}");
                    response.IsValid = false;
                    response.Message = $"Bu kuponu kullanmak için minimum sepet tutarı: ₺{coupon.MinimumOrderAmount}";
                    return response;
                }

                // İndirim tutarını hesapla
                decimal discountAmount = 0;
                if (coupon.DiscountType == 1) // Sabit indirim
                {
                    discountAmount = coupon.DiscountValue;
                    Console.WriteLine($"Sabit indirim: ₺{discountAmount}");
                }
                else if (coupon.DiscountType == 2) // Yüzde indirim
                {
                    discountAmount = amount * coupon.DiscountValue / 100;
                    Console.WriteLine($"Yüzde indirim: %{coupon.DiscountValue} = ₺{discountAmount}");
                    
                    // Maksimum indirim tutarı kontrolü
                    if (coupon.MaximumDiscountAmount.HasValue && discountAmount > coupon.MaximumDiscountAmount)
                    {
                        Console.WriteLine($"Maksimum indirim tutarına sınırlandı: ₺{coupon.MaximumDiscountAmount}");
                        discountAmount = coupon.MaximumDiscountAmount.Value;
                    }
                }

                response.DiscountAmount = discountAmount;
                Console.WriteLine($"Kupon doğrulama başarılı. Tutar: ₺{discountAmount}");
                return response;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Kupon doğrulama hatası: {ex.Message}");
                return StatusCode(500, new { message = "Kupon doğrulanırken bir hata oluştu", error = ex.Message });
            }
        }

        // POST: api/Coupons
        [HttpPost]
        public async Task<ActionResult<Coupon>> CreateCoupon(Coupon coupon)
        {
            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCoupon", new { id = coupon.Id }, coupon);
        }

        // PUT: api/Coupons/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCoupon(int id, Coupon coupon)
        {
            if (id != coupon.Id)
            {
                return BadRequest();
            }

            coupon.UpdatedAt = DateTime.Now;
            _context.Entry(coupon).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CouponExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Coupons/use/5
        [HttpPost("use/{id}")]
        public async Task<IActionResult> UseCoupon(int id)
        {
            var coupon = await _context.Coupons.FindAsync(id);
            if (coupon == null)
            {
                return NotFound();
            }

            coupon.UsageCount++;
            coupon.UpdatedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Coupons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            var coupon = await _context.Coupons.FindAsync(id);
            if (coupon == null)
            {
                return NotFound();
            }

            _context.Coupons.Remove(coupon);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CouponExists(int id)
        {
            return _context.Coupons.Any(e => e.Id == id);
        }
    }
} 