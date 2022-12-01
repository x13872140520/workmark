import bindAll from "lodash.bindall";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { intlShape, injectIntl } from "react-intl";

import {
    openSpriteLibrary,
    openSpriteLibrary3in1,
    closeSpriteLibrary,
    closeSpriteLibrary3in1,
    openCostumePaintModal,
    closeCostumePaintModal,
} from "../reducers/modals";
import {
    activateTab,
    COSTUMES_TAB_INDEX,
    BLOCKS_TAB_INDEX,
} from "../reducers/editor-tab";
import { setReceivedBlocks } from "../reducers/hovered-target";
import { showStandardAlert, closeAlertWithId } from "../reducers/alerts";
import { setRestore } from "../reducers/restore-deletion";
import DragConstants from "../lib/drag-constants";
import TargetPaneComponent from "../components/target-panes/target-panes.jsx";
import { BLOCKS_DEFAULT_SCALE } from "../lib/layout-constants";
// import spriteLibraryContent from '../lib/libraries/sprites.json';
import { handleFileUpload, spriteUpload } from "../lib/file-uploader.js";
import sharedMessages from "../lib/shared-messages";
import { emptySprite } from "../lib/empty-assets";
import { highlightTarget } from "../reducers/targets";
import { fetchSprite, fetchCode } from "../lib/backpack-api";
import randomizeSpritePosition from "../lib/randomize-sprite-position";
import downloadBlob from "../lib/download-blob";
import {
    sgFormatter,
    sgFormatterToArray,
    sgFormatterAddField,
} from "../lib/sprite-group";
import { updateTargets } from "../reducers/targets";
import DragRecognizer from "../lib/drag-recognizer";
import { updateAssetDrag } from "../reducers/asset-drag";
import { setHoveredSprite } from "../reducers/hovered-target";
import { CreatAxios, api, tagsType } from "../utils/request";
import windowListener from "react-tooltip/dist/decorators/windowListener";
import {
    useSubscribe,
    usePublish,
    useUnsubscribe,
} from "../Pusconnect/usePubSub";
import { getRoleMaterial } from "../utils/api.js";
let dragGroupIndex, dragPayload, timer;
class TargetPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // CostumeTabsVisible: false,
            dragType: null,
            addMenuVisible: false,
            selectedSoundIndex: 0,
            spriteLibraryContent: [],
            clickAwayDivWidth: "500px",
            isFromAddPaint: false,
        };
        bindAll(this, [
            "handleActivateBlocksTab",
            "handleBlockDragEnd",
            "handleChangeSpriteRotationStyle",
            "handleChangeSpriteDirection",
            "handleChangeSpriteName",
            "handleChangeSpriteSize",
            "handleChangeSpriteVisibility",
            "handleChangeSpriteX",
            "handleChangeSpriteY",
            "handleDeleteSprite",
            "handleDrop",
            "handleDuplicateSprite",
            "handleCreateGroupBySprite",
            "handleExportSprite",
            "handleNewSprite",
            "handleSelectSprite",
            "handleSurpriseSpriteClick",
            "handlePaintSpriteClick",
            "handleFileUploadClick",
            "handleSpriteUpload",
            "setFileInput",
            "setRef",
        ]);
        this.dragRecognizer = new DragRecognizer({
            onDrag: this.handleDrag,
            onDragEnd: this.handleDragEnd,
        });
    }
    componentDidMount() {
        console.log("引入targets.js,触发一次reducer");
        const unsubscribe = useUnsubscribe();
        var that = this;
        useSubscribe("setClickAwayDivWidth", (type, value) => {
            console.log("settingclickAwayDivWidth", value);
            that.setState({ clickAwayDivWidth: value });
        });
        window.addEventListener("resize", this.handleResize);
        this.props.vm.addListener("BLOCK_DRAG_END", this.handleBlockDragEnd);
        var that = this;
        console.log("1722");
        getRoleMaterial({
            type: tagsType.spritesType,
        }).then((result) => {
            that.setState({
                spriteLibraryContent: result.data.data.records,
            });
        });
    }
    componentWillUnmount() {
        this.props.vm.removeListener("BLOCK_DRAG_END", this.handleBlockDragEnd);
    }
    setRef(ref) {
        this.ref = ref;
    }
    handleResize() {
        console.log("handleResize");
        const publish = usePublish();
        publish(
            "setClickAwayDivWidth",
            document.getElementsByClassName("injectionDiv")[0].clientWidth +
                "px"
        );
    }
    handleToggleAddMenuVisible = (bool) => {
        console.log("handleToggleAddMenuVisible", bool);
        this.setState({
            addMenuVisible: bool,
        });
        console.log("state", this.state);
    };
    // handleChangeCostumeVisible = (e) => {
    //     this.setState({
    //         CostumeTabsVisible: e,
    //     });
    //     console.log("CostumeTabsVisibleafter", this.state.CostumeTabsVisible);
    // };
    handleChangeSpriteDirection(direction) {
        this.props.vm.postSpriteInfo({ direction });
    }
    handleChangeSpriteRotationStyle(rotationStyle) {
        this.props.vm.postSpriteInfo({ rotationStyle });
    }
    handleChangeSpriteName(name) {
        this.props.vm.renameSprite(this.props.editingTarget, name);
    }
    handleChangeSpriteSize(size) {
        this.props.vm.postSpriteInfo({ size });
    }
    handleChangeSpriteVisibility(visible) {
        console.log("handleChangeSpriteVisibility", visible);
        this.props.vm.postSpriteInfo({ visible });
    }
    handleChangeSpriteX(x) {
        this.props.vm.postSpriteInfo({ x });
    }
    handleChangeSpriteY(y) {
        this.props.vm.postSpriteInfo({ y });
    }
    //这里是关闭的
    handleDeleteSprite(id) {
        const restoreSprite = this.props.vm.deleteSprite(id);
        const restoreFun = () =>
            restoreSprite().then(this.handleActivateBlocksTab);

        this.props.dispatchUpdateRestore({
            restoreFun: restoreFun,
            deletedItem: "Sprite",
        });
    }
    handleDuplicateSprite(id) {
        this.props.vm.duplicateSprite(id);
    }
    handleCreateGroupBySprite(v) {
        //sgFormatter(v,this.props.sprites)
        // this.props.onTargetsUpdate({
        //     //targetList:sgFormatter(v,this.props.sprites),
        //     targetList:sgFormatterAddField(v,this.props.sprites),
        //     editingTarget:v
        // })
        console.log("handleCreateGroupBySprite");
        this.props.vm.addGroupToSprite(v, this.props.sprites[v].order);
    }
    //修改分组名
    handleGroupNameChange = (newName, groupId) => {
        this.props.vm.renameGroupOfSprites(newName, groupId);
    };
    handleToggleGroupNameEdit = (status, groupId) => {
        this.props.vm.onToggleIsEditByGroupId(status, groupId);
        console.log("thisref", this.ref);
        this.ref.focus();
    };
    handleToggleGroupOpen = (status, groupId) => {
        this.props.vm.onToggleIsOpenByGroupId(status, groupId);
    };
    //解除分组
    //删除分组与角色
    handleExportSprite(id) {
        const spriteName = this.props.vm.runtime.getTargetById(id).getName();
        const saveLink = document.createElement("a");
        document.body.appendChild(saveLink);

        this.props.vm.exportSprite(id).then((content) => {
            downloadBlob(`${spriteName}.sprite3`, content);
        });
    }
    handleSelectSprite(id) {
        console.log("handleSelectSprite", id);
        this.props.vm.setEditingTarget(id);
        if (this.props.stage && id !== this.props.stage.id) {
            this.props.onHighlightTarget(id);
        }
    }
    handleSurpriseSpriteClick() {
        this.handleToggleAddMenuVisible(false);
        const surpriseSprites = this.state.spriteLibraryContent.filter(
            (sprite) =>
                sprite.tags.indexOf("letters") === -1 &&
                sprite.tags.indexOf("numbers") === -1
        );
        const item =
            surpriseSprites[Math.floor(Math.random() * surpriseSprites.length)];
        console.log("add surprise", item);
        randomizeSpritePosition(item);
        this.props.vm
            .addSprite(JSON.stringify(item))
            .then(this.handleActivateBlocksTab);
    }
    handlePaintSpriteClick() {
        console.log("handlePaintSpriteClick");
        this.handleToggleAddMenuVisible(false);
        this.setState({
            isFromAddPaint: true,
        });
        var that = this;
        setTimeout(function () {
            that.setState({
                isFromAddPaint: false,
            });
        }, 2000);
        const formatMessage = this.props.intl.formatMessage;
        const emptyItem = emptySprite(
            formatMessage(sharedMessages.sprite, { index: 1 }),
            formatMessage(sharedMessages.pop),
            formatMessage(sharedMessages.costume, { index: 1 })
        );
        var that = this;
        this.props.vm.addSprite(JSON.stringify(emptyItem)).then(() => {
            setTimeout(() => {
                // Wait for targets update to propagate before tab switching
                console.log("openCostumePaintModal", that);
                that.props.openCostumePaint();
                // this.props.onActivateTab(COSTUMES_TAB_INDEX);
            });
        });
    }
    handleActivateBlocksTab() {
        this.props.onActivateTab(BLOCKS_TAB_INDEX);
    }
    onNewSprite3in1Click = () => {
        this.props.onNewSprite3in1Click();
        this.handleToggleAddMenuVisible(false);
    };
    handleNewSprite(spriteJSONString) {
        return this.props.vm
            .addSprite(spriteJSONString)
            .then(this.handleActivateBlocksTab);
    }
    handleFileUploadClick() {
        this.fileInput.click();
    }
    handleSpriteUpload(e) {
        const storage = this.props.vm.runtime.storage;
        this.props.onShowImporting();
        handleFileUpload(
            e.target,
            (buffer, fileType, fileName, fileIndex, fileCount) => {
                spriteUpload(
                    buffer,
                    fileType,
                    fileName,
                    storage,
                    (newSprite) => {
                        this.handleNewSprite(newSprite)
                            .then(() => {
                                if (fileIndex === fileCount - 1) {
                                    this.props.onCloseImporting();
                                }
                            })
                            .catch(this.props.onCloseImporting);
                    },
                    this.props.onCloseImporting
                );
            },
            this.props.onCloseImporting
        );
    }
    setFileInput(input) {
        this.fileInput = input;
    }
    handleBlockDragEnd(blocks) {
        if (
            this.props.hoveredTarget.sprite &&
            this.props.hoveredTarget.sprite !== this.props.editingTarget
        ) {
            this.shareBlocks(
                blocks,
                this.props.hoveredTarget.sprite,
                this.props.editingTarget
            );
            this.props.onReceivedBlocks(true);
        }
    }
    shareBlocks(blocks, targetId, optFromTargetId) {
        // Position the top-level block based on the scroll position.
        const topBlock = blocks.find((block) => block.topLevel);
        if (topBlock) {
            let metrics;
            if (this.props.workspaceMetrics.targets[targetId]) {
                metrics = this.props.workspaceMetrics.targets[targetId];
            } else {
                metrics = {
                    scrollX: 0,
                    scrollY: 0,
                    scale: BLOCKS_DEFAULT_SCALE,
                };
            }

            // Determine position of the top-level block based on the target's workspace metrics.
            const { scrollX, scrollY, scale } = metrics;
            const posY = -scrollY + 30;
            let posX;
            if (this.props.isRtl) {
                posX = scrollX + 30;
            } else {
                posX = -scrollX + 30;
            }

            // Actually apply the position!
            topBlock.x = posX / scale;
            topBlock.y = posY / scale;
        }

        return this.props.vm.shareBlocksToTarget(
            blocks,
            targetId,
            optFromTargetId
        );
    }
    handleDragEnd = (t) => {
        console.log("targetpanelhandleDragEnd", t);
        if (this.props.dragging) {
            this.props.onDrag({
                img: null,
                currentOffset: null,
                dragging: false,
                dragType: null,
                index: null,
            });
        }
    };
    handleNewSound = () => {
        if (!this.props.vm.editingTarget) {
            return null;
        }
        const sprite = this.props.vm.editingTarget.sprite;
        const sounds = sprite.sounds ? sprite.sounds : [];
        this.setState({ selectedSoundIndex: Math.max(sounds.length - 1, 0) });
    };
    handleDrag = (currentOffset) => {
        const { sprite: targetId } = this.props.hoveredTarget;

        let imgsrc = "";
        let title = "";
        if (targetId == "other-down") {
            imgsrc = "";
            title = "移到列表末尾";
        } else if (targetId == "other-up") {
            imgsrc = "";
            title = "移到列表首位";
        }

        var obj = {
            //此处的onDrag是一个reducer
            img: imgsrc,
            currentOffset: currentOffset,
            title: title,
            dragging: true,
            dragType: "GROUPHEADER", //需要DragConstants类型为sprite,groupHeader,InGroupSprite
            index: dragGroupIndex, //这里是被抓元素的index //需要跟某处同时修改？
            payload: dragPayload,
        };
        this.props.onDrag(obj);
    };
    handleMouseDown = (e, i, spriteId) => {
        console.log("handleMouseDown", spriteId);
        e.preventDefault();
        dragGroupIndex = i;
        dragPayload = spriteId;
        // this.setState({
        //     dragType:''
        // })
        this.dragRecognizer.start(e);
    };
    handleMouseEnter = (e, i, id) => {
        console.log("设置target mouseenter", e, i, id);
        this.props.dispatchSetHoveredSprite(id);
    };
    handleMouseLeave = () => {
        this.props.dispatchSetHoveredSprite(null);
    };
    handleDrop(dragInfo) {
        const { sprite: targetId } = this.props.hoveredTarget; //被放的元素
        //组头可以通过targetId是否为21为来判断
        let dropType;
        if (targetId == null) {
            return;
        }
        if (targetId.length === 21) {
            dropType = "group-header";
        } else if (targetId.length === 20) {
            dropType = "sprite";
        } else if (targetId === "other-down") {
            dropType = "other-down";
        } else if (targetId === "other-up") {
            dropType = "other-up";
        }
        //如果是targetId是20位才能正常在sprite中找到droppedObj
        const droppedObj = this.props.sprites[targetId];
        const draggedObj = this.props.sprites[dragInfo.payload];
        const dragIfSpriteOutGroup =
            Object.keys(draggedObj.customField).length == 0; //drag sprite是否为组外sprite false为组内sprite
        const dropIfSpriteOutGroup =
            dropType === "sprite"
                ? Object.keys(droppedObj.customField).length == 0
                : false; //drop sprite是否为组外sprite false为组内sprite
        if (dragInfo.dragType === DragConstants.SPRITE) {
            //如果dragInfo.dragType值为"SPRITE"
            //droppedObj是组外sprite case1
            if (
                dropType === "sprite" &&
                droppedObj &&
                draggedObj &&
                dropIfSpriteOutGroup &&
                dragIfSpriteOutGroup
            ) {
                //case1
                console.log("case1");
                this.props.vm.case1(droppedObj, draggedObj);
            } else if (
                dropType === "sprite" &&
                droppedObj &&
                !dropIfSpriteOutGroup &&
                dragIfSpriteOutGroup
            ) {
                //case2
                console.log("case2");
                this.props.vm.case2(droppedObj, draggedObj);
            } else if (dropType === "group-header" && dragIfSpriteOutGroup) {
                //case3
                console.log("case3");
                this.props.vm.case3(targetId, draggedObj);
            } else if (dropType == "other-up") {
                //case4
                console.log("case4");
                this.props.vm.case4(draggedObj);
            } else if (dropType == "other-down") {
                //case5
                console.log("case5");
                this.props.vm.case5(draggedObj);
            }
        } else if (dragInfo.dragType === DragConstants.GROUP) {
            //draggedObj为"组内sprite"  组到sprite
            if (
                targetId == draggedObj.customField.groupId &&
                !droppedObj &&
                !dragIfSpriteOutGroup &&
                draggedObj.customField.groupId
            ) {
                //case8
                console.log("case8");
                this.props.vm.case8(draggedObj);
            } else if (
                dropType == "group-header" &&
                targetId != draggedObj.customField.groupId &&
                !droppedObj &&
                !dragIfSpriteOutGroup &&
                draggedObj.customField.groupId
            ) {
                //case9
                console.log("case9");
                this.props.vm.case9(targetId, draggedObj);
            } else if (
                dropType == "other-up" &&
                targetId != draggedObj.customField.groupId &&
                !droppedObj &&
                !dragIfSpriteOutGroup &&
                draggedObj.customField.groupId
            ) {
                //case11
                console.log("case11");
                this.props.vm.case11(draggedObj);
            } else if (
                dropType == "other-down" &&
                targetId != draggedObj.customField.groupId &&
                !droppedObj &&
                !dragIfSpriteOutGroup &&
                draggedObj.customField.groupId
            ) {
                //case12
                console.log("case12");
                this.props.vm.case12(draggedObj);
            } else if (
                !dragIfSpriteOutGroup &&
                !dropIfSpriteOutGroup &&
                droppedObj.customField.groupId == draggedObj.customField.groupId
            ) {
                //case6
                console.log("case6");
                this.props.vm.case6(droppedObj, draggedObj);
            } else if (
                !dragIfSpriteOutGroup &&
                !dropIfSpriteOutGroup &&
                droppedObj.customField.groupId != draggedObj.customField.groupId
            ) {
                //case7
                console.log("case7");
                this.props.vm.case7(droppedObj, draggedObj);
            } else if (
                dropType == "sprite" &&
                droppedObj &&
                draggedObj &&
                Object.keys(droppedObj.customField).length == 0
            ) {
                //case10
                console.log("case10");
                this.props.vm.case10(droppedObj, draggedObj);
            }
        } else if (dragInfo.dragType === "GROUPHEADER") {
            if (
                dropType == "sprite" &&
                Object.keys(droppedObj.customField).length == 0 &&
                droppedObj.customField.groupId != draggedObj.customField.groupId
            ) {
                //case13
                console.log("case13");
                this.props.vm.case13(droppedObj, draggedObj);
            } else if (
                dropType == "sprite" &&
                Object.keys(droppedObj.customField).length != 0 &&
                droppedObj.customField.groupId != draggedObj.customField.groupId
            ) {
                //case14
                console.log("case14");
                this.props.vm.case14(droppedObj, draggedObj);
            } else if (dropType == "group-header") {
                //case15
                console.log("case15");
                this.props.vm.case15(targetId, draggedObj);
            } else if (dropType == "other-up") {
                //case16
                console.log("case16");
                this.props.vm.case16(draggedObj);
            } else if (dropType == "other-down") {
                //case17
                console.log("case17");
                this.props.vm.case17(draggedObj);
            }
        } else if (dragInfo.dragType === DragConstants.BACKPACK_SPRITE) {
            //如果dragInfo.dragType值为"BACKPACK_SPRITE"
            // TODO storage does not have a way of loading zips right now, and may never need it.
            // So for now just grab the zip manually.
            fetchSprite(dragInfo.payload.bodyUrl).then((sprite3Zip) =>
                this.props.vm.addSprite(sprite3Zip)
            );
        } else if (targetId) {
            // Something is being dragged over one of the sprite tiles or the backdrop.
            // Dropping assets like sounds and costumes duplicate the asset on the
            // hovered target. Shared costumes also become the current costume on that target.
            // However, dropping does not switch the editing target or activate that editor tab.
            // This is based on 2.0 behavior, but seems like it keeps confusing switching to a minimum.
            // it allows the user to share multiple things without switching back and forth.
            if (dragInfo.dragType === DragConstants.COSTUME) {
                this.props.vm.shareCostumeToTarget(dragInfo.index, targetId);
            } else if (targetId && dragInfo.dragType === DragConstants.SOUND) {
                this.props.vm.shareSoundToTarget(dragInfo.index, targetId);
            } else if (dragInfo.dragType === DragConstants.BACKPACK_COSTUME) {
                // In scratch 2, this only creates a new sprite from the costume.
                // We may be able to handle both kinds of drops, depending on where
                // the drop happens. For now, just add the costume.
                this.props.vm.addCostume(
                    dragInfo.payload.body,
                    {
                        name: dragInfo.payload.name,
                    },
                    targetId
                );
            } else if (dragInfo.dragType === DragConstants.BACKPACK_SOUND) {
                this.props.vm.addSound(
                    {
                        md5: dragInfo.payload.body,
                        name: dragInfo.payload.name,
                    },
                    targetId
                );
            } else if (dragInfo.dragType === DragConstants.BACKPACK_CODE) {
                fetchCode(dragInfo.payload.bodyUrl)
                    .then((blocks) => this.shareBlocks(blocks, targetId))
                    .then(() => this.props.vm.refreshWorkspace());
            }
        }
    }
    render() {
        /* eslint-disable no-unused-vars */
        const {
            dispatchUpdateRestore,
            dispatchSetHoveredSprite,
            isRtl,
            onActivateTab,
            onCloseImporting,
            onHighlightTarget,
            onReceivedBlocks,
            onShowImporting,
            onDrag,
            dragging,
            workspaceMetrics,
            ...componentProps
        } = this.props;
        /* eslint-enable no-unused-vars */
        return (
            <TargetPaneComponent
                {...componentProps}
                fileInputRef={this.setFileInput}
                onActivateBlocksTab={this.handleActivateBlocksTab}
                onChangeSpriteDirection={this.handleChangeSpriteDirection}
                onChangeSpriteName={this.handleChangeSpriteName}
                onChangeSpriteRotationStyle={
                    this.handleChangeSpriteRotationStyle
                }
                onChangeSpriteSize={this.handleChangeSpriteSize}
                onChangeSpriteVisibility={this.handleChangeSpriteVisibility}
                onChangeSpriteX={this.handleChangeSpriteX}
                onChangeSpriteY={this.handleChangeSpriteY}
                onDeleteSprite={this.handleDeleteSprite}
                onDrop={this.handleDrop}
                onDuplicateSprite={this.handleDuplicateSprite}
                handleMouseDown={this.handleMouseDown}
                onCreateGroupBySprite={this.handleCreateGroupBySprite}
                onGroupNameChange={this.handleGroupNameChange}
                onToggleGroupNameEdit={this.handleToggleGroupNameEdit}
                onToggleGroupOpen={this.handleToggleGroupOpen}
                onExportSprite={this.handleExportSprite}
                onFileUploadClick={this.handleFileUploadClick}
                onPaintSpriteClick={this.handlePaintSpriteClick}
                onSelectSprite={this.handleSelectSprite}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onSpriteUpload={this.handleSpriteUpload}
                onSurpriseSpriteClick={this.handleSurpriseSpriteClick}
                // onToggleCostume={this.handleChangeCostumeVisible}
                setRef={this.setRef}
                clickAwayDivWidth={this.state.clickAwayDivWidth}
                handleNewSound={this.handleNewSound}
                addMenuVisible={this.state.addMenuVisible}
                handleToggleAddMenuVisible={this.handleToggleAddMenuVisible}
                onNewSprite3in1Click={this.onNewSprite3in1Click}
                isFromAddPaint={this.state.isFromAddPaint}
            />
        );
    }
}

const {
    onSelectSprite, // eslint-disable-line no-unused-vars
    onActivateBlocksTab, // eslint-disable-line no-unused-vars
    handleNewSound,
    ...targetPaneProps
} = TargetPaneComponent.propTypes;

TargetPane.propTypes = {
    intl: intlShape.isRequired,
    onCloseImporting: PropTypes.func,
    onShowImporting: PropTypes.func,
    onDrag: PropTypes.func,
    // dispatchSetHoveredSprite: PropTypes.func,
    // dragging: PropTypes.bool,
    ...targetPaneProps,
};

const mapStateToProps = (state) => ({
    editingTarget: state.scratchGui.targets.editingTarget,
    hoveredTarget: state.scratchGui.hoveredTarget,
    isRtl: state.locales.isRtl,
    spriteLibraryVisible: state.scratchGui.modals.spriteLibrary,
    spriteLibrary3in1Visible: state.scratchGui.modals.spriteLibrary3in1,
    CostumeTabsVisible: state.scratchGui.modals.costumePaint,
    sprites: state.scratchGui.targets.sprites,
    stage: state.scratchGui.targets.stage,
    raiseSprites: state.scratchGui.blockDrag,
    workspaceMetrics: state.scratchGui.workspaceMetrics,
    dragging: state.scratchGui.assetDrag.dragging,
});

const mapDispatchToProps = (dispatch) => ({
    // onTargetsUpdate: (data) => {
    //     //这里的data是scratch-vm回调给出的
    //     //所有stage,sprite的参数发生变化时，此函数被触发，比如切换了背景，调整了sprite位置，修改了sprite的名字，复制了一个sprite的皮肤。
    //     console.log("havelook", data);
    //     dispatch(updateTargets(data.targetList, data.editingTarget));
    // },
    onNewSpriteClick: (e) => {
        e.preventDefault();
        dispatch(openSpriteLibrary());
    },
    onNewSprite3in1Click: (e) => {
        //  e.preventDefault();
        dispatch(openSpriteLibrary3in1());
    },
    openCostumePaint: (e) => {
        dispatch(openCostumePaintModal());
    },
    closeCostumePaint: (e) => {
        dispatch(closeCostumePaintModal());
    },
    onRequestCloseSpriteLibrary: () => dispatch(closeSpriteLibrary()),
    onRequestCloseSpriteLibrary3in1: () => dispatch(closeSpriteLibrary3in1()),
    onActivateTab: (tabIndex) => dispatch(activateTab(tabIndex)),
    onReceivedBlocks: (receivedBlocks) =>
        dispatch(setReceivedBlocks(receivedBlocks)),
    // 这里是关闭的动画的
    dispatchUpdateRestore: (restoreState) => {
        dispatch(setRestore(restoreState));
    },
    onHighlightTarget: (id) => {
        dispatch(highlightTarget(id));
    },
    onCloseImporting: () => dispatch(closeAlertWithId("importingAsset")),
    onShowImporting: () => dispatch(showStandardAlert("importingAsset")),
    onDrag: (data) => dispatch(updateAssetDrag(data)),
    dispatchSetHoveredSprite: (spriteId) => {
        dispatch(setHoveredSprite(spriteId));
    },
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(TargetPane)
);
