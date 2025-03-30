<template>
  <div>
    <!-- Start Header Area -->
    <header class="header-section d-none d-xl-block">
      <div class="header-wrapper">
        <div
          id="header"
          class="
            header-bottom
            header-bottom-color--golden
            section-fluid
            sticky-header
            sticky-color--golden
          "
        >
          <div class="container">
            <div class="row">
              <div
                class="col-12 d-flex align-items-center justify-content-between"
              >
                <!-- Start Header Logo -->
                <div class="header-logo">
                  <div class="logo">
                    <nuxt-link to="/"
                      ><img :src="require('@/assets/img/logo.png')" alt="logo"
                    /></nuxt-link>
                  </div>
                </div>
                <!-- End Header Logo -->

                <!-- Start Header Main Menu -->
                <div
                  class="main-menu menu-color--black menu-hover-color--golden"
                >
                  <nav>
                    <ul>
                      <li class="has-dropdown">
                        <a href="#">Kategoriler <i class="fa fa-angle-down"></i></a>
                        <!-- Sub Menu -->
                        <ul class="sub-menu">
                          <li><nuxt-link to="/shop">Tüm Ürünler</nuxt-link></li>
                          <li v-for="(category, index) in categories" :key="index">
                            <nuxt-link :to="`/shop?category=${encodeURIComponent(category)}`">
                              {{ category }}
                            </nuxt-link>
                          </li>
                        </ul>
                      </li>

                     
                      <li class="has-dropdown">
                        <a href="#">Hakkımızda <i class="fa fa-angle-down"></i></a>
                        <!-- Sub Menu -->
                        <ul class="sub-menu">
                          <li><nuxt-link to="about-us">Biz Kimiz</nuxt-link></li>
                          
                        </ul>
                      </li>

                      <li class="has-dropdown">
                        <a href="#">Bize Ulaşın <i class="fa fa-angle-down"></i></a>
                        <!-- Sub Menu -->
                        <ul class="sub-menu">
                          <li><nuxt-link to="contact-us">Bize Ulaşın</nuxt-link></li>
                          
                        </ul>
                      </li>
                       <li class="has-dropdown">
                        <a href="#">Hesabım <i class="fa fa-angle-down"></i></a>
                        <!-- Sub Menu -->
                        <ul class="sub-menu">
                          <li v-if="isAuthenticated"><nuxt-link to="/profile">Profilim</nuxt-link></li>
                          <li v-if="isAuthenticated"><nuxt-link to="/profile?tab=orders">Siparişlerim</nuxt-link></li>
                          <li v-if="isAuthenticated"><nuxt-link to="/profile?tab=addresses">Adreslerim</nuxt-link></li>
                          <li v-if="isAdmin">
                            <nuxt-link to="/admin">
                              <i class="fas fa-user-shield mr-2"></i> Admin Paneli
                            </nuxt-link>
                          </li>
                          <li v-if="isAuthenticated"><a href="#" @click.prevent="logout">Çıkış Yap</a></li>
                          <li v-if="!isAuthenticated"><nuxt-link to="/login">Giriş Yap</nuxt-link></li>
                          <li v-if="!isAuthenticated"><nuxt-link to="/register">Kayıt Ol</nuxt-link></li>
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
                <!-- End Header Main Menu Start -->

                <!-- Start Header Action Link -->
                <ul
                  class="
                    header-action-link
                    action-color--black
                    action-hover-color--golden
                  "
                >
                  <!-- User Profile Dropdown - Authenticated User -->
                  <li v-if="isAuthenticated" class="user-profile-dropdown">
                    <a href="#" class="user-profile-toggle" @click.prevent="toggleProfileMenu">
                      <div class="user-avatar">
                        <img :src="userAvatar" :alt="userName" />
                        <span class="username">{{ userName }}</span>
                      </div>
                    </a>
                    <div class="profile-dropdown-menu" :class="{ 'show': isProfileMenuOpen }">
                      <div class="dropdown-header">
                        <div class="user-info">
                          <div class="user-avatar">
                            <img :src="userAvatar" :alt="userName" />
                          </div>
                          <div class="user-details">
                            <h4>{{ userName }}</h4>
                            <p>{{ user && user.email ? user.email : 'kullanici@email.com' }}</p>
                          </div>
                        </div>
                      </div>
                      <ul>
                        <li>
                          <nuxt-link to="/profile">
                            <i class="fas fa-user mr-2"></i> Profilim
                          </nuxt-link>
                        </li>
                        <li>
                          <nuxt-link to="/profile?tab=orders">
                            <i class="fas fa-shopping-bag mr-2"></i> Siparişlerim
                          </nuxt-link>
                        </li>
                        <li>
                          <nuxt-link to="/profile?tab=addresses">
                            <i class="fas fa-map-marker-alt mr-2"></i> Adreslerim
                          </nuxt-link>
                        </li>
                        <li v-if="isAdmin">
                          <nuxt-link to="/admin">
                            <i class="fas fa-user-shield mr-2"></i> Admin Paneli
                          </nuxt-link>
                        </li>
                        <li class="dropdown-divider"></li>
                        <li>
                          <a href="#" @click.prevent="logout">
                            <i class="fas fa-sign-out-alt mr-2"></i> Çıkış Yap
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  
                  <li v-if="!isAuthenticated">
                    <nuxt-link to="/login" class="login-btn">
                      <i class="fas fa-user"></i>
                      <span class="action-text">Giriş Yap</span>
                    </nuxt-link>
                  </li>
                  
                  <li>
                    <a v-b-toggle.offcanvas-wishlish class="offcanvas-toggle">
                      <i class="far fa-heart"></i>
                      <span class="item-count">{{ wishlistLength }}</span>
                    </a>
                  </li>
                  <li>
                    <a v-b-toggle.offcanvas-add-cart class="offcanvas-toggle">
                      <i class="fas fa-shopping-bag"></i>
                      <span class="item-count">{{ cartLength }}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      v-b-toggle.search_sidebar
                      class="search_width offcanvas-toggle"
                    >
                      <img src="~/assets/img/svg/search.svg" alt="img" />
                    </a>
                  </li>
                  <li>
                    <a
                      v-b-toggle.offcanvas-about
                      class="offacnvas offside-about offcanvas-toggle"
                      ><i class="fas fa-bars"></i
                    ></a>
                  </li>
                </ul>
                <!-- End Header Action Link -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <!-- Start Header Area -->

    <!-- Start Mobile Header -->
    <div
      id="mobile_header"
      class="
        mobile-header
        sticky-header
        sticky-color--golden
        mobile-header-bg-color--golden
        section-fluid
        d-lg-block d-xl-none
      "
    >
      <div class="container">
        <div class="row">
          <div class="col-12 d-flex align-items-center justify-content-between">
            <!-- Start Mobile Left Side -->
            <div class="mobile-header-left">
              <ul class="mobile-menu-logo">
                <li>
                  <nuxt-link to="/">
                    <div class="logo">
                      <img :src="require('@/assets/img/logo.png')" alt="logo" />
                    </div>
                  </nuxt-link>
                </li>
              </ul>
            </div>
            <!-- End Mobile Left Side -->

            <!-- Start Mobile Right Side -->
            <div class="mobile-right-side">
              <ul
                class="
                  header-action-link
                  action-color--black
                  action-hover-color--golden
                "
              >
                <li>
                  <a
                    v-b-toggle.search_sidebar
                    class="search_width offcanvas-toggle"
                  >
                    <img src="~/assets/img/svg/search.svg" alt="img" />
                  </a>
                </li>
                <li>
                  <a v-b-toggle.offcanvas-wishlish class="offcanvas-toggle">
                    <i class="far fa-heart"></i>
                    <span class="item-count">{{ wishlistLength }}</span>
                  </a>
                </li>
                <li>
                  <a v-b-toggle.offcanvas-add-cart class="offcanvas-toggle">
                    <i class="fas fa-shopping-bag"></i>
                    <span class="item-count">{{ cartLength }}</span>
                  </a>
                </li>
                <li>
                  <a
                    v-b-toggle.offcanvas-about
                    class="offacnvas offside-about offcanvas-toggle"
                    ><i class="fas fa-bars"></i
                  ></a>
                </li>
              </ul>
            </div>
            <!-- End Mobile Right Side -->
          </div>
        </div>
      </div>
    </div>
    <!-- End Mobile Header -->

    <!-- ...:::: Start Offcanvas Mobile Menu Section:::... -->
    <b-sidebar
      id="offcanvas-about"
      class="offcanvas-mobile-about-section"
      backdrop
      right
    >
      <!-- Start Mobile Menu Navbar Wrap -->
      <div class="mobile-menu-navbar-wrap">
        <!-- Start Mobile Menu Nav -->
        <div class="offcanvas-menu">
          <app-sidebar-menu></app-sidebar-menu>
        </div>
        <!-- End Mobile Menu Nav -->
      </div>
      <!-- End Mobile Menu Navbar Wrap -->

      <!-- Start Mobile contact Info -->
      <div class="mobile-contact-info">
        <address class="address">
          <img :src="require('@/assets/img/logo-white.png')" alt="logo" />
          <span>Adres: İstanbul / Bahçeşehir</span>
          <span>Bizi Arayın: 0212 352 05 22, 0123456789</span>
          <span>Email: info@opendart.com</span>
        </address>

        <ul class="social-link">
          <li>
            <a href="#"><i class="fab fa-facebook-f"></i></a>
          </li>
          <li>
            <a href="#"><i class="fab fa-twitter"></i></a>
          </li>
          <li>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </li>
          <li>
            <a href="#"><i class="fab fa-linkedin"></i></a>
          </li>
        </ul>

        <ul class="user-link">
          <li v-if="isAuthenticated"><nuxt-link to="/profile">Profilim</nuxt-link></li>
          <li v-if="isAuthenticated"><nuxt-link to="/profile?tab=orders">Siparişlerim</nuxt-link></li>
          <li v-if="isAuthenticated"><a href="#" @click.prevent="logout">Çıkış Yap</a></li>
          <li v-if="!isAuthenticated"><nuxt-link to="/login">Giriş Yap</nuxt-link></li>
          <li v-if="!isAuthenticated"><nuxt-link to="/register">Kayıt Ol</nuxt-link></li>
          <li><nuxt-link to="/cart/">Sepet</nuxt-link></li>
        </ul>
      </div>
      <!-- End Mobile contact Info -->
    </b-sidebar>
    <!-- ...:::: End Offcanvas Mobile Menu Section:::... -->

    <!-- Start Offcanvas Addcart Section -->
    <b-sidebar
      id="offcanvas-add-cart"
      class="offcanvas-add-cart-section"
      backdrop
      right
    >
      <div class="offcanvas-add-cart-wrapper">
        <h4 class="offcanvas-title">Alışveriş Sepeti</h4>
        <div v-if="cart && cart.length">
          <ul class="offcanvas-cart">
            <li
              class="offcanvas-cart-item-single"
              v-for="(item, index) in cart"
              :key="index"
            >
              <div class="offcanvas-cart-item-block">
                <nuxt-link
                  :to="{ path: '/product/' + item.id }"
                  class="offcanvas-cart-item-image-link"
                >
                  <img
                    :src="getImageUrl(item.image)"
                    alt="img"
                    class="offcanvas-cart-image"
                  />
                </nuxt-link>
                <div class="offcanvas-cart-item-content">
                  <nuxt-link
                    :to="{ path: '/product/' + item.id }"
                    class="offcanvas-cart-item-link"
                    >{{ item.title }}</nuxt-link
                  >
                  <div class="offcanvas-cart-item-details">
                    <span class="offcanvas-cart-item-details-quantity"
                      >{{ item.quantity }} x</span
                    >
                    <span
                      v-if="item.discountPrice"
                      class="offcanvas-cart-item-details-price"
                      >₺{{ item.discountPrice }}</span
                    >
                    <span v-else class="offcanvas-cart-item-details-price"
                      >₺{{ item.price }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="offcanvas-cart-item-delete text-right">
                <button
                  @click="removeCartItem(item)"
                  class="offcanvas-cart-item-delete bg-transparent remove-btn"
                >
                  <i class="far fa-trash-alt"></i>
                </button>
              </div>
            </li>
          </ul>

          <div class="offcanvas-cart-total-price">
            <span class="offcanvas-cart-total-price-text">Toplam:</span>
            <span class="offcanvas-cart-total-price-value"
              >₺{{ cartTotal }}</span
            >
          </div>

          <ul class="offcanvas-cart-action-button">
            <li>
              <nuxt-link
                to="/cart"
                class="theme-btn-one btn-black-overlay btn_md"
                >Sepeti Görüntüle</nuxt-link
              >
            </li>
            <li>
              <nuxt-link
                to="/checkout"
                class="theme-btn-one btn-black-overlay btn_md"
                >Siparişi Tamamla</nuxt-link
              >
            </li>
          </ul>
        </div>

        <ul v-else class="offcanvas-cart">
          <li>Sepetiniz Boş!</li>
        </ul>
      </div>
    </b-sidebar>
    <!-- End  Offcanvas Addcart Section -->

    <!-- Start Offcanvas Wishlist Sidebar Section -->
    <b-sidebar
      id="offcanvas-wishlish"
      class="offcanvas-add-cart-section"
      backdrop
      right
    >
      <div class="offcanvas-wishlist-wrapper">
        <h4 class="offcanvas-title">Favoriler</h4>

        <div v-if="wishlist && wishlist.length">
          <ul class="offcanvas-wishlist">
            <li
              class="offcanvas-wishlist-item-single"
              v-for="(item, index) in wishlist"
              :key="index"
            >
              <div class="offcanvas-wishlist-item-block">
                <nuxt-link
                  :to="{ path: '/product/' + item.id }"
                  class="offcanvas-wishlist-item-image-link"
                >
                  <img
                    :src="getImageUrl(item.image)"
                    alt="img"
                    class="offcanvas-wishlist-image"
                  />
                </nuxt-link>
                <div class="offcanvas-wishlist-item-content">
                  <nuxt-link
                    :to="{ path: '/product/' + item.id }"
                    class="offcanvas-wishlist-item-link"
                    >{{ item.title }}</nuxt-link
                  >
                  <div class="offcanvas-wishlist-item-details">
                    <span class="offcanvas-wishlist-item-details-quantity"
                      >{{ item.quantity || 1 }} x</span
                    >
                    <span
                      v-if="item.discountPrice"
                      class="offcanvas-wishlist-item-details-price"
                      >₺{{ item.discountPrice }}</span
                    >
                    <span v-else class="offcanvas-wishlist-item-details-price"
                      >₺{{ item.price }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="offcanvas-wishlist-item-delete text-right">
                <button
                  @click="removeWishlistItem(item)"
                  class="
                    offcanvas-wishlist-item-delete
                    bg-transparent
                    remove-btn
                  "
                >
                  <i class="far fa-trash-alt"></i>
                </button>
              </div>
            </li>
          </ul>
          <ul class="offcanvas-wishlist-action-button">
            <li>
              <nuxt-link
                to="/my-account/wishlist"
                class="theme-btn-one btn-black-overlay btn_md"
                >Favorileri Görüntüle</nuxt-link
              >
            </li>
          </ul>
        </div>

        <ul v-else class="offcanvas-wishlist">
          <li>Hiç favari ürünüz yok!</li>
        </ul>
      </div>
    </b-sidebar>
    <!-- End Offcanvas Wishlist Sidebar Section -->

    <!-- Start Offcanvas Search Bar Section -->
    <b-sidebar id="search_sidebar" backdrop>
      <div
        class="
          px-3
          py-2
          search-sidebar-content-wrap
          d-flex
          justify-content-center
          align-content-center
          w-100
          h-100
        "
      >
        <form
          class="d-flex flex-column justify-content-center product-search-form"
        >
          <input
            type="search"
            placeholder="Ürün adı yazınız..."
            v-model="searchString"
            @keyup="searchProduct"
          />
          <button class="btn btn-lg btn-golden">Ara</button>

          <!-- Show search product here -->
          <ul v-if="searchItems.length" class="search-results-wrap">
            <li v-for="(product, index) in searchItems" :key="index">
              <div class="offcanvas-cart-item-block mb-3">
                <nuxt-link
                  :to="{ path: '/product/' + product.id }"
                  class="offcanvas-cart-item-image-link"
                >
                  <img
                    :src="getImageUrl(product.images[0].src)"
                    alt="img"
                    class="offcanvas-cart-image"
                  />
                </nuxt-link>
                <div class="offcanvas-cart-item-content">
                  <nuxt-link
                    :to="{ path: '/product/' + product.id }"
                    class="offcanvas-cart-item-link text-white"
                    >{{ product.title }}</nuxt-link
                  >
                  <div class="offcanvas-cart-item-details">
                    <span
                      v-if="product.discount"
                      class="offcanvas-cart-item-details-price text-white"
                      >₺{{ discountedPrice(product) }}</span
                    >
                    <span
                      v-else
                      class="offcanvas-cart-item-details-price text-white"
                      >₺{{ product.price }}</span
                    >
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <!-- Show search product here -->
        </form>
      </div>
    </b-sidebar>
    <!-- End Offcanvas Search Bar Section -->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import SidebarMenu from 'vue-sidebar-menu';
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css';
import AppSidebarMenu from '~/components/SidebarMenu.vue';

export default {
  name: 'Header',
  components: {
    SidebarMenu,
    AppSidebarMenu
  },
  data() {
    return {
      isProfileMenuOpen: false,
      menu: [
        {
          title: 'Anasayfa',
          href: '/',
          icon: 'fa fa-home',
        },
        {
          title: 'Kategoriler',
          icon: 'fa fa-shopping-bag',
          child: [
            {
              href: '/shop',
              title: 'Filtrele',
            },
          ],
        },
        {
          title: 'Hakkımızda',
          icon: 'fa fa-info-circle',
          child: [
            {
              href: '/about-us',
              title: 'Biz Kimiz',
            },
          ],
        },
        {
          title: 'Bize Ulaşın',
          icon: 'fa fa-envelope',
          child: [
            {
              href: '/contact-us',
              title: 'Bize Ulaşın',
            },
          ],
        },
        {
          title: 'Hesabım',
          icon: 'fa fa-user',
          child: [
            {
              href: '/login',
              title: 'Giriş Yap',
              hidden: true, // Dinamik olarak gösterilecek
            },
            {
              href: '/register',
              title: 'Kayıt Ol',
              hidden: true, // Dinamik olarak gösterilecek
            },
            {
              href: '/profile',
              title: 'Profilim',
              hidden: true, // Dinamik olarak gösterilecek
            },
            {
              href: '/profile?tab=orders',
              title: 'Siparişlerim',
              hidden: true, // Dinamik olarak gösterilecek
            },
            {
              href: '/profile?tab=addresses',
              title: 'Adreslerim',
              hidden: true, // Dinamik olarak gösterilecek
            },
            {
              title: 'Çıkış Yap',
              hidden: true, // Dinamik olarak gösterilecek
              href: '#',
              data: {
                action: 'logout'
              }
            },
          ],
        },
      ],
      products: [],
      category: [],
      cartproduct: {},
      searchString: "",
      defaultUserAvatar: "https://ui-avatars.com/api/?name=Kullanici&background=F79837&color=fff"
    };
  },

  mounted: function () {
    // Menu Js
    this.$nextTick(function () {
      window.onscroll = function () {
        myFunction();
      };

      var header = document.getElementById("header");
      var mobile_header = document.getElementById("mobile_header");
      
      // Null kontrolleri ekle
      if (header && mobile_header) {
        var sticky = header.offsetTop;

        function myFunction() {
          if (window.pageYOffset > sticky) {
            header.classList.add("sticky");
            mobile_header.classList.add("sticky");
          } else {
            header.classList.remove("sticky");
            mobile_header.classList.remove("sticky");
          }
        }
      }
    });
    // Menu End
    
    // Kategorileri yükle
    this.$store.dispatch('products/fetchCategories').then(() => {
      this.updateCategoriesMenu();
    });
  },

  computed: {
    ...mapState({
      productslist: (state) => state.products.productslist,
      searchItems: (state) => state.products.searchProduct,
    }),
    ...mapGetters({
      cart: "cart/getCartItems",
      cartTotal: "cart/cartTotal",
      wishlist: "products/wishlistItems",
      isAuthenticated: "user/isAuthenticated",
      user: 'user/currentUser',
      categories: 'products/getCategories',
      isAdmin: 'user/isAdmin'
    }),
    // Cart ve wishlist uzunluğu için güvenli getter'lar
    cartLength() {
      return this.cart ? this.cart.length : 0;
    },
    wishlistLength() {
      return this.wishlist ? this.wishlist.length : 0;
    },
    userName() {
      if (this.user) {
        return `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim() || 'Kullanıcı';
      }
      return 'Kullanıcı';
    },
    userAvatar() {
      if (this.user && this.user.avatar) {
        return this.user.avatar;
      }
      // Varsayılan avatar
      return `https://ui-avatars.com/api/?name=${this.userName}&background=f79837&color=fff`;
    }
  },

  watch: {
    // Kullanıcı durumu değiştiğinde menüyü güncelle
    isAuthenticated: {
      immediate: true,
      handler(value) {
        this.updateMenuItems(value);
      }
    },
    // Kategoriler değiştiğinde menüyü güncelle
    categories: {
      immediate: true,
      handler() {
        this.updateCategoriesMenu();
      }
    }
  },

  methods: {
    ...mapActions({
      removeItemFromCart: 'cart/removeFromCart',
      userLogout: 'user/logout',
      fetchCategories: 'products/fetchCategories' // Kategorileri getiren action
    }),
    // For Get Image Url
    getImageUrl(image) {
      // API'den gelen URL'yi kontrol et
      if (image && image.startsWith('http')) {
        return image;
      }
      
      // Görsel yoksa veya API url değilse varsayılan görsel
      return require('@/assets/img/logo.png');
    },

    // For Delete/Remove Product Item
    removeCartItem: function (product) {
      this.removeItemFromCart(product);
    },
    // For Delete/Remove wishlist Item
    removeWishlistItem: function (product) {
      this.$store.dispatch("products/removeWishlistItem", product);
    },
    searchProduct() {
      if (!this.searchString || this.searchString.trim() === '') {
        return;
      }
      this.$store.dispatch("products/searchProduct", this.searchString);
    },
    toggleProfileMenu() {
      this.isProfileMenuOpen = !this.isProfileMenuOpen;
    },
    // Profil menüsü dışında bir yere tıklandığında menüyü kapat
    closeProfileMenu(event) {
      if (this.isProfileMenuOpen && !event.target.closest('.user-profile-dropdown')) {
        this.isProfileMenuOpen = false;
      }
    },
    // Mobil sidebar menüsünü kullanıcı durumuna göre güncelle
    updateMenuItems(isLoggedIn) {
      // Hesabım alt menüsünü bul
      const accountMenu = this.menu.find(item => item.title === 'Hesabım');
      if (accountMenu && accountMenu.child) {
        // Giriş ve kayıt menülerini güncelle
        accountMenu.child.forEach(item => {
          if (item.title === 'Giriş Yap' || item.title === 'Kayıt Ol') {
            item.hidden = isLoggedIn;
          } else if (item.title === 'Profilim' || item.title === 'Siparişlerim' || 
                     item.title === 'Adreslerim' || item.title === 'Çıkış Yap') {
            item.hidden = !isLoggedIn;
          }
        });
      }
    },
    
    async logout() {
      try {
        await this.userLogout();
        this.$toast.success('Başarıyla çıkış yaptınız');
        
        // Profil menüsünü kapat
        this.isProfileMenuOpen = false;
        
        // Ana sayfaya yönlendir
        if (this.$route.path !== '/') {
          this.$router.push('/');
        }
      } catch (error) {
        console.error('Çıkış yapılırken hata:', error);
        this.$toast.error('Çıkış yapılırken bir hata oluştu');
      }
    },
    
    getImageUrl(image) {
      // API'den gelen URL'yi kontrol et
      if (image && image.startsWith('http')) {
        return image;
      }
      
      // Görsel yoksa veya API url değilse varsayılan görsel
      return require('@/assets/img/logo.png');
    },
    // Kategoriler menüsünü güncelleme
    updateCategoriesMenu() {
      if (!this.categories || !Array.isArray(this.categories) || this.categories.length === 0) {
        return;
      }
      
      // Mevcut menü öğelerini bul
      const categoryMenuIndex = this.menu.findIndex(item => item.title === 'Kategoriler');
      if (categoryMenuIndex === -1) return;
      
      // Menü öğesini al
      const categoryMenu = this.menu[categoryMenuIndex];
      
      // Alt menü öğelerini güncelle
      categoryMenu.child = [
        {
          href: '/shop',
          title: 'Tüm Ürünler'
        },
        // Kategorileri ekle
        ...this.categories.map(category => ({
          href: `/shop?category=${encodeURIComponent(category)}`,
          title: category
        }))
      ];
      
      // Menüyü güncelle
      this.$set(this.menu, categoryMenuIndex, categoryMenu);
    }
  },
  mounted() {
    // Sayfa içinde herhangi bir yere tıklandığında profil menüsünü kapat
    document.addEventListener('click', this.closeProfileMenu);
  },
  beforeDestroy() {
    // Component destroy edildiğinde listener'ı temizle
    document.removeEventListener('click', this.closeProfileMenu);
  }
};
</script>

<style>
/* Mobile Menu Multi Dropdown Items Start */
.v-sidebar-menu .vsm--toggle-btn {
  display: none;
}
.v-sidebar-menu {
  position: relative;
  background-color: transparent;
}
.v-sidebar-menu.vsm_expanded .vsm--item_open .vsm--link_level-1 {
  background-color: var(--main-theme-color);
}
.v-sidebar-menu .vsm--link_level-1.vsm--link_exact-active,
.v-sidebar-menu .vsm--link_level-1.vsm--link_active {
  -webkit-box-shadow: 3px 0px 0px 0px var(--main-theme-color) inset;
  box-shadow: 3px 0px 0px 0px var(--main-theme-color) inset;
}
/* Mobile Menu Multi Dropdown Items End */

/* User Profile Dropdown Styles */
.user-profile-dropdown {
  position: relative;
}

.user-profile-toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-avatar {
  display: flex;
  align-items: center;
}

.user-avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f79837;
}

.username {
  margin-left: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  letter-spacing: 0.3px;
}

.profile-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.15);
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 100;
  margin-top: 10px;
  overflow: hidden;
}

.profile-dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f9f9f9;
}

.dropdown-header .user-info {
  display: flex;
  align-items: center;
}

.dropdown-header .user-avatar {
  margin-right: 15px;
}

.dropdown-header .user-avatar img {
  width: 50px;
  height: 50px;
  border: 2px solid #f79837;
}

.dropdown-header .user-details h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.dropdown-header .user-details p {
  margin: 5px 0 0;
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.profile-dropdown-menu ul {
  list-style: none;
  padding: 8px 0;
  margin: 0;
  background-color: #fff;
}

.profile-dropdown-menu ul li {
  border-bottom: 1px solid #f0f0f0;
}

.profile-dropdown-menu ul li:last-child {
  border-bottom: none;
}

.profile-dropdown-menu ul li a {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #333;
  font-size: 15px;
  transition: all 0.3s ease;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.3px;
}

.profile-dropdown-menu ul li a:hover {
  background-color: #f7f7f7;
  color: #f79837;
}

.profile-dropdown-menu ul li a i {
  margin-right: 15px;
  width: 20px;
  text-align: center;
  font-size: 16px;
  color: #f79837;
}

.dropdown-divider {
  height: 1px;
  margin: 8px 0;
  overflow: hidden;
  background-color: #f0f0f0;
}

.login-btn {
  display: flex;
  align-items: center;
  color: #333;
}

.login-btn i {
  font-size: 18px;
}

.action-text {
  font-size: 13px;
  margin-left: 5px;
  font-weight: 500;
}
</style>