import apiClient from './index';

/**
 * Ürün servisi - Tüm ürün ilişkili API çağrılarını içerir
 * .NET Core Microservice yapısına uygun endpoint'ler için düzenlenmiştir
 */
export default {
  /**
   * Tüm ürünleri getir
   * @param {Object} params - Filtreleme, sıralama vb. parametreler
   * @returns {Promise} API yanıtı
   */
  getProducts(params = {}) {
    return apiClient.get('/products', { params })
      .then(response => {
        // API yanıtını işleme - Response yapısını kontrol edip gerekli dönüşümleri yap
        return transformApiResponse(response);
      });
  },

  /**
   * Belirli bir ürünün detaylarını getir
   * @param {Number} id - Ürün ID'si
   * @returns {Promise} API yanıtı
   */
  getProduct(id) {
    return apiClient.get(`/products/${id}`)
      .then(response => {
        // API yanıtını işleme
        return transformApiResponse(response);
      });
  },

  /**
   * Tüm kategorileri getir
   * @returns {Promise} API yanıtı
   */
  getCategories() {
    // Doğru endpoint'e istek at - .NET Core API'ye uygun format
    return apiClient.get('/categories')
      .then(response => {
        // API yanıtını işleme
        return transformApiResponse(response);
      });
  },

  /**
   * Belirli bir kategorideki ürünleri getir
   * @param {String} category - Kategori adı
   * @returns {Promise} API yanıtı 
   */
  getProductsByCategory(category) {
    return apiClient.get(`/products/category/${encodeURIComponent(category)}`)
      .then(response => {
        // API yanıtını işleme
        return transformApiResponse(response);
      });
  },

  /**
   * Ürün arama işlemi
   * @param {String} query - Arama terimi
   * @returns {Promise} API yanıtı 
   */
  searchProducts(query) {
    // API'de arama endpoint'i
    return apiClient.get(`/products/search?q=${encodeURIComponent(query)}`)
      .then(response => {
        // API yanıtını işleme
        return transformApiResponse(response);
      });
  }
};

/**
 * API yanıtını uygulama formatına dönüştürür
 * @param {Object} response - API yanıtı
 * @returns {Object} Dönüştürülmüş yanıt
 */
function transformApiResponse(response) {
  // Yanıtı console'a basmak için (debugging için)
  console.log('API Response:', response);
  
  // Response null ise boş dizi döndür
  if (!response || !response.data) {
    console.warn('API yanıtı null veya undefined');
    return { ...response, data: [] };
  }
  
  // .NET Core özel formatı kontrolü ($values)
  if (response.data && response.data.$values) {
    console.log('.NET Core $values formatı algılandı, dönüştürülüyor:', response.data.$values);
    
    // Eğer kategori listesi ise ve obje içeriyorsa
    if (response.data.$values.length > 0 && typeof response.data.$values[0] === 'object') {
      // Kategori detaylarını koruyarak döndür
      return { ...response, data: response.data.$values };
    }
    
    return { ...response, data: response.data.$values };
  }
  
  // Eğer response.data zaten bir array ise
  if (Array.isArray(response.data)) {
    return response;
  }
  
  // Eğer response.data bir object ise ve içinde items, result, data gibi array özellikler varsa
  if (typeof response.data === 'object') {
    if (response.data.items && Array.isArray(response.data.items)) {
      return { ...response, data: response.data.items };
    }
    
    if (response.data.result && Array.isArray(response.data.result)) {
      return { ...response, data: response.data.result };
    }
    
    if (response.data.data && Array.isArray(response.data.data)) {
      return { ...response, data: response.data.data };
    }
    
    // Eğer response.data object'in içinde array olmayan bir değer varsa ve bu bir product ise
    // (tekli ürün detayı için)
    if (response.data.id) {
      return response;
    }
    
    // ValueKind özelliği olan JSON yanıtlarını kontrol et (.NET'ten gelen özel durum)
    if (response.data.value && Array.isArray(response.data.value)) {
      return { ...response, data: response.data.value };
    }
    
    // Eğer response.data bir array içermeyen object ise, kendisini bir array içine koy
    console.warn('API yanıtı beklenen formatta değil, dönüştürülüyor:', response.data);
    return { ...response, data: [response.data] };
  }
  
  // Son çare - hiçbir durum eşleşmezse boş bir dizi döndür
  console.error('API yanıtı tanınamadı:', response);
  return { ...response, data: [] };
} 