<template>
    <div>
        <!-- Related Product -->
        <section id="related_product" class="related-product pb-100">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="section_title text-center">
                            <h2>Benzer Ürünler</h2>
                        </div>
                    </div>
                </div>
                <div class="row product-grid-container">
                    <div class="col-lg-3 col-md-4 col-sm-6 col-12" v-for="(product, index) in productslist.slice(0, 4)" :key="index">
                        <ProductBox1 :product="product" :index="index" @showalert="alert" @alertseconds="alert" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Add to cart Alert / Notification  -->
        <b-alert
        :show="dismissCountDown"
        dismissible
        fade
        variant="success"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="alert"
        >
        <p class="font-weight-normal">Successfully added to your list</p>
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
        <p class="font-weight-normal">Successfully added to your list</p>
        </b-alert>
        <!-- Add to wishlist / wishlist Notification  -->

        <!-- Add to Compare / Compare Notification  -->
        <b-alert
        :show="dismissCountDown"
        dismissible
        fade
        variant="success"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="alert"
        >
        <p class="font-weight-normal">Successfully added to your list</p>
        </b-alert>
        <!-- Add to Compare / Compare Notification  -->
    </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductBox1 from '~/components/product-box/ProductBox1'
export default {
    name: "RelatedProducts",
    props: ['productType', 'productId'],
    components: {
        ProductBox1,
    },
    data() {
        return {
            products: [],
            compareproduct: {},
            cartproduct: {},
            dismissSecs: 5,
            dismissCountDown: 0
        }
  },
    computed: {
        ...mapState({
        productslist: state => state.products.productslist
        })
    },
    mounted() {
        this.productsArray()
    },
    methods: {
        productsArray: function () {
            this.productslist.map((item) => {
                if (item.type === this.productType) {
                    if (item.id !== this.productId) {
                        this.products.push(item)
                    }
                }
            })
        },
        // Product added Alert / notificaion 
        alert(item) {
            this.dismissCountDown = item
        },
    }

}
</script>

<style scoped>
.related-product {
    padding-top: 40px;
}

.product-grid-container {
    margin-top: 20px;
}

.product-grid-container [class*="col-"] {
    margin-bottom: 20px;
}

.section_title {
    margin-bottom: 10px;
}

.section_title h2 {
    font-size: 24px;
    font-weight: 600;
    position: relative;
    display: inline-block;
    padding-bottom: 10px;
}

.section_title h2:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 2px;
    background-color: #f79837;
}
</style>