using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AndShop.ProductService.Models;
using AndShop.ProductService.Data;
using System.Text.Json.Serialization;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Text.Json;

namespace AndShop.ProductService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ProductDbContext _context;

        public UsersController(ProductDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // GET: api/Users/5/orders
        [HttpGet("{id}/orders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetUserOrders(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return await _context.Orders
                .Where(o => o.UserId == id)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest loginRequest)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginRequest.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "Email veya şifre hatalı." });
            }

            // Şifre doğrulama
            if (!VerifyPassword(loginRequest.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Email veya şifre hatalı." });
            }

            // Gerçek uygulamada JWT token oluşturulmalı
            return new LoginResponse
            {
                Token = "simulated-jwt-token-" + DateTime.UtcNow.Ticks,
                User = user
            };
        }

        // POST: api/Users/register
        [HttpPost("register")]
        public async Task<ActionResult<LoginResponse>> Register(RegisterRequest registerRequest)
        {
            // Email kullanımda mı kontrol et
            if (await _context.Users.AnyAsync(u => u.Email == registerRequest.Email))
            {
                return BadRequest(new { message = "Bu email adresi zaten kullanılıyor." });
            }

            // Şifreyi hashle
            string passwordHash = HashPassword(registerRequest.Password);

            // Yeni kullanıcı oluştur
            var user = new User
            {
                FirstName = registerRequest.FirstName,
                LastName = registerRequest.LastName,
                Email = registerRequest.Email,
                PasswordHash = passwordHash,
                Phone = registerRequest.Phone,
                Gender = registerRequest.Gender,
                Birthday = registerRequest.Birthday,
                Avatar = $"https://ui-avatars.com/api/?name={Uri.EscapeDataString(registerRequest.FirstName)}+{Uri.EscapeDataString(registerRequest.LastName)}&background=f79837&color=fff",
                Role = "user",
                Favorites = "[]" // Boş bir dizi olarak başlat
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Gerçek uygulamada JWT token oluşturulmalı
            return new LoginResponse
            {
                Token = "simulated-jwt-token-" + DateTime.UtcNow.Ticks,
                User = user
            };
        }

        // POST: api/Users/5/change-password
        [HttpPost("{id}/change-password")]
        public async Task<IActionResult> ChangePassword(int id, ChangePasswordRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Mevcut şifreyi doğrula
            if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Mevcut şifre hatalı." });
            }

            // Yeni şifreyi hashle ve kaydet
            user.PasswordHash = HashPassword(request.NewPassword);
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Şifre başarıyla değiştirildi." });
        }

        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserUpdateRequest userUpdate)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Kullanıcı bilgilerini güncelle
            user.FirstName = userUpdate.FirstName;
            user.LastName = userUpdate.LastName;
            user.Email = userUpdate.Email;
            user.Phone = userUpdate.Phone;
            user.Role = userUpdate.Role ?? user.Role;
            user.Avatar = userUpdate.Avatar ?? user.Avatar;
            user.Gender = userUpdate.Gender;
            user.Birthday = userUpdate.Birthday;

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        // Şifre hash fonksiyonu
        private string HashPassword(string password)
        {
            // Salt oluştur
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            // Şifreyi PBKDF2 ile hashle
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            // Salt ve hash'i birleştir
            return $"{Convert.ToBase64String(salt)}:{hashed}";
        }

        // Şifre doğrulama fonksiyonu
        private bool VerifyPassword(string password, string storedHash)
        {
            // Demo modu için eski şifre kontrolü (geçiş dönemi için)
            if (storedHash.Length == 0 && password == "123456")
            {
                return true;
            }

            // Salt ve hash'i ayır
            var parts = storedHash.Split(':');
            if (parts.Length != 2)
            {
                return false;
            }

            var salt = Convert.FromBase64String(parts[0]);
            var hash = parts[1];

            // Aynı salt ile şifreyi hashle
            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));

            // Hashler eşleşiyor mu kontrol et
            return hash == hashed;
        }

        // Favorilerle ilgili endpoint'ler
        
        // GET: api/Users/{id}/favorites
        [HttpGet("{id}/favorites")]
        public async Task<ActionResult<IEnumerable<Product>>> GetUserFavorites(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı");
            }

            try
            {
                // Favorileri JSON formatından parse et
                if (string.IsNullOrEmpty(user.Favorites) || user.Favorites == "[]")
                {
                    return new List<Product>();
                }

                var favoriteIds = JsonSerializer.Deserialize<List<int>>(user.Favorites);
                if (favoriteIds == null || !favoriteIds.Any())
                {
                    return new List<Product>();
                }

                // Favori ürünleri getir
                var products = await _context.Products
                    .Where(p => favoriteIds.Contains(p.Id))
                    .ToListAsync();

                return products;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Favoriler alınırken hata oluştu: {ex.Message}");
            }
        }

        // POST: api/Users/{id}/favorites
        [HttpPost("{id}/favorites")]
        public async Task<IActionResult> AddFavorite(int id, [FromBody] FavoriteRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı");
            }

            try
            {
                // Ürünün var olup olmadığını kontrol et
                var product = await _context.Products.FindAsync(request.ProductId);
                if (product == null)
                {
                    return NotFound("Ürün bulunamadı");
                }

                // Favorileri parse et
                List<int> favoriteIds = new List<int>();
                if (!string.IsNullOrEmpty(user.Favorites) && user.Favorites != "[]")
                {
                    favoriteIds = JsonSerializer.Deserialize<List<int>>(user.Favorites) ?? new List<int>();
                }

                // Ürün zaten favorilerde mi kontrol et
                if (!favoriteIds.Contains(request.ProductId))
                {
                    favoriteIds.Add(request.ProductId);
                    user.Favorites = JsonSerializer.Serialize(favoriteIds);
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Ürün favorilere eklendi" });
                }
                else
                {
                    return Ok(new { message = "Ürün zaten favorilerde" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Favorilere eklenirken hata oluştu: {ex.Message}");
            }
        }

        // DELETE: api/Users/{id}/favorites/{productId}
        [HttpDelete("{id}/favorites/{productId}")]
        public async Task<IActionResult> RemoveFavorite(int id, int productId)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı");
            }

            try
            {
                // Favorileri parse et
                if (string.IsNullOrEmpty(user.Favorites) || user.Favorites == "[]")
                {
                    return Ok(new { message = "Favori listesi zaten boş" });
                }

                var favoriteIds = JsonSerializer.Deserialize<List<int>>(user.Favorites) ?? new List<int>();
                
                // Ürünü listeden çıkar
                if (favoriteIds.Contains(productId))
                {
                    favoriteIds.Remove(productId);
                    user.Favorites = JsonSerializer.Serialize(favoriteIds);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Ürün favorilerden kaldırıldı" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Favorilerden kaldırılırken hata oluştu: {ex.Message}");
            }
        }
    }

    // Request ve Response sınıfları
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public DateTime? Birthday { get; set; }
    }

    public class ChangePasswordRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class UserUpdateRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Role { get; set; }
        public string? Avatar { get; set; }
        public string? Gender { get; set; }
        public DateTime? Birthday { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public User User { get; set; } = null!;
    }

    // Favoriler için request modeli
    public class FavoriteRequest
    {
        public int ProductId { get; set; }
    }
} 