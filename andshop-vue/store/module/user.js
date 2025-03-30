import AuthService from '~/api/auth';
import { StorageUtils } from '~/utils/storage';

// Başlangıç durumu
const state = () => {
  // LocalStorage'dan token ve kullanıcı bilgilerini çek
  if (process.browser) {
    const token = StorageUtils.getToken();
    const user = StorageUtils.getUser();
    
    if (token && user) {
      return {
        token,
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
        addresses: []
      };
    }
  }
  
  // Varsayılan boş durum
  return {
    token: null,
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    addresses: []
  };
};

// Getters
const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  currentUser: (state) => state.user,
  token: (state) => state.token,
  isLoading: (state) => state.loading,
  error: (state) => state.error,
  addresses: (state) => state.addresses,
  isAdmin: (state) => state.user && state.user.role === 'admin'
};

// Actions
const actions = {
  // Giriş işlemi
  async login({ commit, dispatch }, { email, password }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    try {
      const response = await AuthService.login({ email, password });
      
      // Token ve kullanıcı bilgilerini kaydet
      commit('SET_AUTH', {
        token: response.data.token,
        user: response.data.user
      });
      
      // Kullanıcı giriş yaptıktan sonra favorileri yükle
      setTimeout(() => {
        dispatch('products/fetchUserWishlist', null, { root: true });
      }, 500); // API isteklerinin üst üste binmemesi için kısa bir gecikme ekle
      
      commit('SET_LOADING', false);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
      commit('SET_LOADING', false);
      return Promise.reject(error);
    }
  },
  
  // Kayıt işlemi
  async register({ commit }, userData) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    try {
      // API'ye gönderilecek verileri kontrol et
      console.log('Kayıt için gönderilen veri:', userData);
      
      // Birthday formatını kontrol et ve düzelt
      if (userData.birthday && typeof userData.birthday === 'string') {
        // String formatında bir tarih varsa ve boş değilse ISO formatına dönüştür
        if (userData.birthday.trim() !== '') {
          try {
            const date = new Date(userData.birthday);
            if (!isNaN(date.getTime())) {
              userData.birthday = date.toISOString();
            } else {
              // Geçersiz tarih ise null olarak ayarla
              userData.birthday = null;
            }
          } catch (e) {
            console.error('Tarih formatı hatası:', e);
            userData.birthday = null;
          }
        } else {
          userData.birthday = null;
        }
      }
      
      const response = await AuthService.register(userData);
      
      // Token ve kullanıcı bilgilerini kaydet
      commit('SET_AUTH', {
        token: response.data.token,
        user: response.data.user
      });
      
      commit('SET_LOADING', false);
      return Promise.resolve(response.data);
    } catch (error) {
      console.error('Kayıt hatası:', error.response?.data || error.message);
      commit('SET_ERROR', error.response?.data?.message || 'Kayıt olurken bir hata oluştu');
      commit('SET_LOADING', false);
      return Promise.reject(error);
    }
  },
  
  // Çıkış işlemi
  async logout({ commit }) {
    commit('SET_LOADING', true);
    
    try {
      // LocalStorage'dan temizle
      StorageUtils.clearUserData();
      
      commit('CLEAR_AUTH');
      commit('SET_LOADING', false);
      return Promise.resolve();
    } catch (error) {
      commit('SET_LOADING', false);
      return Promise.reject(error);
    }
  },
  
  // Profil bilgilerini getir
  async getProfile({ commit, state }) {
    commit('SET_LOADING', true);
    
    try {
      if (!state.user || !state.user.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      const response = await AuthService.getProfile(state.user.id);
      commit('SET_USER', response.data);
      commit('SET_LOADING', false);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Profil bilgileri alınırken bir hata oluştu');
      commit('SET_LOADING', false);
      return Promise.reject(error);
    }
  },
  
  // Profil bilgilerini güncelle
  async updateProfile({ commit, state }, userData) {
    commit('SET_LOADING', true);
    
    try {
      if (!state.user || !state.user.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      const response = await AuthService.updateProfile(state.user.id, userData);
      commit('SET_USER', response.data);
      commit('SET_LOADING', false);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
      commit('SET_LOADING', false);
      return Promise.reject(error);
    }
  },
  
  // Kullanıcı siparişlerini getir
  async getUserOrders({ commit, state }) {
    commit('SET_LOADING', true);
    
    try {
      if (!state.user || !state.user.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      const response = await AuthService.getUserOrders(state.user.id);
      commit('SET_LOADING', false);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Siparişler alınırken bir hata oluştu');
      commit('SET_LOADING', false);
      return Promise.reject(error);
    }
  },
  
  // Kullanıcı adreslerini getir
  async getAddresses({ commit, state }) {
    commit('SET_LOADING', true);
    
    try {
      if (!state.user || !state.user.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      const response = await AuthService.getAddresses(state.user.id);
      commit('SET_ADDRESSES', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Adresler alınırken bir hata oluştu');
      commit('SET_LOADING', false);
      throw error;
    }
  },
  
  // Yeni adres ekle
  async addAddress({ commit, state, dispatch }, addressData) {
    commit('SET_LOADING', true);
    
    try {
      if (!state.user || !state.user.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      console.log('Gönderilen adres verisi:', addressData);
      
      // API isteği
      const response = await AuthService.addAddress(addressData);
      
      // Adresler listesini yenile
      await dispatch('getAddresses');
      
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      console.error('Adres ekleme hatası:', error.response?.data || error.message);
      commit('SET_ERROR', error.response?.data?.message || 'Adres eklenirken bir hata oluştu');
      commit('SET_LOADING', false);
      throw error;
    }
  },
  
  // Adres güncelle
  async updateAddress({ commit, state, dispatch }, { addressId, addressData }) {
    commit('SET_LOADING', true);
    
    try {
      if (!state.user || !state.user.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      // Kullanıcı ID'si ekle
      addressData.userId = state.user.id;
      
      const response = await AuthService.updateAddress(addressId, addressData);
      
      // Adresler listesini yenile
      await dispatch('getAddresses');
      
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Adres güncellenirken bir hata oluştu');
      commit('SET_LOADING', false);
      throw error;
    }
  },
  
  // Adres sil
  async deleteAddress({ commit, state, dispatch }, addressId) {
    commit('SET_LOADING', true);
    
    try {
      if (!state.user || !state.user.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      const response = await AuthService.deleteAddress(addressId);
      
      // Adresler listesini yenile
      await dispatch('getAddresses');
      
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Adres silinirken bir hata oluştu');
      commit('SET_LOADING', false);
      throw error;
    }
  },
  
  // Varsayılan adres yap
  async setDefaultAddress({ commit, state, dispatch }, addressId) {
    commit('SET_LOADING', true);
    
    try {
      if (!state.user || !state.user.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      // Adres ID'sinin sayı olduğundan emin olalım
      const numericAddressId = parseInt(addressId);
      if (isNaN(numericAddressId)) {
        throw new Error('Geçersiz adres ID: ' + addressId);
      }
      
      console.log(`Varsayılan adres yapılıyor: ${numericAddressId}`);
      
      // API isteği
      const response = await AuthService.setDefaultAddress(numericAddressId);
      
      console.log('Varsayılan adres ayarlama cevabı:', response.data);
      
      // Adresler listesini yenile
      await dispatch('getAddresses');
      
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      console.error('Varsayılan adres ayarlama hatası:', error.response?.data || error);
      
      // Hata mesajını daha detaylı oluştur
      let errorMessage = 'Varsayılan adres ayarlanırken bir hata oluştu';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      commit('SET_ERROR', errorMessage);
      commit('SET_LOADING', false);
      throw error;
    }
  },
  
  // Şifre değiştir
  async changePassword({ commit, state }, passwordData) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    
    try {
      if (!state.user || !state.user.id) {
        throw new Error('Kullanıcı bilgisi bulunamadı');
      }
      
      const response = await AuthService.changePassword(state.user.id, passwordData);
      
      commit('SET_LOADING', false);
      return Promise.resolve(response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Şifre değiştirilirken bir hata oluştu');
      commit('SET_LOADING', false);
      return Promise.reject(error);
    }
  }
};

// Mutations
const mutations = {
  SET_AUTH(state, { token, user }) {
    state.token = token;
    state.user = user;
    state.isAuthenticated = true;
    
    // LocalStorage'a kaydet
    StorageUtils.setToken(token);
    StorageUtils.setUser(user);
  },
  
  SET_USER(state, user) {
    state.user = user;
    
    // LocalStorage'a kaydet
    StorageUtils.setUser(user);
  },
  
  CLEAR_AUTH(state) {
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
  },
  
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  
  SET_ERROR(state, error) {
    state.error = error;
  },
  
  CLEAR_ERROR(state) {
    state.error = null;
  },
  
  SET_ADDRESSES(state, addresses) {
    state.addresses = addresses;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}; 