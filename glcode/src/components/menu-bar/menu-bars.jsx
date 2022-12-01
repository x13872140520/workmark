import classNames from "classnames";
import { connect } from "react-redux";
import { compose } from "redux";
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
    intlShape,
} from "react-intl";
import PropTypes from "prop-types";
import bindAll from "lodash.bindall";
import bowser from "bowser";
import React from "react";
import ButtonM from "@material-ui/core/Button";

import VM from "scratch-vm";

import Box from "../box/box.jsx";
import Button from "../button/button.jsx";
import CommunityButton from "./community-button.jsx";
import ShareButton from "./share-button.jsx";
import CustomButton from "./custom-button.jsx";
import { ComingSoonTooltip } from "../coming-soon/coming-soon.jsx";
import Divider from "../divider/divider.jsx";
import LanguageSelector from "../../containers/language-selector.jsx";
import LanguageSelectors from "../../containers/language-selectors.jsx";
import SaveStatus from "./save-status.jsx";
import SBFileUploader from "../../containers/sb-file-uploader.jsx";
import ProjectWatcher from "../../containers/project-watcher.jsx";
import MenuBarMenu from "./menu-bar-menu.jsx";
import { MenuItem, MenuSection } from "../menu/menu.jsx";
import ProjectTitleInput from "./project-title-input.jsx";
import AuthorInfo from "./author-info.jsx";
import AccountNav from "../../containers/account-nav.jsx";
import LoginDropdown from "./login-dropdown.jsx";
import SB3Downloader from "../../containers/sb3-downloader.jsx";
import DeletionRestorer from "../../containers/deletion-restorer.jsx";
import TurboMode from "../../containers/turbo-mode.jsx";
import MenuBarHOC from "../../containers/menu-bar-hoc.jsx";

import { openTipsLibrary } from "../../reducers/modals";
import { setPlayer } from "../../reducers/mode";
import MenuListComposition from "../menu-a/menu-a.jsx";
import Cascader from "../cascader/cascader.jsx";
import {
    useSubscribe,
    usePublish,
    useUnsubscribe,
} from "../../Pusconnect/usePubSub";
// 头部保存和发布
import Menutop from "../menu-topbutton/menutop.jsx";
import {
    autoUpdateProject,
    getIsUpdating,
    getIsShowingProject,
    manualUpdateProject,
    requestNewProject,
    remixProject,
    saveProjectAsCopy,
} from "../../reducers/project-state";
import {
    openAboutMenu,
    closeAboutMenu,
    aboutMenuOpen,
    openAccountMenu,
    closeAccountMenu,
    accountMenuOpen,
    openFileMenu,
    closeFileMenu,
    openSettingMenu,
    closeSettingMenu,
    fileMenuOpen,
    settingMenuOpen,
    openEditMenu,
    closeEditMenu,
    editMenuOpen,
    openLanguageMenu,
    closeLanguageMenu,
    languageMenuOpen,
    openLoginMenu,
    closeLoginMenu,
    loginMenuOpen,
} from "../../reducers/menus";

import collectMetadata from "../../lib/collect-metadata";

import styles from "./menu-bar.css";

// import helpIcon from '../../lib/assets/icon--tutorials.svg';
import helpIcon from "./search-weh.svg";

import mystuffIcon from "./icon--mystuff.png";
import profileIcon from "./icon--profile.png";
import remixIcon from "./icon--remix.svg";
import dropdownCaret from "./dropdown-caret.svg";

//语言的svg
// import languageIcon from '../language-selector/language-icon.svg';

import sarchThree from "./sarch-three.svg";
import srarcgOne from "./srarcg-one.svg";
import languageIcon from "./sar-settint.svg";

import aboutIcon from "./icon--about.svg";

import scratchLogo from "./scratch-logo.svg";

import sharedMessages from "../../lib/shared-messages";
import { style } from "scratch-storage";
import Popper from "@material-ui/core/Popper";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import {
    IconFolder,
    IconBag,
    IconWheel,
    IconHelp,
} from "../download-icon/download-icon.jsx";
const ariaMessages = defineMessages({
    language: {
        id: "gui.menuBar.LanguageSelector",
        defaultMessage: "language selector",
        description: "accessibility text for the language selection menu",
    },
    tutorials: {
        id: "gui.menuBar.tutorialsLibrary",
        defaultMessage: "Tutorials",
        description: "accessibility text for the tutorials button",
    },
    chooseLanguage: {
        id: "gui.menuBar.chooseLanguage",
        defaultMessage: "ChooseLanguage",
        description: "choose your language",
    },
    themeColor: {
        id: "gui.menuBar.theme",
        defaultMessage: "Choose Theme Color",
        description: "choose your theme color",
    },
});

// Scratch作品
const MenuBarItemTooltip = ({
    children,
    className,
    enable,
    id,
    place = "bottom",
}) => {
    if (enable) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ComingSoonTooltip
            className={classNames(styles.comingSoon, className)}
            place={place}
            tooltipClassName={styles.comingSoonTooltip}
            tooltipId={id}
        >
            {children}
        </ComingSoonTooltip>
    );
};

MenuBarItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    enable: PropTypes.bool,
    id: PropTypes.string,
    place: PropTypes.oneOf(["top", "bottom", "left", "right"]),
};

const MenuItemTooltip = ({ id, isRtl, children, className }) => (
    <ComingSoonTooltip
        className={classNames(styles.comingSoon, className)}
        isRtl={isRtl}
        place={isRtl ? "left" : "right"}
        tooltipClassName={styles.comingSoonTooltip}
        tooltipId={id}
    >
        {children}
    </ComingSoonTooltip>
);

MenuItemTooltip.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    id: PropTypes.string,
    isRtl: PropTypes.bool,
};

const AboutButton = (props) => (
    <Button
        className={classNames(styles.menuBarItem, styles.hoverable)}
        iconClassName={styles.aboutIcon}
        iconSrc={aboutIcon}
        onClick={props.onClick}
    />
);

AboutButton.propTypes = {
    onClick: PropTypes.func.isRequired,
};

class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        //所有事件都要在这里绑定
        bindAll(this, [
            "handleClickNew",
            "handleClickRemix",
            "handleClickSave",
            "handleClickSaveAsCopy",
            "handleClickSeeCommunity",
            "handleClickShare",
            "handleKeyPress",
            "handleLanguageMouseUp",
            "handleRestoreOption",
            "getSaveToComputerHandler",
            "restoreOptionMessage",
            "checkouNewClick",
            "handleCearclick",
            "handleSaveAs",
            "checkouUseClock",
        ]);
        this.state = {
            skinIndex: 0,
            chooseLanguageVisible: false,
        };
    }
    handleItemClick = (placement) => (event) => {
        const { currentTarget } = event;
        console.log("currentTarget", currentTarget, placement);
        this.setState((state) => ({
            anchorEl: currentTarget,
            open: state.placement !== placement || !state.open,
            placement,
        }));
    };
    //useSubscribe 在这里发送请求
    checkouUseClock() {
        const publish = usePublish();
        publish("useLogin", true);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyPress);
    }

    // 保存和发布的事件
    checkouNewClick(e) {
        console.log(this.props);
        if (e === 1) {
            console.log("保存");
        } else {
            console.log("发布");
            const publish = usePublish();
            "opendow", true;
        }
    }
    // 新建

    handleCearclick() {
        if (window.scratchConfig && window.scratchConfig.menuBar.crearButton) {
            if (!window.scratchConfig.menuBar.crearButton.handleBefore()) {
                return;
            }
        }

        // 关闭的事件
        this.props.onRequestCloseFile();
    }

    // 另存为
    handleSaveAs() {
        if (window.scratchConfig && window.scratchConfig.menuBar.saveaAs) {
            if (!window.scratchConfig.menuBar.saveaAs.handleBefore()) {
                return;
            }
        }
        this.props.onRequestCloseFile();
    }

    handleClickNew() {
        if (window.scratchConfig && window.scratchConfig.menuBar.newButton) {
            if (!window.scratchConfig.menuBar.newButton.handleBefore()) {
                return;
            }
        }
        // if the project is dirty, and user owns the project, we will autosave.
        // but if they are not logged in and can't save, user should consider
        // downloading or logging in first.
        // Note that if user is logged in and editing someone else's project,
        // they'll lose their work.
        const readyToReplaceProject = this.props.confirmReadyToReplaceProject(
            this.props.intl.formatMessage(sharedMessages.replaceProjectWarning)
        );
        this.props.onRequestCloseFile();
        if (readyToReplaceProject) {
            this.props.onClickNew(
                this.props.canSave && this.props.canCreateNew
            );
        }
        this.props.onRequestCloseFile();
    }
    handleClickRemix() {
        this.props.onClickRemix();
        this.props.onRequestCloseFile();
    }
    handleClickSave() {
        this.props.onClickSave();
        this.props.onRequestCloseFile();
    }
    handleClickSaveAsCopy() {
        this.props.onClickSaveAsCopy();
        this.props.onRequestCloseFile();
    }
    handleClickSeeCommunity(waitForUpdate) {
        if (this.props.shouldSaveBeforeTransition()) {
            this.props.autoUpdateProject(); // save before transitioning to project page
            waitForUpdate(true); // queue the transition to project page
        } else {
            waitForUpdate(false); // immediately transition to project page
        }
    }
    handleClickShare(waitForUpdate) {
        if (!this.props.isShared) {
            if (this.props.canShare) {
                // save before transitioning to project page
                this.props.onShare();
            }
            if (this.props.canSave) {
                // save before transitioning to project page
                this.props.autoUpdateProject();
                waitForUpdate(true); // queue the transition to project page
            } else {
                waitForUpdate(false); // immediately transition to project page
            }
        }
    }
    handleRestoreOption(restoreFun) {
        return () => {
            restoreFun();
            this.props.onRequestCloseEdit();
        };
    }
    handleKeyPress(event) {
        const modifier = bowser.mac ? event.metaKey : event.ctrlKey;
        if (modifier && event.key === "s") {
            this.props.onClickSave();
            event.preventDefault();
        }
    }
    getSaveToComputerHandler(downloadProjectCallback) {
        return () => {
            if (
                window.scratchConfig &&
                window.scratchConfig.menuBar.saveFileButton
            ) {
                if (
                    !window.scratchConfig.menuBar.saveFileButton.handleBefore()
                ) {
                    return;
                }
            }
            this.props.onRequestCloseFile();
            downloadProjectCallback();
            if (this.props.onProjectTelemetryEvent) {
                const metadata = collectMetadata(
                    this.props.vm,
                    this.props.projectTitle,
                    this.props.locale
                );
                this.props.onProjectTelemetryEvent("projectDidSave", metadata);
            }
        };
    }
    handleLanguageMouseUp(e) {
        if (!this.props.languageMenuOpen) {
            this.props.onClickLanguage(e);
        }
    }
    restoreOptionMessage(deletedItem) {
        switch (deletedItem) {
            case "Sprite":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sprite"
                        description="Menu bar item for restoring the last deleted sprite."
                        id="gui.menuBar.restoreSprite"
                    />
                );
            case "Sound":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Sound"
                        description="Menu bar item for restoring the last deleted sound."
                        id="gui.menuBar.restoreSound"
                    />
                );
            case "Costume":
                return (
                    <FormattedMessage
                        defaultMessage="Restore Costume"
                        description="Menu bar item for restoring the last deleted costume."
                        id="gui.menuBar.restoreCostume"
                    />
                );
            default: {
                return (
                    <FormattedMessage
                        defaultMessage="Restore"
                        description="Menu bar item for restoring the last deleted item in its disabled state." /* eslint-disable-line max-len */
                        id="gui.menuBar.restore"
                    />
                );
            }
        }
    }
    buildAboutMenu(onClickAbout) {
        if (!onClickAbout) {
            // hide the button
            return null;
        }
        if (typeof onClickAbout === "function") {
            // make a button which calls a function
            return <AboutButton onClick={onClickAbout} />;
        }
        // assume it's an array of objects
        // each item must have a 'title' FormattedMessage and a 'handleClick' function
        // generate a menu with items for each object in the array
        return (
            <div
                className={classNames(styles.menuBarItem, styles.hoverable, {
                    [styles.active]: this.props.aboutMenuOpen,
                })}
                onMouseUp={this.props.onRequestOpenAbout}
            >
                <img className={styles.aboutIcon} src={aboutIcon} />
                <MenuBarMenu
                    className={classNames(styles.menuBarMenu)}
                    open={this.props.aboutMenuOpen}
                    place={this.props.isRtl ? "right" : "left"}
                    onRequestClose={this.props.onRequestCloseAbout}
                >
                    {onClickAbout.map((itemProps) => (
                        <MenuItem
                            key={itemProps.title}
                            isRtl={this.props.isRtl}
                            onClick={this.wrapAboutMenuCallback(
                                itemProps.onClick
                            )}
                        >
                            {itemProps.title}
                        </MenuItem>
                    ))}
                </MenuBarMenu>
            </div>
        );
    }
    wrapAboutMenuCallback(callback) {
        return () => {
            callback();
            this.props.onRequestCloseAbout();
        };
    }
    toggleSkin(index) {
        console.log("toggleSkin", index, document.documentElement.style);
        if (index == 0) {
            document.documentElement.style.setProperty(
                "--motionPrimary",
                "hsla(14,99%,62.4%, 1)"
            );
            document.documentElement.style.setProperty(
                "--menuBackground",
                "hsla(15,100%,95.3%, 1)"
            );
            document.documentElement.style.setProperty(
                "--uiPrimary",
                "hsla(15,100%,95.3%, 1)"
            );
            document.documentElement.style.setProperty(
                "--motionBtn",
                "#FFC8B6"
            );
        } else if (index == 1) {
            document.documentElement.style.setProperty(
                "--motionPrimary",
                "hsla(238,87.1%,66.7%, 1)"
            );
            document.documentElement.style.setProperty(
                "--menuBackground",
                "hsla(238, 81%, 75%, 1)"
            );
            document.documentElement.style.setProperty(
                "--uiPrimary",
                "#ffffff"
            );
            document.documentElement.style.setProperty(
                "--motionBtn",
                "rgb(163, 201, 255)"
            );
        } else {
            document.documentElement.style.setProperty(
                "--motionPrimary",
                "hsla(215, 100%, 65%, 1)"
            );
            document.documentElement.style.setProperty(
                "--menuBackground",
                "hsla(215, 91%, 78%, 1)"
            );
            document.documentElement.style.setProperty(
                "--uiPrimary",
                "#ffffff"
            );
            document.documentElement.style.setProperty(
                "--motionBtn",
                "rgb(163, 201, 255)"
            );
        }
    }
    onChange(value) {
        console.log(value);
    }
    // Just show the latest item.
    displayRender(label) {
        return label[label.length - 1];
    }
    render() {
        const saveNowMessage = (
            <FormattedMessage
                defaultMessage="Save now"
                description="Menu bar item for saving now"
                id="gui.menuBar.saveNow"
            />
        );
        const createCopyMessage = (
            <FormattedMessage
                defaultMessage="Save as a copy"
                description="Menu bar item for saving as a copy"
                id="gui.menuBar.saveAsCopy"
            />
        );
        const remixMessage = (
            <FormattedMessage
                defaultMessage="Remix"
                description="Menu bar item for remixing"
                id="gui.menuBar.remix"
            />
        );
        const newProjectMessage = (
            <FormattedMessage
                defaultMessage="New"
                description="Menu bar item for creating a new project"
                id="gui.menuBar.new"
            />
        );

        const remixButton = (
            <Button
                className={classNames(styles.menuBarButton, styles.remixButton)}
                iconClassName={styles.remixButtonIcon}
                iconSrc={remixIcon}
                onClick={this.handleClickRemix}
            >
                {remixMessage}
            </Button>
        );

        return (
            <Box
                className={classNames(this.props.className, styles.menuBar)}
                style={
                    window.scratchConfig &&
                    window.scratchConfig.menuBar &&
                    window.scratchConfig.menuBar.style
                }
            >
                <div className={styles.mainMenu}>
                    <div className={styles.fileGroup}>
                        {window.scratchConfig.logo &&
                            window.scratchConfig.logo.show && (
                                <div className={classNames(styles.menuBarItem)}>
                                    <img
                                        alt="Scratch"
                                        className={classNames(
                                            styles.scratchLogo,
                                            {
                                                [styles.clickable]:
                                                    typeof this.props
                                                        .onClickLogo !==
                                                    "undefined",
                                            }
                                        )}
                                        draggable={false}
                                        src={
                                            window.scratchConfig.logo.url ||
                                            this.props.logo
                                        }
                                        onClick={
                                            window.scratchConfig.logo
                                                .handleClickLogo
                                        }
                                    />
                                </div>
                            )}

                        {/* 文件 */}
                        {this.props.canManageFiles && (
                            <div
                                className={classNames(
                                    styles.menuBarItem,
                                    styles.hoverable,
                                    {
                                        [styles.active]:
                                            this.props.fileMenuOpen,
                                    }
                                )}
                                onMouseUp={this.props.onClickFile}
                            >
                                {/* <FormattedMessage
                                    defaultMessage="File"
                                    description="Text for file dropdown menu"
                                    id="gui.menuBar.file"
                                /> */}
                                {/* <img     className={styles.languageIcon}
                                    src={srarcgOne}/> */}
                                <div>
                                    <IconFolder
                                        className={styles.folderColor}
                                        width={24}
                                    />
                                </div>
                                <MenuBarMenu
                                    className={classNames(styles.menuBarMenu)}
                                    open={this.props.fileMenuOpen}
                                    place={this.props.isRtl ? "left" : "right"}
                                    onRequestClose={
                                        this.props.onRequestCloseFile
                                    }
                                >
                                    <MenuSection>
                                        {window.scratchConfig &&
                                            window.scratchConfig.menuBar &&
                                            window.scratchConfig.menuBar
                                                .newButton &&
                                            window.scratchConfig.menuBar
                                                .newButton.show && (
                                                <MenuItem
                                                    isRtl={this.props.isRtl}
                                                    onClick={
                                                        this.handleCearclick
                                                    }
                                                >
                                                    新建
                                                </MenuItem>
                                            )}
                                    </MenuSection>
                                    <MenuSection>
                                        {window.scratchConfig &&
                                            window.scratchConfig.menuBar &&
                                            window.scratchConfig.menuBar
                                                .newButton &&
                                            window.scratchConfig.menuBar
                                                .newButton.show && (
                                                <MenuItem
                                                    isRtl={this.props.isRtl}
                                                    onClick={
                                                        this.handleClickNew
                                                    }
                                                >
                                                    {newProjectMessage}
                                                </MenuItem>
                                            )}
                                    </MenuSection>

                                    <MenuSection>
                                        {window.scratchConfig &&
                                            window.scratchConfig.menuBar &&
                                            window.scratchConfig.menuBar
                                                .saveaAs &&
                                            window.scratchConfig.menuBar.saveaAs
                                                .show && (
                                                <MenuItem
                                                    isRtl={this.props.isRtl}
                                                    onClick={this.handleSaveAs}
                                                >
                                                    另存为
                                                </MenuItem>
                                            )}
                                    </MenuSection>
                                    {(this.props.canSave ||
                                        this.props.canCreateCopy ||
                                        this.props.canRemix) && (
                                        <MenuSection>
                                            {this.props.canSave && (
                                                <MenuItem
                                                    onClick={
                                                        this.handleClickSave
                                                    }
                                                >
                                                    {saveNowMessage}
                                                </MenuItem>
                                            )}
                                            {this.props.canCreateCopy && (
                                                <MenuItem
                                                    onClick={
                                                        this
                                                            .handleClickSaveAsCopy
                                                    }
                                                >
                                                    {createCopyMessage}
                                                </MenuItem>
                                            )}
                                            {this.props.canRemix && (
                                                <MenuItem
                                                    onClick={
                                                        this.handleClickRemix
                                                    }
                                                >
                                                    {remixMessage}
                                                </MenuItem>
                                            )}
                                        </MenuSection>
                                    )}
                                    <MenuSection>
                                        {window.scratchConfig &&
                                            window.scratchConfig.menuBar &&
                                            window.scratchConfig.menuBar
                                                .loadFileButton &&
                                            window.scratchConfig.menuBar
                                                .loadFileButton.show && (
                                                <MenuItem
                                                    onClick={
                                                        this.props
                                                            .onStartSelectingFileUpload
                                                    }
                                                >
                                                    {this.props.intl.formatMessage(
                                                        sharedMessages.loadFromComputerTitle
                                                    )}
                                                </MenuItem>
                                            )}

                                        {window.scratchConfig &&
                                            window.scratchConfig.menuBar &&
                                            window.scratchConfig.menuBar
                                                .saveFileButton &&
                                            window.scratchConfig.menuBar
                                                .saveFileButton.show && (
                                                <SB3Downloader>
                                                    {(
                                                        className,
                                                        downloadProjectCallback
                                                    ) => (
                                                        <MenuItem
                                                            className={
                                                                className
                                                            }
                                                            onClick={this.getSaveToComputerHandler(
                                                                downloadProjectCallback
                                                            )}
                                                        >
                                                            <FormattedMessage
                                                                defaultMessage="Save to your computer"
                                                                description="Menu bar item for downloading a project to your computer" //用于将项目下载到计算机的菜单栏项
                                                                id="gui.menuBar.downloadToComputer"
                                                            />
                                                        </MenuItem>
                                                    )}
                                                </SB3Downloader>
                                            )}
                                    </MenuSection>
                                </MenuBarMenu>
                            </div>
                        )}

                        {/* 打开背包&&加速模式 */}
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                {
                                    [styles.active]: this.props.editMenuOpen,
                                }
                            )}
                            onMouseUp={this.props.onBackpackClick}
                        >
                            <div className={classNames(styles.editMenu)}>
                                {/* <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                /> */}
                                {/* <img     className={styles.languageIcon}
                                    src={sarchThree}/> */}
                                <div>
                                    <IconBag
                                        className={styles.bagColor}
                                        width={24}
                                    />
                                </div>
                            </div>
                            <MenuBarMenu
                                className={classNames(styles.menuBarMenu)}
                                open={this.props.editMenuOpen}
                                place={this.props.isRtl ? "left" : "right"}
                                onRequestClose={this.props.onRequestCloseEdit}
                            >
                                <DeletionRestorer>
                                    {(
                                        handleRestore,
                                        { restorable, deletedItem }
                                    ) => (
                                        <MenuItem
                                            className={classNames({
                                                [styles.disabled]: !restorable,
                                            })}
                                            onClick={this.handleRestoreOption(
                                                handleRestore
                                            )}
                                        >
                                            {this.restoreOptionMessage(
                                                deletedItem
                                            )}
                                        </MenuItem>
                                    )}
                                </DeletionRestorer>
                                {window.scratchConfig &&
                                    window.scratchConfig.menuBar &&
                                    window.scratchConfig.menuBar
                                        .turboModeButton &&
                                    window.scratchConfig.menuBar.turboModeButton
                                        .show && (
                                        <MenuSection>
                                            <TurboMode>
                                                {(
                                                    toggleTurboMode,
                                                    { turboMode }
                                                ) => (
                                                    <MenuItem
                                                        onClick={
                                                            toggleTurboMode
                                                        }
                                                    >
                                                        {turboMode ? (
                                                            <FormattedMessage
                                                                defaultMessage="Turn off Turbo Mode"
                                                                description="Menu bar item for turning off turbo mode"
                                                                id="gui.menuBar.turboModeOff"
                                                            />
                                                        ) : (
                                                            <FormattedMessage
                                                                defaultMessage="Turn on Turbo Mode"
                                                                description="Menu bar item for turning on turbo mode"
                                                                id="gui.menuBar.turboModeOn"
                                                            />
                                                        )}
                                                    </MenuItem>
                                                )}
                                            </TurboMode>
                                        </MenuSection>
                                    )}
                            </MenuBarMenu>
                        </div>
                        {/* 设置 */}
                        <div
                            className={classNames(
                                styles.menuBarItem,
                                styles.hoverable,
                                {
                                    [styles.active]: this.props.settingMenuOpen,
                                }
                            )}
                            onMouseUp={this.props.onClickSet}
                        >
                            <div className={classNames(styles.editMenu)}>
                                {/* <FormattedMessage
                                    defaultMessage="Edit"
                                    description="Text for edit dropdown menu"
                                    id="gui.menuBar.edit"
                                /> */}
                                {/* <img     className={styles.languageIcon}
                                    src={languageIcon}/> */}
                                <div>
                                    <IconWheel className={styles.folderColor} />
                                </div>
                            </div>

                            <MenuBarMenu
                                className={classNames(styles.menuBarMenu)}
                                open={this.props.settingMenuOpen}
                                place={this.props.isRtl ? "left" : "right"}
                                onRequestClose={this.props.onRequestCloseSet}
                            >
                                {window.scratchConfig &&
                                    window.scratchConfig.menuBar &&
                                    window.scratchConfig.menuBar
                                        .turboModeButton &&
                                    window.scratchConfig.menuBar.turboModeButton
                                        .show && (
                                        <MenuSection>
                                            <MenuItem
                                                className={styles.bgWhite}
                                                onMouseEnter={() => {
                                                    this.setState({
                                                        chooseLanguageVisible: true,
                                                    });
                                                }}
                                                onMouseLeave={() => {
                                                    this.setState({
                                                        chooseLanguageVisible: false,
                                                    });
                                                }}
                                                onClick={() => {
                                                    this.setState({
                                                        chooseLanguageVisible: true,
                                                    });
                                                }}
                                            >
                                                {this.props.intl.formatMessage(
                                                    ariaMessages.chooseLanguage
                                                )}
                                            </MenuItem>
                                            {this.state
                                                .chooseLanguageVisible ? (
                                                <LanguageSelectors
                                                    onChange={() => {
                                                        this.setState({
                                                            chooseLanguageVisible: false,
                                                        });
                                                        this.props.onRequestCloseSet();
                                                    }}
                                                    onMouseEnter={() => {
                                                        this.setState({
                                                            chooseLanguageVisible: true,
                                                        });
                                                    }}
                                                />
                                            ) : null}
                                            <MenuItem>
                                                <div>
                                                    <div>
                                                        {this.props.intl.formatMessage(
                                                            ariaMessages.themeColor
                                                        )}
                                                    </div>
                                                    <span>
                                                        <div
                                                            className={classNames(
                                                                styles.skinTag,
                                                                styles.skinTag0,
                                                                this.state
                                                                    .skinIndex ==
                                                                    0
                                                                    ? "skinactive"
                                                                    : ""
                                                            )}
                                                            onClick={this.toggleSkin.bind(
                                                                this,
                                                                0
                                                            )}
                                                        ></div>
                                                        <div
                                                            className={classNames(
                                                                styles.skinTag,
                                                                styles.skinTag1,
                                                                this.state
                                                                    .skinIndex ==
                                                                    1
                                                                    ? "skinactive"
                                                                    : ""
                                                            )}
                                                            onClick={this.toggleSkin.bind(
                                                                this,
                                                                1
                                                            )}
                                                        ></div>
                                                        <div
                                                            className={classNames(
                                                                styles.skinTag,
                                                                styles.skinTag2,
                                                                this.state
                                                                    .skinIndex ==
                                                                    2
                                                                    ? "skinactive"
                                                                    : ""
                                                            )}
                                                            onClick={this.toggleSkin.bind(
                                                                this,
                                                                2
                                                            )}
                                                        ></div>
                                                    </span>
                                                </div>
                                            </MenuItem>
                                        </MenuSection>
                                    )}
                            </MenuBarMenu>
                        </div>
                    </div>
                    {/*中间部分的小狮子 */}
                    {/* <Divider className={classNames(styles.divider)} />
                    
    
                    {(window.scratchConfig && window.scratchConfig.menuBar && window.scratchConfig.menuBar.helpButton && 
                                                window.scratchConfig.menuBar.helpButton.show) && (
                        <div
                            aria-label={this.props.intl.formatMessage(ariaMessages.tutorials)}
                            className={classNames(styles.menuBarItem, styles.hoverable)}
                            onClick={this.props.onOpenTipLibrary}
                        >
                            <img
                                className={styles.helpIcon}
                                src={helpIcon}
                            />
                              <div><IconHelp className={styles.folderColor}/></div>
                            <FormattedMessage {...ariaMessages.tutorials} />
                        </div>
                    )} */}
                    {/* <Divider className={classNames(styles.divider)} /> */}

                    {/* 这里就是头部输入框 */}
                    {this.props.canEditTitle ? (
                        <div></div>
                    ) : // <div className={classNames(styles.menuBarItem, styles.growable)}>
                    //     <MenuBarItemTooltip
                    //         enable
                    //         id="title-field"
                    //     >
                    //         <ProjectTitleInput
                    //             className={classNames(styles.titleFieldGrowable)}
                    //         />
                    //     </MenuBarItemTooltip>
                    // </div>
                    this.props.authorUsername &&
                      this.props.authorUsername !== this.props.username ? (
                        <AuthorInfo
                            className={styles.authorInfo}
                            imageUrl={this.props.authorThumbnailUrl}
                            projectTitle={this.props.projectTitle}
                            userId={this.props.authorId}
                            username={this.props.authorUsername}
                        />
                    ) : null}
                    <div className={classNames(styles.menuBarItem)}>
                        {window.scratchConfig &&
                            window.scratchConfig.shareButton &&
                            window.scratchConfig.shareButton.show && (
                                <ProjectWatcher
                                    onDoneUpdating={this.props.onSeeCommunity}
                                >
                                    {(waitForUpdate) => (
                                        <ShareButton
                                            className={styles.menuBarButton}
                                            isShared={this.props.isShared}
                                            /* eslint-disable react/jsx-no-bind */
                                            onClick={() => {
                                                window.scratchConfig.shareButton.handleClick();
                                                // this.handleClickShare(waitForUpdate);
                                            }}
                                            buttonName={
                                                window.scratchConfig.shareButton
                                                    .buttonName
                                            }
                                            /* eslint-enable react/jsx-no-bind */
                                        />
                                    )}
                                </ProjectWatcher>
                            )}
                        {this.props.canRemix ? remixButton : []}
                    </div>

                    <div className={classNames(styles.menuBarItem)}>
                        {window.scratchConfig &&
                            window.scratchConfig.profileButton &&
                            window.scratchConfig.profileButton.show && (
                                <CustomButton
                                    className={styles.menuBarButton}
                                    onClick={() => {
                                        window.scratchConfig.profileButton.handleClick();
                                    }}
                                    buttonName={
                                        window.scratchConfig.profileButton
                                            .buttonName
                                    }
                                />
                            )}
                        {window.scratchConfig &&
                            window.scratchConfig.menuBar &&
                            window.scratchConfig.menuBar.customButtons &&
                            window.scratchConfig.menuBar.customButtons.length >
                                0 &&
                            window.scratchConfig.menuBar.customButtons.map(
                                (item) => {
                                    if (item.show) {
                                        return (
                                            <CustomButton
                                                key={item.buttonName}
                                                className={styles.menuBarButton}
                                                style={item.style || {}}
                                                onClick={item.handleClick}
                                                buttonName={item.buttonName}
                                            />
                                        );
                                    } else {
                                        return "";
                                    }
                                }
                            )}
                    </div>
                    <div
                        className={classNames(
                            styles.menuBarItem,
                            styles.communityButtonWrapper
                        )}
                    >
                        {this.props.enableCommunity ? (
                            (this.props.isShowingProject ||
                                this.props.isUpdating) && (
                                <ProjectWatcher
                                    onDoneUpdating={this.props.onSeeCommunity}
                                >
                                    {(waitForUpdate) => (
                                        <CommunityButton
                                            className={styles.menuBarButton}
                                            onClick={() => {
                                                this.handleClickSeeCommunity(
                                                    waitForUpdate
                                                );
                                            }}
                                        />
                                    )}
                                </ProjectWatcher>
                            )
                        ) : this.props.showComingSoon ? (
                            <MenuBarItemTooltip id="community-button">
                                <CommunityButton
                                    className={styles.menuBarButton}
                                />
                            </MenuBarItemTooltip>
                        ) : (
                            []
                        )}
                    </div>
                </div>

                {/* 我的物品 */}
                {
                    <div className={styles.accountInfoGroup}>
                        <div className={styles.menuBarItem}>
                            {this.props.canSave && <SaveStatus />}
                        </div>
                        {
                            // ************ user is logged in ************
                            <React.Fragment>
                                {window.scratchConfig &&
                                    window.scratchConfig.menuBar &&
                                    window.scratchConfig.menuBar.myStuff
                                        .show && (
                                        <Menutop
                                            onSaveChange={this.checkouNewClick.bind(
                                                this
                                            )}
                                        ></Menutop>
                                        // <a href={window.scratchConfig.menuBar.myStuff.url} target="_blank">
                                        //     <div
                                        //         className={classNames(
                                        //             styles.menuBarItem,
                                        //             styles.hoverable,
                                        //             styles.mystuffButton
                                        //         )}
                                        //     >
                                        //         <img
                                        //             className={styles.mystuffIcon}
                                        //             src={mystuffIcon}
                                        //         />
                                        //     </div>
                                        // </a>
                                    )}
                                {window.scratchConfig &&
                                    window.scratchConfig.menuBar &&
                                    window.scratchConfig.menuBar.userAvatar
                                        .show && (
                                        <div>
                                            <ButtonM
                                                onClick={this.checkouUseClock.bind()}
                                            >
                                                {this.props.username}
                                            </ButtonM>
                                        </div>
                                        // <AccountNav
                                        //     className={classNames(
                                        //         styles.menuBarItem,
                                        //         styles.hoverable,
                                        //         {[styles.active]: this.props.accountMenuOpen}
                                        //     )}
                                        //     thumbnailUrl={this.props.avatar}
                                        //     username={this.props.username}
                                        //     isOpen={this.props.accountMenuOpen}
                                        //     isRtl={this.props.isRtl}
                                        //     menuBarMenuClassName={classNames(styles.menuBarMenu)}
                                        //     onClick={this.props.onAvatarClick}
                                        //     onClose={this.props.onRequestCloseAccount}
                                        //     onLogOut={this.props.onLogOut}
                                        // />
                                    )}
                            </React.Fragment>
                        }
                    </div>
                }
            </Box>
        );
    }
}

MenuBar.propTypes = {
    accountMenuOpen: PropTypes.bool,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    autoUpdateProject: PropTypes.func,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    className: PropTypes.string,
    confirmReadyToReplaceProject: PropTypes.func,
    editMenuOpen: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    fileMenuOpen: PropTypes.bool,
    settingMenuOpen: PropTypes.bool,
    intl: intlShape,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isUpdating: PropTypes.bool,
    languageMenuOpen: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    loginMenuOpen: PropTypes.bool,
    logo: PropTypes.string,
    onClickAbout: PropTypes.oneOfType([
        PropTypes.func, // button mode: call this callback when the About button is clicked
        PropTypes.arrayOf(
            // menu mode: list of items in the About menu
            PropTypes.shape({
                title: PropTypes.string, // text for the menu item
                onClick: PropTypes.func, // call this callback when the menu item is clicked
                //
            })
        ),
    ]),
    onClickAccount: PropTypes.func,
    onClickEdit: PropTypes.func,
    onClickFile: PropTypes.func,
    onClickLanguage: PropTypes.func,
    onClickLogin: PropTypes.func,
    onClickLogo: PropTypes.func,
    onClickNew: PropTypes.func,
    onClickRemix: PropTypes.func,
    onClickSave: PropTypes.func,
    onClickSaveAsCopy: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onBackpackClick: PropTypes.func,
    onOpenTipLibrary: PropTypes.func,
    onProjectTelemetryEvent: PropTypes.func,
    onRequestOpenAbout: PropTypes.func,
    onRequestCloseAbout: PropTypes.func,
    onRequestCloseAccount: PropTypes.func,
    onRequestCloseEdit: PropTypes.func,
    onRequestCloseFile: PropTypes.func,
    onRequestCloseLanguage: PropTypes.func,
    onRequestCloseLogin: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    projectTitle: PropTypes.string,
    renderLogin: PropTypes.func,
    sessionExists: PropTypes.bool,
    shouldSaveBeforeTransition: PropTypes.func,
    showComingSoon: PropTypes.bool,
    userOwnsProject: PropTypes.bool,
    username: PropTypes.string,
    vm: PropTypes.instanceOf(VM).isRequired,
};

MenuBar.defaultProps = {
    logo: scratchLogo,
    onShare: () => {},
};

const mapStateToProps = (state, ownProps) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    const user =
        state.session && state.session.session && state.session.session.user;
    return {
        aboutMenuOpen: aboutMenuOpen(state),
        accountMenuOpen: accountMenuOpen(state),
        fileMenuOpen: fileMenuOpen(state),
        settingMenuOpen: settingMenuOpen(state),
        editMenuOpen: editMenuOpen(state),
        isRtl: state.locales.isRtl,
        isUpdating: getIsUpdating(loadingState),
        isShowingProject: getIsShowingProject(loadingState),
        languageMenuOpen: languageMenuOpen(state),
        locale: state.locales.locale,
        loginMenuOpen: loginMenuOpen(state),
        projectTitle: state.scratchGui.projectTitle,
        sessionExists:
            state.session && typeof state.session.session !== "undefined",
        username: window.scratchConfig.menuBar.userAvatar.username || "",
        avatar: window.scratchConfig.menuBar.userAvatar.avatar || null,
        onAvatarClick: window.scratchConfig.menuBar.userAvatar.handleClick,
        userOwnsProject:
            ownProps.authorUsername &&
            user &&
            ownProps.authorUsername === user.username,
        vm: state.scratchGui.vm,
    };
};

const mapDispatchToProps = (dispatch) => ({
    autoUpdateProject: () => dispatch(autoUpdateProject()),
    onOpenTipLibrary: () => {
        if (window.scratchConfig.menuBar.helpButton.handleBefore()) {
            dispatch(openTipsLibrary());
        }
    },
    onClickAccount: () => dispatch(openAccountMenu()),
    onRequestCloseAccount: () => dispatch(closeAccountMenu()),
    onClickFile: () => dispatch(openFileMenu()),
    onRequestCloseFile: () => dispatch(closeFileMenu()),
    onClickSet: () => {
        dispatch(openSettingMenu());
        console.log("onClickSet");
    },
    onRequestCloseSet: () => dispatch(closeSettingMenu()),
    onClickEdit: () => dispatch(openEditMenu()),
    onRequestCloseEdit: () => dispatch(closeEditMenu()),
    onClickLanguage: () => dispatch(openLanguageMenu()),
    onRequestCloseLanguage: () => dispatch(closeLanguageMenu()),
    onClickLogin: () => dispatch(openLoginMenu()),
    onRequestCloseLogin: () => dispatch(closeLoginMenu()),
    onRequestOpenAbout: () => dispatch(openAboutMenu()),
    onRequestCloseAbout: () => dispatch(closeAboutMenu()),
    onClickNew: (needSave) => dispatch(requestNewProject(needSave)),
    onClickRemix: () => dispatch(remixProject()),
    onClickSave: () => dispatch(manualUpdateProject()),
    onClickSaveAsCopy: () => dispatch(saveProjectAsCopy()),
    onSeeCommunity: () => dispatch(setPlayer(true)),
});

export default compose(
    injectIntl,
    MenuBarHOC,
    connect(mapStateToProps, mapDispatchToProps)
)(MenuBar);
