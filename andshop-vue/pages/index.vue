<template>
  <div class="home-page">
    <!-- Banner Area -->
    <section id="banner_one">
      <div class="container">
        <div class="row">
          <div class="col-lg-6">
            <div class="banner_text_one">
              <h1
                class="flipInX"
                style="animation-duration: 3s; animation-delay: 0.3s"
              >
                Live For
                <span
                  class="flipInX"
                  style="animation-duration: 2s; animation-delay: 0.5s"
                  >Fashion</span
                >
              </h1>
              <h3>Save Up To 50%</h3>
              <nuxt-link to="/shop?discount=true" class="theme-btn-one bg-black btn_md"
                >Fırsatları Gör</nuxt-link
              >
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero_img">
              <img
                :src="require('@/assets/img/common/man.png')"
                alt="img"
                class="slideInRight"
                style="animation-duration: 3s; animation-delay: 0.3s"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Kullanıcı Karşılama Alanı -->
    <section v-if="isAuthenticated" id="user_welcome_area" class="pt-50 pb-50">
      <div class="container">
        <div class="welcome_container">
          <div class="row">
            <div class="col-lg-8">
              <div class="welcome_content">
                <h3>Hoş Geldiniz, {{ currentUser ? currentUser.firstName : 'Değerli Müşterimiz' }}!</h3>
                <p>Size özel fırsatlar ve kampanyalar için hesabınızı takip etmeyi unutmayın.</p>
                <div class="user_stats">
                  <div class="stat_item">
                    <div class="stat_icon">
                      <i class="fas fa-shopping-bag"></i>
                    </div>
                    <div class="stat_info">
                      <h4>{{ userOrderCount }}</h4>
                      <p>Siparişiniz</p>
                    </div>
                  </div>
                  <div class="stat_item">
                    <div class="stat_icon">
                      <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="stat_info">
                      <h4>{{ userAddressCount }}</h4>
                      <p>Adresiniz</p>
                    </div>
                  </div>
                  <div class="stat_item">
                    <div class="stat_icon">
                      <i class="fas fa-heart"></i>
                    </div>
                    <div class="stat_info">
                      <h4>{{ userWishlistCount }}</h4>
                      <p>Favoriniz</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="user_quick_actions">
                <h4>Hızlı İşlemler</h4>
                <ul>
                  <li>
                    <nuxt-link to="/profile">
                      <i class="fas fa-user"></i> Profilim
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/profile?tab=orders">
                      <i class="fas fa-shopping-basket"></i> Siparişlerim
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/profile?tab=addresses">
                      <i class="fas fa-map-marker-alt"></i> Adreslerim
                    </nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/cart">
                      <i class="fas fa-shopping-cart"></i> Sepetim ({{ cartLength }})
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Product variation -->
    <section id="product_variation_one" class="pt-100">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-4 col-md-6">
            <div class="product_variation_one_boxed img-zoom-hover">
              <img :src="require('@/assets/img/offer/woman.png')" alt="img" />
              <div class="product_var_one_text">
                <h4 class="color_one">GİYİM</h4>
                <h2>YENİ</h2>
                <h4>Koleksiyon</h4>
                <nuxt-link
                  to="/shop?sort=newest"
                  class="theme-btn-one bg-black btn_sm"
                  >Satın Al</nuxt-link
                >
              </div>
            </div>
            <div class="product_variation_one_boxed img-zoom-hover">
              <img :src="require('@/assets/img/offer/woman1.png')" alt="img" />
              <div class="product_var_one_text">
                <h4 class="color_one">Popüler</h4>
                <h2>POPÜLER</h2>
                <h4>Koleksiyon</h4>
                <nuxt-link to="/shop?sort=popularity" class="theme-btn-one bg-black btn_sm"
                  >Satın Al</nuxt-link
                >
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="product_variation_one_boxed img-zoom-hover">
              <img :src="require('@/assets/img/offer/bag.png')" alt="img" />
              <div class="product_var_one_text_center">
                <h2 class="color_one">10% İNDİRİM</h2>
                <h4>SEÇİLİ ÜRÜNLER</h4>
                <nuxt-link
                  to="/shop?discount=true"
                  class="theme-btn-one bg-black btn_sm"
                  >Satın Al</nuxt-link
                >
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="product_variation_one_boxed img-zoom-hover">
              <img :src="require('@/assets/img/offer/woman4.png')" alt="img" />
              <div class="product_var_one_text">
                <h2>YENİ</h2>
                <h4 class="color_one">YAZ FIRSATLARI</h4>
                <nuxt-link
                  to="/shop?category=Sezon%20Koleksiyonu"
                  class="theme-btn-one bg-black btn_sm"
                  >Satın Al</nuxt-link
                >
              </div>
            </div>
            <div class="product_variation_one_boxed img-zoom-hover">
              <img :src="require('@/assets/img/offer/kids.png')" alt="img" />
              <div class="product_var_one_text">
                <h2>ÇOCUK</h2>
                <h4 class="color_one">KOLEKSİYON</h4>
                <nuxt-link to="/shop?category=Çocuk%20Giyim" class="theme-btn-one bg-black btn_sm"
                  >Satın Al</nuxt-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Hot Product Area -->
    <section id="hot_Product_area" class="ptb-100">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="center_heading">
              <h2>YENİ ÜRÜNLER</h2>
              <p>En Yeni Ürünlerimize Göz Atın</p>
            </div>
          </div>
        </div>

        <!-- Yükleniyor Durumu -->
        <div class="row" v-if="isLoading">
          <div class="col-12 text-center py-5">
            <div class="loading-spinner">
              <i class="fas fa-spinner fa-spin fa-3x"></i>
              <p class="mt-3">Ürünler yükleniyor...</p>
            </div>
          </div>
        </div>
        
        <!-- Hata Durumu -->
        <div class="row" v-else-if="hasError">
          <div class="col-12 text-center py-5">
            <div class="error-message">
              <i class="fas fa-exclamation-circle fa-3x text-danger"></i>
              <p class="mt-3 text-danger">{{ getError }}</p>
              <button class="theme-btn-one bg-black btn_sm mt-3" @click="retryLoading">Tekrar Dene</button>
            </div>
          </div>
        </div>
        
        <!-- Ürün Listesi -->
        <div v-else>
          <b-tabs class="hot-product-area-tabs">
            <b-tab
              title="Tüm Ürünler"
              active
              class="row product-grid-container"
            >
              <div
                class="col-lg-3 col-md-4 col-sm-6 col-12"
                v-for="(product, index) in apiProducts.slice(0, 8)"
                :key="index"
              >
                <ProductBox1
                  :product="product"
                  :index="index"
                  @showalert="alert"
                  @alertseconds="alert"
                />
              </div>
            </b-tab>
            <b-tab
              title="Erkek Giyim"
              class="row product-grid-container"
            >
              <div
                class="col-lg-3 col-md-4 col-sm-6 col-12"
                v-for="(product, index) in apiProducts.filter(product => product.category === 'Erkek Giyim').slice(0, 8)"
                :key="index"
              >
                <ProductBox1
                  :product="product"
                  :index="index"
                  @showalert="alert"
                  @alertseconds="alert"
                />
              </div>
            </b-tab>
            <b-tab
              title="Kadın Giyim"
              class="row product-grid-container"
            >
              <div
                class="col-lg-3 col-md-4 col-sm-6 col-12"
                v-for="(product, index) in apiProducts.filter(product => product.category === 'Kadın Giyim').slice(0, 8)"
                :key="index"
              >
                <ProductBox1
                  :product="product"
                  :index="index"
                  @showalert="alert"
                  @alertseconds="alert"
                />
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </section>

    <!-- Add to cart Alert / Notification  -->
    <b-alert
      :show="dismissCountDown"
      dismissible
      fade
      variant="success"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="alert"
    >
      <p class="font-weight-normal">Ürün başarıyla sepete eklendi</p>
    </b-alert>
    <!-- Add to cart Alert / Notification  -->

    <!-- Add to wishlist / wishlist Notification  -->
    <b-alert
      :show="dismissCountDown"
      dismissible
      fade
      variant="success"
      @dismissed="dismissCountDown = 0"
      @dismiss-count-down="alert"
    >
      <p class="font-weight-normal">Ürün başarıyla favorilere eklendi</p>
    </b-alert>
    <!-- Add to wishlist / wishlist Notification  -->

    <!-- Add to Compare / Compare Notification  -->
    <!--
    <b-alert
      :show="dismissCountDown"
      dismissible
      fade
      variant="success"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <p class="font-weight-normal">Ürün başarıyla karşılaştırma listesine eklendi</p>
    </b-alert>
    -->
    <!-- Add to Compare / Compare Notification  -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import ProductBox1 from "~/components/product-box/ProductBox1";
import Timer from "../components/widgets/Timer";
import InstagramArea from "../components/instagram/InstagramArea";
import BlogItem1 from "~/components/blog/BlogItem1";

export default {
  name: "Home",
  components: {
    ProductBox1,
    Timer,
    InstagramArea,
    BlogItem1,
  },

  data() {
    return {
      title: "AndShop | Giyim Mağazası",
      dismissCountDown: 0,
      dismissSecs: 3,
      
      // Eski veri yapısı için gerekli (migrate edilene kadar)
      productsList: [],
      category: [],
      
      blogItems: [
        {
          id: 1,
          blogThumb: require("assets/img/blog/post1.png"),
          blogTitle:
            "This Designer Bronzer Has Even The Drugstore-Beauty-Buyers Splurging!",
          blogDescription:
            "Today kicks off early access to the Sephora Spring Sales Event so I wanted to share some of my top recent beauty buys I've been",
          blogPublishDate: "24 February 2021",
        },
        {
          id: 2,
          blogThumb: require("assets/img/blog/post2.png"),
          blogTitle: "4 Fresh Ways To Style Leather Shorts For Spring",
          blogDescription:
            "We spent spring break this year in California with Cody's family and it was such a fun getaway. Cody's family always goes hard on vacation",
          blogPublishDate: "29 jan 2018",
        },
        {
          id: 3,
          blogThumb: require("assets/img/blog/post3.png"),
          blogTitle: "Shopbop Spring Sale Selects All Under Around $100!",
          blogDescription:
            "STRAIGHT LEG DENIM (UNDER $100) – Love all the Ribcage Levi's styles! They are all really flattering. but since these are wider leg I stuck with my usual size (25).",
          blogPublishDate: "24 February 2021",
        },
        {
          id: 4,
          blogThumb: require("assets/img/blog/post4.png"),
          blogTitle: "This Made Me Splurge on The Apple Watch",
          blogDescription:
            "From our favourite UK influencers to the best missives from Milan and the coolest New Yorkers, read on some of the best fashion blogs out there.",
          blogPublishDate: "21 February 2019",
        },
        {
          id: 5,
          blogThumb: require("assets/img/blog/post5.png"),
          blogTitle: "This Designer Bronzer Has Even Buyers Splurging!",
          blogDescription:
            "Today kicks off early access to the Sephora Spring Sales Event so I wanted to share some of my top recent beauty buys",
          blogPublishDate: "24 February 2021",
        },
        {
          id: 6,
          blogThumb: require("assets/img/blog/post6.png"),
          blogTitle: "4 Tips for A Colorful Easter Tablescape",
          blogDescription:
            "Spring is all about the colors! Especially after what feels like an endless winter, I catch myself craving more color than usual.",
          blogPublishDate: "24 February 2021",
        },
        {
          id: 7,
          blogThumb: require("assets/img/blog/post7.png"),
          blogTitle: "Hawaii Couples Trip Guide and Spring Break Faves",
          blogDescription:
            "After every trip to Hawaii, I always have a few DMs asking where we stayed, our favorite beaches, etc. Especially with spring break around the corner.",
          blogPublishDate: "24 February 2021",
        },
        {
          id: 8,
          blogThumb: require("assets/img/blog/post8.png"),
          blogTitle: "My Top 5 Finds From the Shopbop Spring Sale",
          blogDescription:
            "Shopbop recently launched their Style Event for spring so I had to share my top 5 finds from the Shopbop Spring Sale with you all.",
          blogPublishDate: "24 February 2021",
        },
        {
          id: 9,
          blogThumb: require("assets/img/blog/post9.png"),
          blogTitle: "The Luxury Winter Accessory That's Trending Now",
          blogDescription:
            "No matter what you spend on your wardrobe, there are three pieces that can always elevate your look – shoes, handbags, and sunglasses.",
          blogPublishDate: "8 jan 2021",
        },
      ],
      swiperOption: {
        slidesPerView: 4,
        loop: false,
        spaceBetween: 30,
        freeMode: true,
        preventClicks: false,
        preventClicksPropagation: false,
        grabCursor: false,
        mousewheel: false,
        keyboard: {
          enabled: false,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          300: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
        },
        autoplay: false,
      },
    };
  },
  computed: {
    ...mapState({
      productslist: (state) => state.products.productslist,
      products: (state) => state.products.products,
    }),
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated',
      currentUser: 'user/currentUser',
      cartItemCount: 'cart/cartItemCount',
      wishlistLength: 'products/wishlistItems',
      isLoading: 'products/isLoading',
      hasError: 'products/hasError',
      getError: 'products/getError',
      getProducts: 'products/getProducts',
      orderCount: 'order/orderCount'
    }),
    
    // API ürünlerini doğru getter ile alalım
    apiProducts() {
      return this.getProducts || [];
    },
    
    // Erkek giyim ürünleri
    getMensClothing() {
      return this.apiProducts.filter(product => product.category === "men's clothing");
    },
    
    // Kadın giyim ürünleri
    getWomensClothing() {
      return this.apiProducts.filter(product => product.category === "women's clothing");
    },
    // Kullanıcı sipariş sayısı
    userOrderCount() {
      // order/orderCount getter'ını kullan
      return this.orderCount || 0;
    },
    // Kullanıcı adres sayısı
    userAddressCount() {
      // Adresler doğrudan Vuex state'inden geliyor
      if (this.isAuthenticated) {
        const addresses = this.$store.getters['user/addresses'];
        if (addresses && Array.isArray(addresses)) {
          return addresses.length;
        }
      }
      return 0;
    },
    // Wishlist sayısını düzgün göster
    userWishlistCount() {
      // wishlistLength bir array olduğu için uzunluğunu döndürüyoruz
      if (!this.wishlistLength) return 0;
      
      console.log("Favoriler:", this.wishlistLength);
      
      if (Array.isArray(this.wishlistLength)) {
        return this.wishlistLength.length;
      }
      
      // Olası diğer durumlar
      if (typeof this.wishlistLength === 'number') {
        return this.wishlistLength;
      }
      
      return 0;
    },
    // Sepet sayısını doğru göster - sadece sayıyı kullan
    cartLength() {
      return this.cartItemCount;
    },
  },
  mounted() {
    // For scroll page top for every Route
    window.scrollTo(0, 0);

    // Eski productsArray metodu (eski sistemle uyum için)
    this.productsArray();
    
    // API'den veri yükleme
    if (this.apiProducts.length === 0) {
      this.fetchProducts()
        .catch(error => {
          console.error('Anasayfa ürünleri yüklenirken hata:', error);
        });
    }
    
    // Kullanıcı giriş yapmışsa adresleri ve siparişleri yükle
    if (this.isAuthenticated) {
      this.loadAddresses();
      this.loadOrders();
    }
  },
  methods: {
    ...mapActions({
      fetchProducts: 'products/fetchProducts',
      getAddresses: 'user/getAddresses',
      fetchUserOrders: 'order/fetchUserOrders'
    }),
    
    // Adresleri yükleme metodu
    async loadAddresses() {
      try {
        await this.getAddresses();
      } catch (error) {
        console.error('Adresler yüklenirken hata:', error);
      }
    },
    
    // Siparişleri yükleme metodu
    async loadOrders() {
      try {
        await this.fetchUserOrders();
      } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
      }
    },
    
    // Tekrar yükleme işlemi
    retryLoading() {
      this.fetchProducts();
    },
    
    // Eski sistem (legacy) metodları
    productsArray: function () {
      this.productslist.map((item) => {
        if (item.type === "fashion") {
          this.productsList.push(item);
          item.collection.map((i) => {
            const index = this.category.indexOf(i);
            if (index === -1) this.category.push(i);
          });
        }
      });
    },
    // For Product Tab
    getCategoryProduct(collection) {
      return this.productsList.filter((item) => {
        if (item.collection.find((i) => i === collection)) {
          return item;
        }
      });
    },

    // Product added Alert / notificaion
    alert(item) {
      this.dismissCountDown = item;
    },
  },

  // Page head() Title, description for SEO
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "AndShop - Modern Giyim E-ticaret Sitesi",
        },
      ],
    };
  },
};
</script>

<style scoped>
.loading-spinner, .error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

/* Ürün kartları için ek stiller */
.product-grid-container {
  display: flex;
  flex-wrap: wrap;
}

.product-grid-container > div {
  margin-bottom: 30px;
}

/* Kullanıcı Karşılama Alanı Stilleri */
#user_welcome_area {
  background-color: #f9f9f9;
}

.welcome_container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
  position: relative;
  overflow: hidden;
}

.welcome_container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #f79837, #f15a29);
}

.welcome_content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.welcome_content p {
  font-size: 15px;
  color: #777;
  margin-bottom: 20px;
}

.user_stats {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.stat_item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat_item:hover {
  background-color: #f5f5f5;
  transform: translateY(-3px);
}

.stat_icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(247, 152, 55, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.stat_icon i {
  color: #f79837;
  font-size: 18px;
}

.stat_info h4 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.stat_info p {
  font-size: 13px;
  color: #777;
  margin: 0;
}

.user_quick_actions {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
}

.user_quick_actions h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
  position: relative;
  padding-bottom: 10px;
}

.user_quick_actions h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: #f79837;
}

.user_quick_actions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user_quick_actions ul li {
  margin-bottom: 12px;
}

.user_quick_actions ul li:last-child {
  margin-bottom: 0;
}

.user_quick_actions ul li a {
  display: block;
  padding: 10px 15px;
  border-radius: 5px;
  color: #555;
  transition: all 0.3s ease;
  font-size: 14px;
}

.user_quick_actions ul li a:hover {
  background-color: #fff;
  color: #f79837;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.user_quick_actions ul li a i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

@media (max-width: 991px) {
  .user_stats {
    flex-wrap: wrap;
  }
  
  .stat_item {
    width: calc(50% - 10px);
  }
  
  .user_quick_actions {
    margin-top: 20px;
  }
}

@media (max-width: 575px) {
  .stat_item {
    width: 100%;
  }
}
</style>