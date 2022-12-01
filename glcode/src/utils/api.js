/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-05-30 16:25:46
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-04 10:14:36
 * @FilePath: /gajumakr/glcode/src/utils/api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CreatAxios,api,tagsType } from './request'
import { StaticFun } from "./data"
// 密码登录
export function setPassword (params) {
    return CreatAxios({
        url: '/userServer/user/loginByPassword',
        method: 'POST',
        params
    })
}

// 发送验证码

export function sendVerEmail (params) {
    return CreatAxios({
        url: '/userServer/user/sendVerifyCode',
        method: 'POST',
        params
    })
}


//短信登录
export function sendLoginEmail (params) {
    return CreatAxios({
        url: '/userServer/user/loginByVerifyCode',
        method: 'POST',
        params
    })
}

// 获取当前用户详情

export function sendLogintoken (params) {

    return CreatAxios({
        url: 'userServer/user/getLoginUserDetail',
        method: 'POST',
        params
    })
}


//查询课程作品


//


// 保存作品

export function saveUpload (params) {

    let token = window.sessionStorage.getItem("userAdmin")

    return CreatAxios({
        url: `/contentServer/work/save?token=${token}`,
        method: 'POST',
        data: params
        // headers: {
        //     'token': token
        // }
    })
}


// 分页查询
export function fingUserWorks (params) {

    return CreatAxios({
        url: 'contentServer/work/pagePersonal',
        method: 'get',
        params

    })
}

// 发布作品
export function publishWork (params) {

    let token = window.sessionStorage.getItem("userAdmin")
    return CreatAxios({
        url: `/contentServer/work/publish?token=${token}`,
        method: 'POST',
        data: params

    })
}
// 查询作品素材
export function findExpres (params) {


    return CreatAxios({
        url: 'contentServer/tags/getByTypeNoParent',
        method: 'get',
        params

    })
}


// 查询课堂作业

export function findClassId (params) {
    let token = window.sessionStorage.getItem("userAdmin")
    return CreatAxios({
        url: `/contentServer/courseWorkCommit/getById?token=${token}`,
        method: 'get',
        params

    })
}

// 查询课堂任务数据

export function findClassTasekId (params) {
    let token = window.sessionStorage.getItem("userAdmin")
    return CreatAxios({
        url: `/contentServer/courseTaskCommit/getById?token=${token}`,
        method: 'get',
        params

    })
}

// 查询草稿作品

export function findontentServer (params) {
    let token = window.sessionStorage.getItem("userAdmin")
    return CreatAxios({
        url: `/contentServer/work/getById?token=${token}`,
        method: 'get',
        params

    })
}

// 课程作业提交

export function childrenAdd (params) {
    let token = window.sessionStorage.getItem("userAdmin")
    return CreatAxios({
        url: `/contentServer/courseWorkCommit/add?token=${token}`,
        method: 'post',
        data: params

    })
}



// 课堂任务提交

export function TaskCommitSend (params) {
    let token = window.sessionStorage.getItem("userAdmin")
    return CreatAxios({
        url: `/contentServer/courseTaskCommit/add?token=${token}`,
        method: 'post',
        data: params

    })
}

// 评价作业


export function courseWorkCommit (params) {
    let token = window.sessionStorage.getItem("userAdmin")
    return CreatAxios({
        url: `/contentServer/courseWorkCommit/evaluate?token=${token}`,
        method: 'get',
        params

    })
}



//评价任务


export function courseTaskCommit (params) {
    let token = window.sessionStorage.getItem("userAdmin")
    return CreatAxios({
        url: `/contentServer/courseTaskCommit/evaluate?token=${token}`,
        method: 'get',
        params

    })
}
// 添加动态添加文件路径
export function getUrlHead (params) {
    // let token = window.sessionStorage.getItem("userAdmin")
    return CreatAxios({
        url: `/userServer/bizCode/queryBizCodePOListByCategory?category=fileUrlPrefix`,
        method: 'post',
        params

    })
}
//取消采纳
export function setCancel (params) {
    let token = window.sessionStorage.getItem("userAdmin")?window.sessionStorage.getItem("userAdmin"):''
    return CreatAxios({
        url: `/contentServer/workMaterial/cancelAdopt`,
        method: 'post',
        headers: { 'token': token },
        params

    })
}
// 请求背景库素材标签
export function getTags(params) {
    let token = window.sessionStorage.getItem("userAdmin")?window.sessionStorage.getItem("userAdmin"):''
    let lang = document.documentElement.lang? document.documentElement.lang: "zh-cn";
    return   CreatAxios({
        url:`${api.getTagsByType}?language=${lang}&token=${token}`,
        method: "get",
        params
    })
}
// 新请求背景库素材标签-不需要传入tagsType
export function getMaterialTags(params) {
    let token = window.sessionStorage.getItem("userAdmin")?window.sessionStorage.getItem("userAdmin"):''
    let lang = document.documentElement.lang ? document.documentElement.lang : "zh-cn";
   
    
    return   CreatAxios({
        url:`${api.getMaterialTags}?language=${lang}`,
        method: "get",
        headers: { 'token': token },
        params
    })


}
// 通过标签号请求素材
export function getMaterial(params,openToken=true) {
    let token = window.sessionStorage.getItem("userAdmin")&&openToken?window.sessionStorage.getItem("userAdmin"):''
    let lang = document.documentElement.lang? document.documentElement.lang: "zh-cn";
    return   CreatAxios({
        url:`${api.getMaterialByType}?language=${lang}`,
        method: "get",
        headers: { 'token': token },
        params
    })
}
// 通过标签号请求角色素材
export function getRoleMaterial(params,openToken=true) {
    let token = window.sessionStorage.getItem("userAdmin")&&openToken?window.sessionStorage.getItem("userAdmin"):''
    let lang = document.documentElement.lang? document.documentElement.lang: "zh-cn";
    return   CreatAxios({
        url:`${api.getRoleMaterialByType}?language=${lang}`,
        method: "get",
        headers: { 'token': token },
        params
    })
}
//访问动态对象的动态属性
export function getDataByType (obj, dataOrtags, spriteOrbackOrsound) {
    const {
        [dataOrtags]: { [spriteOrbackOrsound]: name = "Unknown" },
    } = obj;
    return name;
};

export function setDataByType (obj, dataOrtags, spriteOrbackOrsound) {
    const {
        [dataOrtags]: { [spriteOrbackOrsound]: name = "Unknown" },
    } = obj;
    return obj;
};


