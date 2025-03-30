# SQL Server Migrations

SQL Server veritabanını kullanmak için gerekli migration adımları:

## Migration Komutları

1. **Initial Migration Oluşturma**

Package Manager Console'da:
```
Add-Migration InitialCreate
```

veya .NET CLI ile:
```
dotnet ef migrations add InitialCreate
```

2. **Veritabanını Güncelleme**

Package Manager Console'da:
```
Update-Database
```

veya .NET CLI ile:
```
dotnet ef database update
```

## Bağlantı Dizesi Yapılandırması

SQL Server bağlantı dizesi `appsettings.json` dosyasında şu şekilde tanımlanmıştır:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=AndShopDB;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

Bu bağlantı dizesini kendi SQL Server kurulumunuza göre düzenlemeniz gerekebilir:

- `Server`: SQL Server'ın adı veya adresi
- `Database`: Oluşturulacak veritabanının adı
- `Trusted_Connection=True`: Windows kimlik doğrulaması kullanılır
- `User ID` ve `Password`: SQL Server kimlik doğrulaması kullanıyorsanız bu parametreleri eklemeniz gerekir

## SQL Server Authentication için Örnek Bağlantı Dizesi

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=AndShopDB;User ID=sa;Password=YourPassword;MultipleActiveResultSets=true"
}
``` 