/*
 * @Author: your name
 * @Date: 2022-03-22 10:56:52
 * @LastEditTime: 2022-05-26 09:56:03
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/components/message/index.js
 */

import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { unmountComponentAtNode, render } from "react-dom";
import {
    alpha,
    ThemeProvider,
    withStyles,
    makeStyles,
    createTheme,
} from '@material-ui/core/styles';

const styles = () => ({
    bootstrapRoot: {

        root: {

        },

    },
    root: {

    }

})

const SSnackbar = (props) => {

    useEffect(() => {
        const t = setTimeout(handleClose, 1000);
        return () => {
            t && clearTimeout(t);
        };
    }, [props.open]);
    const handleClose = () => {

        props.handlenewClose();
    }

    let { anchorOrigin, open, message, Transition } = props.mseprops
    let { classes } = props
    return (
        <div>

            <Snackbar
                anchorOrigin={anchorOrigin}
                open={open}
                onClose={handleClose}
                message={message}
                key={message}
                TransitionComponent={Transition}
                className={classes.root}
            ></Snackbar>
        </div>



    )

}
export default withStyles(styles)(SSnackbar)