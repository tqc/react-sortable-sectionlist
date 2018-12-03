import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Animated from "animated/lib/targets/react-dom";
import DraggedItem from "../common/DraggedItem";
import ItemContent from "./ItemContent";

export default class DraggedItemWeb extends DraggedItem {
    getInitialAnimatedState() {
        return {
            animOpacity: new Animated.Value(0),
        };
    }
    animateDragStart() {
        Animated.timing(this.state.animOpacity, {toValue: 1, duration: 500}).start();
    }
    animateDragEnd() {

    }
    componentDidMount() {
        this.animateDragStart();
    }
    componentDidUpdate() {

    }
    render() {
        let {item, toggleSection, numCols, isDropTarget} = this.props;
        let ItemComponent = this.props.itemComponent || ItemContent;

        if (!item) {
            return null;
        }

        return (
            <Animated.div className={"draggeditem"}
                style={{
                    left: item.x,
                    top: item.y,
                    opacity: this.state.animOpacity,
                }}
            >
                <ItemComponent {...this.props} />
            </Animated.div>
        );
    }
}