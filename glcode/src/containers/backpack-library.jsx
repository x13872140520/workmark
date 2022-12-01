import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { injectIntl, intlShape, defineMessages } from "react-intl";
import VM from "scratch-vm";

import spriteLibraryContent from "../lib/libraries/sprites.json";
import randomizeSpritePosition from "../lib/randomize-sprite-position";
import spriteTags from "../lib/libraries/sprite-tags";
import { CreatAxios, api, tagsType } from "../utils/request";
// import LibraryComponent from '../components/library/library.jsx';
import LibrarysComponent from "../components/librarys/librarys.jsx";
import {
    getTags,
    getMaterial,
    getRoleMaterial,
    getDataByType,
} from "../utils/api.js";
const messages = defineMessages({
    backpacktip: {
        defaultMessage: "Back Pack",
        description: "choice a role material",
        id: "gui.backpack.backpacktip",
    },
});

class BackpackLibrary extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, ["handleItemSelect"]);
        this.state = {
            spriteTags: [],
            spriteLibraryContent,
        };
    }
    componentDidMount() {
        this.handleCancel();
    }
    handleCancel = () => {
        var that = this;
        getRoleMaterial({
            type: tagsType.spritesType,
        }).then((result) => {
            console.log("getSpritesListok", result);
            //这里需要更换成新的getRoleMaterialByType接口，需要传token，返回的是所有已采纳的素材
            //用户自己上传的素材怎么处理的
            that.setState({
                spriteLibraryContent: result.data.data.records,
            });
        });
    };
    handleItemSelect(item) {
        console.log("handleItemSelect", item);
        // Randomize position of library sprite
        randomizeSpritePosition(item);
        this.props.vm.addSprite(JSON.stringify(item)).then(() => {
            this.props.onActivateBlocksTab();
        });
    }
    render() {
        console.log("backpackrender");
        return (
            <LibrarysComponent
                data={this.state.spriteLibraryContent}
                id="backpackLibrary"
                tags={this.state.spriteTags}
                title={this.props.intl.formatMessage(messages.backpacktip)}
                showCancelButton={true}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
                onCancel={this.handleCancel}
            />
        );
    }
}

BackpackLibrary.propTypes = {
    intl: intlShape.isRequired,
    onActivateBlocksTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(BackpackLibrary);
