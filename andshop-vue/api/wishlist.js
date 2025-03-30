import apiClient from './index';
import { StorageUtils } from '~/utils/storage';

export default {
  // Kullanıcının favorilerini getir
  getUserWishlist() {
    // Kullanıcı ID'sini al
    const userId = StorageUtils.getUserId() || 1;
    
    // Yeni endpoint'e istek at
    return apiClient.get(`/users/${userId}/favorites`);
  },
  
  // Favorilere ürün ekle
  addToWishlist(productId) {
    // Kullanıcı ID'sini al
    const userId = StorageUtils.getUserId() || 1;
    
    // Yeni endpoint'e istek at
    return apiClient.post(`/users/${userId}/favorites`, { productId });
  },
  
  // Favorilerden ürün çıkar
  removeFromWishlist(productId) {
    // Kullanıcı ID'sini al
    const userId = StorageUtils.getUserId() || 1;
    
    // Yeni endpoint'e istek at
    return apiClient.delete(`/users/${userId}/favorites/${productId}`);
  }
}; 