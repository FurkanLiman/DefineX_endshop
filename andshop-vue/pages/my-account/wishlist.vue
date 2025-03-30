<template>
    <div>
        <!-- Banner Area -->
        <section id="common_banner_one">
            <div class="container ">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="common_banner_text">
                            <h2>{{this.title}}</h2>
                            <b-breadcrumb :items="breadcrumbItems" class="bg-transparent"></b-breadcrumb>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Checkout-Area -->
        <section id="Wishlist_area" class="ptb-100">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="table_desc">
                            <div class="table_page table-responsive mb-0">
                                <table class="mb-0">
                                    <!-- Start Wishlist Table Head -->
                                    <thead>
                                        <tr>
                                            <th class="product_remove">Kaldır</th>
                                            <th class="product_thumb">Görsel</th>
                                            <th class="product_name">Ürün</th>
                                            <th class="product-price">Fiyat</th>
                                            <th class="product_stock">Stok Durumu</th>
                                            <th class="product_addcart">Sepete Ekle</th>
                                        </tr>
                                    </thead> <!-- End Cart Table Head -->
                                    <tbody v-if="wishlist.length"> 
                                        <!-- Start Wishlist Single Item-->
                                        <tr v-for="( item, index ) in wishlist" :key="index">
                                            <td class="product_remove"><button @click="removeWishlistItem(item)" class="bg-transparent remove-btn"><i class="far fa-trash-alt"></i></button></td>

                                            <td class="product_thumb">
                                                <nuxt-link to="/product">
                                                    <img :src="getImageUrl(item)" alt="img" />
                                                </nuxt-link>
                                            </td>
                                            <td class="product_name"><nuxt-link :to="{ path: `/product/${item.id || 0}` }">{{item.title || 'Ürün Adı'}}</nuxt-link></td>
                                            <td class="product-price">₺{{item.price || 0}}</td>
                                            <td class="product_stock"><h6>{{item.stock > 0 ? 'Stokta' : 'Stokta Yok'}}</h6></td>
                                            <td class="product_addcart">
                                                <button @click="addToCart(item)" class="theme-btn-one btn-black-overlay btn_sm">Sepete Ekle</button>
                                            </td>
                                        </tr> 
                                    </tbody>
                                    <tbody v-else>
                                        <tr><td class="border-0">Favori ürün bulunamadı!</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    name: 'wishlist',

    data() {
        return {
            title: 'Favorilerim',
            // Breadcrumb Items Data
            breadcrumbItems: [
                {
                    text: 'Anasayfa',
                    to: '/'
                },
                {
                    text: 'Favorilerim',
                    to: '/my-account/wishlist'
                }
            ],
            cartProduct: {},
        }
    },

    computed: {
        ...mapGetters({
            wishlist: 'products/wishlistItems',
        }),
        ...mapState({
            productslist: (state) => state.products.productslist,
        }),
    },
    mounted() {
        // For scroll page top for every Route 
        window.scrollTo(0, 0)
        
        // Eğer favoriler boşsa veya formatta hata olabileceğini düşünüyorsak, yeniden yükleyelim
        this.loadWishlist()
    },

    methods: {
        // Favorileri yükleyelim
        loadWishlist() {
            console.log("Wishlist sayfası: Favoriler yükleniyor...")
            this.$store.dispatch('products/fetchUserWishlist')
                .then(wishlist => {
                    console.log("Wishlist sayfası: Favoriler yüklendi:", wishlist)
                })
                .catch(err => {
                    console.error("Wishlist sayfası: Favoriler yüklenirken hata:", err)
                })
        },
      // Image Url 
        getImageUrl(item) {
            // Ürün nesnesi kontrolü
            if (!item) return 'https://via.placeholder.com/300x300';
            
            // API'den gelen farklı formatlara uyumluluk
            // 1. images dizisi içinde src varsa
            if (item.images && Array.isArray(item.images) && item.images.length > 0 && item.images[0].src) {
                const path = item.images[0].src;
                // URL kontrolü
                if (path.startsWith('http')) {
                    return path;
                }
            } 
            
            // 2. Doğrudan image veya imageUrl varsa
            if (item.image) {
                return item.image;
            }
            if (item.imageUrl) {
                return item.imageUrl;
            }
            
            // Fallback olarak 300x300 placeholder
            return 'https://via.placeholder.com/300x300';
        },
        // For Delete/Remove wishlist Item 
        removeWishlistItem: function (product) {
            this.$store.dispatch('products/removeWishlistItem', product)
        },
        // Product Add To Cart realted methods
        addToCart: function(product) {
            // Ürün kontrolü
            if (!product || !product.id) {
                console.error("Geçersiz ürün bilgisi:", product);
                return;
            }
            
            // Sepete eklemeden önce ürünün boyut ve renk bilgisi ekleyelim
            const productToAdd = {
                ...product,
                // Varsayılan boyut ve renk ekleyelim (eğer yoksa)
                selectedSize: product.selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard'),
                selectedColor: product.selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Default')
            };
            
            // Sepete ekle
            this.$store.dispatch('cart/addCart', {
                product: productToAdd,
                quantity: 1
            }).then(result => {
                if (result.success) {
                    // Başarılı bildirim
                    this.cartProduct = productToAdd;
                    this.$emit('showalert', 3); // 3 saniyelik bildirim
                    
                    // Bildirim ekleyelim
                    this.$toast.success(`${product.title} sepete eklendi.`, {
                        duration: 3000
                    });
                } else {
                    console.error("Sepete ekleme başarısız:", result.error);
                    
                    // Hata bildirimi ekleyelim
                    this.$toast.error('Ürün sepete eklenirken bir hata oluştu.', {
                        duration: 3000
                    });
                }
            }).catch(error => {
                console.error("Sepete eklenirken hata:", error);
                
                // Hata bildirimi ekleyelim
                this.$toast.error('Ürün sepete eklenirken bir hata oluştu.', {
                    duration: 3000
                });
            });
        },

        // After Add to cart Alert 
        countDownChanged(dismissCountDown) {
            this.dismissCountDown = dismissCountDown
            this.$emit('alertseconds', this.dismissCountDown)
        },
    },

    // Page head() Title, description for SEO 
    head() {
      return {
        title: this.title,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'Wishlist page - AndShop Ecommerce Vue js, Nuxt js Template'
          }
        ]
      }
    }
}
</script>

<style scoped>
/* Ürün resmi için düzenlemeler */
.product_thumb img {
    width: 80px;
    height: 80px;
    object-fit: contain !important;
    border: 1px solid #eee;
    padding: 5px;
    border-radius: 4px;
    background: #fff;
}

/* Tablo düzenlemeleri */
table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
}

table th {
    background-color: #f8f9fa;
    padding: 12px;
    text-align: center;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #eee;
}

table td {
    padding: 12px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #eee;
}

table tr:last-child td {
    border-bottom: none;
}

.product_name a {
    color: #333;
    font-weight: 500;
    transition: color 0.3s;
}

.product_name a:hover {
    color: #f79837;
}

.product-price {
    font-weight: 600;
    color: #333;
}

.remove-btn {
    border: none;
    background: transparent;
    color: #dc3545;
    transition: all 0.3s;
    padding: 5px;
    cursor: pointer;
}

.remove-btn:hover {
    color: #bd2130;
    transform: scale(1.2);
}

.theme-btn-one {
    transition: all 0.3s;
}

.theme-btn-one:hover {
    background-color: #333;
    color: #fff;
}
</style>