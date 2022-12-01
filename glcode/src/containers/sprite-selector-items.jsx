import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { setHoveredSprite } from "../reducers/hovered-target";
import { updateAssetDrag } from "../reducers/asset-drag";
import storage from "../lib/storage";
import VM from "scratch-vm";
import getCostumeUrl from "../lib/get-costume-url";
import DragRecognizer from "../lib/drag-recognizer";
import { getEventXY } from "../lib/touch-utils";

import {
    openCostumePaintModal,
    closeCostumePaintModal,
} from "../reducers/modals";
import SpriteSelectorItemsComponent from "../components/sprite-selector-items/sprite-selector-items.jsx";
import {
    useSubscribe,
    usePublish,
    useUnsubscribe,
} from "../Pusconnect/usePubSub";
class SpriteSelectorItem extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, [
            "getCostumeData",
            "setRef",
            "handleClick",
            "handleDelete",
            "handleDuplicate",
            "handleExport",
            "handleMouseEnter",
            "handleMouseLeave",
            "handleMouseDown",
            "handleDragEnd",
            "handleDrag",
            "handleTouchEnd",
        ]);
        this.dragRecognizer = new DragRecognizer({
            onDrag: this.handleDrag,
            onDragEnd: this.handleDragEnd,
        });
        this.state = {
            collapseStatus: false,
        };
    }

    componentDidMount() {
        document.addEventListener("touchend", this.handleTouchEnd);
    }
    componentWillUnmount() {
        document.removeEventListener("touchend", this.handleTouchEnd);
        this.dragRecognizer.reset();
    }
    getCostumeData() {
        if (this.props.costumeURL) return this.props.costumeURL;
        if (!this.props.asset) return null;

        return getCostumeUrl(this.props.asset);
    }
    handleDragEnd() {
        //drag-recognizer.js给页面绑定的mouseup的回调就触发了这里，相当于鼠标放下
        if (this.props.dragging) {
            this.props.onDrag({
                img: null,
                currentOffset: null,
                dragging: false,
                dragType: null,
                index: null,
            });
        }
        // setTimeout(() => {
        //     this.noClick = false;
        // });
    }
    handleDrag(currentOffset) {
        const { sprite: targetId } = this.props.hoveredTarget;
        let imgsrc = "";
        let title = "";
        if (targetId == "other-down") {
            imgsrc = "";
            title = "移到列表末尾";
        } else if (targetId == "other-up") {
            imgsrc = "";
            title = "移到列表首位";
        } else if (
            targetId &&
            targetId.length === 21 &&
            this.props.dragType == "GROUP"
        ) {
            title = "移到该组首位";
        }
        var obj = {
            //此处的onDrag是一个reducer
            img: this.getCostumeData(), //这里获取当前sprite所选择的皮肤图片base64
            currentOffset: currentOffset, //这里的参数是由drag-recognizer.js产生
            title: title,
            dragging: true, //表示正在拖拽
            dragType: this.props.dragType, //这里的参数是SPRITE,也可以是皮肤(costume)，声音(sound)等
            index: this.props.index, //这里是被抓元素的index //需要跟某处同时修改？
            payload: this.props.dragPayload, //被抓元素的标记，用于被识别是什么物体，这里的是sprite的id
        };
        this.props.onDrag(obj);
    }
    handleTouchEnd(e) {
        const { x, y } = getEventXY(e);
        const { top, left, bottom, right } = this.ref.getBoundingClientRect();
        if (x >= left && x <= right && y >= top && y <= bottom) {
            this.handleMouseEnter();
        }
    }
    handleMouseDown(e) {
        this.dragRecognizer.start(e);
    }
    handleClick(e) {
        e.preventDefault();
        if (!this.noClick) {
            this.props.onClick(this.props.id);
        }
    }
    handleCollapse = (e) => {
        e.preventDefault();
        this.setState({
            collapseStatus: true,
        });
    };
    handleDelete(e) {
        e.stopPropagation(); // To prevent from bubbling back to handleClick
        this.props.onDeleteButtonClick(this.props.id);
    }
    handleDuplicate(e) {
        e.stopPropagation(); // To prevent from bubbling back to handleClick
        this.props.onDuplicateButtonClick(this.props.id);
    }
    handleCreateGroup = (e) => {
        e.stopPropagation(); // To prevent from bubbling back to handleClick
        this.props.onCreateGroupClick(this.props.id);
    };
    handleExport(e) {
        e.stopPropagation();
        this.props.onExportButtonClick(this.props.id);
    }
    handleMouseLeave() {
        this.props.dispatchSetHoveredSprite(null);
    }
    handleMouseEnter() {
        this.props.dispatchSetHoveredSprite(this.props.id);
    }
    setRef(component) {
        // Access the DOM node using .elem because it is going through ContextMenuTrigger
        this.ref = component && component.elem;
    }
    handleShowPanel = (bool) => {
        this.setState({
            collapseStatus: bool,
        });
    };
    render() {
        const {
            /* eslint-disable no-unused-vars */
            asset,
            id,
            index,
            onClick,
            onDeleteButtonClick,
            onDuplicateButtonClick,
            onCreateGroupClick,
            onExportButtonClick,
            inGroup,
            dragPayload,
            receivedBlocks,
            costumeURL,
            vm,
            costumeTabsVisible,
            /* eslint-enable no-unused-vars */
            ...props
        } = this.props;
        return (
            <div>
                <SpriteSelectorItemsComponent
                    collapseStatus={this.state.collapseStatus}
                    componentRef={this.setRef}
                    costumeURL={this.getCostumeData()}
                    preventContextMenu={this.dragRecognizer.gestureInProgress()}
                    onClick={this.handleClick}
                    onHoverClick={this.handleShowPanel}
                    onDeleteButtonClick={
                        onDeleteButtonClick ? this.handleDelete : null
                    }
                    onDuplicateButtonClick={
                        onDuplicateButtonClick ? this.handleDuplicate : null
                    }
                    onCreateGroupClick={
                        onCreateGroupClick ? this.handleCreateGroup : null
                    }
                    onExportButtonClick={
                        onExportButtonClick ? this.handleExport : null
                    }
                    inGroup={inGroup}
                    onCollapseClick={this.handleCollapse}
                    onMouseDown={this.handleMouseDown}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    costumeTabsVisible={costumeTabsVisible}
                    {...props}
                />
            </div>
        );
    }
}

SpriteSelectorItem.propTypes = {
    asset: PropTypes.instanceOf(storage.Asset),
    costumeURL: PropTypes.string,
    dispatchSetHoveredSprite: PropTypes.func.isRequired,
    openCostumePaint: PropTypes.func,
    dragPayload: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dragType: PropTypes.string,
    dragging: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    index: PropTypes.number,
    name: PropTypes.string,
    onClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
    onDrag: PropTypes.func.isRequired,
    onDuplicateButtonClick: PropTypes.func,
    onCreateGroupClick: PropTypes.func,
    onExportButtonClick: PropTypes.func,
    inGroup: PropTypes.bool,
    onCollapseClick: PropTypes.func,
    receivedBlocks: PropTypes.bool.isRequired,
    selected: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
    costumeTabsVisible: PropTypes.bool,
};

const mapStateToProps = (state, { id }) => ({
    dragging: state.scratchGui.assetDrag.dragging,
    receivedBlocks:
        state.scratchGui.hoveredTarget.receivedBlocks &&
        state.scratchGui.hoveredTarget.sprite === id,
    vm: state.scratchGui.vm,
    hoveredTarget: state.scratchGui.hoveredTarget,
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
    dispatchSetHoveredSprite: (spriteId) => {
        dispatch(setHoveredSprite(spriteId));
    },
    onDrag: (data) => dispatch(updateAssetDrag(data)),
});

const ConnectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(SpriteSelectorItem);

export default ConnectedComponent;
