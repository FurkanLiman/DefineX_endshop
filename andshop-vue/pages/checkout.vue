<template>
  <div>
    <!-- Banner Area -->
    <section id="common_banner_one">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="common_banner_text">
              <h2>Ödeme</h2>
              <b-breadcrumb :items="breadcrumbItems" class="bg-transparent"></b-breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Checkout Area -->
    <section id="checkout_area" class="ptb-100">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div v-if="cartItems.length === 0" class="empty_cart_area text-center py-5">
              <i class="fas fa-shopping-basket fa-4x mb-3 text-muted"></i>
              <h4>Sepetinizde ürün bulunmuyor</h4>
              <p class="mb-4">Ödeme yapabilmek için sepetinize ürün eklemelisiniz.</p>
              <nuxt-link to="/shop" class="theme-btn-one btn-black-overlay btn_md">
                Alışverişe Başla
              </nuxt-link>
            </div>
            <div v-else>
              <form @submit.prevent="placeOrder">
                <div class="row">
                  <!-- Left Content -->
                  <div class="col-lg-7 col-md-12">
                    <div class="checkout_left_content">
                      <div class="checkout_title">
                        <h3>Fatura & Teslimat Bilgileri</h3>
                      </div>

                      <!-- Address Selection -->
                      <div class="address-selection mb-4">
                        <div v-if="!isAuthenticated" class="alert alert-info">
                          <p class="mb-0">
                            Zaten hesabınız var mı? <nuxt-link to="/login">Giriş yapın</nuxt-link> veya 
                            <nuxt-link to="/register">üye olun</nuxt-link> ve kayıtlı adreslerinizi kullanın.
                          </p>
                        </div>
                        
                        <div v-if="isAuthenticated && savedAddresses.length > 0" class="saved-addresses">
                          <h5>Kayıtlı Adresleriniz</h5>
                          <div class="row">
                            <div v-for="(address, index) in savedAddresses" :key="index" class="col-md-6 mb-3">
                              <div 
                                class="address-card p-3" 
                                :class="{ 'selected': selectedAddressId === address.id }"
                                @click="selectAddress(address.id)">
                                <div class="d-flex justify-content-between mb-2">
                                  <h6 class="mb-0">{{ address.title }}</h6>
                                  <div v-if="address.isDefault" class="default-badge">
                                    <small>Varsayılan</small>
                                  </div>
                                </div>
                                <p class="mb-1">{{ address.fullName }}</p>
                                <p class="mb-1">{{ address.phone }}</p>
                                <p class="mb-1">{{ address.address }}</p>
                                <p class="mb-0">{{ address.district }}/{{ address.city }} - {{ address.zipCode }}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div class="mt-3 mb-4">
                            <label>
                              <input type="checkbox" v-model="useNewAddress" class="mr-2">
                              Farklı bir adrese gönder
                            </label>
                          </div>
                        </div>
                        
                        <!-- New Address Form -->
                        <div v-if="!isAuthenticated || useNewAddress || savedAddresses.length === 0">
                          <div class="row">
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label for="firstName">Ad <span>*</span></label>
                                <input 
                                  type="text" 
                                  id="firstName" 
                                  v-model="checkoutForm.firstName" 
                                  class="form-control"
                                  required>
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label for="lastName">Soyad <span>*</span></label>
                                <input 
                                  type="text" 
                                  id="lastName" 
                                  v-model="checkoutForm.lastName" 
                                  class="form-control"
                                  required>
                              </div>
                            </div>
                            <div class="col-lg-12">
                              <div class="form-group">
                                <label for="company">Firma Adı (İsteğe bağlı)</label>
                                <input 
                                  type="text" 
                                  id="company" 
                                  v-model="checkoutForm.company" 
                                  class="form-control">
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label for="country">Ülke <span>*</span></label>
                                <select 
                                  id="country" 
                                  v-model="checkoutForm.country" 
                                  class="form-control"
                                  required>
                                  <option value="TR">Türkiye</option>
                                </select>
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label for="city">İl <span>*</span></label>
                                <input 
                                  type="text" 
                                  id="city" 
                                  v-model="checkoutForm.city" 
                                  class="form-control"
                                  required>
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label for="district">İlçe <span>*</span></label>
                                <input 
                                  type="text" 
                                  id="district" 
                                  v-model="checkoutForm.district" 
                                  class="form-control"
                                  required>
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label for="zipCode">Posta Kodu <span>*</span></label>
                                <input 
                                  type="text" 
                                  id="zipCode" 
                                  v-model="checkoutForm.zipCode" 
                                  class="form-control"
                                  required>
                              </div>
                            </div>
                            <div class="col-lg-12">
                              <div class="form-group">
                                <label for="address">Adres <span>*</span></label>
                                <textarea 
                                  id="address" 
                                  v-model="checkoutForm.address" 
                                  class="form-control"
                                  rows="3"
                                  required></textarea>
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label for="phone">Telefon <span>*</span></label>
                                <input 
                                  type="tel" 
                                  id="phone" 
                                  v-model="checkoutForm.phone" 
                                  class="form-control"
                                  placeholder="(5xx) xxx xx xx"
                                  required>
                              </div>
                            </div>
                            <div class="col-lg-6">
                              <div class="form-group">
                                <label for="email">E-posta <span>*</span></label>
                                <input 
                                  type="email" 
                                  id="email" 
                                  v-model="checkoutForm.email" 
                                  class="form-control"
                                  required>
                              </div>
                            </div>
                            
                            <div class="col-lg-12" v-if="isAuthenticated">
                              <div class="form-check mb-3">
                                <input 
                                  type="checkbox" 
                                  class="form-check-input" 
                                  id="saveAddress" 
                                  v-model="checkoutForm.saveAddress">
                                <label class="form-check-label" for="saveAddress">
                                  Bu adresi kaydet
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Order Notes -->
                      <div class="form-group mb-4">
                        <label for="orderNotes">Sipariş Notu (İsteğe bağlı)</label>
                        <textarea
                          id="orderNotes"
                          v-model="checkoutForm.orderNotes"
                          class="form-control"
                          rows="3"
                          placeholder="Siparişinizle ilgili notlar (teslimat için özel notlar)"></textarea>
                      </div>
                    </div>
                  </div>

                  <!-- Right Content -->
                  <div class="col-lg-5 col-md-12">
                    <div class="checkout_right">
                      <!-- Order Summary -->
                      <div class="checkout_order_summary">
                        <div class="checkout_title">
                          <h3>Sipariş Özeti</h3>
                        </div>
                        <div class="order_summary_content">
                          <ul class="order_items">
                            <li v-for="(item, index) in cartItems" :key="index" class="order_item">
                              <div class="product_thumb">
                                <img :src="getProductImage(item)" :alt="item.title">
                              </div>
                              <div class="product_info">
                                <h4>{{ item.title }}</h4>
                                <p>
                                  <small v-if="item.size">Beden: {{ item.size }}</small>
                                  <small v-if="item.color">Renk: {{ item.color }}</small>
                                </p>
                                <div class="cart_pro_qty">
                                  <span>{{ item.quantity }} x ₺{{ calculateItemPrice(item) }}</span>
                                  <span class="price">₺{{ calculateItemTotal(item) }}</span>
                                </div>
                              </div>
                            </li>
                          </ul>
                          
                          <div class="cart_subtotal">
                            <p>Ara Toplam</p>
                            <p class="cart_amount">₺{{ cartTotal.toFixed(2) }}</p>
                          </div>
                          
                          <div v-if="couponDiscount > 0" class="cart_subtotal discount">
                            <p>Kupon İndirimi</p>
                            <p class="cart_amount discount-amount">-₺{{ couponDiscount.toFixed(2) }}</p>
                          </div>
                          
                          <div class="cart_subtotal">
                            <p>Kargo</p>
                            <p class="cart_amount">₺{{ shippingCost.toFixed(2) }}</p>
                          </div>
                          
                          <div class="cart_total">
                            <p>Genel Toplam</p>
                            <p class="cart_amount">₺{{ (finalTotal + shippingCost).toFixed(2) }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Payment Methods -->
                      <div class="payment_methods mt-4">
                        <div class="checkout_title">
                          <h3>Ödeme Yöntemi</h3>
                        </div>
                        <div class="payment_methods_content">
                          <div class="payment_option">
                            <div class="form-check mb-3">
                              <input 
                                type="radio" 
                                class="form-check-input" 
                                id="payment_credit_card" 
                                value="credit_card" 
                                v-model="checkoutForm.paymentMethod"
                                checked>
                              <label class="form-check-label" for="payment_credit_card">
                                Kredi/Banka Kartı
                              </label>
                            </div>
                            
                            <div v-if="checkoutForm.paymentMethod === 'credit_card'" class="credit_card_form mb-4">
                              <div class="row">
                                <div class="col-12">
                                  <div class="form-group">
                                    <label for="cardNumber">Kart Numarası <span>*</span></label>
                                    <input 
                                      type="text" 
                                      id="cardNumber" 
                                      v-model="paymentForm.cardNumber" 
                                      class="form-control" 
                                      placeholder="XXXX XXXX XXXX XXXX"
                                      required>
                                  </div>
                                </div>
                                <div class="col-12">
                                  <div class="form-group">
                                    <label for="cardName">Kart Üzerindeki İsim <span>*</span></label>
                                    <input 
                                      type="text" 
                                      id="cardName" 
                                      v-model="paymentForm.cardName" 
                                      class="form-control"
                                      required>
                                  </div>
                                </div>
                                <div class="col-6">
                                  <div class="form-group">
                                    <label for="expiryDate">Son Kullanma Tarihi <span>*</span></label>
                                    <input 
                                      type="text" 
                                      id="expiryDate" 
                                      v-model="paymentForm.expiryDate" 
                                      class="form-control" 
                                      placeholder="AA/YY"
                                      required>
                                  </div>
                                </div>
                                <div class="col-6">
                                  <div class="form-group">
                                    <label for="cvv">CVV/CVC <span>*</span></label>
                                    <input 
                                      type="text" 
                                      id="cvv" 
                                      v-model="paymentForm.cvv" 
                                      class="form-control" 
                                      placeholder="XXX"
                                      required>
                                  </div>
                                </div>
                              </div>
                              <div class="accepted_cards mt-2">
                                <small>Kabul edilen kartlar:</small>
                                <div class="card_icons mt-1">
                                  <i class="fab fa-cc-visa mr-2"></i>
                                  <i class="fab fa-cc-mastercard mr-2"></i>
                                  <i class="fab fa-cc-amex mr-2"></i>
                                  <i class="fab fa-cc-discover"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div class="payment_option">
                            <div class="form-check mb-3">
                              <input 
                                type="radio" 
                                class="form-check-input" 
                                id="payment_paypal" 
                                value="paypal" 
                                v-model="checkoutForm.paymentMethod">
                              <label class="form-check-label" for="payment_paypal">
                                <i class="fab fa-paypal mr-2"></i> PayPal
                              </label>
                            </div>
                          </div>
                          
                          <div class="payment_option">
                            <div class="form-check mb-3">
                              <input 
                                type="radio" 
                                class="form-check-input" 
                                id="payment_cash_on_delivery" 
                                value="cash_on_delivery" 
                                v-model="checkoutForm.paymentMethod">
                              <label class="form-check-label" for="payment_cash_on_delivery">
                                Kapıda Ödeme
                              </label>
                              <p class="payment_info" v-if="checkoutForm.paymentMethod === 'cash_on_delivery'">
                                Kapıda ödeme seçeneğinde +15₺ hizmet bedeli bulunmaktadır.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Order Button -->
                      <div class="checkout_order_btn mt-4">
                        <button type="submit" class="theme-btn-one btn-black-overlay btn_md w-100" :disabled="isLoading">
                          <span v-if="isLoading">
                            <i class="fas fa-spinner fa-spin mr-2"></i>Sipariş İşleniyor...
                          </span>
                          <span v-else>Siparişi Tamamla</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CheckoutPage',
  head() {
    return {
      title: 'Ödeme',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Ödeme sayfası'
        }
      ]
    };
  },
  data() {
    return {
      title: 'Ödeme',
      breadcrumbItems: [
        {
          text: 'Anasayfa',
          to: '/'
        },
        {
          text: 'Ödeme',
          active: true
        }
      ],
      // Adres seçim ayarları
      useNewAddress: false,
      selectedAddressId: null,
      // Ödeme bilgileri
      isLoading: false,
      checkoutForm: {
        firstName: '',
        lastName: '',
        country: 'TR',
        address: '',
        city: '',
        district: '',
        zipCode: '',
        phone: '',
        email: '',
        company: '',
        orderNotes: '',
        saveAddress: true,
        paymentMethod: 'credit_card'
      },
      // Kart formu (kredi kartı seçildiğinde)
      paymentForm: {
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
      },
      // Kargo ücreti
      shippingCost: 0
    };
  },
  computed: {
    ...mapGetters({
      cartItems: 'cart/getCartItems',
      cartTotal: 'cart/getCartTotal',
      isAuthenticated: 'user/isAuthenticated',
      user: 'user/currentUser',
      savedAddresses: 'user/addresses',
      couponDiscount: 'cart/couponDiscount'
    }),

    // İndirimli toplam
    finalTotal() {
      return Math.max(0, this.cartTotal - this.couponDiscount);
    },

    // Store'dan doğrudan kullanıcı verisini al
    currentUser() {
      return this.$store.state.user.user || this.$store.state.user.currentUser;
    }
  },
  async mounted() {
    // Sepet verilerini önce yenile
    await this.$store.dispatch('cart/fetchCart');
    
    // Şimdi sepet içeriğini kontrol et
    console.log('Checkout sayfası yüklenirken sepet içeriği:', this.cartItems);
    
    // Kullanıcı giriş yapmış mı kontrol et - giriş yapmamışsa login sayfasına yönlendir
    if (!this.isAuthenticated) {
      console.log('Kullanıcı giriş yapmamış, login sayfasına yönlendiriliyor');
      this.$router.push({
        path: '/login',
        query: { 
          redirect: '/checkout',
          message: 'Ödeme yapabilmek için lütfen giriş yapın'
        }
      });
      return;
    }

    // LocalStorage kontrol et
    let userDataFound = false;
    try {
      const userString = localStorage.getItem('user');
      console.log('LocalStorage kontrol - user string:', userString);
      
      if (userString) {
        const userData = JSON.parse(userString);
        if (userData && userData.id) {
          console.log('LocalStorage kontrol - geçerli kullanıcı bulundu:', userData.id);
          userDataFound = true;
        }
      }
    } catch (e) {
      console.error('LocalStorage kontrol hatası:', e);
    }

    // Kullanıcı verilerini store'dan doğrudan kontrol et
    const userFromStore = this.$store.state.user.currentUser || this.$store.state.user.user;
    console.log('Store\'daki kullanıcı verileri:', userFromStore);
    
    if ((!userFromStore || !userFromStore.id) && !userDataFound) {
      console.error('Oturum bilgileri eksik, kullanıcı verisi yüklenemiyor');
      // Oturum verilerini yeniden almayı deneyelim
      try {
        await this.$store.dispatch('user/getProfile');
        console.log('Kullanıcı bilgileri yenilendi:', this.$store.state.user.user);
      } catch (e) {
        console.error('Kullanıcı bilgileri yenilenirken hata:', e);
        this.$router.push('/login');
        return;
      }
    }
    
    // Sepette ürün yoksa sepet sayfasına yönlendir
    if (!this.cartItems || this.cartItems.length === 0) {
      console.log('Sepet boş olduğu için sepet sayfasına yönlendiriliyor');
      this.$router.push('/cart');
      return;
    }
    
    // Kullanıcı bilgilerini kontrol et
    console.log('Kullanıcı giriş yapmış mı:', this.isAuthenticated);
    console.log('Kullanıcı bilgileri:', userFromStore || this.$store.state.user.user);
    
    // Giriş yapmış kullanıcı için adresleri yükle
    if (this.isAuthenticated) {
      await this.loadUserAddresses();
      
      // Adresleri yükledikten sonra varsayılan adresi seç
      if (this.savedAddresses && this.savedAddresses.length > 0) {
        const defaultAddress = this.savedAddresses.find(address => address.isDefault);
        if (defaultAddress) {
          this.selectedAddressId = defaultAddress.id;
        } else {
          this.selectedAddressId = this.savedAddresses[0].id;
        }
      }
      
      // Kullanıcı bilgilerini doldur
      if (userFromStore || this.$store.state.user.user) {
        const userData = userFromStore || this.$store.state.user.user;
        this.checkoutForm.email = userData.email || '';
        this.checkoutForm.phone = userData.phone || '';
      }
    }
    
    // Kargo ücretini hesapla
    this.calculateShippingCost();
  },
  methods: {
    ...mapActions({
      clearCart: 'cart/clearCart',
      getAddresses: 'user/getAddresses'
    }),
    
    // Kullanıcı adreslerini yükle
    async loadUserAddresses() {
      try {
        await this.getAddresses();
        console.log('Kullanıcı adresleri yüklendi:', this.savedAddresses);
      } catch (error) {
        console.error('Adresler yüklenirken hata:', error);
        this.$toast.error('Adresleriniz yüklenirken bir hata oluştu');
      }
    },
    selectAddress(addressId) {
      this.selectedAddressId = addressId;
      this.useNewAddress = false;
    },
    getProductImage(item) {
      // URL kontrolü yap
      if (!item || !item.image) {
        return '/img/product-placeholder.png';
      }

      // Eğer tam URL ise, doğrudan döndür
      if (typeof item.image === 'string' && item.image.startsWith('http')) {
        return item.image;
      }

      // Görsel dizisi ise ilk görseli al
      if (Array.isArray(item.image) && item.image.length > 0) {
        const firstImage = item.image[0];
        if (typeof firstImage === 'string') {
          if (firstImage.startsWith('http')) {
            return firstImage;
          } else {
            try {
              return require(`@/assets/img/${firstImage}`);
            } catch (e) {
              return '/img/product-placeholder.png';
            }
          }
        }
      }

      // Local dosya yolu için require kullan
      try {
        return require(`@/assets/img/${item.image}`);
      } catch (e) {
        return '/img/product-placeholder.png';
      }
    },
    calculateItemPrice(item) {
      if (!item || !item.price) {
        return '0.00';
      }
      
      let price = parseFloat(item.price);
      
      // İndirim varsa uygula
      if (item.discount) {
        price = price - (price * (item.discount / 100));
      }
      
      return price.toFixed(2);
    },
    calculateItemTotal(item) {
      if (!item || !item.price) {
        return '0.00';
      }
      
      let price = parseFloat(item.price);
      
      // İndirim varsa uygula
      if (item.discount) {
        price = price - (price * (item.discount / 100));
      }
      
      return price.toFixed(2);
    },
    calculateShippingCost() {
      // Belli bir tutar üzerinde ücretsiz kargo
      if (this.cartTotal >= 200) {
        this.shippingCost = 0;
      } else {
        this.shippingCost = 30;
      }
      
      // Ödeme yöntemi kapıda ödeme ise ekstra ücret ekle
      if (this.checkoutForm.paymentMethod === 'cash_on_delivery') {
        this.shippingCost += 15;
      }
    },
    validateForm() {
      // Adres seçilmiş mi kontrol et
      if (this.isAuthenticated && !this.useNewAddress && this.savedAddresses.length > 0) {
        if (!this.selectedAddressId) {
          this.$toast.error('Lütfen bir adres seçin');
          return false;
        }
      } else {
        // Yeni adres formu doldurulmuş mu kontrol et
        if (!this.checkoutForm.firstName || 
            !this.checkoutForm.lastName || 
            !this.checkoutForm.city || 
            !this.checkoutForm.district || 
            !this.checkoutForm.zipCode || 
            !this.checkoutForm.address || 
            !this.checkoutForm.phone || 
            !this.checkoutForm.email) {
          this.$toast.error('Lütfen tüm zorunlu alanları doldurun');
          return false;
        }
      }
      
      // Kredi kartı seçildiyse, kart bilgilerini kontrol et
      if (this.checkoutForm.paymentMethod === 'credit_card') {
        if (!this.paymentForm.cardNumber || 
            !this.paymentForm.cardName || 
            !this.paymentForm.expiryDate || 
            !this.paymentForm.cvv) {
          this.$toast.error('Lütfen kart bilgilerini eksiksiz doldurun');
          return false;
        }
      }
      
      return true;
    },
    async placeOrder() {
      if (!this.validateForm()) {
        return;
      }
      
      // Kullanıcı giriş yapmış mı kontrol et
      if (!this.isAuthenticated) {
        console.error('Kullanıcı giriş yapmamış');
        this.$toast.error('Ödeme yapmak için giriş yapmalısınız');
        this.$router.push({
          path: '/login',
          query: { redirect: '/checkout' }
        });
        return;
      }

      // LocalStorage'dan doğrudan kullanıcı bilgisini almayı dene 
      let userId = null;
      try {
        const userStr = localStorage.getItem('user');
        console.log('LocalStorage user string:', userStr);
        
        if (userStr) {
          const userData = JSON.parse(userStr);
          if (userData && userData.id) {
            userId = parseInt(userData.id, 10);
            console.log('LocalStorage\'dan kullanıcı ID alındı:', userId);
          }
        }
      } catch (e) {
        console.error('LocalStorage kullanıcı verisi ayrıştırma hatası:', e);
      }

      // Store'dan kullanıcı verisi almayı dene (eğer localStorage'da yoksa)
      if (!userId) {
        // Kullanıcı kimliğini doğrudan mağazadan al
        const userFromStore = this.$store.state.user.user || this.$store.state.user.currentUser;
        
        console.log('Kullanıcı bilgisi kontrolü:', { 
          storeUser: userFromStore
        });
        
        if (userFromStore && userFromStore.id) {
          userId = parseInt(userFromStore.id, 10);
          console.log('Store\'dan kullanıcı ID alındı:', userId);
        }
      }
      
      if (!userId) {
        console.error('Kullanıcı kimliği bulunamadı. LocalStorage ve store kontrol edildi.');
        this.$toast.error('Oturum bilgileriniz güncel değil, lütfen tekrar giriş yapın');
        this.$router.push('/login');
        return;
      }

      this.isLoading = true;
      
      try {
        // Sepet içeriğini kontrol et
        console.log('cartItems değeri:', this.cartItems);
        console.log('cartItems uzunluğu:', this.cartItems ? this.cartItems.length : 0);
        
        if (!this.cartItems || this.cartItems.length === 0) {
          throw new Error('Sepetiniz boş. Lütfen sepetinize ürün ekleyin.');
        }

        // Adres bilgilerini hazırla - Mevcut adres seçimi veya yeni adres
        let addressId = null;
        
        if (!this.useNewAddress && this.selectedAddressId) {
          // Mevcut adresi kullan
          addressId = this.selectedAddressId;
        } else if (this.useNewAddress || this.savedAddresses.length === 0) {
          // Yeni adres kullanılıyorsa veya hiç adres yoksa, önce adresi kaydet
          if (!this.checkoutForm.firstName || !this.checkoutForm.lastName || 
              !this.checkoutForm.address || !this.checkoutForm.city || 
              !this.checkoutForm.district || !this.checkoutForm.zipCode ||
              !this.checkoutForm.phone || !this.checkoutForm.email) {
            throw new Error('Lütfen adres bilgilerini eksiksiz doldurun');
          }
          
          try {
            // Yeni adres oluştur
            const newAddress = {
              userId: userId,
              title: `${this.checkoutForm.firstName} ${this.checkoutForm.lastName}`,
              fullName: `${this.checkoutForm.firstName} ${this.checkoutForm.lastName}`,
              phone: this.checkoutForm.phone,
              addressDetail: this.checkoutForm.address,
              city: this.checkoutForm.city,
              district: this.checkoutForm.district,
              zipCode: this.checkoutForm.zipCode,
              country: this.checkoutForm.country || 'TR',
              isDefault: this.savedAddresses.length === 0 // İlk adres ise varsayılan yap
            };
            
            console.log('Yeni adres kaydediliyor:', newAddress);
            
            // Adresi API'ye gönder
            const savedAddress = await this.$axios.$post('/api/addresses', newAddress);
            console.log('Yeni adres kaydedildi:', savedAddress);
            
            // Kaydedilen adresin ID'sini kullan
            if (savedAddress && savedAddress.id) {
              addressId = savedAddress.id;
              
              // Kullanıcı adreslerini yenile
              await this.getAddresses();
            } else {
              throw new Error('Adres kaydedilemedi');
            }
          } catch (error) {
            console.error('Adres kaydedilirken hata:', error);
            throw new Error('Adres kaydedilemedi: ' + (error.message || 'Bilinmeyen hata'));
          }
        } else {
          throw new Error('Lütfen bir adres seçin veya yeni adres ekleyin');
        }
        
        if (!addressId) {
          throw new Error('İşlem için geçerli bir adres bilgisi sağlanamadı');
        }
        
        // Sipariş kalemlerini hazırla
        const orderItems = this.cartItems.map(item => ({
          productId: parseInt(item.id),
          quantity: parseInt(item.quantity) || 1,
          size: item.selectedSize || item.size || null,
          color: item.selectedColor || item.color || null
        }));
        
        // Sipariş nesnesi oluştur
        const orderData = {
          // Kullanıcı ID - localStorage veya store'dan alınıyor
          userId: userId, 
          
          // Adres ID - tip dönüşümü ile
          addressId: parseInt(addressId, 10),
          
          // Ödeme bilgileri
          paymentMethod: this.checkoutForm.paymentMethod,
          
          // Uygulanan kupon
          couponCode: this.$store.state.cart.couponCode || null,
          
          // Sipariş ürünleri
          orderItems: orderItems
        };
        
        // Detaylı loglama ile kontrol et
        console.log("Sipariş verileri (Tip kontrolleri):", {
          userId: {
            value: userId,
            type: typeof userId,
            parsed: parseInt(userId, 10),
            parsedType: typeof parseInt(userId, 10)
          },
          addressId: {
            value: addressId,
            type: typeof addressId,
            parsed: parseInt(addressId, 10),
            parsedType: typeof parseInt(addressId, 10)
          },
          orderData
        });
        
        // Sipariş oluştur
        const response = await this.$store.dispatch('order/createOrder', orderData);
        console.log("API Yanıtı:", JSON.stringify(response, null, 2));
        
        if (response && response.id) {
          // Başarılı sipariş
          await this.$store.dispatch('cart/clearCart');
          
          // Sipariş tamamlandı sayfasına yönlendir
          this.$router.push({
            path: '/order-success',
            query: { 
              order_id: response.id
            }
          });
          
          this.$toast.success('Siparişiniz başarıyla oluşturuldu');
        } else {
          throw new Error('Sipariş oluşturulamadı. API yanıtı: ' + JSON.stringify(response));
        }
      } catch (error) {
        let errorMessage = error.message || 'Bilinmeyen hata';
        
        if (error.response && error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          console.error('API Hata Yanıtı:', error.response.data);
        }
        
        this.$toast.error(`Sipariş oluşturulurken hata: ${errorMessage}`);
        console.error('Order error details:', error);
      } finally {
        this.isLoading = false;
      }
    },
    getOrderAddress() {
      // Eğer kayıtlı adres seçildiyse
      if (this.isAuthenticated && !this.useNewAddress && this.selectedAddressId) {
        const selectedAddress = this.savedAddresses.find(addr => addr.id === this.selectedAddressId);
        if (selectedAddress) {
          return {
            fullName: selectedAddress.title || `${selectedAddress.firstName || ''} ${selectedAddress.lastName || ''}`,
            phone: selectedAddress.phone,
            email: this.user?.email || selectedAddress.email,
            address: selectedAddress.addressDetail || selectedAddress.address,
            city: selectedAddress.city,
            district: selectedAddress.district,
            zipCode: selectedAddress.zipCode,
            country: 'TR'
          };
        }
      }
      
      // Yeni adres için
      return {
        fullName: `${this.checkoutForm.firstName} ${this.checkoutForm.lastName}`,
        phone: this.checkoutForm.phone,
        email: this.checkoutForm.email,
        address: this.checkoutForm.address,
        city: this.checkoutForm.city,
        district: this.checkoutForm.district,
        zipCode: this.checkoutForm.zipCode,
        country: this.checkoutForm.country || 'TR'
      };
    }
  },
  watch: {
    // Ödeme yöntemini izle
    'checkoutForm.paymentMethod': function() {
      this.calculateShippingCost();
    },
    
    // Sepeti izle, değişirse hesaplamaları güncelle
    cartItems: {
      handler(newVal, oldVal) {
        console.log('Sepet değişti:', newVal);
        // Eğer sepet boşsa, sepet sayfasına yönlendir
        if (!newVal || newVal.length === 0) {
          this.$router.push('/cart');
        }
        this.calculateShippingCost();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.order_summary_content {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.order_items {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.order_item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.order_item:last-child {
  border-bottom: none;
}

.product_thumb {
  width: 60px;
  height: 60px;
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 15px;
}

.product_thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product_info h4 {
  font-size: 14px;
  margin: 0 0 5px 0;
}

.product_info p {
  font-size: 12px;
  color: #777;
  margin: 0 0 5px 0;
}

.cart_pro_qty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.cart_subtotal, .cart_total {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid #eee;
}

.cart_total {
  font-weight: bold;
  border-top: 2px solid #ddd;
}

.cart_amount {
  color: #f79837;
}

.payment_methods_content {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.payment_option {
  margin-bottom: 10px;
}

.payment_info {
  font-size: 12px;
  color: #777;
  padding-left: 25px;
  margin-top: 5px;
}

.address-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  height: 100%;
}

.address-card:hover {
  border-color: #aaa;
}

.address-card.selected {
  border-color: #f79837;
  box-shadow: 0 0 0 2px rgba(247, 152, 55, 0.2);
}

.default-badge {
  background-color: #e7f7ee;
  color: #28a745;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 30px;
}

.card_icons i {
  font-size: 20px;
  color: #6c757d;
}

.empty_cart_area {
  background-color: #f9f9f9;
  border-radius: 8px;
}
</style> 