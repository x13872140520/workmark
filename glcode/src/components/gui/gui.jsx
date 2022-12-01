import classNames from "classnames";
import omit from "lodash.omit";
import PropTypes from "prop-types";
import React, { useEffect, useState, useRef } from "react";
import {
    defineMessages,
    FormattedMessage,
    injectIntl,
    intlShape,
} from "react-intl";
import { connect } from "react-redux";
import MediaQuery from "react-responsive";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import tabStyles from "react-tabs/style/react-tabs.css";
import VM from "scratch-vm";
import Renderer from "scratch-render";
import Fade from "@material-ui/core/Fade";
import { Rnd } from "react-rnd";
import Blocks from "../../containers/blocks.jsx";
import CostumeTab from "../../containers/costume-tab.jsx";
import TargetPane from "../../containers/target-pane.jsx";
import TargetPanes from "../../containers/target-panes.jsx";
import SoundTab from "../../containers/sound-tab.jsx";
import StageWrapper from "../../containers/stage-wrapper.jsx";
import Loader from "../loader/loader.jsx";
import Box from "../box/box.jsx";
import MenuBar from "../menu-bar/menu-bar.jsx";
import CostumeLibrary from "../../containers/costume-library.jsx";
import BackdropLibrary from "../../containers/backdrop-library.jsx"; //背景库
import Watermark from "../../containers/watermark.jsx";

import Backpack from "../../containers/backpack.jsx";
import WebGlModal from "../../containers/webgl-modal.jsx";
import TipsLibrary from "../../containers/tips-library.jsx";
import BackpackLibrary from "../../containers/backpack-library.jsx"; //背包库
import Cards from "../../containers/cards.jsx";
import CardsNew from "../../containers/cards-new.jsx";
import Alerts from "../../containers/alerts.jsx";
import DragLayer from "../../containers/drag-layer.jsx";
import ConnectionModal from "../../containers/connection-modal.jsx";
import TelemetryModal from "../telemetry-modal/telemetry-modal.jsx";

import layout, { STAGE_SIZE_MODES } from "../../lib/layout-constants";
import { resolveStageSize } from "../../lib/screen-utils";

import styles from "./gui.css";
import addExtensionIcon from "./icon--extensions.svg";
import codeIcon from "./icon--code.svg";
import costumesIcon from "./icon--costumes.svg";
import {
    IconUp,
    IconCode,
    IconCostumes,
    IconSounds,
} from "../../components/download-icon/download-icon.jsx";
import soundsIcon from "./icon--sounds.svg";
import ReactDOM from "react-dom";

import ImgCanvas from "../published-works/index.js";
import Create from "../creat/index.js";

import UseLogin from "../user-login/index";
import Mantle from "../Mantle/index.js";
import Transition from "../../components/transition/transition.jsx";
import Dialog from "@material-ui/core/Dialog";
import Message from "../message/index";
import {
    useSubscribe,
    usePublish,
    useUnsubscribe,
} from "../../Pusconnect/usePubSub";
import { style } from "scratch-storage";

import Buttonsearch from "../button-search";
import {
    sendLogintoken,
    findClassId,
    findClassTasekId,
} from "../../utils/api.js";

import { StaticFun } from "../../utils/data.js";

// 评价反馈

import EvaluationMessage from "../evaluation-message/index.jsx";
import ScratchBlocks from "scratch-blocks";
const messages = defineMessages({
    addExtension: {
        id: "gui.gui.addExtension",
        description: "Button to add an extension in the target pane",
        defaultMessage: "Add Extension",
    },
});
const currentstyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0",
};
// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;
let originWidth = window.innerWidth;
let originHeight = window.innerHeight;
console.log("originWidth", originWidth);
console.log("originHeight", originHeight);
const GUIComponent = (props) => {
    console.log("GUIComponentss", props, props.authorUsername);
    const {
        backpackLibraryVisible,
        onActivateBlocksTab,
        onRequestCloseBackpackLibrary,
        onBackpackClick,
        accountNavOpen,
        expanded,
        width,
        height,
        activeTabIndex,
        alertsVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        backpackHost,
        backpackVisible,
        blocksTabVisible,
        cardsVisible,
        canChangeLanguage,
        canCreateNew,
        canEditTitle,
        canManageFiles,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        canUseCloud,
        children,
        connectionModalVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        enableCommunity,
        intl,
        isCreating,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        isTelemetryEnabled,
        loading,
        logo,
        renderLogin,
        onClickAbout,
        onClickAccountNav,
        onCloseAccountNav,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onClickLogo,
        onExtensionButtonClick,
        resizeCard,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onSeeCommunity,
        onShare,
        onShowPrivacyPolicy,
        onStartSelectingFileUpload,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        showComingSoon,
        soundsTabVisible,
        stageSizeMode,
        storeProject,
        fetchProject,
        targetIsStage,
        telemetryModalVisible,
        tipsLibraryVisible,
        vm,
        ...componentProps
    } = omit(props, "dispatch");

    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }

    const ChildrenRef = useRef();

    const [openDig, setopenDig] = useState(false);

    //弹框对象
    const [mesprops, Setmesprops] = useState({
        anchorOrigin: {
            vertical: "top",
            horizontal: "center",
        },
        open: false,
        message: "",
        Transition: Fade,
        userName: "",
    });

    const onsearchKey = () => {
        setsearchKey(!searchKey);
    };

    const setOleName = (e) => {
        const publish = usePublish();
        publish("setName", e);
    };

    const handleOpendig = () => {
        setopenDig(true);
    };

    const [searchKey, setsearchKey] = useState(false);
    // 获取弹框对象的事件

    const openmessage = useSubscribe("openMessage", (msg, data) => {
        if (msg === "openMessage") {
            Setmesprops({
                open: data.open,
                message: data.message,
                anchorOrigin: data.anchorOrigin,
            });
        }
    });

    const openSoundRecord = useSubscribe("onCloseRecord", (msg, data) => {
        console.log(msg, data, "openSoundRecord");
        if (msg === "onCloseRecord" && data) {
            onActivateTab(0);
        }
    });
    const unsubscribe = useUnsubscribe();

    useEffect(() => {
        // 判断用户的是否登录
        // let searchUrl = window.location.search
        // let oneObj = StaticFun.getToken(searchUrl)
    }, []);

    // let demoResult = demoUrl.substr(demoSrc + 1, demoUrl.length)
    // let baseurl = decodeURIComponent(escape(window.atob(demoResult)))
    // console.log(baseurl, "demoSrc")

    // 上面是测试模版

    // let searchResult = searchUrl.substr(sratchindex + 1, searchUrl.length);
    // if (searchResult === "") return false

    // console.log()

    useEffect(
        () => () => {
            unsubscribe(openmessage);
        },
        [openmessage]
    );
    useEffect(
        () => () => {
            unsubscribe(openSoundRecord);
        },
        [openSoundRecord]
    );
    const handlecheck = () => {
        Setmesprops({ open: false });
    };
    const handlewh = (w, h) => {
        console.log("handlewh", w, h);
        document.getElementById("card-div").style.width = w;
        document.getElementById("card-div").style.minWidth = w;
        document.getElementById("card-div").style.height = h;
        document.getElementById("card-div").style.minHeight = h;
    };
    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(
            tabStyles.reactTabsTabPanelSelected,
            styles.isSelected
        ),
        tabSelected: classNames(
            tabStyles.reactTabsTabSelected,
            styles.isSelected
        ),
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
        console.log("isRendererSupported", isRendererSupported);
    }

    //用户数据

    const [peopleObj, setPeopleObj] = useState({});

    // 打开评价
    const OpenEvaluation = (e) => {
        setopenDig(true);

        (e.tskey === 7
            ? findClassId({ id: e.oarr[1] })
            : findClassTasekId({ id: e.oarr[1] })
        ).then((res) => {
            if (res.data.code === "200") {
                setPeopleObj({ ...res.data.data, ...e });
            }
        });
    };

    const onCloseOpen = () => {
        setopenDig(false);
    };
    return (
        <MediaQuery minWidth={layout.fullSizeMinWidth}>
            {(isFullSize) => {
                const stageSize = resolveStageSize(stageSizeMode, isFullSize);

                return isPlayerOnly ? (
                    <StageWrapper
                        isFullScreen={isFullScreen}
                        isRendererSupported={isRendererSupported}
                        isRtl={isRtl}
                        loading={loading}
                        stageSize={STAGE_SIZE_MODES.large}
                        vm={vm}
                    >
                        {alertsVisible ? (
                            <Alerts className={styles.alertsContainer} />
                        ) : null}
                    </StageWrapper>
                ) : (
                    <Box
                        className={styles.pageWrapper}
                        dir={isRtl ? "rtl" : "ltr"}
                        {...componentProps}
                    >
                        {telemetryModalVisible ? (
                            <TelemetryModal
                                isRtl={isRtl}
                                isTelemetryEnabled={isTelemetryEnabled}
                                onCancel={onTelemetryModalCancel}
                                onOptIn={onTelemetryModalOptIn}
                                onOptOut={onTelemetryModalOptOut}
                                onRequestClose={onRequestCloseTelemetryModal}
                                onShowPrivacyPolicy={onShowPrivacyPolicy}
                            />
                        ) : null}
                        {loading ? <Loader /> : null}
                        {isCreating ? (
                            <Loader messageId="gui.loader.creating" />
                        ) : null}
                        {isRendererSupported ? null : (
                            <WebGlModal isRtl={isRtl} />
                        )}
                        {tipsLibraryVisible ? <TipsLibrary /> : null}
                        {/* {cardsVisible ? <Cards /> : null} */}
                        {alertsVisible ? (
                            <Alerts className={styles.alertsContainer} />
                        ) : null}
                        {connectionModalVisible ? (
                            <ConnectionModal vm={vm} />
                        ) : null}
                        {costumeLibraryVisible ? (
                            <CostumeLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseCostumeLibrary}
                            />
                        ) : null}

                        {backdropLibraryVisible ? (
                            <BackdropLibrary
                                vm={vm}
                                onRequestClose={onRequestCloseBackdropLibrary}
                            />
                        ) : null}

                        <MenuBar
                            accountNavOpen={accountNavOpen}
                            authorId={authorId}
                            authorThumbnailUrl={authorThumbnailUrl}
                            authorUsername={authorUsername}
                            canChangeLanguage={canChangeLanguage}
                            canCreateCopy={canCreateCopy}
                            canCreateNew={canCreateNew}
                            canEditTitle={canEditTitle}
                            canManageFiles={canManageFiles}
                            canRemix={canRemix}
                            canSave={canSave}
                            canShare={canShare}
                            className={styles.menuBarPosition}
                            enableCommunity={enableCommunity}
                            isShared={isShared}
                            logo={logo}
                            renderLogin={renderLogin}
                            showComingSoon={showComingSoon}
                            onClickAbout={onClickAbout}
                            onClickAccountNav={onClickAccountNav}
                            onClickLogo={onClickLogo}
                            onCloseAccountNav={onCloseAccountNav}
                            onLogOut={onLogOut}
                            onOpenRegistration={onOpenRegistration}
                            onBackpackClick={onBackpackClick}
                            onProjectTelemetryEvent={onProjectTelemetryEvent}
                            onSeeCommunity={onSeeCommunity}
                            onShare={onShare}
                            onStartSelectingFileUpload={
                                onStartSelectingFileUpload
                            }
                            onToggleLoginOpen={onToggleLoginOpen}
                            userName={mesprops.userName}
                            storeProject={storeProject}
                            fetchProject={fetchProject}
                            OpenEvaluation={OpenEvaluation}
                            vm={vm}
                        />
                        <Box className={styles.bodyWrapper}>
                            <Box className={styles.flexWrapper}>
                                {/* 待插入 */}
                                {/* <TargetPanes stageSize={stageSize} vm={vm} /> */}

                                {backpackLibraryVisible ? (
                                    <Transition
                                        className={styles.fade}
                                        toggleClass={styles.show}
                                        action={backpackLibraryVisible}
                                    >
                                        <BackpackLibrary
                                            vm={vm}
                                            onActivateBlocksTab={
                                                onActivateBlocksTab
                                            }
                                            onRequestClose={
                                                onRequestCloseBackpackLibrary
                                            }
                                        />
                                    </Transition>
                                ) : null}
                                <Box className={styles.editorWrapper}>
                                    <Box className={styles.blocksWrapper}>
                                        <Blocks
                                            canUseCloud={canUseCloud}
                                            grow={1}
                                            onsearchKey={onsearchKey}
                                            isVisible={blocksTabVisible}
                                            options={{
                                                media: `${basePath}static/blocks-media/`,
                                            }}
                                            stageSize={stageSize}
                                            vm={vm}
                                        />
                                    </Box>
                                    <Box className={styles.srarchInput}>
                                        {searchKey ? (
                                            <Buttonsearch></Buttonsearch>
                                        ) : null}
                                    </Box>
                                    <Box
                                        className={
                                            styles.extensionButtonContainer
                                        }
                                    >
                                        <button
                                            className={styles.extensionButton}
                                            title={intl.formatMessage(
                                                messages.addExtension
                                            )}
                                            onClick={onExtensionButtonClick}
                                        >
                                            <img
                                                className={
                                                    styles.extensionButtonIcon
                                                }
                                                draggable={false}
                                                src={addExtensionIcon}
                                            />
                                        </button>
                                    </Box>
                                    <Box className={styles.watermark}>
                                        <Watermark />
                                    </Box>
                                    {/* <Tabs
                                        forceRenderTabPanel
                                        className={tabClassNames.tabs}
                                        selectedIndex={activeTabIndex}
                                        selectedTabClassName={
                                            tabClassNames.tabSelected
                                        }
                                        selectedTabPanelClassName={
                                            tabClassNames.tabPanelSelected
                                        }
                                        onSelect={onActivateTab}
                                    >
                                        <TabList
                                            className={tabClassNames.tabList}
                                        >
                                            <Tab className={tabClassNames.tab}>
                                                <IconCode draggable={false} />
                                                <FormattedMessage
                                                    defaultMessage="Code"
                                                    description="Button to get to the code panel"
                                                    id="gui.gui.codeTab"
                                                />
                                            </Tab>
                                            <Tab
                                                className={tabClassNames.tab}
                                                onClick={onActivateCostumesTab}
                                            >
                                                <IconCostumes
                                                    draggable={false}
                                                />
                                                {targetIsStage ? (
                                                    <FormattedMessage
                                                        defaultMessage="Backdrops"
                                                        description="Button to get to the backdrops panel"
                                                        id="gui.gui.backdropsTab"
                                                    />
                                                ) : (
                                                    <FormattedMessage
                                                        defaultMessage="Costumes"
                                                        description="Button to get to the costumes panel"
                                                        id="gui.gui.costumesTab"
                                                    />
                                                )}
                                            </Tab>
                                            <Tab
                                                className={tabClassNames.tab}
                                                onClick={onActivateSoundsTab}
                                            >
                                                <IconSounds draggable={false} />
                                                <FormattedMessage
                                                    defaultMessage="Sounds"
                                                    description="Button to get to the sounds panel"
                                                    id="gui.gui.soundsTab"
                                                />
                                            </Tab>
                                        </TabList>
                                        <TabPanel
                                            className={tabClassNames.tabPanel}
                                        >
                                            <Box
                                                className={styles.blocksWrapper}
                                            >
                                                <Blocks
                                                    canUseCloud={canUseCloud}
                                                    grow={1}
                                                    onsearchKey={onsearchKey}
                                                    isVisible={blocksTabVisible}
                                                    options={{
                                                        media: `${basePath}static/blocks-media/`,
                                                    }}
                                                    stageSize={stageSize}
                                                    vm={vm}
                                                />
                                            </Box>
                                            <Box className={styles.srarchInput}>
                                                {searchKey ? (
                                                    <Buttonsearch></Buttonsearch>
                                                ) : null}
                                            </Box>
                                            <Box
                                                className={
                                                    styles.extensionButtonContainer
                                                }
                                            >
                                                <button
                                                    className={
                                                        styles.extensionButton
                                                    }
                                                    title={intl.formatMessage(
                                                        messages.addExtension
                                                    )}
                                                    onClick={
                                                        onExtensionButtonClick
                                                    }
                                                >
                                                    <img
                                                        className={
                                                            styles.extensionButtonIcon
                                                        }
                                                        draggable={false}
                                                        src={addExtensionIcon}
                                                    />
                                                </button>
                                            </Box>
                                            <Box className={styles.watermark}>
                                                <Watermark />
                                            </Box>
                                        </TabPanel>
                                        <TabPanel
                                            className={tabClassNames.tabPanel}
                                        >
                                            {costumesTabVisible ? (
                                                <CostumeTab vm={vm} />
                                            ) : null}
                                        </TabPanel>
                                        <TabPanel
                                            className={tabClassNames.tabPanel}
                                        >
                                            {soundsTabVisible ? (
                                                <SoundTab vm={vm} />
                                            ) : null}
                                        </TabPanel>
                                    </Tabs> */}
                                    {/* {backpackVisible ? (
                                <Backpack host={backpackHost} />
                            ) : null} */}
                                    {soundsTabVisible ? (
                                        <SoundTab vm={vm} />
                                    ) : null}
                                </Box>
                                <TargetPanes stageSize={stageSize} vm={vm} />
                                <Box
                                    className={classNames(
                                        styles.stageAndTargetWrapper,
                                        styles[stageSize]
                                    )}
                                >
                                    <StageWrapper
                                        isFullScreen={isFullScreen}
                                        isRendererSupported={
                                            isRendererSupported
                                        }
                                        isRtl={isRtl}
                                        stageSize={stageSize}
                                        vm={vm}
                                    />
                                    <Box className={styles.targetWrapper}>
                                        {/* 底部 */}
                                        <TargetPane
                                            stageSize={stageSize}
                                            vm={vm}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        <DragLayer />
                        <UseLogin setOleName={setOleName} />
                        <ImgCanvas
                            projectTitle={props.projectTitle}
                        ></ImgCanvas>
                        <Create
                            onStartSelectingFileUpload={
                                onStartSelectingFileUpload
                            }
                            vm={vm}
                            authorUsername={authorUsername}
                        ></Create>
                        {/* 弹框 */}
                        <Message
                            mseprops={mesprops}
                            open={mesprops.open}
                            handlenewClose={handlecheck}
                        ></Message>
                        {/* 反馈提示 */}
                        <EvaluationMessage
                            openDig={openDig}
                            peopleObj={peopleObj}
                            onCloseOpen={onCloseOpen}
                        ></EvaluationMessage>

                        {/* <div onClick={handleOpendig}>评价</div> */}
                        {cardsVisible ? (
                            <Rnd
                                style={style}
                                resizeHandleClasses={{ bottom: "bottomr" }}
                                bounds={"window"}
                                minWidth={expanded ? 323 : null}
                                minHeight={expanded ? 325 : null}
                                maxWidth={originWidth}
                                maxHeight={originHeight}
                                default={{
                                    x: originWidth - 476,
                                    y: originHeight - 456,
                                    width: 476,
                                    height: 456,
                                }}
                                onResize={(
                                    e,
                                    direction,
                                    ref,
                                    delta,
                                    position
                                ) => {
                                    handlewh(ref.style.width, ref.style.height);
                                }}
                                onResizeStop={(
                                    e,
                                    direction,
                                    ref,
                                    delta,
                                    position
                                ) => {
                                    if (expanded) {
                                        window.localStorage.setItem(
                                            "beforeUnExpandedWidth",
                                            ref.style.width
                                        );
                                        window.localStorage.setItem(
                                            "beforeUnExpandedHeight",
                                            ref.style.height
                                        );
                                    } else {
                                        window.localStorage.setItem(
                                            "beforeUnExpandedWidth",
                                            ref.style.width
                                        );
                                    }
                                    handlewh(ref.style.width, ref.style.height);
                                }}
                            >
                                <CardsNew />
                            </Rnd>
                        ) : null}
                    </Box>
                );
            }}
        </MediaQuery>
    );
};

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    canChangeLanguage: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    resizeCard: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    showComingSoon: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    storeProject: PropTypes.func,
    fetchProject: PropTypes.func,
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    tipsLibraryVisible: PropTypes.bool,
    expanded: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: "./",
    canChangeLanguage: true,
    canCreateNew: true,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large,
};

const mapStateToProps = (state) => ({
    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    projectTitle: state.scratchGui.projectTitle,
});

export default injectIntl(connect(mapStateToProps)(GUIComponent));
