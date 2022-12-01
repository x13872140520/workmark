/*
 * @Author: your name
 * @Date: 2022-03-20 11:49:11
 * @LastEditTime: 2022-03-21 15:30:22
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /gajumakr/glcode/src/containers/sprite-info.jsx
 */
import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";

import SpriteInfoComponent from "../components/sprite-info/sprite-info.jsx";

class SpriteInfo extends React.Component {
    constructor(props) {
        super(props);
        (this.state = {
            open: 1,
            trueKey: false,
        }),
            bindAll(this, [
                "handleClickVisible",
                "handleClickNotVisible",
                "handlePressVisible",
                "handlePressNotVisible",
                "onClickCheck",
            ]);
    }
    onClickCheck(e) {
        e.preventDefault();

        this.setState({
            trueKey: !this.state.trueKey,
        });
        console.log(this.props);

        this.props.hanDisableClick(this.state.trueKey);
    }
    handleClickVisible(e) {
        e.preventDefault();

        this.setState({
            open: 1,
        });
        this.props.onChangeVisibility(true);
    }
    handleClickNotVisible(e) {
        e.preventDefault();
        this.setState({
            open: 2,
        });
        this.props.onChangeVisibility(false);
    }
    handlePressVisible(e) {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            this.props.onChangeVisibility(true);
        }
    }
    handlePressNotVisible(e) {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            this.props.onChangeVisibility(false);
        }
    }
    render() {
        return (
            <SpriteInfoComponent
                {...this.props}
                checkstat={this.state.open}
                thertrueKey={this.state.trueKey}
                onClickNotVisible={this.handleClickNotVisible}
                onClickNotCheck={this.onClickCheck}
                onClickVisible={this.handleClickVisible}
                onPressNotVisible={this.handlePressNotVisible}
                onPressVisible={this.handlePressVisible}
            />
        );
    }
}

SpriteInfo.propTypes = {
    ...SpriteInfoComponent.propTypes,
    onChangeDirection: PropTypes.func,
    onChangeName: PropTypes.func,
    onChangeSize: PropTypes.func,
    onChangeVisibility: PropTypes.func,
    onChangeX: PropTypes.func,
    onChangeY: PropTypes.func,
    x: PropTypes.number,
    y: PropTypes.number,
    thertrueKey: PropTypes.bool,
    editingTarget: PropTypes.string,
};

export default SpriteInfo;
