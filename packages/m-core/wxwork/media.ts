/**
 * 预览文件接口
 * https://work.weixin.qq.com/api/doc/90000/90136/90497
 */
export interface PreviewFileFunction {
    (options: { url: string; name: string; size: number }): void
}

/**
 * 预览图片接口
 * https://work.weixin.qq.com/api/doc/90000/90136/90495#%E9%A2%84%E8%A7%88%E5%9B%BE%E7%89%87%E6%8E%A5%E5%8F%A3
 */
export interface PreviewImageFunction {
    (options: { current: string; urls: string[] }): void
}

/**
 * 上传图片接口
 * https://work.weixin.qq.com/api/doc/90000/90136/90495#%E4%B8%8A%E4%BC%A0%E5%9B%BE%E7%89%87%E6%8E%A5%E5%8F%A3
 */
export interface UploadImageFunction {
    (options: { localId: string; isShowProgressTips: number; success: (res: { serverId: string }) => void })
}

/**
 * 下载图片接口
 * https://work.weixin.qq.com/api/doc/90000/90136/90495#%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87%E6%8E%A5%E5%8F%A3
 */
export interface DownloadImageFunction {
    (options: { serverId: string; isShowProgressTips: number; success: (res: { localId: string }) => void })
}

export interface WxworkMedia {
    previewImage: PreviewImageFunction
    previewFile: PreviewFileFunction
}
