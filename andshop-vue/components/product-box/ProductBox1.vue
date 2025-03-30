<template>
  <div>
    <div class="product_wrappers_one" :class="{'list-view': viewMode === 'list', 'in-wishlist': isInWishlist}">
      <div class="thumb">
        <nuxt-link :to="`/product/${product.id}`" class="image">
          <img
            :src="getProductImage(product)"
            :alt="product.title"
          />
          <!-- Hover image'ı kaldıralım -->
        </nuxt-link>
        <span class="badges">
          <span class="new" v-if="product.new">Yeni</span>
          <span class="hot" v-else-if="product.hot">Hot</span>
          <span class="discount" v-else-if="hasDiscount && product.discount">-%{{ parseFloat(product.discount).toFixed(0) }}</span>
          <span class="discount" v-else-if="hasDiscount && product.discountPrice">İndirim</span>
          <span class="" v-else></span>
        </span>
        <div class="actions">
          <button
            @click="addToWishlist(product)"
            class="action wishlist"
            title="Favorilere Ekle"
          >
            <i :class="isInWishlist ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
          <button
            id="toggle-btn"
            @click="toggleModal"
            class="action quickview"
            title="Hızlı Bakış"
          >
            <i class="fas fa-expand"></i>
          </button>
        </div>
        <button
          @click="addToCart(product)"
          class="add-to-cart offcanvas-toggle"
          title="Sepete Ekle"
        >
          Sepete Ekle
        </button>
      </div>

      <div class="content">
        <h5 class="title text-capitalize">
          <nuxt-link :to="`/product/${product.id}`">{{
            product.title
          }}</nuxt-link>
        </h5>
        <span class="price">
          <span v-if="hasDiscount">
            <span class="new">₺{{ formattedDiscountPrice }}</span>
            <del class="old">₺{{ parseFloat(product.price).toFixed(2) }}</del>
          </span>
          <span class="new" v-else>₺{{ parseFloat(product.price).toFixed(2) }}</span>
        </span>
        <p v-if="viewMode === 'list'" class="product-description">
          {{ truncateDescription(product.description) }}
        </p>
        <div v-if="viewMode === 'list'" class="list-view-actions">
          <button
            @click="addToCart(product)"
            class="theme-btn-one bg-black btn_sm"
            title="Add To Cart"
          >
            Sepete Ekle
          </button>
          <button
            @click="addToWishlist(product)"
            class="list-wishlist-btn"
            title="Favorilere Ekle"
          >
            <i :class="isInWishlist ? 'fas fa-heart' : 'far fa-heart'"></i> 
            {{ isInWishlist ? 'Favorilerden Çıkar' : 'Favorilere Ekle' }}
          </button>
        </div>
      </div>

      <!-- Modal Area Start-->
      <div>
        <b-modal
          ref="product-details-popup"
          centered
          hide-footer
          title="Using Component Methods"
          class="product_one_modal_top"
          id="product_slider_one"
        >
          <template #modal-header="{ close }">
            <button
              type="button"
              class="close close_modal_icon"
              @click="close()"
            >
              <span aria-hidden="true"><i class="fas fa-times"></i></span>
            </button>
          </template>

          <div>
            <div class="row">
              <div class="col-lg-5 col-md-6 col-sm-12 col-12">
                <div class="products_modal_sliders">
                  <div v-swiper:mySwiper="swiperOption">
                    <div class="swiper-wrapper">
                      <!-- Ürün resimleri güvenli erişim -->
                      <template v-if="product.images && product.images.length > 0">
                        <div
                          class="swiper-slide"
                          v-for="(imag, index) in product.images"
                          :key="index"
                        >
                          <img
                            :src="getImageUrl(imag.src)"
                            :id="imag.image_id"
                            class="img-fluid bg-img"
                            :alt="imag.alt || product.title"
                          />
                        </div>
                      </template>
                      <template v-else>
                        <div class="swiper-slide">
                          <img
                            :src="getProductImage(product)"
                            class="img-fluid bg-img"
                            :alt="product.title"
                          />
                        </div>
                      </template>
                      <!-- Hiç resim yoksa varsayılan resmi göster -->
                      <div v-else class="swiper-slide">
                        <img
                          src="https://via.placeholder.com/300x300"
                          class="img-fluid bg-img"
                          alt="Ürün resmi bulunamadı"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-lg-7 col-md-6 col-sm-12 col-12">
                <div class="modal_product_content_one">
                  <h3 class="text-capitalize">{{ product.title }}</h3>
                  <div v-if="product.rating == 5" class="reviews_rating">
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <span>(5 Customer Review)</span>
                  </div>
                  <div v-else-if="product.rating == 4" class="reviews_rating">
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star"></i>
                    <span>(4 Customer Review)</span>
                  </div>
                  <div v-else-if="product.rating == 3" class="reviews_rating">
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>(3 Customer Review)</span>
                  </div>
                  <div v-else-if="product.rating == 2" class="reviews_rating">
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>(2 Customer Review)</span>
                  </div>
                  <div v-else-if="product.rating == 1" class="reviews_rating">
                    <i class="fas fa-star active"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <span>(1 Customer Review)</span>
                  </div>
                  <div v-else class="product-review">
                    <span>No Rating</span>
                  </div>

                  <div class="price-block">
                    <h4 v-if="hasDiscount">
                      <span class="current-price">₺{{ formattedDiscountPrice }}</span>
                      <del class="old-price">₺{{ parseFloat(product.price).toFixed(2) }}</del>
                      <span class="discount-badge" v-if="product.discount">-{{ product.discount }}%</span>
                    </h4>
                    <h4 v-else>₺{{ parseFloat(product.price).toFixed(2) }}</h4>
                  </div>

                  <p>{{ product.description }}</p>
                  <div class="variable-single-item" v-if="product.variants && product.variants.length > 0">
                    <span>Color</span>
                    <ul class="color-variant d-flex">
                      <li
                        v-bind:class="{ active: activeColor == variant }"
                        v-for="(variant, variantIndex) in Color(
                          product.variants
                        )"
                        :key="variantIndex"
                      >
                        <a
                          :class="[variant]"
                          v-bind:style="{ 'background-color': variant }"
                          @click="
                            sizeVariant(
                              product.variants[variantIndex].image_id,
                              variantIndex,
                              variant
                            )
                          "
                        ></a>
                      </li>
                    </ul>
                  </div>
                  
                  <!-- Varsayılan renk seçenekleri (variants olmadığında) -->
                  <div class="variable-single-item" v-else>
                    <span>Color</span>
                    <div class="product-color-list mt-2 mb-3">
                      <span class="color-chip" style="background-color: #000"></span>
                      <span class="color-chip" style="background-color: #1c73a8"></span>
                      <span class="color-chip" style="background-color: #a5a5a5"></span>
                    </div>
                  </div>
                  <form id="product_count_form_one">
                    <div class="product_count_one">
                      <b-form-spinbutton
                        id="sb-inline"
                        min="1"
                        max="100"
                        v-model="quantity"
                        inline
                        class="border-0"
                      ></b-form-spinbutton>
                      <a
                        href="javascript:void(0)"
                        @click="addToCart(product)"
                        class="theme-btn-one btn-black-overlay btn_sm"
                        >Add To Cart</a
                      >
                    </div>
                  </form>
                  <div class="modal_share_icons_one">
                    <h4>SHARE THIS PRODUCT</h4>
                    <div class="posted_icons_one">
                      <a href="#!"><i class="fab fa-facebook-f"></i></a>
                      <a href="#!"><i class="fab fa-instagram"></i></a>
                      <a href="#!"><i class="fab fa-twitter"></i></a>
                      <a href="#!"><i class="fab fa-linkedin-in"></i></a>
                      <a href="#!"><i class="fab fa-google-plus-g"></i></a>
                      <a href="#!"><i class="fab fa-pinterest-p"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-modal>
      </div>
      <!-- Modal Area End-->
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ProductBox1",
  props: {
    product: Object,
    index: Number,
    viewMode: {
      type: String,
      default: 'grid'
    }
  },

  data() {
    return {
      // Product Quanity Increment/ Decrement Data
      quantity: 1,

      imageSrc: "",
      cartProduct: {},
      compareProduct: {},
      dismissSecs: 3,
      dismissCountDown: 0,

      quantity: 1,

      activeColor: "",
      selectedSize: "",
      qty: "",
      size: [],
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 20,
        freeMode: true,
      },
    };
  },
  computed: {
    ...mapState({
      productslist: (state) => state.products.productslist,
    }),

    swiper() {
      return this.$refs.mySwiper.swiper;
    },

    isInWishlist() {
      const wishlistItems = this.$store.getters['products/wishlistItems'];
      return wishlistItems.some(item => item.id === this.product.id);
    },
    hasDiscount() {
      // Eğer doğrudan indirimli fiyat verilmişse (NULL değil)
      if (this.product.discountPrice !== null && this.product.discountPrice !== undefined && parseFloat(this.product.discountPrice) > 0) {
        return parseFloat(this.product.discountPrice) < parseFloat(this.product.price);
      }
      // Veya yüzde olarak indirim oranı verilmişse (NULL değil)
      if (this.product.discount !== null && this.product.discount !== undefined && parseFloat(this.product.discount) > 0) {
        return true;
      }
      return false;
    },
    formattedDiscountPrice() {
      // Eğer doğrudan indirimli fiyat verilmişse (NULL değil)
      if (this.product.discountPrice !== null && this.product.discountPrice !== undefined && parseFloat(this.product.discountPrice) > 0) {
        return parseFloat(this.product.discountPrice).toFixed(2);
      }
      
      // Yüzde olarak indirim verilmişse (NULL değil)
      if (this.product.discount !== null && this.product.discount !== undefined && parseFloat(this.product.discount) > 0) {
        const price = parseFloat(this.product.price) - (parseFloat(this.product.price) * parseFloat(this.product.discount)) / 100;
        return price.toFixed(2);
      }
      
      // Her iki indirim tipi de yoksa normal fiyatı göster
      return parseFloat(this.product.price).toFixed(2);
    }
  },
  mounted() {
    // Variants kontrolü - FakeStore API'den gelen ürünlerde variants olmayabilir
    if (this.product.variants && this.product.variants.length > 0) {
      // For displaying default color and size on pageload
      this.uniqColor = this.product.variants[0].color;
      this.sizeVariant(this.product.variants[0].image_id);
      // Active default color
      this.activeColor = this.uniqColor;
      this.changeSizeVariant(this.product.variants[0].size);
    }
  },

  methods: {
    // Product details Popup id Methods
    toggleModal() {
      this.$refs["product-details-popup"].toggle("#toggle-btn");
    },

    // Ürün resimini al
    getProductImage(product) {
      try {
        // Eğer ürünün images dizisi varsa ilk resmi döndür
        if (product.images && product.images.length > 0 && product.images[0].src) {
          return product.images[0].src;
        }
        
        // Eğer ürünün image özelliği varsa onu döndür
        if (product.image) {
          return product.image;
        }
        
        // Eğer ürünün imageUrl özelliği varsa onu döndür
        if (product.imageUrl) {
          return product.imageUrl;
        }
        
        // Eğer ürünün mainImage özelliği varsa onu döndür
        if (product.mainImage) {
          return product.mainImage;
        }
        
        // Hiçbiri yoksa varsayılan resmi döndür
        return 'https://via.placeholder.com/300x300?text=Urun';
      } catch (error) {
        console.error('Ürün resmi alınırken hata:', error);
        return 'https://via.placeholder.com/300x300?text=Hata';
      }
    },

    // For Get Image Url
    getImageUrl(src) {
      // URL formatını kontrol et ve düzelt
      if (src && typeof src === 'string') {
        // Eğer tam URL ise doğrudan döndür
        if (src.startsWith('http')) {
          return src;
        }
        
        // Eğer data:image formatında base64 ise doğrudan döndür
        if (src.startsWith('data:')) {
          return src;
        }
        
        // Diğer durumlar için direkt src'yi döndür
        return src;
      }
      
      // Geçersizse placeholder döndür
      return 'https://via.placeholder.com/300x300?text=Resim';
    },

    // Product Add To Cart realted methods
    addToCart(product) {
      // Konsola bilgi yazdır
      console.log('Sepete ekleniyor:', product);
      
      try {
        // Ürün kimliğini kontrol et
        if (!product || !product.id) {
          console.error('Geçersiz ürün verileri:', product);
          return;
        }
        
        // Stok kontrolü
        if (product.stock <= 0) {
          this.$toast.error('Bu ürün stokta yok');
          return;
        }
        
        // Sepete ekle
        this.$store.dispatch('cart/addCart', {
          product: product,
          quantity: 1
        })
          .then(() => {
            this.$toast.success('Ürün sepete eklendi');
            this.$emit("showalert", 3);
          })
          .catch(error => {
            console.error('Sepete eklerken hata:', error);
            this.$toast.error('Sepete eklenirken bir hata oluştu');
          });
      } catch (error) {
        console.error('Sepete ekleme işlemi sırasında hata:', error);
        this.$toast.error('Bir hata oluştu');
      }
    },

    // After Add to cart Alert
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
      this.$emit("alertseconds", this.dismissCountDown);
    },

    // Alert method to emit events
    alert(item) {
      this.dismissCountDown = this.dismissSecs;
      this.$emit("showalert", this.dismissCountDown);
    },

    // Discount Price
    discountedPrice(product) {
      const price = product.price - (product.price * product.discount) / 100;
      return price;
    },
    addToWishlist: function (product) {
      this.dismissCountDown = this.dismissSecs;
      this.$emit("showalert", this.dismissCountDown);
      
      // Ürün zaten favorilerdeyse kaldır, değilse ekle
      if (this.isInWishlist) {
        this.$store.dispatch("products/removeWishlistItem", product);
        this.$toast.info('Ürün favorilerden çıkarıldı');
      } else {
        this.$store.dispatch("products/addToWishlist", product);
        this.$toast.success('Ürün favorilere eklendi');
      }
    },
    /* Karşılaştırma işlevi devre dışı bırakıldı
    addToCompare: function (product) {
      this.dismissCountDown = this.dismissSecs;
      this.$emit("showalert", this.dismissCountDown);
      this.$store.dispatch("products/addToCompare", product);
    },
    */

    // For filter variants for color
    Color(variants) {
      // Variants özelliği olmayan ürünler için kontrol
      if (!variants || !Array.isArray(variants) || variants.length === 0) {
        return ["black", "blue", "gray"]; // Varsayılan renkler
      }
      
      // Benzersiz renkleri topla
      const uniq = variants
        .filter(variant => variant && variant.color) // Sadece geçerli color özelliği olanlar
        .map(variant => variant.color)
        .filter((item, i, arr) => arr.indexOf(item) === i);
      
      return uniq.length > 0 ? uniq : ["black", "blue", "gray"]; // Eğer hiç renk bulunamazsa varsayılan döndür
    },
    // Change Size Variant
    changeSizeVariant(variant) {
      this.selectedSize = variant;
    },
    slideTo(id) {
      this.swiper.slideTo(id, 1000, false);
    },
    sizeVariant(image_id, index, color) {
      this.activeColor = color;
      try {
        if (!this.product.variants || !Array.isArray(this.product.variants)) return;
        
        const selectedVariant = this.product.variants.find(v => v && v.image_id === image_id);
        if (selectedVariant && selectedVariant.src) {
          this.imageSrc = this.getImageUrl(selectedVariant.src);
        }
      } catch (e) {
        console.error("Varyant seçiminde hata:", e);
      }
    },
    truncateDescription(description) {
      if (!description) return '';
      return description.length > 150 ? description.substring(0, 150) + '...' : description;
    },
  },
};
</script>

<style scoped>
/* Ürün kartları için ana stiller, her sayfada tutarlı görünüm için */
.product_wrappers_one {
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  border: 1px solid #e9e9e9 !important;
  border-radius: 6px !important;
  overflow: hidden !important;
  transition: all 0.3s ease !important;
  background: #fff !important;
  margin-bottom: 20px !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05) !important;
}

.product_wrappers_one:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-5px) !important;
  border-color: #ddd !important;
}

.product_wrappers_one .thumb {
  position: relative !important;
  overflow: hidden !important;
  background-color: #f8f8f8 !important;
  padding-bottom: 100% !important; /* 1:1 aspect ratio */
}

.product_wrappers_one .thumb .image {
  display: contents !important;
}

.product_wrappers_one .thumb img {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  object-position: center !important;
  z-index: 1 !important;
  transition: transform 0.5s ease !important;
  padding: 10px !important;
}

.product_wrappers_one:hover .thumb img {
  transform: scale(1.05) !important;
}

.product_wrappers_one .content {
  padding: 15px !important;
  background-color: #fff !important;
  flex-grow: 1 !important;
}

.product_wrappers_one .title h4 {
  height: 48px !important;
  overflow: hidden !important;
  margin-bottom: 10px !important;
  font-size: 16px !important;
  line-height: 1.5 !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  text-overflow: ellipsis !important;
}

.badges {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.badges span {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  margin-right: 5px;
  border-radius: 3px;
}

.badges .new {
  background-color: #4caf50;
  color: #fff;
}

.badges .hot {
  background-color: #f44336;
  color: #fff;
}

.badges .discount {
  background-color: #ff9800;
  color: #fff;
}

/* Butonlar için yeni düzenleme */
.actions {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 3;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
}

.product_wrappers_one:hover .actions {
  opacity: 1;
  transform: translateX(0);
}

.actions button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  border: none;
  cursor: pointer;
  color: #555;
  transition: all 0.3s ease;
}

.actions button:hover, .in-wishlist .action.wishlist {
  background-color: #f15a29;
  color: #fff;
}

.add-to-cart {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background-color: #000;
  color: #fff;
  text-align: center;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  z-index: 2;
  opacity: 0;
}

.product_wrappers_one:hover .add-to-cart {
  transform: translateY(0);
  opacity: 1;
}

.price {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.price .new {
  color: #f15a29;
}

.price .old {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
  font-weight: 400;
}

/* List view styles */
.list-view {
  flex-direction: row !important;
  padding: 20px !important;
  height: auto !important;
  margin-bottom: 20px !important;
}

.list-view .thumb {
  width: 200px !important;
  min-width: 200px !important;
  height: 200px !important;
  padding-bottom: 0 !important;
  margin-right: 20px !important;
}

.list-view .content {
  display: flex !important;
  flex-direction: column !important;
  text-align: left !important;
  padding: 0 !important;
}

.list-view .title h4 {
  height: auto !important;
  margin-bottom: 10px !important;
}

.list-view .product-description {
  margin: 10px 0 20px !important;
  color: #777 !important;
}

.list-view .list-view-actions {
  display: flex !important;
  margin-top: auto !important;
  gap: 10px !important;
}

.list-view-actions button {
  padding: 8px 16px !important;
  border-radius: 4px !important;
  border: none !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
}

.list-view-actions .list-wishlist-btn {
  background-color: transparent !important;
  border: 1px solid #ddd !important;
  color: #555 !important;
}

.list-view-actions .list-wishlist-btn:hover {
  background-color: #f5f5f5 !important;
  color: #f15a29 !important;
}

.in-wishlist .list-wishlist-btn {
  color: #f15a29 !important;
  border-color: #f15a29 !important;
}
</style>