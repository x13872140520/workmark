/*
 * @Author: your name
 * @Date: 2022-02-23 15:38:05
 * @LastEditTime: 2022-03-03 13:20:54
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/workmark/src/components/green-flag/green-flag.jsx
 */
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import greenFlagIcon from "./icon-start.svg";
import styles from "./green-flag.css";

const GreenFlagComponent = function (props) {
    const { active, className, onClick, title, ...componentProps } = props;
    return (
        <div
            className={classNames(className, styles.greenFlag, {
                [styles.isActive]: active,
            })}
            draggable={false}
            //src={greenFlagIcon}
            onClick={onClick}
            {...componentProps}
        >
            {title}
        </div>
    );
};
GreenFlagComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};
GreenFlagComponent.defaultProps = {
    active: false,
    title: "Go",
};
export default GreenFlagComponent;
