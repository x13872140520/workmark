import PropTypes from "prop-types";
import React from "react";
import { defineMessages, injectIntl, intlShape } from "react-intl";

import Box from "../box/box.jsx";
import SpriteInfo from "../../containers/sprite-info.jsx";
import SpriteGroupLists from "./sprite-group-lists.jsx";
import SpriteGroupListsObj from "./sprite-group-lists-obj.jsx";
import ActionMenuBig from "../action-menu-big/action-menu-big.jsx";
import { STAGE_DISPLAY_SIZES } from "../../lib/layout-constants";
import { isRtl } from "scratch-l10n";

import styles from "./sprite-group-selectors.css";

import fileUploadIcon from "../action-menu/icon--file-upload.svg";
import paintIcon from "../action-menu-big/icon--draw.svg";
import spriteIcon from "../action-menu-big/icon--draw.svg";
import surpriseIcon from "../action-menu-big/icon--random.svg";
import searchIcon from "../action-menu-big/icon--library.svg";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
const messages = defineMessages({
    addSpriteFromLibrary: {
        id: "gui.spriteSelector.addSpriteFromLibrary",
        description: "Button to add a sprite in the target pane from library",
        defaultMessage: "Choose a Material",
    },
    addSpriteFromPaint: {
        id: "gui.spriteSelector.addSpriteFromPaint",
        description: "Button to add a sprite in the target pane from paint",
        defaultMessage: "Paint",
    },
    addSpriteFromSurprise: {
        id: "gui.spriteSelector.addSpriteFromSurprise",
        description: "Button to add a random sprite in the target pane",
        defaultMessage: "Surprise",
    },
    addSpriteFromFile: {
        id: "gui.spriteSelector.addSpriteFromFile",
        description: "Button to add a sprite in the target pane from file",
        defaultMessage: "Upload Sprite",
    },
});

const SpriteGroupSelectorComponents = function (props) {
    const {
        editingTarget,
        hoveredTarget,
        intl,
        onChangeSpriteDirection,
        onChangeSpriteName,
        onChangeSpriteRotationStyle,
        onChangeSpriteSize,
        onChangeSpriteVisibility,
        onChangeSpriteX,
        onChangeSpriteY,
        onDrop,
        onDeleteSprite,
        onDuplicateSprite,
        onGroupNameChange,
        onToggleGroupNameEdit,
        onToggleGroupOpen,
        onCreateGroupBySprite,
        handleMouseDown,
        onExportSprite,
        onFileUploadClick,
        onNewSpriteClick,
        onPaintSpriteClick,
        onSelectSprite,
        handleMouseEnter,
        handleMouseLeave,
        onSpriteUpload,
        onSurpriseSpriteClick,
        onNewSprite3in1Click,
        addMenuVisible,
        clickAwayDivWidth,
        handleToggleAddMenuVisible,
        raised,
        selectedId,
        spriteFileInput,
        sprites,
        isEdit,
        stageSize,
        setRef,
        costumeTabsVisible,
        ...componentProps
    } = props;
    let selectedSprite = sprites[selectedId];
    let spriteInfoDisabled = false;
    const tempList = {};
    const arr = [];
    if (typeof selectedSprite === "undefined") {
        selectedSprite = {};
        spriteInfoDisabled = true;
    }
    // console.log('magic',Object.keys(sprites).map(id => sprites[id]))
    var items = Object.keys(sprites).map((id) => sprites[id]);
    try {
        items.map((item, index) => {
            // console.log('currentitem',item,item.customField,item.customField.groupName,item.customField.groupIndex)
            if (Object.keys(item.customField).length == 0) {
                tempList[item.id] = item;
            } else if (
                Object.keys(item.customField).length != 0 &&
                item.customField.groupId != ""
            ) {
                try {
                    const whereid = item.customField.groupId.substring(
                        0,
                        item.customField.groupId.lastIndexOf("g")
                    );
                    if (Array.isArray(tempList[whereid])) {
                        tempList[whereid].push(item);
                    } else {
                        tempList[whereid] = [item];
                    }
                } catch (e) {
                    console.log(e);
                }

                // 渲染数据的顺序是通过cssorder,我们需要设置好spriteIndexInGroup,groupIndex,绑定到对应的order属性就行。
                //
            }
        });
    } catch (e) {
        console.log(e);
    }
    return (
        <Box className={styles.spriteSelector} {...componentProps}>
            <SpriteGroupListsObj
                isEdit={isEdit}
                editingTarget={editingTarget}
                hoveredTarget={hoveredTarget}
                items={tempList}
                raised={raised}
                selectedId={selectedId}
                onDeleteSprite={onDeleteSprite}
                onDrop={onDrop}
                onDuplicateSprite={onDuplicateSprite}
                handleMouseDown={handleMouseDown}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                onCreateGroupBySprite={onCreateGroupBySprite}
                onGroupNameChange={onGroupNameChange}
                onToggleGroupNameEdit={onToggleGroupNameEdit}
                onToggleGroupOpen={onToggleGroupOpen}
                onExportSprite={onExportSprite}
                onSelectSprite={onSelectSprite}
                setRef={setRef}
                costumeTabsVisible={costumeTabsVisible}
            />
            {/* <SpriteGroupLists
                editingTarget={editingTarget}
                hoveredTarget={hoveredTarget}
                items={Object.keys(sprites).map(id => sprites[id])}
                raised={raised}
                selectedId={selectedId}
                onDeleteSprite={onDeleteSprite}
                onDrop={onDrop}
                onDuplicateSprite={onDuplicateSprite}
                onCreateGroupBySprite={onCreateGroupBySprite}
                onExportSprite={onExportSprite}
                onSelectSprite={onSelectSprite}
            /> */}
            {addMenuVisible ? (
                <ClickAwayListener
                    onClickAway={(e) => {
                        console.log(e);
                        console.log("onClickAway");
                        handleToggleAddMenuVisible(false);
                    }}
                >
                    <ActionMenuBig
                        className={styles.addButton}
                        img={spriteIcon}
                        handleToggleAddMenuVisible={handleToggleAddMenuVisible}
                        clickAwayDivWidth={clickAwayDivWidth}
                        moreButtons={[
                            {
                                title: intl.formatMessage(
                                    messages.addSpriteFromFile
                                ),
                                img: fileUploadIcon,
                                onClick: onFileUploadClick,
                                fileAccept:
                                    ".svg, .png, .bmp, .jpg, .jpeg, .sprite2, .sprite3, .gif",
                                fileChange: onSpriteUpload,
                                fileInput: spriteFileInput,
                                fileMultiple: true,
                            },
                            {
                                title: intl.formatMessage(
                                    messages.addSpriteFromSurprise
                                ),
                                img: surpriseIcon,
                                onClick: onSurpriseSpriteClick, // TODO need real function for this
                            },
                            {
                                title: intl.formatMessage(
                                    messages.addSpriteFromPaint
                                ),
                                img: paintIcon,
                                onClick: onPaintSpriteClick, // TODO need real function for this
                            },
                            {
                                title: intl.formatMessage(
                                    messages.addSpriteFromLibrary
                                ),
                                img: searchIcon,
                                onClick: onNewSprite3in1Click,
                            },
                        ]}
                        title={intl.formatMessage(
                            messages.addSpriteFromLibrary
                        )}
                        tooltipPlace={isRtl(intl.locale) ? "right" : "left"}
                        onClick={onNewSprite3in1Click}
                    />
                </ClickAwayListener>
            ) : null}
        </Box>
    );
};

SpriteGroupSelectorComponents.propTypes = {
    editingTarget: PropTypes.string,
    hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool,
    }),
    intl: intlShape.isRequired,
    onChangeSpriteDirection: PropTypes.func,
    onChangeSpriteName: PropTypes.func,
    onChangeSpriteRotationStyle: PropTypes.func,
    onChangeSpriteSize: PropTypes.func,
    onChangeSpriteVisibility: PropTypes.func,
    onChangeSpriteX: PropTypes.func,
    onChangeSpriteY: PropTypes.func,
    onDeleteSprite: PropTypes.func,
    onDrop: PropTypes.func,
    onDuplicateSprite: PropTypes.func,
    onCreateGroupBySprite: PropTypes.func,
    onGroupNameChange: PropTypes.func,
    onToggleGroupNameEdit: PropTypes.func,
    onToggleGroupOpen: PropTypes.func,
    handleMouseDown: PropTypes.func,
    onExportSprite: PropTypes.func,
    onFileUploadClick: PropTypes.func,
    onNewSpriteClick: PropTypes.func,
    onPaintSpriteClick: PropTypes.func,
    onSelectSprite: PropTypes.func,
    handleMouseEnter: PropTypes.func,
    handleMouseLeave: PropTypes.func,
    onSpriteUpload: PropTypes.func,
    onSurpriseSpriteClick: PropTypes.func,
    onNewSprite3in1Click: PropTypes.func,
    addMenuVisible: PropTypes.bool,
    clickAwayDivWidth: PropTypes.string,
    handleToggleAddMenuVisible: PropTypes.func,
    setRef: PropTypes.func,
    raised: PropTypes.bool,
    selectedId: PropTypes.string,
    spriteFileInput: PropTypes.func,
    sprites: PropTypes.shape({
        id: PropTypes.shape({
            costume: PropTypes.shape({
                url: PropTypes.string,
                name: PropTypes.string.isRequired,
                bitmapResolution: PropTypes.number.isRequired,
                rotationCenterX: PropTypes.number.isRequired,
                rotationCenterY: PropTypes.number.isRequired,
            }),
            name: PropTypes.string.isRequired,
            order: PropTypes.number.isRequired,
        }),
    }),
    isEdit: PropTypes.bool,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    costumeTabsVisible: PropTypes.bool,
};

export default injectIntl(SpriteGroupSelectorComponents);
