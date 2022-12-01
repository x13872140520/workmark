import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import DeleteButton from "../delete-button/delete-button.jsx";
import styles from "./sprite-selector-items.css";
import { ContextMenuTrigger } from "react-contextmenu";
import {
    DangerousMenuItem,
    ContextMenu,
    MenuItem,
} from "../context-menu/context-menu.jsx";
import { FormattedMessage } from "react-intl";

// react-contextmenu requires unique id to match trigger and context menu
let contextMenuId = 0;
const SpriteSelectorItems = (props) => (
    <div
        className={styles.spriteSelectorItemContainer}
        onMouseEnter={() => {
            props.onHoverClick(true);
        }}
        onMouseLeave={() => {
            props.onHoverClick(false);
        }}
    >
        <ContextMenuTrigger
            attributes={{
                className: classNames(
                    props.className,
                    styles.spriteSelectorItem,
                    {
                        [styles.isSelected]: props.selected,
                    }
                ),
                onClick: props.onClick,
                onMouseEnter: props.onMouseEnter,
                onMouseLeave: props.onMouseLeave,
                onMouseDown: props.onMouseDown,
                onTouchStart: props.onMouseDown,
            }}
            disable={props.preventContextMenu}
            id={`${props.name}-${contextMenuId}`}
            ref={props.componentRef}
        >
            {props.selected || props.collapseStatus ? (
                <div
                    className={styles.spriteHoverIcon}
                    onClick={() => {
                        if (props.costumeTabsVisible) {
                            props.closeCostumePaint();
                        } else {
                            props.openCostumePaint();
                        }
                    }}
                >
                    {props.collapseStatus}
                </div>
            ) : null}
            {typeof props.number === "undefined" ? null : (
                <div className={styles.number}>{props.number}</div>
            )}
            {props.costumeURL ? (
                <div className={styles.spriteImageOuter}>
                    <div className={styles.spriteImageInner}>
                        <img
                            className={styles.spriteImage}
                            draggable={false}
                            src={props.costumeURL}
                        />
                    </div>
                </div>
            ) : null}
            <div className={styles.spriteInfo}>
                <div className={styles.spriteName}>{props.name}</div>
                {props.details ? (
                    <div className={styles.spriteDetails}>{props.details}</div>
                ) : null}
            </div>
            {props.selected && props.onDeleteButtonClick ? (
                <DeleteButton
                    className={styles.deleteButton}
                    onClick={props.onDeleteButtonClick}
                />
            ) : null}
            {props.onDuplicateButtonClick ||
            props.onDeleteButtonClick ||
            props.onExportButtonClick ||
            props.onCreateGroupClick ? (
                <ContextMenu id={`${props.name}-${contextMenuId++}`}>
                    {props.onDuplicateButtonClick ? (
                        <MenuItem onClick={props.onDuplicateButtonClick}>
                            <FormattedMessage
                                defaultMessage="duplicate"
                                description="Menu item to duplicate in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDuplicate"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onExportButtonClick ? (
                        <MenuItem onClick={props.onExportButtonClick}>
                            <FormattedMessage
                                defaultMessage="export"
                                description="Menu item to export the selected item"
                                id="gui.spriteSelectorItem.contextMenuExport"
                            />
                        </MenuItem>
                    ) : null}
                    {props.onDeleteButtonClick ? (
                        <DangerousMenuItem onClick={props.onDeleteButtonClick}>
                            <FormattedMessage
                                defaultMessage="delete"
                                description="Menu item to delete in the right click menu"
                                id="gui.spriteSelectorItem.contextMenuDelete"
                            />
                        </DangerousMenuItem>
                    ) : null}
                    {props.onCreateGroupClick && props.inGroup == false ? (
                        <MenuItem onClick={props.onCreateGroupClick}>
                            <FormattedMessage
                                defaultMessage="create group"
                                description="Create group for sprite"
                                id="gui.menuBar.createGroup"
                            />
                        </MenuItem>
                    ) : (
                        <div
                            onClick={(e) => {
                                e.stopPropagation && e.preventDefault;
                            }}
                            className={styles.unClickable}
                        >
                            <FormattedMessage
                                defaultMessage="create group"
                                description="Create group for sprite"
                                id="gui.menuBar.createGroup"
                            />
                        </div>
                    )}
                </ContextMenu>
            ) : null}
        </ContextMenuTrigger>
    </div>
);

SpriteSelectorItems.propTypes = {
    className: PropTypes.string,
    componentRef: PropTypes.func,
    costumeURL: PropTypes.string,
    details: PropTypes.string,
    name: PropTypes.string.isRequired,
    number: PropTypes.number,
    onClick: PropTypes.func,
    onDeleteButtonClick: PropTypes.func,
    onDuplicateButtonClick: PropTypes.func,
    onCreateGroupClick: PropTypes.func,
    onExportButtonClick: PropTypes.func,
    onCollapseClick: PropTypes.func,
    openCostumePaint: PropTypes.func,
    closeCostumePaint: PropTypes.func,
    onMouseDown: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    preventContextMenu: PropTypes.bool,
    selected: PropTypes.bool.isRequired,
    collapseStatus: PropTypes.bool.isRequired,
    onHoverClick: PropTypes.func,
    costumeTabsVisible: PropTypes.bool,
};

export default SpriteSelectorItems;
