# AndShop Vue.js E-Ticaret Projesi

## Proje Hakkında
AndShop Vue.js E-Ticaret projesi, Vue.js/Nuxt.js ile hazırlanmış bir e-ticaret web sitesidir. Proje, .NET Core Microservice arka planı ile entegre çalışacak şekilde geliştirilmektedir.

## API Entegrasyonu Test Adımları

### 1. API URL'ini Güncelleme

`api/index.js` dosyasındaki API URL'i kendi .NET Core Microservice API adresinizle güncelleyin:

```javascript
// .NET Core Microservice API URL'iniz
const baseURL = 'http://localhost:5000/api'; // Bu URL'i kendi API adresinizle değiştirin
```

### 2. API Yanıt Yapısını Uyarlama

`api/products.js` içindeki `transformApiResponse` fonksiyonunu API yanıt yapınıza göre uyarlayın:

```javascript
function transformApiResponse(response) {
  // API yanıtınızın yapısına göre özelleştirin
  if (response.data && response.data.items) {
    return {
      ...response,
      data: response.data.items
    };
  }
  
  return response;
}
```

### 3. Ürün Veri Dönüşümünü Güncelleme

`store/module/products.js` içindeki `SET_PRODUCTS` mutation'ında, .NET Core API'nizden gelen ürün yapısına göre gerekli alanları eşleştirin:

```javascript
// Örnek:
const title = product.title || product.name || 'Ürün İsmi';
const image = product.image || product.imageUrl || 'https://via.placeholder.com/300x300';
```

### 4. API'yi Test Etme

1. API servisini çalıştırın (.NET Core Microservice)
2. Vue.js uygulamasını başlatın:
```
npm run dev
```
3. `/shop` sayfasına giderek ürünlerin API'den yüklendiğini kontrol edin

## İleri Geliştirmeler

Gerçek API entegrasyonu sonrası:

1. Kullanıcı kimlik doğrulama sistemini gerçek API ile entegre etme
2. Sepet işlemlerini API ile senkronize etme
3. Sipariş yönetimini implementasyonu
4. Kullanıcı profil sayfasını gerçek verilerle doldurma 