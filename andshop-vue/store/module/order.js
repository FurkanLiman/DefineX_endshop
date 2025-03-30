import { OrderAPI } from '@/services/api';

// Status yardımcı fonksiyonları
const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'badge-warning',
    'Beklemede': 'badge-warning',
    'processing': 'badge-info',
    'İşleniyor': 'badge-info',
    'shipped': 'badge-primary',
    'Kargoya Verildi': 'badge-primary',
    'delivered': 'badge-success',
    'Teslim Edildi': 'badge-success',
    'cancelled': 'badge-danger',
    'İptal Edildi': 'badge-danger'
  };
  return statusClasses[status] || 'badge-secondary';
};

const getStatusText = (status) => {
  const statusTexts = {
    'pending': 'Beklemede',
    'Beklemede': 'Beklemede',
    'processing': 'İşleniyor',
    'İşleniyor': 'İşleniyor',
    'shipped': 'Kargoya Verildi',
    'Kargoya Verildi': 'Kargoya Verildi',
    'delivered': 'Teslim Edildi',
    'Teslim Edildi': 'Teslim Edildi',
    'cancelled': 'İptal Edildi',
    'İptal Edildi': 'İptal Edildi'
  };
  return statusTexts[status] || status;
};

// Ödeme Durumu metnini belirle
const getPaymentStatusText = (status) => {
  const paymentStatusTexts = {
    'pending': 'Beklemede',
    'Beklemede': 'Beklemede',
    'processing': 'İşleniyor',
    'İşleniyor': 'İşleniyor',
    'completed': 'Tamamlandı',
    'Tamamlandı': 'Tamamlandı',
    'failed': 'Başarısız',
    'Başarısız': 'Başarısız',
    'refunded': 'İade Edildi',
    'İade Edildi': 'İade Edildi'
  };
  return paymentStatusTexts[status] || status;
};

// OrderItems verilerini daha kullanılabilir bir formata dönüştür
const processOrderItems = (orderItems) => {
  if (!orderItems) return [];
  
  if (orderItems.$values && Array.isArray(orderItems.$values)) {
    return orderItems.$values.map(item => {
      return {
        ...item,
        product: item.product || {},
        title: item.product ? item.product.title : `Ürün #${item.productId}`
      };
    });
  }
  
  if (Array.isArray(orderItems)) {
    return orderItems.map(item => {
      return {
        ...item,
        product: item.product || {},
        title: item.product ? item.product.title : `Ürün #${item.productId}`
      };
    });
  }
  
  return [];
};

// Tarihe göre sıralama yapar (en yeni en üstte)
const sortOrdersByDate = (orders) => {
  if (!Array.isArray(orders)) return [];
  
  return [...orders].sort((a, b) => {
    const dateA = a.orderDate ? new Date(a.orderDate) : new Date(0);
    const dateB = b.orderDate ? new Date(b.orderDate) : new Date(0);
    return dateB - dateA; // Azalan sıralama
  });
};

// Order işlemi sırasında adres bilgilerini zenginleştiren metodu değiştiriyorum
const enrichOrder = (order) => {
  if (!order) return null;
  
  // Formatlı tarih ekle
  const orderDate = order.orderDate ? new Date(order.orderDate) : new Date();
  const formattedDate = orderDate.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Adres objesi var mı kontrol et
  const hasAddressObj = order.address !== null && order.address !== undefined;
  
  // Zenginleştirilmiş sipariş
  return {
    ...order,
    // Tarih formatını ekle
    date: formattedDate,
    // Durum sınıfını ekle
    status: order.status || 'pending',
    statusClass: getStatusClass(order.status || 'pending'),
    statusText: getStatusText(order.status || 'pending'),
    // Ödeme durumu
    paymentStatusText: getPaymentStatusText(order.paymentStatus || 'pending'),
    // Sipariş kalemlerini işle
    items: processOrderItems(order.orderItems),
    // Adres bilgileri kolaylık sağlayıcılar
    addressInfo: hasAddressObj ? {
      fullName: order.address?.fullName,
      address: order.address?.address,
      district: order.address?.district,
      city: order.address?.city,
      zipCode: order.address?.zipCode,
      country: order.address?.country,
      phone: order.address?.phone,
      email: order.address?.email
    } : null
  };
};

// Order service - Artık .NET EF API ile entegre edildi
const orderService = {
  // Sipariş oluşturma
  async createOrder(orderData) {
    try {
      // Gerçek API çağrısı
      const response = await OrderAPI.createOrder(orderData);
      return response.data;
    } catch (error) {
      console.error('Order API Error:', error);
      throw error;
    }
  },
  
  // Kullanıcının siparişlerini getirme
  async getUserOrders(userId) {
    try {
      // Gerçek API çağrısı
      const response = await OrderAPI.getUserOrders(userId);
      return response.data;
    } catch (error) {
      console.error('Order API Error:', error);
      throw error;
    }
  },
  
  // Sipariş detayını getirme
  async getOrderById(orderId) {
    try {
      // Gerçek API çağrısı
      const response = await OrderAPI.getOrderById(orderId);
      return response.data;
    } catch (error) {
      console.error('Order API Error:', error);
      throw error;
    }
  },
  
  // Sipariş durumunu güncelleme
  async updateOrderStatus(orderId, status) {
    try {
      // Önce siparişi almamız gerekiyor
      const orderResponse = await OrderAPI.getOrderById(orderId);
      const order = orderResponse.data;
      
      // Status'u güncelleme
      order.status = status;
      order.orderStatus = status;
      
      // API'ye gönderme
      const response = await OrderAPI.updateOrderStatus(orderId, order);
      return response.data;
    } catch (error) {
      console.error('Order API Error:', error);
      throw error;
    }
  },
  
  // Sipariş iptal etme (özel bir işlem)
  async cancelOrder(orderId) {
    try {
      // OrderAPI'deki iptal metodunu kullan
      const response = await OrderAPI.cancelOrder(orderId);
      return response.data;
    } catch (error) {
      console.error('Order API Error:', error);
      throw error;
    }
  }
};

// State
const state = () => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: null
});

// Getters
const getters = {
  allOrders: (state) => state.orders,
  currentOrder: (state) => state.currentOrder,
  isLoading: (state) => state.loading,
  error: (state) => state.error,
  hasSuccess: state => !!state.success,
  success: state => state.success,
  
  // Sipariş sayısı
  orderCount: (state) => state.orders.length,
  
  // Sipariş durumlarına göre filtrele
  ordersByStatus: (state) => (status) => {
    return state.orders.filter(order => order.status === status);
  },
  
  // En son sipariş
  latestOrder: (state) => {
    if (!state.orders || state.orders.length === 0) return null;
    
    try {
      const sortedOrders = [...state.orders].sort((a, b) => {
        const dateA = a.orderDate ? new Date(a.orderDate) : (a.date ? new Date(a.date) : new Date(0));
        const dateB = b.orderDate ? new Date(b.orderDate) : (b.date ? new Date(b.date) : new Date(0));
        return dateB - dateA;
      });
      
      return sortedOrders[0];
    } catch (error) {
      console.error('Error sorting orders:', error);
      return state.orders[0];
    }
  },
  
  // Toplam harcama
  totalSpent: (state) => {
    return state.orders.reduce((total, order) => total + (parseFloat(order.totalAmount) || 0), 0);
  }
};

// Actions
const actions = {
  // Sipariş oluştur
  async createOrder({ commit, dispatch, rootGetters }, orderData) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      // Önce orderData içinde userId kontrolü yap
      let userId = orderData.userId;
      
      // Eğer userId yoksa veya geçersizse, kullanıcı bilgisinden al
      if (!userId || userId === 0) {
        userId = rootGetters['user/currentUser']?.id;
        
        // Kullanıcı girişi yapılmamışsa hata ver
        if (!userId || userId === 0) {
          throw new Error('Sipariş oluşturmak için giriş yapmalısınız');
        }
      }
      
      // Sipariş verilerini güncelle ve düzenle
      const sanitizedData = {
        ...orderData,
        userId: userId  // userId'yi kesinlikle ekle
      };
      
      console.log('API: Creating order with sanitized data:', sanitizedData);
      
      // API formatına uygun şekilde verileri 'order' alanı içinde gönder
      const requestData = {
        order: sanitizedData
      };
      
      // API'ye isteği gerçekleştir
      const response = await OrderAPI.createOrder(requestData);
      
      if (response && response.data) {
        // Zenginleştirilmiş siparişi store'a ekle
        const enrichedOrder = enrichOrder(response.data);
        commit('ADD_ORDER', enrichedOrder);
        commit('SET_CURRENT_ORDER', enrichedOrder);
        
        // Başarılı sipariş sonrası sepeti temizle
        dispatch('cart/clearCart', {}, { root: true });
        
        commit('SET_LOADING', false);
        return enrichedOrder;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Order API Error:', error);
      commit('SET_ERROR', error.message || 'Failed to create order');
      commit('SET_LOADING', false);
      throw error;
    }
  },
  
  // Kullanıcı siparişlerini yükle
  async fetchUserOrders({ commit, rootGetters }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const userId = rootGetters['user/currentUser']?.id;
      if (!userId) {
        commit('SET_ORDERS', []);
        return [];
      }
      
      const response = await OrderAPI.getUserOrders(userId);
      let orders = [];
      
      // API yanıt formatını kontrol et ve işle
      if (response.data) {
        if (Array.isArray(response.data)) {
          orders = response.data;
        } else if (response.data.$values && Array.isArray(response.data.$values)) {
          // .NET tarafından dönen JSON.NET formatını düzelt
          orders = response.data.$values;
        } else {
          // Tek bir sipariş objesi dönmüş olabilir
          orders = [response.data];
        }
        
        // Siparişleri zenginleştir ve sırala
        orders = orders.map(order => enrichOrder(order));
        orders = sortOrdersByDate(orders);
      }
      
      commit('SET_ORDERS', orders);
      
      // Son siparişi ayarla (en yeni sipariş)
      if (orders.length > 0) {
        commit('SET_LATEST_ORDER', orders[0]);
      }
      
      commit('SET_LOADING', false);
      return orders;
    } catch (error) {
      console.error('Order API Error:', error);
      commit('SET_ERROR', error.message || 'Failed to fetch user orders');
      commit('SET_LOADING', false);
      throw error;
    }
  },
  
  // Sipariş detayını getir
  async getOrderById({ commit }, orderId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      const order = await orderService.getOrderById(orderId);
      commit('SET_CURRENT_ORDER', order);
      return order;
    } catch (error) {
      commit('SET_ERROR', error.message || 'Sipariş detayı yüklenirken bir hata oluştu');
      commit('SET_CURRENT_ORDER', null);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Sipariş durumunu güncelle
  async updateOrderStatus({ commit, dispatch }, { orderId, status }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    
    try {
      let updatedOrder;
      
      if (status === 'cancelled') {
        // İptal işlemi için özel metod
        updatedOrder = await orderService.cancelOrder(orderId);
      } else {
        // Diğer durumlar için normal güncelleme
        updatedOrder = await orderService.updateOrderStatus(orderId, status);
      }
      
      commit('UPDATE_ORDER', updatedOrder);
      
      // Görüntülenen sipariş güncellendiyse onu da güncelle
      if (state.currentOrder && state.currentOrder.id === orderId) {
        commit('SET_CURRENT_ORDER', updatedOrder);
      }
      
      return updatedOrder;
    } catch (error) {
      commit('SET_ERROR', error.message || 'Sipariş durumu güncellenirken bir hata oluştu');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  
  // Siparişleri API'den yükle (sayfa yenilendiğinde)
  async loadOrdersFromStorage({ dispatch, rootGetters }) {
    const userId = rootGetters['user/currentUser']?.id;
    if (!userId) return;
    
    try {
      await dispatch('fetchUserOrders');
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    }
  }
};

// Mutations
const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders;
  },
  
  ADD_ORDER(state, order) {
    state.orders.unshift(order);
  },
  
  UPDATE_ORDER(state, updatedOrder) {
    const index = state.orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
      state.orders.splice(index, 1, updatedOrder);
    }
  },
  
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order;
  },
  
  SET_LOADING(state, status) {
    state.loading = status;
  },
  
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  SET_LATEST_ORDER(state, order) {
    state.latestOrder = order;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 