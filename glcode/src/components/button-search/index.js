/*
 * @Author: your name
 * @Date: 2022-03-31 15:13:33
 * @LastEditTime: 2022-04-13 11:22:34
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/components/button-search/index.js
 */
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import styleA from "./index.css"
import { StaticFun } from "../../utils/data"
import { EverysArray } from "../../utils/setting"
const ButtonSearch = () => {
    // categorySelected 动态css加这个了


    const [listArray, setListArray] = useState([])

    const handleInpout = (e) => {


        let rssultData = StaticFun.dataDictionary(EverysArray, e.target.value)


        if (rssultData.length > 0) {
            setListArray(rssultData)

        } else {
            setListArray([{
                name: "查询不到该数据"
            }])
        }

    }

    const handleCheckother = (e) => {

        //先获取滚动条dom
        var blocklyBox = document.getElementsByClassName("blocklyScrollbarHandle")

        let scrollDom = [...blocklyBox][2]

        scrollDom.y.baseVal.value = e.yaxios

        //实际滚动
        var blocklyBoxcanvas = document.getElementsByClassName("blocklyBlockCanvas")


        let blocklyBoxcanvasDom = [...blocklyBoxcanvas][1]

        console.log(blocklyBoxcanvasDom, scrollDom.y.baseVal,)
        blocklyBoxcanvasDom.setAttributeNS(null, "transform", `translate(0,${e.ytans})`)

        setListArray([])


    }


    return (
        <div className={styleA.searchHome}>
            <input className={styleA.searchInput} type="text" maxLength="18" placeholder="搜索积木"

                onChange={(e) => { handleInpout(e) }}

            />
            {
                listArray.length > 0 &&
                <ul className={styleA.searchHomeUl}>
                    {Array.isArray(listArray) && listArray.length > 0 &&
                        listArray.map((e, v) => {

                            return (<li className={styleA.searchHomeULi} key={v} onClick={() => handleCheckother(e)}>
                                {e.name}
                            </li>)
                        })
                    }
                </ul>


            }
        </div>
    )

}

export default ButtonSearch