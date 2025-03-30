export default (context) => {
  // Sadece client tarafında çalıştır
  if (process.browser) {
    // Sayfayı yüklerken localStorage'dan sepet verilerini al
    const cartItems = localStorage.getItem('cartItems')
    const cartTotal = localStorage.getItem('cartTotal')

    // Eğer localStorage'da sepet verileri varsa store'a yükle
    if (cartItems) {
      try {
        const parsedItems = JSON.parse(cartItems)
        context.store.commit('cart/SET_CART', parsedItems)
        console.log('Sepet verileri localStorage\'dan yüklendi:', parsedItems.length, 'ürün')
      } catch (error) {
        console.error('Sepet verileri yüklenirken bir hata oluştu:', error)
        localStorage.removeItem('cartItems')
      }
    }
  }
} 