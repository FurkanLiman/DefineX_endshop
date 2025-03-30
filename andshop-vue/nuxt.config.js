export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'AndShop',
    titleTemplate: '%s - AndShop Ecommerce Vue js Template',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'AndShop Ecommerce Vue js, Nuxt js Template' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#f79837', throttle: 200, height: '3px', css: true },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/app.css',
    'vue-inner-image-zoom/lib/vue-inner-image-zoom.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-toast', mode: 'client' },
    { src: '~/plugins/vue-awesome-swiper', mode: 'client' },
    { src: '~/plugins/vue-inner-image-zoom', mode: 'client' },
    { src: '~/plugins/cart-init', mode: 'client' },
    { src: '~/plugins/axios', mode: 'client' },
    { src: '~/plugins/nuxt-init', mode: 'client' }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // API endpoint'ini yapılandırma (tüm İstekler için baseURL)
    baseURL: 'http://localhost:5000',
    debug: process.env.NODE_ENV !== 'production',
    proxy: false
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['vue-awesome-swiper', 'swiper', 'dom7'],
    
    // XML ve diğer dosya formatları için konfigürasyon
    extend(config, { isDev, isClient }) {
      // XML ve ICO dosyaları için file-loader ekliyoruz
      config.module.rules.push({
        test: /\.(xml|browserconfig|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      });
    }
  }
}
