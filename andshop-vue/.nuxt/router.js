import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _3b643580 = () => interopDefault(import('..\\pages\\404.vue' /* webpackChunkName: "pages/404" */))
const _4b384e74 = () => interopDefault(import('..\\pages\\about-us.vue' /* webpackChunkName: "pages/about-us" */))
const _495f7c8b = () => interopDefault(import('..\\pages\\admin\\index.vue' /* webpackChunkName: "pages/admin/index" */))
const _01b2f890 = () => interopDefault(import('..\\pages\\blog\\index.vue' /* webpackChunkName: "pages/blog/index" */))
const _57ee850c = () => interopDefault(import('..\\pages\\cart\\index.vue' /* webpackChunkName: "pages/cart/index" */))
const _6bf3e52e = () => interopDefault(import('..\\pages\\checkout.vue' /* webpackChunkName: "pages/checkout" */))
const _32ce40d8 = () => interopDefault(import('..\\pages\\checkout\\index.vue' /* webpackChunkName: "pages/checkout/index" */))
const _740e2ce2 = () => interopDefault(import('..\\pages\\coming-soon.vue' /* webpackChunkName: "pages/coming-soon" */))
const _dd90ef62 = () => interopDefault(import('..\\pages\\contact-us\\index.vue' /* webpackChunkName: "pages/contact-us/index" */))
const _0efe023f = () => interopDefault(import('..\\pages\\electronics.vue' /* webpackChunkName: "pages/electronics" */))
const _31564f44 = () => interopDefault(import('..\\pages\\faq.vue' /* webpackChunkName: "pages/faq" */))
const _2f35d33a = () => interopDefault(import('..\\pages\\furniture.vue' /* webpackChunkName: "pages/furniture" */))
const _b40faa56 = () => interopDefault(import('..\\pages\\grocery.vue' /* webpackChunkName: "pages/grocery" */))
const _3eeba19e = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _3ecf00f0 = () => interopDefault(import('..\\pages\\lookbook.vue' /* webpackChunkName: "pages/lookbook" */))
const _34f4ba0e = () => interopDefault(import('..\\pages\\my-account\\index.vue' /* webpackChunkName: "pages/my-account/index" */))
const _4a6406cc = () => interopDefault(import('..\\pages\\order-success.vue' /* webpackChunkName: "pages/order-success" */))
const _7b905e1b = () => interopDefault(import('..\\pages\\pharmacy.vue' /* webpackChunkName: "pages/pharmacy" */))
const _64b1a302 = () => interopDefault(import('..\\pages\\privacy-policy.vue' /* webpackChunkName: "pages/privacy-policy" */))
const _3b6ef41e = () => interopDefault(import('..\\pages\\profile\\index.vue' /* webpackChunkName: "pages/profile/index" */))
const _a20a5fea = () => interopDefault(import('..\\pages\\register.vue' /* webpackChunkName: "pages/register" */))
const _96ff8838 = () => interopDefault(import('..\\pages\\shop\\index.vue' /* webpackChunkName: "pages/shop/index" */))
const _34eef4eb = () => interopDefault(import('..\\pages\\vendor-dashboard\\index.vue' /* webpackChunkName: "pages/vendor-dashboard/index" */))
const _6fb49451 = () => interopDefault(import('..\\pages\\blog\\blog-2.vue' /* webpackChunkName: "pages/blog/blog-2" */))
const _6fc2abd2 = () => interopDefault(import('..\\pages\\blog\\blog-3.vue' /* webpackChunkName: "pages/blog/blog-3" */))
const _533ca8c4 = () => interopDefault(import('..\\pages\\blog\\blog-single-2.vue' /* webpackChunkName: "pages/blog/blog-single-2" */))
const _98727066 = () => interopDefault(import('..\\pages\\cart\\cart-2.vue' /* webpackChunkName: "pages/cart/cart-2" */))
const _98564164 = () => interopDefault(import('..\\pages\\cart\\cart-3.vue' /* webpackChunkName: "pages/cart/cart-3" */))
const _983a1262 = () => interopDefault(import('..\\pages\\cart\\cart-4.vue' /* webpackChunkName: "pages/cart/cart-4" */))
const _09cf1128 = () => interopDefault(import('..\\pages\\cart\\empty-cart.vue' /* webpackChunkName: "pages/cart/empty-cart" */))
const _d494c13a = () => interopDefault(import('..\\pages\\contact-us\\contact-us-2.vue' /* webpackChunkName: "pages/contact-us/contact-us-2" */))
const _a58e6244 = () => interopDefault(import('..\\pages\\my-account\\account-details.vue' /* webpackChunkName: "pages/my-account/account-details" */))
const _1b52f7e5 = () => interopDefault(import('..\\pages\\my-account\\account-info-edit.vue' /* webpackChunkName: "pages/my-account/account-info-edit" */))
const _76109a44 = () => interopDefault(import('..\\pages\\my-account\\addresses.vue' /* webpackChunkName: "pages/my-account/addresses" */))
const _fee2d444 = () => interopDefault(import('..\\pages\\my-account\\checkout-1.vue' /* webpackChunkName: "pages/my-account/checkout-1" */))
const _fec6a542 = () => interopDefault(import('..\\pages\\my-account\\checkout-2.vue' /* webpackChunkName: "pages/my-account/checkout-2" */))
const _be0998be = () => interopDefault(import('..\\pages\\my-account\\compare.vue' /* webpackChunkName: "pages/my-account/compare" */))
const _552898b2 = () => interopDefault(import('..\\pages\\my-account\\downloads.vue' /* webpackChunkName: "pages/my-account/downloads" */))
const _1060caca = () => interopDefault(import('..\\pages\\my-account\\order-tracking.vue' /* webpackChunkName: "pages/my-account/order-tracking" */))
const _6ddb77d9 = () => interopDefault(import('..\\pages\\my-account\\orders.vue' /* webpackChunkName: "pages/my-account/orders" */))
const _68b793b9 = () => interopDefault(import('..\\pages\\my-account\\wishlist.vue' /* webpackChunkName: "pages/my-account/wishlist" */))
const _7e2e7d02 = () => interopDefault(import('..\\pages\\product\\product-single-2.vue' /* webpackChunkName: "pages/product/product-single-2" */))
const _7e3c9483 = () => interopDefault(import('..\\pages\\product\\product-single-3.vue' /* webpackChunkName: "pages/product/product-single-3" */))
const _2978bdf9 = () => interopDefault(import('..\\pages\\shop\\shop-2.vue' /* webpackChunkName: "pages/shop/shop-2" */))
const _2986d57a = () => interopDefault(import('..\\pages\\shop\\shop-3.vue' /* webpackChunkName: "pages/shop/shop-3" */))
const _2994ecfb = () => interopDefault(import('..\\pages\\shop\\shop-4.vue' /* webpackChunkName: "pages/shop/shop-4" */))
const _29a3047c = () => interopDefault(import('..\\pages\\shop\\shop-5.vue' /* webpackChunkName: "pages/shop/shop-5" */))
const _40353e9c = () => interopDefault(import('..\\pages\\vendor-dashboard\\add-product.vue' /* webpackChunkName: "pages/vendor-dashboard/add-product" */))
const _4db9b567 = () => interopDefault(import('..\\pages\\vendor-dashboard\\order.vue' /* webpackChunkName: "pages/vendor-dashboard/order" */))
const _4afda648 = () => interopDefault(import('..\\pages\\vendor-dashboard\\product.vue' /* webpackChunkName: "pages/vendor-dashboard/product" */))
const _a30513fc = () => interopDefault(import('..\\pages\\vendor-dashboard\\profile.vue' /* webpackChunkName: "pages/vendor-dashboard/profile" */))
const _c6c561ae = () => interopDefault(import('..\\pages\\vendor-dashboard\\setting.vue' /* webpackChunkName: "pages/vendor-dashboard/setting" */))
const _16e28c1a = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _05203b20 = () => interopDefault(import('..\\pages\\blog\\_slug.vue' /* webpackChunkName: "pages/blog/_slug" */))
const _45fb47da = () => interopDefault(import('..\\pages\\product\\_id.vue' /* webpackChunkName: "pages/product/_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/404",
    component: _3b643580,
    name: "404"
  }, {
    path: "/about-us",
    component: _4b384e74,
    name: "about-us"
  }, {
    path: "/admin",
    component: _495f7c8b,
    name: "admin"
  }, {
    path: "/blog",
    component: _01b2f890,
    name: "blog"
  }, {
    path: "/cart",
    component: _57ee850c,
    name: "cart"
  }, {
    path: "/checkout",
    component: _6bf3e52e,
    children: [{
      path: "",
      component: _32ce40d8,
      name: "checkout"
    }]
  }, {
    path: "/coming-soon",
    component: _740e2ce2,
    name: "coming-soon"
  }, {
    path: "/contact-us",
    component: _dd90ef62,
    name: "contact-us"
  }, {
    path: "/electronics",
    component: _0efe023f,
    name: "electronics"
  }, {
    path: "/faq",
    component: _31564f44,
    name: "faq"
  }, {
    path: "/furniture",
    component: _2f35d33a,
    name: "furniture"
  }, {
    path: "/grocery",
    component: _b40faa56,
    name: "grocery"
  }, {
    path: "/login",
    component: _3eeba19e,
    name: "login"
  }, {
    path: "/lookbook",
    component: _3ecf00f0,
    name: "lookbook"
  }, {
    path: "/my-account",
    component: _34f4ba0e,
    name: "my-account"
  }, {
    path: "/order-success",
    component: _4a6406cc,
    name: "order-success"
  }, {
    path: "/pharmacy",
    component: _7b905e1b,
    name: "pharmacy"
  }, {
    path: "/privacy-policy",
    component: _64b1a302,
    name: "privacy-policy"
  }, {
    path: "/profile",
    component: _3b6ef41e,
    name: "profile"
  }, {
    path: "/register",
    component: _a20a5fea,
    name: "register"
  }, {
    path: "/shop",
    component: _96ff8838,
    name: "shop"
  }, {
    path: "/vendor-dashboard",
    component: _34eef4eb,
    name: "vendor-dashboard"
  }, {
    path: "/blog/blog-2",
    component: _6fb49451,
    name: "blog-blog-2"
  }, {
    path: "/blog/blog-3",
    component: _6fc2abd2,
    name: "blog-blog-3"
  }, {
    path: "/blog/blog-single-2",
    component: _533ca8c4,
    name: "blog-blog-single-2"
  }, {
    path: "/cart/cart-2",
    component: _98727066,
    name: "cart-cart-2"
  }, {
    path: "/cart/cart-3",
    component: _98564164,
    name: "cart-cart-3"
  }, {
    path: "/cart/cart-4",
    component: _983a1262,
    name: "cart-cart-4"
  }, {
    path: "/cart/empty-cart",
    component: _09cf1128,
    name: "cart-empty-cart"
  }, {
    path: "/contact-us/contact-us-2",
    component: _d494c13a,
    name: "contact-us-contact-us-2"
  }, {
    path: "/my-account/account-details",
    component: _a58e6244,
    name: "my-account-account-details"
  }, {
    path: "/my-account/account-info-edit",
    component: _1b52f7e5,
    name: "my-account-account-info-edit"
  }, {
    path: "/my-account/addresses",
    component: _76109a44,
    name: "my-account-addresses"
  }, {
    path: "/my-account/checkout-1",
    component: _fee2d444,
    name: "my-account-checkout-1"
  }, {
    path: "/my-account/checkout-2",
    component: _fec6a542,
    name: "my-account-checkout-2"
  }, {
    path: "/my-account/compare",
    component: _be0998be,
    name: "my-account-compare"
  }, {
    path: "/my-account/downloads",
    component: _552898b2,
    name: "my-account-downloads"
  }, {
    path: "/my-account/order-tracking",
    component: _1060caca,
    name: "my-account-order-tracking"
  }, {
    path: "/my-account/orders",
    component: _6ddb77d9,
    name: "my-account-orders"
  }, {
    path: "/my-account/wishlist",
    component: _68b793b9,
    name: "my-account-wishlist"
  }, {
    path: "/product/product-single-2",
    component: _7e2e7d02,
    name: "product-product-single-2"
  }, {
    path: "/product/product-single-3",
    component: _7e3c9483,
    name: "product-product-single-3"
  }, {
    path: "/shop/shop-2",
    component: _2978bdf9,
    name: "shop-shop-2"
  }, {
    path: "/shop/shop-3",
    component: _2986d57a,
    name: "shop-shop-3"
  }, {
    path: "/shop/shop-4",
    component: _2994ecfb,
    name: "shop-shop-4"
  }, {
    path: "/shop/shop-5",
    component: _29a3047c,
    name: "shop-shop-5"
  }, {
    path: "/vendor-dashboard/add-product",
    component: _40353e9c,
    name: "vendor-dashboard-add-product"
  }, {
    path: "/vendor-dashboard/order",
    component: _4db9b567,
    name: "vendor-dashboard-order"
  }, {
    path: "/vendor-dashboard/product",
    component: _4afda648,
    name: "vendor-dashboard-product"
  }, {
    path: "/vendor-dashboard/profile",
    component: _a30513fc,
    name: "vendor-dashboard-profile"
  }, {
    path: "/vendor-dashboard/setting",
    component: _c6c561ae,
    name: "vendor-dashboard-setting"
  }, {
    path: "/",
    component: _16e28c1a,
    name: "index"
  }, {
    path: "/blog/:slug",
    component: _05203b20,
    name: "blog-slug"
  }, {
    path: "/product/:id?",
    component: _45fb47da,
    name: "product-id"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
