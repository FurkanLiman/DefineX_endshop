USE [master]
GO
/****** Object:  Database [AndShopDB]    Script Date: 2.04.2025 12:07:06 ******/
CREATE DATABASE [AndShopDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'AndShopDB', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\AndShopDB.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'AndShopDB_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\AndShopDB_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [AndShopDB] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [AndShopDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [AndShopDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [AndShopDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [AndShopDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [AndShopDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [AndShopDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [AndShopDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [AndShopDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [AndShopDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [AndShopDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [AndShopDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [AndShopDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [AndShopDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [AndShopDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [AndShopDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [AndShopDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [AndShopDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [AndShopDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [AndShopDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [AndShopDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [AndShopDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [AndShopDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [AndShopDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [AndShopDB] SET RECOVERY FULL 
GO
ALTER DATABASE [AndShopDB] SET  MULTI_USER 
GO
ALTER DATABASE [AndShopDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [AndShopDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [AndShopDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [AndShopDB] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [AndShopDB] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [AndShopDB] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'AndShopDB', N'ON'
GO
ALTER DATABASE [AndShopDB] SET QUERY_STORE = ON
GO
ALTER DATABASE [AndShopDB] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [AndShopDB]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Addresses]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Addresses](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Title] [nvarchar](100) NOT NULL,
	[FullName] [nvarchar](100) NOT NULL,
	[Phone] [nvarchar](20) NOT NULL,
	[City] [nvarchar](100) NOT NULL,
	[District] [nvarchar](100) NOT NULL,
	[AddressDetail] [nvarchar](500) NOT NULL,
	[ZipCode] [nvarchar](20) NOT NULL,
	[IsDefault] [bit] NOT NULL,
 CONSTRAINT [PK_Addresses] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[Description] [nvarchar](500) NULL,
	[ImageUrl] [nvarchar](255) NULL,
 CONSTRAINT [PK_Categories] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Coupons]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Coupons](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](20) NOT NULL,
	[Description] [nvarchar](100) NOT NULL,
	[DiscountType] [int] NOT NULL,
	[DiscountValue] [decimal](18, 2) NOT NULL,
	[MinimumOrderAmount] [decimal](18, 2) NULL,
	[MaximumDiscountAmount] [decimal](18, 2) NULL,
	[IsActive] [bit] NOT NULL,
	[StartDate] [datetime2](7) NULL,
	[EndDate] [datetime2](7) NULL,
	[UsageLimit] [int] NULL,
	[UsageCount] [int] NOT NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[UpdatedAt] [datetime2](7) NULL,
 CONSTRAINT [PK_Coupons] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OrderItems]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OrderItems](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OrderId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[Price] [decimal](18, 2) NOT NULL,
	[Size] [nvarchar](50) NULL,
	[Color] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[OrderDate] [datetime] NOT NULL,
	[AddressId] [int] NULL,
	[OrderStatus] [nvarchar](50) NULL,
	[TotalAmount] [decimal](18, 2) NOT NULL,
	[DiscountAmount] [decimal](18, 2) NULL,
	[ShippingCost] [decimal](18, 2) NULL,
	[PaymentMethod] [nvarchar](50) NULL,
	[PaymentStatus] [nvarchar](50) NULL,
	[TrackingNumber] [nvarchar](100) NULL,
	[CouponCode] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Title] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](1000) NULL,
	[Price] [decimal](18, 2) NOT NULL,
	[DiscountPrice] [decimal](18, 2) NULL,
	[CategoryId] [int] NULL,
	[Category] [nvarchar](100) NULL,
	[Image] [nvarchar](500) NULL,
	[ImageUrl] [nvarchar](500) NULL,
	[Sizes] [nvarchar](200) NULL,
	[Colors] [nvarchar](200) NULL,
	[Discount] [decimal](18, 2) NOT NULL,
	[Collection] [nvarchar](100) NULL,
	[Stock] [int] NOT NULL,
	[Rating] [decimal](3, 1) NOT NULL,
	[New] [bit] NOT NULL,
	[Hot] [bit] NOT NULL,
	[Brand] [nvarchar](100) NULL,
 CONSTRAINT [PK_Products] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Reviews]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Reviews](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ProductId] [int] NOT NULL,
	[UserId] [int] NOT NULL,
	[Rating] [int] NOT NULL,
	[Comment] [nvarchar](500) NOT NULL,
	[Title] [nvarchar](100) NULL,
	[CreatedAt] [datetime2](7) NOT NULL,
	[IsApproved] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](100) NOT NULL,
	[LastName] [nvarchar](100) NOT NULL,
	[Email] [nvarchar](100) NOT NULL,
	[PasswordHash] [nvarchar](255) NOT NULL,
	[Phone] [nvarchar](20) NULL,
	[Avatar] [nvarchar](255) NULL,
	[Role] [nvarchar](20) NOT NULL,
	[Favorites] [nvarchar](max) NOT NULL,
	[Gender] [nvarchar](50) NULL,
	[Birthday] [datetime] NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Wishlists]    Script Date: 2.04.2025 12:07:06 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Wishlists](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[ProductIds] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Wishlists] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Addresses] ON 

INSERT [dbo].[Addresses] ([Id], [UserId], [Title], [FullName], [Phone], [City], [District], [AddressDetail], [ZipCode], [IsDefault]) VALUES (1, 4, N'Ev', N'Ahmet Yılmaz', N'(555) 123 45 67', N'İstanbul', N'Kadıköy', N'Caferağa Mah. Suadiye Cad. No:20', N'34710', 1)
INSERT [dbo].[Addresses] ([Id], [UserId], [Title], [FullName], [Phone], [City], [District], [AddressDetail], [ZipCode], [IsDefault]) VALUES (2, 5, N'Fatma Öztürk', N'Fatma Öztürk', N'(555) 123 45 67', N'Ankara', N'Çankaya', N'Bahçelievler Mah. 123. Cad. No:50', N'06510', 1)
INSERT [dbo].[Addresses] ([Id], [UserId], [Title], [FullName], [Phone], [City], [District], [AddressDetail], [ZipCode], [IsDefault]) VALUES (3, 3, N'Test User', N'Test User', N'(555) 555 55 55', N'İzmir', N'Konak', N'Alsancak Mah. 456 Sok. No:10', N'35220', 1)
SET IDENTITY_INSERT [dbo].[Addresses] OFF
GO
SET IDENTITY_INSERT [dbo].[Categories] ON 

INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (1, N'Erkek Giyim', N'Erkekler için t-shirt, gömlek, pantolon, ceket vb.', N'https://fakestoreapi.com/img/category/men.jpg')
INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (2, N'Kadın Giyim', N'Kadınlar için bluz, elbise, etek, pantolon ve daha fazlası.', N'https://fakestoreapi.com/img/category/women.jpg')
INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (3, N'Çocuk Giyim', N'Çocuklar için günlük kıyafetler ve okul üniformaları.', N'https://fakestoreapi.com/img/category/kid.jpg')
INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (4, N'Ayakkabı & Çanta', N'Erkek, kadın ve çocuk ayakkabıları, çantalar ve aksesuarlar.', N'https://fakestoreapi.com/img/category/shoes.jpg')
INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (5, N'Spor Giyim', N'Spor ve fitness giyim, koşu, yoga ve antrenman kıyafetleri.', N'https://fakestoreapi.com/img/category/sport.jpg')
INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (11, N'Erkek Giyim', N'Erkekler için t-shirt, gömlek, pantolon, ceket vb.', N'https://fakestoreapi.com/img/category/men.jpg')
INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (12, N'Kadın Giyim', N'Kadınlar için bluz, elbise, etek, pantolon ve daha fazlası.', N'https://fakestoreapi.com/img/category/women.jpg')
INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (13, N'Çocuk Giyim', N'Çocuklar için günlük kıyafetler ve okul üniformaları.', N'https://fakestoreapi.com/img/category/kid.jpg')
INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (14, N'Ayakkabı & Çanta', N'Erkek, kadın ve çocuk ayakkabıları, çantalar ve aksesuarlar.', N'https://fakestoreapi.com/img/category/shoes.jpg')
INSERT [dbo].[Categories] ([Id], [Name], [Description], [ImageUrl]) VALUES (15, N'Spor Giyim', N'Spor ve fitness giyim, koşu, yoga ve antrenman kıyafetleri.', N'https://fakestoreapi.com/img/category/sport.jpg')
SET IDENTITY_INSERT [dbo].[Categories] OFF
GO
SET IDENTITY_INSERT [dbo].[Coupons] ON 

INSERT [dbo].[Coupons] ([Id], [Code], [Description], [DiscountType], [DiscountValue], [MinimumOrderAmount], [MaximumDiscountAmount], [IsActive], [StartDate], [EndDate], [UsageLimit], [UsageCount], [CreatedAt], [UpdatedAt]) VALUES (1, N'HOSGELDIN', N'Hoş Geldin İndirimi - İlk Alışverişe Özel', 2, CAST(10.00 AS Decimal(18, 2)), CAST(100.00 AS Decimal(18, 2)), CAST(50.00 AS Decimal(18, 2)), 1, CAST(N'2023-01-01T00:00:00.0000000' AS DateTime2), CAST(N'2025-12-31T00:00:00.0000000' AS DateTime2), 1000, 0, CAST(N'2025-03-29T23:49:25.3766670' AS DateTime2), NULL)
INSERT [dbo].[Coupons] ([Id], [Code], [Description], [DiscountType], [DiscountValue], [MinimumOrderAmount], [MaximumDiscountAmount], [IsActive], [StartDate], [EndDate], [UsageLimit], [UsageCount], [CreatedAt], [UpdatedAt]) VALUES (2, N'YENI10', N'Yeni Üyelere Özel 10TL İndirim', 1, CAST(10.00 AS Decimal(18, 2)), CAST(50.00 AS Decimal(18, 2)), CAST(600.00 AS Decimal(18, 2)), 1, CAST(N'2023-01-01T00:00:00.0000000' AS DateTime2), CAST(N'2025-12-31T00:00:00.0000000' AS DateTime2), 1000, 0, CAST(N'2025-03-29T23:49:25.3766670' AS DateTime2), NULL)
INSERT [dbo].[Coupons] ([Id], [Code], [Description], [DiscountType], [DiscountValue], [MinimumOrderAmount], [MaximumDiscountAmount], [IsActive], [StartDate], [EndDate], [UsageLimit], [UsageCount], [CreatedAt], [UpdatedAt]) VALUES (3, N'YUZDE25', N'Seçili Ürünlerde %25 İndirim', 2, CAST(25.00 AS Decimal(18, 2)), CAST(150.00 AS Decimal(18, 2)), CAST(1000.00 AS Decimal(18, 2)), 1, CAST(N'2023-01-01T00:00:00.0000000' AS DateTime2), CAST(N'2025-12-31T00:00:00.0000000' AS DateTime2), 500, 0, CAST(N'2025-03-29T23:49:25.3766670' AS DateTime2), NULL)
INSERT [dbo].[Coupons] ([Id], [Code], [Description], [DiscountType], [DiscountValue], [MinimumOrderAmount], [MaximumDiscountAmount], [IsActive], [StartDate], [EndDate], [UsageLimit], [UsageCount], [CreatedAt], [UpdatedAt]) VALUES (7, N'HOSGELDIN', N'Hoş Geldin İndirimi - İlk Alışverişe Özel', 2, CAST(10.00 AS Decimal(18, 2)), CAST(100.00 AS Decimal(18, 2)), CAST(50.00 AS Decimal(18, 2)), 1, CAST(N'2023-01-01T00:00:00.0000000' AS DateTime2), CAST(N'2025-12-31T00:00:00.0000000' AS DateTime2), 1000, 0, CAST(N'2025-03-29T23:49:25.3766670' AS DateTime2), NULL)
INSERT [dbo].[Coupons] ([Id], [Code], [Description], [DiscountType], [DiscountValue], [MinimumOrderAmount], [MaximumDiscountAmount], [IsActive], [StartDate], [EndDate], [UsageLimit], [UsageCount], [CreatedAt], [UpdatedAt]) VALUES (8, N'YENI10', N'Yeni Üyelere Özel 10TL İndirim', 1, CAST(10.00 AS Decimal(18, 2)), CAST(50.00 AS Decimal(18, 2)), CAST(600.00 AS Decimal(18, 2)), 1, CAST(N'2023-01-01T00:00:00.0000000' AS DateTime2), CAST(N'2025-12-31T00:00:00.0000000' AS DateTime2), 1000, 0, CAST(N'2025-03-29T23:49:25.3766670' AS DateTime2), NULL)
INSERT [dbo].[Coupons] ([Id], [Code], [Description], [DiscountType], [DiscountValue], [MinimumOrderAmount], [MaximumDiscountAmount], [IsActive], [StartDate], [EndDate], [UsageLimit], [UsageCount], [CreatedAt], [UpdatedAt]) VALUES (9, N'YUZDE25', N'Seçili Ürünlerde %25 İndirim', 2, CAST(25.00 AS Decimal(18, 2)), CAST(150.00 AS Decimal(18, 2)), CAST(1000.00 AS Decimal(18, 2)), 1, CAST(N'2023-01-01T00:00:00.0000000' AS DateTime2), CAST(N'2025-12-31T00:00:00.0000000' AS DateTime2), 500, 0, CAST(N'2025-03-29T23:49:25.3766670' AS DateTime2), NULL)
SET IDENTITY_INSERT [dbo].[Coupons] OFF
GO
SET IDENTITY_INSERT [dbo].[OrderItems] ON 

INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (1, 1, 1, 2, CAST(130.03 AS Decimal(18, 2)), N'S', N'Black')
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (2, 2, 5, 1, CAST(149.99 AS Decimal(18, 2)), NULL, NULL)
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (3, 2, 7, 1, CAST(229.99 AS Decimal(18, 2)), NULL, NULL)
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (4, 2, 9, 1, CAST(79.99 AS Decimal(18, 2)), NULL, NULL)
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (5, 2, 11, 1, CAST(399.99 AS Decimal(18, 2)), NULL, NULL)
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (6, 2, 17, 1, CAST(99.99 AS Decimal(18, 2)), NULL, NULL)
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (7, 3, 2, 1, CAST(199.99 AS Decimal(18, 2)), NULL, NULL)
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (8, 3, 4, 3, CAST(179.99 AS Decimal(18, 2)), N'S', N'Black')
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (9, 3, 5, 1, CAST(149.99 AS Decimal(18, 2)), NULL, NULL)
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (10, 3, 8, 1, CAST(179.99 AS Decimal(18, 2)), NULL, NULL)
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (11, 4, 7, 3, CAST(229.99 AS Decimal(18, 2)), NULL, NULL)
INSERT [dbo].[OrderItems] ([Id], [OrderId], [ProductId], [Quantity], [Price], [Size], [Color]) VALUES (12, 4, 8, 3, CAST(179.99 AS Decimal(18, 2)), NULL, NULL)
SET IDENTITY_INSERT [dbo].[OrderItems] OFF
GO
SET IDENTITY_INSERT [dbo].[Orders] ON 

INSERT [dbo].[Orders] ([Id], [UserId], [OrderDate], [AddressId], [OrderStatus], [TotalAmount], [DiscountAmount], [ShippingCost], [PaymentMethod], [PaymentStatus], [TrackingNumber], [CouponCode]) VALUES (1, 4, CAST(N'2025-04-02T08:53:09.330' AS DateTime), 1, N'shipped', CAST(270.06 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(10.00 AS Decimal(18, 2)), N'cash_on_delivery', N'Beklemede', NULL, NULL)
INSERT [dbo].[Orders] ([Id], [UserId], [OrderDate], [AddressId], [OrderStatus], [TotalAmount], [DiscountAmount], [ShippingCost], [PaymentMethod], [PaymentStatus], [TrackingNumber], [CouponCode]) VALUES (2, 4, CAST(N'2025-04-02T08:54:40.820' AS DateTime), 1, N'processing', CAST(969.95 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(10.00 AS Decimal(18, 2)), N'cash_on_delivery', N'Beklemede', NULL, NULL)
INSERT [dbo].[Orders] ([Id], [UserId], [OrderDate], [AddressId], [OrderStatus], [TotalAmount], [DiscountAmount], [ShippingCost], [PaymentMethod], [PaymentStatus], [TrackingNumber], [CouponCode]) VALUES (3, 5, CAST(N'2025-04-02T08:56:31.870' AS DateTime), 2, N'Beklemede', CAST(1079.94 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(10.00 AS Decimal(18, 2)), N'cash_on_delivery', N'Beklemede', NULL, NULL)
INSERT [dbo].[Orders] ([Id], [UserId], [OrderDate], [AddressId], [OrderStatus], [TotalAmount], [DiscountAmount], [ShippingCost], [PaymentMethod], [PaymentStatus], [TrackingNumber], [CouponCode]) VALUES (4, 3, CAST(N'2025-04-02T08:57:45.387' AS DateTime), 3, N'delivered', CAST(1239.94 AS Decimal(18, 2)), CAST(0.00 AS Decimal(18, 2)), CAST(10.00 AS Decimal(18, 2)), N'cash_on_delivery', N'Beklemede', NULL, NULL)
SET IDENTITY_INSERT [dbo].[Orders] OFF
GO
SET IDENTITY_INSERT [dbo].[Products] ON 

INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (1, N'Slim Fit Pamuklu T-Shirtx', N'Yüksek kaliteli pamuktan üretilmiş, slim fit kesim erkek t-shirt.x', CAST(130.03 AS Decimal(18, 2)), CAST(98.98 AS Decimal(18, 2)), 1, N'Erkek Giyim', N'https://www.zafoni.com/i/l/007/0070487_erkek-oversize-baskisiz-tisort-beyaz.jpeg', N'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', N'S,M,L,XL,XXL', N'Black,White,Navy,Gray', CAST(0.00 AS Decimal(18, 2)), N'Yaz 2023', 43, CAST(4.5 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (2, N'Regular Fit Oxford Gömlek', N'Her sezon giyilebilecek klasik model oxford gömlek.', CAST(199.99 AS Decimal(18, 2)), CAST(179.99 AS Decimal(18, 2)), 1, N'Erkek Giyim', N'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', N'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', N'S,M,L,XL,XXL', N'Blue,White,Light Blue', CAST(20.00 AS Decimal(18, 2)), N'Dört Mevsim', 74, CAST(5.0 AS Decimal(3, 1)), 0, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (3, N'Slim Fit Chino Bluz', N'Rahat ve şık slim fit kesim, pamuklu chino pantolon.', CAST(249.99 AS Decimal(18, 2)), NULL, 1, N'Erkek Giyim', N'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', N'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', N'29,30,31,32,33,34,36,38', N'Beige,Navy,Black,Khaki', CAST(0.00 AS Decimal(18, 2)), N'Dört Mevsim', 60, CAST(4.0 AS Decimal(3, 1)), 0, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (4, N'Softshell Yağmur Geçirmez Mont', N'Rahat kesim, içi polar kapüşonlu sweatshirt.', CAST(179.99 AS Decimal(18, 2)), CAST(149.99 AS Decimal(18, 2)), 1, N'Erkek Giyim', N'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', N'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', N'S,M,L,XL,XXL', N'Black,Gray,Navy', CAST(30.00 AS Decimal(18, 2)), N'Sonbahar 2023', 72, CAST(4.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (5, N'Diz Boyu Kot Mont', N'Şık ve rahat kesim, yarım kollu V yaka bluz.', CAST(149.99 AS Decimal(18, 2)), NULL, 2, N'Kadın Giyim', N'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg', N'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg', N'XS,S,M,L,XL', N'White,Black,Red,Blue', CAST(0.00 AS Decimal(18, 2)), N'Yaz 2023', 118, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (6, N'T-Shirt Pantolon Set', N'Zarif ve modern kesim, günlük kullanım için ideal set.', CAST(299.99 AS Decimal(18, 2)), CAST(249.99 AS Decimal(18, 2)), 2, N'Kadın Giyim', N'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg', N'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg', N'XS,S,M,L,XL', N'Black,Navy,Maroon', CAST(50.00 AS Decimal(18, 2)), N'Yaz 2023', 60, CAST(4.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (7, N'Latex Kazak', N'Yüksek bel, vücudu saran modern kesim kazak.', CAST(229.99 AS Decimal(18, 2)), NULL, 2, N'Kadın Giyim', N'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', N'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', N'34,36,38,40,42,44', N'Blue,Black,Gray', CAST(0.00 AS Decimal(18, 2)), N'Dört Mevsim', 86, CAST(5.0 AS Decimal(3, 1)), 0, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (8, N'Triko Kazak', N'Yumuşak dokulu, boğazlı model triko kazak.', CAST(179.99 AS Decimal(18, 2)), CAST(159.99 AS Decimal(18, 2)), 2, N'Kadın Giyim', N'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg', N'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg', N'XS,S,M,L,XL', N'Ecru,Gray,Black,Maroon', CAST(20.00 AS Decimal(18, 2)), N'Kış 2023', 66, CAST(4.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (9, N'Çok Amaçlı Çanta', N'Şık ve kullanışlı orta boy omuz çantası.', CAST(79.99 AS Decimal(18, 2)), NULL, 3, N'Çocuk Giyim', N'https://m.media-amazon.com/images/I/71mEsHyzSCL._AC_UL640_QL65_.jpg', N'https://m.media-amazon.com/images/I/71mEsHyzSCL._AC_UL640_QL65_.jpg', N'4-5,6-7,8-9,10-11,12-13', N'Blue,Red,Green', CAST(0.00 AS Decimal(18, 2)), N'Yaz 2023', 49, CAST(4.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (10, N'Kız Çocuk Elbise', N'Şirin desenli, rahat kesim kız çocuk elbisesi.', CAST(129.99 AS Decimal(18, 2)), CAST(104.99 AS Decimal(18, 2)), 3, N'Çocuk Giyim', N'https://www.littlehoneybunnies.com/limon-sarisi-keten-gorunumlu-kiz-cocuk-kisa-kol-gomlek-etek-2li-takim-19144-60-K.jpg', N'https://www.littlehoneybunnies.com/limon-sarisi-keten-gorunumlu-kiz-cocuk-kisa-kol-gomlek-etek-2li-takim-19144-60-K.jpg', N'4-5,6-7,8-9,10-11,12-13', N'Pink,Purple,Blue', CAST(25.00 AS Decimal(18, 2)), N'Yaz 2023', 40, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (11, N'Erkek Deri Ayakkabı', N'Gerçek deri, klasik model erkek ayakkabısı.', CAST(399.99 AS Decimal(18, 2)), CAST(349.99 AS Decimal(18, 2)), 4, N'Ayakkabı & Çanta', N'https://static.ticimax.cloud/cdn-cgi/image/width=-,quality=85/41550/uploads/urunresimleri/buyuk/hakiki-deri-siyah-bagcikli-eva-tabanli--9827-.jpg', N'https://static.ticimax.cloud/cdn-cgi/image/width=-,quality=85/41550/uploads/urunresimleri/buyuk/hakiki-deri-siyah-bagcikli-eva-tabanli--9827-.jpg', N'40,41,42,43,44,45', N'Black,Brown', CAST(50.00 AS Decimal(18, 2)), N'Dört Mevsim', 29, CAST(4.0 AS Decimal(3, 1)), 0, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (12, N'Elmas Yüzük', N'Zarif tasarımıyla öne çıkan elmas yüzük.', CAST(349.99 AS Decimal(18, 2)), NULL, 4, N'Ayakkabı & Çanta', N'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg', N'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg', N'35,36,37,38,39,40', N'Black,Red,Beige', CAST(0.00 AS Decimal(18, 2)), N'Dört Mevsim', 25, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (13, N'Sırt Çantası', N'Kullanışlı ve şık sırt çantası, günlük kullanım için ideal.', CAST(299.99 AS Decimal(18, 2)), CAST(259.99 AS Decimal(18, 2)), 4, N'Ayakkabı & Çanta', N'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', N'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', N'Universal', N'Black,Brown,Maroon', CAST(40.00 AS Decimal(18, 2)), N'Yaz 2023', 20, CAST(4.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (14, N'Kadın Spor Tayt', N'Yüksek bel, terletmeyen kumaş, spor tayt.', CAST(149.99 AS Decimal(18, 2)), NULL, 5, N'Spor Giyim', N'https://static.ticimax.cloud/37864/uploads/urunresimleri/buyuk/monroe-likrali-comfort-fit-siyah-tayt-77a928.jpg', N'https://static.ticimax.cloud/37864/uploads/urunresimleri/buyuk/monroe-likrali-comfort-fit-siyah-tayt-77a928.jpg', N'XS,S,M,L,XL', N'Black,Gray,Navy', CAST(0.00 AS Decimal(18, 2)), N'Fitness 2023', 60, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (15, N'Erkek Spor T-Shirt', N'Nefes alabilir kumaş, rahat kesim spor t-shirt.', CAST(119.99 AS Decimal(18, 2)), CAST(99.99 AS Decimal(18, 2)), 5, N'Spor Giyim', N'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', N'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', N'S,M,L,XL,XXL', N'Black,Blue,Red,Gray', CAST(20.00 AS Decimal(18, 2)), N'Fitness 2023', 80, CAST(4.0 AS Decimal(3, 1)), 0, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (16, N'Deri Kemer', N'Gerçek deri, klasik toka erkek kemeri.', CAST(129.99 AS Decimal(18, 2)), NULL, 6, N'Aksesuarlar', N'https://static.ticimax.cloud/44746/uploads/urunresimleri/buyuk/ida-kadin-deri-kemer-6bf-a9.jpg', N'https://static.ticimax.cloud/44746/uploads/urunresimleri/buyuk/ida-kadin-deri-kemer-6bf-a9.jpg', N'S,M,L,XL', N'Black,Brown', CAST(0.00 AS Decimal(18, 2)), N'Klasik', 40, CAST(4.0 AS Decimal(3, 1)), 0, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (17, N'Spor Ceketi', N'Yüksek kaliteli dokusu ve şık tasarımıyla spor ceketi.', CAST(99.99 AS Decimal(18, 2)), CAST(84.99 AS Decimal(18, 2)), 6, N'Aksesuarlar', N'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg', N'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg', N'Universal', N'Black', CAST(15.00 AS Decimal(18, 2)), N'Yaz 2023', 29, CAST(5.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (18, N'Güneş Gözlüğü', N'UV korumalı, şık çerçeveli unisex güneş gözlüğü.', CAST(199.99 AS Decimal(18, 2)), NULL, 6, N'Aksesuarlar', N'https://floimages.mncdn.com/media/catalog/product/24-08/01/201303337-1-1722519294.jpg', N'https://floimages.mncdn.com/media/catalog/product/24-08/01/201303337-1-1722519294.jpg', N'Universal', N'Black,Brown,Gold', CAST(0.00 AS Decimal(18, 2)), N'Yaz 2023', 25, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (37, N'Slim Fit Pamuklu T-Shirtx', N'Yüksek kaliteli pamuktan üretilmiş, slim fit kesim erkek t-shirt.x', CAST(130.03 AS Decimal(18, 2)), CAST(98.98 AS Decimal(18, 2)), 1, N'Erkek Giyim', N'https://www.zafoni.com/i/l/007/0070487_erkek-oversize-baskisiz-tisort-beyaz.jpeg', N'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', N'S,M,L,XL,XXL', N'Black,White,Navy,Gray', CAST(0.00 AS Decimal(18, 2)), N'Yaz 2023', 45, CAST(5.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (38, N'Regular Fit Oxford Gömlek', N'Her sezon giyilebilecek klasik model oxford gömlek.', CAST(199.99 AS Decimal(18, 2)), CAST(179.99 AS Decimal(18, 2)), 1, N'Erkek Giyim', N'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', N'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', N'S,M,L,XL,XXL', N'Blue,White,Light Blue', CAST(20.00 AS Decimal(18, 2)), N'Dört Mevsim', 75, CAST(5.0 AS Decimal(3, 1)), 0, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (39, N'Slim Fit Chino Bluz', N'Rahat ve şık slim fit kesim, pamuklu chino pantolon.', CAST(249.99 AS Decimal(18, 2)), NULL, 1, N'Erkek Giyim', N'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', N'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', N'29,30,31,32,33,34,36,38', N'Beige,Navy,Black,Khaki', CAST(0.00 AS Decimal(18, 2)), N'Dört Mevsim', 60, CAST(4.0 AS Decimal(3, 1)), 0, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (40, N'Softshell Yağmur Geçirmez Mont', N'Rahat kesim, içi polar kapüşonlu sweatshirt.', CAST(179.99 AS Decimal(18, 2)), CAST(149.99 AS Decimal(18, 2)), 1, N'Erkek Giyim', N'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', N'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', N'S,M,L,XL,XXL', N'Black,Gray,Navy', CAST(30.00 AS Decimal(18, 2)), N'Sonbahar 2023', 75, CAST(4.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (41, N'Diz Boyu Kot Mont', N'Şık ve rahat kesim, yarım kollu V yaka bluz.', CAST(149.99 AS Decimal(18, 2)), NULL, 2, N'Kadın Giyim', N'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg', N'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg', N'XS,S,M,L,XL', N'White,Black,Red,Blue', CAST(0.00 AS Decimal(18, 2)), N'Yaz 2023', 120, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (42, N'T-Shirt Pantolon Set', N'Zarif ve modern kesim, günlük kullanım için ideal set.', CAST(299.99 AS Decimal(18, 2)), CAST(249.99 AS Decimal(18, 2)), 2, N'Kadın Giyim', N'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg', N'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg', N'XS,S,M,L,XL', N'Black,Navy,Maroon', CAST(50.00 AS Decimal(18, 2)), N'Yaz 2023', 60, CAST(4.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (43, N'Latex Kazak', N'Yüksek bel, vücudu saran modern kesim kazak.', CAST(229.99 AS Decimal(18, 2)), NULL, 2, N'Kadın Giyim', N'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', N'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', N'34,36,38,40,42,44', N'Blue,Black,Gray', CAST(0.00 AS Decimal(18, 2)), N'Dört Mevsim', 90, CAST(5.0 AS Decimal(3, 1)), 0, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (44, N'Triko Kazak', N'Yumuşak dokulu, boğazlı model triko kazak.', CAST(179.99 AS Decimal(18, 2)), CAST(159.99 AS Decimal(18, 2)), 2, N'Kadın Giyim', N'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg', N'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg', N'XS,S,M,L,XL', N'Ecru,Gray,Black,Maroon', CAST(20.00 AS Decimal(18, 2)), N'Kış 2023', 70, CAST(4.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (45, N'Çok Amaçlı Çanta', N'Şık ve kullanışlı orta boy omuz çantası.', CAST(79.99 AS Decimal(18, 2)), NULL, 3, N'Çocuk Giyim', N'https://m.media-amazon.com/images/I/71mEsHyzSCL._AC_UL640_QL65_.jpg', N'https://m.media-amazon.com/images/I/71mEsHyzSCL._AC_UL640_QL65_.jpg', N'4-5,6-7,8-9,10-11,12-13', N'Blue,Red,Green', CAST(0.00 AS Decimal(18, 2)), N'Yaz 2023', 50, CAST(4.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (46, N'Kız Çocuk Elbise', N'Şirin desenli, rahat kesim kız çocuk elbisesi.', CAST(129.99 AS Decimal(18, 2)), CAST(104.99 AS Decimal(18, 2)), 3, N'Çocuk Giyim', N'https://www.littlehoneybunnies.com/limon-sarisi-keten-gorunumlu-kiz-cocuk-kisa-kol-gomlek-etek-2li-takim-19144-60-K.jpg', N'https://www.littlehoneybunnies.com/limon-sarisi-keten-gorunumlu-kiz-cocuk-kisa-kol-gomlek-etek-2li-takim-19144-60-K.jpg', N'4-5,6-7,8-9,10-11,12-13', N'Pink,Purple,Blue', CAST(25.00 AS Decimal(18, 2)), N'Yaz 2023', 40, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (47, N'Erkek Deri Ayakkabı', N'Gerçek deri, klasik model erkek ayakkabısı.', CAST(399.99 AS Decimal(18, 2)), CAST(349.99 AS Decimal(18, 2)), 4, N'Ayakkabı & Çanta', N'https://static.ticimax.cloud/cdn-cgi/image/width=-,quality=85/41550/uploads/urunresimleri/buyuk/hakiki-deri-siyah-bagcikli-eva-tabanli--9827-.jpg', N'https://static.ticimax.cloud/cdn-cgi/image/width=-,quality=85/41550/uploads/urunresimleri/buyuk/hakiki-deri-siyah-bagcikli-eva-tabanli--9827-.jpg', N'40,41,42,43,44,45', N'Black,Brown', CAST(50.00 AS Decimal(18, 2)), N'Dört Mevsim', 30, CAST(4.0 AS Decimal(3, 1)), 0, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (48, N'Elmas Yüzük', N'Zarif tasarımıyla öne çıkan elmas yüzük.', CAST(349.99 AS Decimal(18, 2)), NULL, 4, N'Ayakkabı & Çanta', N'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg', N'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg', N'35,36,37,38,39,40', N'Black,Red,Beige', CAST(0.00 AS Decimal(18, 2)), N'Dört Mevsim', 25, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (49, N'Sırt Çantası', N'Kullanışlı ve şık sırt çantası, günlük kullanım için ideal.', CAST(299.99 AS Decimal(18, 2)), CAST(259.99 AS Decimal(18, 2)), 4, N'Ayakkabı & Çanta', N'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', N'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', N'Universal', N'Black,Brown,Maroon', CAST(40.00 AS Decimal(18, 2)), N'Yaz 2023', 20, CAST(4.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (50, N'Kadın Spor Tayt', N'Yüksek bel, terletmeyen kumaş, spor tayt.', CAST(149.99 AS Decimal(18, 2)), NULL, 5, N'Spor Giyim', N'https://static.ticimax.cloud/37864/uploads/urunresimleri/buyuk/monroe-likrali-comfort-fit-siyah-tayt-77a928.jpg', N'https://static.ticimax.cloud/37864/uploads/urunresimleri/buyuk/monroe-likrali-comfort-fit-siyah-tayt-77a928.jpg', N'XS,S,M,L,XL', N'Black,Gray,Navy', CAST(0.00 AS Decimal(18, 2)), N'Fitness 2023', 60, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (51, N'Erkek Spor T-Shirt', N'Nefes alabilir kumaş, rahat kesim spor t-shirt.', CAST(119.99 AS Decimal(18, 2)), CAST(99.99 AS Decimal(18, 2)), 5, N'Spor Giyim', N'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', N'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', N'S,M,L,XL,XXL', N'Black,Blue,Red,Gray', CAST(20.00 AS Decimal(18, 2)), N'Fitness 2023', 80, CAST(4.0 AS Decimal(3, 1)), 0, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (52, N'Deri Kemer', N'Gerçek deri, klasik toka erkek kemeri.', CAST(129.99 AS Decimal(18, 2)), NULL, 6, N'Aksesuarlar', N'https://static.ticimax.cloud/44746/uploads/urunresimleri/buyuk/ida-kadin-deri-kemer-6bf-a9.jpg', N'https://static.ticimax.cloud/44746/uploads/urunresimleri/buyuk/ida-kadin-deri-kemer-6bf-a9.jpg', N'S,M,L,XL', N'Black,Brown', CAST(0.00 AS Decimal(18, 2)), N'Klasik', 40, CAST(4.0 AS Decimal(3, 1)), 0, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (53, N'Spor Ceketi', N'Yüksek kaliteli dokusu ve şık tasarımıyla spor ceketi.', CAST(99.99 AS Decimal(18, 2)), CAST(84.99 AS Decimal(18, 2)), 6, N'Aksesuarlar', N'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg', N'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg', N'Universal', NULL, CAST(15.00 AS Decimal(18, 2)), N'Yaz 2023', 30, CAST(5.0 AS Decimal(3, 1)), 1, 0, N'AndShop')
INSERT [dbo].[Products] ([Id], [Title], [Description], [Price], [DiscountPrice], [CategoryId], [Category], [Image], [ImageUrl], [Sizes], [Colors], [Discount], [Collection], [Stock], [Rating], [New], [Hot], [Brand]) VALUES (54, N'Güneş Gözlüğü', N'UV korumalı, şık çerçeveli unisex güneş gözlüğü.', CAST(199.99 AS Decimal(18, 2)), NULL, 6, N'Aksesuarlar', N'https://floimages.mncdn.com/media/catalog/product/24-08/01/201303337-1-1722519294.jpg', N'https://floimages.mncdn.com/media/catalog/product/24-08/01/201303337-1-1722519294.jpg', N'Universal', N'Black,Brown,Gold', CAST(0.00 AS Decimal(18, 2)), N'Yaz 2023', 25, CAST(5.0 AS Decimal(3, 1)), 1, 1, N'AndShop')
SET IDENTITY_INSERT [dbo].[Products] OFF
GO
SET IDENTITY_INSERT [dbo].[Reviews] ON 

INSERT [dbo].[Reviews] ([Id], [ProductId], [UserId], [Rating], [Comment], [Title], [CreatedAt], [IsApproved]) VALUES (1, 1, 4, 4, N'Bu tişört, kullanılan kaliteli kumaşı ve modern kesimiyle günlük kullanım için ideal. Yıkamalarda formunu ve rengini koruması da ekstra bir artı.', N'Mükemmel Kalite', CAST(N'2025-04-02T08:53:42.6832538' AS DateTime2), 1)
INSERT [dbo].[Reviews] ([Id], [ProductId], [UserId], [Rating], [Comment], [Title], [CreatedAt], [IsApproved]) VALUES (2, 8, 4, 5, N'Ürünün kaliteli kumaşı ve rahat kesimi sayesinde gün boyu konfor sağlıyor. Spor ve günlük kullanımda da ideal.', N'Mükemmel Konfor', CAST(N'2025-04-02T08:54:09.9516603' AS DateTime2), 1)
INSERT [dbo].[Reviews] ([Id], [ProductId], [UserId], [Rating], [Comment], [Title], [CreatedAt], [IsApproved]) VALUES (3, 8, 3, 3, N'Ürün açıklamalarda belirtilen özelliklerle tam örtüşmüyor. Dikiş ve kumaş kalitesi beklentilerin altında kaldı.', N'Beklentileri Karşılamadı', CAST(N'2025-04-02T08:58:50.5936321' AS DateTime2), 1)
INSERT [dbo].[Reviews] ([Id], [ProductId], [UserId], [Rating], [Comment], [Title], [CreatedAt], [IsApproved]) VALUES (4, 1, 3, 5, N'Bu pantolon, modern tasarımı ve rahat kesimi sayesinde kombinlere farklı bir hava katıyor. Günlük kullanım için ideal.
', N'Trendy ve Modern', CAST(N'2025-04-02T08:59:22.2576640' AS DateTime2), 1)
SET IDENTITY_INSERT [dbo].[Reviews] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [FirstName], [LastName], [Email], [PasswordHash], [Phone], [Avatar], [Role], [Favorites], [Gender], [Birthday]) VALUES (2, N'admin', N'admin', N'admin@mail.com', N'XmaqaDNH7cA5IW5VVdSHdw==:O4aYxKkGnMtNqeyWxhcDDvSzbU5qGoWTgb/virV8EWU=', N'(555) 555 55 55', N'https://ui-avatars.com/api/?name=admin+admin&background=f79837&color=fff', N'admin', N'[]', N'male', CAST(N'2000-11-11T00:00:00.000' AS DateTime))
INSERT [dbo].[Users] ([Id], [FirstName], [LastName], [Email], [PasswordHash], [Phone], [Avatar], [Role], [Favorites], [Gender], [Birthday]) VALUES (3, N'test', N'user', N'test@mail.com', N'D3in+XI72Cljx2HwpVj+2w==:a+WRhp6B0J/bylza4fWXvy3eHHI8isgGPCLfpb7a+DA=', N'(555) 555 55 55', N'https://ui-avatars.com/api/?name=test+user&background=f79837&color=fff', N'user', N'[7,8]', N'female', CAST(N'2000-11-22T00:00:00.000' AS DateTime))
INSERT [dbo].[Users] ([Id], [FirstName], [LastName], [Email], [PasswordHash], [Phone], [Avatar], [Role], [Favorites], [Gender], [Birthday]) VALUES (4, N'Ahmet', N'Yılmaz', N'ahmet@mail.com', N'OcrGYufOqo0+TJtKZG7gJQ==:ylvG7Igclhu0JTlFWNP8BA/VmtzHiMyA+LI4vyQ/T6c=', N'(555) 123 45 67', N'https://ui-avatars.com/api/?name=Ahmet+Y%C4%B1lmaz&background=f79837&color=fff', N'user', N'[8,5,4]', N'male', CAST(N'2000-11-12T00:00:00.000' AS DateTime))
INSERT [dbo].[Users] ([Id], [FirstName], [LastName], [Email], [PasswordHash], [Phone], [Avatar], [Role], [Favorites], [Gender], [Birthday]) VALUES (5, N'Fatma', N'Öztürk', N'fatma@mail.com', N'EB9pzYI/rUFjHRvz2IFN1Q==:51HYEyQv7P9MxW03VZRo4pasw15kV5FV39+lYiMX6fY=', N'(555) 123 45 67', N'https://ui-avatars.com/api/?name=Fatma+%C3%96zt%C3%BCrk&background=f79837&color=fff', N'user', N'[1,3,5,8]', N'female', CAST(N'2000-11-22T00:00:00.000' AS DateTime))
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT ((1)) FOR [IsActive]
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT ((0)) FOR [UsageCount]
GO
ALTER TABLE [dbo].[Coupons] ADD  DEFAULT (getdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[OrderItems] ADD  DEFAULT ((1)) FOR [Quantity]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT (getdate()) FOR [OrderDate]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ('Beklemede') FOR [OrderStatus]
GO
ALTER TABLE [dbo].[Orders] ADD  DEFAULT ('Beklemede') FOR [PaymentStatus]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [Discount]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [Stock]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [Rating]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [New]
GO
ALTER TABLE [dbo].[Products] ADD  DEFAULT ((0)) FOR [Hot]
GO
ALTER TABLE [dbo].[Reviews] ADD  DEFAULT (getutcdate()) FOR [CreatedAt]
GO
ALTER TABLE [dbo].[Reviews] ADD  DEFAULT ((1)) FOR [IsApproved]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('user') FOR [Role]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ('[]') FOR [Favorites]
GO
ALTER TABLE [dbo].[Wishlists] ADD  DEFAULT ('[]') FOR [ProductIds]
GO
ALTER TABLE [dbo].[Addresses]  WITH CHECK ADD  CONSTRAINT [FK_Addresses_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Addresses] CHECK CONSTRAINT [FK_Addresses_Users_UserId]
GO
ALTER TABLE [dbo].[OrderItems]  WITH CHECK ADD  CONSTRAINT [FK_OrderItems_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
GO
ALTER TABLE [dbo].[OrderItems] CHECK CONSTRAINT [FK_OrderItems_Products]
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([AddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([AddressId])
REFERENCES [dbo].[Addresses] ([Id])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Orders]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD  CONSTRAINT [FK_Reviews_Products] FOREIGN KEY([ProductId])
REFERENCES [dbo].[Products] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Reviews] CHECK CONSTRAINT [FK_Reviews_Products]
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD  CONSTRAINT [FK_Reviews_Users] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Reviews] CHECK CONSTRAINT [FK_Reviews_Users]
GO
ALTER TABLE [dbo].[Wishlists]  WITH CHECK ADD  CONSTRAINT [FK_Wishlists_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Wishlists] CHECK CONSTRAINT [FK_Wishlists_Users_UserId]
GO
ALTER TABLE [dbo].[Reviews]  WITH CHECK ADD  CONSTRAINT [CK_Reviews_Rating] CHECK  (([Rating]>=(1) AND [Rating]<=(5)))
GO
ALTER TABLE [dbo].[Reviews] CHECK CONSTRAINT [CK_Reviews_Rating]
GO
USE [master]
GO
ALTER DATABASE [AndShopDB] SET  READ_WRITE 
GO
