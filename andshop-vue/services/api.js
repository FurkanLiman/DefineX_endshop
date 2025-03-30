import axios from 'axios';
import { StorageUtils } from '~/utils/storage';

// API temel URL'ini burada ayarlayın (.NET Core API adresi)
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.andshop.com/api' 
  : 'http://localhost:5000/api'; // .NET API default port

// Axios instance'ı oluştur
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// İstek attarap (interceptors)
api.interceptors.request.use(
  (config) => {
    // LocalStorage'dan token'ı al
    const token = StorageUtils.getToken();
    // Token varsa header'a ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Cevap attarap (interceptors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized hata durumunda yönlendirme yapmadan token temizle
    if (error.response && error.response.status === 401) {
      console.warn('Yetkilendirme hatası: Token geçersiz veya eksik');
      // Sadece oturum verilerini temizle
      StorageUtils.clearUserData();
      
      // Store'a hata mesajı ekle (varsa)
      if (window.$nuxt && window.$nuxt.$store) {
        window.$nuxt.$store.commit('user/SET_ERROR', 'Oturum sorunu yaşanıyor ancak işlemlerinize devam edebilirsiniz.');
      }
    }
    return Promise.reject(error);
  }
);

// API Servisleri
export const OrderAPI = {
  // Tüm siparişleri getir (admin için)
  getAllOrders() {
    return api.get('/orders');
  },
  
  // Kullanıcı siparişlerini getir
  getUserOrders(userId) {
    console.log(`API: Getting orders for user ${userId}`);
    return api.get(`/orders/user/${userId}`);
  },
  
  // Sipariş detayını getir
  getOrderById(orderId) {
    console.log(`API: Getting order details for ID ${orderId}`);
    return api.get(`/orders/${orderId}`);
  },
  
  // Sipariş oluştur
  async createOrder(orderData) {
    try {
      // İç içe format kontrolü ve düzeltmesi
      if (orderData.order) {
        console.log('İç içe sipariş formatı tespit edildi, düzeltiliyor:', orderData);
        // order içindeki değerleri üst seviyeye çıkar
        orderData = {
          ...orderData.order,
          // Eğer üst düzeyde de userId varsa ve order içindeki boşsa, üst düzeydekini kullan
          userId: orderData.order.userId || orderData.userId
        };
      }

      // Kritik hata ayıklama - userId ve addressId
      console.log('API createOrder çağrısı öncesi:', {
        orderData: orderData,
        userId: orderData.userId,
        addressId: orderData.addressId,
        localStorage: process.browser ? {
          token: localStorage.getItem('token'),
          user: localStorage.getItem('user')
        } : null
      });

      // Doğrudan localStorage'dan kullanıcı verisi almayı deneyelim 
      if (process.browser && (!orderData.userId || orderData.userId === 0)) {
        try {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const userData = JSON.parse(userStr);
            if (userData && userData.id) {
              console.log('localStorage\'dan kullanıcı id alındı:', userData.id);
              orderData.userId = parseInt(userData.id, 10);
            }
          }
        } catch (e) {
          console.error('localStorage kullanıcı verisi ayrıştırma hatası:', e);
        }
      }

      // Yine de userId yoksa hata fırlat
      if (!orderData.userId || orderData.userId === 0) {
        console.error('API Error: Missing or invalid userId', orderData);
        throw new Error('Kullanıcı kimliği geçersiz (ID: 0 veya boş)');
      }

      // AddressId kontrolü
      if (!orderData.addressId || orderData.addressId === 0) {
        console.error('API Error: Missing or invalid addressId', orderData);
        throw new Error('Adres bilgisi eksik veya geçersiz');
      }

      // OrderItems dönüştürme
      if (Array.isArray(orderData.orderItems)) {
        // Direkt olarak OrderItems array'i gönderilmiş
        orderData.orderItems = orderData.orderItems;
      } else if (orderData.items && Array.isArray(orderData.items)) {
        // Doğrudan items olarak gelen yapı
        orderData.orderItems = orderData.items.map(item => ({
          productId: item.productId || item.id,
          quantity: item.quantity || 1,
          size: item.size || null,
          color: item.color || null
        }));
      } else if (orderData.cart && Array.isArray(orderData.cart)) {
        // Cart içindeki ürünleri al
        orderData.orderItems = orderData.cart.map(item => ({
          productId: item.id || item.productId,
          quantity: item.quantity || 1,
          size: item.selectedSize || item.size || null,
          color: item.selectedColor || item.color || null
        }));
      }

      // En az bir ürün olmalı
      if (!orderData.orderItems.length) {
        console.error('API Error: No order items', orderData);
        throw new Error('Sipariş sepeti boş veya geçersiz');
      }
      
      console.log('Sending order request:', orderData);
      
      const response = await api.post('/orders', orderData);
      console.log('API response:', response.data);
      return response;
    } catch (error) {
      console.error('Order API Error:', error);
      throw error;
    }
  },
  
  // Sipariş durumunu güncelle
  updateOrderStatus(orderId, status) {
    console.log(`API: Updating order ${orderId} status to ${status}`);
    return api.put(`/orders/${orderId}`, { 
      id: orderId,
      orderStatus: status 
    });
  },
  
  // Siparişi iptal et
  cancelOrder(orderId) {
    return api.put(`/orders/${orderId}`, {
      id: orderId,
      orderStatus: 'İptal Edildi'
    });
  }
};

export const UserAPI = {
  // Kullanıcı girişi
  login(credentials) {
    return api.post('/users/login', credentials);
  },
  
  // Kullanıcı kaydı
  register(userData) {
    return api.post('/users', userData);
  },
  
  // Kullanıcı bilgilerini getir
  getProfile(userId) {
    return api.get(`/users/${userId}`);
  },
  
  // Kullanıcı bilgilerini güncelle
  updateProfile(userId, userData) {
    return api.put(`/users/${userId}`, userData);
  },
  
  // Adres ekle
  addAddress(addressData) {
    return api.post('/users/addresses', addressData);
  },
  
  // Adresleri getir
  getAddresses() {
    return api.get('/users/addresses');
  },
  
  // Adres güncelle
  updateAddress(addressId, addressData) {
    return api.put(`/users/addresses/${addressId}`, addressData);
  },
  
  // Adres sil
  deleteAddress(addressId) {
    return api.delete(`/users/addresses/${addressId}`);
  },

  /**
   * Şifre değiştir
   * @param {Number} userId - Kullanıcı ID
   * @param {Object} passwordData - Şifre değiştirme verileri
   * @returns {Promise} API yanıtı
   */
  changePassword(userId, passwordData) {
    return api.post(`/users/${userId}/change-password`, passwordData);
  }
};

export const ProductAPI = {
  // Tüm ürünleri getir
  getProducts(params) {
    return api.get('/products', { params });
  },
  
  // Ürün detayı getir
  getProductById(productId) {
    return api.get(`/products/${productId}`);
  },
  
  // Kategorileri getir
  getCategories() {
    return api.get('/categories');
  }
};

export default api; 