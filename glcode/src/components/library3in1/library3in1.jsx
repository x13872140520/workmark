import classNames from "classnames";
import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import {
    FormattedMessage,
    defineMessages,
    injectIntl,
    intlShape,
} from "react-intl";

import LibraryItems from "../../containers/library-items.jsx";
import Modals from "../../containers/modals.jsx";
import Divider from "../divider/divider.jsx";
import Filter from "../filter/filter.jsx";
import TagButtons from "../../containers/tag-buttons.jsx";
import Spinner from "../spinner/spinner.jsx";

import styles from "./library3in1.css";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { makeStyles } from "@material-ui/core/styles";
const messages = defineMessages({
    filterPlaceholder: {
        id: "gui.library.filterPlaceholder",
        defaultMessage: "Search",
        description: "Placeholder text for library search field",
    },
    allTag: {
        id: "gui.library.allTag",
        defaultMessage: "All",
        description:
            "Label for library tag to revert to all items after filtering by tag.",
    },
    sprite: {
        id: "gui.SpriteInfo.sprite",
        defaultMessage: "All",
        description: "Label for sprite library tag.",
    },
    backdrops: {
        id: "gui.stageSelector.backdrops",
        defaultMessage: "All",
        description: "Label for backdrops library tag",
    },
    sound: {
        id: "gui.soundEditor.sound",
        defaultMessage: "All",
        description: "Label for sound library tag",
    },
});
const ALL_TAG = { tag: "all", intlLabel: messages.allTag };
const tagListPrefix = [ALL_TAG];

class LibrarysComponent3in1 extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            "handleClose",
            "handleFilterChange",
            "handleFilterClear",
            "handleMouseEnter",
            "handleMouseLeave",
            "handlePlayingEnd",
            "handleSelect",
            "handleTagClick",
            "setFilteredDataRef",
        ]);
        this.state = {
            playingItem: null,
            filterQuery: "",
            selectedTag: ALL_TAG.tag,
            loaded: false,
            ishow: false,
            currentType: "spritedata", //'spritedata','backdropdata','sounddata'
            currentNode: null,
        };
    }
    componentDidMount() {
        // Allow the spinner to display before loading the content
        setTimeout(() => {
            this.setState({ loaded: true });
        });
        if (this.props.setStopHandler)
            this.props.setStopHandler(this.handlePlayingEnd);
    }
    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.filterQuery !== this.state.filterQuery ||
            prevState.selectedTag !== this.state.selectedTag
        ) {
            this.scrollToTop();
        }
    }

    greet(obj, nameProp) {
        const { [nameProp]: name = "Unknown" } = obj;
        return name;
    }
    getDataByType = function (obj, dataOrtags, spriteOrbackOrsound) {
        const {
            [dataOrtags]: { [spriteOrbackOrsound]: name = "Unknown" },
        } = obj;
        return name;
    };
    handleSelect(id) {
        this.handleClose();
        this.props.onItemSelected(
            this.getFilteredData()[id],
            this.props.currentTypePro
        );
    }
    handleContentScroll(event) {
        var scrollHeight = event.currentTarget.scrollHeight;
        var scrollTop = event.currentTarget.scrollTop;
        var offsetHeight = event.currentTarget.offsetHeight;
        if (scrollHeight === scrollTop + offsetHeight) {
            console.log("滚到底了");
            this.props.onScrollToBottom();
        }
    }
    handleClose() {
        this.props.onRequestClose();
    }
    handleTagClickNew = (node) => {
        if ("41,42,43".includes(node.type)) {
            this.setState({
                currentType: "spritedata",
            });
            this.props.setCurrentType("spritedata");
        } else if ("44,45".includes(node.type)) {
            this.setState({
                currentType: "sounddata",
            });
            this.props.setCurrentType("sounddata");
        } else {
            this.setState({
                currentType: "backdropdata",
            });
            this.props.setCurrentType("backdropdata");
        }
        this.setState({
            currentNode: node,
        });
        this.props.onSelectTag(node);
    };
    handleCancelAdopt = () => {
        this.props.onSelectTag(
            this.state.currentNode
                ? this.state.currentNode
                : { id: "00", type: "111" }
        );
    };
    handleTagClick = (tag, type) => {
        //sprite
        this.setState({
            currentType: type,
        });
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: "",
                selectedTag: tag.toLowerCase(),
            });
        } else {
            this.props.onItemMouseLeave(
                this.getFilteredData()[[this.state.playingItem]]
            );
            this.setState({
                filterQuery: "",
                playingItem: null,
                selectedTag: tag.toLowerCase(),
            });
        }
    };
    handleMouseEnter(id) {
        // don't restart if mouse over already playing item
        if (this.props.onItemMouseEnter && this.state.playingItem !== id) {
            this.props.onItemMouseEnter(this.getFilteredData()[id]);
            this.setState({
                playingItem: id,
            });
        }
    }
    handleMouseLeave(id) {
        if (this.props.onItemMouseLeave) {
            this.props.onItemMouseLeave(this.getFilteredData()[id]);
            this.setState({
                playingItem: null,
            });
        }
    }
    handlePlayingEnd() {
        if (this.state.playingItem !== null) {
            this.setState({
                playingItem: null,
            });
        }
    }
    handleFilterChange(event) {
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: event.target.value,
                selectedTag: ALL_TAG.tag,
            });
        } else {
            this.props.onItemMouseLeave(
                this.getFilteredData()[[this.state.playingItem]]
            );
            this.setState({
                filterQuery: event.target.value,
                playingItem: null,
                selectedTag: ALL_TAG.tag,
            });
        }
    }
    handleFilterClear() {
        this.setState({ filterQuery: "" });
    }
    getFilteredData() {
        let listdata = this.getDataByType(
            this.props,
            "data",
            this.props.currentTypePro
        );
        if (this.state.selectedTag === "all") {
            if (!this.state.filterQuery) return listdata;
            return listdata.filter(
                (dataItem) =>
                    (dataItem.spritetags || [])
                        // Second argument to map sets `this`
                        .map(
                            String.prototype.toLowerCase.call,
                            String.prototype.toLowerCase
                        )
                        .concat(
                            dataItem.name
                                ? (typeof dataItem.name === "string"
                                      ? // Use the name if it is a string, else use formatMessage to get the translated name
                                        dataItem.name
                                      : this.props.intl.formatMessage(
                                            dataItem.name.props
                                        )
                                  ).toLowerCase()
                                : null
                        )
                        .join("\n") // unlikely to partially match newlines
                        .indexOf(this.state.filterQuery.toLowerCase()) !== -1
            );
        }
        return listdata.filter(
            (dataItem) =>
                dataItem.tags &&
                dataItem.tags
                    .map(
                        String.prototype.toLowerCase.call,
                        String.prototype.toLowerCase
                    )
                    .indexOf(this.state.selectedTag) !== -1
        );
    }
    scrollToTop() {
        this.filteredDataRef.scrollTop = 0;
    }
    setFilteredDataRef(ref) {
        this.filteredDataRef = ref;
    }
    renderTree = (nodes) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={nodes.intlLabel.defaultMessage}
            onLabelClick={() => {
                this.handleTagClickNew(nodes);
            }}
            classes={{ label: "current-tree-item" }}
        >
            {Array.isArray(nodes.childTag)
                ? nodes.childTag.map((node) => this.renderTree(node))
                : null}
        </TreeItem>
    );
    render() {
        var thats = this;
        return (
            <Modals
                fullScreen
                contentLabel={this.props.title}
                id={this.props.id}
                onRequestClose={this.handleClose}
            >
                {this.props.filterable || this.props.spritetags}

                {/* <div>
                    <input
                        type="text"
                        placeholder="请输入关键字搜索"
                        onChange={this.handleKey}
                    />
                </div> */}
                <div className={styles.contentBox}>
                    <div className={styles.filterBar}>
                        {this.props.tag && this.props.currentExpandedTagId ? (
                            <TreeView
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpanded={[
                                    this.props.currentExpandedTagId,
                                ]}
                                defaultExpandIcon={<ChevronRightIcon />}
                            >
                                {this.props.tag.map((nodes) =>
                                    this.renderTree(nodes)
                                )}
                            </TreeView>
                        ) : null}
                    </div>
                    <div
                        onScroll={this.handleContentScroll.bind(this)}
                        className={classNames(styles.libraryScrollGrid, {
                            [styles.withFilterBar]:
                                this.props.filterable || this.props.spritetags,
                        })}
                        ref={this.setFilteredDataRef}
                    >
                        {this.state.loaded ? (
                            this.getFilteredData().map((dataItem, index) => (
                                <LibraryItems
                                    bluetoothRequired={
                                        dataItem.bluetoothRequired
                                    }
                                    collaborator={dataItem.collaborator}
                                    description={dataItem.description}
                                    disabled={dataItem.disabled}
                                    extensionId={dataItem.extensionId}
                                    featured={dataItem.featured}
                                    hidden={dataItem.hidden}
                                    iconMd5={
                                        dataItem.costumes
                                            ? dataItem.costumes[0].md5ext
                                            : dataItem.md5ext
                                    }
                                    iconRawURL={dataItem.rawURL}
                                    icons={dataItem.costumes}
                                    id={index}
                                    itemId={dataItem.id}
                                    insetIconURL={dataItem.insetIconURL}
                                    internetConnectionRequired={
                                        dataItem.internetConnectionRequired
                                    }
                                    isPlaying={this.state.playingItem === index}
                                    // key={
                                    //     typeof dataItem.name === "string"
                                    //         ? dataItem.name
                                    //         : dataItem.rawURL
                                    // }
                                    key={index}
                                    name={dataItem.name}
                                    showPlayButton={this.props.showPlayButton}
                                    showCancelButton={false}
                                    onMouseEnter={this.handleMouseEnter}
                                    onMouseLeave={this.handleMouseLeave}
                                    onSelect={this.handleSelect}
                                    onCancelAdopt={this.handleCancelAdopt}
                                />
                            ))
                        ) : (
                            <div className={styles.spinnerWrapper}>
                                <Spinner large level="primary" />
                            </div>
                        )}
                    </div>
                </div>
            </Modals>
        );
    }
}

LibrarysComponent3in1.propTypes = {
    data: PropTypes.object,
    tags: PropTypes.object,
    tag: PropTypes.array,
    currentExpandedTagId: PropTypes.any,
    currentTypePro: PropTypes.string,
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    setStopHandler: PropTypes.func,
    setCurrentType: PropTypes.func,
    onScrollToBottom: PropTypes.func,
    showPlayButton: PropTypes.bool,
    title: PropTypes.string.isRequired,
    onSelectTag: PropTypes.func,
    selectedTag: PropTypes.string,
    onCancelAdopt: PropTypes.func,
};

LibrarysComponent3in1.defaultProps = {
    filterable: true,
    showPlayButton: false,
};

export default injectIntl(LibrarysComponent3in1);
