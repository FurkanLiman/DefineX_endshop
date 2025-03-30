# AndShop E-Ticaret Uygulaması

## Proje Hakkında

AndShop, Vue.js/Nuxt.js frontend ve .NET Core Web API backend kullanılarak geliştirilmiş modern bir e-ticaret platformudur. Bu proje, kullanıcıların ürünleri görüntüleyebilmesi, sepete ekleyebilmesi, sipariş verebilmesi ve sipariş geçmişini takip edebilmesi gibi e-ticaret işlemlerini desteklemektedir.

## Proje Yapısı

Proje iki ana bileşenden oluşmaktadır:

### 1. Backend API (andshop-api)
- .NET Core 6.0 tabanlı Microservice mimarisi
- Microsoft SQL Server veritabanı entegrasyonu
- RESTful API endpoints
- Repository pattern ve Entity Framework Core

### 2. Frontend Uygulaması (andshop-vue)
- Vue.js 2 / Nuxt.js 2 tabanlı SPA (Single Page Application)
- Bootstrap-Vue ile duyarlı (responsive) arayüz
- Vuex ile merkezi durum yönetimi
- Axios ile API entegrasyonu

## Özellikler

### Kullanıcı Özellikleri
- Kullanıcı kaydı ve girişi
- Ürün listeleme ve filtreleme
- Ürün detaylarını görüntüleme
- Sepet yönetimi
- Sipariş oluşturma ve takibi
- Adres yönetimi
- Ürün inceleme ve puanlama

### Yönetici Özellikleri
- Ürün ve kategori yönetimi
- Kullanıcı yönetimi
- Sipariş takibi ve güncelleme
- İnceleme yönetimi
- Kupon kodu yönetimi

## Teknoloji Yığını

### Backend (.NET Core)
- Programlama Dili: C#
- Framework: .NET Core 6.0
- ORM: Entity Framework Core
- Veritabanı: Microsoft SQL Server
- API Dokümantasyonu: Swagger

### Frontend (Vue.js)
- Framework: Vue.js 2 / Nuxt.js 2
- State Management: Vuex
- UI Framework: Bootstrap-Vue
- HTTP İstemcisi: Axios
- Kaydırma Efektleri: Swiper
- Grafik Görselleştirme: ApexCharts
- Form Doğrulama: Vuelidate
- Bildirimler: Vue-Toastification

## Kurulum ve Çalıştırma

### Gereksinimler
- .NET SDK 6.0 veya üzeri
- Node.js 14.x veya üzeri
- npm veya yarn
- Microsoft SQL Server (LocalDB veya tam versiyon)

### Backend API Kurulumu

1. Repoyu klonlayın ve andshop-api klasörüne gidin
```bash
git clone <repo-url>
cd andshop-api
```

2. Veritabanı bağlantı dizesini `appsettings.json` dosyasında yapılandırın:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=AndShopDB;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

3. Migration'ları çalıştırın:
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

4. API'yi başlatın:
```bash
dotnet run --project AndShop.ProductService
```

5. API swagger belgeleri şu adreste erişilebilir:
```
http://localhost:5000/swagger
```

### Frontend Kurulumu

1. andshop-vue klasörüne gidin
```bash
cd andshop-vue
```

2. Bağımlılıkları yükleyin:
```bash
npm install
# veya
yarn install
```

3. `nuxt.config.js` dosyasında backend API URL'ini yapılandırın:
```javascript
axios: {
  baseURL: 'http://localhost:5000'
}
```

4. Development server'ı başlatın:
```bash
npm run dev
# veya
yarn dev
```

5. Tarayıcınızda şu adrese gidin:
```
http://localhost:3000
```

## Veritabanı Kurulum ve Migration

Veritabanını kurmanın iki yolu bulunmaktadır:

### 1. Entity Framework Core Migration Kullanımı

Entity Framework Core migration'ları kullanarak veritabanını otomatik oluşturabilirsiniz:

```bash
cd andshop-api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 2. SQL Script Dosyaları ile Kurulum

Alternatif olarak, projedeki hazır SQL script dosyalarını kullanabilirsiniz:

#### A. Tek SQL Dosyası ile Tam Kurulum

Bu yöntem, tüm veritabanı şemasını tek bir adımda oluşturur:

1. Yeni bir veritabanı oluşturun (Örn: `AndShopDB`)
2. Aşağıdaki SQL script dosyasını çalıştırın:

```bash
# Tüm veritabanı şemasını ve tabloları oluşturur
sqlcmd -S [sunucu_adı] -d AndShopDB -i andshop-api/AndShop.ProductService/complete-database-setup.sql
```

#### B. Adım Adım SQL Script'leri ile Kurulum

Bu yöntem, veritabanı şemasını adım adım oluşturmak isterseniz kullanılabilir:

1. Yeni bir veritabanı oluşturun (Örn: `AndShopDB`)
2. Aşağıdaki SQL script dosyalarını sırasıyla çalıştırın:

```bash
# Temel veritabanı yapısını oluşturur
sqlcmd -S [sunucu_adı] -d AndShopDB -i andshop-api/AndShop.ProductService/migrate.sql

# Adres tablosu oluşturma ve güncelleme
sqlcmd -S [sunucu_adı] -d AndShopDB -i andshop-api/AndShop.ProductService/addresses-migration.sql
sqlcmd -S [sunucu_adı] -d AndShopDB -i andshop-api/AndShop.ProductService/update-address-model.sql

# Örnek veri ekleme
sqlcmd -S [sunucu_adı] -d AndShopDB -i andshop-api/AndShop.ProductService/addresses-data.sql
sqlcmd -S [sunucu_adı] -d AndShopDB -i andshop-api/AndShop.ProductService/orders-update.sql
```

*Not 1: `[sunucu_adı]` yerine kendi SQL Server sunucunuzun adını yazın.*

*Not 2: Önceki `migrate.sql` dosyasında bazı tablolarda tutarsızlıklar olabilir. Bu durumda, tüm veritabanını oluşturmak için `complete-database-setup.sql` dosyası tercih edilmelidir.*

### 3. Örnek Veri Ekleme

Veritabanını oluşturduktan sonra, test edebilmeniz için örnek verileri ekleyebilirsiniz:

```bash
# Örnek test verilerini ekler (kategoriler, ürünler, kullanıcılar, siparişler vb.)
sqlcmd -S [sunucu_adı] -d AndShopDB -i andshop-api/AndShop.ProductService/data-sample.sql
```

Bu örnek veri scripti şunları içerir:
- 5 farklı kategori
- 8 örnek ürün
- 4 test kullanıcısı (admin ve normal kullanıcılar)
- 4 örnek adres
- 3 indirim kuponu
- 3 sipariş ve sipariş detayları
- 5 ürün değerlendirmesi

*Not: Örnek verileri, veritabanı şeması kurulduktan sonra ekleyin.*

### 4. Migration Kontrol ve Yönetimi

Migration durumunu kontrol etmek için:

```bash
dotnet ef migrations list
```

Migration'ları geri almak için:

```bash
dotnet ef database update [previous_migration_name]
```

### Veritabanı Bağlantı Ayarları

`andshop-api/AndShop.ProductService/appsettings.json` dosyasında bağlantı dizesini yapılandırın:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=[sunucu_adı];Database=AndShopDB;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

## Proje Test Etme

Projenin düzgün çalıştığını test etmek için:

1. Backend API'yi çalıştırın:
```bash
cd andshop-api
dotnet run --project AndShop.ProductService
```

2. Frontend uygulamasını başlatın:
```bash
cd andshop-vue
npm run dev
```

3. Tarayıcınızda `http://localhost:3000` adresine gidin

4. Örnek kullanıcı hesapları ile giriş yapabilirsiniz:
   - Admin: admin@andshop.com / şifre: Admin123!
   - Test Kullanıcı: test@andshop.com / şifre: Test123!

5. API endpointlerini test etmek için Swagger belgelerini kullanın:
```
http://localhost:5000/swagger
```

## Veritabanı Şeması

Veritabanı aşağıdaki tablolardan oluşmaktadır:

- **Products**: Ürün bilgileri (id, name, description, price, discount, imageUrl, categoryId, vb.)
- **Categories**: Ürün kategorileri (id, name, description)
- **Users**: Kullanıcı bilgileri (id, username, email, password, role, vb.)
- **Addresses**: Kullanıcı adresleri (id, userId, title, addressLine, city, country, vb.)
- **Orders**: Sipariş bilgileri (id, userId, orderDate, totalAmount, status, addressId, vb.)
- **OrderItems**: Sipariş içindeki ürünler (id, orderId, productId, quantity, price)
- **Reviews**: Ürün değerlendirmeleri (id, productId, userId, rating, content, date)
- **Coupons**: İndirim kuponları (id, code, discountAmount, expiryDate, isActive)

## API Endpoints

### Products API
- `GET /api/products`: Tüm ürünleri listeler
- `GET /api/products/{id}`: Belirli bir ürünün detayını getirir
- `GET /api/products/categories`: Kategorilere göre ürünleri listeler
- `POST /api/products`: Yeni ürün ekler
- `PUT /api/products/{id}`: Ürün bilgilerini günceller
- `DELETE /api/products/{id}`: Ürün siler

### Users API
- `GET /api/users`: Tüm kullanıcıları listeler
- `GET /api/users/{id}`: Belirli bir kullanıcının detayını getirir
- `POST /api/users/register`: Yeni kullanıcı kaydeder
- `POST /api/users/login`: Kullanıcı girişi yapar
- `PUT /api/users/{id}`: Kullanıcı bilgilerini günceller

### Orders API
- `GET /api/orders`: Tüm siparişleri listeler
- `GET /api/orders/{id}`: Belirli bir siparişin detayını getirir
- `GET /api/users/{userId}/orders`: Kullanıcının siparişlerini listeler
- `POST /api/orders`: Yeni sipariş oluşturur
- `PUT /api/orders/{id}`: Sipariş durumunu günceller

### Reviews API
- `GET /api/reviews/product/{productId}`: Ürüne ait değerlendirmeleri listeler
- `POST /api/reviews`: Yeni değerlendirme ekler
- `PUT /api/reviews/{id}`: Değerlendirme günceller
- `DELETE /api/reviews/{id}`: Değerlendirme siler

### Coupons API
- `GET /api/coupons`: Tüm kuponları listeler
- `GET /api/coupons/{code}`: Kupon kodu ile kupon bilgisi getirir
- `POST /api/coupons`: Yeni kupon ekler
- `PUT /api/coupons/{id}`: Kupon bilgilerini günceller
- `DELETE /api/coupons/{id}`: Kupon siler

### Addresses API
- `GET /api/addresses/user/{userId}`: Kullanıcıya ait adresleri listeler
- `POST /api/addresses`: Yeni adres ekler
- `PUT /api/addresses/{id}`: Adres bilgilerini günceller
- `DELETE /api/addresses/{id}`: Adres siler

## Ön Koşullar ve Bağımlılıklar

### Backend API
- .NET SDK 6.0 veya üzeri
- Entity Framework Core
- Microsoft SQL Server

### Frontend
- Node.js 14.x veya üzeri
- npm veya yarn
- Vue.js 2 / Nuxt.js 2
- Bootstrap 4
- Vue-toastification
- Axios
- Swiper
- ApexCharts
- Vuelidate

## Geliştiriciler İçin Notlar

1. **Backend Geliştirme**:
   - Controllers, Models ve DTOs klasörlerini inceleyerek API yapısını anlayın
   - SQL migration dosyalarını (migrate.sql) kullanarak veritabanı şemasını oluşturun

2. **Frontend Geliştirme**:
   - Bileşenler components/ klasöründe yer almaktadır
   - Sayfa yapıları pages/ klasöründe bulunmaktadır
   - Vuex store yapılandırması store/ klasöründe tanımlanmıştır
   - API istekleri services/ ve api/ klasörlerinde yönetilmektedir

## Katkıda Bulunma

1. Repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır. 