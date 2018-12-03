import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SortableSectionList from "../common/SortableSectionList";
import DraggedItem from "./DraggedItem";
import SortableSectionListItem from "./SortableSectionListItem";

export default class SortableSectionListWeb extends SortableSectionList {
    constructor() {
        super();
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
    }
    onMouseDown(e) {
        if (this.state.draggedItem) return;
        let x = e.pageX - this.containerElement.offsetLeft;
        let y = e.pageY - this.containerElement.offsetTop;
        this.startDrag(x, y);
    }
    onMouseMove(e) {
        if (!this.state.draggedItem) return;
        let x = e.pageX - this.containerElement.offsetLeft;
        let y = e.pageY - this.containerElement.offsetTop;
        this.continueDrag(x, y);
    }
    onMouseUp(e) {
        if (!this.state.draggedItem) return;
        if (!this.state.dropType) return;
        this.endDrag();
    }
    render() {
        let {draggedItem} = this.state;
        let flattenedList = this.updateFlattenedList();

        return (
            <div
                ref={(el) => { this.containerElement = el; }}
                className={"sectionlist " + this.props.className}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
            >
                {flattenedList.map((item, index) => <SortableSectionListItem {...this.props} isDropTarget={index === this.state.dropTargetIndex} key={item.id} item={item} />)}
                <DraggedItem {...this.props} item={draggedItem} />
            </div>
        );
    }
}
