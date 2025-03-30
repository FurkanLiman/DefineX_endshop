<template>
  <div>
    <Header />
    <transition name="fade" mode="out-in">
      <Nuxt />
    </transition>
    <Footer />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { StorageUtils } from '~/utils/storage';

export default {
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated',
      currentUser: 'user/currentUser'
    })
  },
  
  mounted() {
    // For Loading 
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      setTimeout(() => this.$nuxt.$loading.finish(), 3000)
    })
    
    // Kullanıcı giriş yapmışsa ve sayfayı yenilerse profil bilgilerini yeniden getir
    this.checkUserAuthentication();
    
    // Sepet verilerini yükle
    if (this.$store.getters['cart/cartItems'].length === 0) {
      this.$store.dispatch('cart/fetchCart');
    }
    
    // Favorileri yükle (kullanıcı giriş yapmışsa)
    if (this.$store.getters['user/isAuthenticated']) {
      this.$store.dispatch('products/fetchUserWishlist')
        .then(wishlist => {
          console.log("Favoriler yüklendi, toplam:", wishlist.length);
        })
        .catch(error => {
          console.error("Favoriler yüklenirken hata:", error);
        });
    }
  },
  
  methods: {
    ...mapActions({
      getProfile: 'user/getProfile',
      fetchUserWishlist: 'products/fetchUserWishlist'
    }),
    
    async checkUserAuthentication() {
      // Kullanıcı token'ı var mı ve kullanıcı store'da yok mu?
      if (StorageUtils.isAuthenticated() && !this.currentUser) {
        try {
          await this.getProfile();
          // Kullanıcı bilgisi alındıktan sonra favorileri de yükle
          await this.fetchUserWishlist();
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
        }
      }
    }
  }
}
</script>