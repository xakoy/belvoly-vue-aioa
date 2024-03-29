import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

export const routeNames = {
    pc: {
        tinymce: 'pc-tinymce',
        choose: 'pc-choose',
        upload: 'pc-upload',
        subscriptionEvent: 'pc-SubscriptionEvent',
        opicker: 'pc-opicker'
    },
    mobile: {
        choose: 'm-choose',
        opicker: 'opicker',
        upload: 'm-upload'
    }
}

const routes: RouteConfig[] = [
    {
        path: '/',
        component: () => import('./views/Index.vue')
    },
    {
        path: '/pc',
        component: () => import('./views/pc/Index.vue'),
        children: [
            {
                path: 'tinymce',
                name: routeNames.pc.tinymce,
                component: () => import('./views/pc/Tinymce.vue')
            },
            {
                path: 'upload',
                name: routeNames.pc.upload,
                component: () => import('./views/pc/Upload.vue')
            },
            {
                path: 'choose',
                name: routeNames.pc.choose,
                component: () => import('./views/pc/choose/Index.vue')
            },
            {
                path: 'opicker',
                name: routeNames.pc.opicker,
                component: () => import('./views/pc/opicker/Index.vue')
            },
            {
                path: 'subscription-event',
                name: routeNames.pc.subscriptionEvent,
                component: () => import('./views/pc/SubscriptionEvent.vue')
            }
        ]
    },
    {
        path: '/mobile',
        component: () => import('./views/mobile/Index.vue'),
        children: [
            {
                path: 'choose',
                name: routeNames.mobile.choose,
                component: () => import('./views/mobile/Choose.vue')
            },
            {
                path: 'upload',
                name: routeNames.mobile.upload,
                component: () => import('./views/mobile/Upload.vue')
            },
            {
                path: 'opicker',
                name: routeNames.mobile.opicker,
                component: () => import('./views/mobile/opicker/Index.vue')
            }
        ]
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
