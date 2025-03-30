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
    public class ReviewsController : ControllerBase
    {
        private readonly ProductDbContext _context;

        public ReviewsController(ProductDbContext context)
        {
            _context = context;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.IsApproved)
                .ToListAsync();
                
            return reviews.Select(r => new ReviewResponseDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                UserId = r.UserId,
                UserName = $"{r.User.FirstName} {r.User.LastName}",
                Rating = r.Rating,
                Title = r.Title,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList();
        }

        // GET: api/Reviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewResponseDto>> GetReview(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
            {
                return NotFound();
            }

            return new ReviewResponseDto
            {
                Id = review.Id,
                ProductId = review.ProductId,
                UserId = review.UserId,
                UserName = $"{review.User.FirstName} {review.User.LastName}",
                Rating = review.Rating,
                Title = review.Title,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }

        // GET: api/Reviews/Product/5
        [HttpGet("Product/{productId}")]
        public async Task<ActionResult<IEnumerable<ReviewResponseDto>>> GetProductReviews(int productId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.ProductId == productId && r.IsApproved)
                .ToListAsync();
                
            return reviews.Select(r => new ReviewResponseDto
            {
                Id = r.Id,
                ProductId = r.ProductId,
                UserId = r.UserId,
                UserName = $"{r.User.FirstName} {r.User.LastName}",
                Rating = r.Rating,
                Title = r.Title,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList();
        }

        // POST: api/Reviews
        [HttpPost]
        public async Task<ActionResult<ReviewResponseDto>> PostReview(ReviewCreateDto reviewDto)
        {
            // Ürün var mı kontrol et
            var product = await _context.Products.FindAsync(reviewDto.ProductId);
            if (product == null)
            {
                return BadRequest("Ürün bulunamadı");
            }

            // Kullanıcı var mı kontrol et
            var user = await _context.Users.FindAsync(reviewDto.UserId);
            if (user == null)
            {
                return BadRequest("Kullanıcı bulunamadı");
            }

            // Yeni yorum oluştur
            var review = new Review
            {
                ProductId = reviewDto.ProductId,
                UserId = reviewDto.UserId,
                Rating = reviewDto.Rating,
                Title = reviewDto.Title,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow,
                IsApproved = true // Otomatik onaylanabilir veya admin onayına bağlanabilir
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // Ürünün ortalama puanını güncelle
            await UpdateProductRating(reviewDto.ProductId);

            // Yanıt oluştur
            var response = new ReviewResponseDto
            {
                Id = review.Id,
                ProductId = review.ProductId,
                UserId = review.UserId,
                UserName = $"{user.FirstName} {user.LastName}",
                Rating = review.Rating,
                Title = review.Title,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };

            return CreatedAtAction("GetReview", new { id = review.Id }, response);
        }

        // PUT: api/Reviews/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, ReviewUpdateDto reviewDto)
        {
            if (id != reviewDto.Id)
            {
                return BadRequest();
            }

            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            // Sadece kullanıcı ID'si eşleşiyorsa güncelleme yapılmalı
            if (review.UserId != reviewDto.UserId)
            {
                return Unauthorized("Bu yorumu düzenleme yetkiniz yok.");
            }

            // Güncelleme
            review.Rating = reviewDto.Rating;
            review.Title = reviewDto.Title;
            review.Comment = reviewDto.Comment;

            try
            {
                await _context.SaveChangesAsync();
                
                // Ürünün ortalama puanını güncelle
                await UpdateProductRating(review.ProductId);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id))
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

        // DELETE: api/Reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id, [FromQuery] int userId)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            // Sadece sahibi veya admin silebilir
            if (review.UserId != userId)
            {
                return Unauthorized("Bu yorumu silme yetkiniz yok.");
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            
            // Ürünün ortalama puanını güncelle
            await UpdateProductRating(review.ProductId);

            return NoContent();
        }

        private bool ReviewExists(int id)
        {
            return _context.Reviews.Any(e => e.Id == id);
        }
        
        // Ürünün ortalama puanını güncelleme
        private async Task UpdateProductRating(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product != null)
            {
                var reviews = await _context.Reviews
                    .Where(r => r.ProductId == productId && r.IsApproved)
                    .ToListAsync();
                
                if (reviews.Any())
                {
                    product.Rating = Math.Round((decimal)reviews.Average(r => r.Rating), 1);
                }
                else
                {
                    product.Rating = 0;
                }
                
                await _context.SaveChangesAsync();
            }
        }
    }
} 