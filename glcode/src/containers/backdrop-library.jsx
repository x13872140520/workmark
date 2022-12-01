import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import VM from "scratch-vm";
import LibraryComponent from "../components/library/library.jsx";
import { CreatAxios, api, tagsType } from "../utils/request";
import {
    getTags,
    getMaterial,
    getRoleMaterial,
    getDataByType,
} from "../utils/api.js";
const messages = defineMessages({
    libraryTitle: {
        defaultMessage: "Choose a Backdrop",
        description: "Heading for the backdrop library",
        id: "gui.costumeLibrary.chooseABackdrop",
    },
});

class BackdropLibrary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backdropLibraryContent: [],
            backdropTags: [],
        };

        bindAll(this, ["handleItemSelect"]);
    }
    componentDidMount() {
        var that = this;
        var lang = document.documentElement.lang
            ? document.documentElement.lang
            : "zh-cn";
        //这里异步加载背景库的标签和列表
        getTags({
            type: tagsType.backDropType,
        }).then((result) => {
            that.setState({
                backdropTags: result.data,
            });
        });
        getMaterial({
            type: tagsType.backDropType,
        }).then((result) => {
            that.setState({
                backdropLibraryContent: result.data.data.records,
            });
        });
    }
    handleItemSelect(item) {
        console.log("backdropadd", item);
        const vmBackdrop = {
            name: item.name,
            rotationCenterX: item.rotationCenterX,
            rotationCenterY: item.rotationCenterY,
            bitmapResolution: item.bitmapResolution,
            skinId: null,
        };
        // Do not switch to stage, just add the backdrop
        this.props.vm.addBackdrop(item.md5ext, vmBackdrop);
    }
    render() {
        return (
            <LibraryComponent
                // data={backdropLibraryContent}
                data={this.state.backdropLibraryContent}
                id="backdropLibrary"
                tags={this.state.backdropTags}
                title={this.props.intl.formatMessage(messages.libraryTitle)}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

BackdropLibrary.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(BackdropLibrary);
