export default function ({ store, redirect }) {
  // Kullanıcı kimlik doğrulama durumunu kontrol et
  const isAuthenticated = store.getters['user/isAuthenticated']
  
  // Kullanıcı bilgisini al
  const user = store.getters['user/currentUser']
  
  // Kullanıcı giriş yapmamışsa veya admin değilse ana sayfaya yönlendir
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return redirect('/')
  }
} 