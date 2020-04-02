(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('axios'), require('element-ui')) :
    typeof define === 'function' && define.amd ? define(['exports', 'axios', 'element-ui'], factory) :
    (global = global || self, factory(global.core = {}, global.axios, global.elementUi));
}(this, (function (exports, axios, elementUi) { 'use strict';

    axios = axios && Object.prototype.hasOwnProperty.call(axios, 'default') ? axios['default'] : axios;

    /**
     * 字符串是否为null或者空
     * @param {String} value 输入字符串
     * @returns {Boolean} 判断结果
     */
    const isNullOrEmpty = function (value) {
        return !value || value.length === 0;
    };
    var string = {
        isNullOrEmpty
    };

    const gloablConfig = {
        apiHost: '',
        token: ''
    };
    function setGloablConfig(config) {
        gloablConfig.apiHost = config.apiHost;
        gloablConfig.token = config.token;
    }

    const axiosInstance = axios.create({});
    var Method;
    (function (Method) {
        Method["Post"] = "POST";
        Method["Get"] = "GET";
        Method["Put"] = "PUT";
        Method["Delete"] = "DELETE";
    })(Method || (Method = {}));
    const codeMessage = {
        200: '操作成功',
        201: '新建或修改数据成功',
        202: '一个请求已经进入后台排队（异步任务）',
        204: '删除数据成功。',
        400: '参数错误',
        401: '需要用户验证',
        403: '用户无权限',
        404: '资源不存在',
        405: '不支持的操作方法',
        406: '请求的格式不可得。',
        410: '请求的资源被永久删除，且不会再得到的',
        422: '当创建一个对象时，发生一个验证错误',
        500: '服务器内部错误',
        502: '应用程序错误',
        503: '维护中',
        504: '网关超时'
    };
    function errorShow(errorText) {
        elementUi.Notification.error({
            title: `请求错误:`,
            message: errorText || '请刷新重试、重新登录或联系管理员'
        });
    }
    function request(url, options) {
        const config = {
            method: 'GET',
            headers: {},
            ...options
        };
        config.url = url;
        const type = config.method;
        if (type === 'GET' && config.data) {
            const str = Object.keys(config.data)
                .map(key => {
                return `${key}=${encodeURIComponent(config.data[key])}`;
            })
                .join('&');
            config.url = `${config.url}${url.indexOf('?') > -1 ? '&' : '?'}_=${new Date().getTime()}&${str}`;
        }
        const token = gloablConfig.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        const contentType = config.headers['Content-Type'];
        if (contentType === 'application/x-www-form-urlencoded') {
            config.data = convertToAxiosData(config.data);
        }
        if (!contentType && (type === 'POST' || type === 'DELETE' || type === 'PUT')) {
            config.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                ...config.headers
            };
        }
        return new Promise(resolve => {
            axiosInstance
                .request(config)
                .then(response => {
                return new Promise((interResolve, interReject) => {
                    if (response.status >= 200 && response.status < 300) {
                        if (response.data.flag === 0) {
                            interResolve(response);
                        }
                        else {
                            interReject(response);
                        }
                    }
                    else {
                        interReject(response);
                    }
                });
            })
                .then(response => {
                resolve({
                    data: response.data.data,
                    response: response,
                    success: true
                });
            })
                .catch(e => {
                const status = getValue(e, 'response.status');
                const flag = getValue(e, 'data.flag');
                let errorText = '';
                if (flag && flag > 0) {
                    errorText = getValue(e, 'data.message', getValue(codeMessage, status, getValue(e, 'statusText', '')));
                }
                else {
                    errorText = '请刷新重试、重新登录或联系管理员';
                }
                errorShow(errorText);
                resolve({
                    error: e,
                    success: false
                });
            });
        });
    }
    function getValue(target, key, defaultValue) {
        const paths = typeof key === 'string' ? key.split('.') : [key];
        try {
            return paths.reduce((prev, path) => {
                return prev[path];
            }, target);
        }
        catch (e) {
            return defaultValue || '';
        }
    }
    function convertToAxiosData(data) {
        const result = new URLSearchParams();
        if (!data) {
            return result;
        }
        Object.keys(data).forEach(key => {
            result.set(key, data[key]);
        });
        return result;
    }
    var request$1 = {
        request
    };

    // export { request } from './request'

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        request: request$1,
        string: string
    });

    function upload(uploadData) {
        return request(`${gloablConfig.apiHost}/sharedservice/blob/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: uploadData
        });
    }
    /**
     * 更新附件业务关联表
     * @method updateRelevance
     *
     */
    function updateRelevance(updateRelevanceData) {
        return request(`${gloablConfig.apiHost}/sharedservice/blob/updateRelevance`, {
            method: 'POST',
            data: updateRelevanceData
        });
    }
    function remove(id) {
        return request(`${gloablConfig.apiHost}/sharedservice/blob/delete/${id}`, {
            method: 'POST'
        });
    }
    /**
     * 删除业务数据关联附件
     * @method deleteRelevance
     */
    const removeRelevance = function (deleteRelevanceData) {
        return request(`${gloablConfig.apiHost}/sharedservice/blob/delete?refTableId=${deleteRelevanceData.refTableId}&refTableName=${deleteRelevanceData.refTableName}`, {
            method: 'POST'
        });
    };
    /**
     * 查询附件列表
     * @method query
     *
     */
    const query = function (queryData) {
        return request(`${gloablConfig.apiHost}/sharedservice/blob/query`, {
            method: 'GET',
            data: queryData
        });
    };
    var attachmentService = {
        upload,
        remove,
        updateRelevance,
        removeRelevance,
        query
    };

    var index$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        attachmentService: attachmentService
    });

    exports.globalConfig = gloablConfig;
    exports.services = index$1;
    exports.setGloablConfig = setGloablConfig;
    exports.utils = index;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
