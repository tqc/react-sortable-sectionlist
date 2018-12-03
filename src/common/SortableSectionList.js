import { Component } from 'react';
import PropTypes from 'prop-types';

function flattenData(parentItem, item, index, dropTargetId, dropType, draggedItemId) {

    let parentId = parentItem ? parentItem.id : null;
    let idPrefix = parentItem ? parentItem.id + "-" : "";
    let itemLevel = parentItem ? parentItem.level + 1 : 0;

    if (typeof item !== "object") {
        item = {
            id: idPrefix + index,
            title: item,
            level: itemLevel,
            parentId: parentId
        };
    }

    let result = [];
    if (dropTargetId === item.id && dropType === "before") {
        result.push({
            id: "placeholder",
            title: "Placeholder",
            level: itemLevel
        });
    }

    if (item.id !== draggedItemId)
        result.push({
            ...item,
            level: itemLevel,
            parentId
        });

    if (!item.data || item.data.length === 0 || item.collapsed) {
    // nothing to add
    }
    else {
        for (let i = 0; i < item.data.length; i++) {
            result.push.apply(result, flattenData(result[0], item.data[i], i, dropTargetId, dropType, draggedItemId));
        }
    }
    if (dropTargetId === item.id && dropType === "into" && !item.collapsed) {
        result.push({
            id: "placeholder",
            title: "Placeholder",
            level: itemLevel + 1
        });
    }

    if (dropTargetId === item.id && dropType === "after") {
        result.push({
            id: "placeholder",
            title: "Placeholder",
            level: itemLevel
        });
    }

    return result;
}

class SortableSectionList extends Component {
    static propTypes = {
        className: PropTypes.string,
        numCols: PropTypes.number.isRequired,
        itemHeight: PropTypes.number.isRequired,
        rootItemHeight: PropTypes.number.isRequired,
        toggleSection: PropTypes.func.isRequired,
        willAcceptDrop: PropTypes.func.isRequired,
        handleMove: PropTypes.func.isRequired,
        headerComponent: PropTypes.func.isRequired,
        itemComponent: PropTypes.func.isRequired,
        sections: PropTypes.arrayOf(PropTypes.shape({
        })).isRequired
    }
    constructor() {
        super();
        this.state = {
            dropTargetIndex: null,
        };
    }
    itemAt(x, y) {
        let itemX = 0;
        let itemY = 0;
        let parentSectionIndex = null;
        let parentSection = null;
        for (let i = 0; i < this.flattenedList.length; i++) {
            let item = this.flattenedList[i];
            if (item.removing) continue;
            let nextIndex = i;
            let nextItem = this.flattenedList[++nextIndex];
            while (nextItem && nextItem.removing) nextItem = this.flattenedList[++nextIndex];
            let itemHeight = this.props.itemHeight;
            let itemWidth = this.props.itemWidth;

            if (item.level === 0) {
                parentSectionIndex = i;
                parentSection = item;
                itemHeight = this.props.rootItemHeight;
                itemWidth = 1000;
            }

            if (x > itemX && x < itemX + itemWidth && y > itemY && y < itemY + itemHeight) return {
                item,
                index: i,
                xOffset: x - itemX,
                yOffset: y - itemY
            };

            if ((nextItem && nextItem.level === 0) && x > itemX + itemWidth && y > itemY && y < itemY + itemHeight) return {
                item: parentSection,
                index: parentSectionIndex,
                xOffset: 0,
                yOffset: 0
            };


            if (item.level === 0) {
                itemX = 0;
                itemY += itemHeight;
            } else {
                itemX += itemWidth;
                if (itemX >= itemWidth * this.props.numCols || (nextItem && nextItem.level === 0)) {
                    itemX = 0;
                    itemY += itemHeight;
                }
            }
        }
        return null;
    }
    startDrag(x, y) {
        let target = this.itemAt(x, y);
        console.log(target);
        if (!target) return;
        let draggedItem = {
            ...target.item,
            x: x - target.xOffset,
            y: y - target.yOffset,
            xOffset: target.xOffset,
            yOffset: target.yOffset
        };
        if (draggedItem.level === 0) return;
        this.setState({draggedItem: draggedItem});
        this.continueDrag(x, y, draggedItem);
    }
    continueDrag(x, y, initialDraggedItem = this.state.draggedItem) {
        let draggedItem = {
            ...initialDraggedItem,
            x: x - initialDraggedItem.xOffset,
            y: y - initialDraggedItem.xOffset,
        };
        this.setState({draggedItem: draggedItem});

        let target = this.itemAt(x, y);
        let dropTargetId = null;
        let dropTargetItem = null;
        let dropType = null;
        if (!target || !target.item) {
            // not accepting drop
        }
        else if (target.item.id === "placeholder") {
            // no change?
            return;
        }
        else {
            dropTargetItem = target.item;
            dropTargetId = target.item.id;
            dropType = this.props.willAcceptDrop(target.item, draggedItem, target.xOffset, target.yOffset, this.props.itemWidth, this.props.itemHeight);
        }


        if (dropTargetId !== this.state.dropTargetId || dropType !== this.state.dropType) {
            this.setState({draggedItem, dropTargetId, dropTargetItem, dropType});
        }
        else {
            this.setState({draggedItem});
        }

        console.log(dropTargetId + ": " + dropType);
    }
    endDrag(x, y) {
        this.props.handleMove(this.state.dropTargetItem, this.state.draggedItem, this.state.dropType);
        this.setState({draggedItem: null, dropTargetId: null, dropType: null});
    }
    updateFlattenedList() {
        let now = new Date().getTime();
        let {sections} = this.props;
        let {draggedItem, dropTargetId, dropType} = this.state;

        let flattenedList = [];
        let oldList = (this.flattenedList || []);
        for (let i = 0; i < sections.length; i++) {
            flattenedList.push.apply(flattenedList, flattenData(null, sections[i], i, dropTargetId, dropType, draggedItem && draggedItem.id));
        }

        let currentIds = flattenedList.map(o => o.id);
        let oldIds = oldList.map(o => o.id);
        let removedIds = oldIds.filter(id => currentIds.indexOf(id) < 0);
        let addedIds = oldIds.filter(id => currentIds.indexOf(id) < 0);

        let i = 0; let j = 0;

        this.flattenedList = [];

        while (i < currentIds.length) {
            if (addedIds.indexOf(currentIds[i]) >= 0) {
                // new item
                this.flattenedList.push(flattenedList[i]);
                i++;
            }
            else {
                // get to this item in old list, recording anything removed
                while (j < oldIds.length && oldIds[j] !== currentIds[i]) {
                    if (currentIds.indexOf(oldIds[j]) < 0 && !(oldList[j].removed < now - 1000)) {
                        this.flattenedList.push({
                            removed: now,
                            ...oldList[j],
                            removing: true
                        });
                    }
                    j++;
                }
            }

            this.flattenedList.push(flattenedList[i]);
            i++;
            j++;
        }


        while (j < oldIds.length) {
            if (currentIds.indexOf(oldIds[j]) < 0 && !(oldList[j].removed < now - 1000)) {
                this.flattenedList.push({
                    removed: now,
                    ...oldList[j],
                    removing: true
                });
            }
            j++;
        }

        console.log(removedIds);

        return this.flattenedList;
    }
    render() {
        return null;
    }
}

export default SortableSectionList;
