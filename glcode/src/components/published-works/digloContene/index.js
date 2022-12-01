/*
 * @Author: your name
 * @Date: 2022-03-11 09:17:36
 * @LastEditTime: 2022-08-02 14:29:42
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/components/published-works/digloContene/index.js
 */

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
// import ReactDOM from 'react-dom';
import styleb from './index.css'
import { connect } from 'react-redux';
import { compose } from "redux";
import {
    alpha,
    ThemeProvider,
    withStyles,
    makeStyles,
    createTheme,
    withTheme,
    styled
} from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@material-ui/core/Button';
import purple from '@material-ui/core/colors/purple';
import { useForm } from 'react-hook-form'
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import NativeSelect from '@mui/material/NativeSelect';
import { publishWork, findExpres } from "../../../utils/api"
import { useSubscribe, usePublish, useUnsubscribe } from '../../../Pusconnect/usePubSub'
import { StaticFun } from "../../../utils/data";
const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    onehome: {

        width: '100%',
        marginTop: '20px',

    },

    cssLabel: {
        '&$cssFocused': {
            color: purple[500],
        },
    },
    cssFocused: {},
    cssUnderline: {
        '&:after': {
            borderBottomColor: purple[500],
        },
    },
    bootstrapRoot: {
        padding: 0,
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    bootstrapInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        width: '100%',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
    bootstrapFormLabel: {
        fontSize: 18,
    },
});

//引入了外部的一个form库
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const Input = styled('input')({
    display: 'none',
});


const DigloContene = (prpos, ref) => {
    const { classes, data } = prpos;
    console.log(prpos, data, "xxdata")

    const [fileImg, setFileImg] = useState("")  //这是保存封面的
    const [filetoIg, setFile] = useState("")        // 这是保存封面file
    const [createname, setcreatename] = useState("")
    const newRef = useRef(null)

    const [helptext, setHelptext] = useState(false)

    const fileUpload = useRef("")
    const [age, setAge] = useState('');
    const [selectArr, setSelectArr] = useState([{
        id: 1,
        code: 50,
        name: "默认标签",

    }

    ])
    const handleChange = (event) => {


        let rulevalue = (event.target.value).filter(e => typeof (e) !== "object")
        if (rulevalue.length > 0) {
            setHelptext(false)
        }
        const {
            target: { value },
        } = event;
        setSelectArr(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };


    useEffect(() => {
        //调标签列表
        findExpres({ type: 50 }).then((res) => {

            if (res.data.code === "200") {
                console.log(res.data.data)
                setSelectArr(
                    res.data.data
                )
            }


        })
    }, [])




    const { register, handleSubmit, errors, form } = useForm()
    const handleLogin = e => {


        let params = new FormData()



        if (e.selectname === "[object Object]") {
            setHelptext(true)
            return false
        }

        let newSelectname = e.selectname.filter(e => typeof (e) !== "object")


        console.log(newSelectname, e.selectname)
        params.append("id", data.id)
        params.append("canEdit", 0)
        // params.append("description", e.doworkname)
        params.append("image", filetoIg)
        params.append("name", e.firstName)
        params.append("description", e.pokename)
        params.append("tagCodeList", newSelectname.toString())


        const publish = usePublish();
        publishWork(params).then((res) => {

            if (res.data.code === "200") {

                publish("openMessage", {
                    anchorOrigin: {
                        vertical: 'top', horizontal: 'center'
                    },
                    open: true,
                    message: "发布成功",

                })
                prpos.hanclose()

                //要在这里处理值

                publish("succellOk", {
                    code: res.data.code,
                    buttonFalse: "",


                })
            }
        })
    }



    useImperativeHandle(ref, () => (
        {

            onSubmit: checkoutbutton
        }
    ))

    const checkoutbutton = () => {
        // newRef.currenr.onSubmit()
        console.log(newRef, 'xx')
        // console.log(form)


    }



    useEffect(() => {

        // 给默认封面
        setFileImg(data.dataURI)
        setFile(data.newurlBlob)

    }, [])


    const handleFileUpload = () => {

        let file = fileUpload.current.files[0]

        StaticFun.toBase64(
            file
        ).then(res => {
            setFile(file)
            setFileImg(res)

        })


    }






    return (
        <div className={styleb.home}>
            <ul className={styleb.homeul}>
                <li>
                    {/* 这里应该是个canvas */}
                    <div className={styleb.setul} >
                        <img src={fileImg} alt="" />
                    </div>

                    <div className={styleb.uploadBox} >
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" multiple
                                type="file"
                                ref={fileUpload}
                                onChange={handleFileUpload}
                            />
                            <Button variant="contained" component="span">
                                上传本地的封面
                            </Button>
                        </label>
                    </div>

                </li>
                <li>
                    <form className={classes.root} onSubmit={handleSubmit(handleLogin)} ref={newRef}>
                        <TextField
                            required
                            label="作品名称"
                            id="bootstrap-input"
                            classes={{ root: classes.onehome }}
                            InputProps={{
                                disableUnderline: true,
                                classes: {
                                    root: classes.bootstrapRoot,
                                    input: classes.bootstrapInput,
                                },
                            }}
                            inputProps={{ maxLength: 20 }}
                            defaultValue={prpos.projectTitle}
                            InputLabelProps={{
                                shrink: true,
                                className: classes.bootstrapFormLabel,
                            }}
                            {
                            ...register("firstName")
                            }
                        />
                        <TextField
                            label="作品说明(长度限制200字以内)"
                            id="bootstrap-input"
                            classes={{ root: classes.onehome }}
                            InputProps={{
                                disableUnderline: true,
                                classes: {
                                    root: classes.bootstrapRoot,
                                    input: classes.bootstrapInput,
                                },
                            }}
                            multiline
                            maxRows={5}
                            rows={5}
                            inputProps={{ maxLength: 200 }}
                            InputLabelProps={{
                                shrink: true,
                                className: classes.bootstrapFormLabel,


                            }}
                            {...register('pokename')}
                        />
                        {/* <TextField
                            {...register('doworkname')}
                            label="操作说明"
                            id="bootstrap-input"
                            classes={{ root: classes.onehome }}
                            multiline
                            maxRows={4}
                            rows={3}
                            InputProps={{
                                disableUnderline: true,
                                classes: {
                                    root: classes.bootstrapRoot,
                                    input: classes.bootstrapInput,
                                },
                            }}
                            InputLabelProps={{
                                shrink: true,
                                className: classes.bootstrapFormLabel,
                            }}
                        /> */}

                        <FormControl fullWidth style={{ marginTop: "10px", minHeight: "30px" }}>
                            <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                作品标签*
                            </InputLabel>
                            {/* <Select

                                defaultValue={50}
                                inputProps={{
                                    name: 'age',
                                    id: 'uncontrolled-native',
                                }}
                                multiple
                                style={{ marginTop: "15px", minHeight: "38px", marginBottom: "15px" }}
                                value={selectArr}
                                renderValue={(selected) => selected.join(', ')}
                                onChange={handleChange}
                            >
                                {selectArr.map((e, v) => {
                                    return <option value={e.type}>{e.name}</option>

                                })}
                            </Select> */}


                            <Select

                                {...register('selectname')
                                }
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={selectArr}
                                defaultValue={50}
                                style={{ marginTop: "15px", minHeight: "38px", marginBottom: "15px" }}
                                onChange={handleChange}
                                input={<OutlinedInput label="Name" />}
                                MenuProps={MenuProps}
                            >
                                {selectArr.map((e) => (
                                    <MenuItem
                                        style={{ display: "inherit" }}
                                        key={e}
                                        value={e.code}

                                    >
                                        {e.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {helptext && <FormHelperText>标签必须选择 </FormHelperText>}
                        </FormControl>
                        <Button variant="contained" color="secondary" type="submit" >
                            确认发布
                        </Button>
                    </form>



                </li>
            </ul>
        </div >

    )



}






let DigloConteneCon = forwardRef(DigloContene)


export default (withStyles(styles)(DigloConteneCon))

