/*
 * @Author: your name
 * @Date: 2022-03-09 15:40:04
 * @LastEditTime: 2022-08-04 09:36:36
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/utils/data.js
 */

//封装的一些方法
import html2canvas from 'html2canvas';
import axios from "axios";
export class StaticFun {

    //  验证用户登录状态
    static getToken = (url) => {

        // 先截取？后面的base64链接
        let urlSplit = url.indexOf("?")
        if (urlSplit === -1) return false



        const urlResult = url.substr(urlSplit + 1, url.length)


        let baseUrl = decodeURIComponent(escape(window.atob(urlResult)))


        // 获取到url地址栏截取了
        let spliturl = baseUrl.split("&")
        let oarr = []
        spliturl.map((e, v) => {
            oarr.push(e.split("=")[1])
            return oarr
        })

        console.log(oarr, "oarr")

        let tskey = 0

        // 在这里做个switch判断

        switch (oarr[0]) {
            // 综合站点
            case "work":
                tskey = 1;
                break;
            //课堂任务提交
            case "commitTask":
                tskey = 2;
                break;
            //课程作业提交  
            case "commitWork":
                tskey = 3;
                break;
            // 课堂任务查看
            case "viewTask":
                tskey = 4;
                break;
            // 课程作业查看
            case "viewWork":
                tskey = 5;
                break;
            // 课堂任务评价
            case "evaluateTask":
                tskey = 6;
                break;
            // 课堂作业评价
            case "evaluateWork":
                tskey = 7;
                break;
            // 边学边做
            case "video":
                tskey = 8;
                break;
            //综合站点草稿箱
            case "editWork":
                tskey = 9;
                break;
            default:
                tskey = 0
        }

        console.log(oarr)
        return {
            baseUrl,
            oarr,
            tskey

        }
    }


    // file转base64
    static toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    //转成图片
    static base64toFile (data, fileName) {

        const dataArr = data.split(",");
        const byteString = atob(dataArr[1]);
        const options = {
            type: "image/jpeg",
            endings: "native"
        };
        const u8Arr = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            u8Arr[i] = byteString.charCodeAt(i);
        }
        return new File([u8Arr], fileName + ".jpg", options);//返回文件流
    }
    static htmlCanvas = (canvs = "", id = "") => {

        if (canvs === "" || id === "") {

            return false

        } else {

            //想要保存的图片节点
            const dom = document.getElementById(id)


            //设置截图的宽，高
            canvs.width = 400;
            canvs.height = 400;
            const scale = window.devicePixelRadio;

            console.log(scale)
            canvs.getContext('2d');
            //转化一下
            html2canvas(dom, {
                canvas: canvs,
                useCORS: true,  //设置跨域的
                logging: true,
                width: 400 + 'px',
                hegiht: 400 + 'px',
            }).then((canvas) => {

                const context = canvas.getContext('2d');
                // 关闭抗锯齿形
                context.mozImageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.msImageSmoothingEnabled = false;
                context.imageSmoothingEnabled = false;

                const retCanvas = document.createElement('canvas');
                const retCtx = retCanvas.getContext('2d');
                retCanvas.width = width;
                retCanvas.height = height;
                retCtx.drawImage(canvas, 0, 0, width, height, 0, 0, width, height);
                const img = document.getElementById(id)
                img.src = retCanvas.toDataURL('image/jpeg');  // 可以根据需要更改格式
                console.log(img)
                return img;

            })
        }



    }



    static cloneCanvas (id) {

        const ops = {
            scale: 5.5,
            width: 200,
            height: 200,
            useCORS: true,
            allowTaint: false,

        };
        let dom = document.getElementById(id)
        console.log(dom)
        html2canvas(dom, ops).then(canvas => {
            let dataURL = canvas.toDataURL("image/png");

            return dataURL
        })
    }


    //封装了一个promise
    static NewPromsie = (timer, cb) => {




        return new Promise((resolve, reject) => {
            setTimeout(() => {
                cb(resolve())


            }, timer)

        })
    }


    //封装一个数据词典
    static dataDictionary = (array, value) => {
        let resultArray = []

        if (isNaN(Number(value))) {

            array.map((e, v) => {

                if (value.includes(e.strSearch)) {
                    resultArray.push(e)

                }
            })
        } else {

            array.map((e, v) => {

                if (value.includes(e.numberSearch)) {
                    resultArray.push(e)

                }
            })

        }

        return resultArray


    }

    static toFormData (obj) {
        const data = new FormData();
        Object.keys(obj).forEach(key => {
            data.append(key, Array.isArray(obj[key]) ? obj[key].join(',') : obj[key]);
        });
        return data;
    }

    static Md5 = (a) => {

        console.log(a)

        function b (a, b) {
            return a << b | a >>> 32 - b
        }

        function c (a, b) {
            var c, d, e, f, g;
            return e = 2147483648 & a,
                f = 2147483648 & b,
                c = 1073741824 & a,
                d = 1073741824 & b,
                g = (1073741823 & a) + (1073741823 & b),
                c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
        }

        function d (a, b, c) {
            return a & b | ~a & c
        }

        function e (a, b, c) {
            return a & c | b & ~c
        }

        function f (a, b, c) {
            return a ^ b ^ c
        }

        function g (a, b, c) {
            return b ^ (a | ~c)
        }

        function h (a, e, f, g, h, i, j) {
            return a = c(a, c(c(d(e, f, g), h), j)),
                c(b(a, i), e)
        }

        function i (a, d, f, g, h, i, j) {
            return a = c(a, c(c(e(d, f, g), h), j)),
                c(b(a, i), d)
        }

        function j (a, d, e, g, h, i, j) {
            return a = c(a, c(c(f(d, e, g), h), j)),
                c(b(a, i), d)
        }

        function k (a, d, e, f, h, i, j) {
            return a = c(a, c(c(g(d, e, f), h), j)),
                c(b(a, i), d)
        }

        function l (a) {
            for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i;)
                b = (i - i % 4) / 4,
                    h = i % 4 * 8,
                    g[b] = g[b] | a.charCodeAt(i) << h,
                    i++;
            return b = (i - i % 4) / 4,
                h = i % 4 * 8,
                g[b] = g[b] | 128 << h,
                g[f - 2] = c << 3,
                g[f - 1] = c >>> 29,
                g
        }

        function m (a) {
            var b, c, d = "", e = "";
            for (c = 0; 3 >= c; c++)
                b = a >>> 8 * c & 255,
                    e = "0" + b.toString(16),
                    d += e.substr(e.length - 2, 2);
            return d
        }

        function n (a) {
            a = a.replace(/\r\n/g, "\n");
            for (var b = "", c = 0; c < a.length; c++) {
                var d = a.charCodeAt(c);
                128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192),
                    b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
                        b += String.fromCharCode(d >> 6 & 63 | 128),
                        b += String.fromCharCode(63 & d | 128))
            }
            return b
        }

        var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11,
            I = 16, J = 23, K = 6, L = 10, M = 15, N = 21;
        for (a = n(a),
            x = l(a),
            t = 1732584193,
            u = 4023233417,
            v = 2562383102,
            w = 271733878,
            o = 0; o < x.length; o += 16)
            p = t,
                q = u,
                r = v,
                s = w,
                t = h(t, u, v, w, x[o + 0], y, 3614090360),
                w = h(w, t, u, v, x[o + 1], z, 3905402710),
                v = h(v, w, t, u, x[o + 2], A, 606105819),
                u = h(u, v, w, t, x[o + 3], B, 3250441966),
                t = h(t, u, v, w, x[o + 4], y, 4118548399),
                w = h(w, t, u, v, x[o + 5], z, 1200080426),
                v = h(v, w, t, u, x[o + 6], A, 2821735955),
                u = h(u, v, w, t, x[o + 7], B, 4249261313),
                t = h(t, u, v, w, x[o + 8], y, 1770035416),
                w = h(w, t, u, v, x[o + 9], z, 2336552879),
                v = h(v, w, t, u, x[o + 10], A, 4294925233),
                u = h(u, v, w, t, x[o + 11], B, 2304563134),
                t = h(t, u, v, w, x[o + 12], y, 1804603682),
                w = h(w, t, u, v, x[o + 13], z, 4254626195),
                v = h(v, w, t, u, x[o + 14], A, 2792965006),
                u = h(u, v, w, t, x[o + 15], B, 1236535329),
                t = i(t, u, v, w, x[o + 1], C, 4129170786),
                w = i(w, t, u, v, x[o + 6], D, 3225465664),
                v = i(v, w, t, u, x[o + 11], E, 643717713),
                u = i(u, v, w, t, x[o + 0], F, 3921069994),
                t = i(t, u, v, w, x[o + 5], C, 3593408605),
                w = i(w, t, u, v, x[o + 10], D, 38016083),
                v = i(v, w, t, u, x[o + 15], E, 3634488961),
                u = i(u, v, w, t, x[o + 4], F, 3889429448),
                t = i(t, u, v, w, x[o + 9], C, 568446438),
                w = i(w, t, u, v, x[o + 14], D, 3275163606),
                v = i(v, w, t, u, x[o + 3], E, 4107603335),
                u = i(u, v, w, t, x[o + 8], F, 1163531501),
                t = i(t, u, v, w, x[o + 13], C, 2850285829),
                w = i(w, t, u, v, x[o + 2], D, 4243563512),
                v = i(v, w, t, u, x[o + 7], E, 1735328473),
                u = i(u, v, w, t, x[o + 12], F, 2368359562),
                t = j(t, u, v, w, x[o + 5], G, 4294588738),
                w = j(w, t, u, v, x[o + 8], H, 2272392833),
                v = j(v, w, t, u, x[o + 11], I, 1839030562),
                u = j(u, v, w, t, x[o + 14], J, 4259657740),
                t = j(t, u, v, w, x[o + 1], G, 2763975236),
                w = j(w, t, u, v, x[o + 4], H, 1272893353),
                v = j(v, w, t, u, x[o + 7], I, 4139469664),
                u = j(u, v, w, t, x[o + 10], J, 3200236656),
                t = j(t, u, v, w, x[o + 13], G, 681279174),
                w = j(w, t, u, v, x[o + 0], H, 3936430074),
                v = j(v, w, t, u, x[o + 3], I, 3572445317),
                u = j(u, v, w, t, x[o + 6], J, 76029189),
                t = j(t, u, v, w, x[o + 9], G, 3654602809),
                w = j(w, t, u, v, x[o + 12], H, 3873151461),
                v = j(v, w, t, u, x[o + 15], I, 530742520),
                u = j(u, v, w, t, x[o + 2], J, 3299628645),
                t = k(t, u, v, w, x[o + 0], K, 4096336452),
                w = k(w, t, u, v, x[o + 7], L, 1126891415),
                v = k(v, w, t, u, x[o + 14], M, 2878612391),
                u = k(u, v, w, t, x[o + 5], N, 4237533241),
                t = k(t, u, v, w, x[o + 12], K, 1700485571),
                w = k(w, t, u, v, x[o + 3], L, 2399980690),
                v = k(v, w, t, u, x[o + 10], M, 4293915773),
                u = k(u, v, w, t, x[o + 1], N, 2240044497),
                t = k(t, u, v, w, x[o + 8], K, 1873313359),
                w = k(w, t, u, v, x[o + 15], L, 4264355552),
                v = k(v, w, t, u, x[o + 6], M, 2734768916),
                u = k(u, v, w, t, x[o + 13], N, 1309151649),
                t = k(t, u, v, w, x[o + 4], K, 4149444226),
                w = k(w, t, u, v, x[o + 11], L, 3174756917),
                v = k(v, w, t, u, x[o + 2], M, 718787259),
                u = k(u, v, w, t, x[o + 9], N, 3951481745),
                t = c(t, p),
                u = c(u, q),
                v = c(v, r),
                w = c(w, s);
        var O = m(t) + m(u) + m(v) + m(w);
        return O.toLowerCase()

    }
    // 先把图片转成bolb
    static UrltoFile = (urlDatal, fileName) => {

        let arr = urlDatal.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let bytes = atob(arr[1]); // 解码base64
        let n = bytes.length
        let ia = new Uint8Array(n);
        while (n--) {
            ia[n] = bytes.charCodeAt(n);
        }
        return new File([ia], fileName, { type: mime });



    }




    static downFile = (fileUrl) => {






        const fetch = require('node-fetch');
        return fetch(fileUrl)
            .then((res) =>
                console.log(res)

            )
            .then((blob) => {
                let tempfile = null;
                tempfile = new File([blob], "nwe", {
                    type: "sb3",  //传参
                    lastModified: Date.now(),
                });
                return tempfile

            });


    }






}