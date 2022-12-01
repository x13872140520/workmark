/*
 * @Author: your name
 * @Date: 2022-04-22 14:09:59
 * @LastEditTime: 2022-10-24 10:01:40
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /mac/vite/vite-dmeo/src/utils/request.js
 */
import Axios from 'axios'
import Snackbar from '@material-ui/core/Snackbar';
// import axiosRetry from 'axios-retry'

import { useSubscribe, usePublish, useUnsubscribe } from '../Pusconnect/usePubSub'

const paddingMap = new Map()

//配置请求头
let oldheaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json'
}


//环境的切换

// if (process.env.NODE_ENV == 'development') {
//     Axios.defaults.baseURL = '119.91.133.113';
// } else if (process.env.NODE_ENV == 'debug') {
//     Axios.defaults.baseURL = '119.91.133.113';
// } else if (process.env.NODE_ENV == 'production') {
//     Axios.defaults.baseURL = '119.91.133.113';
// }
export const api = {
    getAllMaterialByType: 'contentServer/workMaterial/getAllMaterialByType',
    getMaterialByType: '/contentServer/workMaterial/getMaterialByType',//sound.json格式
    getTagsByType: '/contentServer/tags/getTagsByType',
    getMaterialTags: 'contentServer/tags/getMaterialTags',
    getSoundMaterialByType: '/contentServer/workMaterial/getMaterialByType',//getSoundMaterialByType已经废弃
    getRoleMaterialByType: '/contentServer/workMaterial/getRoleMaterialByType',//sprites.json格式
}
export const tagsType = {
    //40 41 42 43 44 45 目前综合站点的标签是写死的
    backDropType: '40',
    spritesType: '41,42,43',//sprite列表对应了机械模型，道具，页面效果3个tag的总和
    soundType: '44,45'//sound列表对应了44音乐，45音效的总和 
}
//请求超时的时间


//错误的状态码

const httpErrorStatusHandle = (error) => {
    const publish = usePublish();
    let messagetitle = ""
    if (error && error.response) {
        switch (error.response.status) {
            case 302: messagetitle = '接口重定向了！'; break;
            case 400: messagetitle = '参数不正确！'; break;
            case 401: messagetitle = '您未登录，或者登录已经超时，请先登录！';
                getoutloging()
                break;
            case 403: messagetitle = '您没有权限操作！'; break;
            case 404: messagetitle = `请求地址出错: ${error.response.config.url}`; break; // 在正确域名下
            case 408: messagetitle = '请求超时！'; break;
            case 409: messagetitle = '系统已存在相同数据！'; break;
            case 500: messagetitle = '服务器内部错误！'; break;
            case 501: messagetitle = '服务未实现！'; break;
            case 502: messagetitle = '网关错误！'; break;
            case 503: messagetitle = '服务不可用！'; break;
            case 504: messagetitle = '服务暂时无法访问，请稍后再试！'; break;
            case 505: messagetitle = 'HTTP版本不受支持！'; break;
            default: messagetitle = '异常问题，请联系管理员！'; break
        }
        if (error.message.includes('timeout')) messagetitle = '网络请求超时！';
        if (error.message.includes('Network')) messagetitle = window.navigator.onLine ? '服务端异常！' : '您断网了！';

        // Snackbar.error(messagetitle)

        publish("openMessage", {
            anchorOrigin: {
                vertical: 'top', horizontal: 'center'
            },
            open: true,
            message: messagetitle,
        })
    }


}

const getoutloging = () => {
    const publish = usePublish();
    sessionStorage.removeItem("userAdmin");
    sessionStorage.removeItem("userName");
    setTimeout(() => {

        publish("useLogin", true)
    }, 1000)


}

//生成每个请求唯一key
const getKey = (confing) => {
    let { url, methods, params, data } = confing

    if (typeof data === 'string') {
        data = JSON.parse(data)
    }
    return [url, methods, JSON.stringify(params), JSON.stringify(data)].join("&")


}
//存储请求

const addPending = (config) => {
    const pendingKey = getKey(config)
    config.cancelToken

}
// 删除重复的请求
const removePending = (config) => {

    const pendingKey = getKey(config)

    if (paddingMap.has(pendingKey)) {
        const cancelToken = paddingMap.get(pendingKey)
        cancelToken(pendingKey)
        paddingMap.delete(pendingKey)

    }
}
export const CreatAxios = (axiosConfig) => {

    console.log(process.env.ASSET_HOST, 'dydyd')
    const service = Axios.create({
        baseURL: axiosConfig.baseURL ? axiosConfig.baseURL : window.location.origin,
        timeOut: 10000,    //设置超时的时常   
        headers: axiosConfig.headers ? axiosConfig.headers : oldheaders
    })

    //添加请求拦截器

    service.interceptors.request.use(function (config) {
        //先删除重复的请求
        removePending(config)

        //然后判断取消重复请求是否开启
        addPending(config)

        if (!(config.params instanceof FormData)) {
            console.log('config11', config)
            config.oldheaders = {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=utf-8',
                ...config.headers,
            };
        } else {
            console.log('config22', config)
            config.headers = {
                ...config.headers,
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',

            };

        }



        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 响应拦截器
    service.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        removePending(response.config)


        if (response.status === 200) {
            return Promise.resolve(response);
        }



    }, function (error) {
        // 对响应错误做点什么

        // error => {
        //     error.config && removePending(error.config);
        //     httpErrorStatusHandle(error); // 处理错误状态码
        //     return Promise.reject(error); // 错误继续返回给到具体页面
        // }
        httpErrorStatusHandle(error)
        return Promise.reject(error);
    });

    return service(axiosConfig)
}




