export interface ChooseNode {
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
    nodes?: ChooseNode[]
    [key: string]: any
}

export interface ChooseItemNode extends ChooseNode {
    avatar?: string
    subName?: string
}

export type ObjectiveDataType = 'category' | 'item'
export interface Objective<C extends object = {}> {
    code: string
    title: string
    config: C
    url: string
    chainAjax?: (ajax: any, type: ObjectiveDataType) => void
    /**
     * 数据转换，第一次请求接口，会调用此方法
     */
    dataConvert?: (data: any, type: ObjectiveDataType) => (ChooseNode | ChooseItemNode)[]
    /*
     * 数据项过滤事件
     * @event dataFilter
     * @param {object} 过滤的数据项
     */
    dataFilter<T>(item, config: C, obj: Objective<C>, options: { selectionMode: string }, type: ObjectiveDataType): ChooseNode | ChooseItemNode
    /*
     * 获取静态数据数据源
     * @event getStaticDataSource
     */
    getStaticDataSource?: Function

    getSearchUrl?: (config: C) => string
    /*
     * 获取服务Url事件
     * @event getUrl
     * @param {json} config
     * @param {string} url[default=this.url] 要包装的Url默认为当前url属性
     */
    getUrl?: (config: C, url: string, category: string, type: ObjectiveDataType) => string
    /*
     * 是否显示图标
     * @event showIcon
     * @param {object} 数据项
     */
    showIcon?: (item) => boolean
}
