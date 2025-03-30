<template>
    <div class="product_wrappers_one">
        <div class="thumb">
            <nuxt-link :to="`/product/${product.id}`" class="image">
                <img :src="product.image" :alt="product.title" class="img-fluid"/>
                <img class="hover-image" :src="product.image" :alt="product.title" />
            </nuxt-link>
            <span v-if="product.isSale" class="badges">
                <span class="sale">-{{ product.discount }}%</span>
            </span>
            <span v-if="product.isNew" class="badges new">
                <span class="new">Yeni</span>
            </span>
            <span v-if="product.isHot" class="badges hot">
                <span class="hot">Hot</span>
            </span>
            <div class="actions">
                <a class="action wishlist" title="Favorilere Ekle" @click="addToWishList(product)"><i
                        class="far fa-heart"></i></a>
                <a class="action quickview" title="Hızlı Önizleme" @click="openQuick(product)"><i
                        class="fas fa-expand"></i></a>
                <a class="action compare" title="Karşılaştırmaya Ekle" @click="addToCompare(product)"><i
                        class="fas fa-random"></i></a>
            </div>
            <button  class="add-to-cart offcanvas-toggle" @click="addToCart(product)">Sepete Ekle</button>
        </div>
        <div class="content">
            <h5 class="title"><nuxt-link :to="`/product/${product.id}`">{{ product.title }}</nuxt-link></h5>
            <span class="price">
                <template v-if="product.isSale">
                    <span class="old">{{ '$' + product.price }}</span>
                    <span class="new">{{ '$' + calculateDiscount(product.price, product.discount) }}</span>
                </template>
                <template v-else>
                    <span class="new">{{ '$' + product.price }}</span>
                </template>
            </span>
            
            <!-- Ürün bilgileri ekleniyor -->
            <div class="product-info">
                <!-- Renkler -->
                <div v-if="product.colors && product.colors.length > 0" class="colors-wrapper">
                    <span class="info-title">Renkler:</span>
                    <div class="color-options">
                        <span 
                            v-for="(color, index) in product.colors" 
                            :key="index"
                            class="color-dot"
                            :style="{ backgroundColor: getColorHex(color) }"
                            :title="color">
                        </span>
                    </div>
                </div>
                
                <!-- Bedenler -->
                <div v-if="product.sizes && product.sizes.length > 0" class="sizes-wrapper">
                    <span class="info-title">Bedenler:</span>
                    <div class="size-options">
                        <span 
                            v-for="(size, index) in product.sizes" 
                            :key="index"
                            class="size-box">
                            {{ size }}
                        </span>
                    </div>
                </div>
                
                <!-- Koleksiyon bilgisi -->
                <div v-if="product.collection" class="collection-wrapper">
                    <span class="info-title">Koleksiyon:</span>
                    <span class="collection-tag">{{ product.collection }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    export default {
        name: "ProductCard",
        props: ['product'],
        methods: {
            ...mapActions({
                addCart: 'cart/addCart',
                addWishlist: 'wishlist/addWishlist',
                toggleQuickView: 'common/toggleQuickView',
                addCompare: 'compare/addCompare'
            }),
            addToCart(product) {
                if (product) {
                    this.addCart({
                        product: product,
                        quantity: 1
                    })
                    this.$notify({
                        title: 'Ürün Eklendi',
                        text: `${product.title} sepete eklendi.`,
                        type: 'success'
                    });
                }
            },
            addToWishList(product) {
                if (product) {
                    this.addWishlist(product)
                    this.$notify({
                        title: 'Favorilere Eklendi',
                        text: `${product.title} favorilere eklendi.`,
                        type: 'success'
                    });
                }
            },
            addToCompare(product) {
                if (product) {
                    this.addCompare(product)
                    this.$notify({
                        title: 'Karşılaştırmaya Eklendi',
                        text: `${product.title} karşılaştırma listesine eklendi.`,
                        type: 'success'
                    });
                }
            },
            calculateDiscount(price, discount) {
                return (price - (price * discount / 100)).toFixed(2);
            },
            openQuick(product) {
                this.toggleQuickView(product)
            },
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
            }
        }
    }
</script>

<style scoped>
.product-info {
    margin-top: 10px;
    font-size: 13px;
}

.colors-wrapper, .sizes-wrapper, .collection-wrapper {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    flex-wrap: wrap;
}

.info-title {
    font-weight: 600;
    margin-right: 8px;
    color: #555;
}

.color-options {
    display: flex;
    gap: 4px;
}

.color-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid #ddd;
    display: inline-block;
}

.size-options {
    display: flex;
    gap: 4px;
}

.size-box {
    padding: 2px 4px;
    border: 1px solid #ddd;
    border-radius: 2px;
    font-size: 11px;
    background: #f9f9f9;
}

.collection-tag {
    padding: 2px 6px;
    background: #f0f0f0;
    border-radius: 4px;
    font-size: 11px;
    color: #666;
}
</style> 