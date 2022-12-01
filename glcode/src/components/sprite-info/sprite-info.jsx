import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Box from "../box/box.jsx";
import Label from "../forms/label.jsx";
import Input from "../forms/input.jsx";
import BufferedInputHOC from "../forms/buffered-input-hoc.jsx";
import DirectionPicker from "../../containers/direction-picker.jsx";

import {
    injectIntl,
    intlShape,
    defineMessages,
    FormattedMessage,
} from "react-intl";

import { STAGE_DISPLAY_SIZES } from "../../lib/layout-constants.js";
import { isWideLocale } from "../../lib/locale-utils.js";

import styles from "./sprite-info.css";

import xIcon from "./icon--x.svg";
import yIcon from "./icon--y.svg";
import showIcon from "./icon--show.svg";
import hideIcon from "./icon--hide.svg";
import doglogoPne from "./doglogoPne.svg";
import dilogopfalse from "./dilogopfalse.svg";
//input样式
const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    spritePlaceholder: {
        id: "gui.SpriteInfo.spritePlaceholder",
        defaultMessage: "Name",
        description: "Placeholder text for sprite name",
    },
    disabled: {
        id: "gui.SpriteInfo.disabled",
        defaultMessage: "Disabled",
        description: "Label for disabled button",
    },
});

class SpriteInfo extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (
            this.props.rotationStyle !== nextProps.rotationStyle ||
            this.props.disabled !== nextProps.disabled ||
            this.props.name !== nextProps.name ||
            this.props.stageSize !== nextProps.stageSize ||
            this.props.visible !== nextProps.visible ||
            this.props.thertrueKey != nextProps.thertrueKey ||
            this.props.selectedSprite != nextProps.selectedSprite ||
            // Only update these if rounded value has changed
            Math.round(this.props.direction) !==
                Math.round(nextProps.direction) ||
            Math.round(this.props.size) !== Math.round(nextProps.size) ||
            Math.round(this.props.x) !== Math.round(nextProps.x) ||
            Math.round(this.props.y) !== Math.round(nextProps.y)
        );
    }
    render() {
        const { stageSize, checkstat, thertrueKey } = this.props;

        const sprite = (
            <FormattedMessage
                defaultMessage="Sprite"
                description="Sprite info label"
                id="gui.SpriteInfo.sprite"
            />
        );
        const showLabel = (
            <FormattedMessage
                defaultMessage="Show"
                description="Sprite info show label"
                id="gui.SpriteInfo.show"
            />
        );
        const sizeLabel = (
            <FormattedMessage
                defaultMessage="Size"
                description="Sprite info size label"
                id="gui.SpriteInfo.size"
            />
        );

        const labelAbove = isWideLocale(this.props.intl.locale);

        const spriteNameInput = (
            <BufferedInput
                className={classNames(styles.spriteInput, {
                    [styles.columnInput]: labelAbove,
                })}
                disabled={
                    this.props.disabled ||
                    this.props.selectedSprite.isStage == true
                }
                placeholder={this.props.intl.formatMessage(
                    messages.spritePlaceholder
                )}
                tabIndex="0"
                type="text"
                value={
                    this.props.disabled ||
                    this.props.selectedSprite.isStage == true
                        ? ""
                        : this.props.name || ""
                }
                onSubmit={this.props.onChangeName}
            />
        );

        const xPosition = (
            <div className={styles.group}>
                {/* {stageSize === STAGE_DISPLAY_SIZES.large ? (
                    <div className={styles.iconWrapper}>
                        <img
                            aria-hidden="true"
                            className={classNames(styles.xIcon, styles.icon)}
                            src={xIcon}
                        />
                    </div>
                ) : null} */}
                <Label text="x">
                    <BufferedInput
                        small
                        disabled={
                            this.props.disabled ||
                            this.props.selectedSprite.isStage == true
                        }
                        placeholder="x"
                        tabIndex="0"
                        type="text"
                        value={
                            this.props.disabled ||
                            this.props.selectedSprite.isStage == true
                                ? ""
                                : Math.round(this.props.x) || ""
                        }
                        onSubmit={this.props.onChangeX}
                    />
                </Label>
            </div>
        );

        const yPosition = (
            <div className={styles.group}>
                {/* {
                    (stageSize === STAGE_DISPLAY_SIZES.large) ?
                        <div className={styles.iconWrapper}>
                            <img
                                aria-hidden="true"
                                className={classNames(styles.yIcon, styles.icon)}
                                src={yIcon}
                            />
                        </div> :
                        null
                } */}
                <Label text="y">
                    <BufferedInput
                        small
                        disabled={
                            this.props.disabled ||
                            this.props.selectedSprite.isStage == true
                        }
                        placeholder="y"
                        tabIndex="0"
                        type="text"
                        value={
                            this.props.disabled ||
                            this.props.selectedSprite.isStage == true
                                ? ""
                                : Math.round(this.props.y) || ""
                        }
                        onSubmit={this.props.onChangeY}
                    />
                </Label>
            </div>
        );

        if (stageSize === STAGE_DISPLAY_SIZES.small) {
            return (
                <Box className={styles.spriteInfo}>
                    <div className={classNames(styles.row, styles.rowPrimary)}>
                        <div className={styles.group}>{spriteNameInput}</div>
                    </div>
                    <div
                        className={classNames(styles.row, styles.rowSecondary)}
                    >
                        {xPosition}
                        {yPosition}
                    </div>
                </Box>
            );
        }

        return (
            <Box className={styles.spriteInfo}>
                <div className={classNames(styles.row, styles.rowPrimary)}>
                    <div className={styles.group}>
                        <Label secondary above={labelAbove} text={sprite}>
                            {spriteNameInput}
                        </Label>
                    </div>
                    {xPosition}
                    {yPosition}
                    {/* 遮罩成 */}
                </div>

                <div className={classNames(styles.row, styles.rowSecondary)}>
                    <div className={labelAbove ? styles.column : styles.group}>
                        {stageSize === STAGE_DISPLAY_SIZES.large ? (
                            <Label secondary text={showLabel} />
                        ) : null}
                        <div className={styles.radioWrapper}>
                            {checkstat === 2 ? (
                                <div
                                    className={classNames(
                                        styles.radio,
                                        styles.radioFirst,
                                        styles.iconWrapper,
                                        {
                                            [styles.isActive]:
                                                this.props.visible &&
                                                !this.props.disabled,
                                            [styles.isDisabled]:
                                                this.props.disabled ||
                                                this.props.selectedSprite
                                                    .isStage == true,
                                        }
                                    )}
                                    tabIndex="0"
                                    onClick={this.props.onClickVisible}
                                    onKeyPress={this.props.onPressVisible}
                                >
                                    <img
                                        className={styles.icon}
                                        src={showIcon}
                                    />
                                </div>
                            ) : (
                                <div
                                    className={classNames(
                                        styles.radio,
                                        styles.radioLast,
                                        styles.iconWrapper,
                                        {
                                            [styles.isActive]:
                                                !this.props.visible &&
                                                !this.props.disabled,
                                            [styles.isDisabled]:
                                                this.props.disabled ||
                                                this.props.selectedSprite
                                                    .isStage == true,
                                        }
                                    )}
                                    tabIndex="0"
                                    onClick={this.props.onClickNotVisible}
                                    onKeyPress={this.props.onPressNotVisible}
                                >
                                    <img
                                        className={styles.icon}
                                        src={hideIcon}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className={classNames(styles.group, styles.largerInput)}
                    >
                        <Label secondary above={labelAbove} text={sizeLabel}>
                            <BufferedInput
                                small
                                disabled={
                                    this.props.disabled ||
                                    this.props.selectedSprite.isStage == true
                                }
                                label={sizeLabel}
                                tabIndex="0"
                                type="text"
                                value={
                                    this.props.disabled ||
                                    this.props.selectedSprite.isStage == true
                                        ? ""
                                        : Math.round(this.props.size) || ""
                                }
                                onSubmit={this.props.onChangeSize}
                            />
                        </Label>
                    </div>
                    <div
                        className={classNames(styles.group, styles.largerInput)}
                    >
                        <DirectionPicker
                            direction={Math.round(this.props.direction)}
                            disabled={
                                this.props.disabled ||
                                this.props.selectedSprite.isStage == true
                            }
                            labelAbove={labelAbove}
                            rotationStyle={this.props.rotationStyle}
                            onChangeDirection={this.props.onChangeDirection}
                            onChangeRotationStyle={
                                this.props.onChangeRotationStyle
                            }
                        />
                    </div>
                </div>
                {this.props.selectedSprite.isStage == true ? null : (
                    <div
                        // className={styles.diglog}
                        className={classNames(styles.row, styles.rowSecondary)}
                    >
                        <div
                            className={classNames(
                                styles.group,
                                styles.largerInput
                            )}
                        >
                            <Label
                                secondary
                                above={labelAbove}
                                text={this.props.intl.formatMessage(
                                    messages.disabled
                                )}
                            >
                                <img
                                    onClick={this.props.onClickNotCheck}
                                    src={
                                        thertrueKey ? dilogopfalse : doglogoPne
                                    }
                                />
                            </Label>
                        </div>
                    </div>
                )}
            </Box>
        );
    }
}

SpriteInfo.propTypes = {
    direction: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
    selectedSprite: PropTypes.object,
    intl: intlShape,
    name: PropTypes.string,
    onChangeDirection: PropTypes.func,
    onChangeName: PropTypes.func,
    onChangeRotationStyle: PropTypes.func,
    onChangeSize: PropTypes.func,
    onChangeX: PropTypes.func,
    onChangeY: PropTypes.func,
    thertrueKey: PropTypes.bool,
    onClickNotVisible: PropTypes.func,
    onClickVisible: PropTypes.func,
    onClickNotCheck: PropTypes.func,
    onPressNotVisible: PropTypes.func,
    onPressVisible: PropTypes.func,
    rotationStyle: PropTypes.string,
    checkstat: PropTypes.number,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    visible: PropTypes.bool,
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default injectIntl(SpriteInfo);
