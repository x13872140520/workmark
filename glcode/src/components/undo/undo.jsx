import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import undoIcon from './icon--undo.svg';
import styles from './undo.css';

const UndoComponent = function (props) {
    const {
        active,
        className,
        onClick,
        title,
        ...componentProps
    } = props;
    return (
        <img
            className={classNames(
                className,
                styles.undo,
                {
                    [styles.isActive]: active
                }
            )}
            draggable={false}
            src={undoIcon}
            title={title}
            onClick={onClick}
            {...componentProps}
        />
    );
};

UndoComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string
};

UndoComponent.defaultProps = {
    active: false,
    title: 'Stop'
};

export default UndoComponent;
