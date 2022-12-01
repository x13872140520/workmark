/*
 * @Author: your name
 * @Date: 2022-03-16 11:56:31
 * @LastEditTime: 2022-10-26 14:14:25
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE,
 * @FilePath: /gajumakr/glcode/src/components/creat/creatOne/index.js
 */
import React, { useState, useEffect, useRef } from 'react';
import styleA from "./index.css"
import PropTypes from 'prop-types';
import { projectTitleInitialState } from '../../../reducers/project-title';
import { connect } from 'react-redux';
import creatImg from "../creatPulib/creatImg.svg"
import tjson from "../../../lib/default-template/template-controller/template-controller.json"
import tgif from "../../../lib/default-template/template-controller/template-controller.gif"
import tthumbnail from "../../../lib/default-template/template-controller/template-controller.png"
import trjson from "../../../lib/default-template/template-repeat/template-repeat.json"
import trgif from "../../../lib/default-template/template-repeat/template-repeat.gif"
import trthumbnail from "../../../lib/default-template/template-repeat/template-repeat.png"
import { ConfirmationDialogRaw } from "../../dialog-confirm/dialog-confirm.jsx"
import { saveUpload } from '../../../utils/api'
import { StaticFun } from '../../../utils/data'
import CircularProgress from '@mui/material/CircularProgress';

// 这个应该是修改标题的

import { setProjectTitle } from '../../../reducers/project-title';
const blankProjectData = {
    targets: [
        {
            isStage: true,
            name: 'Stage',
            variables: {
                '`jEk@4|i[#Fk?(8x)AV.-my variable': [
                    '空白背景',
                    0
                ]
            },
            lists: {},
            broadcasts: {},
            blocks: {},
            currentCostume: 0,
            costumes: [],
            sounds: [],
            volume: 100
        },
    ],
    meta: {
        semver: '3.0.0',
        vm: '0.1.0',
        agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36' // eslint-disable-line max-len
    }
}
const dataList = [
    {
        childer: [
            {
                name: "demo1",
                key: 1,
                preview_url: tgif,
                thumbnail_url: tthumbnail,
                template_json: tjson,

            }, {
                name: "demo5",
                key: 2,
                preview_url: trgif,
                thumbnail_url: trthumbnail,
                template_json: trjson,

            }

        ],
        title: "全部",
        name: '',
        key: 1

    }, {

        childer: [

            {
                name: "demo2",
                key: 1,
                preview_url: tgif,
                thumbnail_url: tthumbnail,
                template_json: tjson,

            }
        ],
        title: "游戏类模板",
        name: '',
        key: 2

    },
    {

        childer: [
            {
                name: "demo3",
                key: 1,
                preview_url: tgif,
                thumbnail_url: tthumbnail,
                template_json: tjson,

            }

        ],
        title: "工具类模版",
        name: '',
        key: 3

    },
    {

        childer: [
            {
                name: "demo5",
                key: 2,
                preview_url: trgif,
                thumbnail_url: trthumbnail,
                template_json: trjson,

            }

        ],
        title: "进击模版",
        name: '',
        key: 4

    }

]

const CreatOne = (props) => {

    console.log(props.projectFilename, "authorUsername")
    const [checkout, setcheckout] = useState(1)
    const [fullOpen, setFullOpen] = useState(false)
    const [blankOpen, setBlankOpen] = useState(false)
    const [value, setValue] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const textInput = useRef(null);
    const handleSave = () => {

        return new Promise(function (resolve, reject) {
            props.saveProjectSb3().then(content => {
                if (content) {
                    props.vmProps.vm.renderer.requestSnapshot(dataURI => {
                        let params = {
                            fileName: props.projectFilename,
                            filetype: content,
                        }
                        let param = new FormData()
                        let fileStream = StaticFun.base64toFile(dataURI, new Date().getTime() + ".jpg")
                        let datafile = new File([params.filetype], params.fileName, { type: params.filetype.type })
                        let projectId = sessionStorage.getItem('worksid') ? localStorage.getItem('worksid') : ''
                        param.append("id", projectId)
                        param.append("image", fileStream)
                        param.append("file", datafile)
                        param.append("name", props.projectFilename)
                        param.append("vm", props.vmProps.vm.toJSON())
                        saveUpload(param).then((res) => {
                            if (res.data.code == 200) {
                                //close loading & close confirm 
                                setIsLoading(false)
                                props.onClose()

                                props.vmProps.vm.loadProject(value)
                                const publish = usePublish();
                                publish("newdataUrl", {
                                    content,
                                    dataURI,
                                    newurlBlob: fileStream,
                                    id: res.data.data
                                })
                                resolve()


                                sessionStorage.removeItem('worksid');
                            } else {
                                //close loading
                                alert(res.data.msg)
                                setIsLoading(false)
                            }

                        })
                    });

                } else {
                    reject()
                }
            })
        })
    }
    const handleClickset = () => {
        if (props.vmProps.vm.runtime.targets.length > 1) {
            setBlankOpen(true);
        } else {
            props.onClose()
        }

    }
    const handleLoadJson = (json) => {
        setValue(json)
        //判断当前编辑器是否存在target，不存在直接打开，存在则弹出提示框
        if (props.vmProps.vm.runtime.targets.length > 1) {
            setFullOpen(true);
        } else {
            props.vmProps.vm.loadProject(json)
            props.onClose()
        }


    }
    const handleOnConfirm = () => {
        setIsLoading(true)
        setFullOpen(false)
        setBlankOpen(false)
        handleSave()


    }
    const handleCancel = () => {
        setFullOpen(false)
        setBlankOpen(false)
    }
    const handleTemplateClose = (newValue) => {
        props.onClose()
        setFullOpen(false)
        setBlankOpen(false)
        if (newValue) {
            setValue(newValue);
        }
        console.log(value, 'xxxx:')
        props.vmProps.vm.loadProject(value)
    }
    const handleBlankClose = () => {
        props.onClose()
        setFullOpen(false)
        setBlankOpen(false)
        console.log('whap')


        props.vmProps.vm.loadProject(blankProjectData)
        if (localStorage.getItem('projectId')) {
            localStorage.removeItem('projectId')
        }
        console.log(JSON.parse(JSON.stringify(blankProjectData)))
    }
    return (
        <div className={styleA.homeImg}>
            {isLoading ? <div className={styleA.loadingNotap}><CircularProgress id="progress-notap" ref={textInput} classes={styleA.progressColor} /></div> : null}
            <ConfirmationDialogRaw
                keepMounted
                open={fullOpen}
                onConfirm={handleOnConfirm}
                onCancel={handleCancel}
                onClose={handleTemplateClose}
                value={value}
            />
            <ConfirmationDialogRaw
                title="是否保存当前作品？"
                content="即将新建空白模板，是否保存当前作品？"
                keepMounted
                open={blankOpen}
                onConfirm={handleOnConfirm}
                onCancel={handleCancel}
                onClose={handleBlankClose}
                value={value}
            />
            <ul className={styleA.homeul}>
                {
                    dataList.map((e, v) => {
                        return (
                            <li key={v} className={checkout === e.key ? styleA.checolor : ""}
                                onClick={() => {
                                    setcheckout(e.key)
                                }}
                            >
                                {e.title}
                            </li>
                        )
                    })

                }
            </ul>
            <ul className={styleA.twoul} >
                {/* <li className={styleA.firstOne} onClick={handleClickset}>
                    <img src={creatImg} alt="" />
                </li> */}
                {
                    dataList.map((value, key) => {
                        return value.key === checkout && value.childer.map((e, v) => {
                            //onClick={handleLoadJson(e.template_json)}

                            return (

                                <li key={v} onClick={() => { handleLoadJson(e.template_json) }}>
                                    <img className={styleA.temPic} src={e.thumbnail_url} />
                                    <img className={styleA.temGifPic} src={e.preview_url} />
                                </li>
                            )
                        })

                    })

                }
            </ul>


        </div>
    )

}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.sb3`;
};
CreatOne.propTypes = {
    projectFilename: PropTypes.string,
    saveProjectSb3: PropTypes.func
};
const mapStateToProps = state => ({
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});
export default connect(
    mapStateToProps,
    () => ({})
)(CreatOne);

//export default CreatOne