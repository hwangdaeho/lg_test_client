export default {
  target: 'server',
  server: {
    host: process.env.WEB_BASE_HOST || 'localhost',
    port: process.env.WEB_BASE_PORT || 3000
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'LG TEST',
    htmlAttrs: {
      lang: 'ko'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', 'aria-label': 'LG FLEX' },
      { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png', sizes: '16x16' },
      { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png', sizes: '32x32' },
      { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico', 'aria-label': 'LG FLEX' }

    ],
    script: [{ src: 'https://kit.fontawesome.com/45ff15e1c9.js', crossOrigin: 'anonymous', body: true }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/app.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/flash-message.js', ssr: false },
    { src: '@/plugins/chart.js', ssr: false },
    // { src: '@/plugins/v-calendar.js', ssr: false },
    { src: '@/plugins/axios.js', ssr: false },
    { src: '@/plugins/auth.js', ssr: false },
    { src: '@/plugins/common.js', ssr: false },
    // { src: '@/plugins/date-format.js', mode: 'client' },
    // { src: '@/plugins/draggable.js', mode: 'client' },
    { src: '@/plugins/persisted-state.js' },
    { src: '@/plugins/vue-awesome-swiper.js', ssr: false },
    { src: '@/plugins/touch-scroll.js', ssr: false },
    { src: '@/plugins/moment.js', ssr: false },
    { src: '@/plugins/vue-slider-component.js', ssr: false },
    { src: '@/plugins/toast.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '@/components'
    ]
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/moment'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/dotenv',
    'nuxt-socket-io'
  ],

  bootstrapVue: {
    icons: true
  },

  router: {
    linkExactActiveClass: 'current-link',
    middleware: ['router-guard']
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_URL,
    withCredentials: true,
    headers: {
      accept: 'application/json'
    }
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    // withCredentials: true,
    // baseURL: process.env.API_URL
    // proxy: true,
    // baseURL: 'http://192.168.0.31:18080'
  },
  io: {
    sockets: [
      {
        name: 'main',
        url: process.env.IO_URL,
        default: true
      }
    ]
  },
  // proxy: {
  //   '/api/': 'http://192.168.0.31:18080'
  // },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      'three', 'urdf-loader'
    ],
    extend (config) {
      config.module.rules.push(
        {
          test: /\.(gltf)$/i,
          loader: 'file-loader'
        },
        {
          test: /\.(urdf)$/i,
          loader: 'file-loader'
        },
        {
          test: /\.(URDF)$/i,
          loader: 'file-loader'
        }
      )
    }
  },
  publicRuntimeConfig: {
    API_URL: process.env.API_URL
  }
}
