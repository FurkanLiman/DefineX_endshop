import { OrderAPI } from '@/services/api';
import axios from 'axios';

// API URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.andshop.com/api' 
  : 'http://localhost:5000/api';

const state = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: null
};

const getters = {
  allOrders: state => state.orders,
  currentOrder: state => state.currentOrder,
  isLoading: state => state.loading,
  hasError: state => !!state.error,
  error: state => state.error,
  hasSuccess: state => !!state.success,
  success: state => state.success,
  latestOrder: state => {
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
  totalSpent: state => {
    return state.orders.reduce((total, order) => total + (parseFloat(order.totalAmount) || 0), 0);
  }
};

const mutations = {
  SET_ORDERS(state, orders) {
    state.orders = orders;
  },
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order;
  },
  SET_ORDER_LOADING(state, status) {
    state.loading = status;
  },
  SET_ORDER_ERROR(state, error) {
    state.error = error;
  },
  SET_ORDER_SUCCESS(state, message) {
    state.success = message;
  },
  CLEAR_ORDER_MESSAGES(state) {
    state.error = null;
    state.success = null;
  }
};

const actions = {
  async createOrder({ commit, rootState }, orderData) {
    try {
      commit('SET_ORDER_LOADING', true);
      console.log('Store: Creating order with data:', JSON.stringify(orderData, null, 2));
      
      // İç içe format kontrolü
      if (orderData.order && typeof orderData.order === 'object') {
        console.log('İç içe sipariş formatı tespit edildi, düzeltiliyor:', orderData);
        // order içindeki değerleri üst seviyeye çıkar
        const nestedOrder = orderData.order;
        orderData = {
          ...nestedOrder,
          // Eğer üst düzeyde de userId varsa ve order içindeki boşsa, üst düzeydekini kullan
          userId: nestedOrder.userId || orderData.userId
        };
        console.log('Düzeltilmiş sipariş verisi:', orderData);
      }
      
      // UserId ve AddressId kontrolleri
      if (!orderData.userId) {
        console.error('Kullanıcı ID eksik:', orderData);
        
        // LocalStorage'dan kullanıcı verisi almayı dene
        let userIdFromLocalStorage = null;
        if (process.browser) {
          try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
              const userData = JSON.parse(userStr);
              if (userData && userData.id) {
                userIdFromLocalStorage = parseInt(userData.id, 10);
                console.log('LocalStorage\'dan kullanıcı ID alındı:', userIdFromLocalStorage);
              }
            }
          } catch (e) {
            console.error('LocalStorage kullanıcı verisi okuma hatası:', e);
          }
        }
        
        // Eğer localStorage'dan alınamadıysa state'ten al
        if (!userIdFromLocalStorage) {
          // Vuex user modülünden alım dene
          const userState = rootState.user;
          const userIdFromState = userState.user?.id || userState.currentUser?.id;
          
          console.log('Root state içindeki mevcut kullanıcı:', {
            user: userState.user,
            currentUser: userState.currentUser
          });
          
          if (userIdFromState) {
            userIdFromLocalStorage = parseInt(userIdFromState, 10);
            console.log('State\'ten kullanıcı ID alındı:', userIdFromLocalStorage);
          }
        }
        
        if (!userIdFromLocalStorage) {
          throw new Error('Kullanıcı kimliği bulunamadı');
        }
        
        orderData.userId = userIdFromLocalStorage;
      }
      
      if (!orderData.addressId) {
        console.error('Adres ID eksik:', orderData);
        throw new Error('Adres bilgisi eksik veya geçersiz');
      }
      
      try {
        // API'ye gönderilecek veriyi detaylı logla
        console.log('API request veri doğrulaması:', {
          userId: {
            value: orderData.userId,
            type: typeof orderData.userId
          },
          addressId: {
            value: orderData.addressId,
            type: typeof orderData.addressId
          },
          orderItems: orderData.orderItems.length
        });
        
        // orderData veri tiplerini düzelt
        const preparedOrderData = {
          ...orderData,
          userId: parseInt(orderData.userId, 10),
          addressId: parseInt(orderData.addressId, 10),
          orderItems: orderData.orderItems.map(item => ({
            ...item,
            productId: parseInt(item.productId, 10),
            quantity: parseInt(item.quantity, 10)
          }))
        };
        
        console.log('API\'ye gönderilecek veri:', preparedOrderData);
        
        const response = await axios.post(`${API_URL}/orders`, preparedOrderData);
        console.log('API response:', JSON.stringify(response.data, null, 2));
        commit('SET_CURRENT_ORDER', response.data);
        commit('SET_ORDER_SUCCESS', 'Order placed successfully');
        commit('SET_ORDER_LOADING', false);
        return response.data;
      } catch (apiError) {
        console.error('API Error:', apiError);
        
        if (apiError.response) {
          console.error('Error response data:', apiError.response.data);
          throw new Error(
            apiError.response.data.title || 
            apiError.response.data.message || 
            `API Error: ${apiError.response.status} ${apiError.response.statusText}`
          );
        }
        
        throw apiError;
      }
    } catch (error) {
      console.error('Order creation error:', error);
      commit('SET_ORDER_ERROR', error.message || 'Failed to create order');
      commit('SET_ORDER_LOADING', false);
      throw error;
    }
  },
  
  async fetchUserOrders({ commit, rootState }) {
    try {
      commit('SET_ORDER_LOADING', true);
      console.log('Fetching user orders...');
      
      // Vuex user modülünden alım dene
      const userState = rootState.user;
      const userId = userState.user?.id || userState.currentUser?.id;
      
      console.log('Root state içindeki mevcut kullanıcı:', {
        user: userState.user,
        currentUser: userState.currentUser,
        userId: userId
      });
      
      if (!userId) {
        throw new Error('User is not authenticated');
      }
      
      console.log(`Fetching orders for user ID ${userId}`);
      const response = await axios.get(`${API_URL}/orders/user/${userId}`);
      console.log('API getUserOrders response received');
      
      let orders = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          orders = response.data;
        } else if (response.data.$values && Array.isArray(response.data.$values)) {
          orders = response.data.$values;
        } else {
          orders = [response.data];
        }
        
        orders = orders.map(order => {
          if (order.orderItems && order.orderItems.$values) {
            order.orderItems = order.orderItems.$values;
          }
          
          return {
            ...order,
            date: order.orderDate ? new Date(order.orderDate).toLocaleDateString('tr-TR') : '',
            status: getStatusClass(order.orderStatus || 'pending'),
            statusText: getStatusText(order.orderStatus || 'pending')
          };
        });
        
        console.log(`Processed ${orders.length} orders`);
      }
      
      commit('SET_ORDERS', orders);
      commit('SET_ORDER_LOADING', false);
      return orders;
    } catch (error) {
      console.error('Order API Error:', error);
      commit('SET_ORDER_ERROR', error.message || 'Failed to fetch user orders');
      commit('SET_ORDER_LOADING', false);
      throw error;
    }
  },
  
  async getOrderById({ commit }, orderId) {
    try {
      commit('SET_ORDER_LOADING', true);
      console.log('Fetching order details for ID:', orderId);
      
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      console.log('Order API response:', JSON.stringify(response.data, null, 2));
      
      const orderData = response.data;
      
      if (orderData.orderItems) {
        if (orderData.orderItems.$values) {
          orderData.orderItems = orderData.orderItems.$values;
        }
      }
      
      commit('SET_CURRENT_ORDER', orderData);
      commit('SET_ORDER_LOADING', false);
      return orderData;
    } catch (error) {
      console.error('Error fetching order:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      commit('SET_ORDER_ERROR', error.message || 'Failed to fetch order');
      commit('SET_ORDER_LOADING', false);
      throw error;
    }
  },
  
  clearMessages({ commit }) {
    commit('CLEAR_ORDER_MESSAGES');
  }
};

function getStatusClass(status) {
  const statusMap = {
    'completed': 'completed',
    'Tamamlandı': 'completed',
    'processing': 'processing',
    'Hazırlanıyor': 'processing',
    'shipping': 'processing',
    'pending': 'pending',
    'Beklemede': 'pending',
    'cancelled': 'canceled',
    'İptal Edildi': 'canceled'
  };
  return statusMap[status] || 'pending';
}

function getStatusText(status) {
  const statusMap = {
    'completed': 'Tamamlandı',
    'Tamamlandı': 'Tamamlandı',
    'processing': 'Hazırlanıyor',
    'Hazırlanıyor': 'Hazırlanıyor',
    'shipping': 'Kargoda',
    'pending': 'Beklemede',
    'Beklemede': 'Beklemede',
    'cancelled': 'İptal Edildi',
    'İptal Edildi': 'İptal Edildi'
  };
  return statusMap[status] || 'Beklemede';
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 