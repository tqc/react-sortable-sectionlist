import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SortableSectionList from "../SortableSectionList";

let treeData = [
    {id: "s1", title: 'Title1', data: ['item1', 'item2']},
    {id: "s2", title: 'Title2', data: [{id: "s4", title: 'Subfolder', data: ['item7', 'item8']}, 'item3', 'item4']},
    {id: "s3", title: 'Title3', data: ['item5', 'item6']},
];


function mutatedTree(treeNode, id, fn) {
    if (treeNode.id === id) return fn(treeNode);
    if (typeof treeNode !== "object") return treeNode;
    if (!treeNode.data || treeNode.data.length === 0) return treeNode;
    let newData = treeNode.data.map(n => mutatedTree(n, id, fn));
    for (let i = 0; i < newData.length; i++) {
        if (newData[i] !== treeNode.data[i]) {
            return {
                ...treeNode,
                data: newData
            };
        }
    }
    return treeNode;
}

class TreeRow extends Component {
    static propTypes = {
        item: PropTypes.shape({
        }).isRequired,
        toggleSection: PropTypes.func,
    }
    render() {
        let {item} = this.props;
        if (item.data) {
            return (
                <div>{item.collapsed ? "+" : "-"} {item.title}</div>
            );
        }
        else {
            return (
                <div>{item.title}</div>
            );
        }
    }
}

class TreeDemo extends Component {
    constructor() {
        super();
        this.toggleTreeNode = this.toggleTreeNode.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.willAcceptDrop = this.willAcceptDrop.bind(this);
    }
    state = {
        treeNodes: treeData
    };
    toggleTreeNode(item) {
        let newData = this.state.treeNodes.map((node) => {
            return mutatedTree(node, item.id, n => ({...n, collapsed: !n.collapsed}));
        });
        this.setState({treeNodes: newData});
    }
    willAcceptDrop(targetItem, droppedItem, x, y, w, h) {
        if (targetItem.level === 0) return "into";
        if (x < 75) return "before";
        //else if (x >= 50  && x < 100) return "into";
        else if (x >= 75) return "after";
        else return null;
    }
    handleMove(targetItem, droppedItem, dropType) {

        console.log("Dropping " + droppedItem.title + " " + dropType + " " + targetItem.title);

        let fromSectionId = droppedItem.parentId;
        let toSectionId = null;
        if (dropType === null) return;
        if (dropType === "into") {
            toSectionId = targetItem.id;
        }
        else {
            toSectionId = targetItem.parentId;
        }
        return;
        let fromSection = this.state.sections.find(s => s.id === fromSectionId);
        let toSection = this.state.sections.find(s => s.id === toSectionId);

        let fromSectionData = [...fromSection.data];
        let toSectionData = fromSectionId === toSectionId ? fromSectionData : [...toSection.data];

        let originalItem = fromSectionData.find(o => o === droppedItem.title || o.id === droppedItem.id);


        if (!originalItem) {
            console.warn("original item not found");
            return;
        }


        if (dropType === "into") {
            fromSectionData.splice(fromSectionData.indexOf(originalItem), 1);
            toSectionData.push(originalItem);
        }
        else {
            fromSectionData.splice(fromSectionData.indexOf(originalItem), 1);
            let originalTargetItem = toSectionData.find(o => o === targetItem.title || o.id === targetItem.id);
            if (dropType === "before") {
                toSectionData.splice(toSectionData.indexOf(originalTargetItem), 0, originalItem);
            }
            else if (dropType === "after") {
                toSectionData.splice(toSectionData.indexOf(originalTargetItem) + 1, 0, originalItem);
            }
        }



        let newData = this.state.sections.map((section) => {
            if (section.id === fromSectionId) {
                return {
                    ...section,
                    data: fromSectionData
                };
            }
            else if (section.id === toSectionId) {
                return {
                    ...section,
                    data: toSectionData
                };
            }
            else return section;
        });
        this.setState({sections: newData});
    }
    render() {
        let {treeNodes} = this.state;
        return (
            <SortableSectionList
                className="tree"
                numCols={1}
                itemHeight={30}
                rootItemHeight={30}
                toggleSection={this.toggleTreeNode}
                willAcceptDrop={this.willAcceptDrop}
                handleMove={this.handleMove}
                headerComponent={TreeRow}
                itemComponent={TreeRow}
                sections={treeNodes} />
        );
    }
}

export default TreeDemo;
