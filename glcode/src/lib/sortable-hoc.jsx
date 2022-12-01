import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { indexForPositionOnList } from "./drag-utils";

const SortableHOC = function (WrappedComponent) {
    class SortableWrapper extends React.Component {
        constructor(props) {
            super(props);
            bindAll(this, [
                "setRef",
                "handleAddSortable",
                "handleRemoveSortable",
            ]);

            this.sortableRefs = [];
            this.boxes = null;
            this.ref = null;
            this.containerBox = null;
        }
        componentWillReceiveProps(newProps) {
            if (newProps.dragInfo.dragging && !this.props.dragInfo.dragging) {
                // Drag just started, snapshot the sorted bounding boxes for sortables.
                this.boxes = this.sortableRefs.map(
                    (el) => el && el.getBoundingClientRect()
                );
                this.boxes.sort((a, b) => {
                    // Sort top-to-bottom, left-to-right (in LTR) / right-to-left (in RTL).
                    if (a.top === b.top)
                        return (a.left - b.left) * (this.props.isRtl ? -1 : 1);
                    return a.top - b.top;
                });
                if (!this.ref) {
                    throw new Error(
                        "The containerRef must be assigned to the sortable area"
                    );
                }
                this.containerBox = this.ref.getBoundingClientRect();
            } else if (
                !newProps.dragInfo.dragging &&
                this.props.dragInfo.dragging &&
                newProps.hoveredTarget
            ) {
                const newIndex = this.getMouseOverIndex();

                if (
                    newIndex !== null ||
                    (newProps.hoveredTarget.sprite &&
                        newProps.hoveredTarget.sprite.length === 21)
                ) {
                    //newIndex如果存在，说明产生了元素移动//21位说明是groupid,20位是其他
                    this.props.onDrop(
                        Object.assign({}, this.props.dragInfo, { newIndex })
                    );
                } else if (newProps.dragInfo.title == "移到列表首位") {
                    this.props.onDrop(
                        Object.assign({}, this.props.dragInfo, { newIndex })
                    );
                }

                // if(newProps.dragInfo.title=='移到该组首位'){
                //     console.log('1drop')
                //    this.props.onDrop(Object.assign({}, this.props.dragInfo, {newIndex}));
                // }
                // if(newProps.dragInfo.title=='移到列表首位'){
                //     console.log('3drop')
                //    this.props.onDrop(Object.assign({}, this.props.dragInfo, {newIndex}));
                // }

                //this.props.onDrop(Object.assign({}, this.props.dragInfo, {newIndex}));
            }
        }

        handleAddSortable(node) {
            this.sortableRefs.push(node);
        }

        handleRemoveSortable(node) {
            const index = this.sortableRefs.indexOf(node);
            this.sortableRefs = this.sortableRefs
                .slice(0, index)
                .concat(this.sortableRefs.slice(index + 1));
        }

        getOrdering(items, draggingIndex, newIndex) {
            // An "Ordering" is an array of indices, where the position array value corresponds
            // to the position of the item in props.items, and the index of the value
            // is the index at which the item should appear.
            // That is, if props.items is ['a', 'b', 'c', 'd'], and we want the GUI to display
            // ['b', 'c', 'a, 'd'], the value of "ordering" would be [1, 2, 0, 3].
            // This mapping is used because it is easy to translate to flexbox ordering,
            // the `order` property for item N is ordering.indexOf(N).
            // If the user-facing order matches props.items, the ordering is just [0, 1, 2, ...]
            let ordering;
            if (Array.isArray(items) == false) {
                const newArr = Object.keys(items).map((id) => items[id]);
                ordering = Array(newArr.length)
                    .fill(0)
                    .map((_, i) => i);
            } else {
                ordering = Array(this.props.items.length)
                    .fill(0)
                    .map((_, i) => i);
            }

            const isNumber = (v) => typeof v === "number" && !isNaN(v);
            if (isNumber(draggingIndex) && isNumber(newIndex)) {
                ordering = ordering
                    .slice(0, draggingIndex)
                    .concat(ordering.slice(draggingIndex + 1));
                ordering.splice(newIndex, 0, draggingIndex);
            }
            return ordering;
        }

        getMouseOverIndex() {
            // MouseOverIndex is the index that the current drag wants to place the
            // the dragging object. Obviously only exists if there is a drag (i.e. currentOffset).
            // Return null if outside the container, zero if there are no boxes.
            let mouseOverIndex = null;
            if (this.props.dragInfo.currentOffset) {
                const { x, y } = this.props.dragInfo.currentOffset;
                const { top, left, bottom, right } = this.containerBox;
                if (x >= left && x <= right && y >= top && y <= bottom) {
                    if (this.boxes.length === 0) {
                        mouseOverIndex = 0;
                    } else {
                        mouseOverIndex = indexForPositionOnList(
                            this.props.dragInfo.currentOffset,
                            this.boxes,
                            this.props.isRtl
                        );
                    }
                }
            }
            return mouseOverIndex;
        }
        setRef(el) {
            this.ref = el;
        }
        render() {
            const {
                dragInfo: { index: dragIndex, dragType },
                items,
            } = this.props;
            const mouseOverIndex = this.getMouseOverIndex();
            //这里items原本是数组，现在是对象
            let ordering;
            //这里加上dragging判断，取消还没放下的时候替换位置的效果
            ordering = this.getOrdering(
                items,
                dragIndex,
                this.props.dragInfo.dragging ? null : mouseOverIndex
            );
            return (
                <WrappedComponent
                    containerRef={this.setRef}
                    draggingIndex={dragIndex}
                    draggingType={dragType}
                    mouseOverIndex={mouseOverIndex}
                    ordering={ordering}
                    onAddSortable={this.handleAddSortable}
                    onRemoveSortable={this.handleRemoveSortable}
                    {...this.props}
                />
            );
        }
    }

    SortableWrapper.propTypes = {
        dragInfo: PropTypes.shape({
            currentOffset: PropTypes.shape({
                x: PropTypes.number,
                y: PropTypes.number,
            }),
            dragType: PropTypes.string,
            dragging: PropTypes.bool,
            index: PropTypes.number,
        }),
        // items: PropTypes.arrayOf(PropTypes.shape({
        //     url: PropTypes.string,
        //     name: PropTypes.string.isRequired
        // })),
        items: PropTypes.any, //items改了以后有可能是array,也有可能是Object。
        onClose: PropTypes.func,
        onDrop: PropTypes.func,
        isRtl: PropTypes.bool,
    };

    const mapStateToProps = (state) => ({
        dragInfo: state.scratchGui.assetDrag,
        isRtl: state.locales.isRtl,
    });

    const mapDispatchToProps = () => ({});

    return connect(mapStateToProps, mapDispatchToProps)(SortableWrapper);
};

export default SortableHOC;
