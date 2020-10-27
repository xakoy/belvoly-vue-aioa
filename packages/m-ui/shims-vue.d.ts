declare module '*.vue' {
    import Vue from 'vue'
    export default Vue
}

declare let BM
// declare let wx

interface Window {
    BM: any
    // wx: any
}
