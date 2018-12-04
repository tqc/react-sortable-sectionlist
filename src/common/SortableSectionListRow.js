import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class SortableSectionListRow extends Component {
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
        if (this.props.row.removing) {
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
        return null;
    }
}