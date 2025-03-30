<template>
  <div>
    <!-- Banner Area -->
    <section id="common_banner_one">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="common_banner_text">
              <h2>{{ this.title }}</h2>
              <b-breadcrumb
                :items="breadcrumbItems"
                class="bg-transparent"
              ></b-breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cart-Area -->
    <section id="cart_area_one" class="ptb-100">
      <div class="container">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12 col-12">
            <div class="table_desc">
              <div class="cart_page table-responsive">
                <!-- Sepet yükleniyor -->
                <div v-if="isCartLoading" class="text-center p-5">
                  <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Yükleniyor...</span>
                  </div>
                  <p class="mt-2">Sepet yükleniyor...</p>
                </div>
                
                <!-- Sepet boş -->
                <div v-else-if="cart.length === 0" class="text-center p-5">
                  <div class="empty-cart-container">
                    <i class="fas fa-shopping-cart fa-4x mb-4" style="color: #ccc;"></i>
                    <h3>Sepetiniz boş</h3>
                    <p>Henüz sepetinize ürün eklemediniz.</p>
                    <nuxt-link to="/shop" class="theme-btn-one btn-black-overlay btn_sm">
                      Alışverişe Başla
                    </nuxt-link>
                  </div>
                </div>
                
                <!-- Sepet dolu -->
                <table v-else>
                  <thead>
                    <tr>
                      <th class="product_thumb">Ürün Görseli</th>
                      <th class="product_name">Ürün</th>
                      <th class="product-price">Fiyat</th>
                      <th class="product_quantity">Adet</th>
                      <th class="product_total">Toplam</th>
                      <th class="product_remove">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in cart" :key="`${item.id}-${item.selectedColor}-${item.selectedSize}`">
                      <td class="product_thumb">
                        <nuxt-link :to="`/product/${item.id}`">
                          <img :src="item.image" :alt="item.title">
                        </nuxt-link>
                      </td>
                      <td class="product_name">
                        <nuxt-link :to="`/product/${item.id}`">{{ item.title }}</nuxt-link>
                        <div class="product-variants">
                          <span v-if="item.selectedSize" class="variant-item">
                            <strong>Beden:</strong> {{ item.selectedSize }}
                          </span>
                          <span v-if="item.selectedColor" class="variant-item">
                            <strong>Renk:</strong> 
                            <span 
                              class="color-dot" 
                              :style="{ backgroundColor: getColorHex(item.selectedColor) }"
                              :title="item.selectedColor">
                            </span>
                          </span>
                        </div>
                      </td>
                      <td class="product-price">
                        <span v-if="item.discountPrice" class="old-price">₺{{ item.price }}</span>
                        ₺{{ calculateItemPrice(item) }}
                      </td>
                      <td class="product_quantity">
                        <div class="quantity-control">
                          <button 
                            class="qty-btn" 
                            @click="decrementQuantity(item)"
                            :disabled="item.quantity <= 1">
                            <i class="fas fa-minus"></i>
                          </button>
                          <input 
                            type="number" 
                            min="1" 
                            max="10" 
                            v-model.number="item.quantity" 
                            @change="updateCartItem({
                              id: item.id,
                              selectedSize: item.selectedSize,
                              selectedColor: item.selectedColor,
                              quantity: item.quantity
                            })">
                          <button 
                            class="qty-btn" 
                            @click="incrementQuantity(item)"
                            :disabled="item.quantity >= 10">
                            <i class="fas fa-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td class="product_total">₺{{ calculateItemTotal(item) }}</td>
                      <td class="product_remove">
                        <button 
                          class="theme-btn-one bg-danger btn_sm" 
                          @click="removeItem(item)" 
                          title="Ürünü sepetten kaldır">
                          <i class="fa fa-trash-o"></i> Sil
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="cart_submit" v-if="cart.length > 0">
                <button class="theme-btn-one btn-black-overlay btn_sm" @click="clearCartItems">Sepeti Temizle</button>
              </div>
            </div>
          </div>
          <div class="row">
              <div class="col-lg-6 col-md-6">
                  <!-- Kupon Kodu -->
                  <div class="coupon_code mt-3">
                      <h3>Kupon</h3>
                      <div class="coupon_inner">
                          <p>Kupon kodunuz varsa uygulayın.</p>
                          <input 
                            class="mb-2" 
                            placeholder="Kupon Kodu" 
                            type="text"
                            v-model="couponCode">
                          <div v-if="couponError" class="coupon-error-message mb-2">
                            {{ couponError }}
                          </div>
                          <div v-if="appliedCoupon" class="coupon-success-message mb-2">
                            <div class="coupon-details">
                              <p class="coupon-title">{{ appliedCoupon.description }}</p>
                              <p class="coupon-value">
                                {{ appliedCoupon.discountType === 1 ? `₺${appliedCoupon.discountValue}` : `%${appliedCoupon.discountValue}` }}
                                indirim
                              </p>
                            </div>
                            <button 
                              type="button" 
                              class="btn-remove-coupon" 
                              @click="removeCoupon">
                              <i class="fas fa-times"></i>
                            </button>
                          </div>
                          <button 
                            type="button" 
                            class="theme-btn-one btn-black-overlay btn_sm"
                            @click="applyCoupon"
                            :disabled="loading || !!appliedCoupon">
                            {{ loading ? 'İşleniyor...' : 'Kupon Uygula' }}
                          </button>
                      </div>
                  </div>
              </div>
              <div class="col-lg-6 col-md-6">
                  <!-- Sepet Özeti -->
                  <div class="coupon_code mt-3">
                      <h3>Sepet Özeti</h3>
                      <div class="coupon_inner">
                          <div class="cart_subtotal">
                              <p>Ara Toplam</p>
                              <p class="cart_amount">₺{{ cartTotal.toFixed(2) }}</p>
                          </div>
                          <div class="cart_subtotal" v-if="cart.length > 0">
                              <p>Kargo</p>
                              <p class="cart_amount">Ücretsiz Kargo</p>
                          </div>
                          <div class="cart_subtotal" v-if="cart.length > 0">
                              <p>Toplam Ürün</p>
                              <p class="cart_amount">{{ cartQty }} adet</p>
                          </div>
                          <div class="cart_subtotal" v-if="couponDiscount > 0">
                              <p>Kupon İndirimi</p>
                              <p class="cart_amount discount-amount">-₺{{ couponDiscount.toFixed(2) }}</p>
                          </div>
                          <div class="cart_subtotal">
                              <p>Genel Toplam</p>
                              <p class="cart_amount">₺{{ finalTotal.toFixed(2) }}</p>
                          </div>
                          <div class="checkout_btn" v-if="cart.length > 0">
                              <nuxt-link 
                                :to="isAuthenticated ? '/checkout' : '/login?redirect=/checkout'" 
                                class="theme-btn-one btn-black-overlay btn_sm"
                                @click.native="proceedToCheckout">
                                Ödemeye Geç
                              </nuxt-link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kullanıcı Giriş Öneri Alanı -->
    <section id="login_suggestion" class="pb-100" v-if="cart.length > 0 && !isAuthenticated">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="login_suggestion_box">
              <div class="row align-items-center">
                <div class="col-lg-8 col-md-7">
                  <div class="login_suggestion_content">
                    <i class="fas fa-user-circle"></i>
                    <h3>Daha hızlı alışveriş için giriş yapın</h3>
                    <p>Giriş yaparak siparişlerinizi takip edebilir, adreslerinizi kaydedebilir ve daha hızlı ödeme yapabilirsiniz.</p>
                    <div class="login_benefits">
                      <div class="benefit_item">
                        <i class="fas fa-history"></i>
                        <span>Sipariş Geçmişi</span>
                      </div>
                      <div class="benefit_item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>Kayıtlı Adresler</span>
                      </div>
                      <div class="benefit_item">
                        <i class="fas fa-heart"></i>
                        <span>Favori Ürünler</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 col-md-5">
                  <div class="login_action_buttons">
                    <nuxt-link to="/login?redirect=/cart" class="theme-btn-one bg-black btn_md">Giriş Yap</nuxt-link>
                    <nuxt-link to="/register" class="theme-btn-two bg-white btn_md">Hesap Oluştur</nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kullanıcı Önerileri -->
    <section id="user_recommendations" class="pb-100" v-if="cart.length > 0 && isAuthenticated && userWishlist.length > 0">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center_heading">
              <h2>Favorilerinizden Ürünler</h2>
              <p>Beğendiğiniz diğer ürünlere göz atın</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-lg-3 col-md-4 col-sm-6 col-12"
            v-for="(product, index) in userWishlist.slice(0, 4)"
            :key="index"
          >
            <ProductBox1
              :product="product"
              :index="index"
              @showalert="alert"
              @alertseconds="alert"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProductBox1 from '~/components/product-box/ProductBox1'

export default {
    name: "CartPage",
    components: {
      ProductBox1
    },
    head() {
        return {
            title: this.title,
            meta: [
                {
                    hid: "description",
                    name: "description",
                    content: "Cart page - AndShop Ecommerce Vue js, Nuxt js Template",
                },
            ],
        };
    },
    data() {
        return {
            title: "Sepetim",
            breadcrumbItems: [
                {
                    text: 'Anasayfa',
                    to: '/'
                },
                {
                    text: 'Sepetim',
                    active: true
                }
            ],
            updateTimeout: null,
            dismissCountDown: 0,
            dismissSecs: 3,
            couponCode: '',
            couponError: '',
            appliedCoupon: null,
            loading: false
        }
    },
    computed: {
        ...mapGetters({
            cart: "cart/getCartItems",
            cartQty: 'cart/cartQty',
            cartTotal: 'cart/cartTotal',
            isCartLoading: 'cart/isCartLoading',
            isAuthenticated: "user/isAuthenticated",
            user: 'user/currentUser',
            userWishlist: 'products/wishlistItems',
            couponDiscount: 'cart/couponDiscount',
            coupon: 'cart/coupon'
        }),
        
        finalTotal() {
            // Kupon indirimi varsa, toplam tutardan indirimi çıkar
            return Math.max(0, this.cartTotal - this.couponDiscount);
        }
    },
    methods: {
        ...mapActions({
            fetchCart: 'cart/fetchCart',
            removeFromCart: 'cart/removeFromCart',
            updateCartItem: 'cart/updateCartItem',
            clearCart: 'cart/clearCart',
            proceedToCheckout: 'cart/proceedToCheckout'
        }),
        
        calculateItemPrice(item) {
            // Eğer üründe indirimli fiyat varsa onu göster
            if (item.discountPrice) {
                return item.discountPrice.toFixed(2);
            }
            
            return item.price.toFixed(2);
        },
        
        calculateItemTotal(item) {
            const itemPrice = parseFloat(this.calculateItemPrice(item));
            return (itemPrice * item.quantity).toFixed(2);
        },
        
        async incrementQuantity(item) {
            if (item.quantity < 10) {
                try {
                    const newQty = item.quantity + 1;
                    await this.$store.dispatch('cart/updateCartItem', {
                        id: item.id,
                        quantity: newQty,
                        size: item.selectedSize,
                        color: item.selectedColor
                    });
                    this.$toast.success('Ürün miktarı güncellendi');
                } catch (error) {
                    console.error('Miktar artırma hatası:', error);
                    this.$toast.error('Miktar artırılırken bir hata oluştu');
                }
            }
        },
        
        async decrementQuantity(item) {
            if (item.quantity > 1) {
                try {
                    const newQty = item.quantity - 1;
                    await this.$store.dispatch('cart/updateCartItem', {
                        id: item.id,
                        quantity: newQty,
                        size: item.selectedSize,
                        color: item.selectedColor
                    });
                    this.$toast.success('Ürün miktarı güncellendi');
                } catch (error) {
                    console.error('Miktar azaltma hatası:', error);
                    this.$toast.error('Miktar azaltılırken bir hata oluştu');
                }
            }
        },
        
        async removeItem(item) {
            try {
                await this.removeFromCart(item);
                this.$toast.success('Ürün sepetten kaldırıldı');
            } catch (error) {
                this.$toast.error('Ürün kaldırılırken bir hata oluştu');
            }
        },
        
        async clearCartItems() {
            try {
                await this.clearCart();
                this.$toast.success('Sepet temizlendi');
            } catch (error) {
                this.$toast.error('Sepet temizlenirken bir hata oluştu');
            }
        },
        
        getColorHex(colorName) {
            const colorMap = {
                'red': '#ff0000',
                'green': '#00ff00',
                'blue': '#0000ff',
                'yellow': '#ffff00',
                'black': '#000000',
                'white': '#ffffff',
                'purple': '#800080',
                'orange': '#ffa500',
                'pink': '#ffc0cb',
                'gray': '#808080',
                'brown': '#a52a2a'
            };
            
            return colorMap[colorName?.toLowerCase()] || '#cccccc';
        },
        
        alert(dismissCountDown) {
            this.dismissCountDown = dismissCountDown;
        },
        
        async applyCoupon() {
            this.loading = true;
            console.log('Kupon uygulama başlıyor:', this.couponCode);
            
            try {
                const response = await this.$store.dispatch('cart/applyCoupon', { code: this.couponCode });
                console.log('Kupon uygulaması sonucu:', response);
                
                if (response.success) {
                    this.couponCode = '';
                    this.couponError = '';
                    this.appliedCoupon = response.data;
                    this.$toast.success('Kupon uygulandı');
                } else {
                    this.couponError = response.message;
                    this.$toast.error(response.message || 'Kupon uygulanamadı');
                }
            } catch (error) {
                console.error('Kupon uygulanırken hata oluştu:', error);
                this.couponError = 'Kupon uygulanırken bir hata oluştu';
                this.$toast.error('Kupon uygulanırken bir hata oluştu');
            } finally {
                this.loading = false;
            }
        },
        
        async removeCoupon() {
            try {
                const response = await this.$store.dispatch('cart/removeCoupon');
                console.log('Kupon kaldırma sonucu:', response);
                
                this.appliedCoupon = null;
                this.$toast.success('Kupon kaldırıldı');
            } catch (error) {
                console.error('Kupon kaldırılırken hata:', error);
                this.couponError = 'Kupon kaldırılırken bir hata oluştu';
                this.$toast.error('Kupon kaldırılırken bir hata oluştu');
            }
        }
    },
    created() {
        // Sayfa yüklendiğinde sepeti getir
        this.fetchCart();
    },
    mounted() {
        // Sepet verilerini yükle
        this.$store.dispatch('cart/fetchCart')
          .then(result => {
            console.log('Sepet verileri yüklendi:', this.$store.getters['cart/getCartItems']);
          })
          .catch(error => {
            console.error('Sepet verileri yüklenemedi:', error);
          });
    }
}
</script>

<style scoped>
.empty-cart-container {
    padding: 40px 0;
}

/* Ürün resmi için stil ekle */
.product_thumb {
    width: 100px;
}

.product_thumb img {
    max-width: 80px;
    max-height: 80px;
    width: auto;
    height: auto;
    object-fit: contain;
}

.quantity-control {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 120px;
    margin: 0 auto;
}

.quantity-control input[type="number"] {
    width: 40px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 0;
    height: 36px;
    padding: 0;
    -moz-appearance: textfield; /* Firefox */
}

/* Chrome, Safari, Edge için sayı inputundaki okları kaldır */
.quantity-control input[type="number"]::-webkit-inner-spin-button,
.quantity-control input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.quantity-control .qty-btn {
    width: 36px;
    height: 36px;
    border: 1px solid #ddd;
    background: #f5f5f5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
}

.quantity-control .qty-btn:hover {
    background: #e9e9e9;
}

.quantity-control .qty-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.product-variants {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 5px;
    font-size: 13px;
}

.variant-item {
    padding: 2px 8px;
    background-color: #f9f9f9;
    border-radius: 3px;
    display: flex;
    align-items: center;
    gap: 5px;
}

.color-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #ddd;
    display: inline-block;
}

.old-price {
    text-decoration: line-through;
    color: #999;
    margin-right: 5px;
    font-size: 0.9em;
}

/* Sepet tablosu için genel stiller */
table {
    width: 100%;
    border-collapse: collapse;
}

table th, table td {
    padding: 15px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #eee;
}

table th {
    font-weight: 600;
    background-color: #f9f9f9;
}

.product_name {
    text-align: left;
    width: 30%;
}

.product-price, .product_total {
    width: 15%;
}

.product_quantity {
    width: 20%;
}

.product_remove {
    width: 10%;
}

.product_remove a {
    color: #ff0000;
    font-size: 18px;
}

.product_remove a:hover {
    color: #cc0000;
}

/* Kullanıcı Giriş Öneri Kutusu */
.login_suggestion_box {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
  position: relative;
  overflow: hidden;
}

.login_suggestion_box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #f79837, #f15a29);
}

.login_suggestion_content {
  padding-right: 20px;
}

.login_suggestion_content i {
  font-size: 48px;
  color: #f79837;
  margin-bottom: 15px;
  display: block;
}

.login_suggestion_content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.login_suggestion_content p {
  color: #666;
  margin-bottom: 20px;
}

.login_benefits {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.benefit_item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.benefit_item i {
  font-size: 20px;
  color: #f79837;
  margin: 0;
}

.benefit_item span {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.login_action_buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  height: 100%;
}

@media (max-width: 767px) {
  .login_suggestion_box {
    padding: 30px 20px;
  }
  
  .login_suggestion_content {
    text-align: center;
    padding-right: 0;
    margin-bottom: 30px;
  }
  
  .login_benefits {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .login_action_buttons {
    align-items: center;
  }
}

/* Kullanıcı Önerileri Bölümü */
#user_recommendations {
  margin-top: 30px;
}

/* Kupon stilleri */
.coupon-error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-bottom: 10px;
    padding: 8px;
    background-color: rgba(231, 76, 60, 0.1);
    border-radius: 4px;
}

.coupon-success-message {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(46, 204, 113, 0.1);
    padding: 10px;
    border-radius: 4px;
    border-left: 3px solid #2ecc71;
}

.coupon-details {
    display: flex;
    flex-direction: column;
}

.coupon-title {
    font-weight: 600;
    margin: 0;
    font-size: 14px;
}

.coupon-value {
    font-size: 13px;
    color: #27ae60;
    margin: 3px 0 0 0;
}

.btn-remove-coupon {
    background: none;
    border: none;
    color: #7f8c8d;
    cursor: pointer;
    font-size: 16px;
}

.btn-remove-coupon:hover {
    color: #e74c3c;
}

.discount-amount {
    color: #e74c3c !important;
    font-weight: 600;
}
</style>