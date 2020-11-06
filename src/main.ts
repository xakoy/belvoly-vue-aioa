import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import BVant from '@belvoly-vue-aioa/bvant'
import '@belvoly-vue-aioa/bvant/lib/index.css'

import { setGloablConfig } from '../packages/core'
import { setGloablConfig as setMobileGloablConfig } from '../packages/m-core'

setGloablConfig({ apiHost: 'http://192.168.101.135:2001/api' })
setMobileGloablConfig({
    apiHost: 'http://192.168.101.135:2001/api',
    token: 'd71cab23-3456-4bc4-a8ee-175923cd5ef5',
    o365: { enabled: true, baseURI: '', blobURI: '', supportFileExtensions: [] },
    wxwork: { enabled: true, debug: true, appId: 'wwc11ee87e20b78040', getJssdkTicketApiUrl: 'http://192.168.101.135:2001/sso/wework/jsapi/signature' }
})

Vue.use(BVant)
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router: router
}).$mount('#app')
