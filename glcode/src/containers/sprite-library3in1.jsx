import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { injectIntl, intlShape, defineMessages } from "react-intl";
import VM from "scratch-vm";

import spriteLibraryContent from "../lib/libraries/sprites.json";
import randomizeSpritePosition from "../lib/randomize-sprite-position";
import spriteTags from "../lib/libraries/sprite-tags";
import { CreatAxios, api, tagsType } from "../utils/request";
// import LibraryComponent from '../components/library/library.jsx';
import LibrarysComponent3in1 from "../components/library3in1/library3in1.jsx";
import soundIcon from "../components/library-item/lib-icon--sound.svg";
import soundIconRtl from "../components/library-item/lib-icon--sound-rtl.svg";
import Snackbar from "@material-ui/core/Snackbar";
import {
    useSubscribe,
    usePublish,
    useUnsubscribe,
} from "../Pusconnect/usePubSub";
import {
    getTags,
    getMaterialTags,
    getMaterial,
    getRoleMaterial,
    getDataByType,
} from "../utils/api.js";
const messages = defineMessages({
    libraryTitle: {
        defaultMessage: "Choose a Sprite",
        description: "Heading for the sprite library",
        id: "gui.spriteLibrary.chooseASprite",
    },
});

class SpriteLibrary3in1 extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, ["handleItemSelect"]);
        this.state = {
            open: false,
            currentType: "spritedata", //'spritedata','backdropdata','sounddata'
            pageSize: "30",
            spriteCurrentPage: 1,
            backdropCurrentPage: 1,
            soundCurrentPage: 1,
            currentExpandedTagId: null,
            currentExpandedType: null,
            spriteTotal: null,
            backdropTotal: null,
            soundTotal: null,
            everAlert: {
                spritedata: false,
                backdropdata: false,
                sounddata: false,
            },
            data: {
                spritedata: [],
                backdropdata: [],
                sounddata: [],
            },
            tags: {
                spritetags: [],
                backdroptags: [],
                soundtags: [],
            },
            newTags: null,
            datas: null,
            selectedTag: null,
            initId: null,
            initType: null,
        };
    }
    componentDidMount() {
        var that = this;
        var lang = document.documentElement.lang
            ? document.documentElement.lang
            : "zh-cn";
        console.log("newTagsinit");
        getMaterialTags().then((result) => {
            console.log("getresult", result);
            that.setState({
                newTags: result.data,
            });
            console.log("getmydata", that.state.newTags);

            const ctype = that.state.newTags[0].type;
            console.log("ctype", ctype);
            that.getMaterialByTagId(that.state.newTags[0].id, ctype, "87");
            that.setState({
                selectedTag: that.state.newTags[0].tag,
                initId: that.state.newTags[0].id,
                initType: ctype,
            });
            if ("41,42,43".includes(ctype)) {
                // that.setCurrentType("spritedata");
                that.setState({
                    currentType: "spritedata",
                });
            } else if ("44,45".includes(ctype)) {
                // that.setCurrentType("sounddata");
                that.setState({
                    currentType: "sounddata",
                });
            } else {
                // that.setCurrentType("backdropdata");
                that.setState({
                    currentType: "backdropdata",
                });
            }
        });

        // this.getSpriteDataAndTags(lang);
        // this.getBackdropDataAndTags(lang);
        // this.getSoundDataAndTags(lang);
        // this.getSpriteMaterials(lang);
        // this.getBackdropMaterials(lang);
        // this.getSoundMaterials(lang);
    }
    getMaterialByTagId(id, type, line) {
        //先getMaterialTags拿到结果后再执行first。
        this.setState(
            {
                currentExpandedTagId: id,
                currentExpandedType: type,
            },
            () => {
                console.log("state回调", this.state.currentExpandedTagId);
                var lang = document.documentElement.lang
                    ? document.documentElement.lang
                    : "zh-cn";
                console.log(
                    "currentExpandedTagId",
                    this.state.currentExpandedTagId
                );
                console.log("41,42,43".includes(this.state.newTags[0].Type));
                if ("41,42,43".includes(type)) {
                    this.getSpriteDataAndTags(lang);
                } else if ("44,45".includes(type)) {
                    this.getSoundDataAndTags(lang);
                } else {
                    this.getBackdropDataAndTags(lang);
                }
            }
        );
    }
    onSelectTag = ({ id, type }) => {
        console.log("onSelectTag", id, type);
        if (id == "00") {
            this.getMaterialByTagId(
                this.state.initId,
                this.state.initType,
                "153"
            );
        } else {
            this.getMaterialByTagId(id, type, "153");
        }
    };
    nodataTip = () => {
        const publish = usePublish();
        publish("openMessage", {
            anchorOrigin: {
                vertical: "top",
                horizontal: "center",
            },
            open: true,
            message: "没有数据",
        });
    };
    getSpriteDataAndTags(lang) {
        console.log("getSpriteDataAndTags");
        let that = this;
        getRoleMaterial(
            {
                //type: tagsType.spritesType,
                type: this.state.currentExpandedType,
                id: this.state.currentExpandedTagId,
                currentPage: this.state.spriteCurrentPage,
                pageSize: this.state.pageSize,
            },
            false
        ).then((result) => {
            console.log("makeoutspriteresult", result);
            let tempData = Object.assign({}, this.state.data, {
                spritedata: result.data.data.records,
            });
            that.setState({
                data: tempData,
                spriteTotal: result.data.data.total,
            });
            if (result.data.data.records.length == 0) {
                that.nodataTip();
            }
            console.log("makeoutspritedata", this.state.data);
        });
    }

    getBackdropDataAndTags(lang) {
        console.log("getBackdropDataAndTags", this.state.currentExpandedType);
        let that = this;
        //这里异步加载背景库的标签和列表
        getMaterial(
            {
                //type: tagsType.backDropType,
                type: this.state.currentExpandedType,
                id: this.state.currentExpandedTagId,
                currentPage: this.state.backdropCurrentPage,
                pageSize: this.state.pageSize,
            },
            false
        ).then((result) => {
            console.log("makeoutdropresult", result);
            let tempData = Object.assign({}, this.state.data, {
                backdropdata: result.data.data.records,
            });
            that.setState({
                data: tempData,
                backdropTotal: result.data.data.total,
            });
            if (result.data.data.records.length == 0) {
                that.nodataTip();
            }
            console.log("makeoutdropdata", this.state.data);
        });
    }
    getSoundDataAndTags(lang) {
        console.log("getSoundDataAndTags");
        let that = this;
        //这里异步加载声音库的标签和列表
        getMaterial(
            {
                //type: tagsType.soundType
                type: this.state.currentExpandedType,
                id: this.state.currentExpandedTagId,
                currentPage: this.state.soundCurrentPage,
                pageSize: this.state.pageSize,
            },
            false
        ).then((result) => {
            console.log("makeoutsoundresult", result);
            if (result.data.data.records) {
                const mydata = result.data.data.records.map((sound) => {
                    const { md5ext, ...otherData } = sound;
                    return {
                        _md5: md5ext,
                        rawURL: this.props.isRtl ? soundIconRtl : soundIcon,
                        ...otherData,
                    };
                });
                let tempData = Object.assign({}, this.state.data, {
                    sounddata: mydata,
                });
                that.setState({
                    data: tempData,
                    soundTotal: result.data.data.total,
                });
                if (result.data.data.records.length == 0) {
                    that.nodataTip();
                }
                console.log("makeoutsounddata", this.state.data);
            }
        });
    }
    alertTipOnce = (type) => {
        if (!getDataByType(this.state, "everAlert", type)) {
            console.log("看看", this.state);
            let tempData = Object.assign({}, this.state.everAlert, {
                [type]: true,
            });
            this.setState({
                open: true,
                everAlert: tempData,
            });
            setTimeout(() => {
                console.log("3s后执行关闭");
                this.setState({
                    open: false,
                });
            }, 3000);
        }
    };
    onScrollToBottom = () => {
        console.log("someone滚到底了");
        var that = this;
        var lang = document.documentElement.lang
            ? document.documentElement.lang
            : "zh-cn";
        //判断currentType 'spritedata' 'backdropdata' 'sounddata'
        if (this.state.currentType === "spritedata") {
            //判断currentType已有的数量是否达到该类total，是alert 已经全部，否就request
            if (this.state.data.spritedata.length < this.state.spriteTotal) {
                //request
                console.log("发起sprite请求了");
                //request 将currentPage+1的值传入，成功回调后，将currentPage自增1，同时把currentPageData加入olddata的末尾
                getRoleMaterial(
                    {
                        type: tagsType.spritesType,
                        currentPage: Number(this.state.spriteCurrentPage + 1),
                        pageSize: this.state.pageSize,
                    },
                    false
                ).then((result) => {
                    let tempData = Object.assign({}, this.state.data, {
                        spritedata: this.state.data.spritedata.concat(
                            result.data.data.records
                        ),
                    });
                    that.setState({
                        data: tempData,
                    });
                });
            } else {
                console.log("素材已经全部加载完毕了哦"); //，alert逻辑需要在切换tab之前只显示一次，再次触底也不会alert了
                that.alertTipOnce("spritedata"); //
            }
        } else if (this.state.currentType === "backdropdata") {
            if (
                this.state.data.backdropdata.length < this.state.backdropTotal
            ) {
                //request
                console.log("发起backdrop请求了");
                getMaterial(
                    {
                        type: tagsType.backDropType,
                        currentPage: Number(this.state.backdropCurrentPage + 1),
                        pageSize: this.state.pageSize,
                    },
                    false
                ).then((result) => {
                    let tempData = Object.assign({}, this.state.data, {
                        backdropdata: this.state.data.backdropdata.concat(
                            result.data.data.records
                        ),
                    });
                    that.setState({
                        data: tempData,
                    });
                });
            } else {
                // alert("素材已经全部加载完毕了哦");
                that.alertTipOnce("backdropdata");
            }
        } else if (this.state.currentType === "sounddata") {
            if (this.state.data.sounddata.length < this.state.soundTotal) {
                //request
                console.log("发起sound请求了");
                getMaterial(
                    {
                        type: tagsType.soundType,
                        currentPage: Number(this.state.soundCurrentPage + 1),
                        pageSize: this.state.pageSize,
                    },
                    false
                ).then((result) => {
                    console.log("result", result);
                    if (result.data.data.records) {
                        const mydata = result.data.data.records.map((sound) => {
                            const { md5ext, ...otherData } = sound;
                            return {
                                _md5: md5ext,
                                rawURL: this.props.isRtl
                                    ? soundIconRtl
                                    : soundIcon,
                                ...otherData,
                            };
                        });
                        let tempData = Object.assign({}, this.state.data, {
                            sounddata: mydata,
                        });
                        that.setState({
                            data: tempData,
                            soundTotal: result.data.data.total,
                        });
                    }
                });
            } else {
                //   alert("素材已经全部加载完毕了哦");
                that.alertTipOnce("sounddata"); //
            }
        }
    };
    setCurrentType = (type) => {
        console.log("setCurrentType", type);
        if (this.state.currentType === type) {
            console.log("重复", this.state.currentType, type);
            let tempData = Object.assign({}, this.state.everAlert, {
                [type]: true,
            });
            this.setState({
                everAlert: tempData,
            });
        } else {
            console.log("非重复", this.state.currentType, type);
            this.setState({
                everAlert: {
                    spritedata: false,
                    backdropdata: false,
                    sounddata: false,
                },
            });
        }
        this.setState({
            currentType: type,
        });
    };
    handleItemSelect(item, type) {
        // Randomize position of library sprite

        console.log(item, type);
        console.log("addSprite");
        if (type == "backdropdata") {
            const vmBackdrop = {
                name: item.name,
                rotationCenterX: item.rotationCenterX,
                rotationCenterY: item.rotationCenterY,
                bitmapResolution: item.bitmapResolution,
                skinId: null,
            };

            // Do not switch to stage, just add the backdrop
            this.props.vm.addBackdrop(item.md5ext, vmBackdrop);
        } else if (type == "spritedata") {
            randomizeSpritePosition(item);
            this.props.vm.addSprite(JSON.stringify(item)).then(() => {
                this.props.onActivateBlocksTab();
            });
        } else if (type == "sounddata") {
            const vmSound = {
                format: item.format,
                md5: item._md5,
                rate: item.rate,
                sampleCount: item.sampleCount,
                name: item.name,
            };
            this.props.vm.addSound(vmSound).then(() => {
                this.props.onNewSound();
            });
        }
    }
    render() {
        return (
            <div>
                <LibrarysComponent3in1
                    data={this.state.data}
                    tags={this.state.tags}
                    tag={this.state.newTags}
                    currentExpandedTagId={this.state.currentExpandedTagId}
                    currentTypePro={this.state.currentType}
                    id="spriteLibrary3in1"
                    title={this.props.intl.formatMessage(messages.libraryTitle)}
                    onItemSelected={this.handleItemSelect}
                    setCurrentType={this.setCurrentType}
                    onScrollToBottom={this.onScrollToBottom}
                    onRequestClose={this.props.onRequestClose}
                    onSelectTag={this.onSelectTag}
                    selectedTag={this.state.selectedTag}
                />

                {this.state.open ? (
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        open={true}
                        onClose={() => {
                            console.log("close");
                        }}
                        message="素材已经全部加载完毕了哦~"
                        key={"topcenter"}
                    />
                ) : null}
            </div>
        );
    }
}

SpriteLibrary3in1.propTypes = {
    intl: intlShape.isRequired,
    onActivateBlocksTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(SpriteLibrary3in1);
