import PropTypes from "prop-types";
import classNames from "classnames";
import React from "react";
import Box from "../box/box.jsx";
import styles from "./blocks.css";
import UndoComponent from "../undo/undo.jsx";
import {
    IconUp,
    IconMinus,
    IconPlus,
    IconUndo,
    IconRedo,
} from "../../components/download-icon/download-icon.jsx";
import { style } from "@mui/system";
const BlocksComponent = (props) => {
    const { containerRef, dragOver, workspace, ...componentProps } = props;
    return (
        <div className="myblockly">
            <div
                className={styles.undoBtn}
                onClick={() => {
                    props.workspace.undo(false);
                    console.log("props.workspace", props.workspace);
                }}
            >
                <IconUndo
                    className={styles.undoColor}
                    width={20}
                    height={20}
                    stroke={"white"}
                    strokeWidth={2}
                />
            </div>
            <div
                className={styles.redoBtn}
                onClick={() => {
                    console.log("redo", props);
                    props.workspace.undo(true);
                }}
            >
                <IconRedo
                    className={styles.redoColor}
                    width={20}
                    height={20}
                    stroke={"white"}
                    strokeWidth={2}
                />
            </div>
            <div
                className={styles.zoomIn}
                onClick={() => {
                    props.workspace.zoomCenter(1.25);
                }}
            >
                <IconPlus className={styles.plusColor} width={20} height={20} />
            </div>
            <div
                className={styles.zoomOut}
                onClick={() => {
                    props.workspace.zoomCenter(-1.25);
                }}
            >
                <IconMinus
                    className={styles.minusColor}
                    width={20}
                    height={20}
                />
            </div>
            <div
                className={styles.alignCenter}
                onClick={() => {
                    props.workspace.scrollCenter();
                }}
            >
                <IconUp className={styles.alignCenterColor} />
            </div>
            {/* <div className={styles.zoomScale} id="zoomScale">
                100%
            </div> */}
            <Box
                className={classNames(styles.blocks, {
                    [styles.dragOver]: dragOver,
                })}
                {...componentProps}
                componentRef={containerRef}
            />
        </div>
    );
};
BlocksComponent.propTypes = {
    containerRef: PropTypes.func,
    dragOver: PropTypes.bool,
    // zoomScale: PropTypes.number,
};
export default BlocksComponent;
