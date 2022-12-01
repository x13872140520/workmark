import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import ReactModal from "react-modal";
import VM from "scratch-vm";
import { injectIntl, intlShape } from "react-intl";

import ErrorBoundaryHOC from "../lib/error-boundary-hoc.jsx";
import { getIsError, getIsShowingProject } from "../reducers/project-state";
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX,
} from "../reducers/editor-tab";
import {
    closeCostumeLibrary,
    closeBackdropLibrary,
    openSpriteLibrary3in1,
    closeSpriteLibrary3in1,
    closeTelemetryModal,
    openExtensionLibrary,
    openBackpackLibrary,
    closeBackpackLibrary,
} from "../reducers/modals";

import FontLoaderHOC from "../lib/font-loader-hoc.jsx";
import LocalizationHOC from "../lib/localization-hoc.jsx";
import SBFileUploaderHOC from "../lib/sb-file-uploader-hoc.jsx";
import ProjectFetcherHOC from "../lib/project-fetcher-hoc.jsx";
import TitledHOC from "../lib/titled-hoc.jsx";
import ProjectSaverHOC from "../lib/project-saver-hoc.jsx";
import QueryParserHOC from "../lib/query-parser-hoc.jsx";
import storage from "../lib/storage";
import vmListenerHOC from "../lib/vm-listener-hoc.jsx";
import vmManagerHOC from "../lib/vm-manager-hoc.jsx";
import cloudManagerHOC from "../lib/cloud-manager-hoc.jsx";

import GUIComponent from "../components/gui/gui.jsx";
import { setIsScratchDesktop } from "../lib/isScratchDesktop.js";

class GUI extends React.Component {
    componentDidMount() {
        //window["console"]["log"] = function () {};
        setIsScratchDesktop(this.props.isScratchDesktop);

        this.props.onStorageInit(storage);

        this.props.onVmInit(this.props.vm);
        //添加一个默认背景
        // const vmBackdrop = {
        //     name: "Desert",
        //     rotationCenterX: 480,
        //     rotationCenterY: 360,
        //     bitmapResolution: 2,
        //     skinId: 3
        // };
        //  this.props.vm.addBackdrop('d98a9526a34890cf4bad11b5409eae2a.png', vmBackdrop);
        //  console.log('gethoc',this.props)
    }
    componentDidUpdate(prevProps) {
        if (
            this.props.projectId !== prevProps.projectId &&
            this.props.projectId !== null
        ) {
            this.props.onUpdateProjectId(this.props.projectId);
        }
        if (this.props.isShowingProject && !prevProps.isShowingProject) {
            // this only notifies container when a project changes from not yet loaded to loaded
            // At this time the project view in www doesn't need to know when a project is unloaded
            this.props.onProjectLoaded();
        }
    }
    handleActivateBlocksTab() {
        this.props.onActivateTab(BLOCKS_TAB_INDEX);
    }

    render() {
        if (this.props.isError) {
            throw new Error(
                `Error in Scratch GUI [location=${window.location}]: ${this.props.error}`
            );
        }
        const {
            /* eslint-disable no-unused-vars */
            assetHost,
            cloudHost,
            error,
            isError,
            isScratchDesktop,
            isShowingProject,
            onProjectLoaded,
            onStorageInit,
            onUpdateProjectId,
            onVmInit,
            projectHost,
            projectId,
            /* eslint-enable no-unused-vars */
            children,
            fetchingProject,
            isLoading,
            loadingStateVisible,
            ...componentProps
        } = this.props;

        return (
            <GUIComponent
                onActivateBlocksTab={this.handleActivateBlocksTab}
                loading={fetchingProject || isLoading || loadingStateVisible}
                {...componentProps}
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    assetHost: PropTypes.string,
    children: PropTypes.node,
    cloudHost: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    fetchingProject: PropTypes.bool,
    intl: intlShape,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    isScratchDesktop: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    onProjectLoaded: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onStorageInit: PropTypes.func,
    onUpdateProjectId: PropTypes.func,
    onVmInit: PropTypes.func,
    projectHost: PropTypes.string,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    telemetryModalVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
    onActivateBlocksTab: PropTypes.func,
};

GUI.defaultProps = {
    isScratchDesktop: false,
    //这应该是个请求
    onStorageInit: (storageInstance) =>
        storageInstance.addOfficialScratchWebStores(),

    onProjectLoaded: () => {},
    onUpdateProjectId: () => {},
    onVmInit: (/* vm */) => {},
};

const mapStateToProps = (state) => {
    const loadingState = state.scratchGui.projectState.loadingState;
    return {
        expanded: state.scratchGui.cards.expanded,
        width: state.scratchGui.cards.width,
        height: state.scratchGui.cards.height,
        activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
        alertsVisible: state.scratchGui.alerts.visible,
        backdropLibraryVisible: state.scratchGui.modals.backdropLibrary,
        backpackLibraryVisible: state.scratchGui.modals.backpackLibrary,
        blocksTabVisible:
            state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
        cardsVisible: state.scratchGui.cards.visible,
        connectionModalVisible: state.scratchGui.modals.connectionModal,
        costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
        costumesTabVisible:
            state.scratchGui.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
        error: state.scratchGui.projectState.error,
        isError: getIsError(loadingState),
        isFullScreen: state.scratchGui.mode.isFullScreen,
        isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
        isRtl: state.locales.isRtl,
        isShowingProject: getIsShowingProject(loadingState),
        loadingStateVisible: state.scratchGui.modals.loadingProject,
        projectId: state.scratchGui.projectState.projectId,
        soundsTabVisible:
            state.scratchGui.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,

        targetIsStage:
            state.scratchGui.targets.stage &&
            state.scratchGui.targets.stage.id ===
                state.scratchGui.targets.editingTarget,
        telemetryModalVisible: state.scratchGui.modals.telemetryModal,
        tipsLibraryVisible: state.scratchGui.modals.tipsLibrary,
        vm: state.scratchGui.vm,
    };
};

const mapDispatchToProps = (dispatch) => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onActivateTab: (tab) => {
        console.log("currenttab", tab);
        dispatch(activateTab(tab));
    },
    resizeCard: (w, h) => {
        dispatch(resizeCard(w, h));
    },
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onRequestCloseBackdropLibrary: () => dispatch(closeBackdropLibrary()),
    onRequestCloseCostumeLibrary: () => dispatch(closeCostumeLibrary()),
    onRequestCloseTelemetryModal: () => dispatch(closeTelemetryModal()),
    ////
    onBackpackClick: (e) => {
        dispatch(openBackpackLibrary());
        //dispatch(openSpriteLibrary3in1());
    },
    onRequestCloseBackpackLibrary: () => {
        dispatch(closeBackpackLibrary());
        // dispatch(closeSpriteLibrary3in1());
    },
});

const ConnectedGUI = injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(GUI)
);

// note that redux's 'compose' function is just being used as a general utility to make
// the hierarchy of HOC constructor calls clearer here; it has nothing to do with redux's
// ability to compose reducers.
const WrappedGui = compose(
    LocalizationHOC,
    ErrorBoundaryHOC("Top Level App"),
    FontLoaderHOC,
    QueryParserHOC,
    ProjectFetcherHOC,
    TitledHOC,
    ProjectSaverHOC,
    vmListenerHOC,
    vmManagerHOC,
    SBFileUploaderHOC,
    cloudManagerHOC
)(ConnectedGUI);

WrappedGui.setAppElement = ReactModal.setAppElement;
export default WrappedGui;
