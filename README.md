# AndShop E-Ticaret Uygulaması

## Proje Hakkında

AndShop, Vue.js/Nuxt.js frontend ve .NET Core Web API backend kullanılarak geliştirilmiş modern bir e-ticaret platformudur. Bu proje, kullanıcıların ürünleri görüntüleyebilmesi, sepete ekleyebilmesi, sipariş verebilmesi ve sipariş geçmişini takip edebilmesi gibi e-ticaret işlemlerini desteklemektedir.

## Proje Yapısı

Proje iki ana bileşenden oluşmaktadır:

![Editor _ Mermaid Chart-2025-04-02-093346](https://github.com/user-attachments/assets/d3f708a5-77fc-4b17-9e54-2aea456abbd8)

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
- Microsoft SQL Server (2019 veya üzeri)

### Backend API Kurulumu

1. Repoyu klonlayın ve andshop-api klasörüne gidin
```bash
git clone <repo-url>
cd andshop-api
```

2. Veritabanını SQL Script ile kurun:
   - SQL Server Management Studio (SSMS) veya başka bir SQL istemcisini açın
   - Proje kök dizinindeki `DatabaseCreateScript.sql` dosyasını açın
   - Scripti çalıştırın (F5 tuşu veya Execute butonu ile)
   - Script, `AndShopDB` veritabanını oluşturacak ve örnek verilerle dolduracaktır

3. Veritabanı bağlantı dizesini `andshop-api/AndShop.ProductService/appsettings.json` dosyasında yapılandırın:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=AndShopDB;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

4. API'yi başlatın:
```bash
cd AndShop.ProductService
dotnet run
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

## Veritabanı Kurulumu

Veritabanını kurulum işlemi `DatabaseCreateScript.sql` dosyası kullanılarak gerçekleştirilir:

### SQL Script Dosyası ile Kurulum

Proje için hazırlanmış kapsamlı bir SQL script dosyası bulunmaktadır:

1. SQL Server Management Studio'yu (SSMS) açın
2. SSMS'e SQL Server bilgileriniz ile giriş yapın
3. `File > Open > File` menüsünden veya `Ctrl+O` kısayol tuşu ile `DatabaseCreateScript.sql` dosyasını açın
4. Script açıldığında, `Execute` butonuna tıklayın veya `F5` tuşuna basın
5. Script çalıştığında, `AndShopDB` veritabanı oluşturulacak ve gerekli tablolar ile örnek veriler eklenecektir

### Olası Hatalar ve Çözümleri:

- **"Database already exists" hatası**: Eğer `AndShopDB` veritabanı zaten varsa, scripti çalıştırmadan önce bu veritabanını silmeniz gerekebilir:
  ```sql
  USE [master]
  GO
  DROP DATABASE IF EXISTS [AndShopDB]
  GO
  ```

- **SQL Dosyasının Çalışmaması**: Eğer script dosyası çalışmazsa, SSMS'de SQL dosyasındaki komutları adım adım uygulayabilirsiniz.

### Veritabanı Bağlantı Ayarları

`andshop-api/AndShop.ProductService/appsettings.json` dosyasında bağlantı dizesini yapılandırın:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=AndShopDB;Trusted_Connection=True;MultipleActiveResultSets=true"
}
```

Eğer SQL Server Authentication kullanıyorsanız:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=AndShopDB;User ID=your_username;Password=your_password;MultipleActiveResultSets=true"
}
```

## Proje Test Etme

Projenin düzgün çalıştığını test etmek için:

1. Backend API'yi çalıştırın:
```bash
cd andshop-api/AndShop.ProductService
dotnet run
```

2. Frontend uygulamasını başlatın:
```bash
cd andshop-vue
npm run dev
```

3. Tarayıcınızda `http://localhost:3000` adresine gidin

4. Örnek kullanıcı hesapları ile giriş yapabilirsiniz:
   - Admin: admin@mail.com / şifre: 123456!
   - Test Kullanıcı: test@mail.com / şifre: 123456!

5. API endpointlerini test etmek için Swagger belgelerini kullanın:
```
http://localhost:5000/swagger
```

## Veritabanı Şeması

![Editor _ Mermaid Chart-2025-04-02-094453](https://github.com/user-attachments/assets/aed0768f-be19-413c-80c2-b8744189a1be)

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
