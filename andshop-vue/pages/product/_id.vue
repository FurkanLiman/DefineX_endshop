<template>
  <div>
    <!-- Banner Area -->
    <section id="common_banner_one">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="common_banner_text">
              <h2>Ürün Detayı</h2>
              <b-breadcrumb
                :items="breadcrumbItems"
                class="bg-transparent"
              ></b-breadcrumb>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Yükleniyor Durumu -->
    <section v-if="isCurrentProductLoading" class="ptb-100">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin fa-3x"></i>
              <p class="mt-3">Ürün detayı yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hata Durumu -->
    <section v-else-if="hasCurrentProductError" class="ptb-100">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <div class="error-message">
              <i class="fas fa-exclamation-circle fa-3x text-danger"></i>
              <p class="mt-3 text-danger">{{ getCurrentProductError }}</p>
              <button class="theme-btn-one bg-black btn_sm mt-3" @click="retryLoading">Tekrar Dene</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product Single Area -->
    <section id="product_single_one" class="ptb-100" v-else-if="currentProduct">
      <div class="container">
        <div class="row area_boxed">
          <div class="col-lg-4">
            <div class="product_single_one_img">
              <div v-swiper:mySwiper="swiperOption">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <inner-image-zoom
                      :src="getProductImage(currentProduct)"
                      :zoomSrc="getProductImage(currentProduct)"
                      moveType="drag"
                      className="product-image-zoom"
                    />
                  </div>
                  <!-- Ek resimler varsa onları da göster -->
                  <div 
                    v-if="currentProduct.images && currentProduct.images.length > 0" 
                    v-for="(image, index) in currentProduct.images" 
                    :key="index"
                    class="swiper-slide">
                    <inner-image-zoom
                      :src="getProductImage(image)"
                      :zoomSrc="getProductImage(image)"
                      moveType="drag"
                      className="product-image-zoom"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="product_details_right_one">
              <div class="modal_product_content_one">
                <h3 class="text-capitalize">{{ currentProduct.title }}</h3>
                <div class="product-category mb-2">
                  <span>Kategori: <strong>{{ getCategoryName(currentProduct.category) }}</strong></span>
                </div>
                
                <template v-if="currentProduct.id">
                  <div class="reviews_rating" v-if="productReviews && productReviews.length > 0">
                    <template v-if="averageRating >= 4.5">
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                    </template>
                    <template v-else-if="averageRating >= 3.5">
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star"></i>
                    </template>
                    <template v-else-if="averageRating >= 2.5">
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </template>
                    <template v-else-if="averageRating >= 1.5">
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </template>
                    <template v-else>
                      <i class="fas fa-star active"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                    </template>
                    <span>({{ productReviews.length }} Müşteri Değerlendirmesi)</span>
                  </div>
                  <div v-else class="product-review">
                    <span>Değerlendirme Yok</span>
                  </div>
                </template>
                <div v-else class="product-review">
                  <span>Yükleniyor...</span>
                </div>

                <!-- Price display - updated for TL and discount badges -->
                <div class="price-block">
                  <h4 v-if="currentProduct.discount || (currentProduct.discountPrice && parseFloat(currentProduct.discountPrice) > 0)">
                    <span class="current-price">₺{{ currentProduct.discountPrice ? parseFloat(currentProduct.discountPrice).toFixed(2) : discountedPrice(currentProduct) }}</span>
                    <del class="old-price">₺{{ parseFloat(currentProduct.price).toFixed(2) }}</del>
                    <span v-if="currentProduct.discount" class="discount-badge">-%{{ parseFloat(currentProduct.discount).toFixed(0) }}</span>
                  </h4>
                  <h4 v-else>₺{{ parseFloat(currentProduct.price).toFixed(2) }}</h4>
                </div>
                
                <div class="product-stock mb-2">
                  <span v-if="currentProduct.stock > 0" class="in-stock text-success">
                    <i class="fas fa-check-circle"></i> Stokta ({{ currentProduct.stock }} adet)
                    <small v-if="availableQuantity < currentProduct.stock" class="ml-2">
                      (Ekleyebileceğiniz: {{ availableQuantity }} adet)
                    </small>
                  </span>
                  <span v-else class="out-of-stock text-danger">
                    <i class="fas fa-times-circle"></i> Stokta Yok
                  </span>
                </div>

                <div class="quickview-peragraph">
                  <p>{{ currentProduct.description }}</p>
                </div>
                
                <!-- Ürün Koleksiyonu -->
                <div v-if="currentProduct.collection" class="quickview-collection">
                  <div class="collection-title">Koleksiyon: <span class="collection-tag">{{ currentProduct.collection }}</span></div>
                </div>

                <div class="quickview-quality">
                  <div class="cart-plus-minus">
                    <div  @click="decrement(1)" class="dec qtybutton">-</div>
                    <input v-model.number="qty" 
                           class="cart-plus-minus-box" 
                           type="number" 
                           name="qtybutton" 
                           :max="availableQuantity"
                           min="1"
                           @input="validateQty" />
                    <div @click="increment(10)" class="inc qtybutton">+</div>
                  </div>
                  <div class="quickview-stock">
                    <span><i class="fa fa-check-circle-o"></i> {{ isInStock ? 'Stokta var' : 'Stokta yok' }}</span>
                  </div>
                </div>
                
                <!-- Beden Seçimi -->
                <div v-if="currentProduct.sizes && currentProduct.sizes.length > 0" class="quickview-size">
                  <div class="size-title">Beden:</div>
                  <div class="size-selector">
                    <div 
                      v-for="(size, index) in currentProduct.sizes" 
                      :key="index" 
                      class="size-box"
                      :class="{'active': selectedSize === size}"
                      @click="selectSize(size)">
                      {{ size }}
                    </div>
                  </div>
                </div>
                
                <!-- Renk Seçimi -->
                <div v-if="currentProduct.colors && currentProduct.colors.length > 0" class="quickview-color">
                  <div class="color-title">Renk:</div>
                  <div class="color-selector">
                    <div 
                      v-for="(color, index) in currentProduct.colors" 
                      :key="index" 
                      class="color-swatch"
                      :style="{ backgroundColor: getColorHex(color) }"
                      :class="{'active': selectedColor === color}"
                      :title="color"
                      @click="selectColor(color)">
                    </div>
                  </div>
                </div>

                <div class="quickview-buttons">
                  <div class="actions">
                    <button @click="buyNow" class="theme-btn-one btn-black-overlay btn_sm">Şimdi Satın Al</button>
                    <button @click="addToCart(currentProduct, qty)" class="theme-btn-one btn-black-overlay btn_sm">Sepete Ekle</button>
                    <button @click="addToWishList(currentProduct)" class="theme-btn-one btn-black-overlay btn_sm" :class="{'active-wishlist': userWishlist.some(item => item.id === currentProduct.id)}">
                      <i :class="userWishlist.some(item => item.id === currentProduct.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                    </button>
                  </div>
                  <div class="actions product-details-social">
                    <p>Paylaş:</p>
                    <ul>
                      <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
                      <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                      <li><a href="#"><i class="fab fa-google-plus-g"></i></a></li>
                      <li><a href="#"><i class="fab fa-instagram"></i></a></li>
                  </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <div class="product_details_tabs">
              <b-tabs>
                <b-tab title="Açıklama" active id="description">
                  <div class="product_description">
                    <p>{{ currentProduct.description }}</p>

                    <div class="feature-list mt-4">
                      <h5>Ürün Özellikleri</h5>
                      <ul>
                        <li>Kategori: {{ getCategoryName(currentProduct.category) }}</li>
                        <li>Stok Durumu: {{ currentProduct.stock > 0 ? 'Stokta' : 'Tükendi' }}</li>
                        <li>Kargo: 2-3 iş günü</li>
                    </ul>
                    </div>
                  </div>
                </b-tab>
                <b-tab title="Ek Bilgiler" id="additional-info">
                  <div class="product_additional_information">
                    <table class="table table-bordered">
                      <tbody>
                        <tr>
                          <th scope="row">Ürün Kodu</th>
                          <td>{{ currentProduct.id }}</td>
                        </tr>
                        <tr>
                          <th scope="row">Kategori</th>
                          <td>{{ getCategoryName(currentProduct.category) }}</td>
                        </tr>
                        <tr>
                          <th scope="row">Marka</th>
                          <td>{{ currentProduct.brand || 'Belirtilmemiş' }}</td>
                        </tr>
                        <tr>
                          <th scope="row">Durum</th>
                          <td>{{ currentProduct.new ? 'Yeni' : 'Normal' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </b-tab>
                <b-tab title="Yorumlar" id="reviews">
                  <template v-if="currentProduct && currentProduct.id">
                    <ReviewSection 
                      :productId="parseInt(currentProduct.id)" 
                      @reviews-updated="fetchProductReviews(currentProduct.id)"
                    />
                  </template>
                  <div v-else class="text-center py-4">
                    <p>Ürün bilgileri yüklenemedi, yorumlar görüntülenemiyor.</p>
                  </div>
                </b-tab>
              </b-tabs>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benzer Ürünler -->
    <section id="related_product" class="pb-100" v-if="!isCurrentProductLoading && !hasCurrentProductError && currentProduct">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center_heading">
              <h2>Benzer Ürünler</h2>
              <p>Size özel ürün önerilerimize göz atın</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-lg-3 col-md-4 col-sm-6 col-12"
            v-for="(product, index) in relatedProducts"
            :key="index"
            v-show="index < 4"
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

    <!-- Kullanıcı Favori Ürünleri -->
    <section id="user_favorites" class="ptb-50" v-if="isAuthenticated && userWishlist.length > 0">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center_heading">
              <h2>Favori Ürünleriniz</h2>
              <p>Beğendiğiniz ürünleri kolayca takip edin</p>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-lg-3 col-md-4 col-sm-6 col-12"
            v-for="(product, index) in userWishlist"
            :key="index"
            v-show="index < 4"
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

    <!-- Add to cart Alert / Notification  -->
    <b-alert
      :show="dismissCountDown && alertType === 'cart'"
      dismissible
      fade
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="alert"
    >
      <p class="font-weight-normal">Ürün başarıyla sepete eklendi</p>
    </b-alert>

    <!-- Add to wishlist / wishlist Notification  -->
    <b-alert
      :show="dismissCountDown && alertType === 'wishlist'"
      dismissible
      fade
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="alert"
    >
      <p class="font-weight-normal">Ürün başarıyla favorilere eklendi</p>
    </b-alert>

    <!-- Add to Compare / Compare Notification  -->
    <!--
    <b-alert
      :show="dismissCountDown"
      dismissible
      fade
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="alert"
    >
      <p class="font-weight-normal">Ürün başarıyla karşılaştırma listesine eklendi</p>
    </b-alert>
    -->
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import ProductBox1 from '~/components/product-box/ProductBox1'
import ReviewSection from '~/components/product/ReviewSection.vue'

export default {
  name: "product-single",
  components: {
    ProductBox1,
    ReviewSection
  },
  data() {
    return {
      title: "Ürün Detayı",
      selected: {},
      qty: 1,
      images: [],
      loading: false,
      error: null,
      imageSrc: "",
      tab: 'description',
      selectedSize: '',
      selectedColor: '',
      isFavorite: false,
      isCompared: false,
      dismissCountDown: 0,
      dismissSecs: 3,
      alertType: 'cart',
      productReviews: [],
      swiperOption: {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 10,
        autoplay: false,
        breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        },
      },
      breadcrumbItems: [
        {
          text: "Anasayfa",
          to: "/"
        },
        {
          text: "Ürünler",
          to: "/shop"
        },
        {
          text: "Ürün Detayı",
          active: true
        }
      ],
      // Kategori Türkçe karşılıkları
      categoryTranslations: {
          "men's clothing": "Erkek Giyim",
          "women's clothing": "Kadın Giyim",
          "electronics": "Elektronik",
          "jewelery": "Takılar"
      }
    };
  },
  computed: {
    ...mapGetters({
      apiProducts: "products/getProducts",
      wishlistItems: "wishlist/getWishlistItems",
      compareItems: "compare/getCompareItems",
      getDetail: 'products/getProductById',
      isCurrentProductLoading: 'products/isCurrentProductLoading',
      hasCurrentProductError: 'products/hasCurrentProductError',
      getCurrentProductError: 'products/getCurrentProductError',
      getCurrentProduct: 'products/getCurrentProduct',
      isLoading: 'products/isLoading',
      hasError: 'products/hasError',
      getError: 'products/getError',
      getProducts: 'products/getProducts',
      userWishlist: 'products/wishlistItems',
      isAuthenticated: 'user/isAuthenticated',
      user: 'user/currentUser',
      cartItems: 'cart/cartItems'
    }),
    ...mapState({
      products: state => state.products.products,
      currentProduct: state => state.products.currentProduct,
    }),
    
    // Calculate average rating from actual reviews
    averageRating() {
      if (!this.productReviews || this.productReviews.length === 0) return 0;
      const total = this.productReviews.reduce((sum, review) => sum + Number(review.rating), 0);
      return Number((total / this.productReviews.length).toFixed(1));
    },
    
    // Benzer ürünler - aynı kategoride olan diğer ürünler
    relatedProducts() {
      if (!this.currentProduct) return [];
      
      return this.products
        .filter(product => product.category === this.currentProduct.category && product.id !== this.currentProduct.id)
        .slice(0, 4);
    },
    
    inWishlist() {
      return this.wishlistItems.some(item => item.id === parseInt(this.$route.params.id));
    },
    
    inCompare() {
      return this.compareItems.some(item => item.id === parseInt(this.$route.params.id));
    },
    
    isInStock() {
      return this.currentProduct && this.currentProduct.stock > 0;
    },
    isProductInWishlist(productId) {
      return this.userWishlist.some(item => item.id === productId);
    },
    
    // Calculate the available quantity for the current product
    availableQuantity() {
      if (!this.currentProduct || !this.currentProduct.stock) {
        return 0;
      }
      
      // Find the same product in cart (match by id, size, and color)
      const cartItem = this.cartItems.find(item => 
        item.id === this.currentProduct.id && 
        item.selectedSize === this.selectedSize && 
        item.selectedColor === this.selectedColor
      );
      
      // Calculate available quantity (total stock - quantity in cart)
      const quantityInCart = cartItem ? parseInt(cartItem.quantity, 10) || 0 : 0;
      const availableQty = this.currentProduct.stock - quantityInCart;
      
      return Math.max(0, availableQty); // Ensure it's not negative
    },
  },
  mounted() {
    window.scrollTo(0, 0);
    this.loadProductDetails();
    
    // Initialize qty to 1 or available quantity (whichever is less)
    this.$nextTick(() => {
      if (this.availableQuantity === 0) {
        this.qty = 0;
      } else {
        this.qty = Math.min(1, this.availableQuantity);
      }
    });
  },
  watch: {
    // Route değiştiğinde ürün detayını yeniden yükle
    '$route.params.id': function(newId) {
      this.loadProductDetails();
    },
    
    // When available quantity changes, ensure qty is within limits
    availableQuantity: function(newAvailable) {
      if (this.qty > newAvailable) {
        this.qty = Math.max(1, newAvailable);
      }
    }
  },
  methods: {
    ...mapActions({
      addToWishlist: 'products/addToWishlist',
      removeWishlistItem: 'products/removeWishlistItem',
      addWithQty: 'cart/addCart',
      addCompare: 'products/addToCompare',
      addReview: 'products/addReview',
      fetchProduct: 'products/fetchProduct',
      fetchProducts: 'products/fetchProducts',
      fetchProductById: 'products/fetchProductById',
      fetchProductsByCat: 'products/fetchProductsByCategory',
      addToList: 'products/addToWishList',
      removeFromList: 'products/removeFromWishList'
    }),
    
    async loadProductDetails() {
      this.loading = true;
      this.error = null;
      
      const productId = parseInt(this.$route.params.id);
      console.log("Yüklenen ürün ID:", productId); // Debug için
      
      // API'den ürünü direkt yükle
      this.$store.dispatch('products/fetchProduct', productId)
        .then(product => {
          console.log("Ürün başarıyla yüklendi:", product);
          this.loading = false;

          // Varyasyon bilgileri
          if (this.currentProduct.sizes && this.currentProduct.sizes.length > 0) {
            this.selectedSize = this.currentProduct.sizes[0];
          }
          if (this.currentProduct.colors && this.currentProduct.colors.length > 0) {
            this.selectedColor = this.currentProduct.colors[0];
          }
          
          // Load product reviews
          this.fetchProductReviews(productId);
        })
        .catch(error => {
          console.error("Ürün yüklenirken hata oluştu:", error);
          
          // API'den veri alamazsak, store'daki mevcut ürünleri kontrol et
          const storeProduct = this.apiProducts.find(p => p.id === productId);
          
          if (storeProduct) {
            console.log("Ürün store'da bulundu, kullanılıyor:", storeProduct.title);
            this.$store.commit('products/SET_CURRENT_PRODUCT', storeProduct);
            
            // Varyasyon bilgileri
            if (storeProduct.sizes && storeProduct.sizes.length > 0) {
              this.selectedSize = storeProduct.sizes[0];
            }
            if (storeProduct.colors && storeProduct.colors.length > 0) {
              this.selectedColor = storeProduct.colors[0];
            }
            
            // Load product reviews for this product too
            this.fetchProductReviews(productId);
            
            this.loading = false;
          } else {
            console.error("Ürün bulunamadı:", productId);
            this.error = "Ürün bulunamadı. Lütfen geçerli bir ürün sayfasını ziyaret edin.";
            this.loading = false;
          }
        });
    },
    
    addToCart(product, qty) {
      this.alertType = 'cart';
      
      // Call store action and handle result
      this.addWithQty({
        product: product,
        quantity: qty
      }).then(result => {
        if (result && result.success) {
          // Success case - show both toast and bootstrap alert
          this.dismissCountDown = this.dismissSecs;
          this.$emit('showalert', this.dismissCountDown);
          this.$toast.success('Ürün sepete eklendi', {
            position: 'top-right'
          });
        } else {
          // Error case - only show toast error
          const errorMessage = result.error || 'Ürün sepete eklenirken bir hata oluştu';
          this.$toast.error(errorMessage, {
            position: 'top-right'
          });
        }
      }).catch(error => {
        // Handle unexpected errors
        console.error('Sepete ekleme hatası:', error);
        this.$toast.error('Ürün sepete eklenirken bir hata oluştu', {
          position: 'top-right'
        });
      });
    },
    
    increment(amount) {
      // Limit by available quantity instead of fixed number
      this.qty = Math.min(this.qty + 1, this.availableQuantity);
    },
    
    decrement(amount) {
      this.qty = Math.max(this.qty - 1, 1);  // En az 1 adet olmalı
    },

    // Kategori İsimleri Türkçe'ye Çevirme
    getCategoryName(category) {
      return this.categoryTranslations[category] || category;
    },
    
    // Tekrar Yükleme
    retryLoading() {
      this.loadProductDetails();
    },
    
    // Product added Alert / notificaion 
    alert(item) {
      this.dismissCountDown = item
    },

    // Fetch product reviews from API
    async fetchProductReviews(productId) {
      if (!productId) return;
      
      try {
        const response = await this.$axios.$get(`/api/reviews/product/${productId}`);
        this.productReviews = Array.isArray(response) ? response : [];
        console.log(`Loaded ${this.productReviews.length} reviews for product ${productId}`);
      } catch (error) {
        console.error('Error loading product reviews:', error);
        this.productReviews = [];
      }
    },

    // Şimdi Satın Al - Sepete ekleyip checkout sayfasına yönlendir
    async buyNow() {
      try {
        // Önce sepete ekle
        const result = await this.addWithQty({
          product: this.currentProduct,
          quantity: this.qty
        });
        
        if (!result || !result.success) {
          // Eğer sepete ekleme başarısız olduysa hata mesajı göster
          const errorMessage = result?.error || 'Ürün sepete eklenirken bir hata oluştu';
          this.$toast.error(errorMessage);
          return; // Ödeme sayfasına yönlendirmeyi durdur
        }
        
        // Başarılıysa checkout sayfasına yönlendir
        this.$router.push('/checkout');
      } catch (error) {
        console.error('Hızlı satın alma işlemi sırasında hata:', error);
        this.$toast.error('İşlem sırasında bir hata oluştu');
      }
    },

    // Resim URL'sini kontrol edip düzenleme
    getImageSrc(path) {
      if (!path) return "/images/placeholder.jpg";
      
      // Zaten tam URL ise doğrudan döndür
      if (path.startsWith('http')) {
        return path;
      }
      
      // Relative path ise tamamla
      return path;
    },
    
    // Ürün resmi için fallback
    getProductImage(product) {
      if (product && product.image) {
        return this.getImageSrc(product.image);
      }
      return "/images/placeholder.jpg";
    },

    // Discounted Price
    discountedPrice(product) {
      return (product.price - (product.price * product.discount) / 100).toFixed(2);
    },

    // For filter variants for color
    Color(variants) {
      if (!variants || variants.length === 0) {
        return ["black", "blue", "gray"]; // Varsayılan renkler
      }
      
      const uniq = variants
        .map((variant) => {
          return variant.color;
        })
        .filter((item, i, arr) => {
          return arr.indexOf(item) === i;
        });
      return uniq;
    },
    
    // When size and color button click changed the image
    sizeVariant(image_id, index, color) {
        this.selectedColor = color;
        if (!this.getDetail || !this.getDetail.images) return;
        
        let obj = {};
        obj = this.getDetail.images.find(o => o.image_id === image_id);
        if (obj) {
          this.imageSrc = obj.src;
        }
    },

    // Select size
    selectSize(size) {
      this.selectedSize = size;
    },

    // Select color
    selectColor(color) {
      this.selectedColor = color;
    },

    // Add to wishlist
    addToWishList(product) {
      this.alertType = 'wishlist';
      
      if (this.isProductInWishlist(product.id)) {
        this.removeFromList(product);
        this.isFavorite = false;
        this.showCustomAlert("Ürün favorilerden çıkarıldı", "warning");
      } else {
        this.addToList(product);
        this.isFavorite = true;
        this.showCustomAlert("Ürün favorilere eklendi", "success");
      }
    },
    
    showCustomAlert(message, type) {
      this.$bvToast.toast(message, {
        title: type === 'success' ? 'Başarılı!' : 'Bilgi',
        variant: type,
        solid: true,
        autoHideDelay: 3000
      });
    },

    // Renk adını hex değerine dönüştürme
    getColorHex(colorName) {
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

    // Add to cart
    async addToCart() {
      if (!this.currentProduct) {
        this.$toast.error("Ürün bulunamadı!");
        return;
      }

      // Seçili boyut ve renk kontrolü
      if (this.selectedSize === '' && this.currentProduct.category.includes('clothing')) {
        this.$toast.error("Lütfen bir beden seçin");
        return;
      }
      if (this.selectedColor === '' && this.currentProduct.colors && this.currentProduct.colors.length > 0) {
        this.$toast.error("Lütfen bir renk seçin");
        return;
      }

      try {
        // Ürün verilerini hazırla
        const product = {
          ...this.currentProduct,
          cartItemId: Math.floor(Math.random() * 1000000), // Benzersiz bir ID
          quantity: this.qty,
          selectedSize: this.selectedSize,
          selectedColor: this.selectedColor,
          // Resim URL'sini güvenli hale getir
          image: this.currentProduct.image, // URL'yi olduğu gibi kullan
          price: this.currentProduct.price,
          discountPrice: this.currentProduct.discountPrice || null
        };

        // Sepete ekle
        await this.$store.dispatch('cart/addCart', { product, quantity: this.qty });
        this.$toast.success("Ürün sepete eklendi!");
      } catch (error) {
        console.error("Sepete ekleme hatası:", error);
        this.$toast.error("Ürün sepete eklenirken bir hata oluştu!");
      }
    },
    
    // Validate manually entered quantity
    validateQty() {
      // Convert to number and validate
      let newQty = parseInt(this.qty, 10);
      
      // Handle invalid input
      if (isNaN(newQty) || newQty < 1) {
        newQty = 1;
      }
      
      // Ensure quantity doesn't exceed available stock
      if (newQty > this.availableQuantity) {
        newQty = this.availableQuantity;
      }
      
      // Update the value
      this.qty = newQty;
    },
  }
};
</script> 

<style>
/* Ürün Detay Stilleri */
.product-stock .in-stock {
  color: #28a745;
  font-weight: 500;
}

.product-stock .out-of-stock {
  color: #dc3545;
  font-weight: 500;
}

.product-category span {
  color: #555;
  font-size: 14px;
}

.product-category strong {
  color: #333;
  font-weight: 600;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.quickview-size, .quickview-color {
  margin-bottom: 20px;
}

.size-title, .color-title {
  font-weight: 600;
  margin-bottom: 10px;
  display: block;
}

.size-selector, .color-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.size-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.size-box:hover {
  border-color: #333;
}

.size-box.active {
  background-color: #222;
  color: white;
  border-color: #222;
}

.color-swatch {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ddd;
}

.color-swatch:hover {
  transform: scale(1.1);
}

.color-swatch.active {
  border: 2px solid #222;
  transform: scale(1.1);
}

.collection-tag {
  display: inline-block;
  background-color: #f5f5f5;
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 14px;
  color: #333;
  margin-left: 5px;
}

.quickview-collection {
  margin-bottom: 15px;
}

/* Fixed styling for cart quantity selector */
.cart-plus-minus {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 45px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-right: 15px;
}

.cart-plus-minus-box {
  width: 60px;
  height: 100%;
  padding: 0;
  border: none;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  background: transparent;
  outline: none;
  -moz-appearance: textfield; /* Remove spinner on Firefox */
}

/* Remove spinner buttons on Chrome, Safari, Edge, Opera */
.cart-plus-minus-box::-webkit-outer-spin-button,
.cart-plus-minus-box::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qtybutton {
  width: 35px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 18px;
  user-select: none;
}

.dec.qtybutton {
  left: 0;
  border-right: 1px solid #ddd;
}

.inc.qtybutton {
  right: 0;
  border-left: 1px solid #ddd;
}

.qtybutton:hover {
  background: #e5e5e5;
}

/* Price display styles */
.price-block {
  margin: 15px 0;
}

.price-block .current-price {
  color: #222;
  font-weight: 600;
  font-size: 20px;
}

.price-block .old-price {
  text-decoration: line-through;
  color: #999;
  margin-left: 10px;
  font-size: 16px;
}

.discount-badge {
  background-color: #ff5353;
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;
  margin-left: 10px;
  display: inline-block;
  vertical-align: middle;
}

.quickview-buttons {
  margin-top: 20px;
}

.login-required-message {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 5px;
}

/* Yeni: Favoriler Buton Stili */
.active-wishlist {
  background-color: #f15a29 !important;
  border-color: #f15a29 !important;
  color: white !important;
}

.active-wishlist i {
  color: white;
}

/* Yeni: Giriş Gerekli Mesaj Kutusu */
.login-required-message {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 30px;
  border: 1px solid #e9ecef;
}

.login-required-message i {
  color: #6c757d;
}

.login-required-message h4 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #343a40;
}

.login-required-message p {
  color: #6c757d;
  margin-bottom: 20px;
}

/* Favori Ürünler Bölümü */
#user_favorites {
  background-color: #f9f9f9;
  position: relative;
  overflow: hidden;
}

#user_favorites::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #f79837, #f15a29);
}
</style> 