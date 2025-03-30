import apiClient from './index';
import axios from 'axios';

// API URL config'ten import etmek yerine index.js içindeki baseURL'i kullanıyoruz
const baseURL = 'http://localhost:5000';

/**
 * Admin servisi - Sadece admin rolüne sahip kullanıcılar için işlemler
 */
export default {
  /**
   * Dashboard verilerini getir
   * @returns {Promise} API yanıtı
   */
  getDashboardStats() {
    try {
      // Gerçek API varsa bunu kullan
      return apiClient.get('/dashboard');
    } catch (error) {
      // API yoksa veya hata verirse boş veri döndür
      console.log("Dashboard API'ye erişilemiyor, örnek veri kullanılacak");
      return Promise.resolve({
        data: {
          stats: {},
          recentOrders: [],
          recentReviews: []
        }
      });
    }
  },

  /**
   * Tüm kullanıcıları getir
   * @param {Object} params - Filtre ve sayfalama parametreleri
   * @returns {Promise} API yanıtı
   */
  getUsers(params = {}) {
    return apiClient.get('/users', { params })
      .then(response => {
        // Kullanıcı adını formatla
        if (response.data && Array.isArray(response.data)) {
          response.data = response.data.map(user => {
            // firstName ve lastName mevcut ama name yoksa, oluştur
            if (user.firstName && !user.name) {
              user.name = `${user.firstName} ${user.lastName || ''}`.trim();
            }
            return user;
          });
        }
        return response;
      });
  },

  /**
   * Kullanıcı detayını getir
   * @param {Number} userId - Kullanıcı ID
   * @returns {Promise} API yanıtı
   */
  getUser(userId) {
    return apiClient.get(`/users/${userId}`);
  },

  /**
   * Kullanıcı güncelle
   * @param {Number} userId - Kullanıcı ID
   * @param {Object} userData - Güncellenecek kullanıcı bilgileri
   * @returns {Promise} API yanıtı
   */
  updateUser(userId, userData) {
    return apiClient.put(`/users/${userId}`, userData);
  },

  /**
   * Kullanıcı sil
   * @param {Number} userId - Kullanıcı ID
   * @returns {Promise} API yanıtı
   */
  deleteUser(userId) {
    return apiClient.delete(`/users/${userId}`);
  },

  /**
   * Tüm ürünleri getir
   * @param {Object} params - Filtre ve sayfalama parametreleri
   * @returns {Promise} API yanıtı
   */
  getProducts(params = {}) {
    return apiClient.get('/products', { params });
  },

  /**
   * Ürün ekle
   * @param {Object} productData - Ürün bilgileri
   * @returns {Promise} API yanıtı
   */
  addProduct(productData) {
    // API isteği öncesi veriyi hazırla
    const preparedData = { ...productData };
    
    // ID alanını kaldır - Backend otomatik atayacak
    if (preparedData.id === null || preparedData.id === undefined) {
      delete preparedData.id;
    }
    
    // Sayısal alanların tiplerini kontrol et
    if (typeof preparedData.price === 'string') {
      preparedData.price = parseFloat(preparedData.price) || 0;
    }
    
    if (typeof preparedData.discountPrice === 'string') {
      preparedData.discountPrice = parseFloat(preparedData.discountPrice) || 0;
    }
    
    if (typeof preparedData.stock === 'string') {
      preparedData.stock = parseInt(preparedData.stock) || 0;
    }
    
    console.log('API isteği gönderiliyor:', preparedData);
    return apiClient.post('/products', preparedData);
  },

  /**
   * Ürün güncelle
   * @param {Number} productId - Ürün ID
   * @param {Object} productData - Güncellenecek ürün bilgileri
   * @returns {Promise} API yanıtı
   */
  updateProduct(productId, productData) {
    return apiClient.put(`/products/${productId}`, productData);
  },

  /**
   * Ürün sil
   * @param {Number} productId - Ürün ID
   * @returns {Promise} API yanıtı
   */
  deleteProduct(productId) {
    return apiClient.delete(`/products/${productId}`);
  },

  /**
   * Tüm siparişleri getir
   * @param {Object} params - Filtre ve sayfalama parametreleri
   * @returns {Promise} API yanıtı
   */
  getOrders(params = {}) {
    return axios.get(`${baseURL}/api/orders`, { params })
      .then(response => {
        // Kullanıcı adını formatla ve orderStatus/status alanlarını senkronize et
        if (response.data && Array.isArray(response.data)) {
          response.data = response.data.map(order => {
            // Kullanıcı adı oluşturma
            if (order.user && order.user.firstName && !order.user.name) {
              order.user.name = `${order.user.firstName} ${order.user.lastName || ''}`.trim();
            }
            
            // OrderStatus ve Status alanlarını senkronize et
            if (order.orderStatus && !order.status) {
              order.status = order.orderStatus;
              console.log('Order status set from orderStatus:', order.orderStatus);
            } else if (order.status && !order.orderStatus) {
              order.orderStatus = order.status;
              console.log('OrderStatus set from status:', order.status);
            } else if (!order.status && !order.orderStatus) {
              // Eğer her iki alan da yoksa varsayılan değer ata
              order.status = 'pending';
              order.orderStatus = 'pending';
              console.log('Both status fields were missing, set to default: pending');
            }
            
            return order;
          });
        }
        return response;
      });
  },

  /**
   * Sipariş detayını getir
   * @param {Number} orderId - Sipariş ID
   * @returns {Promise} API yanıtı
   */
  getOrder(orderId) {
    return axios.get(`${baseURL}/api/orders/${orderId}`)
      .then(response => {
        // OrderStatus ve Status alanlarını senkronize et
        if (response.data) {
          const order = response.data;
          
          // Kullanıcı adı oluşturma
          if (order.user && order.user.firstName && !order.user.name) {
            order.user.name = `${order.user.firstName} ${order.user.lastName || ''}`.trim();
          }
          
          // OrderStatus ve Status alanlarını senkronize et
          if (order.orderStatus && !order.status) {
            order.status = order.orderStatus;
            console.log('Order detail - status set from orderStatus:', order.orderStatus);
          } else if (order.status && !order.orderStatus) {
            order.orderStatus = order.status;
            console.log('Order detail - orderStatus set from status:', order.status);
          } else if (!order.status && !order.orderStatus) {
            // Eğer her iki alan da yoksa varsayılan değer ata
            order.status = 'pending';
            order.orderStatus = 'pending';
            console.log('Order detail - both status fields were missing, set to default: pending');
          }
        }
        
        return response;
      });
  },

  /**
   * Sipariş öğelerini getir
   * @param {Number} orderId - Sipariş ID
   * @returns {Promise} API yanıtı
   */
  getOrderItems(orderId) {
    // İki farklı endpoint denemeye hazırız
    return axios.get(`${baseURL}/api/orders/${orderId}/items`)
      .catch(error => {
        console.log('İlk sipariş öğeleri endpoint hatası, alternatif deneniyor:', error);
        // Alternatif endpoint deniyoruz
        return axios.get(`${baseURL}/api/orderitems?orderId=${orderId}`);
      });
  },

  /**
   * Sipariş durumunu güncelle
   * @param {Number} orderId - Sipariş ID
   * @param {Object} statusData - Yeni durum bilgisi
   * @returns {Promise} API yanıtı
   */
  updateOrderStatus(orderId, statusData) {
    try {
      // API'nin beklediği tam formatta veri hazırla - Swagger şemasına uygun olmalı
      const updateData = {
        id: orderId,
        orderStatus: statusData.status || statusData.orderStatus,
        status: statusData.status || statusData.orderStatus,
        // API zorunlu alanları boş string ("") olarak gerekiyor, null kabul etmiyor
        addressId: null,
        paymentStatus: statusData.paymentStatus || "",  // Zorunlu alan
        trackingNumber: statusData.trackingNumber || "", // Zorunlu alan
        carrierName: statusData.carrierName || "",      // Zorunlu alan
        invoiceNumber: statusData.invoiceNumber || "",  // Zorunlu alan
        notes: statusData.notes || "",                // Zorunlu alan
        cancellationReason: statusData.cancellationReason || "", // Zorunlu alan
        // Tarih alanları da eklemeliyiz (bunlar null olabilir)
        paymentDate: null,
        shippingDate: null,
        deliveryDate: null,
        cancelDate: null
      };
      
      console.log('Sipariş durumu güncelleme isteği:', updateData);
      
      // PUT endpoint'i kullan
      return axios.put(`${baseURL}/api/orders/${orderId}`, updateData);
    } catch (error) {
      console.error('Status güncelleme endpoint hatası:', error);
      return Promise.reject(error);
    }
  },

  /**
   * Tüm yorumları getir
   * @param {Object} params - Filtre ve sayfalama parametreleri
   * @returns {Promise} API yanıtı
   */
  getReviews(params = {}) {
    return apiClient.get('/reviews', { params });
  },

  /**
   * Yorum detayını getir
   * @param {Number} reviewId - Yorum ID
   * @returns {Promise} API yanıtı
   */
  getReview(reviewId) {
    return apiClient.get(`/reviews/${reviewId}`);
  },

  /**
   * Yorum durumunu güncelle (onay, red)
   * @param {Number} reviewId - Yorum ID
   * @param {Object} statusData - Yeni durum bilgisi
   * @returns {Promise} API yanıtı
   */
  updateReviewStatus(reviewId, statusData) {
    return apiClient.patch(`/reviews/${reviewId}/status`, statusData);
  },

  /**
   * Yorum sil
   * @param {Number} reviewId - Yorum ID
   * @param {Number} userId - Kullanıcı ID
   * @returns {Promise} API yanıtı
   */
  deleteReview(reviewId, userId) {
    // API query parameter olarak userId bekliyor
    return apiClient.delete(`/reviews/${reviewId}?userId=${userId}`);
  },

  /**
   * Tüm kategorileri getir
   * @returns {Promise} API yanıtı
   */
  getCategories() {
    return apiClient.get('/categories');
  },

  /**
   * Kategori ekle
   * @param {Object} categoryData - Kategori bilgileri
   * @returns {Promise} API yanıtı
   */
  addCategory(categoryData) {
    // API isteği öncesi veriyi hazırla
    const preparedData = { ...categoryData };
    
    // ID alanını kaldır - Backend otomatik atayacak
    if (preparedData.id === null || preparedData.id === undefined) {
      delete preparedData.id;
    }
    
    console.log('API\'ye gönderilen kategori verisi:', preparedData);
    return apiClient.post('/categories', preparedData);
  },

  /**
   * Kategori güncelle
   * @param {Number} categoryId - Kategori ID
   * @param {Object} categoryData - Güncellenecek kategori bilgileri
   * @returns {Promise} API yanıtı
   */
  updateCategory(categoryId, categoryData) {
    return apiClient.put(`/categories/${categoryId}`, categoryData);
  },

  /**
   * Kategori sil
   * @param {Number} categoryId - Kategori ID
   * @returns {Promise} API yanıtı
   */
  deleteCategory(categoryId) {
    return apiClient.delete(`/categories/${categoryId}`);
  }
}; 