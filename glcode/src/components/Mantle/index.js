/*
 * @Author: your name
 * @Date: 2022-03-20 11:49:08
 * @LastEditTime: 2022-03-21 15:04:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/components/Mantle/index.js
 */

import React from 'react';
import { useState, useEffect } from "react"
import styles from './index.css'

import ButtonM from '@material-ui/core/Button';
import { withStyles, createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useSubscribe, usePublish, useUnsubscribe } from '../../Pusconnect/usePubSub'

const Mantle = () => {
    const [count, setCount] = useState(false)


    const unsubscribe = useUnsubscribe();

    const modal = useSubscribe("modal", (msg, data) => {

        console.log(msg, data, "ppp")
        if (msg === "modal" && data) {
            setCount(true)

        }


    })

    useEffect(() => () => {
        unsubscribe(modal);
    })

    const handdleCheckou = () => {

        setCount(false)
    }
    return (
        <div className={count ? styles.block : styles.home} onClick={handdleCheckou}>

        </div>
    )
}
export default withStyles(styles)(Mantle)



