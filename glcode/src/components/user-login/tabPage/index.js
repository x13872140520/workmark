/*
 * @Author: your name
 * @Date: 2022-03-09 09:20:13
 * @LastEditTime: 2022-10-28 16:41:58
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/components/user-login/tabPage/index.js
 */

import React, { useState, useEffect, useCallback, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import { withStyles, styled } from '@material-ui/core/styles';
import stylesOne from './index.css';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import ButtonM from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { style } from "@mui/system";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FormHelperText from '@material-ui/core/FormHelperText';
import { StaticFun } from '../../../utils/data.js'
import { setPassword, sendVerEmail, sendLoginEmail, sendLogintoken } from "../../../utils/api"
import { useSubscribe, usePublish, useUnsubscribe } from '../../../Pusconnect/usePubSub'
import { defineMessages, injectIntl, intlShape } from 'react-intl';
const messages = defineMessages({
    signInByPwd: {
        id: 'gui.accountMenu.signInByPwd',
        defaultMessage: 'Login',
        description: 'Login by username or mail'
    },
    signInByMes: {
        id: 'gui.accountMenu.signInByMes',
        defaultMessage: 'Phone Login',
        description: 'Login by phone'
    },
    usernameByPwd: {
        id: 'gui.accountMenu.usernameByPwd',
        defaultMessage: 'Phone/Mail/Username',
        description: 'Please use Phone/Mail/Username'
    },
    usernameByMes: {
        id: 'gui.accountMenu.usernameByMes',
        defaultMessage: 'Please type your phone number',
        description: 'Please type your phone number'
    },
    passwordByPwd: {
        id: 'gui.accountMenu.passwordByPwd',
        defaultMessage: 'Password',
        description: 'Please type your password'
    },
    passwordByMes: {
        id: 'gui.accountMenu.passwordByMes',
        defaultMessage: 'Verification Code',
        description: 'Please type your Verification Code'
    },
    signIn: {
        id: 'gui.menuBar.signIn',
        defaultMessage: 'Sign In',
        description: 'Sign In'
    },
    phoneError: {
        id: 'gui.accountMenuTip.phoneError',
        defaultMessage: 'incorrect phone format',
        description: 'incorrect phone format'
    },
    vcError: {
        id: 'gui.accountMenuTip.vcError',
        defaultMessage: 'verification cannot be empty and miss specification',
        description: 'verification cannot be empty and miss specification'
    },
    sendOk: {
        id: 'gui.accountMenuTip.sendOk',
        defaultMessage: 'send successfully',
        description: 'send successfully'
    },
    sendFail: {
        id: 'gui.accountMenuTip.sendFail',
        defaultMessage: 'send fail',
        description: 'send fail'
    },
    LoginOK: {
        id: 'gui.accountMenuTip.LoginOK',
        defaultMessage: 'login successfully',
        description: 'login successfully'
    },
    accountMiss: {
        id: 'gui.accountMenuTip.accountMiss',
        defaultMessage: 'account cannot be empty',
        description: 'account cannot be empty'
    },
    passwordMiss: {
        id: 'gui.accountMenuTip.passwordMiss',
        defaultMessage: 'password cannot be empty',
        description: 'password cannot be empty'
    },
    phoneMiss: {
        id: 'gui.accountMenuTip.phoneMiss',
        defaultMessage: 'phonenumber cannot be empty',
        description: 'phonenumber cannot be empty'
    },
});

const ButtonMD = styled(ButtonM)({

    backgroundColor: "#F65335 !important",
    borderRadius: '33px',
    color: "#ffffff"
})



const styles = theme => ({
    textField: {
        marginTop: "30px",
        fontSize: "12px",
        width: " calc(100% - 20px) !important",

    },
    ButtonO: {
        width: "100%",
        marginTop: "30px",
    },
    margin: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    inputA: {
        height: "40px",
        borderRadius: '33px'
    },
    labelA: {
        lineHeight: "3px"
    }
});

const TabPage = (props) => {
    const { classes, intl } = props
    const publish = usePublish();
    const textValue = [
        {
            key: 1, name: intl.formatMessage(messages.usernameByMes), passwordName: intl.formatMessage(messages.passwordByPwd), type: "text",
        }, {
            key: 2, name: intl.formatMessage(messages.usernameByMes), passwordName: intl.formatMessage(messages.passwordByMes), type: "tel"
        }
    ]
    const [formValue, SetformValue] = useState({
        key: 1, name: intl.formatMessage(messages.usernameByMes), passwordName: intl.formatMessage(messages.passwordByPwd), type: "text",
    })
    const [newcoun, setnewcount] = useState(intl.formatMessage(messages.passwordByMes))
    const [loadingOpen, setloadingOpen] = useState(false)
    const [values, setValues] = useState({
        showPassword: false,
    });

    useLayoutEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [formValue])

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(formValue.key)
        }
    }

    const checkoutfind = (e) => {

        let Data = textValue.filter(v => v.key === e)
        let newdata = Data[0]
        SetformValue(newdata)
        setuseName("")
        setusepassword("")

        if (e === 1) {
            setValues({ ...values, showPassword: false });
        } else {
            setValues({ ...values, showPassword: true });
        }

        // 清楚状态
        setHelp({
            name: "",
            password: "",
            nameKey: false,
            passwordKey: false,
        })

    }

    const [useName, setuseName] = useState(
        ""
    )
    const [usepassword, setusepassword] = useState(
        ""
    )

    const newusepassword = useRef(usepassword)
    const newuseName = useRef(useName)
    useEffect(() => {
        newusepassword.current = usepassword,
            newuseName.current = useName
    })
    const EmaioAdd = (ms) => {
        setnewcount(60)
        let count = 60
        let timer = setInterval(() => {
            if (count > 1) {
                count -= 1
                console.log(count)
                setnewcount(count)
            } else {
                clearInterval(timer)
                setnewcount("验证码")
            }
        }, ms)

    }
    //验证码
    const handlesetClick = () => {
        if (!phoneRe(useName)) {
            setHelp({
                ...helpText,
                name: intl.formatMessage(messages.phoneError),
                nameKey: true,

            })
            return false
        }
        // 弹框
        const sendMessag = (title) => {
            publish("openMessage", {
                anchorOrigin: {
                    vertical: 'top', horizontal: 'center'
                },
                open: true,
                message: title,

            })
        }

        if (newcoun === intl.formatMessage(messages.passwordByMes)) {
            sendVerEmail({
                phone: useName,
                type: 3
            }).then(res => {
                if (res.data.code === "200") {
                    EmaioAdd(1000)
                    sendMessag(intl.formatMessage(messages.sendOk))
                } else {
                    sendMessag(intl.formatMessage(messages.sendFail))
                }
            })
        }
    }
    //全部都是关闭
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });

    }
    const handleMouseDownPassword = (e) => {
        console.log("end")
        e.preventDefault();
    }
    //  输入框
    const handleChange = (prop) => (event) => {

        console.log(event.target.value)
        setusepassword(event.target.value)
        if (event.target.value.length >= 1) {
            setHelp({
                ...helpText,
                passwordKey: false,
                password: ""
            })

        }

    };
    const handleNameChange = (prop) => (event) => {
        setuseName(event.target.value)
        if (event.target.value.length >= 1) {
            setHelp({
                ...helpText,
                nameKey: false,
                name: ""
            })
        }

    }
    //   键盘事件

    // React.useEffect(() => {
    //     document.addEventListener('keydown', handleKeyDown)


    //     return () => {
    //         document.removeEventListener('keydown', handleKeyDown)

    //     }
    // })


    // const handleKeyDown = React.useCallback(event => {


    // }, [])
    const [helpText, setHelp] = useState({
        name: "",
        password: "",
        nameKey: false,
        passwordKey: false,

    })

    // 验证码验证
    const regularizatiReg = (data) => {
        if (!(/^[0-9]{6}$/.test(data))) {
            return false;
        }
        return true;
    }

    // 手机号码验证  
    const phoneRe = (data) => {
        if (!(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(data))) {
            return false;
        }
        return true;
    }
    // 提交

    const resData = (res) => {
        if (res.data.code === "200") {
            sendLogintoken({
                token: res.data.data
            }).then((res) => {
                if (res.data.code === "200") {
                    let { nickName } = res.data.data
                    window.sessionStorage.setItem("userName", nickName)
                    props.handlesetdig()
                    publish("openMessage", {
                        anchorOrigin: {
                            vertical: 'top', horizontal: 'center'
                        },
                        open: true,
                        message: intl.formatMessage(messages.LoginOK),
                    })
                    publish("loginSuccess", {
                        nickName
                    })
                    props.setName(nickName)
                } else {
                    publish("openMessage", {
                        anchorOrigin: {
                            vertical: 'top', horizontal: 'center'
                        },
                        open: true,
                        message: res.data.msg,
                    })
                }
            })
            // // 关闭
        } else {
            publish("openMessage", {
                anchorOrigin: {
                    vertical: 'top', horizontal: 'center'
                },
                open: true,
                message: res.data.msg,
            })
        }
    }

    const handleSubmit = (e) => {
        console.log('handleSubmit', e)
        // 密码登录
        console.log(newusepassword, newuseName)
        if (e === 1) {
            if (newuseName.current === "") {
                setHelp({
                    ...helpText,
                    nameKey: true,
                    name: intl.formatMessage(messages.accountMiss)
                })
            }
            if (newusepassword.current === "") {
                setHelp({
                    ...helpText,
                    passwordKey: true,
                    password: intl.formatMessage(messages.passwordMiss)
                })
            }
            if (newuseName.current === "" || newusepassword.current === "") return false;
            let password = StaticFun.Md5(newusepassword.current)
            setloadingOpen(true)
            setTimeout(() => {
                setPassword({
                    password,
                    phone: newuseName.current
                }).then((res) => {

                    setloadingOpen(false)
                    // 存token
                    window.sessionStorage.setItem("userAdmin", res.data.data)
                    resData(res)
                })
            }, 1000)
            // 短信登录
        } else if (e === 2) {
            if (newuseName.current === "") {
                setHelp({
                    ...helpText,
                    nameKey: true,
                    name: intl.formatMessage(messages.phoneMiss)
                })
                return false;
            }

            if (newusepassword.current === "" || !regularizatiReg(newusepassword.current)) {
                setHelp({
                    ...helpText,
                    passwordKey: true,
                })
                return false;

            }
            let password = StaticFun.Md5(newusepassword.current)
            setloadingOpen(true)
            setTimeout(() => {
                sendLoginEmail({
                    verifyCode: password,
                    phone: newuseName.current,
                }).then((res) => {
                    setloadingOpen(false)
                    // 存token
                    window.sessionStorage.setItem("userAdmin", res.data.data)
                    resData(res)

                })
            }, 1000)

        }

    }


    return (
        <div className={stylesOne.tabHome}>
            <div className={stylesOne.tabUl}>
                <div className={formValue.key === 1 ? stylesOne.colorser : ""} onClick={() => checkoutfind(1)}>
                    {intl.formatMessage(messages.signInByPwd)}

                </div>
                <div className={formValue.key === 2 ? stylesOne.colorser : ""}
                    onClick={() => checkoutfind(2)}

                >
                    {intl.formatMessage(messages.signInByMes)}

                </div>
            </div>
            <div>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 20, width: '40ch' },
                    }}

                    noValidate
                    autoComplete="off"
                >
                    <TextField

                        label={formValue.name} variant="outlined" id="fullWidth"
                        error={helpText.nameKey}
                        onChange={handleNameChange('name')}
                        className={classes.textField}
                        color="secondary"
                        value={useName}
                        type={formValue.type}
                        helperText={helpText.name}
                        InputProps={{
                            className: classes.inputA

                        }}
                        InputLabelProps={{
                            className: classes.labelA
                        }}
                    />



                    {/* <TextField id="outlined-basic" label={formValue.passwordName} variant="outlined" id="fullWidth"
                        error={formValue.errpassword}
                        helperText={formValue.errpassword ? formValue.helperPassword : formValue.errpassword}
                        className={classes.textField}
                        color="secondary"

                    /> */}

                    <FormControl className={classes.textField}
                        error={helpText.passwordKey}
                        id="fullWidth"
                        variant="outlined" color="secondary">
                        <InputLabel
                            className={classes.labelA}
                            htmlFor="outlined-adornment-password">{formValue.passwordName}</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            className={classes.inputA}
                            value={usepassword}
                            onChange={handleChange('password')}
                            endAdornment={
                                <InputAdornment position="end">
                                    {formValue.key === 1 ?
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}

                                            edge="end"
                                        >
                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton> : <div

                                            onClick={handlesetClick}
                                        >
                                            {newcoun}
                                        </div>

                                    }

                                </InputAdornment>
                            }
                            labelWidth={70}
                        />

                        <FormHelperText id="component-error-text">{helpText.passwordKey ? formValue.key === 1 ? "密码不能为空" : "验证码不能为空且符合验证码规范" : ""}</FormHelperText>
                    </FormControl>


                </Box>
                <Backdrop className={classes.backdrop} open={loadingOpen} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <ButtonMD variant="contained" className={classes.ButtonO} onClick={() => handleSubmit(formValue.key)}

                >{intl.formatMessage(messages.signIn)}</ButtonMD>
            </div>

        </div>
    )


}
TabPage.propTypes = {
    intl: intlShape.isRequired,
};

export default withStyles(styles)(injectIntl(TabPage)) 