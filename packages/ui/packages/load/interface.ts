import Vue from 'vue'

export interface SubscriptionEventItem {
    name: string
    code: string
    description: string
}

export interface SubscriptionEvent extends Vue {
    events: SubscriptionEventItem[]

    trigger(eventName: string, data: any)
}
