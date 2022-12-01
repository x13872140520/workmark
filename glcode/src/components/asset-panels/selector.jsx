import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";
import SpriteSelectorItemCostume from "../../containers/sprite-selector-item-costume.jsx";
import Box from "../box/box.jsx";
// import ActionMenu from '../action-menu/action-menu.jsx';
import ActionMenuNew from "../action-menu-new/action-menu-new.jsx";
import SortableAsset from "./sortable-asset.jsx";
import SortableHOC from "../../lib/sortable-hoc.jsx";
import DragConstants from "../../lib/drag-constants";

import styles from "./selector.css";

const Selector = (props) => {
    const {
        buttons,
        containerRef,
        dragType,
        isRtl,
        items,
        selectedItemIndex,
        draggingIndex,
        draggingType,
        ordering,
        onAddSortable,
        onRemoveSortable,
        onDeleteClick,
        onDuplicateClick,
        onOpen,
        onExportClick,
        onItemClick,
    } = props;

    const isRelevantDrag = draggingType === dragType;

    let newButtonSection = null;

    if (buttons.length > 0) {
        const { img, title, onClick } = buttons[0];
        const moreButtons = buttons.slice(1);
        newButtonSection = (
            // <Box className={styles.newButtons}>
            //     <ActionMenuNew
            //         img={img}
            //         moreButtons={moreButtons}
            //         title={title}
            //         tooltipPlace={isRtl ? "left" : "right"}
            //         onClick={onClick}
            //     />
            // </Box>
            <ActionMenuNew
                img={img}
                moreButtons={moreButtons}
                title={title}
                tooltipPlace={isRtl ? "left" : "right"}
                onClick={onClick}
            />
        );
    }
    console.log("items", items);
    return (
        <Box className={styles.wrapper} componentRef={containerRef}>
            <Box className={styles.listArea}>
                {items.map((item, index) => (
                    <SortableAsset
                        id={item.name}
                        index={isRelevantDrag ? ordering.indexOf(index) : index}
                        key={item.name}
                        onAddSortable={onAddSortable}
                        onRemoveSortable={onRemoveSortable}
                    >
                        <SpriteSelectorItemCostume
                            asset={item.asset}
                            className={classNames(styles.listItem, {
                                [styles.placeholder]:
                                    isRelevantDrag && index === draggingIndex,
                            })}
                            costumeURL={item.url}
                            details={item.details}
                            dragPayload={item.dragPayload}
                            dragType={dragType}
                            id={index}
                            index={index}
                            name={item.name}
                            number={index + 1 /* 1-indexed */}
                            selected={index === selectedItemIndex}
                            onClick={onItemClick}
                            onDeleteButtonClick={onDeleteClick}
                            onDuplicateButtonClick={onDuplicateClick}
                            onEditedOpen={onOpen}
                            onExportButtonClick={onExportClick}
                        />
                    </SortableAsset>
                ))}
            </Box>
            {newButtonSection}
        </Box>
    );
};

Selector.propTypes = {
    buttons: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            img: PropTypes.string.isRequired,
            onClick: PropTypes.func,
        })
    ),
    containerRef: PropTypes.func,
    dragType: PropTypes.oneOf(Object.keys(DragConstants)),
    draggingIndex: PropTypes.number,
    draggingType: PropTypes.oneOf(Object.keys(DragConstants)),
    isRtl: PropTypes.bool,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            url: PropTypes.string,
            name: PropTypes.string.isRequired,
        })
    ),
    onAddSortable: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onDuplicateClick: PropTypes.func,
    onOpen: PropTypes.func,
    onExportClick: PropTypes.func,
    onItemClick: PropTypes.func.isRequired,
    onRemoveSortable: PropTypes.func,
    ordering: PropTypes.arrayOf(PropTypes.number),
    selectedItemIndex: PropTypes.number.isRequired,
    editedItemIsOpen: PropTypes.bool,
};

export default SortableHOC(Selector);
