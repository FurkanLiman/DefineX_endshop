/**
 * LocalStorage yardımcı sınıfı
 * Kullanıcı kimlik bilgilerinin yönetimi için kullanılır
 */

// Local Storage Yardımcı Fonksiyonları

// Sabit key'ler
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const StorageUtils = {
  // Token işlemleri
  setToken(token) {
    if (process.browser) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },
  
  getToken() {
    if (process.browser) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },
  
  // Kullanıcı bilgisi işlemleri
  setUser(user) {
    if (process.browser) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  
  getUser() {
    if (process.browser) {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          console.error('Kullanıcı bilgisi parse edilemedi', e);
          return null;
        }
      }
    }
    return null;
  },
  
  // Kullanıcı ID'sini getir
  getUserId() {
    const user = this.getUser();
    return user ? user.id : null;
  },
  
  // Kullanıcı verilerini temizle
  clearUserData() {
    if (process.browser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
  
  // Token geçerlilik kontrolü
  isAuthenticated() {
    return !!this.getToken();
  }
}; 