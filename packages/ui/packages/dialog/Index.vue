<template>
    <el-dialog ref="dialog" :close-on-click-modal="closeOnClickModal" :append-to-body="appendToBody" :width="width" v-bind="props" v-on="$listeners">
        <template #title>
            <span class="el-dialog__title">{{ title }}</span>
            <div class="bv-dialog__buttons" v-if="$slots.buttons">
                <slot name="buttons" />
            </div>
        </template>
        <slot />
        <template #footer>
            <slot name="footer" />
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { throttle } from '../../utils/_'

function isInIE() {
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return true
    } else {
        return false
    }
}

const ie = isInIE()
type Size = 'small' | 'medium' | 'large'

@Component
export default class AioaDialog extends Vue {
    /**
     * 是否子元素自已滚动，默认false，如果是true，则子元素自身高度100%，自己控制高度，必须是flex
     */
    @Prop({ default: false, type: Boolean }) isChildAutoScroll: boolean
    @Prop({ default: 'small', type: String }) size: Size
    @Prop({ default: true, type: Boolean }) appendToBody: boolean
    @Prop({ type: String }) title
    @Prop({ default: false, type: Boolean }) closeOnClickModal: boolean

    get props() {
        return {
            ...this.$attrs,
            ['custom-class']: 'bv-dialog ', // + this.$attrs['custom-class']
            ['class']:
                'bv-dialog__wrapper ' + (this.isChildAutoScroll ? `bv-dialog__autoheight ` : ' ') + (ie && this.isChildAutoScroll ? 'bv-dialog__autoheight-ie ' : ' ') + (this.$attrs['class'] || '')
        }
    }

    get width() {
        if (this.$attrs.width) {
            return this.width
        }
        switch (this.size) {
            case 'small':
                return '600px'
            case 'medium':
                return '800px'
            default:
                return '1000px'
        }
    }

    observer: MutationObserver = null

    mounted() {
        if (ie) {
            this.$nextTick(() => {
                const dialog = this.$el.querySelector('.el-dialog') as HTMLDivElement
                const target = this.$el.querySelector('.el-dialog__body') as HTMLDivElement
                const callback = throttle(() => {
                    const ntHeight = target.offsetHeight
                    const ndHeight = dialog.offsetHeight
                    if (ntHeight > ndHeight) {
                        target.style.height = ndHeight - 120 + 'px'
                        this.cancelObserver()
                    }
                    console.log(target.offsetHeight)
                }, 1000)
                // 创建一个观察器实例并传入回调函数
                const observer = new MutationObserver(callback)
                observer.observe(target, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                })
                this.observer = observer
            })
        }
    }

    destroyed() {
        this.cancelObserver()
    }

    cancelObserver() {
        if (this.observer) {
            this.observer.disconnect()
            this.observer.takeRecords()
            this.observer = null
        }
    }
}
</script>

<style lang="less">
@import '../../css/initial.less';

.bv-dialog__autoheight-ie {
    display: flex;
}
.bv-dialog__autoheight {
    .aioa-dialog {
        flex-direction: row;
        > .el-dialog__header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            box-sizing: border-box;
        }
        > .el-dialog__body {
            margin-top: 56px;
            flex: 1;
        }
        > .el-dialog__footer {
            display: none;
        }
    }
}

.bv-dialog {
    max-height: calc(100vh - 10%);
    height: auto;
    max-width: 90%;
    top: 16%;
    left: 50%;
    margin: 0 !important;
    transform: translate(-50%, -10%);
    display: flex;
    flex-direction: column;
    position: relative;
    .bgcolor(color-foreground);

    &__buttons {
        padding: 12px 0;
        position: absolute;
        top: 0;
        right: 50px;
    }
    > .el-dialog__header {
        height: 60px;
        .bgcolor(color-foreground);
        box-shadow: -2px 1px 4px 0px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 2;
        box-sizing: border-box;
        > .el-dialog__title {
            font-size: 16px;
            font-weight: 600;
        }
    }

    > .el-dialog__body {
        padding: 0 !important;
        overflow: auto;
        // flex: 1;
    }
    > .el-dialog__footer {
        .bgcolor(color-background);
        padding: 10px 20px;
        text-align: right;
        overflow: hidden;
    }
}
</style>
