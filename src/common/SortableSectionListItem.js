import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class SortableSectionListItem extends Component {
    constructor() {
        super();
        this.state = this.getInitialAnimatedState();
    }
    getInitialAnimatedState() {
        throw new Error("getInitialAnimatedState not implemented");
    }
    animateAdd() {
    }
    animateRemove() {
    }
    componentDidMount() {
        this.animateAdd();
    }
    componentDidUpdate() {
        if (this.props.item.removing) {
            this.animateRemove();
        }
        else {
            this.animateAdd();
        }
    }
    renderPlaceholder() {
        throw new Error("renderPlaceholder not implemented");
    }
    renderHeader() {
        throw new Error("renderPlaceholder not implemented");
    }
    renderItem() {
        throw new Error("renderPlaceholder not implemented");
    }
    render() {
        let {item} = this.props;
        if (item.id === "placeholder") {
            return this.renderPlaceholder();
        }
        if (item.level === 0) {
            return this.renderHeader();
        }
        else if (item.level >= 0) {
            return this.renderItem();
        }
    }
}