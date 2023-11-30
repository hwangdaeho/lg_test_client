import Vue from 'vue'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css'

Vue.use(VueToast, {
  position: 'bottom-left',
  duration: 2000,
  pauseOnHover: false,
  queue: true
})
