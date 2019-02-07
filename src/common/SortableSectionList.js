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

    if (!item.children || item.children.length === 0 || item.collapsed) {
    // nothing to add
    }
    else {
        for (let i = 0; i < item.children.length; i++) {
            result.push.apply(result, flattenData(result[0], item.children[i], i, dropTargetId, dropType, draggedItemId));
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

function getRowsForTree(originalTree, numCols, headerHeight, itemHeight, itemWidth) {
    let rows = [];
    function pushRow(items, parentItemId, index, level) {
        let row = {
            parentItemId,
            items,
            level
        };
        if (items.length === 1 && (numCols === 1 || !parentItemId)) {
            // single column or header - push item as a row
            row.id = items[0].id;
        }
        else {
            row.id = (parentItemId || "row") + "-" + index;
        }
        if (!parentItemId) {
            row.height = headerHeight;
        }
        else {
            row.height = itemHeight;
        }
        if (row.height !== 0) {
            rows.push(row);
        }
    }

    function pushRowsForNodes(nodes, level, parentItemId) {
        if (!nodes || nodes.length === 0) return;
        let currentRow = [];
        let rowIndex = 0;
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            currentRow.push(node);

            let nextNode = nodes[i + 1];
            let rowIsFull = currentRow.length >= numCols || !parentItemId;
            if (rowIsFull || !nextNode) {
                pushRow(currentRow, parentItemId, ++rowIndex, level);
                for (let j = 0; j < currentRow.length; j++) {
                    let item = currentRow[j];
                    if (item.children && !item.collapsed) {
                        pushRowsForNodes(item.children, level + 1, item.id);
                    }
                }
                currentRow = [];
            }

        }
    }

    pushRowsForNodes(originalTree, 0);
    return rows;
}

function rowAt(rows, x, y) {
    let itemY = 0;
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        if (itemY + row.height > y) return {
            row,
            rowIndex: i,
            yOffset: y - itemY
        };
        itemY += row.height;
    }
}

function itemAt(rows, x, y, itemWidth) {
    let result = rowAt(rows, x, y);
    if (!result.row) return result;

    if (result.row.items.length === 1) {
        result.item = result.row.items[0];
        result.xOffset = x;
        result.indexInRow = 0;
        return result;
    }
    else {
        let itemIndex = Math.min(Math.floor(x / itemWidth), result.row.items.length - 1);
        result.item = result.row.items[itemIndex];
        result.xOffset = x - itemIndex * itemWidth;
        result.indexInRow = itemIndex;
    }

    return result;
}

class SortableSectionList extends Component {
    static propTypes = {
        className: PropTypes.string,
        numCols: PropTypes.number.isRequired,
        itemHeight: PropTypes.number.isRequired,
        itemWidth: PropTypes.number.isRequired,
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
        this.rows = [];
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

        let target = itemAt(this.rows, x, y, this.props.itemWidth);
        console.log(target);
        if (!target) return;
        let draggedItem = {
            ...target.item,
            parentId: target.row.parentItemId,
            level: target.row.level,
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

        let target = itemAt(this.rows, x, y, this.props.itemWidth);
        console.log(target);

        let dropTargetId = null;
        let dropTargetItem = null;
        let dropType = null;
        if (!target || !target.item) {
            // not accepting drop
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
        if (this.state.dropType) {
            this.props.handleMove(this.state.dropTargetItem, this.state.draggedItem, this.state.dropType);
        }
        this.setState({draggedItem: null, dropTargetId: null, dropType: null});
    }
    updateRows() {
        let now = new Date().getTime();
        let {sections} = this.props;

        let oldRows = this.rows || [];
        let oldRowMap = [];
        for (let i = 0; i < oldRows.length; i++) {
            oldRowMap[oldRows[i].id] = oldRows[i];
        }

        let newRows = getRowsForTree(sections, this.props.numCols || 1, this.props.rootItemHeight, this.props.itemHeight || 200, this.props.itemWidth || 150);

        let allRows = [];

        let oldIds = oldRows.map(o => o.id);
        let currentIds = newRows.map(o => o.id);
        let i = 0; let j = 0;

        while (i < newRows.length) {
            if (!oldRowMap[newRows[i].id]) {
                // new item
                allRows.push(newRows[i]);
                i++;
            }
            else {
                // get to this item in old list, recording anything removed
                while (j < oldIds.length && oldIds[j] !== currentIds[i]) {
                    if (currentIds.indexOf(oldIds[j]) < 0 && !(oldRows[j].removed < now - 1000)) {
                        allRows.push({
                            removed: now,
                            ...oldRows[j],
                            removing: true
                        });
                    }
                    j++;
                }

                allRows.push(newRows[i]);
                // todo: record changes within the row
                i++;
                j++;
            }
        }

        while (j < oldIds.length) {
            if (currentIds.indexOf(oldIds[j]) < 0 && !(oldRows[j].removed < now - 1000)) {
                allRows.push({
                    removed: now,
                    ...oldRows[j],
                    removing: true
                });
            }
            j++;
        }

        this.rows = allRows;
        console.log(allRows);
        return allRows;
    }
    render() {
        return null;
    }
}

export default SortableSectionList;
