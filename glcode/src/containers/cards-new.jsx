import { connect } from "react-redux";
import PropTypes from "prop-types";
import React from "react";
import {
    activateDeck,
    closeCards,
    resizeCard,
    shrinkExpandCards,
    nextStep,
    prevStep,
    dragCard,
    startDrag,
    endDrag,
} from "../reducers/cards";

import { openTipsLibrary } from "../reducers/modals";

import CardsComponent from "../components/cards-new/cards-new.jsx";
import { loadImageData } from "../lib/libraries/decks/translate-image.js";
import { notScratchDesktop } from "../lib/isScratchDesktop";

class CardsNew extends React.Component {
    constructor() {
        super();
        this.state = {
            width: 468,
            height: 323,
            confirmOpen: false,
        };
    }
    componentDidMount() {
        if (this.props.locale !== "en") {
            loadImageData(this.props.locale);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.locale !== prevProps.locale) {
            loadImageData(this.props.locale);
        }
    }
    closeConfirm = () => {
        this.setState({
            confirmOpen: false,
        });
    };
    openConfirm = () => {
        console.log("openConfirm");
        this.setState({
            confirmOpen: true,
        });
    };
    render() {
        return (
            <CardsComponent
                {...this.props}
                confirmOpen={this.state.confirmOpen}
                closeConfirm={this.closeConfirm}
                openConfirm={this.openConfirm}
            />
        );
    }
}

CardsNew.propTypes = {
    locale: PropTypes.string.isRequired,
    confirmOpen: PropTypes.bool.isRequired,
    closeConfirm: PropTypes.func,
    openConfirm: PropTypes.func,
};

const mapStateToProps = (state) => ({
    visible: state.scratchGui.cards.visible,
    expanded: state.scratchGui.cards.expanded,
    width: state.scratchGui.cards.width,
    height: state.scratchGui.cards.height,
    x: state.scratchGui.cards.x,
    y: state.scratchGui.cards.y,
    isRtl: state.locales.isRtl,
    locale: state.locales.locale,
    dragging: state.scratchGui.cards.dragging,
    showVideos: notScratchDesktop(),
});

const mapDispatchToProps = (dispatch) => ({
    onActivateDeckFactory: (id) => () => dispatch(activateDeck(id)),
    onShowAll: () => {
        dispatch(openTipsLibrary());
        dispatch(closeCards());
    },
    onCloseCards: () => {
        console.log("onCloseCards");
        dispatch(closeCards());
    },
    resizeCard: (expanded) => {
        setTimeout(function () {
            if (!expanded) {
                let w = window.localStorage.getItem("beforeUnExpandedWidth");
                let h = window.localStorage.getItem("beforeUnExpandedHeight");
                console.log("wh", w, h);
                document.getElementById("card-div").style.width = w;
                document.getElementById("card-div").style.minWidth = w;
                document.getElementById("card-div").style.height = h;
                document.getElementById("card-div").style.minHeight = h;
                document.getElementsByClassName(
                    "react-draggable"
                )[0].style.width = w;
                document.getElementsByClassName(
                    "react-draggable"
                )[0].style.minWidth = w;
                document.getElementsByClassName(
                    "react-draggable"
                )[0].style.height = h;
                document.getElementsByClassName(
                    "react-draggable"
                )[0].style.minHeight = h;
            } else if (expanded) {
                window.localStorage.setItem(
                    "beforeUnExpandedWidth",
                    document.getElementById("card-div").offsetWidth + "px"
                );
                window.localStorage.setItem(
                    "beforeUnExpandedHeight",
                    document.getElementById("card-div").offsetHeight + "px"
                );
                document.getElementsByClassName(
                    "react-draggable"
                )[0].style.height = "64px";
                document.getElementsByClassName(
                    "react-draggable"
                )[0].style.minHeight = "64px";
            }
            dispatch(
                resizeCard(
                    document.getElementById("card-div").offsetWidth,
                    document.getElementById("card-div").offsetHeight
                )
            );
        }, 0);
        //
    },
    onShrinkExpandCards: () => dispatch(shrinkExpandCards()),
    onNextStep: () => dispatch(nextStep()),
    onPrevStep: () => dispatch(prevStep()),
    onDrag: (e_, data) => dispatch(dragCard(data.x, data.y)),
    onStartDrag: () => dispatch(startDrag()),
    onEndDrag: () => dispatch(endDrag()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardsNew);
