<template>
  <b-offcanvas id="offcanvasRight" placement="end" title="Alışveriş Sepeti">
    <div class="mini-cart-product-area cart-product-area">
      <template v-if="isCartLoading">
        <div class="text-center p-5">
          <div class="spinner-border" role="status">
            <span class="sr-only">Yükleniyor...</span>
          </div>
          <p class="mt-2">Sepet Yükleniyor...</p>
        </div>
      </template>
      <template v-else-if="cartItems.length === 0">
        <div class="text-center empty-cart p-4">
          <i class="fas fa-shopping-cart fa-3x mb-3"></i>
          <p>Sepetinizde ürün bulunmuyor.</p>
          <button 
            class="theme-btn-one btn-black-overlay btn_sm" 
            @click="closeCanvas">
            Alışverişe Devam Et
          </button>
        </div>
      </template>
      <template v-else>
        <div class="cart-product" v-for="item in cartItems" :key="`mini-${item.id}-${item.selectedSize}-${item.selectedColor}`">
          <div class="cart-product-img">
            <img :src="getProductImage(item)" :alt="item.title" class="img-fluid">
          </div>
          <div class="cart-product-content">
            <h4>{{ item.title }}</h4>
            <div class="product-variants">
              <span v-if="item.selectedSize" class="variant-item size">{{ item.selectedSize }}</span>
              <span 
                v-if="item.selectedColor" 
                class="variant-item color"
                :style="{ backgroundColor: getColorHex(item.selectedColor) }"
                :title="item.selectedColor">
              </span>
            </div>
            <div class="cart-product-info">
              <div class="cart-product-price">
                <span>₺{{ calculateItemPrice(item) }}</span>
                <span class="quantity">× {{ item.cartQuantity }}</span>
              </div>
              <div class="cart-product-remove">
                <button @click="removeCartItem(item)" class="remove-btn">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="mini-cart-footer" v-if="cartItems.length > 0">
      <div class="mini-cart-total">
        <div class="mini-total-title">
          <span class="fw-bold">Toplam:</span>
          <span class="mini-total-price">₺{{ cartTotal.toFixed(2) }}</span>
        </div>
      </div>
      <div class="mini-cart-actions">
        <nuxt-link to="/cart" class="btn-block theme-btn-one border-btn-one btn_sm mb-2" @click="closeCanvas">
          Sepete Git
        </nuxt-link>
        <nuxt-link to="/checkout" class="btn-block theme-btn-one btn-black-overlay btn_sm">
          Ödeme Yap
        </nuxt-link>
      </div>
    </div>
  </b-offcanvas>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "CartCanvas",
  computed: {
    ...mapGetters({
      cartItems: 'cart/cartItems',
      cartTotal: 'cart/cartTotal',
      cartQty: 'cart/cartQty',
      isCartLoading: 'cart/isCartLoading',
      cartError: 'cart/cartError'
    })
  },
  methods: {
    ...mapActions({
      removeFromCart: 'cart/removeFromCart'
    }),
    
    getProductImage(item) {
      if (!item) return "https://via.placeholder.com/300x300";
      
      if (item.image) {
        return item.image;
      } else if (item.images && item.images.length > 0 && item.images[0].src) {
        return item.images[0].src;
      } else {
        return "https://via.placeholder.com/300x300";
      }
    },
    
    calculateItemPrice(item) {
      if (!item) return 0;
      
      if (item.isSale) {
        return (item.price - (item.price * item.discount / 100)).toFixed(2);
      }
      
      return item.price.toFixed(2);
    },
    
    removeCartItem(item) {
      try {
        console.log("Sepetten kaldırılacak ürün:", item);
        
        if (!item || !item.id) {
          console.error("Geçersiz ürün bilgisi");
          return;
        }
        
        // Ürün bilgisini hazırla
        const productToRemove = {
          id: item.id,
          size: item.size || undefined,
          color: item.color || undefined
        };
        
        // Store action'ını çağır
        this.removeFromCart(productToRemove)
          .then(() => {
            this.$notify({
              title: 'Ürün Kaldırıldı',
              text: `${item.title} sepetten kaldırıldı.`,
              type: 'success'
            });
          })
          .catch(error => {
            console.error("Ürün kaldırma hatası:", error);
            this.$notify({
              title: 'Hata',
              text: 'Ürün kaldırılırken bir hata oluştu.',
              type: 'error'
            });
          });
      } catch (error) {
        console.error("RemoveCartItem işleminde hata:", error);
      }
    },
    
    closeCanvas() {
      this.$root.$emit('bv::hide::offcanvas', 'offcanvasRight')
    },
    
    getColorHex(colorName) {
      if (!colorName) return '#ddd';
      
      const colorMap = {
        'Red': '#ff5252',
        'Blue': '#2196f3',
        'Green': '#4caf50',
        'Black': '#000000',
        'White': '#ffffff',
        'Yellow': '#ffeb3b',
        'Orange': '#ff9800',
        'Purple': '#9c27b0',
        'Pink': '#e91e63',
        'Gray': '#9e9e9e'
      };
      
      return colorMap[colorName] || '#ddd';
    },

    async removeItemFromMinicart(item) {
      try {
        console.log("Sepetten ürün siliniyor:", item);
        const productToRemove = {
          id: item.id,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        };
        
        await this.$store.dispatch('cart/removeFromCart', productToRemove);
        this.$toast.success('Ürün sepetten kaldırıldı');
      } catch (error) {
        console.error("Sepetten ürün silme hatası:", error);
        this.$toast.error('Ürün sepetten kaldırılamadı');
      }
    }
  }
}
</script>

<style scoped>
.mini-cart-product-area {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 5px;
}

.cart-product {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.cart-product-img {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  overflow: hidden;
}

.cart-product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-product-content {
  flex: 1;
}

.cart-product-content h4 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.product-variants {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 8px;
}

.variant-item.size {
  font-size: 11px;
  padding: 1px 6px;
  background: #f0f0f0;
  border-radius: 3px;
}

.variant-item.color {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #ddd;
}

.cart-product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cart-product-price {
  font-size: 14px;
  font-weight: 500;
}

.quantity {
  color: #666;
  margin-left: 5px;
}

.remove-btn {
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.remove-btn:hover {
  color: #ff5252;
}

.mini-cart-footer {
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
}

.mini-cart-total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.mini-total-title {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.mini-total-price {
  font-weight: 600;
}

.empty-cart {
  color: #666;
}

.empty-cart i {
  color: #ccc;
}
</style> 