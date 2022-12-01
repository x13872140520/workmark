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
    libraryTitle: {
        defaultMessage: "Choose a Sprite",
        description: "Heading for the sprite library",
        id: "gui.spriteLibrary.chooseASprite",
    },
});

class SpriteLibrary extends React.PureComponent {
    constructor(props) {
        super(props);
        bindAll(this, ["handleItemSelect"]);
        this.state = {
            spriteTags: [],
            spriteLibraryContent,
        };
    }
    componentDidMount() {
        var that = this;
        getTags({
            type: tagsType.spritesType,
        }).then((result) => {
            that.setState({
                spriteTags: result.data,
            });
        });
        getRoleMaterial(
            {
                type: tagsType.spritesType,
            },
            false
        ).then((result) => {
            that.setState({
                spriteLibraryContent: result.data.data.records,
            });
        });
    }
    handleItemSelect(item) {
        // Randomize position of library sprite
        randomizeSpritePosition(item);
        if (item.tags[0] == "stage") {
            const vmBackdrop = {
                name: item.name,
                rotationCenterX: item.rotationCenterX,
                rotationCenterY: item.rotationCenterY,
                bitmapResolution: item.bitmapResolution,
                skinId: null,
            };
            // Do not switch to stage, just add the backdrop
            this.props.vm.addBackdrop(item.md5ext, vmBackdrop);
        } else {
            this.props.vm.addSprite(JSON.stringify(item)).then(() => {
                this.props.onActivateBlocksTab();
            });
        }
    }
    render() {
        return (
            <LibrarysComponent
                data={this.state.spriteLibraryContent}
                id="spriteLibrary"
                tags={this.state.spriteTags}
                title={this.props.intl.formatMessage(messages.libraryTitle)}
                onItemSelected={this.handleItemSelect}
                onRequestClose={this.props.onRequestClose}
            />
            // <LibraryComponent
            //     data={spriteLibraryContent}
            //     id="spriteLibrary"
            //     tags={spriteTags}
            //     title={this.props.intl.formatMessage(messages.libraryTitle)}
            //     onItemSelected={this.handleItemSelect}
            //     onRequestClose={this.props.onRequestClose}
            // />
        );
    }
}

SpriteLibrary.propTypes = {
    intl: intlShape.isRequired,
    onActivateBlocksTab: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired,
};

export default injectIntl(SpriteLibrary);
