import apiClient from './index';

/**
 * Sipariş oluşturma
 * @param {Object} orderData - Sipariş verileri
 * @returns {Promise} - API yanıtı
 */
export const createOrder = (orderData) => {
  return apiClient.post('/orders', orderData);
};

/**
 * Kullanıcının siparişlerini getirme
 * @param {Number} userId - Kullanıcı ID
 * @returns {Promise} - API yanıtı
 */
export const getUserOrders = (userId) => {
  return apiClient.get(`/orders/user/${userId}`);
};

/**
 * Sipariş detayını getirme
 * @param {Number} orderId - Sipariş ID
 * @returns {Promise} - API yanıtı
 */
export const getOrderDetails = (orderId) => {
  return apiClient.get(`/orders/${orderId}`);
};

/**
 * Sipariş durumunu güncelleme
 * @param {Number} orderId - Sipariş ID
 * @param {Object} updateData - Güncellenecek veriler
 * @returns {Promise} - API yanıtı
 */
export const updateOrderStatus = (orderId, updateData) => {
  return apiClient.put(`/orders/${orderId}`, updateData);
};

/**
 * Sipariş iptal etme
 * @param {Number} orderId - Sipariş ID
 * @returns {Promise} - API yanıtı
 */
export const cancelOrder = (orderId) => {
  return apiClient.delete(`/orders/${orderId}`);
};

export default {
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
  cancelOrder
}; 