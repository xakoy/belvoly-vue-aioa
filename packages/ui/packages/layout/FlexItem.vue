<template>
    <div class="aioa-flex-item" :style="style">
        <slot />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        span: {
            type: [String, Number]
        },
        auto: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            style: {
                width: null,
                height: null,
                flex: null
            }
        }
    },
    created() {
        const isColumn = this.$parent.direction === 'column'
        const size = this.span ? (parseInt(this.span.toString()) / 24) * 100 + '%' : null

        this.style.width = isColumn ? null : size
        this.style.height = isColumn ? size : null
        this.style.flex = this.auto ? '1' : null
    }
}
</script>
