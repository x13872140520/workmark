/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-03-24 14:16:06
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-07-13 17:14:54
 * @FilePath: /gajumakr/glcode/src/components/menu-bar/project-title-input.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import classNames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import React from "react";
import { defineMessages, intlShape, injectIntl } from "react-intl";
import { setProjectTitle } from "../../reducers/project-title";

import BufferedInputHOC from "../forms/buffered-input-hoc.jsx";
import Input from "../forms/input.jsx";
const BufferedInput = BufferedInputHOC(Input);

import styles from "./project-title-input.css";

const messages = defineMessages({
    projectTitlePlaceholder: {
        id: "gui.gui.projectTitlePlaceholder",
        description: "Placeholder for project title when blank",
        defaultMessage: "Project title here",
    },
});

const ProjectTitleInput = ({ className, intl, onSubmit, projectTitle }) => (
    <BufferedInput
        className={classNames(styles.titleField, className)}
        maxLength="100"
        placeholder={intl.formatMessage(messages.projectTitlePlaceholder)}
        tabIndex="0"
        type="text"
        value={projectTitle || ""}
        onSubmit={onSubmit}
    />
);

ProjectTitleInput.propTypes = {
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onSubmit: PropTypes.func,
    projectTitle: PropTypes.string,
};

const mapStateToProps = (state) => ({
    projectTitle: state.scratchGui.projectTitle,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (title) => dispatch(setProjectTitle(title)),
});

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(ProjectTitleInput)
);
