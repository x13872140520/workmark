/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-07-11 09:03:17
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-07-22 13:22:11
 * @FilePath: /gajumakr/glcode/src/components/evaluation-message/index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import {
    useSubscribe,
    usePublish,
    useUnsubscribe,
} from "../../Pusconnect/usePubSub";
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import InputAdornment from '@mui/material/InputAdornment';
import Immutable from 'immutable';
import iconclose from "./icon--close.svg"
import { courseWorkCommit, courseTaskCommit } from "../../utils/api"
// logo 和用户demo头像
import clogo from './clogo.png';
import pei from './pei.png';
import {
    alpha,
    ThemeProvider,
    withStyles,
    makeStyles,
    createTheme,
    styled,

} from '@material-ui/core/styles';
import style from './index.css';

const styles = theme => ({
    dighome: {
        minWidth: "500px",

    },
    goodhome: {
        padding: "15px",

    },

});

const NewDialogTitle = (props) => {
    const { children, onClose, ...other } = props;


    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            <img src={clogo} alt="" className={style.imgs} />


            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 20,

                }}
            >
                <img src={iconclose} alt="" />
            </IconButton>

        </DialogTitle>

    )

}




// 评价分数





//高阶组件？
// 自定义input样式
const StyleInput = styled(TextField)({
    width: "100px",
    height: "32px",
    lineHeight: 1.5,
    border: "1px solid #AAAAAA",
    borderRadius: " 4px",
    '& .MuiInputBase-colorPrimary': {
        height: "32px",
    }

})

// 自定义button样式
const StyleButton = styled(Button)({

    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    color: "#FFFFFF",
    lineHeight: 1.5,
    backgroundColor: '#F65335',
    borderColor: '#F65335',
    '&:hover': {
        backgroundColor: '#F65335',
        borderColor: '#F65335',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#F65335',
        boder: 'none'
    },
    '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },


})

const EvaluationMessage = (props) => {


    const handleChang = (e, v) => {


        let checkArra = NewMap.filter((set) => set.filter === v.filter)
        checkArra[0].value = e.target.value

        let otherArra = NewMap.filter((set) => set.filter !== v.filter)
        otherArra.push(...checkArra)
        setNewMap([...otherArra])


    }

    const checkouMap = [
        {
            name: "构思能力",
            value: 3,
            filter: "conceptionAbility"

        }, {
            name: "创新能力",
            value: 3,
            filter: "innovationAbility"
        }, {
            name: "创造能力",
            value: 3,
            filter: "creativeAbility"
        }, {
            name: "逻辑思维能力",
            value: 3,
            filter: "logicalThinkingAbility"
        }, {
            name: "审美能力",
            value: 3,
            filter: "aestheticAbility"
        }, {
            name: "认知能力",
            value: 3,
            filter: "cognitiveAbility"
        }

    ]
    const [NewMap, setNewMap] = useState([
        {
            name: "构思能力",
            value: 3,
            filter: "conceptionAbility"

        }, {
            name: "创新能力",
            value: 3,
            filter: "innovationAbility"
        }, {
            name: "创造能力",
            value: 3,
            filter: "creativeAbility"
        }, {
            name: "逻辑思维能力",
            value: 3,
            filter: "logicalThinkingAbility"
        }, {
            name: "审美能力",
            value: 3,
            filter: "aestheticAbility"
        }, {
            name: "认知能力",
            value: 3,
            filter: "cognitiveAbility"
        }

    ]


    )

    // 弹窗入口
    // const handleClickOpen = () => {
    //     setOpen(true);
    // };


    const [cpeopleObj, setpeopleObj] = useState({
        score: "",
        comment: ""

    })

    // 链接地址可能是动态的
    const [urlSrc, seturlSrc] = useState("http://182.61.146.154:20210")


    const { classes, onCloseOpen, peopleObj } = props

    const [demoOne, setdemoOne] = useState(false)
    const [demoTwo, setdemoTwo] = useState(false)

    const publish = usePublish();

    const handleSubDig = () => {
        console.log(cpeopleObj, NewMap, peopleObj)

        if (cpeopleObj.comment === "") {

            setdemoOne(true)
            return false
        } else if (cpeopleObj.score === "") {

            setdemoTwo(true)
            return false
        }
        // 操作数组
        let arrC = {}
        NewMap.map((e, v) => {

            return arrC[e.filter] = (100 / 5) * e.value
        })


        console.log(arrC, peopleObj)

        let params = {
            id: peopleObj?.oarr[1],
            comment: cpeopleObj.comment,
            score: cpeopleObj.score,
            ...arrC
        }

        return ((peopleObj && peopleObj.tskey === 7) ? courseWorkCommit(params) : courseTaskCommit(params)).then(
            res => {
                if (res && res.data.code === "200") {
                    onCloseOpen()
                    publish("openMessage", {
                        anchorOrigin: {
                            vertical: 'top', horizontal: 'center'
                        },
                        open: true,
                        message: "评价成功",

                    })
                } else {

                    publish("openMessage", {
                        anchorOrigin: {
                            vertical: 'top', horizontal: 'center'
                        },
                        open: true,
                        message: "用户身份已失效,请重新登陆",

                    })
                }
            }
        )






    }


    const handleText = (e) => {
        setdemoOne(false)
        setpeopleObj({
            ...cpeopleObj,
            comment: e.target.value
        })
    }
    const min = 0;
    const max = 100;
    const [value, setValue] = useState();
    return (
        <div>

            <Dialog
                onClose={onCloseOpen}
                aria-labelledby="customized-dialog-title"
                open={props.openDig}
                className={style.dighome}
            >
                <NewDialogTitle
                    classes={{ root: classes.dighome }}
                    id="customized-dialog-title" onClose={onCloseOpen}>
                    评价
                </NewDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        <div className={style.dighomefirst}>
                            <img src={`${urlSrc}${peopleObj.imageURL}`} alt="" />
                            <h2>{peopleObj.userName}</h2>
                        </div>
                        <div className={style.boxfle}>
                            <div className={style.difir}>
                                {checkouMap.map((c, v) => {
                                    return (
                                        <div className={style.Ratin}>
                                            <p className={style.Ratinp}>{c.name}</p>
                                            <div>
                                                <Rating name="half-rating"
                                                    defaultValue="3"
                                                    onChange={(event) => handleChang(event, c)}
                                                    precision={0.5} />

                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={style.dobs}>
                                <h2>{peopleObj.name}</h2>
                                <div className={style.smallBox}>
                                    <div className={style.smallBoxfirst}>评语</div>
                                    <TextField
                                        className={style.ditext}
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={6}
                                        onChange={handleText}
                                        inputProps={{ maxLength: 200 }}
                                    >
                                    </TextField>
                                    {demoOne && <p style={{ color: "red" }}>不能为空</p>}
                                </div>
                            </div>
                        </div>

                    </Typography>

                </DialogContent>
                <DialogActions>

                    <div className={style.Action}>
                        <div className={style.Actionflex} >
                            <p>评分</p>
                            <div>


                                <StyleInput
                                    id="outlined-start-adornment"
                                    sx={{ m: 1, width: '25ch' }}
                                    type="number"
                                    InputProps={{

                                        endAdornment: <InputAdornment position="end">分</InputAdornment>,


                                    }}
                                    value={value}
                                    inputProps={{ maxLength: 3 }}
                                    onChange={
                                        (e) => {
                                            setdemoTwo(false)
                                            var value = parseInt(e.target.value, 10);

                                            if (value > max) value = max;
                                            if (value < min) value = min;

                                            setValue(value);
                                            setpeopleObj(
                                                {
                                                    ...cpeopleObj,
                                                    score: e.target.value
                                                }
                                            );
                                        }
                                    }



                                ></StyleInput>
                                {demoTwo && <p style={{ color: "red" }}>不能为空必须为数字</p>}
                            </div>
                        </div>
                        <div>
                            <StyleButton onClick={handleSubDig}>
                                提交评价
                            </StyleButton>
                        </div>
                    </div>


                </DialogActions>

            </Dialog>

        </div >
    )



}

export default withStyles(styles)(EvaluationMessage) 