using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AndShop.ProductService.Data;
using AndShop.ProductService.Models;
using AndShop.ProductService.DTOs;

namespace AndShop.ProductService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ProductDbContext _context;

        public OrdersController(ProductDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Address)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.Address)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        // GET: api/Orders/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByUserId(int userId)
        {
            // Önce kullanıcının varlığını kontrol et
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı");
            }

            // Kullanıcının siparişlerini getir
            var orders = await _context.Orders
                .Include(o => o.Address)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders;
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<Order>> PostOrder(OrderDTO orderDTO)
        {
            if (orderDTO == null || orderDTO.OrderItems == null || !orderDTO.OrderItems.Any())
            {
                return BadRequest("Sipariş verileri geçersiz veya sepette ürün yok");
            }

            try
            {
                // Kullanıcı kontrolü
                var user = await _context.Users.FindAsync(orderDTO.UserId);
                if (user == null)
                {
                    return BadRequest($"Kullanıcı bulunamadı (ID: {orderDTO.UserId})");
                }

                // Adres kontrolü
                if (!orderDTO.AddressId.HasValue || orderDTO.AddressId.Value <= 0)
                {
                    return BadRequest("Sipariş için geçerli bir adres bilgisi gereklidir");
                }

                var address = await _context.Addresses.FindAsync(orderDTO.AddressId.Value);
                if (address == null)
                {
                    return BadRequest($"Belirtilen adres bulunamadı (ID: {orderDTO.AddressId})");
                }

                // Yeni sipariş oluştur
                var order = new Order
                {
                    UserId = orderDTO.UserId,
                    AddressId = orderDTO.AddressId,
                    OrderDate = DateTime.UtcNow,
                    OrderStatus = "Beklemede",
                    PaymentMethod = orderDTO.PaymentMethod,
                    PaymentStatus = "Beklemede",
                    CouponCode = orderDTO.CouponCode
                };

                // Sipariş öğelerini ekle ve toplam tutarı hesapla
                decimal totalAmount = 0;
                decimal? discountAmount = 0;

                foreach (var itemDTO in orderDTO.OrderItems)
                {
                    var product = await _context.Products.FindAsync(itemDTO.ProductId);
                    if (product == null)
                    {
                        return BadRequest($"Ürün bulunamadı (ID: {itemDTO.ProductId})");
                    }

                    if (product.Stock < itemDTO.Quantity)
                    {
                        return BadRequest($"Yetersiz stok: '{product.Title}' ürünü için {itemDTO.Quantity} adet talep edildi ama stokta {product.Stock} adet var");
                    }

                    var orderItem = new OrderItem
                    {
                        ProductId = product.Id,
                        Quantity = itemDTO.Quantity,
                        Price = product.Price,
                        Size = itemDTO.Size,
                        Color = itemDTO.Color
                    };

                    order.OrderItems.Add(orderItem);
                    totalAmount += product.Price * itemDTO.Quantity;

                    // Stok miktarını güncelle
                    product.Stock -= itemDTO.Quantity;
                }

                // Kupon varsa indirim uygula
                if (!string.IsNullOrEmpty(orderDTO.CouponCode))
                {
                    var coupon = await _context.Coupons
                        .FirstOrDefaultAsync(c => c.Code == orderDTO.CouponCode && c.IsActive);

                    if (coupon != null && coupon.EndDate > DateTime.UtcNow)
                    {
                        if (coupon.MinimumOrderAmount <= totalAmount)
                        {
                            if (coupon.DiscountType == 2) // Yüzde indirim
                            {
                                discountAmount = totalAmount * (coupon.DiscountValue / 100);
                                if (coupon.MaximumDiscountAmount.HasValue && discountAmount > coupon.MaximumDiscountAmount)
                                {
                                    discountAmount = coupon.MaximumDiscountAmount;
                                }
                            }
                            else // Sabit indirim
                            {
                                discountAmount = coupon.DiscountValue;
                            }

                            // Kullanım sayısını artır
                            coupon.UsageCount += 1;
                            _context.Coupons.Update(coupon);
                        }
                    }
                }

                // Toplam tutarı ve indirim miktarını güncelle
                order.TotalAmount = totalAmount;
                order.DiscountAmount = discountAmount;

                // Kargo ücreti ekle (sabit veya hesaplanan)
                order.ShippingCost = 10.00m; // Örnek olarak sabit bir değer

                // Sipariş toplam tutarını güncelle (indirim ve kargo dahil)
                order.TotalAmount = totalAmount - (discountAmount ?? 0) + (order.ShippingCost ?? 0);

                // Siparişi kaydet
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Kaydedilen siparişi navigasyon özellikleriyle birlikte getir
                var createdOrder = await _context.Orders
                    .Include(o => o.User)
                    .Include(o => o.Address)
                    .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                    .FirstOrDefaultAsync(o => o.Id == order.Id);

                return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
            }
            catch (Exception ex)
            {
                return BadRequest($"Sipariş oluşturulurken hata: {ex.Message}");
            }
        }
        
        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderUpdateDTO orderUpdateDTO)
        {
            if (id != orderUpdateDTO.Id)
            {
                return BadRequest("Sipariş ID'leri eşleşmiyor");
            }

            var existingOrder = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (existingOrder == null)
            {
                return NotFound($"Sipariş bulunamadı (ID: {id})");
            }

            try
            {
                // Adres güncellemesi
                if (orderUpdateDTO.AddressId.HasValue && orderUpdateDTO.AddressId != existingOrder.AddressId)
                {
                    var address = await _context.Addresses.FindAsync(orderUpdateDTO.AddressId.Value);
                    if (address == null)
                    {
                        return BadRequest($"Adres bulunamadı (ID: {orderUpdateDTO.AddressId})");
                    }
                    
                    existingOrder.AddressId = orderUpdateDTO.AddressId;
                }

                // Sipariş durum güncellemeleri
                if (!string.IsNullOrEmpty(orderUpdateDTO.OrderStatus))
                    existingOrder.OrderStatus = orderUpdateDTO.OrderStatus;
                
                if (!string.IsNullOrEmpty(orderUpdateDTO.PaymentStatus))
                    existingOrder.PaymentStatus = orderUpdateDTO.PaymentStatus;

                // Diğer sipariş detayları güncellemeleri
                if (!string.IsNullOrEmpty(orderUpdateDTO.TrackingNumber))
                    existingOrder.TrackingNumber = orderUpdateDTO.TrackingNumber;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.Id == id);
        }
    }
} 