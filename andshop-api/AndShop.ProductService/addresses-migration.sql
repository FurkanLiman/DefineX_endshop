-- Adresler tablosunu oluşturma SQL script'i
-- Bu script çalıştırmadan önce veritabanında bu tablo var mı kontrol edin

-- Tablonun var olup olmadığını kontrol et ve yoksa oluştur
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
        [IsDefault] bit NOT NULL,
        CONSTRAINT [PK_Addresses] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Addresses_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
    );

    -- Unique index oluştur (her kullanıcının tek bir varsayılan adresi olabilir)
    CREATE UNIQUE INDEX [IX_Addresses_UserId_IsDefault] ON [Addresses] ([UserId], [IsDefault]) WHERE IsDefault = 1;
    
    PRINT 'Adres tablosu başarıyla oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'Adres tablosu zaten mevcut.';
END

-- Migration tablosuna ekle (optional)
IF EXISTS (SELECT * FROM sys.tables WHERE name = '__EFMigrationsHistory')
BEGIN
    -- Eğer bu migration kaydı yoksa ekle
    IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20250328115633_AddAddressTable')
    BEGIN
        INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
        VALUES (N'20250328115633_AddAddressTable', N'6.0.3');
        
        PRINT 'Migration kaydı eklendi.';
    END
    ELSE
    BEGIN
        PRINT 'Migration kaydı zaten mevcut.';
    END
END 