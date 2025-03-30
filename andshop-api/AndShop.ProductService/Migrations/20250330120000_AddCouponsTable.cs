using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace AndShop.ProductService.Migrations
{
    public partial class AddCouponsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(maxLength: 20, nullable: false),
                    Description = table.Column<string>(maxLength: 100, nullable: false),
                    DiscountType = table.Column<int>(nullable: false),
                    DiscountValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MinimumOrderAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MaximumDiscountAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    IsActive = table.Column<bool>(nullable: false, defaultValue: true),
                    StartDate = table.Column<DateTime>(nullable: true),
                    EndDate = table.Column<DateTime>(nullable: true),
                    UsageLimit = table.Column<int>(nullable: true),
                    UsageCount = table.Column<int>(nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                    UpdatedAt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.Id);
                });
            
            // Benzersiz kupon kodu için unique index oluştur
            migrationBuilder.CreateIndex(
                name: "IX_Coupons_Code",
                table: "Coupons",
                column: "Code",
                unique: true);
                
            // Örnek kupon verileri ekleyelim
            migrationBuilder.InsertData(
                table: "Coupons",
                columns: new[] { "Code", "Description", "DiscountType", "DiscountValue", "MinimumOrderAmount", "MaximumDiscountAmount", "IsActive", "StartDate", "EndDate", "UsageLimit" },
                values: new object[,]
                {
                    { "HOSGELDIN", "Hoş Geldin İndirimi - İlk Alışverişe Özel", 2, 10m, 100m, 50m, true, new DateTime(2023, 1, 1), new DateTime(2025, 12, 31), 1000 },
                    { "YENI10", "Yeni Üyelere Özel 10TL İndirim", 1, 10m, 50m, null, true, new DateTime(2023, 1, 1), new DateTime(2025, 12, 31), 1000 },
                    { "YUZDE25", "Seçili Ürünlerde %25 İndirim", 2, 25m, 150m, 100m, true, new DateTime(2023, 1, 1), new DateTime(2025, 12, 31), 500 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Coupons");
        }
    }
} 