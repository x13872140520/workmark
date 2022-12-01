import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import DragConstants from "../../lib/drag-constants";

import Box from "../box/box.jsx";
import SpriteSelectorItem from "../../containers/sprite-selector-items.jsx";
import SortableHOC from "../../lib/sortable-hoc.jsx";
import SortableAsset from "../asset-panel/sortable-asset.jsx";
import ThrottledPropertyHOC from "../../lib/throttled-property-hoc.jsx";

import styles from "./sprite-group-selectors.css";
import { style } from "@mui/system";
import { IconGroupFolder } from "../../components/download-icon/download-icon.jsx";
import { multipleClickHandler } from "../../lib/touch-utils";
import Grow from "@material-ui/core/Grow";
import Collapse from "@material-ui/core/Collapse";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
const ThrottledSpriteSelectorItem = ThrottledPropertyHOC(
    "asset",
    500
)(SpriteSelectorItem);

const SpriteGroupListsObj = function (props) {
    const {
        containerRef,
        editingTarget,
        draggingIndex,
        draggingType,
        hoveredTarget,
        onDeleteSprite,
        onDuplicateSprite,
        onCreateGroupBySprite,
        handleMouseEnter,
        handleMouseLeave,
        // onGroupNameChange,
        // onToggleGroupNameEdit,
        onToggleGroupOpen,
        onExportSprite,
        onSelectSprite,
        onAddSortable,
        onRemoveSortable,
        handleMouseDown,
        ordering,
        raised,
        selectedId,
        isEdit,
        items,
        setRef,
        costumeTabsVisible,
    } = props;
    const isSpriteDrag = draggingType === DragConstants.SPRITE;
    return (
        <Box
            className={classNames(styles.scrollWrapper, {
                [styles.scrollWrapperDragging]:
                    draggingType === DragConstants.BACKPACK_SPRITE,
            })}
            componentRef={containerRef}
        >
            <Box className={styles.itemsWrapper}>
                <div
                    className={styles.otherUp}
                    onMouseEnter={(e) => {
                        handleMouseEnter(e, 0, "other-up");
                    }}
                    onMouseLeave={(e) => {
                        handleMouseLeave();
                    }}
                ></div>
                {Object.keys(items).map((id, index) => {
                    if (Array.isArray(items[id]) == false) {
                        let sprite = items[id];
                        const receivedBlocks =
                            hoveredTarget.sprite === sprite.id &&
                            sprite.id !== editingTarget &&
                            hoveredTarget.receivedBlocks;

                        // If the sprite is indicating it can receive block dropping, used for blue highlight
                        let isRaised =
                            !receivedBlocks &&
                            raised &&
                            sprite.id !== editingTarget;

                        // A sprite is also raised if a costume or sound is being dragged.
                        // Note the absence of the self-sharing check: a sprite can share assets with itself.
                        // This is a quirk of 2.0, but seems worth leaving possible, it
                        // allows quick (albeit unusual) duplication of assets.

                        isRaised =
                            isRaised ||
                            [
                                DragConstants.COSTUME,
                                DragConstants.SOUND,
                                DragConstants.BACKPACK_COSTUME,
                                DragConstants.BACKPACK_SOUND,
                                DragConstants.BACKPACK_CODE,
                            ].includes(draggingType);
                        //console.log('case1sprite',sprite, items)

                        return (
                            <SortableAsset
                                className={classNames(styles.spriteWrapper, {
                                    [styles.placeholder]:
                                        isSpriteDrag && index === draggingIndex,
                                })}
                                // index={isSpriteDrag ? ordering.indexOf(index) : index}
                                index={index}
                                key={sprite.name}
                                onAddSortable={onAddSortable}
                                onRemoveSortable={onRemoveSortable}
                            >
                                <ThrottledSpriteSelectorItem
                                    asset={
                                        sprite.costume && sprite.costume.asset
                                    }
                                    className={classNames(styles.sprite, {
                                        [styles.raised]: isRaised,
                                        [styles.receivedBlocks]: receivedBlocks,
                                    })}
                                    dragPayload={sprite.id}
                                    dragType={DragConstants.SPRITE}
                                    id={sprite.id}
                                    index={index}
                                    key={sprite.id}
                                    name={sprite.name}
                                    selected={sprite.id === selectedId}
                                    onClick={onSelectSprite}
                                    onDeleteButtonClick={onDeleteSprite}
                                    onDuplicateButtonClick={onDuplicateSprite}
                                    onCreateGroupClick={onCreateGroupBySprite}
                                    onExportButtonClick={onExportSprite}
                                    inGroup={false}
                                    costumeTabsVisible={costumeTabsVisible}
                                />
                            </SortableAsset>
                        );
                    } else if (Array.isArray(items[id])) {
                        var cindex = isSpriteDrag
                            ? ordering.indexOf(index)
                            : index;
                        //var cindex=index
                        return (
                            <div
                                className={styles.spriteGroup}
                                style={{ order: cindex }}
                                key={items[id][0].name}
                            >
                                <div
                                    className={styles.groupHeader}
                                    onMouseDown={(e) => {
                                        handleMouseDown(
                                            e,
                                            cindex,
                                            items[id][0].id
                                        );
                                    }}
                                    onMouseUp={(e) => {
                                        console.log("onMouseUp");
                                    }}
                                    onMouseEnter={(e) => {
                                        handleMouseEnter(
                                            e,
                                            cindex,
                                            items[id][0].customField.groupId
                                        );
                                    }}
                                    onMouseLeave={(e) => {
                                        handleMouseLeave();
                                    }}
                                >
                                    <div
                                        className={
                                            styles.groupHeaderIconContainer
                                        }
                                        onClick={() => {
                                            props.onToggleGroupOpen(
                                                !items[id][0].customField
                                                    .groupOpen,
                                                items[id][0].customField.groupId
                                            );
                                        }}
                                    >
                                        <IconGroupFolder
                                            fill="#ffffff"
                                            className={styles.groupHeaderIcon}
                                        />
                                    </div>

                                    {items[id][0].customField.groupIsEdit ? (
                                        <ClickAwayListener
                                            onClickAway={(e) => {
                                                console.log(
                                                    "ClickAwayListener"
                                                );
                                                props.onToggleGroupNameEdit(
                                                    false,
                                                    items[id][0].customField
                                                        .groupId
                                                );
                                            }}
                                        >
                                            <Grow
                                                in={
                                                    items[id][0].customField
                                                        .groupIsEdit
                                                }
                                                style={{
                                                    transformOrigin: "0 50% 0",
                                                }}
                                            >
                                                <input
                                                    className={
                                                        styles.groupHeaderInput
                                                    }
                                                    type="text"
                                                    ref={(inputref) => {
                                                        setRef(inputref);
                                                    }}
                                                    defaultValue={
                                                        items[id][0].customField
                                                            .groupName
                                                    }
                                                    onChange={(e) => {
                                                        props.onGroupNameChange(
                                                            e.target.value,
                                                            items[id][0]
                                                                .customField
                                                                .groupId
                                                        );
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                />
                                            </Grow>
                                        </ClickAwayListener>
                                    ) : (
                                        <div
                                            onClick={(e) => {
                                                multipleClickHandler({
                                                    2: () => {
                                                        props.onToggleGroupNameEdit(
                                                            true,
                                                            items[id][0]
                                                                .customField
                                                                .groupId
                                                        );
                                                    },
                                                });
                                            }}
                                            className={styles.groupHeaderText}
                                        >
                                            {items[id][0].customField.groupName}
                                        </div>
                                    )}
                                </div>
                                <Collapse
                                    in={items[id][0].customField.groupOpen}
                                >
                                    <div className={styles.groupSpriteList}>
                                        <div
                                            className={
                                                styles.groupHeaderPlaceholder
                                            }
                                        ></div>
                                        {items[id].map((sprite, cindex) => {
                                            //   console.log('jiahou',pindex+cindex)
                                            //  index+1+cindex
                                            // If the sprite has just received a block drop, used for green highlight
                                            const receivedBlocks =
                                                hoveredTarget.sprite ===
                                                    sprite.id &&
                                                sprite.id !== editingTarget &&
                                                hoveredTarget.receivedBlocks;

                                            // If the sprite is indicating it can receive block dropping, used for blue highlight
                                            let isRaised =
                                                !receivedBlocks &&
                                                raised &&
                                                sprite.id !== editingTarget;

                                            // A sprite is also raised if a costume or sound is being dragged.
                                            // Note the absence of the self-sharing check: a sprite can share assets with itself.
                                            // This is a quirk of 2.0, but seems worth leaving possible, it
                                            // allows quick (albeit unusual) duplication of assets.

                                            isRaised =
                                                isRaised ||
                                                [
                                                    DragConstants.COSTUME,
                                                    DragConstants.SOUND,
                                                    DragConstants.BACKPACK_COSTUME,
                                                    DragConstants.BACKPACK_SOUND,
                                                    DragConstants.BACKPACK_CODE,
                                                ].includes(draggingType);
                                            //  console.log('case2sprite',sprite)
                                            return (
                                                <SortableAsset
                                                    className={classNames(
                                                        styles.spriteWrapper,
                                                        {
                                                            [styles.placeholder]:
                                                                isSpriteDrag &&
                                                                index ===
                                                                    draggingIndex,
                                                        }
                                                    )}
                                                    index={
                                                        sprite.customField
                                                            .spriteIndexInGroup
                                                    }
                                                    key={sprite.name}
                                                    onAddSortable={
                                                        onAddSortable
                                                    }
                                                    onRemoveSortable={
                                                        onRemoveSortable
                                                    }
                                                >
                                                    <ThrottledSpriteSelectorItem
                                                        asset={
                                                            sprite.costume &&
                                                            sprite.costume.asset
                                                        }
                                                        className={classNames(
                                                            styles.sprite,
                                                            {
                                                                [styles.raised]:
                                                                    isRaised,
                                                                [styles.receivedBlocks]:
                                                                    receivedBlocks,
                                                            }
                                                        )}
                                                        dragPayload={sprite.id}
                                                        dragType={
                                                            DragConstants.GROUP
                                                        }
                                                        id={sprite.id}
                                                        index={index}
                                                        key={sprite.id}
                                                        name={sprite.name}
                                                        selected={
                                                            sprite.id ===
                                                            selectedId
                                                        }
                                                        onClick={onSelectSprite}
                                                        onDeleteButtonClick={
                                                            onDeleteSprite
                                                        }
                                                        onDuplicateButtonClick={
                                                            onDuplicateSprite
                                                        }
                                                        onCreateGroupClick={
                                                            onCreateGroupBySprite
                                                        }
                                                        onExportButtonClick={
                                                            onExportSprite
                                                        }
                                                        inGroup={true}
                                                        costumeTabsVisible={
                                                            costumeTabsVisible
                                                        }
                                                    />
                                                </SortableAsset>
                                            );
                                        })}
                                    </div>
                                </Collapse>
                            </div>
                        );
                    }
                })}
                <div
                    className={styles.otherPart}
                    onMouseEnter={(e) => {
                        handleMouseEnter(e, 0, "other-down");
                    }}
                    onMouseLeave={(e) => {
                        handleMouseLeave();
                    }}
                ></div>
            </Box>
        </Box>
    );
};

SpriteGroupListsObj.propTypes = {
    containerRef: PropTypes.func,
    draggingIndex: PropTypes.number,
    draggingType: PropTypes.oneOf(Object.keys(DragConstants)),
    editingTarget: PropTypes.string,
    hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool,
        sprite: PropTypes.string,
    }),
    // items: PropTypes.arrayOf(
    //     PropTypes.shape({
    //         costume: PropTypes.shape({
    //             url: PropTypes.string,
    //             name: PropTypes.string.isRequired,
    //             bitmapResolution: PropTypes.number.isRequired,
    //             rotationCenterX: PropTypes.number.isRequired,
    //             rotationCenterY: PropTypes.number.isRequired,
    //         }),
    //         name: PropTypes.string.isRequired,
    //         order: PropTypes.number.isRequired,
    //     })
    // ),
    items: PropTypes.any, //items改了以后有可能是array,也有可能是Object。
    onAddSortable: PropTypes.func,
    onDeleteSprite: PropTypes.func,
    onDuplicateSprite: PropTypes.func,
    onCreateGroupBySprite: PropTypes.func,
    handleMouseEnter: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    onGroupNameChange: PropTypes.func,
    onToggleGroupNameEdit: PropTypes.func,
    onToggleGroupOpen: PropTypes.func,
    onExportSprite: PropTypes.func,
    onRemoveSortable: PropTypes.func,
    handleMouseDown: PropTypes.func,
    onSelectSprite: PropTypes.func,
    ordering: PropTypes.arrayOf(PropTypes.number),
    raised: PropTypes.bool,
    selectedId: PropTypes.string,
    isEdit: PropTypes.bool,
    setRef: PropTypes.func,
    costumeTabsVisible: PropTypes.bool,
};

export default SortableHOC(SpriteGroupListsObj);
