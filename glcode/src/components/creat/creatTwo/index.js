/*
 * @Author: your name
 * @Date: 2022-03-15 15:02:41
 * @LastEditTime: 2022-07-26 10:03:01
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/components/creat/creatTwo/index.js
 */
import React, { useState, useEffect, useRef } from 'react';
import styleB from "./index.css"
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import { StaticFun } from "../../../utils/data"
import { useSubscribe, usePublish, useUnsubscribe } from '../../../Pusconnect/usePubSub'
import PropTypes from 'prop-types';
import axios from "axios"
import {
    LoadingStates,
    getIsCreatingNew,
    getIsFetchingWithId,
    getIsLoading,
    getIsShowingProject,
    onFetchedProjectData,
    projectError,
    setProjectId,
    manualUpdateProject
} from '../../../reducers/project-state';
const demoList = [
    {
        key: 1,
        name: "全部"
    }, {
        key: 2,
        name: "已发布"
    }, {
        key: 0,
        name: "未发布"
    },

]


const CreateTwo = (props) => {

    useEffect(() => {



        props.onPageInit()
    }, []);
    const [home, setHome] = useState(1)


    const srctop = useRef(null)

    // 链接地址可能是动态的
    const [urlSrc, seturlSrc] = useState("http://182.61.146.154:20210")


    useEffect(() => {
        let fileUrlPrefix = window.localStorage.getItem("fileUrlPrefix")

        seturlSrc(fileUrlPrefix)
    }, [])




    const OneDemo = () => {


        return new Promise((resolve, reject) => {

            setTimeout(() => {

                props.onStartSelectingFileUpload()
                resolve()
            }, 1000)
        })

    }

    const twoDEMo = () => {
        return new Promise((resolve) => {

            setTimeout(() => {

                props.hanclonse()
                resolve()
            }, 2000)
        })

    }
    const handleUpdate = () => {

        Promise.resolve().then(res => {
            return OneDemo()
        }).then(() => {
            return twoDEMo()

        })
    }


    // 分页

    const handlePageChang = (e, value) => {


        props.setPage(value)
    }

    const setHandle = (e) => {
        setHome(e)
        props.setsetHandle(e)
    }

    // 打开sb3文件
    const handleOpenSB3 = (e) => {
        const { vm } = props.vmProps
        let fileUrl = `${urlSrc}${e.vmFileURL}`
        axios(fileUrl, {
            method: 'get',
            headers: {
                'content-type': 'application/json'
            }
        }).then((res) => {
            let filedata = JSON.parse(res.data.data)
            vm.loadProject(filedata)

            // 替换文件id
            sessionStorage.setItem('worksid', e.id)
            props.hanclonse()
        })
    }
    const handleFetchStore = () => {
        console.log('fetchProject', localStorage.getItem('projectId'))

    }


    console.log(props.listdata.records)
    return (

        <div className={styleB.home} ref={srctop}
        >
            <ul className={styleB.homeUl} >
                {/* <div className={styleB.upload} onClick={handleUpdate}>
                    导入本地作品
                </div> */}
                {demoList.map((e, v) => {
                    return <li key={v} className={home === e.key ? styleB.chekckout : ""}
                        onClick={() => {
                            setHandle(e.key)
                        }}
                    >
                        {e.name}
                    </li>
                })}
            </ul>
            {/* <div onClick={handleFetchStore}>fetchStore</div> */}
            <ul className={styleB.childerHome}
            >

                {props?.listdata.records && Array.isArray(props.listdata.records) && props.listdata.records.map((e, i) => {
                    return <div>
                        <li key={i} className={styleB.childerHomeLi} onClick={() => handleOpenSB3(e)}>
                            <img src={`${urlSrc}${e.imageURL}`} alt="" />


                        </li>
                        <div className={styleB.timerdata}>{e.name ? e.name : "暂无名称"}</div>
                        <div className={styleB.peopledata}>{e.createTime}</div>
                    </div>
                })


                }

            </ul>

            {/* 底部 */}
            {props?.listdata.total >= 9 &&
                <Pagination count={Math.ceil((props?.listdata.total) / 9)} variant="outlined" shape="rounded"
                    onChange={handlePageChang}
                />

            }
        </div>
    )

}
CreateTwo.propTypes = {
    setProjectId: PropTypes.func,
    onClickSave: PropTypes.func,
};
const mapStateToProps = state => ({
    loadingState: state.scratchGui.projectState.loadingState,
});
const mapDispatchToProps = dispatch => ({
    setProjectId: projectId => {
        dispatch(setProjectId(projectId));
    },
    onClickSave: () => {
        console.log('onClickSave')
        dispatch(manualUpdateProject())
    }
});
export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateTwo));
// export default CreateTwo