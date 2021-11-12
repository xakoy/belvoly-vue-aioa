<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class App extends Vue {}
</script>

<style>
body,
html {
    height: 100%;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
}
* {
    padding: 0;
    margin: 0;
}

@media (prefers-color-scheme: dark) {
    :root {
        --color-background: #000 !important;
        --color-foreground: #222222 !important;

        --color-text-primary: #eaeaea !important;

        --border-color-base: #5e5e5e !important;
    }
}
</style>
