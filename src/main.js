import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueCompositionAPI, { createApp, h } from '@vue/composition-api'
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueCompositionAPI).use(BootstrapVue).use(IconsPlugin)

const app = createApp({
  render: () => h(App)
})

app.mount('#app')