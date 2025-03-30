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

    <!-- Shop Main Area -->
    <section id="shop_main_area" class="ptb-100">
        <div class="container">
            <div class="row">
                <div class="col-lg-6 col-md-12">
                    <div class="product_filter">
                        <div class="customs_selects">
                            <select name="product" class="customs_sel_box" @change="sortProducts">
                                <option value="default">Sırala</option>
                                <option value="popularity">Popüler Ürünler</option>
                                <option value="new">En Yeni Ürünler</option>
                                <option value="low">Fiyat: Düşükten Yükseğe</option>
                                <option value="high">Fiyat: Yüksekten Düşüğe</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12">
                    <div class="product_shot">
                        <div class="product_shot_title">
                            <p>Görüntüleme:</p>
                        </div>
                        <div class="product_shot_view">
                            <ul>
                                <li><button @click="setViewMode('list')" :class="{'active': viewMode === 'list'}"><i class="fas fa-list"></i></button></li>
                                <li><button @click="setViewMode('grid-large')" :class="{'active': viewMode === 'grid-large'}"><i class="fas fa-th-large"></i></button></li>
                                <li><button @click="setViewMode('grid')" :class="{'active': viewMode === 'grid'}"><i class="fas fa-th"></i></button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4 flex-column-reverse flex-lg-row">
                <!-- Sağ Kolon: Filtreler -->
                <div class="col-lg-3">
                    <div class="filter-container">
                        <div class="filter-section">
                            <h5>Filtreler</h5>
                            <button class="theme-btn-one bg-black btn_sm ml-auto" @click="resetFilters" v-if="hasActiveFilters">
                                Temizle
                            </button>
                        </div>
                        
                        <!-- Kategori Filtresi -->
                        <div class="filter-section" v-if="$route.query.category">
                            <h6>Seçili Kategori</h6>
                            <div class="selected-category">
                                <span class="category-tag">{{ selectedCategory }} <button @click="resetCategory" class="clear-category-btn"><i class="fas fa-times"></i></button></span>
                                <div class="mt-2">
                                    <button @click="resetCategory" class="theme-btn-one btn_sm bg-black mt-2">Tüm Ürünleri Göster</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Kategori Filtresi - Sadece ana sayfada göster -->
                        <div class="filter-section" v-else>
                            <h6>Kategori</h6>
                            <div class="category-buttons">
                                <button 
                                    class="filter-btn" 
                                    :class="{'active': selectedCategory === null}"
                                    @click="filterByCategory(null)">
                                    Tümü
                                </button>
                                <button 
                                    v-for="(category, index) in categories" 
                                    :key="index"
                                    class="filter-btn" 
                                    :class="{'active': selectedCategory === category}"
                                    @click="filterByCategory(category)">
                                    {{ category }}
                                </button>
                            </div>
                        </div>
                        
                        <!-- Fiyat Filtresi -->
                        <div class="filter-section">
                            <h6>Fiyat Aralığı</h6>
                            <div class="price-slider">
                                <div class="price-inputs">
                                    <div class="price-input">
                                        <span>Min: ₺{{ minPrice }}</span>
                                        <input 
                                            type="range" 
                                            :min="priceRange.min" 
                                            :max="priceRange.max" 
                                            v-model.number="minPrice"
                                            @input="applyFilters">
                                    </div>
                                    <div class="price-input">
                                        <span>Max: ₺{{ maxPrice }}</span>
                                        <input 
                                            type="range" 
                                            :min="priceRange.min" 
                                            :max="priceRange.max" 
                                            v-model.number="maxPrice"
                                            @input="applyFilters">
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Beden Filtresi -->
                        <div class="filter-section">
                            <h6>Beden</h6>
                            <div v-if="selectedCategory === null" class="size-not-available">
                                <p class="size-disabled-message">Beden filtrelemek için önce bir kategori seçin</p>
                            </div>
                            <div v-else class="size-buttons">
                                <button 
                                    v-for="size in availableSizes" 
                                    :key="size"
                                    class="size-btn" 
                                    :class="{'active': selectedSizes.includes(size)}"
                                    @click="toggleSizeFilter(size)">
                                    {{ size }}
                                </button>
                            </div>
                        </div>
                        
                        <!-- Renk Filtresi -->
                        <div class="filter-section">
                            <h6>Renk</h6>
                            <div class="color-buttons">
                                <div 
                                    v-for="color in availableColors" 
                                    :key="color"
                                    class="color-btn-wrapper"
                                    :title="color">
                                    <button 
                                    class="color-btn" 
                                        :class="{'active': selectedColors.includes(color), 'white-color': color.toLowerCase() === 'white'}"
                                    :style="{'background-color': getColorHex(color)}"
                                    @click="toggleColorFilter(color)">
                                </button>
                                    <span class="color-name">{{ color }}</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Koleksiyon Filtresi -->
                        <div class="filter-section">
                            <h6>Koleksiyon</h6>
                            <div class="collection-buttons">
                                <button 
                                    v-for="collection in availableCollections" 
                                    :key="collection"
                                    class="filter-btn" 
                                    :class="{'active': selectedCollections.includes(collection)}"
                                    @click="toggleCollectionFilter(collection)">
                                    {{ collection }}
                                </button>
                        </div>
                    </div>
                </div>
            </div>
            
                <!-- Sol Kolon: Ürün Listesi -->
                <div class="col-lg-9">
            <!-- Yükleniyor Durumu -->
                    <div v-if="isPageLoading" class="text-center py-5">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin fa-3x"></i>
                        <p class="mt-3">Ürünler yükleniyor...</p>
                </div>
            </div>
            
            <!-- Hata Durumu -->
                    <div v-else-if="hasError" class="text-center py-5">
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle fa-3x text-danger"></i>
                        <p class="mt-3 text-danger">{{ getError }}</p>
                        <button class="theme-btn-one bg-black btn_sm mt-3" @click="retryLoading">Tekrar Dene</button>
                </div>
            </div>
            
                <!-- Ürün bulunamadı gösterimi -->
                    <div v-else-if="!filteredProducts || filteredProducts.length === 0" class="text-center py-5">
                    <div class="no-product-message">
                        <i class="fas fa-search fa-3x mb-3"></i>
                        <p>Bu kriterlere uygun ürün bulunamadı.</p>
                        <button class="theme-btn-one bg-black btn_sm" @click="resetFilters">
                            Filtreleri Temizle
                        </button>
                    </div>
                </div>

                <!-- Ürün listeleme -->
                    <div v-else>
                        <!-- Product Grid / List View -->
                        <div class="product-grid-container">
                            <div class="row">
                                <div 
                        v-for="(product, index) in filteredProducts" 
                        :key="product.id" 
                                    v-show="index >= (current - 1) * paginate && index < current * paginate"
                                    :class="{
                                        'col-lg-4 col-md-6 col-sm-6': viewMode === 'grid',
                                        'col-lg-3 col-md-4 col-sm-6': viewMode === 'grid-large',
                                        'col-12': viewMode === 'list'
                                    }"
                                    class="mb-4">
                        <ProductBox1 
                            :product="product" 
                            :index="index" 
                                        :view-mode="viewMode"
                            @showalert="alert" 
                            @alertseconds="alert" />
                                </div>
                            </div>
                    </div>
                    
                    <!-- Sayfalama -->
                        <div class="row mt-4" v-if="filteredProducts.length > this.paginate">
                            <div class="col-12">
                                <div class="product-pagination mb-0">
                        <nav aria-label="Page navigation">
                            <ul class="pagination">
                                    <li class="page-item" :class="{'disabled': current === 1}">
                                        <a class="page-link" href="javascript:void(0)" @click="updatePaginate(current-1)">
                                        <span aria-hidden="true">
                                        <i class="fa fa-chevron-left" style="font-size:10px;" aria-hidden="true"></i>
                                        </span>
                                    </a>
                                </li>
                                    <li 
                                        class="page-item" 
                                        v-for="(page_index, index) in this.pages" 
                                        :key="index" 
                                        :class="{'active': page_index == current}">
                                    <a
                                        class="page-link"
                                            href="javascript:void(0)"
                                            @click.prevent="updatePaginate(page_index)">
                                            {{ page_index }}
                                        </a>
                                </li>
                                    <li class="page-item" :class="{'disabled': current === pages.length}">
                                    <a class="page-link" href="javascript:void(0)" @click="updatePaginate(current+1)">
                                        <span aria-hidden="true">
                                        <i class="fa fa-chevron-right" style="font-size:10px;" aria-hidden="true"></i>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Instagram Arae -->
    <InstagramArea />

    <!-- Add to cart Alert / Notification  -->
    <b-alert
      :show="dismissCountDown"
      dismissible
      fade
      variant="success"
      @dismissed="dismissCountDown=0"
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
      @dismissed="dismissCountDown=0"
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
import { mapState, mapGetters, mapActions } from 'vuex'
import ProductBox1 from '~/components/product-box/ProductBox1'
import InstagramArea from '~/components/instagram/InstagramArea'

export default {
    name: 'shop-four-grid',
    components: {
        ProductBox1,
        InstagramArea
    },
    data() {
        return {
            title: "Shop",
            breadcrumbItems: [
                {
                    text: 'Ana Sayfa',
                    href: '/'
                },
                {
                    text: 'Mağaza',
                    active: true
                }
            ],

            // Sayfalama ayarları
            current: 1,
            paginate: 12,
            page_array: [],
            pages: [],
            paginateProducts: [],
            
            // Filtre ayarları
            selectedCategory: null,
            minPrice: 0,
            maxPrice: 1000,
            priceRange: {
                min: 0,
                max: 1000
            },
            selectedSizes: [],
            selectedColors: [],
            selectedCollections: [],
            availableSizes: [],
            availableColors: [],
            availableCollections: [],
            
            // UI durumları
            isPageLoading: false,
            hasActiveFilters: false,
            viewMode: 'grid',
            dismissCountDown: 0,
            dismissSecs: 3,
            
            // Kategori çevirileri
            categoryTranslations: {
                "men's clothing": "Erkek Giyim",
                "women's clothing": "Kadın Giyim",
                "electronics": "Elektronik",
                "jewelery": "Takı"
            },
            
            // URL'den gelecek filtre/sıralama seçeneği
            urlSortOption: null,
            urlDiscount: false
        }
    },
    computed: {
        ...mapState({
            products: state => state.products.products,
            shuffleproducts: state => state.products.shuffleproducts,
        }),
        ...mapGetters({
            isLoading: 'products/isLoading',
            hasError: 'products/hasError',
            getError: 'products/getError',
            categories: 'products/getCategories'
        }),
        
        // Kategori filtreli ürünler
        filteredProducts() {
            // Kategoriye göre filtreleme
            let filtered = this.shuffleproducts;
            
            // Kategori filtresi
            if (this.selectedCategory !== null) {
                filtered = filtered.filter(product => product && product.category === this.selectedCategory);
            }
            
            // Fiyat aralığı filtresi
            filtered = filtered.filter(product => {
                // Önce ürünün geçerli fiyatını belirle (indirimli veya normal)
                let effectivePrice = parseFloat(product.price) || 0;
                
                // DiscountPrice varsa öncelikle onu kullan
                if (product.discountPrice && parseFloat(product.discountPrice) > 0) {
                    effectivePrice = parseFloat(product.discountPrice);
                } 
                // Yoksa discount (yüzde indirim) varsa hesapla
                else if (product.discount && parseFloat(product.discount) > 0) {
                    effectivePrice = effectivePrice - (effectivePrice * parseFloat(product.discount) / 100);
                }
                
                // Hesaplanan etkin fiyata göre filtreleme yap
                return product && effectivePrice >= this.minPrice && effectivePrice <= this.maxPrice;
            });
            
            // Beden filtresi
            if (this.selectedSizes && this.selectedSizes.length > 0) {
                filtered = filtered.filter(product => {
                    if (!product || !product.sizes || !Array.isArray(product.sizes)) return false;
                    return this.selectedSizes.some(size => product.sizes.includes(size));
                });
            }
            
            // Renk filtresi
            if (this.selectedColors && this.selectedColors.length > 0) {
                filtered = filtered.filter(product => {
                    if (!product || !product.colors || !Array.isArray(product.colors)) return false;
                    return this.selectedColors.some(color => product.colors.includes(color));
                });
            }
            
            // Koleksiyon filtresi
            if (this.selectedCollections && this.selectedCollections.length > 0) {
                filtered = filtered.filter(product => {
                    if (!product || !product.collection) return false;
                    return this.selectedCollections.includes(product.collection);
                });
            }
            
            return filtered;
        }
    },
    mounted() {
        // URL parametrelerini kontrol et
        this.checkURLParameters();

        // Verileri yükle
        this.initializeShopPage();
        
        // For scroll page top for every Route 
        window.scrollTo(0, 0);
    },
    methods: {
        ...mapActions({
            fetchProducts: 'products/fetchProducts',
            fetchCategories: 'products/fetchCategories',
            fetchProductsByCategory: 'products/fetchProductsByCategory'
        }),
        
        // URL parametrelerini kontrol et
        checkURLParameters() {
            // Kategori parametresi
            const urlCategory = this.$route.query.category;
            if (urlCategory) {
                this.selectedCategory = decodeURIComponent(urlCategory);
            }
            
            // Sıralama parametresi
            const sortParam = this.$route.query.sort;
            if (sortParam) {
                this.urlSortOption = sortParam;
            }
            
            // İndirim parametresi
            const discountParam = this.$route.query.discount;
            if (discountParam && (discountParam === 'true' || discountParam === '1')) {
                this.urlDiscount = true;
            }
        },
        
        // Sayfa yüklendiğinde yapılacak işlemleri birleştiren method
        initializeShopPage() {
            this.isPageLoading = true;
            
            // Ürünleri ve kategorileri paralel olarak yükle
            Promise.all([
                this.fetchProducts(),
                this.fetchCategories()
            ])
            .then(([products, categories]) => {
                console.log('Ürünler ve kategoriler başarıyla yüklendi');
                
                // URL parametrelerine göre sıralama ve filtreleme yap
                this.applyURLParameters();
                
                // Sayfalamayı hazırla
                this.getPaginate();
                this.updatePaginate(1);
                
                // Kategori ve fiyat filtreleri için min-max değerlerini ayarla
                if (this.shuffleproducts && this.shuffleproducts.length > 0) {
                    // Minimum ve maksimum fiyatları bul
                    const prices = this.shuffleproducts.map(item => item.price);
                    if (prices.length > 0) {
                        this.priceRange.min = Math.floor(Math.min(...prices));
                        this.priceRange.max = Math.ceil(Math.max(...prices));
                        
                        // URL'de indirim filtresi yoksa fiyat aralığını ayarla
                        if (!this.urlDiscount) {
                        this.minPrice = this.priceRange.min;
                        this.maxPrice = this.priceRange.max;
                        }
                    }
                    
                    // Beden filtrelerini güncelle
                    this.updateSizeFiltersByCategory();
                    
                    // Renk filtrelerini güncelle
                    this.updateColorFiltersByCategory();
                    
                    // Koleksiyonları güncelle
                    this.updateCollections();
                }
            })
            .catch(error => {
                console.error('Veri yüklenirken hata:', error);
                this.$toast.error('Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.');
            })
            .finally(() => {
                this.isPageLoading = false;
            });
        },
        
        // URL parametrelerine göre ürünleri filtreleme ve sıralama
        applyURLParameters() {
            console.log("URL parametreleri uygulanıyor, indirim filtresi:", this.urlDiscount);
            // Ürünleri kopyala
            let products = [...this.products];
            console.log("Filtrelemeden önce toplam ürün:", products.length);
            
            // Sadece indirimli ürünleri göster
            if (this.urlDiscount) {
                // Filtreleme öncesi tüm ürünleri Vuex store'a kaydet
                const originalProducts = [...products];
                
                products = products.filter(product => {
                    // Discount > 0 olan ürünleri seç
                    if (product.discount && parseFloat(product.discount) > 0) {
                        console.log(`İndirimli ürün bulundu: ${product.id}, indirim: ${product.discount}%`);
                        return true;
                    }
                    
                    // DiscountPrice değeri olan ürünleri seç
                    if (product.discountPrice && parseFloat(product.discountPrice) > 0) {
                        console.log(`İndirimli ürün bulundu: ${product.id}, indirimli fiyat: ${product.discountPrice}`);
                        return true;
                    }
                    
                    return false;
                });
                
                console.log("Filtreleme sonrası indirimli ürün:", products.length);
                
                // Eğer hiç indirimli ürün bulunamadıysa
                if (products.length === 0) {
                    console.warn("Hiç indirimli ürün bulunamadı!");
                    this.$toast.warning('Hiç indirimli ürün bulunamadı!');
                    // Orijinal ürünleri geri yükle
                    products = originalProducts;
                } else {
                    // Filtrelerin aktif olduğunu belirt
                    this.hasActiveFilters = true;
                }
            }
            
            // Filtrelenmiş ürünleri store'a gönder
            this.$store.commit('products/SET_SHUFFLE_PRODUCTS', products);
            
            // URL'den gelen sıralama parametresini uygula
            if (this.urlSortOption) {
                switch (this.urlSortOption) {
                    case 'newest':
                        // Yeni ürünleri önce göster
                        products.sort((a, b) => {
                            if (a.new && !b.new) return -1;
                            if (!a.new && b.new) return 1;
                            return b.id - a.id;
                        });
                        break;
                        
                    case 'popularity':
                        // Popülerliğe göre sırala
                        products.sort((a, b) => {
                            const aPopularity = a.rating || 0;
                            const bPopularity = b.rating || 0;
                            if (bPopularity === aPopularity) {
                                return a.id - b.id;
                            }
                            return bPopularity - aPopularity;
                        });
                        break;
                }
                
                // Filtreli ürünleri güncelle
                this.$store.commit('products/SET_SHUFFLE_PRODUCTS', products);
                
                // Dropdown değerini de güncelle
                if (this.urlSortOption === 'newest') {
                    setTimeout(() => {
                        document.querySelector('.customs_sel_box').value = 'new';
                    }, 100);
                } else if (this.urlSortOption === 'popularity') {
                    setTimeout(() => {
                        document.querySelector('.customs_sel_box').value = 'popularity';
                    }, 100);
                }
            }
        },
        
        // Koleksiyonları güncelle
        updateCollections() {
                    // Mevcut koleksiyonları topla
                    const allCollections = this.shuffleproducts.reduce((collections, item) => {
                        if (item.collection) {
                            return [...collections, item.collection];
                        }
                        return collections;
                    }, []);
                    
                    // Benzersiz koleksiyonları al
                    if (allCollections.length > 0) {
                        this.availableCollections = [...new Set(allCollections)];
                    }
        },
        
        // Kategori İsimleri Türkçe'ye Çevirme
        getCategoryName(category) {
            return this.categoryTranslations[category] || category;
        },
        
        // Kategori Filtreleme
        filterByCategory(category) {
            this.selectedCategory = category;
            this.current = 1;
            
            // Kategori değiştiğinde beden filtrelerini güncelle
            this.updateSizeFiltersByCategory();
            
            // Kategori değiştiğinde renk filtrelerini güncelle
            this.updateColorFiltersByCategory();
            
            // Kategori değiştiğinde, beden ve renk filtrelerini sıfırla
            this.selectedSizes = [];
            this.selectedColors = [];
            
            this.getPaginate();
        },
        
        // Kategoriye göre beden filtrelerini güncelleme
        updateSizeFiltersByCategory() {
            // Mevcut ürünlerden tüm bedenleri topla
            const allSizes = this.shuffleproducts.reduce((sizes, item) => {
                if (item.sizes && Array.isArray(item.sizes)) {
                    return [...sizes, ...item.sizes];
                }
                return sizes;
            }, []);
            
            // Benzersiz değerleri al
            const uniqueSizes = [...new Set(allSizes)];
            
            // Beden tipleri
            let clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
            let shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
            let kidSizes = ['4-5', '6-7', '8-9', '10-11', '12-13'];
            let universalSizes = ['Universal', 'One Size', 'Standard'];
            
            // Kategori bazlı filtreleme
            if (this.selectedCategory) {
                // Seçilen kategorideki ürünleri bul
                const categoryProducts = this.shuffleproducts.filter(
                    product => product && product.category === this.selectedCategory
                );
                
                // Bu kategorideki ürünlerin bedenlerini topla
                const categorySizes = categoryProducts.reduce((sizes, item) => {
                    if (item.sizes && Array.isArray(item.sizes)) {
                        return [...sizes, ...item.sizes];
                    }
                    return sizes;
                }, []);
                
                // Benzersiz kategori bedenlerini al
                const uniqueCategorySizes = [...new Set(categorySizes)];
                
                const category = this.selectedCategory.toLowerCase();
                if (category.includes('ayakkabı') || category.includes('shoes')) {
                    // Sadece ayakkabı bedenlerini göster
                    this.availableSizes = uniqueCategorySizes.filter(size => shoeSizes.includes(size))
                        .sort((a, b) => shoeSizes.indexOf(a) - shoeSizes.indexOf(b));
                } else if (category.includes('çocuk') || category.includes('kids')) {
                    // Sadece çocuk bedenlerini göster
                    this.availableSizes = uniqueCategorySizes.filter(size => kidSizes.includes(size))
                        .sort((a, b) => kidSizes.indexOf(a) - kidSizes.indexOf(b));
                } else if (category.includes('aksesuar') || category.includes('accessories')) {
                    // Sadece "Universal" bedenleri göster
                    this.availableSizes = uniqueCategorySizes.filter(size => universalSizes.includes(size));
                } else {
                    // Sadece giyim bedenlerini göster
                    this.availableSizes = uniqueCategorySizes.filter(size => clothingSizes.includes(size))
                        .sort((a, b) => clothingSizes.indexOf(a) - clothingSizes.indexOf(b));
                }
            } else {
                // Tüm bedenleri belirli bir sırada göster
                this.availableSizes = [
                    ...uniqueSizes.filter(size => clothingSizes.includes(size))
                        .sort((a, b) => clothingSizes.indexOf(a) - clothingSizes.indexOf(b)),
                    ...uniqueSizes.filter(size => shoeSizes.includes(size))
                        .sort((a, b) => shoeSizes.indexOf(a) - shoeSizes.indexOf(b)),
                    ...uniqueSizes.filter(size => kidSizes.includes(size))
                        .sort((a, b) => kidSizes.indexOf(a) - kidSizes.indexOf(b)),
                    ...uniqueSizes.filter(size => universalSizes.includes(size))
                ];
            }
        },
        
        // Kategoriye göre renk filtrelerini güncelleme
        updateColorFiltersByCategory() {
            // Tüm ürünlerden renkleri topla
            const allColors = this.shuffleproducts.reduce((colors, item) => {
                if (item.colors && Array.isArray(item.colors)) {
                    return [...colors, ...item.colors];
                }
                return colors;
            }, []);
            
            // Benzersiz renkleri al
            const uniqueColors = [...new Set(allColors)];
            
            if (this.selectedCategory) {
                // Seçilen kategorideki ürünleri bul
                const categoryProducts = this.shuffleproducts.filter(
                    product => product && product.category === this.selectedCategory
                );
                
                // Bu kategorideki ürünlerin renklerini topla
                const categoryColors = categoryProducts.reduce((colors, item) => {
                    if (item.colors && Array.isArray(item.colors)) {
                        return [...colors, ...item.colors];
                    }
                    return colors;
                }, []);
                
                // Benzersiz kategori renklerini al
                this.availableColors = [...new Set(categoryColors)];
            } else {
                // Tüm renkleri göster
                this.availableColors = uniqueColors;
            }
        },
        
        // Tekrar Yükleme
        retryLoading() {
            this.fetchProducts();
            this.fetchCategories();
        },
        
        // Product added Alert / notificaion 
        alert(item) {
            this.dismissCountDown = item
        },

        // For Pagination 
        getPaginate() {
            this.isPageLoading = true;
            
            // shuffleproducts var mı kontrol et
            if (!this.shuffleproducts || !Array.isArray(this.shuffleproducts)) {
                this.isPageLoading = false;
                return;
            }
            
            // Tüm ürünler arasında filtreleme işlemi
            let filteredProducts = [...this.shuffleproducts];
            
            // Kategori filtresi uygula
            if (this.selectedCategory) {
                filteredProducts = filteredProducts.filter(item => 
                    item && item.category === this.selectedCategory
                );
            }
            
            // Fiyat filtresi uygula
            filteredProducts = filteredProducts.filter(item => {
                // Önce ürünün geçerli fiyatını belirle (indirimli veya normal)
                let effectivePrice = parseFloat(item.price) || 0;
                
                // DiscountPrice varsa öncelikle onu kullan
                if (item.discountPrice && parseFloat(item.discountPrice) > 0) {
                    effectivePrice = parseFloat(item.discountPrice);
                } 
                // Yoksa discount (yüzde indirim) varsa hesapla
                else if (item.discount && parseFloat(item.discount) > 0) {
                    effectivePrice = effectivePrice - (effectivePrice * parseFloat(item.discount) / 100);
                }
                
                // Hesaplanan etkin fiyata göre filtreleme yap
                return item && effectivePrice >= this.minPrice && effectivePrice <= this.maxPrice;
            });
            
            // Beden filtresi uygula
            if (this.selectedSizes && this.selectedSizes.length > 0) {
                filteredProducts = filteredProducts.filter(item => {
                    if (!item || !item.sizes || !Array.isArray(item.sizes)) return false;
                    return this.selectedSizes.some(size => item.sizes.includes(size));
                });
            }
            
            // Renk filtresi uygula
            if (this.selectedColors && this.selectedColors.length > 0) {
                filteredProducts = filteredProducts.filter(item => {
                    if (!item || !item.colors || !Array.isArray(item.colors)) return false;
                    return this.selectedColors.some(color => item.colors.includes(color));
                });
            }
            
            // Koleksiyon filtresi uygula
            if (this.selectedCollections && this.selectedCollections.length > 0) {
                filteredProducts = filteredProducts.filter(item => {
                    if (!item || !item.collection) return false;
                    return this.selectedCollections.includes(item.collection);
                });
            }
            
            // Her sayfada gösterilecek ürün sayısını hesapla
            this.totalPages = Math.ceil(filteredProducts.length / this.paginate);
            
            // Sayfalar dizisini oluştur
            this.pages = [];
            for (let i = 1; i <= this.totalPages; i++) {
                this.pages.push(i);
            }
            
            // Geçerli sayfa kontrolü
            if (this.current > this.totalPages) {
                this.current = 1;
            }
            
            // Aktif sayfa için ürünleri hesapla
            const start = (this.current - 1) * this.paginate;
            const end = start + this.paginate;
            this.paginateProducts = filteredProducts.slice(start, end);
            
            // Aktif filtrelerin olup olmadığını kontrol et
            this.hasActiveFilters = 
                this.selectedCategory !== null || 
                this.minPrice > this.priceRange.min || 
                this.maxPrice < this.priceRange.max ||
                (this.selectedSizes && this.selectedSizes.length > 0) ||
                (this.selectedColors && this.selectedColors.length > 0) ||
                (this.selectedCollections && this.selectedCollections.length > 0);
                
            this.isPageLoading = false;
        },
        
        updatePaginate(id) {
            if (id <= 0 || id > this.pages.length) {
                return;
            }
            this.current = id
        },
        
        sortProducts(event) {
            const value = event.target.value;
            if (!this.shuffleproducts || !Array.isArray(this.shuffleproducts)) {
                return;
            }
            
            let sorted = [...this.shuffleproducts];
            
            switch (value) {
                case 'popularity':
                    // Popülerliğe göre sırala - rating ve saleCount özelliklerini kullan
                    sorted.sort((a, b) => {
                        // Değerlendirme puanı (rating) veya satış sayısı (saleCount) özelliklerini kullan
                        const aPopularity = a.rating || 0;
                        const bPopularity = b.rating || 0;
                        
                        // Önce puanlar karşılaştırılır, eşitse ürün ID'sine göre sıralanır (sabit sıralama için)
                        if (bPopularity === aPopularity) {
                            return a.id - b.id; // ID'ye göre artan sıralama
                        }
                        return bPopularity - aPopularity; // Puana göre azalan sıralama
                    });
                    
                    // Kullanıcıya bildirim göster
                    this.$toast.info('Ürünler popülerlik sırasına göre sıralandı');
                    break;
                    
                case 'new':
                    // Yeni ürünleri önce göster - new özelliği veya id'ye göre (varsayalım ki yüksek ID daha yeni)
                    sorted.sort((a, b) => {
                        // Önce "new" özelliği olan ürünleri öne çıkar
                        if (a.new && !b.new) return -1;
                        if (!a.new && b.new) return 1;
                        
                        // Eğer her ikisi de "new" veya ikisi de değilse, ID'sine göre sırala
                        // Daha yüksek ID'li ürünleri (daha yeni eklenmiş kabul ederek) öne al
                        return b.id - a.id;
                    });
                    
                    // Kullanıcıya bildirim göster
                    this.$toast.info('En yeni ürünler öne getirildi');
                    break;
                    
                case 'low':
                    // Fiyatı düşükten yükseğe sırala
                    sorted.sort((a, b) => {
                        // İndirimli fiyatları hesapla
                        let aPrice = parseFloat(a.price) || 0;
                        let bPrice = parseFloat(b.price) || 0;
                        
                        // DiscountPrice varsa öncelikle onu kullan
                        if (a.discountPrice && parseFloat(a.discountPrice) > 0) {
                            aPrice = parseFloat(a.discountPrice);
                        } else if (a.discount && parseFloat(a.discount) > 0) {
                            aPrice = aPrice - (aPrice * parseFloat(a.discount) / 100);
                        }
                        
                        if (b.discountPrice && parseFloat(b.discountPrice) > 0) {
                            bPrice = parseFloat(b.discountPrice);
                        } else if (b.discount && parseFloat(b.discount) > 0) {
                            bPrice = bPrice - (bPrice * parseFloat(b.discount) / 100);
                        }
                        
                        // Fiyatlara göre sırala
                        if (aPrice === bPrice) {
                            return a.id - b.id; // Fiyatlar eşitse ID'ye göre sırala
                        }
                        return aPrice - bPrice;
                    });
                    
                    // Kullanıcıya bildirim göster
                    this.$toast.info('Ürünler fiyata göre artan sırada listelendi');
                    break;
                    
                case 'high':
                    // Fiyatı yüksekten düşüğe sırala
                    sorted.sort((a, b) => {
                        // İndirimli fiyatları hesapla
                        let aPrice = parseFloat(a.price) || 0;
                        let bPrice = parseFloat(b.price) || 0;
                        
                        // DiscountPrice varsa öncelikle onu kullan
                        if (a.discountPrice && parseFloat(a.discountPrice) > 0) {
                            aPrice = parseFloat(a.discountPrice);
                        } else if (a.discount && parseFloat(a.discount) > 0) {
                            aPrice = aPrice - (aPrice * parseFloat(a.discount) / 100);
                        }
                        
                        if (b.discountPrice && parseFloat(b.discountPrice) > 0) {
                            bPrice = parseFloat(b.discountPrice);
                        } else if (b.discount && parseFloat(b.discount) > 0) {
                            bPrice = bPrice - (bPrice * parseFloat(b.discount) / 100);
                        }
                        
                        // Fiyatlara göre sırala
                        if (bPrice === aPrice) {
                            return a.id - b.id; // Fiyatlar eşitse ID'ye göre sırala
                        }
                        return bPrice - aPrice;
                    });
                    
                    // Kullanıcıya bildirim göster
                    this.$toast.info('Ürünler fiyata göre azalan sırada listelendi');
                    break;
                    
                case 'default':
                default:
                    // Varsayılan sıralama (API'den geldiği gibi)
                    sorted = [...this.products];
                    
                    // Kullanıcıya bildirim göster
                    this.$toast.info('Varsayılan sıralama uygulandı');
                    break;
            }
            
            // Store'u güncellemeden, yerel shuffleproducts olarak kullan
            this.$store.commit('products/SET_SHUFFLE_PRODUCTS', sorted);
            
            // Sayfalamayı güncelle
            this.getPaginate();
            this.updatePaginate(1);
        },
        
        resetFilters() {
            this.selectedCategory = null;
            this.minPrice = this.priceRange.min;
            this.maxPrice = this.priceRange.max;
            this.selectedSizes = [];
            this.selectedColors = [];
            this.selectedCollections = [];
            this.hasActiveFilters = false;
            this.getPaginate();
        },
        
        applyFilters() {
            this.hasActiveFilters = true;
            this.getPaginate();
        },
        
        toggleSizeFilter(size) {
            // Kategori seçili değilse işlem yapma
            if (this.selectedCategory === null) {
                this.$toast.info("Beden filtrelemek için önce bir kategori seçmelisiniz");
                return;
            }
            
            if (this.selectedSizes.includes(size)) {
                this.selectedSizes = this.selectedSizes.filter(s => s !== size);
            } else {
                this.selectedSizes.push(size);
            }
            this.getPaginate();
        },
        
        toggleColorFilter(color) {
            if (this.selectedColors.includes(color)) {
                this.selectedColors = this.selectedColors.filter(c => c !== color);
            } else {
                this.selectedColors.push(color);
            }
            this.getPaginate();
        },
        
        toggleCollectionFilter(collection) {
            if (this.selectedCollections.includes(collection)) {
                this.selectedCollections = this.selectedCollections.filter(c => c !== collection);
            } else {
                this.selectedCollections.push(collection);
            }
            this.getPaginate();
        },
        
        getColorHex(colorName) {
            const colorMap = {
                // Ana Renkler
                'Red': '#ff5252',
                'Blue': '#2196f3',
                'Green': '#4caf50',
                'Black': '#000000',
                'White': '#ffffff',
                'Yellow': '#ffeb3b',
                'Orange': '#ff9800',
                'Purple': '#9c27b0',
                'Pink': '#e91e63',
                'Gray': '#9e9e9e',
                'Brown': '#795548',
                
                // Tonlar
                'Light Blue': '#03a9f4',
                'Dark Blue': '#3f51b5',
                'Navy': '#1a237e',
                'Teal': '#009688',
                'Light Green': '#8bc34a',
                'Dark Green': '#1b5e20',
                'Lime': '#cddc39',
                'Beige': '#f5f5dc',
                'Cream': '#fffdd0',
                'Khaki': '#f0e68c',
                'Olive': '#808000',
                'Turquoise': '#40e0d0',
                'Gold': '#ffd700',
                'Silver': '#c0c0c0',
                'Dark Gray': '#616161',
                'Light Gray': '#e0e0e0',
                'Maroon': '#800000',
                'Mint': '#98fb98',
                'Indigo': '#3f51b5',
                'Bordeaux': '#800020',
                'Charcoal': '#36454f',
                'Burgundy': '#800020',
                'Coral': '#ff7f50',
                'Aqua': '#00ffff',
                'Magenta': '#ff00ff',
                'Tan': '#d2b48c'
            };
            
            // Renk adı tam eşleşme kontrolü
            if (colorMap[colorName]) {
                return colorMap[colorName];
            }
            
            // Kısmi eşleşme kontrolü (örn: "Light Red" için "Red" içerdiğinden kırmızı tonu döndür)
            for (const [key, value] of Object.entries(colorMap)) {
                if (colorName.toLowerCase().includes(key.toLowerCase())) {
                    return value;
                }
            }
            
            // Eşleşme yoksa varsayılan renk döndür
            return '#ddd';
        },
        resetCategory() {
            this.selectedCategory = null;
            
            // URL'den kategori parametresini kaldır
            this.$router.push({
                path: '/shop',
                query: { ...this.$route.query, category: undefined }
            });
            
            // Beden ve renk filtrelerini güncelle
            this.updateSizeFiltersByCategory();
            this.updateColorFiltersByCategory();
            
            // Filter seçimlerini sıfırla
            this.selectedSizes = [];
            this.selectedColors = [];
            
            this.getPaginate();
        },
        setViewMode(mode) {
            this.viewMode = mode;
        }
    },
    watch: {
        // Store'dan gelen loading durumunu izle
        'isLoading': function(newVal) {
            // Store loading durumu değiştiğinde page loading durumunu da güncelle
            this.isPageLoading = newVal;
        },
        '$route.query.category': {
            handler(newCategory) {
                if (newCategory) {
                    this.selectedCategory = decodeURIComponent(newCategory);
                    // Kategori değiştiğinde beden ve renk filtrelerini güncelle
                    this.updateSizeFiltersByCategory();
                    this.updateColorFiltersByCategory();
                    // Kategori değiştiğinde filter seçimlerini sıfırla
                    this.selectedSizes = [];
                    this.selectedColors = [];
                    // Sayfayı güncelle
                    this.getPaginate();
                } else {
                    this.selectedCategory = null;
                    this.updateSizeFiltersByCategory();
                    this.updateColorFiltersByCategory();
                    this.selectedSizes = [];
                    this.selectedColors = [];
                    this.getPaginate();
                }
            },
            immediate: true
        }
    },

    // Page head() Title, description for SEO
    head() {
      return {
        title: this.title,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'Shop page - AndShop Ecommerce Vue js, Nuxt js Template'
          }
        ]
      }
    }
}
</script>

<style scoped>
.filter-container {
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    position: sticky;
    top: 20px;
}

@media (max-width: 991px) {
    .filter-container {
        position: relative;
        top: 0;
        margin-top: 30px;
        order: 2;
    }
    
    .row.flex-column-reverse {
        display: flex;
        flex-direction: column !important;
    }
    
    .col-lg-3 {
        order: 2;
    }
    
    .col-lg-9 {
        order: 1;
    }
}

.filter-section {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.filter-section h5 {
    margin-bottom: 0;
    margin-right: 15px;
}

.filter-section h6 {
    width: 100%;
    margin-bottom: 12px;
    font-weight: 600;
    color: #333;
}

.category-buttons,
.size-buttons,
.color-buttons,
.collection-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.filter-btn {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    margin-bottom: 8px;
    text-align: left;
}

.filter-btn:hover {
    border-color: #444;
}

.filter-btn.active {
    background: #222;
    color: white;
    border-color: #222;
}

.size-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ddd;
    background: white;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.size-btn:hover {
    border-color: #444;
}

.size-btn.active {
    background: #222;
    color: white;
    border-color: #222;
}

.color-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 10px;
}

.color-btn-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
}

.color-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.color-btn.white-color {
    border: 1px solid #ccc;
}

.color-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.color-btn.active {
    border: 2px solid #222;
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.color-name {
    font-size: 12px;
    margin-top: 5px;
    color: #666;
}

.price-slider {
    width: 100%;
    padding: 0 10px;
}

.price-inputs {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
}

.price-input {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.price-input span {
    margin-bottom: 5px;
    font-size: 14px;
}

.price-input input {
    width: 100%;
}

.loading-spinner, .error-message, .no-product-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.theme-btn-one.border {
    background-color: transparent;
    border: 1px solid #000;
    color: #000;
}

.theme-btn-one.border:hover {
    background-color: #000;
    color: #fff;
}

.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.size-not-available {
    background-color: #f5f5f5;
    border: 1px dashed #ccc;
    border-radius: 4px;
    padding: 15px;
    text-align: center;
    width: 100%;
}

.size-disabled-message {
    margin: 0;
    font-size: 14px;
    color: #777;
    font-style: italic;
}

.selected-category {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.category-tag {
    display: inline-flex;
    align-items: center;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
}

.clear-category-btn {
    background: none;
    border: none;
    color: #777;
    margin-left: 8px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: 12px;
    transition: color 0.2s;
}

.clear-category-btn:hover {
    color: #f44336;
}

.category-buttons, 
.collection-buttons {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.product_shot_view {
    display: flex;
    align-items: center;
}

.product_shot_view ul {
    display: flex;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.product_shot_view ul li button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.product_shot_view ul li button:hover,
.product_shot_view ul li button.active {
    background: #222;
    color: white;
    border-color: #222;
}

/* View Mode Styles */
.product-grid-container {
    margin-top: 20px;
}

.product-grid-container .row {
    margin-left: -10px;
    margin-right: -10px;
}

.product-grid-container [class*="col-"] {
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 20px;
}

/* Ürün kartları için ek stiller */
::v-deep .product_wrappers_one {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    height: 100%;
}

::v-deep .product_wrappers_one .thumb {
    border-bottom: 1px solid #f0f0f0;
}

::v-deep .product_wrappers_one .thumb img {
    object-fit: contain;
    padding: 10px;
}

::v-deep .product_wrappers_one:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
}

@media (max-width: 767px) {
    .list-view-item {
        flex-direction: column;
    }
    
    .list-view-item .product-image {
        width: 100%;
        margin-right: 0;
        margin-bottom: 20px;
    }
    
    .list-view-item .product-details {
        width: 100%;
    }
}
</style>