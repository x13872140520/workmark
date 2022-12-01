import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { defineMessages, injectIntl, intlShape } from "react-intl";
import VM from "scratch-vm";

import costumeLibraryContent from "../lib/libraries/costumes.json";
import spriteTags from "../lib/libraries/sprite-tags";
import LibraryComponent from "../components/library/library.jsx";
import LibrarysComponent from "../components/librarys/librarys.jsx";
import { CreatAxios, api, tagsType } from "../utils/request";
import {
    getTags,
    getMaterial,
    getRoleMaterial,
    getDataByType,
} from "../utils/api.js";
const messages = defineMessages({
    libraryTitle: {
        defaultMessage: "Choose a Costume",
        description: "Heading for the costume library",
        id: "gui.costumeLibrary.chooseACostume",
    },
});

class CostumeLibrary extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, ["handleItemSelected"]);
        this.state = {
            costumeTags: [],
            costumeLibraryContent,
        };
    }
    componentDidMount() {
        var that = this;
        getTags({
            type: tagsType.spritesType,
        }).then((result) => {
            that.setState({
                costumeTags: result.data,
            });
        });
        getMaterial(
            {
                type: tagsType.spritesType,
            },
            false
        ).then((result) => {
            that.setState({
                costumeLibraryContent: result.data.data.records,
            });
        });
    }
    handleItemSelected(item) {
        const vmCostume = {
            name: item.name,
            rotationCenterX: item.rotationCenterX,
            rotationCenterY: item.rotationCenterY,
            bitmapResolution: item.bitmapResolution,
            skinId: null,
        };
        this.props.vm.addCostumeFromLibrary(item.md5ext, vmCostume);
    }
    render() {
        return (
            <LibrarysComponent
                data={this.state.costumeLibraryContent}
                id="costumeLibrary"
                tags={this.state.costumeTags}
                title={this.props.intl.formatMessage(messages.libraryTitle)}
                showCancelButton={false}
                onItemSelected={this.handleItemSelected}
                onRequestClose={this.props.onRequestClose}
            />
        );
    }
}

CostumeLibrary.propTypes = {
    intl: intlShape.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(CostumeLibrary);
