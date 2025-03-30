# AndShop API - .NET Core Microservice

## Proje Hakkında
Bu proje, Vue.js ile geliştirilen AndShop e-ticaret uygulaması için gerekli backend servislerini sağlamak üzere tasarlanmış bir microservice mimarisidir.

## Veritabanı Şeması

Veritabanı aşağıdaki tablolardan oluşur:

1. **Products**: Ürün bilgileri
2. **Categories**: Ürün kategorileri
3. **Users**: Kullanıcı bilgileri
4. **Orders**: Sipariş bilgileri
5. **OrderItems**: Sipariş içindeki ürünler

## Servisler

### Product Service
- Ürün, kategori, kullanıcı ve sipariş bilgilerini yönetmek için REST API
- Microsoft SQL Server veritabanı kullanımı

## Başlangıç

### Gereksinimler
- .NET SDK 6.0 veya üzeri
- Microsoft SQL Server (LocalDB veya tam versiyon)

### Kurulum ve Çalıştırma

1. Repoyu klonlayın
2. Veritabanı bağlantı dizesini yapılandırın (`appsettings.json`):
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=AndShopDB;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```
3. Migration komutlarını çalıştırın:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```
4. Uygulamayı başlatın:
```bash
dotnet run --project AndShop.ProductService
```
5. API'yi test edin - Swagger UI'ı açın:
```
http://localhost:5000/swagger
```

## API Endpoints

### Products API

| Method | URL                             | Açıklama                            |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/products                    | Tüm ürünleri listeler               |
| GET    | /api/products/{id}               | Belirli bir ürünün detayını getirir |
| GET    | /api/products/categories         | Tüm kategorileri listeler           |
| GET    | /api/products/category/{category}| Belirli bir kategorideki ürünleri listeler |
| GET    | /api/products/search?q={query}   | Ürünlerde arama yapar              |
| POST   | /api/products                    | Yeni ürün ekler                     |
| PUT    | /api/products/{id}               | Ürün bilgilerini günceller          |
| DELETE | /api/products/{id}               | Ürün siler                          |

### Categories API

| Method | URL                             | Açıklama                            |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/categories                  | Tüm kategorileri listeler           |
| GET    | /api/categories/{id}             | Belirli bir kategorinin detayını getirir |
| GET    | /api/categories/{id}/products    | Belirli bir kategorideki ürünleri listeler |
| POST   | /api/categories                  | Yeni kategori ekler                 |
| PUT    | /api/categories/{id}             | Kategori bilgilerini günceller      |
| DELETE | /api/categories/{id}             | Kategori siler                      |

### Users API

| Method | URL                             | Açıklama                            |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/users                       | Tüm kullanıcıları listeler          |
| GET    | /api/users/{id}                  | Belirli bir kullanıcının detayını getirir |
| GET    | /api/users/{id}/orders           | Belirli bir kullanıcının siparişlerini listeler |
| POST   | /api/users                       | Yeni kullanıcı ekler                |
| PUT    | /api/users/{id}                  | Kullanıcı bilgilerini günceller     |
| DELETE | /api/users/{id}                  | Kullanıcı siler                     |

### Orders API

| Method | URL                             | Açıklama                            |
|--------|----------------------------------|-------------------------------------|
| GET    | /api/orders                      | Tüm siparişleri listeler            |
| GET    | /api/orders/{id}                 | Belirli bir siparişin detayını getirir |
| POST   | /api/orders                      | Yeni sipariş ekler                  |
| PUT    | /api/orders/{id}                 | Sipariş bilgilerini günceller       |
| DELETE | /api/orders/{id}                 | Sipariş siler                       |

## Vue.js Entegrasyonu

Bu API, Vue.js ile geliştirilen AndShop e-ticaret uygulaması ile entegre çalışmak üzere tasarlanmıştır. Entegrasyon için Vue.js projesinde api/index.js dosyasındaki baseURL değişkenini şu şekilde güncelleyin:

```javascript
const baseURL = 'http://localhost:5000/api';
```

## Not
Bu proje, .NET Core microservice altyapısının temel özelliklerini göstermek için oluşturulmuş basit bir örnektir. Gerçek üretim ortamı için veritabanı bağlantısı, authentication ve daha fazla özellik eklenmelidir. 