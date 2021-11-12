import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import BVant from '@belvoly-vue-aioa/bvant'
import '@belvoly-vue-aioa/bvant/lib/index.css'

import { setGloablConfig } from '../packages/core'
import { setGloablConfig as setMobileGloablConfig } from '../packages/m-core'

setGloablConfig({
    token: 'f5aac5882e7a4e23910fd8d35943b2e2',
    apiHost: 'http://192.168.24.111/api',
    o365: {
        enabled: true,
        baseURI: 'http://192.168.24.111/wpscloud/web/?fileUrl=',
        blobURI: 'http://192.168.24.111/api/sharedservice/blob',
        supportFileExtensions: ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.pdf', '.wps', '.dps', '.et', '.txt', '.zip', '.rar', '.7z', '.gif', '.jpg', '.jpeg', '.png', '.wpt']
    }
})
setMobileGloablConfig({
    apiHost: 'http://192.168.24.111/api',
    token: 'f69d5b5c5ec946bdb58f30fa12c1edfa',
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
