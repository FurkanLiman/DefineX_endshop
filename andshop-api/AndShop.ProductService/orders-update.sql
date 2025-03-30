IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Categories] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NULL,
    [ImageUrl] nvarchar(255) NULL,
    CONSTRAINT [PK_Categories] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [PasswordHash] nvarchar(255) NOT NULL,
    [Phone] nvarchar(20) NULL,
    [Avatar] nvarchar(255) NULL,
    [Role] nvarchar(20) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

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
    [Discount] decimal(18,2) NOT NULL,
    [Collection] nvarchar(100) NOT NULL,
    [Stock] int NOT NULL,
    [Rating] decimal(3,1) NOT NULL,
    [New] bit NOT NULL,
    [Hot] bit NOT NULL,
    [Brand] nvarchar(100) NOT NULL,
    CONSTRAINT [PK_Products] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Products_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]) ON DELETE SET NULL
);
GO

CREATE TABLE [Orders] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [OrderDate] datetime2 NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [OrderStatus] nvarchar(50) NOT NULL,
    [TotalAmount] decimal(18,2) NOT NULL,
    [ShippingAddress] nvarchar(200) NULL,
    [ShippingCity] nvarchar(100) NULL,
    [ShippingZipCode] nvarchar(20) NULL,
    [ShippingCountry] nvarchar(100) NULL,
    [PaymentMethod] nvarchar(50) NULL,
    [PaymentStatus] nvarchar(50) NULL,
    [TrackingNumber] nvarchar(100) NULL,
    CONSTRAINT [PK_Orders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Orders_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE CASCADE
);
GO

CREATE TABLE [OrderItems] (
    [Id] int NOT NULL IDENTITY,
    [OrderId] int NOT NULL,
    [ProductId] int NOT NULL,
    [Quantity] int NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [Size] nvarchar(50) NULL,
    [Color] nvarchar(50) NULL,
    CONSTRAINT [PK_OrderItems] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_OrderItems_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_OrderItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_OrderItems_OrderId] ON [OrderItems] ([OrderId]);
GO

CREATE INDEX [IX_OrderItems_ProductId] ON [OrderItems] ([ProductId]);
GO

CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);
GO

CREATE INDEX [IX_Products_CategoryId] ON [Products] ([CategoryId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250327183014_UpdateProductAndOrderModels', N'6.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [OrderItems] DROP CONSTRAINT [FK_OrderItems_Products_ProductId];
GO

ALTER TABLE [Products] DROP CONSTRAINT [FK_Products_Categories_CategoryId];
GO

ALTER TABLE [Users] ADD [Favorites] nvarchar(max) NOT NULL DEFAULT N'[]';
GO

ALTER TABLE [OrderItems] ADD CONSTRAINT [FK_OrderItems_Products_ProductId] FOREIGN KEY ([ProductId]) REFERENCES [Products] ([Id]) ON DELETE CASCADE;
GO

ALTER TABLE [Products] ADD CONSTRAINT [FK_Products_Categories_CategoryId] FOREIGN KEY ([CategoryId]) REFERENCES [Categories] ([Id]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250327220909_AddFavoritesToUsers', N'6.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Favorites');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Users] ALTER COLUMN [Favorites] nvarchar(max) NULL;
GO

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
GO

CREATE UNIQUE INDEX [IX_Addresses_UserId_IsDefault] ON [Addresses] ([UserId], [IsDefault]) WHERE IsDefault = 1;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250328115633_AddAddressTable', N'6.0.3');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Users] ADD [Birthday] datetime2 NULL;
GO

ALTER TABLE [Users] ADD [Gender] nvarchar(10) NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20250329192049_AddUserGenderAndBirthday', N'6.0.3');
GO

COMMIT;
GO

