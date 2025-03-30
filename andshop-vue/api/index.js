import axios from 'axios';
import { StorageUtils } from '~/utils/storage';

// API URL'lerinize göre ayarlayın
// const baseURL = 'https://fakestoreapi.com'; // Örnek API, gerçek projenizde kendi API adresinizi kullanın

// .NET Core Microservice API URL'iniz
const baseURL = 'http://localhost:5000/api'; // Bu URL'i kendi API adresinizle değiştirin

// Axios instance'ı oluştur
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000, // 10 saniye timeout
  withCredentials: false // CORS ayarı
});

// PATCH isteği için OPTIONS ön isteğinin doğru çalışması için CORS ayarları
apiClient.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
apiClient.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

// İstek interceptor'u - her istekte token ekle
apiClient.interceptors.request.use(
  config => {
    const token = StorageUtils.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'u - 401 hatalarını yakala
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Token geçersiz olmuş, ancak kullanıcıyı hemen yönlendirme
      console.warn('Yetkilendirme hatası: Oturum süresi dolmuş olabilir');
      
      // Sadece localStorage temizle ama yönlendirme yapma
      StorageUtils.clearUserData();
      
      // Oturum hatası ekle
      if (window.$nuxt && window.$nuxt.$store) {
        window.$nuxt.$store.commit('user/SET_ERROR', 'Oturum süreniz dolmuş olabilir, ancak işlemlerinize devam edebilirsiniz.');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient; 