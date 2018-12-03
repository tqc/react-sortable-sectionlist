import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DraggedItem extends Component {
    constructor() {
        super();
        this.state = this.getInitialAnimatedState();
    }
    getInitialAnimatedState() {
        throw new Error("getInitialAnimatedState not implemented");
    }
    animateDragStart() {
    }
    animateDragEnd() {
    }
    componentDidMount() {
        this.animateDragStart();
    }
    componentDidUpdate() {
    }
    render() {
        return null;
    }
}