import React from 'react';
import SortableSectionList from "../common/SortableSectionList";
import DraggedItem from "./DraggedItem";
import SortableSectionListRow from "./SortableSectionListRow";

export default class SortableSectionListWeb extends SortableSectionList {
    static propTypes = SortableSectionList.propTypes;
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
        this.endDrag();
    }
    render() {
        let {draggedItem} = this.state;
        let rows = this.updateRows();

        return (
            <div
                ref={(el) => { this.containerElement = el; }}
                className={"sectionlist " + this.props.className}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
            >
                {rows.map((row, index) => <SortableSectionListRow {...this.props} isDropTarget={this.state.dropTarget && this.state.dropTarget.rowIndex === index} key={row.id} row={row} />)}
                <DraggedItem {...this.props} item={draggedItem} />
            </div>
        );
    }
}
