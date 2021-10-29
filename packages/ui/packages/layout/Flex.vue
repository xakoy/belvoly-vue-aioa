<template>
    <div class="bv-flex" :style="style">
        <slot />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        direction: {
            type: String
        },
        wrap: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        directionComputed: function() {
            return this.direction === 'column' ? 'column' : null
        },
        style: function() {
            return {
                ['flex-direction']: this.directionComputed,
                ['flex-wrap']: this.wrap ? 'wrap' : null,
                height: this.directionComputed === 'column' ? '100%' : null
            }
        }
    }
}
</script>

<style lang="less">
.bv-flex {
    display: flex;
}
</style>
