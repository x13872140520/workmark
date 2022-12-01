import PropTypes from "prop-types";
import React from "react";

import VM from "scratch-vm";
import SpriteLibrary from "../../containers/sprite-library.jsx";
import SpriteLibrary3in1 from "../../containers/sprite-library3in1.jsx";
import SpriteSelectorComponents from "../sprite-selectors/sprite-selectors.jsx";
import SpriteGroupSelectorComponents from "../sprite-group-selectors/sprite-group-selectors.jsx";
import StageSelectorNew from "../../containers/stage-selector-new.jsx";
// import StageSelector from "../../containers/stage-selector.jsx";
import { STAGE_DISPLAY_SIZES } from "../../lib/layout-constants";
import plusIcon from "../../lib/assets/icon--plus.png";
import styles from "./target-panes.css";
import CostumeTabs from "../../containers/costume-tabs.jsx";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {
    IconSinglePlus,
    IconDelete,
} from "../../components/download-icon/download-icon.jsx";

import classNames from "classnames";
/*
 * Pane that contains the sprite selector, sprite info, stage selector,
 * and the new sprite, costume and backdrop buttons
 * @param {object} props Props for the component
 * @returns {React.Component} rendered component
 */
const TargetPanes = ({
    editingTarget,
    fileInputRef,
    hoveredTarget,
    spriteLibraryVisible,
    spriteLibrary3in1Visible,
    CostumeTabsVisible,
    onActivateBlocksTab,
    onChangeSpriteDirection,
    onChangeSpriteName,
    onChangeSpriteRotationStyle,
    onChangeSpriteSize,
    onChangeSpriteVisibility,
    onChangeSpriteX,
    onChangeSpriteY,
    onDeleteSprite,
    onDrop,
    onDuplicateSprite,
    handleMouseDown,
    onCreateGroupBySprite,
    onGroupNameChange,
    onToggleGroupNameEdit,
    onToggleGroupOpen,
    onExportSprite,
    onFileUploadClick,
    onNewSpriteClick,
    onNewSprite3in1Click,
    openCostumePaint,
    closeCostumePaint,
    onPaintSpriteClick,
    onRequestCloseSpriteLibrary,
    onRequestCloseSpriteLibrary3in1,
    onSelectSprite,
    onMouseEnter,
    onMouseLeave,
    onSpriteUpload,
    onSurpriseSpriteClick,
    handleToggleAddMenuVisible,
    handleNewSound,
    raiseSprites,
    stage,
    stageSize,
    sprites,
    setRef,
    isFromAddPaint,
    vm,
    addMenuVisible,
    clickAwayDivWidth,
    ...componentProps
}) => (
    <div
        id="targetPanes"
        className={classNames(styles.targetPane, {
            [styles.expanded]: CostumeTabsVisible,
            [styles.forceHidden]: !CostumeTabsVisible,
        })}
        {...componentProps}
    >
        {/* 此处更新的3合1的新需求(旧的只有角色，现在是角色，背景，声音合在一起了)，旧的隐藏 */}
        {/* <div className={styles.addBtn}>
            <div className={styles.plusBtn} onClick={onNewSpriteClick}>
                <IconSinglePlus className={styles.plusBtnIcon} />
            </div>
        </div> */}
        <div className={styles.addBtn}>
            <div
                className={styles.plusBtn}
                onClick={() => {
                    handleToggleAddMenuVisible(true);
                }}
            >
                {addMenuVisible ? (
                    <IconDelete
                        className={styles.closeBtnIcon}
                        width={16}
                        height={16}
                    />
                ) : (
                    <IconSinglePlus className={styles.plusBtnIcon} />
                )}
            </div>
        </div>
        {/* 舞台区 此处两进两出了*/}
        <div id="StageSelectorNew" className={styles.stageSelectorWrapper}>
            {stage.id && (
                <StageSelectorNew
                    asset={stage.costume && stage.costume.asset}
                    backdropCount={stage.costumeCount}
                    id={stage.id}
                    selected={stage.id === editingTarget}
                    onSelect={onSelectSprite}
                    costumeTabsVisible={CostumeTabsVisible}
                    stage={stage}
                />
            )}
        </div>
        <SpriteGroupSelectorComponents
            editingTarget={editingTarget}
            hoveredTarget={hoveredTarget}
            raised={raiseSprites}
            selectedId={editingTarget}
            spriteFileInput={fileInputRef}
            sprites={sprites}
            onToggleGroupOpen={onToggleGroupOpen}
            stageSize={stageSize}
            onChangeSpriteDirection={onChangeSpriteDirection}
            onChangeSpriteName={onChangeSpriteName}
            onChangeSpriteRotationStyle={onChangeSpriteRotationStyle}
            onChangeSpriteSize={onChangeSpriteSize}
            onChangeSpriteVisibility={onChangeSpriteVisibility}
            onChangeSpriteX={onChangeSpriteX}
            onChangeSpriteY={onChangeSpriteY}
            onDeleteSprite={onDeleteSprite}
            onDrop={onDrop}
            onDuplicateSprite={onDuplicateSprite}
            handleMouseDown={handleMouseDown}
            onCreateGroupBySprite={onCreateGroupBySprite}
            onGroupNameChange={onGroupNameChange}
            onToggleGroupNameEdit={onToggleGroupNameEdit}
            onExportSprite={onExportSprite}
            onFileUploadClick={onFileUploadClick}
            onNewSpriteClick={onNewSpriteClick}
            onPaintSpriteClick={onPaintSpriteClick}
            onSelectSprite={onSelectSprite}
            handleMouseEnter={onMouseEnter}
            handleMouseLeave={onMouseLeave}
            onSpriteUpload={onSpriteUpload}
            onSurpriseSpriteClick={onSurpriseSpriteClick}
            setRef={setRef}
            onNewSprite3in1Click={onNewSprite3in1Click}
            addMenuVisible={addMenuVisible}
            handleToggleAddMenuVisible={handleToggleAddMenuVisible}
            costumeTabsVisible={CostumeTabsVisible}
        />
        {/* <div id="spriteLibraryVisible">
            {spriteLibraryVisible ? (
                <SpriteLibrary
                    vm={vm}
                    onActivateBlocksTab={onActivateBlocksTab}
                    onRequestClose={onRequestCloseSpriteLibrary}
                />
            ) : null}
        </div> */}
        <div id="spriteLibrary3in1Visible">
            {spriteLibrary3in1Visible ? (
                <SpriteLibrary3in1
                    vm={vm}
                    onNewSound={handleNewSound}
                    onActivateBlocksTab={onActivateBlocksTab}
                    onRequestClose={onRequestCloseSpriteLibrary3in1}
                />
            ) : null}
        </div>
        {CostumeTabsVisible ? (
            // <ClickAwayListener
            //     onClickAway={(e) => {
            //         console.log("意外关闭");
            //         console.log(e);
            //         console.log(typeof e.target.className);
            //         if (
            //             typeof e.target.className == "string" &&
            //             e.target.className.indexOf("sprite-hover-icon") != -1
            //         ) {
            //             return;
            //         } else {
            //             closeCostumePaint();
            //         }
            //     }}
            // >
            // <Grow
            //     in={CostumeTabsVisible}
            //     style={{ transformOrigin: "0 50% 0" }}
            // >
            <div className={styles.costumeTabModal}>
                <CostumeTabs vm={vm} isFromAddPaint={isFromAddPaint} />
                <div
                    className={styles.clickAwayDiv}
                    style={{ width: clickAwayDivWidth }}
                    onClick={() => {
                        closeCostumePaint();
                    }}
                ></div>
            </div>
        ) : // </Grow>
        // </ClickAwayListener>
        null}
    </div>
);

const spriteShape = PropTypes.shape({
    costume: PropTypes.shape({
        // asset is defined in scratch-storage's Asset.js
        asset: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        url: PropTypes.string,
        name: PropTypes.string.isRequired,
        // The following are optional because costumes uploaded from disk
        // will not have these properties available
        bitmapResolution: PropTypes.number,
        rotationCenterX: PropTypes.number,
        rotationCenterY: PropTypes.number,
    }),
    costumeCount: PropTypes.number,
    direction: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    order: PropTypes.number,
    size: PropTypes.number,
    visibility: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
});

TargetPanes.propTypes = {
    editingTarget: PropTypes.string,
    extensionLibraryVisible: PropTypes.bool,
    fileInputRef: PropTypes.func,
    hoveredTarget: PropTypes.shape({
        hoveredSprite: PropTypes.string,
        receivedBlocks: PropTypes.bool,
    }),
    onActivateBlocksTab: PropTypes.func.isRequired,
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
    handleMouseDown: PropTypes.func,
    onCreateGroupBySprite: PropTypes.func,
    onGroupNameChange: PropTypes.func,
    onToggleGroupNameEdit: PropTypes.func,
    onExportSprite: PropTypes.func,
    onFileUploadClick: PropTypes.func,
    onNewSpriteClick: PropTypes.func,
    handleToggleAddMenuVisible: PropTypes.func,
    onNewSprite3in1Click: PropTypes.func,
    openCostumePaint: PropTypes.func,
    closeCostumePaint: PropTypes.func,
    onPaintSpriteClick: PropTypes.func,
    onRequestCloseExtensionLibrary: PropTypes.func,
    onRequestCloseSpriteLibrary: PropTypes.func,
    onRequestCloseSpriteLibrary3in1: PropTypes.func,
    onSelectSprite: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onSpriteUpload: PropTypes.func,
    onSurpriseSpriteClick: PropTypes.func,
    setRef: PropTypes.func,
    raiseSprites: PropTypes.bool,
    spriteLibraryVisible: PropTypes.bool,
    spriteLibrary3in1Visible: PropTypes.bool,
    CostumeTabsVisible: PropTypes.bool,
    sprites: PropTypes.objectOf(spriteShape),
    onToggleGroupOpen: PropTypes.func,
    handleNewSound: PropTypes.func,
    stage: spriteShape,
    clickAwayDivWidth: PropTypes.string,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    isFromAddPaint: PropTypes.bool,
    vm: PropTypes.instanceOf(VM),
};

export default TargetPanes;
