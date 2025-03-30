import apiClient from './index';

/**
 * Kullanıcı yetkilendirme servisi
 */
export default {
  /**
   * Kullanıcı girişi
   * @param {Object} credentials - Email ve şifre
   * @returns {Promise} API yanıtı
   */
  login(credentials) {
    return apiClient.post('/users/login', credentials);
  },

  /**
   * Kullanıcı kaydı
   * @param {Object} userData - Kullanıcı bilgileri
   * @returns {Promise} API yanıtı
   */
  register(userData) {
    return apiClient.post('/users/register', userData);
  },

  /**
   * Kullanıcı profil bilgilerini getir
   * @param {Number} userId - Kullanıcı ID
   * @returns {Promise} API yanıtı
   */
  getProfile(userId) {
    return apiClient.get(`/users/${userId}`);
  },

  /**
   * Kullanıcı profil bilgilerini güncelle
   * @param {Number} userId - Kullanıcı ID
   * @param {Object} userData - Güncellenecek kullanıcı bilgileri
   * @returns {Promise} API yanıtı
   */
  updateProfile(userId, userData) {
    return apiClient.put(`/users/${userId}`, userData);
  },

  /**
   * Kullanıcı şifresini değiştir
   * @param {Number} userId - Kullanıcı ID
   * @param {Object} passwordData - Şifre verileri {currentPassword, newPassword}
   * @returns {Promise} API yanıtı
   */
  changePassword(userId, passwordData) {
    return apiClient.post(`/users/${userId}/change-password`, passwordData);
  },

  /**
   * Kullanıcının siparişlerini getir
   * @param {Number} userId - Kullanıcı ID
   * @returns {Promise} API yanıtı
   */
  getUserOrders(userId) {
    return apiClient.get(`/users/${userId}/orders`);
  },

  /**
   * Kullanıcı adreslerini getir
   * @param {Number} userId - Kullanıcı ID
   * @returns {Promise} API yanıtı
   */
  getAddresses(userId) {
    return apiClient.get(`/addresses/user/${userId}`);
  },

  /**
   * Adres detayını getir
   * @param {Number} addressId - Adres ID
   * @returns {Promise} API yanıtı
   */
  getAddress(addressId) {
    return apiClient.get(`/addresses/${addressId}`);
  },

  /**
   * Yeni adres ekle
   * @param {Object} addressData - Adres bilgileri
   * @returns {Promise} API yanıtı
   */
  addAddress(addressData) {
    return apiClient.post('/addresses', addressData);
  },

  /**
   * Adres güncelle
   * @param {Number} addressId - Adres ID
   * @param {Object} addressData - Adres bilgileri
   * @returns {Promise} API yanıtı
   */
  updateAddress(addressId, addressData) {
    return apiClient.put(`/addresses/${addressId}`, addressData);
  },

  /**
   * Adres sil
   * @param {Number} addressId - Adres ID
   * @returns {Promise} API yanıtı
   */
  deleteAddress(addressId) {
    return apiClient.delete(`/addresses/${addressId}`);
  },

  /**
   * Adresi varsayılan olarak ayarla
   * @param {Number} addressId - Adres ID
   * @returns {Promise} API yanıtı
   */
  setDefaultAddress(addressId) {
    console.log(`API isteği: /addresses/${addressId}/set-default`);
    
    // PATCH isteği oluşturalım
    return apiClient.patch(`/addresses/${addressId}/set-default`, {})
      .then(response => {
        console.log('Başarılı yanıt:', response.data);
        return response;
      })
      .catch(error => {
        console.error('PATCH isteği başarısız:', error.response?.data || error.message);
        throw error;
      });
  }
}; 