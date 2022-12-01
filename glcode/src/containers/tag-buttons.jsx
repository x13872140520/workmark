import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';

import TagButtonsComponent from '../components/tag-buttons/tag-buttons.jsx';

class TagButtons extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick'
        ]);
    }
    handleClick () {
        this.props.onClick(this.props.tag);
    }
    render () {
        return (
            <TagButtonsComponent
                {...this.props}
                onClick={this.handleClick}
            />
        );
    }
}

TagButtons.propTypes = {
    ...TagButtonsComponent.propTypes,
    onClick: PropTypes.func
};

export default TagButtons;
