export default function ({ $axios, store, redirect }) {
  // Axios Request Interceptors
  $axios.onRequest(config => {
    console.log('API isteği gönderiliyor:', config.url);
    return config;
  });

  // Axios Error Interceptors
  $axios.onError(error => {
    console.error('API hatası:', error);
    if (error.response) {
      // Sunucu yanıt verdi, ancak hata kodu döndü
      console.error('Hata yanıtı:', error.response.data);
      console.error('Hata durumu:', error.response.status);
    } else if (error.request) {
      // İstek gönderildi, ancak yanıt alınamadı
      console.error('İstek hatası:', error.request);
    } else {
      // İstek oluşturulurken hata oluştu
      console.error('İstek oluşturma hatası:', error.message);
    }
    
    return Promise.reject(error);
  });
} 