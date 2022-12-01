import PropTypes from 'prop-types';
import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import Box from '../box/box.jsx';
import DOMElementRenderer from '../../containers/dom-element-renderer.jsx';
import Loupe from '../loupe/loupe.jsx';
import MonitorList from '../../containers/monitor-list.jsx';
import TargetHighlight from '../../containers/target-highlight.jsx';
import GreenFlagOverlay from '../../containers/green-flag-overlay.jsx';
import Question from '../../containers/question.jsx';
import MicIndicator from '../mic-indicator/mic-indicator.jsx';
import { STAGE_DISPLAY_SIZES } from '../../lib/layout-constants.js';
import { getStageDimensions } from '../../lib/screen-utils.js';
import styles from './stage.css';
import html2canvas from 'html2canvas';
import { useSubscribe, usePublish, useUnsubscribe } from '../../Pusconnect/usePubSub'
import { saveUpload } from '../../../src/utils/api'
import { StaticFun } from '../../../src/utils/data'
import { connect } from "react-redux";
const printDocument = (domElement, timeKey, data, vm, fileOBj) => {
    const publish = usePublish();
    if (domElement != '') {


        // let newDOmELement = domElement.getContext("experimental-webgl", { preserveDrawingBuffer: true })
        //       console.log(newDOmELement)
        setTimeout(() => {
            vm.renderer.requestSnapshot(dataURI => {
                if (timeKey === 2) {
                    let token = window.sessionStorage.getItem("userAdmin")
                    let fileStream = StaticFun.base64toFile(dataURI, new Date().getTime() + ".jpg")
                    let newdata = vm.toJSON()
                    let datafile = new File([fileOBj.filetype], fileOBj.fileName, { type: fileOBj.filetype.type })
                    let params = new FormData()
                    let projectId = localStorage.getItem('projectId') ? localStorage.getItem('projectId') : ''
                    params.append("id", projectId)
                    params.append("image", fileStream)
                    params.append("file", datafile)
                    params.append("vm", newdata)
                    params.append("name", props.projectFilename)
                    console.log(params.get("token"))
                    saveUpload(params).then((res) => {
                        publish("newdataUrl", {
                            data,
                            dataURI,
                            newurlBlob: fileStream,
                            id: res.data.data
                        })
                    })

                }
            })
            //         html2canvas(domElement, {
            //         useCORS: true,
            //         backgroundColor: null,
            //         scale:0.5,
            //         preserveDrawingBuffer:true,
            //         windowWidth: domElement.scrollWidth,
            //         windowHeight: domElement.scrollHeight


            //     }).then(canvas => {


            //         let dataURL = canvas.toDataURL("image/png",)



            //         if (timeKey === 2) {


            //             let token=window.sessionStorage.getItem("userAdmin")


            //             let timer=new Date()

            //             let newurlBlob = StaticFun.UrltoFile(dataURL, timer.getMilliseconds() + ".jpg")



            //             let newImg = newurlBlob
            //             let newdata=vm.toJSON()


            //          console.log(fileOBj,"xxxxxxxccc")

            //             let datafile = new File([fileOBj.filetype], fileOBj. fileName, { type: fileOBj.filetype.type })




            //             let params = new FormData()

            //             params.append("id",'')
            //             params.append("image",newImg)
            //             params.append("file", datafile)
            //             params.append("vm", newdata)
            //             console.log(params.get("token"))
            //             saveUpload(params).then((res) => {


            //     publish("newdataUrl", {
            //          data,
            //         dataURL,
            //         newurlBlob:newurlBlob,
            //          id:res.data.data
            //             })        
            //             })

            //         }



            //   });

        }, 1500)
    }


};






const StageComponent = props => {
    const {
        canvas,
        dragRef,
        isColorPicking,
        isFullScreen,
        isStarted,
        colorInfo,
        micIndicator,
        question,
        stageSize,
        useEditorDragStyle,
        onDeactivateColorPicker,
        onDoubleClick,
        onQuestionAnswered,
        vm,
        ...boxProps

    } = props;



    const [canvasImg, setcanvas] = useState("")
    const [timeKey, settimeKey] = useState(0)
    const [fileOBj, setFileOBj] = useState({})
    const canvasRef = useRef()
    const NewRef = useRef()



    const saveImg = useSubscribe("saveImg", (msg, data) => {


        if (msg === "saveImg") {

            Promise.resolve().then(res => {

                return oneDemo(canvasRef.current, 1, data, vm)


            }).then(() => {

                return oneDemo(canvasRef.current, 2, data, vm)

            })
        }
    })


    const oneDemo = (e, v, data, vm) => {


        return new Promise((resolve, reject) => {
            setTimeout(() => {
                printDocument(e, v, data, vm, NewRef.current)
                settimeKey(v)
                resolve()
            }, 500)

        })

    }

    //  下载返回的值
    const resultData = useSubscribe("resultData", (msg, data) => {
        if (msg === "resultData") {
            setFileOBj(data)
            NewRef.current = data
        }
    })

    const unsubscribe = useUnsubscribe();
    useEffect(() => () => {
        unsubscribe(resultData);

    }, [resultData]);

    useEffect(() => () => {
        unsubscribe(saveImg);

    }, [saveImg]);



    const stageDimensions = getStageDimensions(stageSize, isFullScreen);
    // if(!isFullScreen){
    //     stageDimensions.width = 480
    //     stageDimensions.height = 360
    // }else{
    //     stageDimensions.width = innerHeight-58
    //     stageDimensions.height = innerHeight-58
    // }
    return (
        <React.Fragment>
            <Box
                className={classNames(
                    styles.stageWrapper,
                    { [styles.withColorPicker]: !isFullScreen && isColorPicking })}
                onDoubleClick={onDoubleClick}
            >
                <Box

                    className={classNames(
                        styles.stage,
                        { [styles.fullScreen]: isFullScreen }
                    )}
                    style={{
                        height: stageDimensions.height,
                        width: stageDimensions.width
                    }}
                >

                    <div ref={canvasRef}>
                        <DOMElementRenderer
                            domElement={canvas}
                            style={{
                                height: stageDimensions.height,
                                width: stageDimensions.width
                            }}
                            {...boxProps}
                        />
                    </div>
                    <Box className={styles.monitorWrapper}>
                        <MonitorList
                            draggable={useEditorDragStyle}
                            stageSize={stageDimensions}
                        />
                    </Box>
                    <Box className={styles.frameWrapper}>
                        <TargetHighlight
                            className={styles.frame}
                            stageHeight={stageDimensions.height}
                            stageWidth={stageDimensions.width}
                        />
                    </Box>
                    {isColorPicking && colorInfo ? (
                        <Loupe colorInfo={colorInfo} />
                    ) : null}
                </Box>

                {/* `stageOverlays` is for items that should *not* have their overflow contained within the stage */}
                <Box
                    className={classNames(
                        styles.stageOverlays,
                        { [styles.fullScreen]: isFullScreen }
                    )}
                >
                    <div
                        className={styles.stageBottomWrapper}
                        style={{
                            width: stageDimensions.width,
                            height: stageDimensions.height
                        }}
                    >
                        {micIndicator ? (
                            <MicIndicator
                                className={styles.micIndicator}
                                stageSize={stageDimensions}
                            />
                        ) : null}
                        {question === null ? null : (
                            <div
                                className={styles.questionWrapper}
                                style={{ width: stageDimensions.width }}
                            >
                                <Question
                                    question={question}
                                    onQuestionAnswered={onQuestionAnswered}
                                />
                            </div>
                        )}
                    </div>
                    <canvas
                        className={styles.draggingSprite}
                        height={0}
                        ref={dragRef}
                        width={0}
                    />
                </Box>
                {isStarted ? null : (
                    <GreenFlagOverlay
                        className={styles.greenFlagOverlay}
                        wrapperClass={styles.greenFlagOverlayWrapper}
                    />
                )}
            </Box>

            {isColorPicking ? (
                <Box
                    className={styles.colorPickerBackground}
                    onClick={onDeactivateColorPicker}
                />
            ) : null}
        </React.Fragment>
    );
};
StageComponent.defaultProps = {
    dragRef: () => { }
};

const mapStateToProps = state => ({
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    projectFilename: state.scratchGui.projectTitle
});
export default connect(
    mapStateToProps,
)(StageComponent)



