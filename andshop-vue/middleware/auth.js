export default function ({ store, redirect, route }) {
  // Kullanıcı kimlik doğrulama durumunu kontrol et
  const isAuthenticated = store.getters['user/isAuthenticated']
  
  // Hedef route korumalı bir route mu?
  const requiresAuth = route.meta?.requiresAuth || route.matched.some(record => record.meta?.requiresAuth)
  
  // Korumalı route için giriş yapılmamışsa login sayfasına yönlendir
  if (requiresAuth && !isAuthenticated) {
    return redirect('/login?redirect=' + encodeURIComponent(route.fullPath))
  }
  
  // Kullanıcı giriş yapmışsa login ve register sayfalarına erişmeye çalışırsa ana sayfaya yönlendir
  if (isAuthenticated && (route.path === '/login' || route.path === '/register')) {
    return redirect('/')
  }
} 