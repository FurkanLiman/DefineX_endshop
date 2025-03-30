import Vue from 'vue'
import Vuex from 'vuex'
import products from './module/products'
import cart from './module/cart'
import user from './module/user'
import order from './module/order'
import adminModule from './module/admin'

Vue.use(Vuex)
const createStore = () => {
  return new Vuex.Store({
    modules: {
      products: products,
      cart: cart,
      user: user,
      order: order,
      admin: adminModule
    },
    actions: {
      // Uygulama başladığında çalışır
      async nuxtServerInit({ dispatch }) {
        try {
          // İlk ürünleri yükle
          await dispatch('products/fetchProducts')
          // Kullanıcı kimlik doğrulama durumunu yükle
          await dispatch('user/loadAuthFromStorage')
          // SSR için başka init işlemleri eklenebilir
          await dispatch('cart/loadCartFromStorage')
          await dispatch('order/loadOrdersFromStorage')
        } catch (error) {
          console.error('Server başlatma hatası:', error)
        }
      },

      // Nuxt context'i store'a kaydet
      nuxtServerInit({ commit }, { app }) {
        commit('SET_APP', app);
      },

      // Alternatif kupon işlemleri
      validateCoupon({ state }, { code, amount }) {
        // Axios yerine native fetch kullanma
        return fetch(`http://localhost:5000/api/coupons/validate/${code.trim().toUpperCase()}?amount=${amount}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(response => {
            console.log('Root store: Kupon API yanıtı:', response);
            return response;
          })
          .catch(error => {
            console.error('Root store: Kupon hatası:', error);
            throw error;
          });
      }
    }
  })
}
export default createStore