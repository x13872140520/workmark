/*
 * @Author: your name
 * @Date: 2022-03-08 16:00:23
 * @LastEditTime: 2022-10-31 09:27:01
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/components/user-login/index.js
 */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ButtonM from '@material-ui/core/Button';
import { withStyles, styled } from '@material-ui/core/styles';
import { useSubscribe, usePublish, useUnsubscribe } from '../../Pusconnect/usePubSub'
import "./index.css"
import da from "./da.png"
import TabPage from "./tabPage/index"
import ResetPage from "./resetPage/index"

import CloseIcon from '@material-ui/icons/Close'
import styleA from "./index.css"
import "./other.css"
import { padding } from "@mui/system";
const styles = {
    root: {
        borderRadius: '20px !impoerant',


    },
    titleA: {
        width: "100%",
        border: "10px",
        padding: 0

    },
    titleB: {

    }


};


const DiglogStyle = styled(Dialog)({
    borderRadius: "10px",

})


const UseLogin = (props) => {

    // 弹框开启和关闭
    const [countOpen, SetcountOpen] = useState(false)

    // 弹框决定是登录还是找回密码
    const [currentPage, setCurrentPage] = useState(1)

    //获取
    const useLogin = useSubscribe('useLogin', function (msg, data) {

        if (msg === "useLogin") {
            // setPassword({
            //     phone: "18224017456", password: "5d93ceb70e2bf5daa84ec3d0cd2c731a"
            // })
            // window.sessionStorage.setItem("userAdmin", 'admin')
            SetcountOpen(data)
            setCurrentPage(1)
        }
    });

    const unsubscribe = useUnsubscribe();

    //执行
    useEffect(() => () => {
        unsubscribe(useLogin);
    }, [useLogin]);
    const handleClose = () => {

        SetcountOpen(false)
    }
    // 切换找回密码还是账号注册
    const handlecheck = (e) => {

        setCurrentPage(e)

    }
    const handleold = (e) => {

        props.setOleName(e)

    }





    const { classes } = props
    return (
        <div>
            <DiglogStyle
                open={countOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={classes.root}
                PaperProps={{
                    style: { borderRadius: "20px", padding: "0" }
                }}
            >
                <DialogTitle id="alert-dialog-title" className={classes.titleA}>
                    <div className={styleA.Atitle}>

                        <p>登录</p>   <CloseIcon onClick={handleClose}></CloseIcon>
                    </div>

                </DialogTitle>
                <DialogContent className={classes.titleB}>
                    <DialogContentText id="alert-dialog-description">
                        {currentPage === 1 && <TabPage handlesetdig={handleClose} setName={handleold} />}
                        {currentPage === 2 && <ResetPage

                        />}
                        {currentPage === 3 && "账号注册"}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {/* <ButtonM onClick={() => handlecheck(2)} color="secondary">
                        找回密码
                    </ButtonM>
                    <ButtonM onClick={() => handlecheck(3)} color="secondary">
                        账号注册
                    </ButtonM> */}

                </DialogActions>
            </DiglogStyle>

        </div >

    )

}

export default withStyles(styles)(UseLogin)