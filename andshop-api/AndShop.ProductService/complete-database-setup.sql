-- AndShop E-Ticaret Veritabanı Kurulum Scripti
-- Bu script, AndShop E-Ticaret API için gerekli veritabanını oluşturur

-- Veritabanı kontrolü - bu veritabanını oluşturmak istediğinize emin olun!
-- USE [AndShopDB] -- Veritabanı bağlantısı için bu satırı açın

-- Migration tablosu oluşturma
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '__EFMigrationsHistory')
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
    PRINT 'Migration tablosu oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Migration tablosu zaten var.';
END

-- Kategori tablosu oluşturma
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Categories')
BEGIN
    CREATE TABLE [Categories] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [Description] nvarchar(500) NULL,
        [ImageUrl] nvarchar(255) NULL,
        CONSTRAINT [PK_Categories] PRIMARY KEY ([Id])
    );
    PRINT 'Categories tablosu oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Categories tablosu zaten var.';
END

-- Kullanıcı tablosu oluşturma
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE [Users] (
        [Id] int NOT NULL IDENTITY,
        [FirstName] nvarchar(100) NOT NULL,
        [LastName] nvarchar(100) NOT NULL,
        [Email] nvarchar(100) NOT NULL,
        [PasswordHash] nvarchar(255) NOT NULL,
        [Phone] nvarchar(20) NULL,
        [Avatar] nvarchar(255) NULL,
        [Role] nvarchar(20) NOT NULL DEFAULT 'User',
        [Gender] nvarchar(10) NULL,
        [Birthday] datetime2 NULL,
        [Favorites] nvarchar(max) NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
    );
    PRINT 'Users tablosu oluşturuldu.';
    
    -- Kullanıcı tablosuna email için unique index ekle
    IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email')
    BEGIN
        CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
        PRINT 'Kullanıcı e-posta unique index oluşturuldu.';
    END
END
ELSE
BEGIN
    PRINT 'Users tablosu zaten var.';
END

-- Ürün tablosu oluşturma
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Products')
BEGIN
    CREATE TABLE [Products] (
        [Id] int NOT NULL IDENTITY,
        [Title] nvarchar(200) NOT NULL,
        [Description] nvarchar(1000) NOT NULL,
        [Price] decimal(18,2) NOT NULL,
        [DiscountPrice] decimal(18,2) NULL,
        [CategoryId] int NULL,
        [Category] nvarchar(100) NOT NULL,
        [Image] nvarchar(500) NOT NULL,
        [ImageUrl] nvarchar(500) NOT NULL,
        [Sizes] nvarchar(max) NOT NULL,
        [Colors] nvarchar(max) NOT NULL,
        [Discount] decimal(18,2) NOT NULL DEFAULT 0,
        [Collection] nvarchar(100) NOT NULL DEFAULT '',
        [Stock] int NOT NULL DEFAULT 0,
        [Rating] decimal(3,1) NOT NULL DEFAULT 0,
        [New] bit NOT NULL DEFAULT 0,
        [Hot] bit NOT NULL DEFAULT 0,
        [Brand] nvarchar(100) NOT NULL DEFAULT '',
        CONSTRAINT [PK_Products] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Products_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE SET NULL
    );
    PRINT 'Products tablosu oluşturuldu.';
    
    -- Product tablosuna CategoryId indexi ekle
    CREATE INDEX [IX_Products_CategoryId] ON [Products] ([CategoryId]);
    PRINT 'Product CategoryId indexi oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Products tablosu zaten var.';
END

-- Adres tablosu oluşturma
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Addresses')
BEGIN
    CREATE TABLE [Addresses] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Title] nvarchar(100) NOT NULL,
        [FullName] nvarchar(100) NOT NULL,
        [Phone] nvarchar(20) NOT NULL,
        [City] nvarchar(100) NOT NULL,
        [District] nvarchar(100) NOT NULL,
        [AddressDetail] nvarchar(500) NOT NULL,
        [ZipCode] nvarchar(20) NOT NULL,
        [IsDefault] bit NOT NULL DEFAULT 0,
        CONSTRAINT [PK_Addresses] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Addresses_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
    PRINT 'Addresses tablosu oluşturuldu.';
    
    -- Unique index (her kullanıcının tek bir varsayılan adresi olabilir)
    CREATE UNIQUE INDEX [IX_Addresses_UserId_IsDefault] ON [Addresses] ([UserId], [IsDefault]) WHERE IsDefault = 1;
    PRINT 'Adres varsayılan indexi oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Addresses tablosu zaten var.';
END

-- Kupon tablosu oluşturma
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Coupons')
BEGIN
    CREATE TABLE [Coupons] (
        [Id] int NOT NULL IDENTITY,
        [Code] nvarchar(20) NOT NULL,
        [Description] nvarchar(100) NOT NULL,
        [DiscountType] int NOT NULL,
        [DiscountValue] decimal(18,2) NOT NULL,
        [MinimumOrderAmount] decimal(18,2) NULL,
        [MaximumDiscountAmount] decimal(18,2) NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [StartDate] datetime2 NULL,
        [EndDate] datetime2 NULL,
        [UsageLimit] int NULL,
        [UsageCount] int NOT NULL DEFAULT 0,
        [CreatedAt] datetime2 NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_Coupons] PRIMARY KEY ([Id])
    );
    PRINT 'Coupons tablosu oluşturuldu.';
    
    -- Kupon kodu için unique index
    CREATE UNIQUE INDEX [IX_Coupons_Code] ON [Coupons] ([Code]);
    PRINT 'Kupon kodu unique index oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Coupons tablosu zaten var.';
END

-- Sipariş tablosu oluşturma
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Orders')
BEGIN
    CREATE TABLE [Orders] (
        [Id] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [OrderDate] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [AddressId] int NULL,
        [OrderStatus] nvarchar(50) NOT NULL DEFAULT 'Beklemede',
        [TotalAmount] decimal(18,2) NOT NULL DEFAULT 0,
        [DiscountAmount] decimal(18,2) NULL,
        [ShippingCost] decimal(18,2) NULL,
        [PaymentMethod] nvarchar(50) NULL,
        [PaymentStatus] nvarchar(50) NULL DEFAULT 'Beklemede',
        [TrackingNumber] nvarchar(100) NULL,
        [CouponCode] nvarchar(50) NULL,
        CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Orders_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Orders_Addresses_AddressId] FOREIGN KEY ([AddressId]) REFERENCES [Addresses] ([Id]) ON DELETE SET NULL
    );
    PRINT 'Orders tablosu oluşturuldu.';
    
    -- Sipariş indexleri
    CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);
    CREATE INDEX [IX_Orders_AddressId] ON [Orders] ([AddressId]);
    PRINT 'Sipariş indexleri oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Orders tablosu zaten var.';
END

-- Sipariş detay tablosu oluşturma
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'OrderItems')
BEGIN
    CREATE TABLE [OrderItems] (
        [Id] int NOT NULL IDENTITY,
        [OrderId] int NOT NULL,
        [ProductId] int NOT NULL,
        [Quantity] int NOT NULL DEFAULT 1,
        [Price] decimal(18,2) NOT NULL,
        [Size] nvarchar(50) NULL,
        [Color] nvarchar(50) NULL,
        CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_OrderItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE
    );
    PRINT 'OrderItems tablosu oluşturuldu.';
    
    -- OrderItems indexleri
    CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);
    CREATE INDEX [IX_OrderItems_ProductId] ON [OrderItems] ([ProductId]);
    PRINT 'Sipariş detay indexleri oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'OrderItems tablosu zaten var.';
END

-- Değerlendirme tablosu oluşturma
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reviews')
BEGIN
    CREATE TABLE [Reviews] (
        [Id] int NOT NULL IDENTITY,
        [ProductId] int NOT NULL,
        [UserId] int NOT NULL,
        [Rating] int NOT NULL,
        [Comment] nvarchar(500) NOT NULL,
        [Title] nvarchar(100) NOT NULL DEFAULT '',
        [CreatedAt] datetime2 NOT NULL DEFAULT GETUTCDATE(),
        [IsApproved] bit NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Reviews] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Reviews_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Reviews_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );
    PRINT 'Reviews tablosu oluşturuldu.';
    
    -- Review indexleri
    CREATE INDEX [IX_Reviews_ProductId] ON [Reviews] ([ProductId]);
    CREATE INDEX [IX_Reviews_UserId] ON [Reviews] ([UserId]);
    PRINT 'Değerlendirme indexleri oluşturuldu.';
    
    -- Her ürün-kullanıcı ikilisi için tek değerlendirme kuralı
    CREATE UNIQUE INDEX [IX_Reviews_ProductId_UserId] ON [Reviews] ([ProductId], [UserId]);
    PRINT 'Değerlendirme unique indexi oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Reviews tablosu zaten var.';
END

-- Migration bilgisi ekle
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20250330000001_InitialCreate', '6.0.3');

PRINT 'Veritabanı başarıyla kuruldu.'; 