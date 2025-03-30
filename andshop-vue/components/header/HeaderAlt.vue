<template>
    <div>
        <header>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div class="header-main">
                            <div class="header-left">
                                <div class="logo">
                                    <a href="index.html">
                                        <img
                                            :src="require('@/assets/img/logo.png')"
                                            class="img-fluid"
                                            alt="Logo"
                                        />
                                    </a>
                                </div>
                            </div>
                            <div class="header-right">
                                <ul>
                                    <li class="onhover-div mobile-cart">
                                        <div class="cart-qty-cls">{{ cartQty }}</div>
                                        <div @click="toggleCart()">
                                            <i class="fas fa-shopping-cart"></i>
                                        </div>
                                    </li>
                                    <cart-canvas />
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import CartCanvas from "~/components/cart/CartCanvas.vue";

export default {
    name: "HeaderAlt",
    components: {
        CartCanvas
    },
    data() {
        return {
            active: false,
            showSearchForm: false,
        };
    },
    computed: {
        ...mapGetters({
            cartQty: 'cart/cartQty',
        })
    },
    methods: {
        toggleCart() {
            this.$root.$emit('bv::toggle::offcanvas', 'offcanvasRight')
        }
    },
};
</script> 