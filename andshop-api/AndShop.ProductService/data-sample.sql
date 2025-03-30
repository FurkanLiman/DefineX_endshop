-- AndShop E-Ticaret Uygulaması Örnek Veri Ekleme Script'i

-- Örnek kategori verileri
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    IF NOT EXISTS (SELECT TOP 1 * FROM Categories)
    BEGIN
        INSERT INTO Categories (Name, Description, ImageUrl)
        VALUES 
        ('Elektronik', 'Telefon, bilgisayar ve elektronik ürünler', '/images/categories/elektronik.jpg'),
        ('Giyim', 'Erkek, kadın ve çocuk giyim ürünleri', '/images/categories/giyim.jpg'),
        ('Ev & Yaşam', 'Ev dekorasyon ve yaşam ürünleri', '/images/categories/ev-yasam.jpg'),
        ('Kitap', 'Kitap, dergi ve kırtasiye ürünleri', '/images/categories/kitap.jpg'),
        ('Spor', 'Spor ve outdoor ürünleri', '/images/categories/spor.jpg');
        
        PRINT 'Örnek kategori verileri eklendi.';
    END
    ELSE
    BEGIN
        PRINT 'Kategorilerde zaten veri var, örnek veriler eklenmedi.';
    END
END

-- Örnek kullanıcı verileri
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    IF NOT EXISTS (SELECT TOP 1 * FROM Users)
    BEGIN
        INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Phone, Avatar, Role, Gender)
        VALUES 
        ('Admin', 'User', 'admin@andshop.com', 'AQAAAAEAACcQAAAAEH8aZugs88s/cTA5M2vcGDFUUJlczlTUuZ+5+ZD/c4CVXnKEPTj2wnpHu5OofvzECw==', '5553334455', '/images/users/admin.jpg', 'Admin', 'male'),
        ('Test', 'User', 'test@andshop.com', 'AQAAAAEAACcQAAAAEFgj5JbGjv+KJkx0yFhA1FvQFh9dZwGRw8Ygi22U0GUY0zEzUUeAxCDL7WSYs3UUOw==', '5553334466', '/images/users/user1.jpg', 'User', 'female'),
        ('Ahmet', 'Yılmaz', 'ahmet@example.com', 'AQAAAAEAACcQAAAAEBn9YcpTvvgnaQrQ9xiHW9vJ8JiKIhPe9ZwCUt3vnA5MhsBeTfXu9ZMkKsyJB1NOyQ==', '5321112233', '/images/users/user2.jpg', 'User', 'male'),
        ('Ayşe', 'Kaya', 'ayse@example.com', 'AQAAAAEAACcQAAAAEINB1W9vw/AQfk6Sx0V5VtJsUflPjVgTK/TtqjAglLGahIQRPmpZP/aSGHFtdq1JTA==', '5421112233', '/images/users/user3.jpg', 'User', 'female');
        
        PRINT 'Örnek kullanıcı verileri eklendi.';
    END
    ELSE
    BEGIN
        PRINT 'Kullanıcılarda zaten veri var, örnek veriler eklenmedi.';
    END
END

-- Örnek ürün verileri
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    IF NOT EXISTS (SELECT TOP 1 * FROM Products)
    BEGIN
        INSERT INTO Products (Title, Description, Price, DiscountPrice, CategoryId, Category, Image, ImageUrl, Sizes, Colors, Discount, Collection, Stock, Rating, New, Hot, Brand)
        VALUES 
        ('Akıllı Telefon Pro Max', 'Son model akıllı telefon, yüksek performanslı kamera ve uzun pil ömrü', 12999.99, 11999.99, 1, 'Elektronik', '/images/products/phone1.jpg', '/images/products/phone1.jpg', '["64GB","128GB","256GB"]', '["Siyah","Beyaz","Mavi"]', 1000.00, 'Yeni Sezon', 50, 4.7, 1, 1, 'TechBrand'),
        
        ('Spor Ayakkabı', 'Konforlu ve şık tasarımlı spor ayakkabı', 899.99, 799.99, 2, 'Giyim', '/images/products/shoes1.jpg', '/images/products/shoes1.jpg', '["38","39","40","41","42"]', '["Siyah","Beyaz","Kırmızı"]', 100.00, 'Spor', 75, 4.5, 1, 0, 'SportWear'),
        
        ('Dekoratif Masa Lambası', 'Modern tasarımlı dekoratif masa lambası', 349.99, 299.99, 3, 'Ev & Yaşam', '/images/products/lamp1.jpg', '/images/products/lamp1.jpg', '["S","M","L"]', '["Siyah","Beyaz","Ahşap"]', 50.00, 'Dekorasyon', 30, 4.3, 0, 0, 'HomeDeco'),
        
        ('Bilgisayar Pro', 'Yüksek performanslı dizüstü bilgisayar', 22999.99, 21499.99, 1, 'Elektronik', '/images/products/laptop1.jpg', '/images/products/laptop1.jpg', '["i5-16GB","i7-16GB","i9-32GB"]', '["Gri","Siyah"]', 1500.00, 'Teknoloji', 25, 4.8, 1, 1, 'TechPro'),
        
        ('Yazlık Elbise', 'Şık ve rahat yazlık elbise', 599.99, 499.99, 2, 'Giyim', '/images/products/dress1.jpg', '/images/products/dress1.jpg', '["XS","S","M","L","XL"]', '["Mavi","Pembe","Beyaz"]', 100.00, 'Yaz', 60, 4.6, 1, 0, 'FashionStyle'),
        
        ('Kahve Makinesi', 'Otomatik programlanabilir kahve makinesi', 1499.99, 1299.99, 3, 'Ev & Yaşam', '/images/products/coffee1.jpg', '/images/products/coffee1.jpg', '["Standart"]', '["Siyah","Kırmızı"]', 200.00, 'Mutfak', 40, 4.4, 0, 1, 'KitchenTech'),
        
        ('Klasik Roman Seti', '5 kitaplık dünya klasikleri seti', 249.99, 199.99, 4, 'Kitap', '/images/products/books1.jpg', '/images/products/books1.jpg', '["Standart"]', '["Standart"]', 50.00, 'Klasikler', 100, 4.9, 0, 0, 'ClassicPub'),
        
        ('Spor Seti', 'Komple ev spor ekipmanı seti', 1999.99, 1799.99, 5, 'Spor', '/images/products/fitness1.jpg', '/images/products/fitness1.jpg', '["Standart"]', '["Siyah","Kırmızı"]', 200.00, 'Fitness', 15, 4.5, 0, 1, 'SportLife');
        
        PRINT 'Örnek ürün verileri eklendi.';
    END
    ELSE
    BEGIN
        PRINT 'Ürünlerde zaten veri var, örnek veriler eklenmedi.';
    END
END

-- Örnek adres verileri
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Addresses')
BEGIN
    IF NOT EXISTS (SELECT TOP 1 * FROM Addresses)
    BEGIN
        INSERT INTO Addresses (UserId, Title, FullName, Phone, City, District, AddressDetail, ZipCode, IsDefault)
        VALUES 
        (2, 'Ev Adresi', 'Test User', '5553334466', 'İstanbul', 'Kadıköy', 'Caferağa Mah. Test Sok. No:1 D:5', '34710', 1),
        (3, 'Ev', 'Ahmet Yılmaz', '5321112233', 'Ankara', 'Çankaya', 'Bahçelievler Mah. 7. Cad. No:10', '06500', 1),
        (3, 'İş', 'Ahmet Yılmaz', '5321112233', 'Ankara', 'Çankaya', 'Kızılay Mah. Atatürk Bulvarı No:25 Kat:3', '06420', 0),
        (4, 'Ev Adresi', 'Ayşe Kaya', '5421112233', 'İzmir', 'Karşıyaka', 'Bostanlı Mah. 2019 Sok. No:5 D:10', '35590', 1);
        
        PRINT 'Örnek adres verileri eklendi.';
    END
    ELSE
    BEGIN
        PRINT 'Adreslerde zaten veri var, örnek veriler eklenmedi.';
    END
END

-- Örnek kupon verileri
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Coupons')
BEGIN
    IF NOT EXISTS (SELECT TOP 1 * FROM Coupons)
    BEGIN
        INSERT INTO Coupons (Code, Description, DiscountType, DiscountValue, MinimumOrderAmount, MaximumDiscountAmount, IsActive, StartDate, EndDate, UsageLimit)
        VALUES 
        ('HOSGELDIN10', 'Hoş geldin indirimi %10', 2, 10.00, 100.00, 200.00, 1, '2023-01-01', '2025-12-31', 1000),
        ('YILBASI2024', 'Yılbaşına özel %15 indirim', 2, 15.00, 200.00, 500.00, 1, '2023-12-15', '2024-01-15', 500),
        ('100TL', '100 TL indirim kuponu', 1, 100.00, 500.00, NULL, 1, '2023-01-01', '2024-12-31', 300);
        
        PRINT 'Örnek kupon verileri eklendi.';
    END
    ELSE
    BEGIN
        PRINT 'Kuponlarda zaten veri var, örnek veriler eklenmedi.';
    END
END

-- Örnek sipariş verileri
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Orders') AND EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    IF NOT EXISTS (SELECT TOP 1 * FROM Orders)
    BEGIN
        -- Siparişler
        INSERT INTO Orders (UserId, OrderDate, AddressId, OrderStatus, TotalAmount, ShippingCost, PaymentMethod, PaymentStatus)
        VALUES 
        (2, DATEADD(day, -5, GETDATE()), 1, 'Tamamlandı', 12999.99, 0.00, 'Kredi Kartı', 'Ödendi'),
        (3, DATEADD(day, -3, GETDATE()), 2, 'Kargoda', 1499.98, 29.99, 'Havale', 'Ödendi'),
        (4, DATEADD(day, -1, GETDATE()), 4, 'Hazırlanıyor', 2299.98, 0.00, 'Kapıda Ödeme', 'Beklemede');
        
        -- Sipariş Ürünleri
        INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price, Size, Color)
        VALUES 
        (1, 1, 1, 11999.99, '128GB', 'Siyah'),
        (2, 3, 1, 299.99, 'M', 'Beyaz'),
        (2, 5, 2, 499.99, 'M', 'Mavi'),
        (3, 6, 1, 1299.99, 'Standart', 'Siyah'),
        (3, 7, 5, 199.99, 'Standart', 'Standart');
        
        PRINT 'Örnek sipariş verileri eklendi.';
    END
    ELSE
    BEGIN
        PRINT 'Siparişlerde zaten veri var, örnek veriler eklenmedi.';
    END
END

-- Örnek değerlendirme verileri
IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Reviews')
BEGIN
    IF NOT EXISTS (SELECT TOP 1 * FROM Reviews)
    BEGIN
        INSERT INTO Reviews (ProductId, UserId, Rating, Comment, Title, CreatedAt, IsApproved)
        VALUES 
        (1, 2, 5, 'Harika bir telefon, kamera performansı çok iyi.', 'Mükemmel Telefon', DATEADD(day, -10, GETDATE()), 1),
        (1, 3, 4, 'Fiyatı biraz yüksek ama kaliteli.', 'İyi Ürün', DATEADD(day, -8, GETDATE()), 1),
        (3, 2, 5, 'Çok şık bir lamba, odamıza çok yakıştı.', 'Çok Beğendim', DATEADD(day, -5, GETDATE()), 1),
        (6, 4, 4, 'Kahve makinesi beklentilerimi karşıladı.', 'Güzel Ürün', DATEADD(day, -3, GETDATE()), 1),
        (7, 3, 5, 'Kitaplar çok kaliteli basılmış, seri harika.', 'Harika Kitaplar', DATEADD(day, -2, GETDATE()), 1);
        
        PRINT 'Örnek değerlendirme verileri eklendi.';
    END
    ELSE
    BEGIN
        PRINT 'Değerlendirmelerde zaten veri var, örnek veriler eklenmedi.';
    END
END

PRINT 'Örnek veriler başarıyla yüklendi.'; 