import Vue from 'vue'

export declare class TinymceEditor extends Vue {
    text: string

    imageUploadUrl?: string

    toolbar?: string

    validateEvent?: boolean

    getCleanText(): string
}

export declare class TinymceEditorPreview extends Vue {
    content: string
}
