import PropTypes from "prop-types";
import React, { Fragment } from "react";
import classNames from "classnames";
import { FormattedMessage } from "react-intl";

import styles from "./cards-new.css";
import shrinkIcon from "./icon--shrink.svg";
import expandIcon from "./icon--expand.svg";

import rightArrow from "./icon--next.svg";
import leftArrow from "./icon--prev.svg";

import helpIcon from "../../lib/assets/icon--tutorials.svg";
import closeIcon from "./icon--close.svg";

import { translateVideo } from "../../lib/libraries/decks/translate-video.js";
import { translateImage } from "../../lib/libraries/decks/translate-image.js";
import { ConfirmationDialogRaw } from "../dialog-confirm/dialog-confirm.jsx";
const CardHeader = ({
    onCloseCards,
    onShrinkExpandCards,
    onShowAll,
    expanded,
    confirmOpen,
    closeConfirm,
    openConfirm,
    resizeCard,
}) => (
    <div
        className={
            expanded
                ? styles.headerButtons
                : classNames(styles.headerButtons, styles.headerButtonsHidden)
        }
    >
        <div className={styles.headerButtonsRight}>
            <div className={styles.headerTitle}>
                {window.sessionStorage.getItem("fileName")
                    ? window.sessionStorage.getItem("fileName")
                    : ""}
            </div>
            <div
                className={styles.shrinkExpandButton}
                onClick={() => {
                    setTimeout(function () {
                        onShrinkExpandCards();
                    }, 200);
                    resizeCard(expanded);
                }}
            >
                <img
                    draggable={false}
                    src={expanded ? shrinkIcon : expandIcon}
                />
                {expanded ? (
                    <FormattedMessage
                        defaultMessage="Shrink"
                        description="Title for button to shrink how-to card"
                        id="gui.cards.shrink"
                    />
                ) : (
                    <FormattedMessage
                        defaultMessage="Expand"
                        description="Title for button to expand how-to card"
                        id="gui.cards.expand"
                    />
                )}
            </div>
            <div className={styles.removeButton} onClick={openConfirm}>
                <img className={styles.closeIcon} src={closeIcon} />
                <FormattedMessage
                    defaultMessage="Close"
                    description="Title for button to close how-to card"
                    id="gui.cards.close"
                />
            </div>
            <ConfirmationDialogRaw
                title={
                    <FormattedMessage
                        defaultMessage="Close"
                        description="Title for dialog to close current player"
                        id="gui.sharedMessages.confirmPlayerWarning"
                    />
                }
                content={
                    <FormattedMessage
                        defaultMessage="After closing, you need to re-enter to open it. Are you sure to close it?"
                        description="tip for user try to close current player"
                        id="gui.sharedMessages.closePlayerWarning"
                    />
                }
                keepMounted
                open={confirmOpen}
                onConfirm={onCloseCards}
                onCancel={closeConfirm}
                cancelText={
                    <FormattedMessage
                        defaultMessage="Cancel"
                        description="Button in prompt for cancel the dialog"
                        id="gui.customProcedures.cancel"
                    />
                }
                saveText={
                    <FormattedMessage
                        defaultMessage="OK"
                        description="Button in prompt for confirming the dialog"
                        id="gui.prompt.ok"
                    />
                }
            />
        </div>
    </div>
);

class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player: null,
            playerid: "playerid" + new Date() * 1,
            ifResizing: false,
            originX: 0,
            originY: 0,
            finalX: 0,
            finalY: 0,
        };
    }
    componentDidMount() {
        console.log("videostepinit", this.props);

        var player = TCPlayer(this.state.playerid, {
            // player-container-id 为播放器容器 ID，必须与 html 中一致
            fileID: window.sessionStorage.getItem("fileID")
                ? window.sessionStorage.getItem("fileID")
                : "387702299186115471", // 请传入需要播放的视频 fileID（必须）
            appID: window.sessionStorage.getItem("appID")
                ? window.sessionStorage.getItem("appID")
                : "1500005692", // 请传入点播账号的 appID（必须）
            //私有加密播放需填写 psign， psign 即超级播放器签名，签名介绍和生成方式参见链接：https://cloud.tencent.com/document/product/266/42436
            //psign:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6MTUwMDAwNTY5NiwiZmlsZUlkIjoiMzcwMTkyNTkyMTI5OTYzNzAxMCIsImN1cnJlbnRUaW1lU3RhbXAiOjE2MjY4NjAxNzYsImV4cGlyZVRpbWVTdGFtcCI6MjYyNjg1OTE3OSwicGNmZyI6InByaXZhdGUiLCJ1cmxBY2Nlc3NJbmZvIjp7InQiOiI5YzkyYjBhYiJ9LCJkcm1MaWNlbnNlSW5mbyI6eyJleHBpcmVUaW1lU3RhbXAiOjI2MjY4NTkxNzksInN0cmljdE1vZGUiOjJ9fQ.Bo5K5ThInc4n8AlzIZQ-CP9a49M2mEr9-zQLH9ocQgI',
        });
        this.setState({
            player: player,
        });
    }
    componentDidUpdate(prevProps) {
        if (!this.props.expanded) {
            this.state.player.pause();
        }
    }
    render() {
        return (
            <div className={styles.stepVideo} id="player-container">
                <video
                    id={this.state.playerid}
                    className={styles.playerContainer}
                    width="414"
                    height="240"
                    preload="auto"
                    playsinline
                    webkit-playsinline
                ></video>
            </div>
        );
    }
}

Video.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onResize: PropTypes.func.isRequired,
};

CardHeader.propTypes = {
    expanded: PropTypes.bool.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onShowAll: PropTypes.func.isRequired,
    onShrinkExpandCards: PropTypes.func.isRequired,
    confirmOpen: PropTypes.bool.isRequired,
    closeConfirm: PropTypes.func,
    openConfirm: PropTypes.func,
    resizeCard: PropTypes.func,
};
const CardsNew = (props) => {
    const style = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 1px #ddd",
        background: "#f0f0f0",
    };
    const {
        dragging,
        isRtl,
        locale,
        confirmOpen,
        closeConfirm,
        openConfirm,
        onActivateDeckFactory,
        onCloseCards,
        onShrinkExpandCards,
        onDrag,
        onStartDrag,
        onEndDrag,
        onShowAll,
        onNextStep,
        onPrevStep,
        showVideos,
        expanded,
        resizeCard,
        ...posProps
    } = props;
    let { x, y } = posProps;
    console.log("posPropsss", openConfirm);
    // Tutorial cards need to calculate their own dragging bounds
    // to allow for dragging the cards off the left, right and bottom
    // edges of the workspace.
    const cardHorizontalDragOffset = 400; // ~80% of card width
    const cardVerticalDragOffset = expanded ? 257 : 0; // ~80% of card height, if expanded
    const menuBarHeight = 48; // TODO: get pre-calculated from elsewhere?
    const wideCardWidth = 500;

    if (x === 0 && y === 0) {
        // initialize positions
        x = isRtl ? -190 - wideCardWidth - cardHorizontalDragOffset : 292;
        x += cardHorizontalDragOffset;
        // The tallest cards are about 320px high, and the default position is pinned
        // to near the bottom of the blocks palette to allow room to work above.
        const tallCardHeight = 320;
        const bottomMargin = 60; // To avoid overlapping the backpack region
        y = window.innerHeight - tallCardHeight - bottomMargin - menuBarHeight;
    }
    return (
        // Custom overlay to act as the bounding parent for the draggable, using values from above

        <div className={styles.cardContainer}>
            <div id="card-div" className={expanded ? styles.card : ""}>
                <CardHeader
                    expanded={expanded}
                    onCloseCards={onCloseCards}
                    onShowAll={onShowAll}
                    onShrinkExpandCards={onShrinkExpandCards}
                    confirmOpen={confirmOpen}
                    closeConfirm={closeConfirm}
                    openConfirm={openConfirm}
                    resizeCard={resizeCard}
                />
                <div className={expanded ? styles.stepBody : styles.hidden}>
                    <Video dragging={dragging} expanded={expanded} />
                </div>
            </div>
        </div>
    );
};

CardsNew.propTypes = {
    dragging: PropTypes.bool.isRequired,
    expanded: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    confirmOpen: PropTypes.bool.isRequired,
    openConfirm: PropTypes.func,
    closeConfirm: PropTypes.func,
    onActivateDeckFactory: PropTypes.func.isRequired,
    onCloseCards: PropTypes.func.isRequired,
    onDrag: PropTypes.func,
    onEndDrag: PropTypes.func,
    onNextStep: PropTypes.func.isRequired,
    onPrevStep: PropTypes.func.isRequired,
    onShowAll: PropTypes.func,
    onShrinkExpandCards: PropTypes.func.isRequired,
    onResize: PropTypes.func,
    onStartDrag: PropTypes.func,
    showVideos: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    resizeCard: PropTypes.func,
};

CardsNew.defaultProps = {
    showVideos: true,
};

export {
    CardsNew as default,
    // Others exported for testability
    Video,
};
