<template>
    <div class="bvant-choose-people-or-org__item--warp bvant-choose-people-or-org__item-nochild ">
        <div class="bvant-choose-people-or-org__item" :class="{ 'van-hairline--bottom': border }">
            <div class="bvant-choose-people-or-org__item--avatar" @click="itemClickHandler">
                <img :src="icon" v-show="icon" />
            </div>
            <div class="bvant-choose-people-or-org__item--label" :class="{ 'bvant-choose-people-or-org__item--label-hasdescription': !!description }" @click="itemClickHandler">
                <div class="bvant-choose-people-or-org__item--label-title">{{ label }}</div>
                <div class="bvant-choose-people-or-org__item--label-description">{{ description }}</div>
            </div>
            <div v-if="cancheck" class="bvant-choose-people-or-org__item--checkbox">
                <bvan-checkbox :value="value" @input="inputHandler" shape="square" @change="changeHandler" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class NodeUser extends Vue {
    @Prop({ type: Boolean, default: true }) border: boolean
    @Prop({ type: Boolean, default: false }) cancheck: boolean
    @Prop() icon: string
    @Prop() label: string
    @Prop() description: string
    @Prop() value: any

    inputHandler(value) {
        this.$emit('input', value)
        this.$emit('change', value)
    }

    itemClickHandler() {
        this.inputHandler(!this.value)
    }

    changeHandler(value) {
        //
    }
}
</script>
