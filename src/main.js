import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
// import axios from 'axios'

import ApiService from './common/api.service'
import DateFilter from './common/date.filter'
import ErrorFilter from './common/error.filter'
import VueFormGenerator from 'vue-form-generator'
import { FieldArray } from 'vfg-field-array'
import 'vue-form-generator/dist/vfg-core.css'
import VueFormulate from '@braid/vue-formulate'
import VueFeedbackReaction from 'vue-feedback-reaction'
import VJsoneditor from 'v-jsoneditor/src/index'
import VueApexCharts from 'vue-apexcharts'
import VueHtml2pdf from 'vue-html2pdf'

// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.filter('error', ErrorFilter)

ApiService.init()

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')

Vue.prototype.$orchestratorAddress = 'http://10.208.99.102:32656'

Vue.use(VueFormGenerator)
Vue.use(VueFeedbackReaction)

Vue.use(VJsoneditor)
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(VueHtml2pdf)

Vue.use(VueFormulate, {
  uploader: async function (file, progress, error, options) {
  try {
    options.uploadUrl = 'http://10.208.99.12:5000/api/orchestrator/files'
    const formData = new FormData()
    formData.append('file', file)
    const result = await fetch(options.uploadUrl, {
      method: 'POST',
      body: formData,
    })
    progress(100) // (native fetch doesn’t support progress updates)
    const data = await result.json()
    console.log(data)
    return data
    // return await result.json()
  } catch (err) {
    error('Unable to upload file')
  }
},
})

Vue.use(FieldArray)
