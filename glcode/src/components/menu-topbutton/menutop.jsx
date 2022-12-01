/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-04-13 11:23:20
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-08-03 16:09:54
 * @FilePath: /gajumakr/glcode/src/components/menu-topbutton/menutop.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: your name
 * @Date: 2022-02-28 10:22:28
 * @LastEditTime: 2022-06-14 09:39:04
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/workmark/src/components/menu-topbutton/menutop.jsx
 */
import React from "react";
import { useState, useEffect } from "react";
import styles from "./menutop.css";
// import { Button } from 'antd';
import ButtonM from "@material-ui/core/Button";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {
    withStyles,
    createTheme,
    ThemeProvider,
} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    useSubscribe,
    usePublish,
    useUnsubscribe,
} from "../../Pusconnect/usePubSub";
import Message from "../../utils/message";
import Tooltip from "@mui/material/Tooltip";
import SB3Downloader from "../../containers/sb3-downloader.jsx";
const styleA = {
    root: {
        minHeight: "20px",
    },
    buttonOne: {
        marginLeft: "20px",
        background: "red",
        color: "#FFFFFF",
        fontSize: "14px",
    },
    buttonProgress: {
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
        minHeight: "20px",
    },
    buttonTwo: {
        marginLeft: "20px",
        background: "#FFBD14",
        color: "#FFFFFF",
        fontSize: "14px",
    },
};
const theme = createTheme({
    palette: {
        red: {
            main: "#F12929",
        },
        yellow: {
            main: "#FFBD14",
        },
    },
});
const Menutop = (props) => {

    const [digopen, setdigopen] = useState(false)
    const unsubscribe = useUnsubscribe();
    const loginSuccess = useSubscribe("loginSuccess", function (msg, data) {
        if (msg === "loginSuccess") {
            SetbuttonKey({
                saveKey: false,
                openKey: false,
            });

            settootipKey({
                saveTitle: "保存作品",
                openTitle: "发布作品",
            });
        }
    });






    //执行
    useEffect(
        () => () => {
            unsubscribe(loginSuccess);
        },
        [loginSuccess]
    );





    const succellOk = useSubscribe("succellOk", function (msg, data) {
        if (msg === "succellOk") {
            SetbuttonKey({
                saveKey: true,
                openKey: true,
            });
            settootipKey({
                saveTitle: "发布成功",
                openTitle: "发布成功",
            });


            setdigopen(true)
        }
    });



    useEffect(
        () => () => {
            unsubscribe(succellOk);
        },
        [succellOk]
    );


    const [buttonKey, SetbuttonKey] = useState({
        saveKey: true,
        openKey: true,
    });

    const [tootipKey, settootipKey] = useState({
        saveTitle: "请先登录",
        openTitle: "请先登录",
    });
    const { classes, loading } = props;

    useEffect(() => {
        let userAdmin = window.sessionStorage.getItem("userAdmin");
        if (userAdmin && userAdmin != null && userAdmin != "undefined") {
            SetbuttonKey({
                saveKey: false,
                openKey: false,
            });
            settootipKey({
                saveTitle: "保存作品",
                openTitle: "发布作品",
            });
        }

    }, []);
    const handleSaveToJsonClick = (e) => {
        props.onSaveToJsonClick(e);
    };
    const handleSaveClick = (e) => {
        SetbuttonKey(false);
        props.onSaveChange(e);
        if (e === 1) {
            SetbuttonKey({
                ...buttonKey,
                openKey: false,

            });
            settootipKey({
                openTitle: "发布作品到综合平台",
            });
        }
    };
    const handlego = (e) => {


        if (e === 1) {
        let closeid= window.sessionStorage.getItem("worksid")
            window.parent.postMessage({
                workid: closeid,
                msg:"success"
            }, '*');
            setdigopen(false)
            window.sessionStorage.removeItem('worksid');
        } else {
            window.sessionStorage.removeItem('worksid');
            setdigopen(false)
            SetbuttonKey({
                saveKey: false,
                openKey: false,
            });

        }
    }



    return (
        <div className={styles.menutopBox}>
            {/* <div onClick={()=>{handleSaveToJsonClick()}}>save toJSON</div> */}
            <ThemeProvider theme={theme}>
                <Tooltip title={tootipKey.saveTitle}>
                    <span>
                        <SB3Downloader>
                            {(_, downloadProject) => {
                                return (
                                    <ButtonM
                                        ButtonM
                                        size="small"
                                        loading={loading}
                                        onClick={() => {
                                            handleSaveClick(1);
                                            // ,downloadProject(1)
                                        }}
                                        className={classes.buttonOne}
                                        variant="contained"
                                        disabled={buttonKey.saveKey}
                                        style={{ minHeight: "32px" }}
                                    >
                                        {loading ? (
                                            "保存"
                                        ) : (
                                            <CircularProgress
                                                size={24}
                                                className={
                                                    classes.buttonProgress
                                                }
                                            ></CircularProgress>
                                        )}
                                    </ButtonM>
                                );
                            }}
                        </SB3Downloader>
                    </span>
                </Tooltip>
                <Tooltip title={tootipKey.openTitle}>
                    <span>
                        <ButtonM
                            size="small"
                            loading={loading}
                            onClick={() => handleSaveClick(2)}
                            className={classes.buttonTwo}
                            variant="contained"
                            disabled={buttonKey.openKey}
                            style={
                                buttonKey.openKey
                                    ? { pointerEvents: "none" }
                                    : {}
                            }
                        >
                            发布
                        </ButtonM>
                    </span>
                </Tooltip>

                <div>
                    <Dialog open={digopen}>
                        <DialogTitle style={{ minHeight: "32px", fontSize: "25px" }} >恭喜你，作品发布成功了！</DialogTitle>
                        <div style={{ display: 'flex', justifyContent: "space-around" }}>
                            <ButtonM size="small" style={{ minHeight: "32px", fontSize: "16px" }} onClick={() => handlego(1)}>查看作品</ButtonM>
                            <ButtonM size="small" style={{ minHeight: "32px", fontSize: "16px" }} onClick={() => handlego(2)}>继续创作</ButtonM>
                        </div>

                    </Dialog>

                </div>
            </ThemeProvider>
        </div>
    );
};

export default withStyles(styleA)(Menutop);
