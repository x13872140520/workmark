import bindAll from "lodash.bindall";
import omit from "lodash.omit";
import PropTypes from "prop-types";
import React from "react";
import { intlShape, injectIntl } from "react-intl";

import { connect } from "react-redux";
import { openBackdropLibrary } from "../reducers/modals";
import { activateTab, COSTUMES_TAB_INDEX } from "../reducers/editor-tab";
import { showStandardAlert, closeAlertWithId } from "../reducers/alerts";
import { setHoveredSprite } from "../reducers/hovered-target";
import DragConstants from "../lib/drag-constants";
import DropAreaHOC from "../lib/drop-area-hoc.jsx";
import ThrottledPropertyHOC from "../lib/throttled-property-hoc.jsx";
import { emptyCostume } from "../lib/empty-assets";
import sharedMessages from "../lib/shared-messages";
import { fetchCode } from "../lib/backpack-api";
import { getEventXY } from "../lib/touch-utils";

import StageSelectorNewComponent from "../components/stage-selector-new/stage-selector-new.jsx";

import backdropLibraryContent from "../lib/libraries/backdrops.json";
import { handleFileUpload, costumeUpload } from "../lib/file-uploader.js";
import { CreatAxios, api, tagsType } from "../utils/request";
import {
    getTags,
    getMaterial,
    getRoleMaterial,
    getDataByType,
} from "../utils/api.js";
import {
    openCostumePaintModal,
    closeCostumePaintModal,
} from "../reducers/modals";
import {
    useSubscribe,
    usePublish,
    useUnsubscribe,
} from "../Pusconnect/usePubSub";
const dragTypes = [
    DragConstants.COSTUME,
    DragConstants.SOUND,
    DragConstants.BACKPACK_COSTUME,
    DragConstants.BACKPACK_SOUND,
    DragConstants.BACKPACK_CODE,
];

const DroppableThrottledStage = DropAreaHOC(dragTypes)(
    ThrottledPropertyHOC("url", 500)(StageSelectorNewComponent)
);

class StageSelectorNew extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            "handleClick",
            "handleNewBackdrop",
            "handleSurpriseBackdrop",
            "handleEmptyBackdrop",
            "addBackdropFromLibraryItem",
            "handleFileUploadClick",
            "handleBackdropUpload",
            "handleMouseEnter",
            "handleMouseLeave",
            "handleTouchEnd",
            "handleDrop",
            "setFileInput",
            "setRef",
        ]);
        this.state = {
            backdropLibraryContent: [],
        };
    }
    componentDidMount() {
        console.log("ggsmd", this.props.costumeTabsVisible);
        document.addEventListener("touchend", this.handleTouchEnd);
        var that = this;
        getMaterial({
            type: tagsType.backDropType,
        }).then((result) => {
            that.setState({
                backdropLibraryContent: result.data,
            });
        });
    }
    componentWillUnmount() {
        document.removeEventListener("touchend", this.handleTouchEnd);
    }
    handleTouchEnd(e) {
        const { x, y } = getEventXY(e);
        const { top, left, bottom, right } = this.ref.getBoundingClientRect();
        if (x >= left && x <= right && y >= top && y <= bottom) {
            this.handleMouseEnter();
        }
    }
    addBackdropFromLibraryItem(item, shouldActivateTab = true) {
        const vmBackdrop = {
            name: item.name,
            md5: item.md5ext,
            rotationCenterX: item.rotationCenterX,
            rotationCenterY: item.rotationCenterY,
            bitmapResolution: item.bitmapResolution,
            skinId: null,
        };
        this.handleNewBackdrop(vmBackdrop, shouldActivateTab);
    }
    handleClick() {
        this.props.onSelect(this.props.id);
    }
    handleNewBackdrop(backdrops_, shouldActivateTab = true) {
        console.log("handleNewBackdrop", backdrops_, shouldActivateTab);
        const backdrops = Array.isArray(backdrops_) ? backdrops_ : [backdrops_];
        return Promise.all(
            backdrops.map((backdrop) => {
                console.log("addBackdrop", backdrop.md5backdrop);
                this.props.vm.addBackdrop(backdrop.md5, backdrop);
            })
        ).then(() => {
            if (shouldActivateTab) {
                return this.props.onActivateTab(COSTUMES_TAB_INDEX);
            }
        });
    }
    handleSurpriseBackdrop(e) {
        console.log("handleSurpriseBackdrop97"); //
        e.stopPropagation(); // Prevent click from falling through to selecting stage.
        // @todo should this not add a backdrop you already have?
        const item =
            this.state.backdropLibraryContent[
                Math.floor(
                    Math.random() * this.state.backdropLibraryContent.length
                )
            ];

        this.addBackdropFromLibraryItem(item, false);
    }
    handleEmptyBackdrop(e) {
        console.log("handleEmptyBackdrop");
        e.stopPropagation(); // Prevent click from falling through to stage selector, select it manually below
        this.props.vm.setEditingTarget(this.props.id);
        this.handleNewBackdrop(
            emptyCostume(
                this.props.intl.formatMessage(sharedMessages.backdrop, {
                    index: 1,
                })
            )
        );
    }
    handleBackdropUpload(e) {
        const storage = this.props.vm.runtime.storage;
        this.props.onShowImporting();
        handleFileUpload(
            e.target,
            (buffer, fileType, fileName, fileIndex, fileCount) => {
                costumeUpload(
                    buffer,
                    fileType,
                    storage,
                    (vmCostumes) => {
                        this.props.vm.setEditingTarget(this.props.id);
                        vmCostumes.forEach((costume, i) => {
                            costume.name = `${fileName}${i ? i + 1 : ""}`;
                        });
                        this.handleNewBackdrop(vmCostumes).then(() => {
                            if (fileIndex === fileCount - 1) {
                                this.props.onCloseImporting();
                            }
                        });
                    },
                    this.props.onCloseImporting
                );
            },
            this.props.onCloseImporting
        );
    }
    handleFileUploadClick(e) {
        e.stopPropagation(); // Prevent click from selecting the stage, that is handled manually in backdrop upload
        this.fileInput.click();
    }
    handleMouseEnter() {
        this.props.dispatchSetHoveredSprite(this.props.id);
    }
    handleMouseLeave() {
        this.props.dispatchSetHoveredSprite(null);
    }
    handleDrop(dragInfo) {
        console.log("handleDrop");
        if (dragInfo.dragType === DragConstants.COSTUME) {
            this.props.vm.shareCostumeToTarget(dragInfo.index, this.props.id);
        } else if (dragInfo.dragType === DragConstants.SOUND) {
            this.props.vm.shareSoundToTarget(dragInfo.index, this.props.id);
        } else if (dragInfo.dragType === DragConstants.BACKPACK_COSTUME) {
            this.props.vm.addCostume(
                dragInfo.payload.body,
                {
                    name: dragInfo.payload.name,
                },
                this.props.id
            );
        } else if (dragInfo.dragType === DragConstants.BACKPACK_SOUND) {
            this.props.vm.addSound(
                {
                    md5: dragInfo.payload.body,
                    name: dragInfo.payload.name,
                },
                this.props.id
            );
        } else if (dragInfo.dragType === DragConstants.BACKPACK_CODE) {
            fetchCode(dragInfo.payload.bodyUrl).then((blocks) => {
                this.props.vm.shareBlocksToTarget(blocks, this.props.id);
                this.props.vm.refreshWorkspace();
            });
        }
    }
    setFileInput(input) {
        this.fileInput = input;
    }
    setRef(ref) {
        this.ref = ref;
    }
    render() {
        const componentProps = omit(this.props, [
            "asset",
            "dispatchSetHoveredSprite",
            "id",
            "intl",
            "onActivateTab",
            "onSelect",
            "onShowImporting",
            "onCloseImporting",
            "costumeTabsVisible",
        ]);
        return (
            <DroppableThrottledStage
                componentRef={this.setRef}
                fileInputRef={this.setFileInput}
                onBackdropFileUpload={this.handleBackdropUpload}
                onBackdropFileUploadClick={this.handleFileUploadClick}
                onClick={this.handleClick}
                onDrop={this.handleDrop}
                onEmptyBackdropClick={this.handleEmptyBackdrop}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onSurpriseBackdropClick={this.handleSurpriseBackdrop}
                costumeTabsVisible={this.props.costumeTabsVisible}
                {...componentProps}
            />
        );
    }
}
StageSelectorNew.propTypes = {
    ...StageSelectorNewComponent.propTypes,
    id: PropTypes.string,
    intl: intlShape.isRequired,
    onCloseImporting: PropTypes.func,
    onSelect: PropTypes.func,
    onShowImporting: PropTypes.func,
};

const mapStateToProps = (state, { asset, id }) => ({
    url: asset && asset.encodeDataURI(),
    vm: state.scratchGui.vm,
    receivedBlocks:
        state.scratchGui.hoveredTarget.receivedBlocks &&
        state.scratchGui.hoveredTarget.sprite === id,
    raised: state.scratchGui.blockDrag,
});

const mapDispatchToProps = (dispatch) => ({
    openCostumePaint: (e) => {
        setTimeout(function () {
            const publish = usePublish();
            publish(
                "setClickAwayDivWidth",
                document.getElementsByClassName("injectionDiv")[0].clientWidth +
                    "px"
            );
        }, 500);
        dispatch(openCostumePaintModal());
    },
    closeCostumePaint: (e) => dispatch(closeCostumePaintModal()),
    onNewBackdropClick: (e) => {
        e.stopPropagation();
        dispatch(openBackdropLibrary());
    },
    onActivateTab: (tabIndex) => {
        dispatch(activateTab(tabIndex));
    },
    dispatchSetHoveredSprite: (spriteId) => {
        dispatch(setHoveredSprite(spriteId));
    },
    onCloseImporting: () => dispatch(closeAlertWithId("importingAsset")),
    onShowImporting: () => dispatch(showStandardAlert("importingAsset")),
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(StageSelectorNew)
);
