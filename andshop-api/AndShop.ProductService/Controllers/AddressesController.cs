using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AndShop.ProductService.Models;
using AndShop.ProductService.Data;

namespace AndShop.ProductService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressesController : ControllerBase
    {
        private readonly ProductDbContext _context;

        public AddressesController(ProductDbContext context)
        {
            _context = context;
        }

        // GET: api/Addresses/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Address>>> GetUserAddresses(int userId)
        {
            try
            {
                // Kullanıcının var olup olmadığını kontrol et
                var userExists = await _context.Users.AnyAsync(u => u.Id == userId);
                if (!userExists)
                {
                    return NotFound($"Kullanıcı ID {userId} bulunamadı.");
                }

                // Kullanıcının adreslerini getir
                var addresses = await _context.Addresses
                    .Where(a => a.UserId == userId)
                    .OrderByDescending(a => a.IsDefault)
                    .ThenBy(a => a.Title)
                    .ToListAsync();

                return addresses;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Adresler alınırken bir hata oluştu: {ex.Message}");
            }
        }

        // GET: api/Addresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Address>> GetAddress(int id)
        {
            var address = await _context.Addresses.FindAsync(id);

            if (address == null)
            {
                return NotFound($"Adres ID {id} bulunamadı.");
            }

            return address;
        }

        // POST: api/Addresses
        [HttpPost]
        public async Task<ActionResult<Address>> PostAddress(Address address)
        {
            try
            {
                if (address == null)
                {
                    return BadRequest(new { message = "Adres bilgileri sağlanmadı" });
                }

                // Zorunlu alanları kontrol et
                if (address.UserId <= 0)
                {
                    return BadRequest(new { message = "Geçersiz kullanıcı ID" });
                }

                if (string.IsNullOrEmpty(address.Title))
                {
                    return BadRequest(new { message = "Adres başlığı zorunludur" });
                }

                if (string.IsNullOrEmpty(address.FullName))
                {
                    return BadRequest(new { message = "Ad soyad bilgisi zorunludur" });
                }

                if (string.IsNullOrEmpty(address.AddressDetail))
                {
                    return BadRequest(new { message = "Adres detayı zorunludur" });
                }

                // Kullanıcı kontrolü
                var userExists = await _context.Users.AnyAsync(u => u.Id == address.UserId);
                if (!userExists)
                {
                    return BadRequest(new { message = $"Kullanıcı ID {address.UserId} bulunamadı." });
                }

                // Eğer bu adres varsayılan olarak işaretlendiyse, aynı kullanıcının diğer varsayılan adreslerini sıfırla
                if (address.IsDefault)
                {
                    var defaultAddresses = await _context.Addresses
                        .Where(a => a.UserId == address.UserId && a.IsDefault)
                        .ToListAsync();

                    foreach (var defaultAddress in defaultAddresses)
                    {
                        defaultAddress.IsDefault = false;
                    }
                }

                _context.Addresses.Add(address);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAddress), new { id = address.Id }, address);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Adres eklenirken bir hata oluştu: {ex.Message}" });
            }
        }

        // PUT: api/Addresses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAddress(int id, Address address)
        {
            if (id != address.Id)
            {
                return BadRequest("Adres ID'leri eşleşmiyor.");
            }

            try
            {
                // Adresin var olup olmadığını kontrol et
                var existingAddress = await _context.Addresses.FindAsync(id);
                if (existingAddress == null)
                {
                    return NotFound($"Adres ID {id} bulunamadı.");
                }

                // Eğer bu adres varsayılan olarak işaretlendiyse ve önceden varsayılan değildiyse, 
                // aynı kullanıcının diğer varsayılan adreslerini sıfırla
                if (address.IsDefault && !existingAddress.IsDefault)
                {
                    var defaultAddresses = await _context.Addresses
                        .Where(a => a.UserId == address.UserId && a.IsDefault && a.Id != id)
                        .ToListAsync();

                    foreach (var defaultAddress in defaultAddresses)
                    {
                        defaultAddress.IsDefault = false;
                    }
                }

                // Adresi güncelle
                _context.Entry(existingAddress).State = EntityState.Detached;
                _context.Entry(address).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return Ok(address);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddressExists(id))
                {
                    return NotFound($"Adres ID {id} bulunamadı.");
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Adres güncellenirken bir hata oluştu: {ex.Message}");
            }
        }

        // DELETE: api/Addresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            try
            {
                // Adresin varlığını kontrol et
                var address = await _context.Addresses.FindAsync(id);
                if (address == null)
                {
                    return NotFound(new { message = $"Adres ID {id} bulunamadı." });
                }

                // Adres sipariş tarafından kullanılıyor mu kontrol et
                var usedInOrder = await _context.Orders.AnyAsync(o => o.AddressId == id);
                
                if (usedInOrder)
                {
                    // Eğer siparişlerde kullanılıyorsa, adresi varsayılan olmaktan çıkar
                    address.IsDefault = false;
                    await _context.SaveChangesAsync();
                    
                    return BadRequest(new { 
                        message = "Bu adres siparişlerde kullanıldığı için silinemiyor. Varsayılan adres işareti kaldırıldı.",
                        success = false 
                    });
                }

                // Direkt SQL ile adresi silmeyi dene
                try
                {
                    // Önce başka bir adresi varsayılan yap (eğer bu varsayılansa)
                    if (address.IsDefault)
                    {
                        var otherAddress = await _context.Addresses
                            .Where(a => a.UserId == address.UserId && a.Id != id)
                            .FirstOrDefaultAsync();
                        
                        if (otherAddress != null)
                        {
                            otherAddress.IsDefault = true;
                            await _context.SaveChangesAsync();
                        }
                    }

                    // SQL ile sil
                    var result = await _context.Database.ExecuteSqlRawAsync(
                        "DELETE FROM Addresses WHERE Id = {0}", id);
                    
                    // Başarılı yanıt
                    if (result > 0)
                    {
                        return NoContent();
                    }
                    else
                    {
                        return StatusCode(500, new { 
                            message = "Adres silinemedi. SQL sorgusu etkilenen satır sayısı: 0", 
                            success = false 
                        });
                    }
                }
                catch (Exception sqlEx)
                {
                    // SQL hatası detaylarını döndür
                    return StatusCode(500, new { 
                        message = "SQL ile adres silme işlemi başarısız", 
                        detail = sqlEx.Message,
                        innerDetail = sqlEx.InnerException?.Message,
                        stackTrace = sqlEx.StackTrace,
                        success = false 
                    });
                }
            }
            catch (Exception ex)
            {
                // Genel hata
                return StatusCode(500, new { 
                    message = "Adres silme işlemi sırasında beklenmeyen bir hata oluştu",
                    detail = ex.Message,
                    innerDetail = ex.InnerException?.Message,
                    stackTrace = ex.StackTrace,
                    success = false 
                });
            }
        }

        // PATCH: api/Addresses/5/set-default
        [HttpPatch("{id}/set-default")]
        public async Task<IActionResult> SetDefaultAddress(int id)
        {
            try
            {
                // Önce adresi ve kullanıcı ID'sini al
                var address = await _context.Addresses.FindAsync(id);
                if (address == null)
                {
                    return NotFound(new { message = $"Adres ID {id} bulunamadı." });
                }

                // Adres zaten varsayılan ise işlem yapmaya gerek yok
                if (address.IsDefault)
                {
                    return Ok(new { message = "Bu adres zaten varsayılan olarak ayarlanmış.", address });
                }

                // Kullanıcı ID'sini al
                int userId = address.UserId;

                // 1. ADIM: Önce tüm varsayılan adresleri sıfırla (EntityState kullanmadan SQL benzeri update)
                await _context.Database.ExecuteSqlRawAsync(
                    "UPDATE Addresses SET IsDefault = 0 WHERE UserId = {0} AND IsDefault = 1",
                    userId);

                // 2. ADIM: Şimdi istenen adresi varsayılan olarak ayarla
                await _context.Database.ExecuteSqlRawAsync(
                    "UPDATE Addresses SET IsDefault = 1 WHERE Id = {0}",
                    id);

                // Son durumu getir
                var updatedAddress = await _context.Addresses.FindAsync(id);
                
                // Context'i temizle
                _context.ChangeTracker.Clear();
                
                return Ok(new { message = "Varsayılan adres başarıyla güncellendi.", address = updatedAddress });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    message = $"Varsayılan adres ayarlanırken bir hata oluştu: {ex.Message}", 
                    details = ex.ToString(),
                    innerException = ex.InnerException?.Message 
                });
            }
        }

        private bool AddressExists(int id)
        {
            return _context.Addresses.Any(e => e.Id == id);
        }
    }
} 