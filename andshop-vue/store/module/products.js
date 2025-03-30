import products from '../../data/products'
import ProductService from '~/api/products'
import WishlistService from '~/api/wishlist'

const state = {
    productslist: products.data, // Lokal veri yedek olarak tutuluyor
    products: [], // API'den gelecek
    shuffleproducts: [], // API'den gelecek
    wishlist: [],
    compare: [],
    searchProduct: [],
    // API durumları için yeni state'ler
    loading: false,
    error: null,
    categories: [],
    currentProduct: {},
    currentProductLoading: false,
    currentProductError: null
}

// getters 
const getters = {
    getcollectionProduct: (state) => (collection) => {
        return state.products.filter((product) => {
            if (product.collection && product.collection.includes(collection)) {
                return true
            }
            return false
        })
    },
    getProductById: (state) => {
        return id => state.products.find((product) => {
            return product.id === +id
        })
    },
    wishlistItems: (state) => {
        return state.wishlist
    },
    compareItems: (state) => {
        return state.compare
    },
    // Yeni getters
    isLoading: state => state.loading,
    hasError: state => state.error !== null,
    getError: state => state.error,
    getCategories: state => state.categories,
    getCurrentProduct: state => state.currentProduct,
    isCurrentProductLoading: state => state.currentProductLoading,
    hasCurrentProductError: state => state.currentProductError !== null,
    getCurrentProductError: state => state.currentProductError,
    // FakeStore API'den gelen kategori bazlı ürünleri almak için
    getProductsByCategory: (state) => (category) => {
        return state.products.filter(product => product.category === category)
    },
    getProducts: (state) => state.products,
}

// mutations 
const mutations = {
    // Mevcut mutations
    addToWishlist: (state, payload) => {
        const product = state.products.find( item => item.id === payload.id )
        const wishlistItems = state.wishlist.find( item => item.id === payload.id )
        if (wishlistItems) {

        } else {
            state.wishlist.push({
                ...product
            })
        }
    },
    removeWishlistItem: ( state, payload ) => {
        const index = state.wishlist.indexOf(payload)
        state.wishlist.splice(index, 1)
    },
    addToCompare: (state, payload) => {
        const product = state.products.find(item => item.id === payload.id)
        const compareItems = state.compare.find(item => item.id === payload.id)
        if (compareItems) {
        } else {
            state.compare.push({
                ...product
            })
        }
    },
    removeCompareItem: (state, payload) => {
        const index = state.compare.indexOf(payload)
        state.compare.splice(index, 1)
    },
    searchProduct: (state, payload) => {
        payload = payload.toLowerCase()
        state.searchProduct = []
        if (payload.length) {
            state.products.filter((product) => {
                if (product.title.toLowerCase().includes(payload)) {
                    state.searchProduct.push(product)
                }
            })
        }
    },
    shuffleProduct: (state, payload) => {
        state.shuffleproducts = payload
    },
    getallProduct: (state, payload) => {
        state.shuffleproducts = products.data
    },
    
    // Yeni mutations
    // Tüm ürünleri yüklerken
    SET_LOADING(state, loading) {
        state.loading = loading
    },
    SET_ERROR(state, error) {
        state.error = error
    },
    SET_PRODUCTS(state, products) {
        // API'den gelen veriyi kontrol et
        if (!products) {
            console.error('Ürün verisi bulunamadı');
            state.products = [];
            state.shuffleproducts = [];
            return;
        }
        
        // products bir dizi değilse, dönüşüm yapalım
        let productsArray = products;
        if (!Array.isArray(products)) {
            console.warn('Gelen ürünler bir dizi değil, dönüştürülüyor:', products);
            if (products.value && Array.isArray(products.value)) {
                productsArray = products.value;
            } else if (typeof products === 'object') {
                // Obje ise ve içinde items, result gibi alanlar varsa
                if (products.items && Array.isArray(products.items)) {
                    productsArray = products.items;
                } else if (products.result && Array.isArray(products.result)) {
                    productsArray = products.result;
                } else {
                    // Hiçbir şey yoksa kendisini tek elemanlı bir dizi yap
                    productsArray = [products];
                }
            } else {
                // Son çare - boş dizi
                productsArray = [];
            }
        }
        
        // API'den gelen ürünleri bizim formatımıza dönüştür
        const transformedProducts = productsArray.map(product => {
            // Eğer product formatı zaten uygunsa, gerekli dönüşümleri yap
            
            // Varsayılan değerler ve güvenlik kontrolleri
            const productId = product.id || Math.floor(Math.random() * 10000);
            const title = product.title || product.name || 'Ürün İsmi';
            const description = product.description || 'Ürün açıklaması bulunmuyor.';
            const price = parseFloat(product.price) || 0;
            const image = product.image || product.imageUrl || 'https://placehold.co/300x300';
            
            // Kategori kontrolü ve dönüşümü
            let category = product.category || 'Genel';
            let sizes = product.sizes || [];
            let colors = product.colors || [];
            let discount = product.discount || 0;
            let isSale = product.isSale || false;
            let collection = product.collection || '';
            let stock = product.stock || Math.floor(Math.random() * 50) + 10; // Geçici stok değeri

            // Eğer değerler API'den gelmiyorsa, kategori bazlı varsayılan değerler ata
            if (!product.sizes || !product.colors) {
                // Kategori bazlı özellikler
                if (category.includes('erkek') || category.includes('men')) {
                    sizes = sizes.length ? sizes : generateRandomSizes(category);
                    colors = colors.length ? colors : ['Black', 'Blue', 'Gray', 'White', 'Red'];
                    collection = collection || 'Erkek Koleksiyonu';
                } else if (category.includes('kadın') || category.includes('women')) {
                    sizes = sizes.length ? sizes : generateRandomSizes(category);
                    colors = colors.length ? colors : ['Black', 'White', 'Pink', 'Purple', 'Red'];
                    collection = collection || 'Kadın Koleksiyonu';
                } else {
                    sizes = sizes.length ? sizes : generateRandomSizes(category);
                    colors = colors.length ? colors : ['Black', 'White', 'Blue', 'Red', 'Green'];
                    collection = collection || 'Genel Koleksiyon';
                }
            }

            // İndirim kontrolü
            isSale = discount > 0;

            // Ürün görselleri
            const images = product.images || [
                {
                    image_id: productId,
                    id: productId,
                    alt: title,
                    src: image
                }
            ];

            // Ürün varyantları
            const variants = product.variants || colors.map(color => ({
                color: color,
                size: sizes[Math.floor(Math.random() * sizes.length)],
                image_id: productId,
                src: image
            }));

            // Dönüştürülmüş ürün
            return {
                id: productId,
                title,
                description,
                price,
                category,
                image,
                sizes,
                colors,
                images,
                variants,
                discount,
                isSale,
                collection,
                stock,
                rating: product.rating || Math.floor(Math.random() * 5) + 1,
                new: product.new || Math.random() > 0.7,
                hot: product.hot || Math.random() > 0.8,
                brand: product.brand || (category.includes('erkek') ? "ErkekMarka" : "KadınMarka"),
                // Orijinal ürün verilerini de sakla
                originalData: product
            };
        });

        state.products = transformedProducts;
        state.shuffleproducts = [...transformedProducts];
    },
    SET_CATEGORIES(state, categories) {
        if (!categories || categories.length === 0) {
            state.categories = [];
            return;
        }
        
        console.log('Ham kategoriler:', categories);
        
        // Eğer kategoriler nesne dizisi ise (id, name vs. içeriyorsa) sadece isimlerini alalım
        if (categories.length > 0 && typeof categories[0] === 'object') {
            state.categories = categories.map(category => {
                // Eğer kategori bir nesne ise adını çıkar
                if (category && category.name) {
                    return category.name;
                }
                // Eğer kategori zaten bir string ise olduğu gibi kullan
                return category.toString();
            });
        } else {
            // Eğer zaten string dizisi ise olduğu gibi kullan
            state.categories = categories;
        }
        
        console.log('İşlenmiş kategoriler:', state.categories);
    },
    
    // Tek bir ürün detayı yüklerken
    SET_CURRENT_PRODUCT_LOADING(state, loading) {
        state.currentProductLoading = loading
    },
    SET_CURRENT_PRODUCT_ERROR(state, error) {
        state.currentProductError = error
    },
    SET_CURRENT_PRODUCT(state, product) {
        if (!product) {
            state.currentProduct = null;
            return;
        }

        // Ürün verilerini bizim formatımıza dönüştür
        const transformedProduct = {
            ...product,
            sizes: product.sizes || [],
            colors: product.colors || [],
            images: product.images || [{
                image_id: product.id,
                id: product.id,
                alt: product.title,
                src: product.image
            }],
            variants: product.variants || [],
            discount: product.discount || 0,
            isSale: product.isSale || false,
            collection: product.collection || '',
            stock: product.stock || Math.floor(Math.random() * 50) + 10,
            rating: product.rating || Math.floor(Math.random() * 5) + 1,
            new: product.new || false,
            hot: product.hot || false,
            brand: product.brand || '',
            description: product.description || "Ürün açıklaması bulunmuyor.",
            price: parseFloat(product.price),
            category: product.category
        };

        state.currentProduct = transformedProduct;
    },
    // Filtrelenmiş ürünleri güncelle
    SET_SHUFFLE_PRODUCTS(state, products) {
        state.shuffleproducts = products;
    },
    SET_WISHLIST(state, products) {
        state.wishlist = products;
    },
}

// actions 
const actions = {
    // Mevcut actions
    addToWishlist: (context, payload) => {
        context.commit('addToWishlist', payload)
    },
    removeWishlistItem: (context, payload) => {
        context.commit('removeWishlistItem', payload)
    },
    addToCompare: (context, payload) => {
        context.commit('addToCompare', payload)
    },
    removeCompareItem: (context, payload) => {
        context.commit('removeCompareItem', payload)
    },
    searchProduct: (context, payload) => {
        context.commit('searchProduct', payload)
    },
    shuffleProduct: (context, payload) => {
        context.commit('shuffleProduct', payload)
    },
    getallProduct: (context) => {
        context.commit('getallProduct')
    },
    
    // Yeni actions - API entegrasyonu
    // Tüm ürünleri getir
    fetchProducts({ commit }, params = {}) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        return ProductService.getProducts(params)
            .then(response => {
                commit('SET_PRODUCTS', response.data)
                return response.data
            })
            .catch(error => {
                commit('SET_ERROR', error.message || 'Ürünler alınırken bir hata oluştu')
                console.error('Ürünler alınırken hata:', error)
                return Promise.reject(error)
            })
            .finally(() => {
                commit('SET_LOADING', false)
            })
    },
    
    // Kategorileri getir
    fetchCategories({ commit }) {
        return ProductService.getCategories()
            .then(response => {
                commit('SET_CATEGORIES', response.data)
                return response.data
            })
            .catch(error => {
                console.error('Kategoriler alınırken hata:', error)
                return Promise.reject(error)
            })
    },
    
    // Kategori bazlı ürünleri getir
    fetchProductsByCategory({ commit }, category) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        return ProductService.getProductsByCategory(category)
            .then(response => {
                commit('SET_PRODUCTS', response.data)
                return response.data
            })
            .catch(error => {
                commit('SET_ERROR', error.message || 'Kategori ürünleri alınırken bir hata oluştu')
                console.error('Kategori ürünleri alınırken hata:', error)
                return Promise.reject(error)
            })
            .finally(() => {
                commit('SET_LOADING', false)
            })
    },
    
    // Tek bir ürünün detayını getir
    fetchProduct({ commit }, id) {
        commit('SET_CURRENT_PRODUCT_LOADING', true)
        commit('SET_CURRENT_PRODUCT_ERROR', null)
        
        return ProductService.getProduct(id)
            .then(response => {
                commit('SET_CURRENT_PRODUCT', response.data)
                return response.data
            })
            .catch(error => {
                commit('SET_CURRENT_PRODUCT_ERROR', error.message || 'Ürün detayı alınırken bir hata oluştu')
                console.error('Ürün detayı alınırken hata:', error)
                return Promise.reject(error)
            })
            .finally(() => {
                commit('SET_CURRENT_PRODUCT_LOADING', false)
            })
    },
    
    // Ürün arama
    searchProductsFromAPI({ commit }, query) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)
        
        return ProductService.searchProducts(query)
            .then(response => {
                commit('SET_PRODUCTS', response.data)
                return response.data
            })
            .catch(error => {
                commit('SET_ERROR', error.message || 'Ürün arama sırasında bir hata oluştu')
                console.error('Ürün arama sırasında hata:', error)
                return Promise.reject(error)
            })
            .finally(() => {
                commit('SET_LOADING', false)
            })
    },
    
    fetchCurrentProduct({commit}, product) {
        commit('SET_CURRENT_PRODUCT', product)
    },
    
    // Kullanıcının favorilerini getir
    fetchUserWishlist({ commit, rootState }) {
        console.log("Favoriler yükleniyor...");
        
        // Kullanıcı giriş yapmışsa
        if (rootState.user && rootState.user.isAuthenticated) {
            return WishlistService.getUserWishlist()
                .then(response => {
                    console.log("API cevabı:", response);
                    
                    // API yanıt formatını kontrol et
                    let favorites = [];
                    
                    // Farklı olası yanıt formatlarını kontrol et
                    if (response.data && Array.isArray(response.data)) {
                        // Düz dizi formatı
                        favorites = response.data;
                    } else if (response.data && response.data.$values && Array.isArray(response.data.$values)) {
                        // ASP.NET formatı - $values içinde dizi var
                        favorites = response.data.$values;
                    } else if (response.data && typeof response.data === 'object') {
                        // Başka bir format olasılığı
                        if (Array.isArray(Object.values(response.data)[0])) {
                            favorites = Object.values(response.data)[0];
                        }
                    }
                    
                    console.log("İşlenmiş favoriler:", favorites);
                    
                    if (favorites.length > 0) {
                        commit('SET_WISHLIST', favorites);
                        return favorites;
                    } else {
                        console.warn('Hiç favori bulunamadı veya format anlaşılamadı');
                        commit('SET_WISHLIST', []);
                        return [];
                    }
                })
                .catch(error => {
                    console.error('Favoriler alınırken hata:', error);
                    commit('SET_WISHLIST', []);
                    return Promise.reject(error);
                });
        } else {
            console.log("Kullanıcı giriş yapmamış, favoriler yüklenmedi.");
            commit('SET_WISHLIST', []);
            return Promise.resolve([]);
        }
    },
    
    // Favorilere ürün ekle (API ve store)
    addToWishlist({ commit, state, rootState }, product) {
        // Önce store'a ekle (anında UI güncellemesi için)
        commit('addToWishlist', product);
        
        // Kullanıcı giriş yapmışsa API'ye kaydet
        if (rootState.user && rootState.user.isAuthenticated) {
            WishlistService.addToWishlist(product.id)
                .catch(error => {
                    console.error('Favorilere eklenirken hata:', error);
                    // Hata durumunda store'dan geri çıkar
                    commit('removeWishlistItem', product);
                });
        }
    },
    
    // Favorilerden ürün çıkar (API ve store)
    removeWishlistItem({ commit, state, rootState }, product) {
        // Önce store'dan çıkar
        commit('removeWishlistItem', product);
        
        // Kullanıcı giriş yapmışsa API'den de sil
        if (rootState.user && rootState.user.isAuthenticated) {
            WishlistService.removeFromWishlist(product.id)
                .catch(error => {
                    console.error('Favorilerden çıkarılırken hata:', error);
                    // Hata durumunda store'a geri ekle
                    commit('addToWishlist', product);
                });
        }
    },
}

// Beden, renk ve koleksiyon için yardımcı fonksiyonlar ve standart beden setleri
const standardSizes = {
    clothes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // Giyim için standart bedenler
    shoes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'], // Ayakkabı için standart bedenler
    accessories: ['Universal', 'One Size'], // Aksesuarlar için standart bedenler
    kids: ['4-5', '6-7', '8-9', '10-11', '12-13'] // Çocuk bedenleri
};

// Kategoriye göre standart bedenleri alma
const getStandardSizesByCategory = (category) => {
    if (!category) return standardSizes.clothes;
    
    category = category.toLowerCase();
    if (category.includes('ayakkabı') || category.includes('shoes')) {
        return standardSizes.shoes;
    } else if (category.includes('çocuk') || category.includes('kids')) {
        return standardSizes.kids;
    } else if (category.includes('aksesuar') || category.includes('accessories')) {
        return standardSizes.accessories;
    } else {
        return standardSizes.clothes;
    }
};

// Yardımcı fonksiyonlar
const generateRandomSizes = (category) => {
    // Kategori bazlı standart bedenleri al
    const availableSizes = getStandardSizesByCategory(category);
    // Her ürüne en az 2, en fazla 4 beden ekle
    const numSizes = Math.floor(Math.random() * 3) + 2;
    const shuffled = [...availableSizes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numSizes);
};

const generateRandomColors = () => {
    const availableColors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Orange', 'Purple', 'Pink', 'Gray'];
    // Her ürüne en az 2, en fazla 5 renk ekle
    const numColors = Math.floor(Math.random() * 4) + 2;
    const shuffled = [...availableColors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numColors);
};

const generateRandomCollection = () => {
    const collections = ['Spring', 'Summer', 'Fall', 'Winter'];
    // Rastgele bir koleksiyon seç
    return collections[Math.floor(Math.random() * collections.length)];
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}