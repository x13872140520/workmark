/*
 * @Author: your name
 * @Date: 2022-03-09 09:20:01
 * @LastEditTime: 2022-03-10 11:27:43
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/components/user-login/resetPage/index.js
 */
import React, { useState, useEffect } from 'react';
import styletwo from "./index.css"
import { withStyles } from '@material-ui/core/styles';
import ButtonM from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
const styles = theme => ({

    textField: {

        marginTop: "30px",
        fontSize: "18px",


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

});
const ResetPage = (props) => {

    const [values, setValues] = React.useState({
        amount: '',
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
    });


    const [opname, setuopname] = useState(
        ""
    )
    const [oppassword, setuoppassword] = useState(
        ""
    )


    const { classes } = props
    const [formValue, SetformValue] = useState({
        key: 2, name: "手机", passwordName: "验证码", helperName: "请输入正确的手机格式", type: "tel", pasreg: "/^\d{1,9}$/", namereg: "/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/",
        helperPassword: "密码格式错误", errName: false, errpassword: false
    })

    const [newcoun, setnewcount] = useState("验证码")

    const handlesetClick = () => {

    }
    const handleNameChange = () => {

    }
    const handleChange = () => {

    }


    return (
        <div className={styletwo.HomeRe}>
            <h2>重置密码</h2>
            <p>验证身份后,可以重置密码</p>

            <div>
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 20, width: '40ch' },
                    }}

                    noValidate
                    autoComplete="off"
                >

                    <TextField label={formValue.name} variant="outlined" id="fullWidth"
                        error={formValue.errName}
                        onChange={handleNameChange('name')}
                        helperText={formValue.errName ? formValue.helperName : formValue.errpassword}
                        className={classes.textField}
                        color="secondary"
                        value={opname}
                        type={formValue.type}
                    />





                    <FormControl className={classes.textField}
                        id="fullWidth"
                        variant="outlined" color="secondary">
                        <InputLabel htmlFor="outlined-adornment-password">{formValue.passwordName}</InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={values.showPassword ? 'text' : 'password'}
                            value={oppassword}
                            onChange={handleChange('password')}
                            endAdornment={
                                <InputAdornment position="end">
                                    {formValue.key === 1 ?
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
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
                    </FormControl>


                </Box>

                <ButtonM variant="contained" disabled className={classes.ButtonO}>下一步</ButtonM>
            </div>
        </div>
    )
}
export default withStyles(styles)(ResetPage)