import RecordingPage from '../components/RecordingPage.vue'
import VueCompositionAPI, { createApp, h } from '@vue/composition-api'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from "vue";

Vue.use(VueCompositionAPI).use(BootstrapVue).use(IconsPlugin)

const app = createApp({
  render: () => h(RecordingPage)
})

app.mount('#recording-page')