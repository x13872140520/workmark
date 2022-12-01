/*
 * @Author: your name
 * @Date: 2022-02-23 15:38:05
 * @LastEditTime: 2022-03-03 15:14:13
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/workmark/src/components/stop-all/stop-all.jsx
 */
import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import stopAllIcon from "./icon--stop.svg";
import styles from "./stop-all.css";

const StopAllComponent = function (props) {
    const { active, className, onClick, title, ...componentProps } = props;
    return (
        <div
            className={classNames(className, styles.stopAll, {
                [styles.isActive]: active,
            })}
            draggable={false}
            // src={stopAllIcon}
            onClick={onClick}
            {...componentProps}
        >
            {title}
        </div>
    );
};

StopAllComponent.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
};

StopAllComponent.defaultProps = {
    active: false,
    title: "Stop",
};

export default StopAllComponent;
