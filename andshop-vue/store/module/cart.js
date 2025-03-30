import { cartService } from '@/services/cartService';

// StorageManager - localStorage işlemleri için yardımcı fonksiyonlar
const StorageManager = {
  saveCart(cart) {
    if (process.browser) {
      localStorage.setItem('cartItems', JSON.stringify(cart));
    }
  },
  
  saveTotal(total) {
    if (process.browser) {
      localStorage.setItem('cartTotal', JSON.stringify(total));
    }
  },
  
  clearCart() {
    if (process.browser) {
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartTotal');
    }
  },
  
  getCart() {
    if (process.browser) {
      const cartItems = localStorage.getItem('cartItems');
      return cartItems ? JSON.parse(cartItems) : null;
    }
    return null;
  }
};

// Başlangıç durumunu oluşturan fonksiyon
const initialState = () => {
  // Eğer tarayıcı ortamındaysak ve localStorage mevcutsa
  if (process.browser) {
    try {
      // LocalStorage'dan sepet verilerini al
      const cartItems = localStorage.getItem('cartItems')
      const cartTotal = localStorage.getItem('cartTotal')
      
      if (cartItems) {
        // Sepet verilerini parse et
        const parsedItems = JSON.parse(cartItems)
        const parsedTotal = cartTotal ? parseFloat(JSON.parse(cartTotal)) : 0
        
        // Toplam ürün sayısını hesapla
        let totalQty = 0
        parsedItems.forEach(item => {
          totalQty += (item.quantity || 0)
        })
        
        return {
          cart: parsedItems,
          total: parsedTotal,
          qty: totalQty,
          loading: false,
          error: null,
          coupon: null,
          couponDiscount: 0,
          couponError: null
        }
      }
    } catch (error) {
      console.error("LocalStorage'dan sepet verileri yüklenirken hata:", error)
      // Hata durumunda localStorage'ı temizle
      localStorage.removeItem('cartItems')
      localStorage.removeItem('cartTotal')
    }
  }
  
  // Varsayılan boş durum
  return {
    cart: [],
    total: 0,
    qty: 0,
    loading: false,
    error: null,
    coupon: null,
    couponDiscount: 0,
    couponError: null
  }
}

// State başlangıç durumu
const state = initialState

// getters
const getters = {
  // Sepetteki ürün listesi - ana sepet içeriği
  cartItems: (state) => {
    // Boş sepet kontrolü
    if (!state.cart || state.cart.length === 0) {
      return [];
    }
    
    // Geçersiz öğeleri filtrele
    return state.cart.filter(item => item && item.id);
  },
  
  // Sepetteki ürün sayısı - UI'da gösterilecek sayı
  cartItemCount: (state) => state.qty,
  
  // Diğer getterlar
  getCartItems: (state) => {
    // Boş sepet kontrolü
    if (!state.cart || state.cart.length === 0) {
      return [];
    }
    
    // Geçersiz öğeleri filtrele
    return state.cart.filter(item => item && item.id);
  },
  cartTotal: (state) => state.total,
  getCartTotal: (state) => state.total,
  cartQty: (state) => state.qty,
  isCartLoading: (state) => state.loading,
  cartError: (state) => state.error,
  // Kupon ile ilgili getters
  coupon: state => state.coupon,
  couponDiscount: state => state.couponDiscount,
  couponError: state => state.couponError,
  discountedTotal: state => {
    // Sepet toplamı - kupon indirimi
    // Minimum 0 olacak şekilde (negatif olamaz)
    return Math.max(0, state.total - state.couponDiscount);
  }
}

// actions
const actions = {
  // Sepeti getir
  async fetchCart({ commit }) {
    commit('SET_LOADING', true);
    
    try {
      // Sadece tarayıcı ortamında çalıştır
      if (process.browser) {
        // LocalStorage'dan verileri al
        const cartItems = localStorage.getItem('cartItems');
        
        if (cartItems) {
          try {
            const parsedItems = JSON.parse(cartItems);
            
            // Geçersiz öğeleri filtrele
            const validItems = parsedItems.filter(item => item && item.id);
            
            // Sepet öğelerini store'a yükle
            commit('SET_CART', validItems);
            console.log('Sepet verileri başarıyla yüklendi:', validItems.length, 'ürün');
          } catch (e) {
            console.error('Sepet verileri parse edilirken hata:', e);
            // Hatalı veri varsa temizle
            StorageManager.clearCart();
            commit('SET_CART', []);
          }
        } else {
          // Sepet verisi yoksa boş dizi yükle
          commit('SET_CART', []);
        }
      }
      
      commit('SET_LOADING', false);
      return { success: true };
    } catch (error) {
      console.error("Sepet yükleme hatası:", error);
      commit('SET_LOADING', false);
      return { success: false, error };
    }
  },

  // Sepete ürün ekle
  async addCart({commit, state}, {product, quantity}) {
    try {
      // Make sure quantity is a number
      const numQuantity = parseInt(quantity, 10) || 1;
      
      // API'den gelen ürün formatına güvenlik kontrolü
      if (!product) {
        throw new Error("Ürün bilgisi bulunamadı");
      }
      
      // Ürün fiyat kontrolü
      if (product.price === undefined) {
        throw new Error("Ürün fiyatı bulunamadı");
      }
      
      // Check stock availability
      if (product.stock !== undefined && product.stock !== null) {
        // Check current cart quantity for this product
        const existingItem = state.cart.find(cartItem => 
          cartItem.id === product.id && 
          cartItem.selectedSize === product.selectedSize && 
          cartItem.selectedColor === product.selectedColor
        );
        
        const currentQuantity = existingItem ? parseInt(existingItem.quantity, 10) : 0;
        const totalRequestedQuantity = currentQuantity + numQuantity;
        
        // Validate against stock
        if (totalRequestedQuantity > product.stock) {
          throw new Error(`Stokta sadece ${product.stock} adet ürün bulunmaktadır. Daha fazla ekleyemezsiniz.`);
        }
      }
      
      // Sepet ID'si oluştur
      const cartItemId = Math.floor(Math.random() * 1000000);
      
      // Ürünü hazırla - API formatı değişkenliğini ele alır
      const item = {
        ...product,
        cartItemId: cartItemId,
        quantity: numQuantity,
        // discountPrice kontrolü ekleyelim
        // API'den farklı formatlarda gelebilir
        totalPrice: (product.discountPrice !== undefined && product.discountPrice !== null) 
          ? (product.discountPrice * numQuantity) 
          : (product.price * numQuantity)
      };
      
      // Ürünü sepete ekle
      commit('ADD_TO_CART', {item});
      
      return { success: true, item };
    } catch (error) {
      console.error("Sepete ekleme hatası:", error);
      return { success: false, error: error.message || "Ürün sepete eklenirken bir hata oluştu" };
    }
  },

  // Sepetten ürün çıkar
  async removeFromCart({ commit }, item) {
    try {
      // Ürünü sepetten çıkar
      commit('REMOVE_FROM_CART', item);
      return { success: true };
    } catch (error) {
      console.error("Sepetten ürün çıkarma hatası:", error);
      return { success: false, error };
    }
  },

  // Sepetteki ürün miktarını güncelle
  async updateCartItem({ commit }, payload) {
    try {
      // Mutation'ı çağır ve güncellenmiş ürünü ilet
      commit('UPDATE_CART_QUANTITY', payload);
      return { success: true };
    } catch (error) {
      console.error("Sepet güncelleme hatası:", error);
      return { success: false, error };
    }
  },

  // Sepeti temizle
  async clearCart({ commit }) {
    try {
      // Sepeti temizle
      commit('CLEAR_CART');
      
      // LocalStorage'dan da temizle
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartTotal');
      
      return { success: true };
    } catch (error) {
      console.error("Sepeti temizleme hatası:", error);
      return { success: false, error };
    }
  },

  // Kupon uygulama işlemi
  applyCoupon({ commit, state, dispatch, rootState }, { code }) {
    // Debug log ekleyelim
    console.log('Kupon uygulama isteği:', code, 'Sepet Tutarı:', state.total);
    
    // Boş kod kontrolü
    if (!code || code.trim() === '') {
      commit('SET_COUPON_ERROR', 'Lütfen bir kupon kodu girin');
      return Promise.resolve({
        success: false,
        message: 'Lütfen bir kupon kodu girin'
      });
    }
    
    // Kupon hata durumunu sıfırla
    commit('SET_COUPON_ERROR', null);
    
    // API'ye istek hazırlığı
    const totalAmount = state.total;
    const formattedCode = code.trim().toUpperCase();
    
    // Root store'daki validateCoupon metodunu kullan
    return dispatch('validateCoupon', { code: formattedCode, amount: totalAmount }, { root: true })
      .then(response => {
        console.log('Kupon API yanıtı:', response);
        if (response.isValid) {
          // Kupon geçerliyse state'e ekle
          commit('SET_COUPON', response.coupon);
          commit('SET_COUPON_DISCOUNT', response.discountAmount);
          
          // Sepet toplamını güncelle
          dispatch('calculateTotal');
          
          return {
            success: true,
            message: 'Kupon başarıyla uygulandı',
            discount: response.discountAmount,
            data: response.coupon
          };
        } else {
          // Kupon geçersizse hata mesajı göster
          commit('SET_COUPON_ERROR', response.message);
          commit('SET_COUPON', null);
          commit('SET_COUPON_DISCOUNT', 0);
          
          return {
            success: false,
            message: response.message
          };
        }
      })
      .catch(error => {
        console.error('Kupon uygulanırken hata:', error);
        
        // Hata detaylarını göster
        if (error.response) {
          console.error('Hata yanıtı:', error.response.data);
          console.error('Hata durumu:', error.response.status);
        } else if (error.request) {
          console.error('İstek gönderildi ama yanıt alınamadı:', error.request);
        } else {
          console.error('İstek hatası:', error.message);
        }
        
        // Hata durumunda
        const errorMessage = error.response?.data?.message || 'Kupon uygulanırken bir hata oluştu';
        commit('SET_COUPON_ERROR', errorMessage);
        commit('SET_COUPON', null);
        commit('SET_COUPON_DISCOUNT', 0);
        
        return {
          success: false,
          message: errorMessage,
          error: error
        };
      });
  },
  
  // Kuponu kaldır
  removeCoupon({ commit, dispatch }) {
    commit('SET_COUPON', null);
    commit('SET_COUPON_DISCOUNT', 0);
    commit('SET_COUPON_ERROR', null);
    
    // Sepet toplamını güncelle
    dispatch('calculateTotal');
    
    return {
      success: true,
      message: 'Kupon kaldırıldı'
    };
  },

  // Ödemeye geçerken sepet bilgilerini koru
  proceedToCheckout({ state, dispatch }) {
    // Sepeti önce hesapla/güncelle
    dispatch('calculateTotal');
    
    // Storage'a güncellenen bilgileri kaydet
    if (state.coupon && state.couponDiscount > 0) {
      localStorage.setItem('cartCoupon', JSON.stringify(state.coupon));
      localStorage.setItem('cartCouponDiscount', state.couponDiscount);
    }
    
    return {
      success: true,
      cartTotal: state.total,
      discountedTotal: Math.max(0, state.total - state.couponDiscount),
      couponDiscount: state.couponDiscount
    };
  },

  // Sepeti localStorage'dan yükle
  async loadCartFromStorage({ commit, dispatch }) {
    try {
      // Sepeti localStorage'dan al
      const cart = StorageManager.getCart();
      if (cart && Array.isArray(cart)) {
        commit('SET_CART', cart);
        
        // Kupon bilgilerini kontrol et
        const savedCoupon = localStorage.getItem('cartCoupon');
        const savedDiscount = localStorage.getItem('cartCouponDiscount');
        
        if (savedCoupon && savedDiscount) {
          try {
            const coupon = JSON.parse(savedCoupon);
            const discount = parseFloat(savedDiscount);
            
            if (coupon && !isNaN(discount) && discount > 0) {
              commit('SET_COUPON', coupon);
              commit('SET_COUPON_DISCOUNT', discount);
              console.log('Kayıtlı kupon bilgisi yüklendi:', coupon.code, discount);
            }
          } catch (e) {
            console.error('Kupon bilgisi yüklenirken hata:', e);
          }
        }
      }
      
      // Totali hesapla
      dispatch('calculateTotal');
      
      return { success: true };
    } catch (error) {
      console.error("Sepet yüklenirken hata:", error);
      return { success: false, error };
    }
  }
}

// mutations
const mutations = {
  SET_LOADING(state, status) {
    state.loading = status;
  },
  
  SET_ERROR(state, error) {
    state.error = error;
  },

  SET_CART(state, products) {
    state.cart = products;
    updateTotals(state);
    
    // LocalStorage'a kaydet
    StorageManager.saveCart(state.cart);
    StorageManager.saveTotal(state.total);
  },

  ADD_TO_CART(state, {item}) {
    // Sepette aynı üründen var mı diye kontrol et
    const existingItem = state.cart.find(cartItem => 
      cartItem.id === item.id && 
      cartItem.selectedSize === item.selectedSize && 
      cartItem.selectedColor === item.selectedColor
    );

    if (existingItem) {
      // Varsa miktarını güncelle - ensure it's numeric
      existingItem.quantity = parseInt(existingItem.quantity, 10) + parseInt(item.quantity, 10);
      
      // Güvenli fiyat hesaplama
      if (existingItem.discountPrice !== undefined && existingItem.discountPrice !== null) {
        existingItem.totalPrice = existingItem.discountPrice * existingItem.quantity;
      } else {
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      }
    } else {
      // Yoksa yeni ekle
      state.cart.push({
        ...item,
        quantity: parseInt(item.quantity, 10)
      });
    }

    // Sepet toplamını güncelle
    updateTotals(state);
    
    // LocalStorage'a kaydet
    StorageManager.saveCart(state.cart);
    StorageManager.saveTotal(state.total);
  },
  
  REMOVE_FROM_CART(state, item) {
    // ID ve varyant bilgilerine göre ürünü sepetten çıkar
    state.cart = state.cart.filter(cartItem => 
      !(cartItem.id === item.id && 
        cartItem.selectedSize === item.selectedSize && 
        cartItem.selectedColor === item.selectedColor)
    );
    
    // Toplamları güncelle
    updateTotals(state);
    
    // LocalStorage'a kaydet
    StorageManager.saveCart(state.cart);
    StorageManager.saveTotal(state.total);
  },
  
  UPDATE_CART_QUANTITY(state, payload) {
    console.log("Sepet güncelleniyor", payload);
    try {
      // Make sure quantity is a number
      const newQuantity = parseInt(payload.quantity, 10);
      
      if (isNaN(newQuantity) || newQuantity <= 0) {
        console.error("Geçersiz miktar:", payload.quantity);
        return;
      }
      
      // Sepetteki ürünü bul
      const item = state.cart.find(cartItem => {
        if (payload.selectedSize && payload.selectedColor) {
          return cartItem.id === payload.id && 
                 cartItem.selectedSize === payload.selectedSize && 
                 cartItem.selectedColor === payload.selectedColor;
        } else if (payload.selectedSize) {
          return cartItem.id === payload.id && cartItem.selectedSize === payload.selectedSize;
        } else if (payload.selectedColor) {
          return cartItem.id === payload.id && cartItem.selectedColor === payload.selectedColor;
        } else {
          return cartItem.id === payload.id;
        }
      });

      if (item) {
        // Check stock limits if product has stock info
        if (item.stock !== undefined && item.stock !== null) {
          if (newQuantity > item.stock) {
            console.warn(`Stok sınırı aşıldı. Maksimum ${item.stock} adet eklenebilir.`);
            // Limit the quantity to available stock
            item.quantity = item.stock;
          } else {
            // Miktarı güncelle
            item.quantity = newQuantity;
          }
        } else {
          // If no stock info, just update quantity
          item.quantity = newQuantity;
        }
        
        // Toplam fiyatı güncelle
        if (item.discountPrice) {
          item.totalPrice = item.discountPrice * item.quantity;
        } else if (item.price) {
          item.totalPrice = item.price * item.quantity;
        }
        
        // Sepet toplamlarını güncelle
        updateTotals(state);
        
        // LocalStorage'a kaydet
        StorageManager.saveCart(state.cart);
        StorageManager.saveTotal(state.total);
      } else {
        console.warn("Ürün sepette bulunamadı:", payload);
      }
    } catch (error) {
      console.error("Sepet miktarı güncelleme hatası:", error);
    }
  },
  
  CLEAR_CART(state) {
    state.cart = [];
    state.total = 0;
    state.qty = 0;
    
    // LocalStorage'dan sepet verilerini temizle
    StorageManager.clearCart();
  },
  
  UPDATE_TOTALS(state) {
    updateTotals(state);
    
    // LocalStorage'a kaydet
    StorageManager.saveTotal(state.total);
  },

  SET_COUPON(state, coupon) {
    state.coupon = coupon;
  },
  
  SET_COUPON_DISCOUNT(state, amount) {
    state.couponDiscount = amount;
  },
  
  SET_COUPON_ERROR(state, error) {
    state.couponError = error;
  }
}

// Sepet toplamlarını güncellemek için yardımcı fonksiyon
const updateTotals = (state) => {
    if (!state.cart || !state.cart.length) {
        state.total = 0;
        state.qty = 0;
        return;
    }
    
    let totalPrice = 0;
    let totalQty = 0;
    
    state.cart.forEach(item => {
        if (!item) return; // Null check
        
        // Güvenli fiyat hesaplama (API formatına uygun)
        let itemPrice = 0;
        
        // discountPrice kontrolü - API'den farklı formatlarda gelebilir
        if (item.discountPrice !== undefined && item.discountPrice !== null) {
            itemPrice = parseFloat(item.discountPrice);
        } else if (item.price !== undefined) { 
            itemPrice = parseFloat(item.price);
        } else {
            console.warn("Ürün fiyatı bulunamadı:", item);
            itemPrice = 0;
        }
        
        // Ensure quantity is a number
        const quantity = parseInt(item.quantity, 10) || 0;
            
        totalPrice += itemPrice * quantity;
        totalQty += quantity;
    });
    
    state.total = parseFloat(totalPrice.toFixed(2));
    state.qty = totalQty;
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
