using AndShop.ProductService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;

namespace AndShop.ProductService.Data
{
    public static class DbInitializer
    {
        // Şifre hash fonksiyonu
        private static string HashPassword(string password)
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

        public static void Initialize(ProductDbContext context)
        {
            // DB'yi oluştur (eğer yoksa)
            context.Database.EnsureCreated();

            // Kullanıcılar
            if (!context.Users.Any())
            {
                var users = new List<User>
                {
                    new User
                    {
                        FirstName = "Admin",
                        LastName = "User",
                        Email = "admin@example.com",
                        PasswordHash = HashPassword("admin123"),
                        Avatar = "https://ui-avatars.com/api/?name=Admin+User&background=f79837&color=fff",
                        Role = "admin"
                    },
                    new User
                    {
                        FirstName = "Test",
                        LastName = "User",
                        Email = "user@example.com",
                        PasswordHash = HashPassword("123456"),
                        Avatar = "https://ui-avatars.com/api/?name=Test+User&background=f79837&color=fff",
                        Role = "user"
                    }
                };

                context.Users.AddRange(users);
                context.SaveChanges();
            }

            // Kategoriler
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Elektronik", Description = "Elektronik ürünler, bilgisayarlar, telefonlar ve daha fazlası" },
                    new Category { Name = "Giyim", Description = "Erkek, kadın ve çocuk giyim ürünleri" },
                    new Category { Name = "Ev & Yaşam", Description = "Ev dekorasyon ve yaşam ürünleri" },
                    new Category { Name = "Kitap", Description = "Kitaplar, dergiler ve eğitim materyalleri" },
                    new Category { Name = "Spor", Description = "Spor ekipmanları ve giyim ürünleri" }
                };

                context.Categories.AddRange(categories);
                context.SaveChanges();
            }

            // Ürünler
            if (!context.Products.Any())
            {
                var categories = context.Categories.ToList();
                var products = new List<Product>
                {
                    new Product
                    {
                        Title = "JBL Kulaklık",
                        Description = "Kablosuz Bluetooth kulaklık, gürültü önleme özellikli",
                        Price = 1299.99m,
                        DiscountPrice = 999.99m,
                        ImageUrl = "product1.jpg",
                        Image = "product1.jpg",
                        Rating = 4.5m,
                        Stock = 50,
                        CategoryId = categories.First(c => c.Name == "Elektronik").Id
                    },
                    new Product
                    {
                        Title = "Samsung Galaxy S21",
                        Description = "6.2 inç ekran, 8GB RAM, 128GB depolama",
                        Price = 12999.99m,
                        DiscountPrice = 10999.99m,
                        ImageUrl = "product2.jpg",
                        Image = "product2.jpg",
                        Rating = 4.7m,
                        Stock = 25,
                        CategoryId = categories.First(c => c.Name == "Elektronik").Id
                    },
                    new Product
                    {
                        Title = "Erkek Slim Fit T-Shirt",
                        Description = "100% pamuk, rahat kesim",
                        Price = 199.99m,
                        DiscountPrice = null,
                        ImageUrl = "product3.jpg",
                        Image = "product3.jpg",
                        Rating = 4.2m,
                        Stock = 100,
                        CategoryId = categories.First(c => c.Name == "Giyim").Id
                    },
                    new Product
                    {
                        Title = "Kadın Spor Ayakkabı",
                        Description = "Hafif, nefes alabilir malzeme",
                        Price = 549.99m,
                        DiscountPrice = 399.99m,
                        ImageUrl = "product4.jpg",
                        Image = "product4.jpg",
                        Rating = 4.4m,
                        Stock = 75,
                        CategoryId = categories.First(c => c.Name == "Giyim").Id
                    },
                    new Product
                    {
                        Title = "Modern Salon Masa",
                        Description = "Şık tasarım, dayanıklı malzeme",
                        Price = 1699.99m,
                        DiscountPrice = 1499.99m,
                        ImageUrl = "product5.jpg",
                        Image = "product5.jpg",
                        Rating = 4.3m,
                        Stock = 30,
                        CategoryId = categories.First(c => c.Name == "Ev & Yaşam").Id
                    },
                    new Product
                    {
                        Title = "Kitaplık",
                        Description = "5 raflı, ahşap kitaplık",
                        Price = 999.99m,
                        DiscountPrice = null,
                        ImageUrl = "product6.jpg",
                        Image = "product6.jpg",
                        Rating = 4.1m,
                        Stock = 40,
                        CategoryId = categories.First(c => c.Name == "Ev & Yaşam").Id
                    },
                    new Product
                    {
                        Title = "1984 - George Orwell",
                        Description = "Distopik roman, klasik edebiyat",
                        Price = 49.99m,
                        DiscountPrice = null,
                        ImageUrl = "product7.jpg",
                        Image = "product7.jpg",
                        Rating = 4.8m,
                        Stock = 200,
                        CategoryId = categories.First(c => c.Name == "Kitap").Id
                    },
                    new Product
                    {
                        Title = "Suç ve Ceza - Dostoyevski",
                        Description = "Klasik roman, dünya edebiyatı",
                        Price = 59.99m,
                        DiscountPrice = 45.99m,
                        ImageUrl = "product8.jpg",
                        Image = "product8.jpg",
                        Rating = 4.7m,
                        Stock = 150,
                        CategoryId = categories.First(c => c.Name == "Kitap").Id
                    },
                    new Product
                    {
                        Title = "Yoga Matı",
                        Description = "Kaymaz yüzey, 5mm kalınlık",
                        Price = 179.99m,
                        DiscountPrice = 149.99m,
                        ImageUrl = "product9.jpg",
                        Image = "product9.jpg",
                        Rating = 4.6m,
                        Stock = 80,
                        CategoryId = categories.First(c => c.Name == "Spor").Id
                    },
                    new Product
                    {
                        Title = "Koşu Bandı",
                        Description = "16 km/s hız, eğim ayarlı",
                        Price = 7999.99m,
                        DiscountPrice = 6499.99m,
                        ImageUrl = "product10.jpg",
                        Image = "product10.jpg",
                        Rating = 4.4m,
                        Stock = 15,
                        CategoryId = categories.First(c => c.Name == "Spor").Id
                    }
                };

                context.Products.AddRange(products);
                context.SaveChanges();
            }

            // Siparişler
            if (!context.Orders.Any())
            {
                Console.WriteLine("Örnek siparişler ekleniyor...");
                
                // Kullanıcıların adreslerini çek (ilişki için)
                var userAddresses = context.Addresses
                    .Where(a => a.UserId == 1 || a.UserId == 2)
                    .ToList();
                
                if (userAddresses.Any())
                {
                    // İlk kullanıcının adresi
                    var firstUserAddress = userAddresses.FirstOrDefault(a => a.UserId == 1);
                    // İkinci kullanıcının adresi
                    var secondUserAddress = userAddresses.FirstOrDefault(a => a.UserId == 2) ?? firstUserAddress;
                    
                    var orders = new List<Order>
                    {
                        new Order
                        {
                            UserId = 1, // İlk kullanıcı
                            AddressId = firstUserAddress?.Id, // İlişkili adres ID'si
                            OrderDate = DateTime.UtcNow.AddDays(-5),
                            
                            OrderStatus = "Teslim Edildi",
                            PaymentMethod = "credit_card",
                            PaymentStatus = "Tamamlandı",
                            TotalAmount = 259.98m,
                            DiscountAmount = 0,
                            ShippingCost = 15.00m,
                            TrackingNumber = "TR123456789",
                            OrderItems = new List<OrderItem>
                            {
                                new OrderItem
                                {
                                    ProductId = 1,
                                    Quantity = 2,
                                    Price = 129.99m
                                }
                            }
                        },
                        new Order
                        {
                            UserId = 2, // İkinci kullanıcı
                            AddressId = secondUserAddress?.Id, // İlişkili adres ID'si
                            OrderDate = DateTime.UtcNow.AddDays(-3),
                            OrderStatus = "Kargoya Verildi",
                            PaymentMethod = "cash_on_delivery",
                            PaymentStatus = "Beklemede",
                            TotalAmount = 167.95m,
                            DiscountAmount = 20.00m,
                            ShippingCost = 15.00m,
                            TrackingNumber = "TR987654321",
                            CouponCode = "BAHAR20",
                            OrderItems = new List<OrderItem>
                            {
                                new OrderItem
                                {
                                    ProductId = 2,
                                    Quantity = 1,
                                    Price = 172.95m
                                }
                            }
                        },
                        new Order
                        {
                            UserId = 1, // İlk kullanıcı
                            AddressId = firstUserAddress?.Id, // İlişkili adres ID'si
                            OrderDate = DateTime.UtcNow.AddDays(-1),
                            OrderStatus = "Hazırlanıyor",
                            PaymentMethod = "credit_card",
                            PaymentStatus = "Tamamlandı",
                            TotalAmount = 145.90m,
                            DiscountAmount = 0,
                            ShippingCost = 15.00m,
                            OrderItems = new List<OrderItem>
                            {
                                new OrderItem
                                {
                                    ProductId = 3,
                                    Quantity = 1,
                                    Price = 130.90m
                                }
                            }
                        }
                    };
                    
                    context.Orders.AddRange(orders);
                    context.SaveChanges();
                    Console.WriteLine($"{orders.Count} örnek sipariş eklendi.");
                }
                else
                {
                    Console.WriteLine("Adres bilgisi bulunamadığı için örnek siparişler oluşturulamadı!");
                }
            }
        }
    }
} 