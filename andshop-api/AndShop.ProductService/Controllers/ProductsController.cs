using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AndShop.ProductService.Models;
using AndShop.ProductService.Data;

namespace AndShop.ProductService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductDbContext _context;

        public ProductsController(ProductDbContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // GET: api/Products/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Products.Select(p => p.Category).Distinct().ToListAsync();
            return categories;
        }

        // GET: api/Products/category/{category}
        [HttpGet("category/{category}")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProductsByCategory(string category)
        {
            var products = await _context.Products
                .Where(p => p.Category.ToLower() == category.ToLower())
                .ToListAsync();

            if (!products.Any())
            {
                return NotFound($"Kategori '{category}' bulunamadı veya bu kategoriye ait ürün yok.");
            }

            return products;
        }

        // GET: api/Products/search?q={query}
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Product>>> SearchProducts([FromQuery] string q)
        {
            if (string.IsNullOrEmpty(q))
            {
                return await _context.Products.ToListAsync();
            }

            var products = await _context.Products
                .Where(p => p.Title.ToLower().Contains(q.ToLower()) ||
                           p.Description.ToLower().Contains(q.ToLower()) ||
                           p.Category.ToLower().Contains(q.ToLower()) ||
                           p.Brand.ToLower().Contains(q.ToLower()))
                .ToListAsync();

            return products;
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT: api/Products/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
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

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
} 