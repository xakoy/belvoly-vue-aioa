export interface OPickerNode {
    id: string
    name: string
    text?: string
    value: string
    isParent: boolean
    nodeType?: string
    sequence: number
    data?: any
    /**
     * 是否可以选中,
     * @default false
     */
    cancheck?: boolean
    /**
     * 强制说明当前节点以及带了子节点带数据，点开父节点不异步加载数据
     * @default false
     */
    hasChildNodesData?: boolean
    /**
     * 子节点数据
     */
    nodes?: OPickerNode[]
    [key: string]: any
}
