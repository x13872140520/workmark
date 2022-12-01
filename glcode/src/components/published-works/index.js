/*
 * @Author: your name
 * @Date: 2022-03-10 13:07:25
 * @LastEditTime: 2022-07-14 13:09:16
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/components/published-works/index.js
 */
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { StaticFun } from "../../utils/data.js"
import html2canvas from 'html2canvas';
import { useSubscribe, usePublish, useUnsubscribe } from '../../Pusconnect/usePubSub'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/core/styles';
import stylaA from "./index.css"
import DigloContene from "./digloContene/index.js"
import { connect } from 'react-redux';
import { compose } from 'redux';
const styles = {
    titleA: {
        width: "100%",
        display: "flex",
        justifyContent: 'space-between',
        lineHeight: "30px",
        borderBbottom: "1px solid #f5f5f5",
        boxShadow: '0  2px 0 0  #f5f5f5',
    },
    contextA: {
        width: "700px",
        height: "400px",

    }
}



const ImgCanvas = (props) => {
    console.log(props, 'ccca')
    const canvasRef = useRef()
    const [propObj, setpropObj] = useState({})


    const getImgUlr = useSubscribe("newdataUrl", function (msg, data) {
        if (msg === 'newdataUrl') {
            setpropObj(data)
        }
    })



    useEffect(() => () => {
        unsubscribe(getImgUlr);
    }, [getImgUlr]);


    const opendow = useSubscribe('opendow', function (msg, data) {

        if (msg === "opendow") {
            setOpen(data.key)
            setpropObj({
                ...propObj,
                name: data.name

            })
        }
    });

    const unsubscribe = useUnsubscribe();

    //执行
    useEffect(() => () => {
        unsubscribe(opendow);
    }, [opendow]);

    const hanld = () => {

        cloneCanvas("ffa")

    }
    const cloneCanvas = (id) => {

        const ops = {
            scale: 1,
            width: 200,
            height: 200,
            useCORS: true,
            allowTaint: false,

        };
        let dom = document.getElementById(id)
        console.log(dom)
        html2canvas(dom, ops).then(canvas => {
            let dataURL = canvas.toDataURL("image/jpeg");
            console.log(dataURL)
        })
    }


    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const getFormValue = useRef();
    const subClick = () => {
        getFormValue?.current?.onSubmit()
    }
    const { classes } = props

    return (
        <div >
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="false"
                >
                    <DialogTitle id="alert-dialog-title" >

                        <div className={classes.titleA}>
                            <p>
                                发布作品
                            </p >
                            <div className={stylaA.svg}>
                                <CloseIcon onClick={handleClose}></CloseIcon>
                            </div>

                        </div>
                    </DialogTitle>
                    <DialogContent  >
                        <DialogContentText id="alert-dialog-description"
                            className={classes.contextA}
                        >
                            <DigloContene ref={getFormValue} data={propObj} hanclose={handleClose}
                                projectTitle={props.projectTitle}

                            >
                            </DigloContene>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        {/* 
                        <Button variant="contained" color="secondary" onClick={subClick}>
                            确认发布
                        </Button> */}
                    </DialogActions>
                </Dialog>
            </div>
        </div>

    )

}


export default withStyles(styles)(ImgCanvas)