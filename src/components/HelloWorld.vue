<template>
    <editor />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Editor from '../../packages/tinymce/Editor.vue'

@Component({
    components: {
        Editor
    }
})
export default class HelloWorld extends Vue {
    @Prop() private msg!: string
}
</script>
