import classNames from "classnames";
import { connect } from "react-redux";
import { compose } from "redux";
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
    intlShape,
} from "react-intl";
import PropTypes from "prop-types";
import bindAll from "lodash.bindall";
import bowser from "bowser";
import React, { forwardRef, useImperativeHandle } from "react";
import ButtonM from "@material-ui/core/Button";
import { projectTitleInitialState } from "../../reducers/project-title";
import VM from "scratch-vm";

import Box from "../box/box.jsx";
import Button from "../button/button.jsx";
import CommunityButton from "./community-button.jsx";
import ShareButton from "./share-button.jsx";
import CustomButton from "./custom-button.jsx";
import { ComingSoonTooltip } from "../coming-soon/coming-soon.jsx";
import Divider from "../divider/divider.jsx";
import LanguageSelector from "../../containers/language-selector.jsx";
import LanguageSelectors from "../../containers/language-selectors.jsx";
import SaveStatus from "./save-status.jsx";
import SBFileUploader from "../../containers/sb-file-uploader.jsx";
import ProjectWatcher from "../../containers/project-watcher.jsx";
import MenuBarMenu from "./menu-bar-menu.jsx";
import { MenuItem, MenuSection } from "../menu/menu.jsx";
import ProjectTitleInput from "./project-title-input.jsx";
import AuthorInfo from "./author-info.jsx";
import AccountNav from "../../containers/account-nav.jsx";
import LoginDropdown from "./login-dropdown.jsx";
import SB3Downloader from "../../containers/sb3-downloader.jsx";
import DeletionRestorer from "../../containers/deletion-restorer.jsx";
import TurboMode from "../../containers/turbo-mode.jsx";
import MenuBarHOC from "../../containers/menu-bar-hoc.jsx";
import Tooltip from "@mui/material/Tooltip";

import { openTipsLibrary } from "../../reducers/modals";
import { closeCards, viewCards } from "../../reducers/cards";
import { setPlayer } from "../../reducers/mode";
import MenuListComposition from "../../components/menu-a/menu-a.jsx";
import storage from "../../lib/storage";
import saveProjectToServer from "../../lib/save-project-to-server";
import { setProjectUnchanged } from "../../reducers/project-changed";
import {
    useSubscribe,
    usePublish,
    useUnsubscribe,
} from "../../Pusconnect/usePubSub";
import {
    saveUpload,
    sendLogintoken,
    childrenAdd,
    TaskCommitSend,
    getUrlHead,
    findClassTasekId,
    findClassId,
    findontentServer,
} from "../../utils/api";

// 头部保存和发布
import Menutop from "../menu-topbutton/menutop.jsx";
import tjson from "../../lib/default-template/template-controller/template-controller.json";
import {
    autoUpdateProject,
    getIsUpdating,
    getIsShowingProject,
    manualUpdateProject,
    requestNewProject,
    remixProject,
    saveProjectAsCopy,
} from "../../reducers/project-state";
import {
    openAboutMenu,
    closeAboutMenu,
    aboutMenuOpen,
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    openSettingMenu,
    closeSettingMenu,
    fileMenuOpen,
    settingMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
    openLoginMenu,
    closeLoginMenu,
    loginMenuOpen,
} from "../../reducers/menus";

import collectMetadata from "../../lib/collect-metadata";

import styles from "./menu-bar.css";

// import helpIcon from '../../lib/assets/icon--tutorials.svg';
import helpIcon from "./search-weh.svg";

import mystuffIcon from "./icon--mystuff.png";
import profileIcon from "./icon--profile.png";
import remixIcon from "./icon--remix.svg";
import dropdownCaret from "./dropdown-caret.svg";

//语言的svg
// import languageIcon from '../language-selector/language-icon.svg';

import sarchThree from "./sarch-three.svg";
import srarcgOne from "./srarcg-one.svg";
import languageIcon from "./sar-settint.svg";

import aboutIcon from "./icon--about.svg";

import scratchLogo from "./scratch-logo.svg";

import sharedMessages from "../../lib/shared-messages";
import { style } from "scratch-storage";
import { StaticFun } from "../../utils/data.js";
import axios from "axios";
import {
    IconFolder,
    IconBag,
    IconWheel,
    IconHelp,
} from "../../components/download-icon/download-icon.jsx";
import CircularProgress from "@mui/material/CircularProgress";
const ariaMessages = defineMessages({
    language: {
        id: "gui.menuBar.LanguageSelector",
        defaultMessage: "language selector",
        description: "accessibility text for the language selection menu",
    },
    tutorials: {
        id: "gui.menuBar.tutorialsLibrary",
        defaultMessage: "Tutorials",
        description: "accessibility text for the tutorials button",
    },
    chooseLanguage: {
        id: "gui.menuBar.chooseLanguage",
        defaultMessage: "ChooseLanguage",
        description: "choose your language",
    },
    themeColor: {
        id: "gui.menuBar.theme",
        defaultMessage: "Choose Theme Color",
        description: "choose your theme color",
    },
    file: {
        id: "gui.menuBar.file",
        defaultMessage: "file",
        description: "file",
    },
    backpacktip: {
        id: "gui.backpack.backpacktip",
        defaultMessage: "Material backpack",
        description: "Material backpack",
    },
    settings: {
        id: " gui.menuBar.settings",
        defaultMessage: "Material backpack",
        description: "Material backpack",
    },
});

// Scratch作品
const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = "bottom",
}) => {
    if (enable) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};

MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

const MenuItemTooltip = ({ id, isRtl, children, className }) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? "left" : "right"}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool,
};

const AboutButton = (props) => (
    <Button
        className={classNames(styles.menuBarItem, styles.hoverable)}
        iconClassName={styles.aboutIcon}
        iconSrc={aboutIcon}
        onClick={props.onClick}
    />
);

AboutButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};
class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        //所有事件都要在这里绑定
        bindAll(this, [
            "handleClickNew",
            "handleClickRemix",
            "handleClickSave",
            "handleClickSaveAsCopy",
            "handleClickSeeCommunity",
            "handleClickShare",
            "handleKeyPress",
            "handleLanguageMouseUp",
            "handleRestoreOption",
            "getSaveToComputerHandler",
            "restoreOptionMessage",
            "checkouNewClick",
            "handleSaveToJsonClick",
            "handleCearclick",
            "handleSaveAs",
            "checkouUseClock",
            "handleNewSubmit",
            "handDigLog",
            "setOption",
        ]);
        this.state = {
            skinIndex: 0,
            loading: true,
            chooseLanguageVisible: false,
            imgUrl: "",
            newuseName: "",
            isSaveLoading: false,
            typeKey: 0, //根据这个参数来决定是教学站点还是编辑器  0为默认编辑器 1为综合站点 2为课堂任务查看  3为课堂任务评价  4为课程作业提交
            searchUrl: {},
            headUrl: "",
            digFlase: 1,
        };
    }
    handleItemClick = (placement) => (event) => {
        const { currentTarget } = event;
        console.log("currentTarget", currentTarget, placement);
        this.setState((state) => ({
            anchorEl: currentTarget,
            open: state.placement !== placement || !state.open,
            placement,
        }));
    };
    //useSubscribe 在这里发送请求
    checkouUseClock() {
        let user = window.sessionStorage.getItem("userName");
        if (!user || user === "") {
            const publish = usePublish();
            publish("useLogin", true);
        }
    }

    changChilrender() {
        console.log(1);
    }
    handleBackPackClick = () => {
        if (window.sessionStorage.getItem("userAdmin")) {
            this.props.onBackpackClick();
        } else {
            this.checkouUseClock();
        }
    };
    handleLoadProject = () => {
        console.log("handleLoadProject", this.state.testJson);
        this.props.vm.loadProject(this.state.testJson);
    };
    handleNewSubmits = () => {
        console.log("this", this);
        this.props.saveProjectSb3().then((content) => {
            console.log("saveProjectSb3后的content", content);
        });
    };
    // 提交作业

    // handleNewSubmit () {
    //     console.log("c", this.state.searchUrl);
    //     let { searchUrl } = this.state;

    //     this.setState({
    //         isSaveLoading: true,
    //     });

    //     this.props.saveProjectSb3().then((content) => {
    //         if (content) {
    //             this.props.vm.renderer.requestSnapshot((dataURI) => {
    //                 let params = {
    //                     fileName: this.props.projectFilename,
    //                     filetype: content,
    //                 };

    //                 let fileStream = StaticFun.base64toFile(
    //                     dataURI,
    //                     new Date().getTime() + ".jpg"
    //                 );
    //                 let datafile = new File(
    //                     [params.filetype],
    //                     params.fileName,
    //                     { type: params.filetype.type }
    //                 );
    //                 // 用户信息
    //                 let token = searchUrl.oarr[3];
    //                 let workId = searchUrl.oarr[2];

    //                 let param = new FormData();

    //                 // param.append("token", token);
    //                 searchUrl.tskey === 3
    //                     ? param.append("workId", workId)
    //                     : param.append("taskId", workId);
    //                 param.append("image", fileStream);
    //                 param.append("file", datafile);
    //                 param.append("name", this.props.projectFilename);
    //                 param.append("vm", this.props.vm.toJSON());

    //                 // 课程作业提交

    //                 (searchUrl.tskey === 3
    //                     ? childrenAdd(param)
    //                     : TaskCommitSend(param)
    //                 ).then((res) => {
    //                     if (res.data.code == 200) {
    //                         this.setState({
    //                             isSaveLoading: false,
    //                         });
    //                         const publish = usePublish();
    //                         publish("openMessage", {
    //                             anchorOrigin: {
    //                                 vertical: "top",
    //                                 horizontal: "center",
    //                             },
    //                             open: true,
    //                             message: "提交成功",
    //                         });
    //                         publish("newdataUrl", {
    //                             content,
    //                             dataURI,
    //                             newurlBlob: fileStream,
    //                             id: res.data.data,
    //                         });

    //                         // 保存的作品id
    //                         sessionStorage.setItem("worksid", res.data.data);
    //                     } else {
    //                         //close loading
    //                         alert(res.data.msg);
    //                         this.setState({
    //                             isSaveLoading: false,
    //                         });
    //                     }
    //                 });
    //             });
    //         } else {
    //             reject();
    //         }
    //     });
    // }

    handleNewSubmit() {
        let { searchUrl } = this.state;

        this.setState({
            isSaveLoading: true,
        });
        return Promise.all(
            this.props.vm.assets
                .filter((asset) => !asset.clean)
                .map((asset) => {
                    let token = window.sessionStorage.getItem("userAdmin");
                    fetch(
                        `/contentServer/workMaterial/addExternal/${asset.assetId}.${asset.dataFormat}?token=${token}`,
                        {
                            method: "post",
                            // mode: 'no-cors',
                            body: asset.data,
                        }
                    ).then((uploadres) => {
                        console.log("图片上传回调", uploadres);
                        if (uploadres.status != 200) {
                            return Promise.reject(response.code);
                        }
                        asset.clean = true;
                    });
                })
        ).then(() => {
            this.props.saveProjectSb3().then((content) => {
                if (content) {
                    this.props.vm.renderer.requestSnapshot((dataURI) => {
                        let params = {
                            fileName: this.props.projectFilename,
                            filetype: content,
                        };

                        let fileStream = StaticFun.base64toFile(
                            dataURI,
                            new Date().getTime() + ".jpg"
                        );
                        let datafile = new File(
                            [params.filetype],
                            params.fileName,
                            { type: params.filetype.type }
                        );
                        // 用户信息
                        let token = searchUrl.oarr[3];
                        let workId = searchUrl.oarr[2];

                        let param = new FormData();

                        // param.append("token", token);
                        searchUrl.tskey === 3
                            ? param.append("workId", workId)
                            : param.append("taskId", workId);
                        param.append("image", fileStream);
                        param.append("file", datafile);
                        param.append("name", this.props.projectFilename);
                        param.append("vm", this.props.vm.toJSON());

                        // 课程作业提交

                        (searchUrl.tskey === 3
                            ? childrenAdd(param)
                            : TaskCommitSend(param)
                        ).then((res) => {
                            if (res.data.code == 200) {
                                this.setState({
                                    isSaveLoading: false,
                                });
                                const publish = usePublish();
                                publish("openMessage", {
                                    anchorOrigin: {
                                        vertical: "top",
                                        horizontal: "center",
                                    },
                                    open: true,
                                    message: "提交成功",
                                });
                                publish("newdataUrl", {
                                    content,
                                    dataURI,
                                    newurlBlob: fileStream,
                                    id: res.data.data,
                                });

                                // 保存的作品id
                                sessionStorage.setItem(
                                    "worksid",
                                    res.data.data
                                );
                            } else {
                                //close loading
                                alert(res.data.msg);
                                this.setState({
                                    isSaveLoading: false,
                                });
                            }
                        });
                    });
                } else {
                    reject();
                }
            });
        });
    }

    componentDidMount() {
        // 一进入页面全部存静态资源头部url然后存到全局

        getUrlHead().then((res) => {
            if (res.data.code === "200") {
                let fileUrlPrefix = res.data.data[0].remark;

                this.setState({
                    headUrl: fileUrlPrefix,
                });
                window.localStorage.setItem("fileUrlPrefix", fileUrlPrefix);
            }
        });

        // 接受传送的图片url

        this.token = useSubscribe("setName", (msg, stateObj) => {
            if (msg === "setName") {
                this.setState({
                    newuseName: stateObj,
                });
            }
        });

        document.addEventListener("keydown", this.handleKeyPress);

        // 看看存的有没有用户信息

        let user = window.sessionStorage.getItem("userName");
        if (user && user !== "") {
            this.setState({
                newuseName: user,
            });
        }

        let searchUrl = window.location.search;
        // let searchUrl = "http://39.108.116.175/markeditor?Y21kPWV2YWx1YXRlV29yayZpZD0xNTY4MDUzMzIyOTYxNzE1MjAxJndvcmtJZD0xNTY4MDUzMzIyOTIzOTY2NDY2JnRrPWV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUpsZUhBaU9qRTJOamMxTkRnME5qa3NJblZ6WlhKdVlXMWxJam9pTVRnek9EQTBOVFUwT1RRaWZRLk9sbW83bDY1ZmZhTVhuRDhMbGV2RElsdmlYVjRpRkpROXNKS0szdkpkS2s=";
        // 获取所有的src
        // let searchUrl=document.querySelectorAll("iframe")[0].src

        //教学站点用户提交数据
        // let studEnt = "http://39.108.116.175/markeditor?Y21kPWV2YWx1YXRlVGFzayZpZD0xNTU1NzM2MzYzODE3NTYyMTEzJnRhc2tJZD0xNTU1NzM2MTY4MjYyMzMyNDE3JnRrPWV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUpsZUhBaU9qRTJOVGszTlRNME1Ua3NJblZ6WlhKdVlXMWxJam9pTVRnNE1UQTRNREV3TlRZaWZRLkMtVlBDbGxPN0hMR25CZGhjQVVqMkg5cThIdTNCX0FzNWpJdVVkT01ZZjA="

        let twooObj = StaticFun.getToken(searchUrl);
        sessionStorage.removeItem("worksid");
        // let bodyObj = StaticFun.getToken(studEnt)

        // console.log(bodyObj, "bodyObj")

        // 综合站点
        // console.log(this.props);
        // this.props.openCards();
        // window.sessionStorage.setItem("appID", "1311410272");
        // window.sessionStorage.setItem("fileID", "387702303161225153");
        if (twooObj && Array.isArray(twooObj.oarr)) {
            //替换一下对象
            this.setState({
                searchUrl: twooObj,
            });

            if (twooObj?.tskey === 1 || twooObj?.tskey === 8) {
                let setTkoken =
                    twooObj?.tskey === 1 ? twooObj.oarr[1] : twooObj.oarr[3];
                window.sessionStorage.setItem("userAdmin", setTkoken);
                sendLogintoken({
                    token: setTkoken,
                }).then((res) => {
                    const publish = usePublish();
                    if (res.data.code === "200") {
                        const publish = usePublish();
                        let { nickName } = res.data.data;

                        window.sessionStorage.setItem("userName", nickName);

                        this.setState({
                            newuseName: nickName,
                        });
                        publish("loginSuccess", {
                            nickName,
                        });
                    } else {
                        publish("openMessage", {
                            anchorOrigin: {
                                vertical: "top",
                                horizontal: "center",
                            },
                            open: true,
                            message: "用户身份已失效,请重新登陆",
                        });
                    }
                });

                //tskey等于8是边学边做
                if (twooObj?.tskey === 8) {
                    let appid = twooObj.oarr[1];
                    let fileid = twooObj.oarr[2];
                    let filename = twooObj.oarr[3];
                    console.log("openCardsopenCards");
                    this.props.openCards();
                    window.sessionStorage.setItem("appID", appid);
                    window.sessionStorage.setItem("fileID", fileid);
                    window.sessionStorage.setItem("fileName", filename);
                }
            } else if (twooObj?.tskey === 2 || twooObj?.tskey === 3) {
                // 课堂任务提交

                window.sessionStorage.setItem("userAdmin", twooObj.oarr[3]);
                this.setState({
                    typeKey: 1,
                });

                // twooObj?.tskey === 2
                //     ? this.openTaskSb3file(twooObj.oarr[1])
                //     : this.openWorkSb3file(twooObj.oarr[1]);
                twooObj?.tskey === 2
                    ? this.openTaskSb3filenew(twooObj.oarr[1])
                    : this.openWorkSb3filenew(twooObj.oarr[1]);
            } else if (twooObj?.tskey === 4 || twooObj?.tskey === 5) {
                window.sessionStorage.setItem("userAdmin", twooObj.oarr[3]);
                //课堂任务查看
                this.setState({
                    typeKey: 2,
                });

                twooObj?.tskey === 4
                    ? this.openTaskSb3filenew(twooObj.oarr[1])
                    : this.openWorkSb3filenew(twooObj.oarr[1]);
            } else if (twooObj?.tskey === 6 || twooObj?.tskey === 7) {
                window.sessionStorage.setItem("userAdmin", twooObj.oarr[3]);
                //课堂任务评价
                this.setState({
                    typeKey: 3,
                });

                // twooObj?.tskey === 6
                //     ? this.openTaskSb3file(twooObj.oarr[1])
                //     : this.openWorkSb3file(twooObj.oarr[1]);

                twooObj?.tskey === 6
                    ? this.openTaskSb3filenew(twooObj.oarr[1])
                    : this.openWorkSb3filenew(twooObj.oarr[1]);
            } else if (twooObj?.tskey === 9) {
                //打开草稿箱
                window.sessionStorage.setItem("userAdmin", twooObj.oarr[2]);
                this.openFile(twooObj.oarr[1]);
            }
        }
    }

    loadProject = (data) => {
        let { vm } = this.props;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                vm.loadProject(data);
                resolve();
            }, 500);
        });
    };

    // 作品
    openFile(e) {
        let headUrl = window.localStorage.getItem("fileUrlPrefix");

        findontentServer({ id: e }).then((res) => {
            let {
                data: { vmFileURL, id },
                code,
            } = res.data;
            if (code === "200") {
                let newfileUrl = `${headUrl}${vmFileURL}`;
                console.log(newfileUrl, "cccfileURL");
                axios(newfileUrl, {
                    method: "get",
                    headers: {
                        "content-type": "application/json",
                    },
                }).then((res) => {
                    let filedata = JSON.parse(res.data.data);
                    this.loadProject(filedata);

                    // 替换文件id
                    sessionStorage.setItem("worksid", id);
                });
            }
        });
    }

    //任务打开文件
    openTaskSb3file(e) {
        let headUrl = window.localStorage.getItem("fileUrlPrefix");
        findClassTasekId({ id: e }).then((res) => {
            let {
                data: { vmFileURL, id },
                code,
            } = res.data;
            if (code === "200") {
                let newfileUrl = `${headUrl}${vmFileURL}`;
                console.log(newfileUrl, "cccfileURL");
                axios(newfileUrl, {
                    method: "get",
                    headers: {
                        "content-type": "application/json",
                    },
                }).then((res) => {
                    let filedata = JSON.parse(res.data.data);
                    this.loadProject(filedata);

                    // 替换文件id
                    sessionStorage.setItem("worksid", id);
                });
            }
        });
    }
    //作业打开文件
    openWorkSb3file(e) {
        let headUrl = window.localStorage.getItem("fileUrlPrefix");
        findClassId({ id: e }).then((res) => {
            let {
                data: { vmFileURL, id },
                code,
            } = res.data;
            if (code === "200") {
                let newfileUrl = `${headUrl}${vmFileURL}`;
                console.log(newfileUrl, "cccfileURL");
                axios(newfileUrl, {
                    method: "get",
                    headers: {
                        "content-type": "application/json",
                    },
                }).then((res) => {
                    let filedata = JSON.parse(res.data.data);
                    this.loadProject(filedata);

                    // 替换文件id
                    sessionStorage.setItem("worksid", id);
                });
            }
        });
    }
    openTaskSb3filenew(e) {
        let that = this;
        let headUrl = window.localStorage.getItem("fileUrlPrefix");

        findClassTasekId({ id: e }).then((res) => {
            let {
                data: { fileURL, id },
                code,
            } = res.data;
            if (code === "200") {
                let newfileUrl = `${headUrl}${fileURL}`;
                console.log(newfileUrl, "cccfileURL");
                fetch(newfileUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        let reader = new FileReader();
                        reader.onloadend = function () {
                            that.loadProject(reader.result);

                            sessionStorage.setItem("worksid", id);
                        };
                        reader.readAsArrayBuffer(blob);
                    });
            }
        });
    }
    openWorkSb3filenew(e) {
        let that = this;
        let headUrl = window.localStorage.getItem("fileUrlPrefix");
        findClassId({ id: e }).then((res) => {
            let {
                data: { fileURL, id },
                code,
            } = res.data;
            if (code === "200") {
                let newfileUrl = `${headUrl}${fileURL}`;
                console.log(newfileUrl, "xxfileURL");
                fetch(newfileUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        let reader = new FileReader();
                        reader.onloadend = function () {
                            that.loadProject(reader.result);

                            sessionStorage.setItem("worksid", id);
                        };
                        reader.readAsArrayBuffer(blob);
                    });
            }
        });
    }
    // openWorkSb3filenewnew() {
    //     let that = this;
    //     let newfileUrl =
    //         "http://182.61.146.154:30210/fileServer/attachment/download?id=1554390915068522498&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTk0MzAzNzEsInVzZXJuYW1lIjoiMTU3NTc4NTIwNzUifQ.uIpcHEmI19XaMwE5A-4Jdle1SM7utWTfncamCFm3ouQ";
    //     // let newfileUrl = `${headUrl}${fileURL}`;

    //     fetch(newfileUrl)
    //         .then((response) => response.blob())
    //         .then((blob) => {
    //             let reader = new FileReader();
    //             reader.onloadend = function () {
    //                 console.log("result", reader.result);
    //                 that.props.vm.loadProject(reader.result);
    //                 //sessionStorage.setItem("worksid", id);
    //             };
    //             reader.readAsDataURL(blob);
    //             //reader.readAsArrayBuffer(blob);
    //         });
    // }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    }

    trytotoggle() {
        this.setState({
            isSaveLoading: !this.state.isSaveLoading,
        });
    }
    saveClickNew() {
        this.setState({
            isSaveLoading: true,
        });
        return Promise.all(
            this.props.vm.assets
                .filter((asset) => !asset.clean)
                .map((asset) => {
                    let token = window.sessionStorage.getItem("userAdmin");
                    fetch(
                        `${process.env.ASSET_HOST}/contentServer/workMaterial/addExternal/${asset.assetId}.${asset.dataFormat}?token=${token}`,
                        {
                            method: "post",
                            // mode: 'no-cors',
                            body: asset.data,
                        }
                    ).then((uploadres) => {
                        console.log("图片上传回调", uploadres);
                        if (uploadres.status != 200) {
                            return Promise.reject(response.code);
                        }
                        asset.clean = true;
                    });
                })
        )
            .then(() => {
                this.props.saveProjectSb3().then((content) => {
                    if (content) {
                        this.props.vm.renderer.requestSnapshot((dataURI) => {
                            let params = {
                                fileName: this.props.projectFilename,
                                filetype: content,
                            };
                            let param = new FormData();
                            let fileStream = StaticFun.base64toFile(
                                dataURI,
                                new Date().getTime() + ".jpg"
                            );
                            let datafile = new File(
                                [params.filetype],
                                params.fileName,
                                { type: params.filetype.type }
                            );
                            let projectId = sessionStorage.getItem("worksid")
                                ? sessionStorage.getItem("worksid")
                                : "";
                            param.append("id", projectId);
                            param.append("image", fileStream);
                            param.append("file", datafile);
                            param.append("name", this.props.projectFilename);
                            param.append("vm", this.props.vm.toJSON());
                            saveUpload(param)
                                .then((res) => {
                                    if (res.data.code == 200) {
                                        //close loading & close confirm
                                        this.setState({
                                            isSaveLoading: false,
                                            digFlase: 1,
                                        });
                                        const publish = usePublish();
                                        publish("openMessage", {
                                            anchorOrigin: {
                                                vertical: "top",
                                                horizontal: "center",
                                            },
                                            open: true,
                                            message: "保存成功",
                                        });
                                        publish("newdataUrl", {
                                            content,
                                            dataURI,
                                            newurlBlob: fileStream,
                                            id: res.data.data,
                                        });

                                        // 保存的作品id
                                        sessionStorage.setItem(
                                            "worksid",
                                            res.data.data
                                        );
                                    } else {
                                        //close loading

                                        alert(res.data.msg);
                                        this.setState({
                                            isSaveLoading: false,
                                        });
                                    }
                                })
                                .catch((err) => {
                                    this.setState({
                                        isSaveLoading: false,
                                        digFlase: 2,
                                    });
                                    return err;
                                });
                        });
                    } else {
                        reject();
                    }
                });
            })
            .catch((err) => {
                log.error(err);
                throw err; // pass the error up the chain
            });
    }
    load() {}

    // 保存和发布的事件
    checkouNewClick(e) {
        if (e === 1) {
            this.saveClickNew();
            //     this.setState({
            //         loading:false
            //         })

            //     this.props.saveProjectSb3().then(res => {
            //         if (res) {
            //           publish("saveImg", {
            //                 res
            //             })
            //         let timer= setTimeout(() => {
            //            this.setState({
            //                 loading:true
            //            })
            //         //弹框
            //         publish("openMessage", {
            //             anchorOrigin: {
            //             vertical: 'top', horizontal: 'center'
            //             },
            //             open: true,
            //             message: "保存成功",
            //         })
            //         }, 3000)
            //         //弹框对象
            //         // 保存img事件
            //         clearTimeout(this.timer)
            //     }
            // })
        } else {
            // 在这里做处理
            Promise.resolve()
                .then(() => {
                    return StaticFun.NewPromsie(500, this.saveClickNew());
                })
                .then((res) => {
                    return StaticFun.NewPromsie(500, this.setOption());
                });
        }
    }

    setOption() {
        this.props.onCloseCards();
        const publish = usePublish();
        publish("opendow", {
            key: true,
            name: this.props.projectFilename,
        });
    }

    // 新建
    handleSaveToJsonClick() {
        console.log("handleSaveToJsonClick");
        console.log(this.props.vm.toJSON());
        console.log(tjson);
        this.props.vm.toJSON();
        this.props.vm.loadProject(tjson);
    }
    handleCearclick() {
        if (window.scratchConfig && window.scratchConfig.menuBar.crearButton) {
            if (!window.scratchConfig.menuBar.crearButton.handleBefore()) {
                return;
            }
        }

        const publish = usePublish();
        publish("OpenCreate", true);

        // 关闭的事件
        this.props.onRequestCloseFile();
    }

    // 另存为
    handleSaveAs() {
        if (window.scratchConfig && window.scratchConfig.menuBar.saveaAs) {
            if (!window.scratchConfig.menuBar.saveaAs.handleBefore()) {
                return;
            }
        }
        this.props.onRequestCloseFile();
    }

    // 清除所有的
    handleClickNew() {
        if (window.scratchConfig && window.scratchConfig.menuBar.newButton) {
            if (!window.scratchConfig.menuBar.newButton.handleBefore()) {
                return;
            }
        }
        // if the project is dirty, and user owns the project, we will autosave.
        // but if they are not logged in and can't save, user should consider
        // downloading or logging in first.
        // Note that if user is logged in and editing someone else's project,
        // they'll lose their work.
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        this.props.onRequestCloseFile();
        if (localStorage.getItem("projectId")) {
            localStorage.removeItem("projectId");
        }
        if (readyToReplaceProject) {
            this.props.onClickNew(
                this.props.canSave && this.props.canCreateNew
            );
        }
        this.props.onRequestCloseFile();

        // 删除上个作品的id
        sessionStorage.removeItem("worksid");
    }
    handleClickRemix() {
        this.props.onClickRemix();
        this.props.onRequestCloseFile();
    }
    handleClickSave() {
        this.props.onClickSave();
        this.props.onRequestCloseFile();
    }
    handleClickSaveAsCopy() {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }
    handleClickSeeCommunity(waitForUpdate) {
        if (this.props.shouldSaveBeforeTransition()) {
            this.props.autoUpdateProject(); // save before transitioning to project page
            waitForUpdate(true); // queue the transition to project page
        } else {
            waitForUpdate(false); // immediately transition to project page
        }
    }
    handleClickShare(waitForUpdate) {
        if (!this.props.isShared) {
            if (this.props.canShare) {
                // save before transitioning to project page
                this.props.onShare();
            }
            if (this.props.canSave) {
                // save before transitioning to project page
                this.props.autoUpdateProject();
                waitForUpdate(true); // queue the transition to project page
            } else {
                waitForUpdate(false); // immediately transition to project page
            }
        }
    }
    handleRestoreOption(restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleKeyPress(event) {
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier && event.key === "s") {
            this.props.onClickSave();
            event.preventDefault();
        }
    }
    getSaveToComputerHandler(downloadProjectCallback) {
        return () => {
            if (
                window.scratchConfig &&
                window.scratchConfig.menuBar.saveFileButton
            ) {
                if (
                    !window.scratchConfig.menuBar.saveFileButton.handleBefore()
                ) {
                    return;
                }
            }
            this.props.onRequestCloseFile();

            downloadProjectCallback();
            if (this.props.onProjectTelemetryEvent) {
                const metadata = collectMetadata(
                    this.props.vm,
                    this.props.projectTitle,
                    this.props.locale
                );
                this.props.onProjectTelemetryEvent("projectDidSave", metadata);
            }
        };
    }
    handleLanguageMouseUp(e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    restoreOptionMessage(deletedItem) {
        switch (deletedItem) {
            case "Sprite":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sprite"
                        description="Menu bar item for restoring the last deleted sprite."
                        id="gui.menuBar.restoreSprite"
                    />
                );
            case "Sound":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sound"
                        description="Menu bar item for restoring the last deleted sound."
                        id="gui.menuBar.restoreSound"
                    />
                );
            case "Costume":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Costume"
                        description="Menu bar item for restoring the last deleted costume."
                        id="gui.menuBar.restoreCostume"
                    />
                );
            default: {
                return (
                    <FormattedMessage
                        defaultMessage="Restore"
                        description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                        id="gui.menuBar.restore"
                    />
                );
            }
        }
    }
    buildAboutMenu(onClickAbout) {
        if (!onClickAbout) {
            // hide the button
            return null;
        }
        if (typeof onClickAbout === "function") {
            // make a button which calls a function
            return <AboutButton onClick={onClickAbout} />;
        }
        // assume it's an array of objects
        // each item must have a 'title' FormattedMessage and a 'handleClick' function
        // generate a menu with items for each object in the array
        return (
            <div
                className={classNames(styles.menuBarItem, styles.hoverable, {
                    [styles.active]: this.props.aboutMenuOpen,
                })}
                onMouseUp={this.props.onRequestOpenAbout}
            >
                <img className={styles.aboutIcon} src={aboutIcon} />
                <MenuBarMenu
                    className={classNames(styles.menuBarMenu)}
                    open={this.props.aboutMenuOpen}
                    place={this.props.isRtl ? "right" : "left"}
                    onRequestClose={this.props.onRequestCloseAbout}
                >
                    {onClickAbout.map((itemProps) => (
                        <MenuItem
                            key={itemProps.title}
                            isRtl={this.props.isRtl}
                            onClick={this.wrapAboutMenuCallback(
                                itemProps.onClick
                            )}
                        >
                            {itemProps.title}
                        </MenuItem>
                    ))}
                </MenuBarMenu>
            </div>
        );
    }
    wrapAboutMenuCallback(callback) {
        return () => {
            callback();
            this.props.onRequestCloseAbout();
        };
    }
    toggleSkin(index) {
        console.log("toggleSkin", index, document.documentElement.style);
        if (index == 0) {
            document.documentElement.style.setProperty(
                "--motionPrimary",
                "hsla(14,99%,62.4%, 1)"
            );
            document.documentElement.style.setProperty(
                "--menuBackground",
                "hsla(15,100%,95.3%, 1)"
            );
            document.documentElement.style.setProperty(
                "--uiPrimary",
                "hsla(15,100%,95.3%, 1)"
            );
            document.documentElement.style.setProperty(
                "--motionBtn",
                "#FFC8B6"
            );
        } else if (index == 1) {
            document.documentElement.style.setProperty(
                "--motionPrimary",
                "hsla(238,87.1%,66.7%, 1)"
            );
            document.documentElement.style.setProperty(
                "--menuBackground",
                "hsla(238, 81%, 75%, 1)"
            );
            document.documentElement.style.setProperty(
                "--uiPrimary",
                "#ffffff"
            );
            document.documentElement.style.setProperty(
                "--motionBtn",
                "rgb(163, 201, 255)"
            );
        } else {
            document.documentElement.style.setProperty(
                "--motionPrimary",
                "hsla(215, 100%, 65%, 1)"
            );
            document.documentElement.style.setProperty(
                "--menuBackground",
                "hsla(215, 91%, 78%, 1)"
            );
            document.documentElement.style.setProperty(
                "--uiPrimary",
                "#ffffff"
            );
            document.documentElement.style.setProperty(
                "--motionBtn",
                "rgb(163, 201, 255)"
            );
        }
    }
    onChange(value) {
        console.log(value);
    }
    // Just show the latest item.
    displayRender(label) {
        return label[label.length - 1];
    }

    handDigLog() {
        const { searchUrl } = this.state;
        // 打开评价
        console.log("searchUrl", searchUrl);
        this.props.OpenEvaluation(searchUrl);
    }

    render() {
        const { newuseName, typeKey } = this.state;
        console.log(typeKey, "typeKey");
        const saveNowMessage = (
            <FormattedMessage
                defaultMessage="Save now"
                description="Menu bar item for saving now"
                id="gui.menuBar.saveNow"
            />
        );
        const createCopyMessage = (
            <FormattedMessage
                defaultMessage="Save as a copy"
                description="Menu bar item for saving as a copy"
                id="gui.menuBar.saveAsCopy"
            />
        );
        const remixMessage = (
            <FormattedMessage
                defaultMessage="Remix"
                description="Menu bar item for remixing"
                id="gui.menuBar.remix"
            />
        );
        const newProjectMessage = (
            <FormattedMessage
                defaultMessage="New"
                description="Menu bar item for creating a new project"
                id="gui.menuBar.new"
            />
        );
        const openProjectMessage = (
            <FormattedMessage
                defaultMessage="Open Project"
                description="open project from server"
                id="gui.menuBar.openProject"
            />
        );

        const remixButton = (
            <Button
                className={classNames(styles.menuBarButton, styles.remixButton)}
                iconClassName={styles.remixButtonIcon}
                iconSrc={remixIcon}
                onClick={this.handleClickRemix}
            >
                {remixMessage}
            </Button>
        );

        return (
            <>
                {/* <div
                    onClick={() => {
                        this.openWorkSb3filenewnew();
                    }}
                >
                    openWorkSb3filenewnew
                </div> */}
                {/* 默认 */}
                {typeKey === 0 && (
                    <Box
                        className={classNames(
                            this.props.className,
                            styles.menuBar
                        )}
                        style={
                            window.scratchConfig &&
                            window.scratchConfig.menuBar &&
                            window.scratchConfig.menuBar.style
                        }
                    >
                        {/* <div className={styles.loadingNotap}><CircularProgress id="progress-notap" ref={this.textInput} classes={styles.progressColor} /></div> */}
                        {this.state.isSaveLoading ? (
                            <div className={styles.loadingNotap}>
                                <CircularProgress
                                    id="progress-notap"
                                    ref={this.textInput}
                                    classes={styles.progressColor}
                                />
                            </div>
                        ) : null}
                        <div className={styles.mainMenu}>
                            <div className={styles.fileGroup}>
                                {window.scratchConfig.logo &&
                                    window.scratchConfig.logo.show && (
                                        <div
                                            className={classNames(
                                                styles.menuBarItem
                                            )}
                                        >
                                            <img
                                                alt="Scratch"
                                                className={classNames(
                                                    styles.scratchLogo,
                                                    {
                                                        [styles.clickable]:
                                                            typeof this.props
                                                                .onClickLogo !==
                                                            "undefined",
                                                    }
                                                )}
                                                draggable={false}
                                                src={
                                                    window.scratchConfig.logo
                                                        .url || this.props.logo
                                                }
                                                onClick={
                                                    window.scratchConfig.logo
                                                        .handleClickLogo
                                                }
                                            />
                                        </div>
                                    )}

                                {/* 文件 */}
                                {this.props.canManageFiles && (
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            {
                                                [styles.active]:
                                                    this.props.fileMenuOpen,
                                            }
                                        )}
                                        onMouseUp={this.props.onClickFile}
                                    >
                                        {/* <FormattedMessage
                                    defaultMessage="File"
                                    description="Text for file dropdown menu"
                                    id="gui.menuBar.file"
                                /> */}
                                        {/* <img     className={styles.languageIcon}
                                    src={srarcgOne}/> */}
                                        {this.props.fileMenuOpen ? (
                                            <div>
                                                <IconFolder
                                                    className={
                                                        styles.folderColor
                                                    }
                                                    width={24}
                                                />
                                            </div>
                                        ) : (
                                            <Tooltip
                                                title={this.props.intl.formatMessage(
                                                    ariaMessages.file
                                                )}
                                            >
                                                <div>
                                                    <IconFolder
                                                        className={
                                                            styles.folderColor
                                                        }
                                                        width={24}
                                                    />
                                                </div>
                                            </Tooltip>
                                        )}

                                        <MenuBarMenu
                                            className={classNames(
                                                styles.menuBarMenu
                                            )}
                                            open={this.props.fileMenuOpen}
                                            place={
                                                this.props.isRtl
                                                    ? "left"
                                                    : "right"
                                            }
                                            onRequestClose={
                                                this.props.onRequestCloseFile
                                            }
                                        >
                                            <MenuSection>
                                                {window.scratchConfig &&
                                                    window.scratchConfig
                                                        .menuBar &&
                                                    window.scratchConfig.menuBar
                                                        .newButton &&
                                                    window.scratchConfig.menuBar
                                                        .newButton.show && (
                                                        <MenuItem
                                                            isRtl={
                                                                this.props.isRtl
                                                            }
                                                            onClick={
                                                                this
                                                                    .handleCearclick
                                                            }
                                                        >
                                                            {openProjectMessage}
                                                        </MenuItem>
                                                    )}
                                            </MenuSection>
                                            <MenuSection>
                                                {window.scratchConfig &&
                                                    window.scratchConfig
                                                        .menuBar &&
                                                    window.scratchConfig.menuBar
                                                        .newButton &&
                                                    window.scratchConfig.menuBar
                                                        .newButton.show && (
                                                        <MenuItem
                                                            isRtl={
                                                                this.props.isRtl
                                                            }
                                                            onClick={
                                                                this
                                                                    .handleClickNew
                                                            }
                                                        >
                                                            {newProjectMessage}
                                                        </MenuItem>
                                                    )}
                                            </MenuSection>

                                            {/* <MenuSection>
                                        {window.scratchConfig &&
                                            window.scratchConfig.menuBar &&
                                            window.scratchConfig.menuBar
                                                .saveaAs &&
                                            window.scratchConfig.menuBar.saveaAs
                                                .show && (
                                                <MenuItem
                                                    isRtl={this.props.isRtl}
                                                    onClick={this.handleSaveAs}
                                                >
                                                    另存为
                                                </MenuItem>
                                            )}
                                    </MenuSection> */}
                                            {(this.props.canSave ||
                                                this.props.canCreateCopy ||
                                                this.props.canRemix) && (
                                                <MenuSection>
                                                    {this.props.canSave && (
                                                        <MenuItem
                                                            onClick={
                                                                this
                                                                    .handleClickSave
                                                            }
                                                        >
                                                            {saveNowMessage}
                                                        </MenuItem>
                                                    )}
                                                    {this.props
                                                        .canCreateCopy && (
                                                        <MenuItem
                                                            onClick={
                                                                this
                                                                    .handleClickSaveAsCopy
                                                            }
                                                        >
                                                            {createCopyMessage}
                                                        </MenuItem>
                                                    )}
                                                    {this.props.canRemix && (
                                                        <MenuItem
                                                            onClick={
                                                                this
                                                                    .handleClickRemix
                                                            }
                                                        >
                                                            {remixMessage}
                                                        </MenuItem>
                                                    )}
                                                </MenuSection>
                                            )}
                                            <MenuSection>
                                                {window.scratchConfig &&
                                                    window.scratchConfig
                                                        .menuBar &&
                                                    window.scratchConfig.menuBar
                                                        .loadFileButton &&
                                                    window.scratchConfig.menuBar
                                                        .loadFileButton
                                                        .show && (
                                                        <MenuItem
                                                            onClick={
                                                                this.props
                                                                    .onStartSelectingFileUpload
                                                            }
                                                        >
                                                            {this.props.intl.formatMessage(
                                                                sharedMessages.loadFromComputerTitle
                                                            )}
                                                        </MenuItem>
                                                    )}

                                                {window.scratchConfig &&
                                                    window.scratchConfig
                                                        .menuBar &&
                                                    window.scratchConfig.menuBar
                                                        .saveFileButton &&
                                                    window.scratchConfig.menuBar
                                                        .saveFileButton
                                                        .show && (
                                                        <SB3Downloader>
                                                            {(
                                                                className,
                                                                downloadProjectCallback
                                                            ) => (
                                                                <MenuItem
                                                                    className={
                                                                        className
                                                                    }
                                                                    onClick={this.getSaveToComputerHandler(
                                                                        downloadProjectCallback
                                                                    )}
                                                                >
                                                                    <FormattedMessage
                                                                        defaultMessage="Save to your computer"
                                                                        description="Menu bar item for downloading a project to your computer" //用于将项目下载到计算机的菜单栏项
                                                                        id="gui.menuBar.downloadToComputer"
                                                                    />
                                                                </MenuItem>
                                                            )}
                                                        </SB3Downloader>
                                                    )}
                                            </MenuSection>
                                        </MenuBarMenu>
                                    </div>
                                )}
                                {/* 打开背包&&加速模式 */}
                                <Tooltip
                                    title={this.props.intl.formatMessage(
                                        ariaMessages.backpacktip
                                    )}
                                >
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            {
                                                [styles.active]:
                                                    this.props.editMenuOpen,
                                            }
                                        )}
                                        // onMouseUp={this.props.onBackpackClick}
                                        onMouseUp={() => {
                                            this.handleBackPackClick();
                                        }}
                                    >
                                        <div
                                            className={classNames(
                                                styles.editMenu
                                            )}
                                        >
                                            {/* <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                /> */}
                                            {/* <img     className={styles.languageIcon}
                                    src={sarchThree}/> */}
                                            <div>
                                                <IconBag
                                                    className={styles.bagColor}
                                                    width={24}
                                                />
                                            </div>
                                        </div>
                                        <MenuBarMenu
                                            className={classNames(
                                                styles.menuBarMenu
                                            )}
                                            open={this.props.editMenuOpen}
                                            place={
                                                this.props.isRtl
                                                    ? "left"
                                                    : "right"
                                            }
                                            onRequestClose={
                                                this.props.onRequestCloseEdit
                                            }
                                        >
                                            <DeletionRestorer>
                                                {(
                                                    handleRestore,
                                                    { restorable, deletedItem }
                                                ) => (
                                                    <MenuItem
                                                        className={classNames({
                                                            [styles.disabled]:
                                                                !restorable,
                                                        })}
                                                        onClick={this.handleRestoreOption(
                                                            handleRestore
                                                        )}
                                                    >
                                                        {this.restoreOptionMessage(
                                                            deletedItem
                                                        )}
                                                    </MenuItem>
                                                )}
                                            </DeletionRestorer>
                                            {window.scratchConfig &&
                                                window.scratchConfig.menuBar &&
                                                window.scratchConfig.menuBar
                                                    .turboModeButton &&
                                                window.scratchConfig.menuBar
                                                    .turboModeButton.show && (
                                                    <MenuSection>
                                                        <TurboMode>
                                                            {(
                                                                toggleTurboMode,
                                                                { turboMode }
                                                            ) => (
                                                                <MenuItem
                                                                    onClick={
                                                                        toggleTurboMode
                                                                    }
                                                                >
                                                                    {turboMode ? (
                                                                        <FormattedMessage
                                                                            defaultMessage="Turn off Turbo Mode"
                                                                            description="Menu bar item for turning off turbo mode"
                                                                            id="gui.menuBar.turboModeOff"
                                                                        />
                                                                    ) : (
                                                                        <FormattedMessage
                                                                            defaultMessage="Turn on Turbo Mode"
                                                                            description="Menu bar item for turning on turbo mode"
                                                                            id="gui.menuBar.turboModeOn"
                                                                        />
                                                                    )}
                                                                </MenuItem>
                                                            )}
                                                        </TurboMode>
                                                    </MenuSection>
                                                )}
                                        </MenuBarMenu>
                                    </div>
                                </Tooltip>
                                {/* 设置 */}

                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.hoverable,
                                        {
                                            [styles.active]:
                                                this.props.settingMenuOpen,
                                        }
                                    )}
                                    onMouseUp={this.props.onClickSet}
                                >
                                    <Tooltip
                                        title={this.props.intl.formatMessage(
                                            ariaMessages.settings
                                        )}
                                    >
                                        <div
                                            className={classNames(
                                                styles.editMenu
                                            )}
                                        >
                                            {/* <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                /> */}
                                            {/* <img     className={styles.languageIcon}
                                    src={languageIcon}/> */}
                                            <div>
                                                <IconWheel
                                                    className={
                                                        styles.folderColor
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </Tooltip>
                                    <MenuBarMenu
                                        className={classNames(
                                            styles.menuBarMenu
                                        )}
                                        open={this.props.settingMenuOpen}
                                        place={
                                            this.props.isRtl ? "left" : "right"
                                        }
                                        onRequestClose={
                                            this.props.onRequestCloseSet
                                        }
                                    >
                                        {window.scratchConfig &&
                                            window.scratchConfig.menuBar &&
                                            window.scratchConfig.menuBar
                                                .turboModeButton &&
                                            window.scratchConfig.menuBar
                                                .turboModeButton.show && (
                                                <MenuSection>
                                                    <MenuItem
                                                        className={
                                                            styles.bgWhite
                                                        }
                                                        onMouseEnter={() => {
                                                            this.setState({
                                                                chooseLanguageVisible: true,
                                                            });
                                                        }}
                                                        onMouseLeave={() => {
                                                            this.setState({
                                                                chooseLanguageVisible: false,
                                                            });
                                                        }}
                                                        onClick={() => {
                                                            this.setState({
                                                                chooseLanguageVisible: true,
                                                            });
                                                        }}
                                                    >
                                                        {this.props.intl.formatMessage(
                                                            ariaMessages.chooseLanguage
                                                        )}
                                                    </MenuItem>
                                                    {this.state
                                                        .chooseLanguageVisible ? (
                                                        <LanguageSelectors
                                                            onChange={() => {
                                                                this.setState({
                                                                    chooseLanguageVisible: false,
                                                                });
                                                                this.props.onRequestCloseSet();
                                                            }}
                                                            onMouseEnter={() => {
                                                                this.setState({
                                                                    chooseLanguageVisible: true,
                                                                });
                                                            }}
                                                        />
                                                    ) : null}
                                                    <MenuItem>
                                                        <div>
                                                            <div>
                                                                {this.props.intl.formatMessage(
                                                                    ariaMessages.themeColor
                                                                )}
                                                            </div>
                                                            <span>
                                                                <div
                                                                    className={classNames(
                                                                        styles.skinTag,
                                                                        styles.skinTag0,
                                                                        this
                                                                            .state
                                                                            .skinIndex ==
                                                                            0
                                                                            ? "skinactive"
                                                                            : ""
                                                                    )}
                                                                    onClick={this.toggleSkin.bind(
                                                                        this,
                                                                        0
                                                                    )}
                                                                ></div>
                                                                <div
                                                                    className={classNames(
                                                                        styles.skinTag,
                                                                        styles.skinTag1,
                                                                        this
                                                                            .state
                                                                            .skinIndex ==
                                                                            1
                                                                            ? "skinactive"
                                                                            : ""
                                                                    )}
                                                                    onClick={this.toggleSkin.bind(
                                                                        this,
                                                                        1
                                                                    )}
                                                                ></div>
                                                                <div
                                                                    className={classNames(
                                                                        styles.skinTag,
                                                                        styles.skinTag2,
                                                                        this
                                                                            .state
                                                                            .skinIndex ==
                                                                            2
                                                                            ? "skinactive"
                                                                            : ""
                                                                    )}
                                                                    onClick={this.toggleSkin.bind(
                                                                        this,
                                                                        2
                                                                    )}
                                                                ></div>
                                                            </span>
                                                        </div>
                                                    </MenuItem>
                                                </MenuSection>
                                            )}
                                    </MenuBarMenu>
                                </div>
                            </div>
                            {/*中间部分的小狮子 */}
                            {/* <Divider className={classNames(styles.divider)} />

                            {window.scratchConfig &&
                                window.scratchConfig.menuBar &&
                                window.scratchConfig.menuBar.helpButton &&
                                window.scratchConfig.menuBar.helpButton
                                    .show && (
                                    <Tooltip title="帮助">
                                        <div
                                            aria-label={this.props.intl.formatMessage(
                                                ariaMessages.tutorials
                                            )}
                                            className={classNames(
                                                styles.menuBarItem,
                                                styles.hoverable
                                            )}
                                            onClick={
                                                this.props.onOpenTipLibrary
                                            }
                                        >
                                            <div>
                                                <IconHelp
                                                    className={
                                                        styles.folderColor
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </Tooltip>
                                )} */}
                            {/* <Divider className={classNames(styles.divider)} /> */}

                            {/* 这里就是头部输入框 */}

                            {this.props.canEditTitle ? (
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.growable
                                    )}
                                >
                                    <MenuBarItemTooltip enable id="title-field">
                                        <ProjectTitleInput
                                            className={classNames(
                                                styles.titleFieldGrowable
                                            )}
                                        />
                                    </MenuBarItemTooltip>
                                </div>
                            ) : this.props.authorUsername &&
                              this.props.authorUsername !==
                                  this.props.username ? (
                                <AuthorInfo
                                    className={styles.authorInfo}
                                    imageUrl={this.props.authorThumbnailUrl}
                                    projectTitle={this.props.projectTitle}
                                    userId={this.props.authorId}
                                    username={this.props.authorUsername}
                                />
                            ) : null}
                            <div className={classNames(styles.menuBarItem)}>
                                {window.scratchConfig &&
                                    window.scratchConfig.shareButton &&
                                    window.scratchConfig.shareButton.show && (
                                        <ProjectWatcher
                                            onDoneUpdating={
                                                this.props.onSeeCommunity
                                            }
                                        >
                                            {(waitForUpdate) => (
                                                <ShareButton
                                                    className={
                                                        styles.menuBarButton
                                                    }
                                                    isShared={
                                                        this.props.isShared
                                                    }
                                                    /* eslint-disable react/jsx-no-bind */
                                                    onClick={() => {
                                                        window.scratchConfig.shareButton.handleClick();
                                                        // this.handleClickShare(waitForUpdate);
                                                    }}
                                                    buttonName={
                                                        window.scratchConfig
                                                            .shareButton
                                                            .buttonName
                                                    }
                                                    /* eslint-enable react/jsx-no-bind */
                                                />
                                            )}
                                        </ProjectWatcher>
                                    )}
                                {this.props.canRemix ? remixButton : []}
                            </div>

                            <div className={classNames(styles.menuBarItem)}>
                                {window.scratchConfig &&
                                    window.scratchConfig.profileButton &&
                                    window.scratchConfig.profileButton.show && (
                                        <CustomButton
                                            className={styles.menuBarButton}
                                            onClick={() => {
                                                window.scratchConfig.profileButton.handleClick();
                                            }}
                                            buttonName={
                                                window.scratchConfig
                                                    .profileButton.buttonName
                                            }
                                        />
                                    )}
                                {window.scratchConfig &&
                                    window.scratchConfig.menuBar &&
                                    window.scratchConfig.menuBar
                                        .customButtons &&
                                    window.scratchConfig.menuBar.customButtons
                                        .length > 0 &&
                                    window.scratchConfig.menuBar.customButtons.map(
                                        (item) => {
                                            if (item.show) {
                                                return (
                                                    <CustomButton
                                                        key={item.buttonName}
                                                        className={
                                                            styles.menuBarButton
                                                        }
                                                        style={item.style || {}}
                                                        onClick={
                                                            item.handleClick
                                                        }
                                                        buttonName={
                                                            item.buttonName
                                                        }
                                                    />
                                                );
                                            } else {
                                                return "";
                                            }
                                        }
                                    )}
                            </div>

                            <div
                                className={classNames(
                                    styles.menuBarItem,
                                    styles.communityButtonWrapper
                                )}
                            >
                                {this.props.enableCommunity ? (
                                    (this.props.isShowingProject ||
                                        this.props.isUpdating) && (
                                        <ProjectWatcher
                                            onDoneUpdating={
                                                this.props.onSeeCommunity
                                            }
                                        >
                                            {(waitForUpdate) => (
                                                <CommunityButton
                                                    className={
                                                        styles.menuBarButton
                                                    }
                                                    onClick={() => {
                                                        this.handleClickSeeCommunity(
                                                            waitForUpdate
                                                        );
                                                    }}
                                                />
                                            )}
                                        </ProjectWatcher>
                                    )
                                ) : this.props.showComingSoon ? (
                                    <MenuBarItemTooltip id="community-button">
                                        <CommunityButton
                                            className={styles.menuBarButton}
                                        />
                                    </MenuBarItemTooltip>
                                ) : (
                                    []
                                )}
                            </div>
                        </div>
                        {/* <div className={styles.testBtn}>
                            <div onClick={this.trytotoggle.bind(this)}>trytotoggle</div>
                            <div onClick={this.saveClickNew.bind(this)}>store</div>
                            <div onClick={this.load.bind(this)}>load</div>
                        </div> */}

                        {/* 我的物品 */}
                        {
                            <div className={styles.accountInfoGroup}>
                                <div className={styles.menuBarItem}>
                                    {this.props.canSave && <SaveStatus />}
                                </div>
                                {
                                    // ************ user is logged in ************
                                    <React.Fragment>
                                        {window.scratchConfig &&
                                            window.scratchConfig.menuBar &&
                                            window.scratchConfig.menuBar.myStuff
                                                .show && (
                                                <Menutop
                                                    onSaveToJsonClick={this.handleSaveToJsonClick.bind(
                                                        this
                                                    )}
                                                    onSaveChange={this.checkouNewClick.bind(
                                                        this
                                                    )}
                                                    // onSaveChange={this.saveClickNew.bind(
                                                    //     this
                                                    // )}
                                                    loading={this.state.loading}
                                                ></Menutop>
                                                // <a href={window.scratchConfig.menuBar.myStuff.url} target="_blank">
                                                //     <div
                                                //         className={classNames(
                                                //             styles.menuBarItem,
                                                //             styles.hoverable,
                                                //             styles.mystuffButton
                                                //         )}
                                                //     >
                                                //         <img
                                                //             className={styles.mystuffIcon}
                                                //             src={mystuffIcon}
                                                //         />
                                                //     </div>
                                                // </a>
                                            )}
                                        {window.scratchConfig &&
                                            window.scratchConfig.menuBar &&
                                            window.scratchConfig.menuBar
                                                .userAvatar.show && (
                                                <div>
                                                    <ButtonM
                                                        onClick={this.checkouUseClock.bind()}
                                                    >
                                                        {newuseName &&
                                                        newuseName !== ""
                                                            ? newuseName
                                                            : this.props
                                                                  .username}
                                                    </ButtonM>
                                                </div>
                                                // <AccountNav
                                                //     className={classNames(
                                                //         styles.menuBarItem,
                                                //         styles.hoverable,
                                                //         {[styles.active]: this.props.accountMenuOpen}
                                                //     )}
                                                //     thumbnailUrl={this.props.avatar}
                                                //     username={this.props.username}
                                                //     isOpen={this.props.accountMenuOpen}
                                                //     isRtl={this.props.isRtl}
                                                //     menuBarMenuClassName={classNames(styles.menuBarMenu)}
                                                //     onClick={this.props.onAvatarClick}
                                                //     onClose={this.props.onRequestCloseAccount}
                                                //     onLogOut={this.props.onLogOut}
                                                // />
                                            )}
                                    </React.Fragment>
                                }
                            </div>
                        }
                    </Box>
                )}
                {/* 提交 */}
                {typeKey === 1 && (
                    <Box
                        className={classNames(
                            this.props.className,
                            styles.menuBar
                        )}
                        style={
                            window.scratchConfig &&
                            window.scratchConfig.menuBar &&
                            window.scratchConfig.menuBar.style
                        }
                    >
                        <div className={styles.mainMenu}>
                            <div className={styles.fileGroup}>
                                {window.scratchConfig.logo &&
                                    window.scratchConfig.logo.show && (
                                        <div
                                            className={classNames(
                                                styles.menuBarItem
                                            )}
                                        >
                                            <img
                                                alt="Scratch"
                                                className={classNames(
                                                    styles.scratchLogo,
                                                    {
                                                        [styles.clickable]:
                                                            typeof this.props
                                                                .onClickLogo !==
                                                            "undefined",
                                                    }
                                                )}
                                                draggable={false}
                                                src={
                                                    window.scratchConfig.logo
                                                        .url || this.props.logo
                                                }
                                                onClick={
                                                    window.scratchConfig.logo
                                                        .handleClickLogo
                                                }
                                            />
                                        </div>
                                    )}

                                {/* 打开背包&&加速模式 */}
                                <Tooltip title="素材背包">
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            {
                                                [styles.active]:
                                                    this.props.editMenuOpen,
                                            }
                                        )}
                                        onMouseUp={this.props.onBackpackClick}
                                    >
                                        <div
                                            className={classNames(
                                                styles.editMenu
                                            )}
                                        >
                                            {/* <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                /> */}
                                            {/* <img     className={styles.languageIcon}
                                    src={sarchThree}/> */}
                                            <div>
                                                <IconBag
                                                    className={styles.bagColor}
                                                    width={24}
                                                />
                                            </div>
                                        </div>
                                        <MenuBarMenu
                                            className={classNames(
                                                styles.menuBarMenu
                                            )}
                                            open={this.props.editMenuOpen}
                                            place={
                                                this.props.isRtl
                                                    ? "left"
                                                    : "right"
                                            }
                                            onRequestClose={
                                                this.props.onRequestCloseEdit
                                            }
                                        >
                                            <DeletionRestorer>
                                                {(
                                                    handleRestore,
                                                    { restorable, deletedItem }
                                                ) => (
                                                    <MenuItem
                                                        className={classNames({
                                                            [styles.disabled]:
                                                                !restorable,
                                                        })}
                                                        onClick={this.handleRestoreOption(
                                                            handleRestore
                                                        )}
                                                    >
                                                        {this.restoreOptionMessage(
                                                            deletedItem
                                                        )}
                                                    </MenuItem>
                                                )}
                                            </DeletionRestorer>
                                            {window.scratchConfig &&
                                                window.scratchConfig.menuBar &&
                                                window.scratchConfig.menuBar
                                                    .turboModeButton &&
                                                window.scratchConfig.menuBar
                                                    .turboModeButton.show && (
                                                    <MenuSection>
                                                        <TurboMode>
                                                            {(
                                                                toggleTurboMode,
                                                                { turboMode }
                                                            ) => (
                                                                <MenuItem
                                                                    onClick={
                                                                        toggleTurboMode
                                                                    }
                                                                >
                                                                    {turboMode ? (
                                                                        <FormattedMessage
                                                                            defaultMessage="Turn off Turbo Mode"
                                                                            description="Menu bar item for turning off turbo mode"
                                                                            id="gui.menuBar.turboModeOff"
                                                                        />
                                                                    ) : (
                                                                        <FormattedMessage
                                                                            defaultMessage="Turn on Turbo Mode"
                                                                            description="Menu bar item for turning on turbo mode"
                                                                            id="gui.menuBar.turboModeOn"
                                                                        />
                                                                    )}
                                                                </MenuItem>
                                                            )}
                                                        </TurboMode>
                                                    </MenuSection>
                                                )}
                                        </MenuBarMenu>
                                    </div>
                                </Tooltip>
                            </div>
                            {/*中间部分的小狮子 */}
                            {/* <Divider className={classNames(styles.divider)} /> */}

                            {/* {(window.scratchConfig && window.scratchConfig.menuBar && window.scratchConfig.menuBar.helpButton && 
                        window.scratchConfig.menuBar.helpButton.show) && (
                         <Tooltip title="帮助">   
                        <div
                            aria-label={this.props.intl.formatMessage(ariaMessages.tutorials)}
                            className={classNames(styles.menuBarItem, styles.hoverable)}
                            onClick={this.props.onOpenTipLibrary}
                        >
                            <img
                                className={styles.helpIcon}
                                src={helpIcon}
                            />
                              <div><IconHelp className={styles.folderColor}/></div>
                            <FormattedMessage {...ariaMessages.tutorials} />
                            </div>
                               </Tooltip >   
                    )} */}
                            {/* <Divider className={classNames(styles.divider)} /> */}

                            {/* 这里就是头部输入框 */}

                            {this.props.canEditTitle ? (
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.growable
                                    )}
                                >
                                    <MenuBarItemTooltip enable id="title-field">
                                        <ProjectTitleInput
                                            className={classNames(
                                                styles.titleFieldGrowable
                                            )}
                                        />
                                    </MenuBarItemTooltip>
                                </div>
                            ) : this.props.authorUsername &&
                              this.props.authorUsername !==
                                  this.props.username ? (
                                <AuthorInfo
                                    className={styles.authorInfo}
                                    imageUrl={this.props.authorThumbnailUrl}
                                    projectTitle={this.props.projectTitle}
                                    userId={this.props.authorId}
                                    username={this.props.authorUsername}
                                />
                            ) : null}
                            <div className={classNames(styles.menuBarItem)}>
                                {window.scratchConfig &&
                                    window.scratchConfig.shareButton &&
                                    window.scratchConfig.shareButton.show && (
                                        <ProjectWatcher
                                            onDoneUpdating={
                                                this.props.onSeeCommunity
                                            }
                                        >
                                            {(waitForUpdate) => (
                                                <ShareButton
                                                    className={
                                                        styles.menuBarButton
                                                    }
                                                    isShared={
                                                        this.props.isShared
                                                    }
                                                    /* eslint-disable react/jsx-no-bind */
                                                    onClick={() => {
                                                        window.scratchConfig.shareButton.handleClick();
                                                        // this.handleClickShare(waitForUpdate);
                                                    }}
                                                    buttonName={
                                                        window.scratchConfig
                                                            .shareButton
                                                            .buttonName
                                                    }
                                                    /* eslint-enable react/jsx-no-bind */
                                                />
                                            )}
                                        </ProjectWatcher>
                                    )}
                                {this.props.canRemix ? remixButton : []}
                            </div>

                            {/* <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.communityButtonWrapper
                                    )}
                                >
                                    {this.props.enableCommunity ? (
                                        (this.props.isShowingProject ||
                                            this.props.isUpdating) && (
                                            <ProjectWatcher
                                                onDoneUpdating={this.props.onSeeCommunity}
                                            >
                                                {(waitForUpdate) => (
                                                    <CommunityButton
                                                        className={styles.menuBarButton}
                                                        onClick={() => {
                                                            this.handleClickSeeCommunity(
                                                                waitForUpdate
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </ProjectWatcher>
                                        )
                                    ) : this.props.showComingSoon ? (
                                        <MenuBarItemTooltip id="community-button">
                                            <CommunityButton
                                                className={styles.menuBarButton}
                                            />
                                        </MenuBarItemTooltip>
                                    ) : (
                                        []
                                    )}
                                </div> */}
                        </div>
                        {/* 分解 */}

                        {/*  */}
                        <div className={styles.Gomuntop}>
                            <Button
                                className={classNames(
                                    styles.menuBarButton,
                                    styles.remixButton
                                )}
                                iconClassName={styles.remixButtonIcon}
                                iconSrc={remixIcon}
                                onClick={this.handleNewSubmit.bind()}
                            >
                                提交
                            </Button>
                        </div>
                    </Box>
                )}
                {/* 查看 */}
                {typeKey === 2 && (
                    <Box
                        className={classNames(
                            this.props.className,
                            styles.menuBar
                        )}
                        style={
                            window.scratchConfig &&
                            window.scratchConfig.menuBar &&
                            window.scratchConfig.menuBar.style
                        }
                    >
                        <div className={styles.mainMenu}>
                            <div className={styles.fileGroup}>
                                {window.scratchConfig.logo &&
                                    window.scratchConfig.logo.show && (
                                        <div
                                            className={classNames(
                                                styles.menuBarItem
                                            )}
                                        >
                                            <img
                                                alt="Scratch"
                                                className={classNames(
                                                    styles.scratchLogo,
                                                    {
                                                        [styles.clickable]:
                                                            typeof this.props
                                                                .onClickLogo !==
                                                            "undefined",
                                                    }
                                                )}
                                                draggable={false}
                                                src={
                                                    window.scratchConfig.logo
                                                        .url || this.props.logo
                                                }
                                                onClick={
                                                    window.scratchConfig.logo
                                                        .handleClickLogo
                                                }
                                            />
                                        </div>
                                    )}

                                {/* 打开背包&&加速模式 */}
                                <Tooltip title="素材背包">
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            {
                                                [styles.active]:
                                                    this.props.editMenuOpen,
                                            }
                                        )}
                                        onMouseUp={this.props.onBackpackClick}
                                    >
                                        <div
                                            className={classNames(
                                                styles.editMenu
                                            )}
                                        >
                                            {/* <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                /> */}
                                            {/* <img     className={styles.languageIcon}
                                    src={sarchThree}/> */}
                                            <div>
                                                <IconBag
                                                    className={styles.bagColor}
                                                    width={24}
                                                />
                                            </div>
                                        </div>
                                        <MenuBarMenu
                                            className={classNames(
                                                styles.menuBarMenu
                                            )}
                                            open={this.props.editMenuOpen}
                                            place={
                                                this.props.isRtl
                                                    ? "left"
                                                    : "right"
                                            }
                                            onRequestClose={
                                                this.props.onRequestCloseEdit
                                            }
                                        >
                                            <DeletionRestorer>
                                                {(
                                                    handleRestore,
                                                    { restorable, deletedItem }
                                                ) => (
                                                    <MenuItem
                                                        className={classNames({
                                                            [styles.disabled]:
                                                                !restorable,
                                                        })}
                                                        onClick={this.handleRestoreOption(
                                                            handleRestore
                                                        )}
                                                    >
                                                        {this.restoreOptionMessage(
                                                            deletedItem
                                                        )}
                                                    </MenuItem>
                                                )}
                                            </DeletionRestorer>
                                            {window.scratchConfig &&
                                                window.scratchConfig.menuBar &&
                                                window.scratchConfig.menuBar
                                                    .turboModeButton &&
                                                window.scratchConfig.menuBar
                                                    .turboModeButton.show && (
                                                    <MenuSection>
                                                        <TurboMode>
                                                            {(
                                                                toggleTurboMode,
                                                                { turboMode }
                                                            ) => (
                                                                <MenuItem
                                                                    onClick={
                                                                        toggleTurboMode
                                                                    }
                                                                >
                                                                    {turboMode ? (
                                                                        <FormattedMessage
                                                                            defaultMessage="Turn off Turbo Mode"
                                                                            description="Menu bar item for turning off turbo mode"
                                                                            id="gui.menuBar.turboModeOff"
                                                                        />
                                                                    ) : (
                                                                        <FormattedMessage
                                                                            defaultMessage="Turn on Turbo Mode"
                                                                            description="Menu bar item for turning on turbo mode"
                                                                            id="gui.menuBar.turboModeOn"
                                                                        />
                                                                    )}
                                                                </MenuItem>
                                                            )}
                                                        </TurboMode>
                                                    </MenuSection>
                                                )}
                                        </MenuBarMenu>
                                    </div>
                                </Tooltip>
                            </div>
                            {/*中间部分的小狮子 */}
                            {/* <Divider className={classNames(styles.divider)} />

                            {window.scratchConfig &&
                                window.scratchConfig.menuBar &&
                                window.scratchConfig.menuBar.helpButton &&
                                window.scratchConfig.menuBar.helpButton
                                    .show && (
                                    <Tooltip title="帮助">
                                        <div
                                            aria-label={this.props.intl.formatMessage(
                                                ariaMessages.tutorials
                                            )}
                                            className={classNames(
                                                styles.menuBarItem,
                                                styles.hoverable
                                            )}
                                            onClick={
                                                this.props.onOpenTipLibrary
                                            }
                                        >
                                            <img
                                                className={styles.helpIcon}
                                                src={helpIcon}
                                            />
                                            <div>
                                                <IconHelp
                                                    className={
                                                        styles.folderColor
                                                    }
                                                />
                                            </div>
                                            <FormattedMessage
                                                {...ariaMessages.tutorials}
                                            />
                                        </div>
                                    </Tooltip>
                                )} */}
                            {/* <Divider className={classNames(styles.divider)} /> */}

                            {/* 这里就是头部输入框 */}

                            {this.props.canEditTitle ? (
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.growable
                                    )}
                                >
                                    <MenuBarItemTooltip enable id="title-field">
                                        <ProjectTitleInput
                                            className={classNames(
                                                styles.titleFieldGrowable
                                            )}
                                        />
                                    </MenuBarItemTooltip>
                                </div>
                            ) : this.props.authorUsername &&
                              this.props.authorUsername !==
                                  this.props.username ? (
                                <AuthorInfo
                                    className={styles.authorInfo}
                                    imageUrl={this.props.authorThumbnailUrl}
                                    projectTitle={this.props.projectTitle}
                                    userId={this.props.authorId}
                                    username={this.props.authorUsername}
                                />
                            ) : null}
                            <div className={classNames(styles.menuBarItem)}>
                                {window.scratchConfig &&
                                    window.scratchConfig.shareButton &&
                                    window.scratchConfig.shareButton.show && (
                                        <ProjectWatcher
                                            onDoneUpdating={
                                                this.props.onSeeCommunity
                                            }
                                        >
                                            {(waitForUpdate) => (
                                                <ShareButton
                                                    className={
                                                        styles.menuBarButton
                                                    }
                                                    isShared={
                                                        this.props.isShared
                                                    }
                                                    /* eslint-disable react/jsx-no-bind */
                                                    onClick={() => {
                                                        window.scratchConfig.shareButton.handleClick();
                                                        // this.handleClickShare(waitForUpdate);
                                                    }}
                                                    buttonName={
                                                        window.scratchConfig
                                                            .shareButton
                                                            .buttonName
                                                    }
                                                    /* eslint-enable react/jsx-no-bind */
                                                />
                                            )}
                                        </ProjectWatcher>
                                    )}
                                {this.props.canRemix ? remixButton : []}
                            </div>

                            {/* <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.communityButtonWrapper
                                    )}
                                >
                                    {this.props.enableCommunity ? (
                                        (this.props.isShowingProject ||
                                            this.props.isUpdating) && (
                                            <ProjectWatcher
                                                onDoneUpdating={this.props.onSeeCommunity}
                                            >
                                                {(waitForUpdate) => (
                                                    <CommunityButton
                                                        className={styles.menuBarButton}
                                                        onClick={() => {
                                                            this.handleClickSeeCommunity(
                                                                waitForUpdate
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </ProjectWatcher>
                                        )
                                    ) : this.props.showComingSoon ? (
                                        <MenuBarItemTooltip id="community-button">
                                            <CommunityButton
                                                className={styles.menuBarButton}
                                            />
                                        </MenuBarItemTooltip>
                                    ) : (
                                        []
                                    )}
                                </div> */}
                        </div>
                        {/* <div className={styles.Gomuntop}>
                                <Button
                                    className={classNames(styles.menuBarButton, styles.remixButton)}
                                    iconClassName={styles.remixButtonIcon}
                                    iconSrc={remixIcon}
                                    onClick={this.handleNewSubmit.bind()}
                                >
                                    提交
                                </Button>
                            </div> */}
                    </Box>
                )}
                {/* 评价 */}
                {typeKey === 3 && (
                    <Box
                        className={classNames(
                            this.props.className,
                            styles.menuBar
                        )}
                        style={
                            window.scratchConfig &&
                            window.scratchConfig.menuBar &&
                            window.scratchConfig.menuBar.style
                        }
                    >
                        <div className={styles.mainMenu}>
                            <div className={styles.fileGroup}>
                                {window.scratchConfig.logo &&
                                    window.scratchConfig.logo.show && (
                                        <div
                                            className={classNames(
                                                styles.menuBarItem
                                            )}
                                        >
                                            <img
                                                alt="Scratch"
                                                className={classNames(
                                                    styles.scratchLogo,
                                                    {
                                                        [styles.clickable]:
                                                            typeof this.props
                                                                .onClickLogo !==
                                                            "undefined",
                                                    }
                                                )}
                                                draggable={false}
                                                src={
                                                    window.scratchConfig.logo
                                                        .url || this.props.logo
                                                }
                                                onClick={
                                                    window.scratchConfig.logo
                                                        .handleClickLogo
                                                }
                                            />
                                        </div>
                                    )}

                                {/* 打开背包&&加速模式 */}
                                <Tooltip title="素材背包">
                                    <div
                                        className={classNames(
                                            styles.menuBarItem,
                                            styles.hoverable,
                                            {
                                                [styles.active]:
                                                    this.props.editMenuOpen,
                                            }
                                        )}
                                        onMouseUp={this.props.onBackpackClick}
                                    >
                                        <div
                                            className={classNames(
                                                styles.editMenu
                                            )}
                                        >
                                            {/* <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                /> */}
                                            {/* <img     className={styles.languageIcon}
                                    src={sarchThree}/> */}
                                            <div>
                                                <IconBag
                                                    className={styles.bagColor}
                                                    width={24}
                                                />
                                            </div>
                                        </div>
                                        <MenuBarMenu
                                            className={classNames(
                                                styles.menuBarMenu
                                            )}
                                            open={this.props.editMenuOpen}
                                            place={
                                                this.props.isRtl
                                                    ? "left"
                                                    : "right"
                                            }
                                            onRequestClose={
                                                this.props.onRequestCloseEdit
                                            }
                                        >
                                            <DeletionRestorer>
                                                {(
                                                    handleRestore,
                                                    { restorable, deletedItem }
                                                ) => (
                                                    <MenuItem
                                                        className={classNames({
                                                            [styles.disabled]:
                                                                !restorable,
                                                        })}
                                                        onClick={this.handleRestoreOption(
                                                            handleRestore
                                                        )}
                                                    >
                                                        {this.restoreOptionMessage(
                                                            deletedItem
                                                        )}
                                                    </MenuItem>
                                                )}
                                            </DeletionRestorer>
                                            {window.scratchConfig &&
                                                window.scratchConfig.menuBar &&
                                                window.scratchConfig.menuBar
                                                    .turboModeButton &&
                                                window.scratchConfig.menuBar
                                                    .turboModeButton.show && (
                                                    <MenuSection>
                                                        <TurboMode>
                                                            {(
                                                                toggleTurboMode,
                                                                { turboMode }
                                                            ) => (
                                                                <MenuItem
                                                                    onClick={
                                                                        toggleTurboMode
                                                                    }
                                                                >
                                                                    {turboMode ? (
                                                                        <FormattedMessage
                                                                            defaultMessage="Turn off Turbo Mode"
                                                                            description="Menu bar item for turning off turbo mode"
                                                                            id="gui.menuBar.turboModeOff"
                                                                        />
                                                                    ) : (
                                                                        <FormattedMessage
                                                                            defaultMessage="Turn on Turbo Mode"
                                                                            description="Menu bar item for turning on turbo mode"
                                                                            id="gui.menuBar.turboModeOn"
                                                                        />
                                                                    )}
                                                                </MenuItem>
                                                            )}
                                                        </TurboMode>
                                                    </MenuSection>
                                                )}
                                        </MenuBarMenu>
                                    </div>
                                </Tooltip>
                            </div>
                            {/*中间部分的小狮子 */}
                            {/* <Divider className={classNames(styles.divider)} /> */}

                            {/* {(window.scratchConfig && window.scratchConfig.menuBar && window.scratchConfig.menuBar.helpButton && 
                        window.scratchConfig.menuBar.helpButton.show) && (
                         <Tooltip title="帮助">   
                        <div
                            aria-label={this.props.intl.formatMessage(ariaMessages.tutorials)}
                            className={classNames(styles.menuBarItem, styles.hoverable)}
                            onClick={this.props.onOpenTipLibrary}
                        >
                            <img
                                className={styles.helpIcon}
                                src={helpIcon}
                            />
                              <div><IconHelp className={styles.folderColor}/></div>
                            <FormattedMessage {...ariaMessages.tutorials} />
                            </div>
                               </Tooltip >   
                    )} */}
                            {/* <Divider className={classNames(styles.divider)} /> */}

                            {/* 这里就是头部输入框 */}

                            {this.props.canEditTitle ? (
                                <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.growable
                                    )}
                                >
                                    <MenuBarItemTooltip enable id="title-field">
                                        <ProjectTitleInput
                                            className={classNames(
                                                styles.titleFieldGrowable
                                            )}
                                        />
                                    </MenuBarItemTooltip>
                                </div>
                            ) : this.props.authorUsername &&
                              this.props.authorUsername !==
                                  this.props.username ? (
                                <AuthorInfo
                                    className={styles.authorInfo}
                                    imageUrl={this.props.authorThumbnailUrl}
                                    projectTitle={this.props.projectTitle}
                                    userId={this.props.authorId}
                                    username={this.props.authorUsername}
                                />
                            ) : null}
                            <div className={classNames(styles.menuBarItem)}>
                                {window.scratchConfig &&
                                    window.scratchConfig.shareButton &&
                                    window.scratchConfig.shareButton.show && (
                                        <ProjectWatcher
                                            onDoneUpdating={
                                                this.props.onSeeCommunity
                                            }
                                        >
                                            {(waitForUpdate) => (
                                                <ShareButton
                                                    className={
                                                        styles.menuBarButton
                                                    }
                                                    isShared={
                                                        this.props.isShared
                                                    }
                                                    /* eslint-disable react/jsx-no-bind */
                                                    onClick={() => {
                                                        window.scratchConfig.shareButton.handleClick();
                                                        // this.handleClickShare(waitForUpdate);
                                                    }}
                                                    buttonName={
                                                        window.scratchConfig
                                                            .shareButton
                                                            .buttonName
                                                    }
                                                    /* eslint-enable react/jsx-no-bind */
                                                />
                                            )}
                                        </ProjectWatcher>
                                    )}
                                {this.props.canRemix ? remixButton : []}
                            </div>

                            {/* <div
                                    className={classNames(
                                        styles.menuBarItem,
                                        styles.communityButtonWrapper
                                    )}
                                >
                                    {this.props.enableCommunity ? (
                                        (this.props.isShowingProject ||
                                            this.props.isUpdating) && (
                                            <ProjectWatcher
                                                onDoneUpdating={this.props.onSeeCommunity}
                                            >
                                                {(waitForUpdate) => (
                                                    <CommunityButton
                                                        className={styles.menuBarButton}
                                                        onClick={() => {
                                                            this.handleClickSeeCommunity(
                                                                waitForUpdate
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </ProjectWatcher>
                                        )
                                    ) : this.props.showComingSoon ? (
                                        <MenuBarItemTooltip id="community-button">
                                            <CommunityButton
                                                className={styles.menuBarButton}
                                            />
                                        </MenuBarItemTooltip>
                                    ) : (
                                        []
                                    )}
                                </div> */}
                        </div>
                        <div className={styles.Gomuntop}>
                            <Button
                                className={classNames(
                                    styles.menuBarButton,
                                    styles.remixButton
                                )}
                                iconClassName={styles.remixButtonIcon}
                                iconSrc={remixIcon}
                                onClick={this.handDigLog.bind()}
                            >
                                评价
                            </Button>
                        </div>
                    </Box>
                )}
            </>
        );
    }
}

MenuBar.defaultProps = {
    logo: scratchLogo,
    onShare: () => {},
};

//文件名方法
const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.sb3`;
};

const mapStateToProps = (state, ownProps) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user =
        state.session && state.session.session && state.session.session.user;

    return {
        aboutMenuOpen: aboutMenuOpen(state),
        accountMenuOpen: accountMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        settingMenuOpen: settingMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        languageMenuOpen: languageMenuOpen(state),
        locale: state.locales.locale,
        loginMenuOpen: loginMenuOpen(state),
        projectTitle: state.scratchGui.projectTitle,
        projectId: state.scratchGui.projectState.projectId,
        sessionExists:
            state.session && typeof state.session.session !== "undefined",
        username: window.scratchConfig.menuBar.userAvatar.username || "",
        avatar: window.scratchConfig.menuBar.userAvatar.avatar || null,
        onAvatarClick: window.scratchConfig.menuBar.userAvatar.handleClick,
        userOwnsProject:
            ownProps.authorUsername &&
            user &&
            ownProps.authorUsername === user.username,
        vm: state.scratchGui.vm,
        saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(
            state.scratchGui.vm
        ),
        projectFilename: getProjectFilename(
            state.scratchGui.projectTitle,
            projectTitleInitialState
        ),
    };
};

const mapDispatchToProps = (dispatch) => ({
    openCards: () => {
        console.log("viewCards");
        dispatch(viewCards());
    },
    onSetProjectUnchanged: () => dispatch(setProjectUnchanged()),
    autoUpdateProject: () => dispatch(autoUpdateProject()),
    onOpenTipLibrary: () => {
        if (window.scratchConfig.menuBar.helpButton.handleBefore()) {
            dispatch(openTipsLibrary());
        }
    },
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => {
        console.log("should close tips");
        dispatch(openFileMenu());
    },
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickSet: () => {
        dispatch(openSettingMenu());
        console.log("onClickSet");
    },
    onCloseCards: () => {
        console.log("onCloseCards");
        dispatch(closeCards());
    },
    onRequestCloseSet: () => dispatch(closeSettingMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onRequestOpenAbout: () => dispatch(openAboutMenu()),
    onRequestCloseAbout: () => dispatch(closeAboutMenu()),
    onClickNew: (needSave) => dispatch(requestNewProject(needSave)),
    onClickRemix: () => dispatch(remixProject()),
    onClickSave: () => dispatch(manualUpdateProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(mapStateToProps, mapDispatchToProps)
)(MenuBar);
