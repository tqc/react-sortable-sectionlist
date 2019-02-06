import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {SortableSectionList} from "../web";

import {treeData, mutatedTree, expandStringItems, moveItem} from "./ExampleModel";



class TreeRow extends Component {
    static propTypes = {
        item: PropTypes.shape({
        }).isRequired,
        toggleSection: PropTypes.func,
    }
    render() {
        let {item} = this.props;
        if (item.children) {
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
        treeNodes: expandStringItems(treeData)
    };
    toggleTreeNode(item) {
        let newData = this.state.treeNodes.map((node) => {
            return mutatedTree(node, item.id, n => ({...n, collapsed: !n.collapsed}));
        });
        this.setState({treeNodes: newData});
    }
    willAcceptDrop(targetItem, droppedItem, x, y, w, h) {
        if (targetItem.id === droppedItem.id) return null;
        if (targetItem.parentId === undefined) return "into";
        if (y < 7) return "before";
        else if (y >= 7 && y < 23) return "into";
        else if (y >= 23) return "after";
        else return null;
    }
    handleMove(targetItem, droppedItem, dropType) {
        console.log("Dropping " + droppedItem.title + " " + dropType + " " + targetItem.title);
        this.setState({treeNodes: moveItem(this.state.treeNodes, targetItem, droppedItem, dropType)});
    }
    render() {
        let {treeNodes} = this.state;
        return (
            <SortableSectionList
                className="tree"
                numCols={1}
                itemWidth={200}
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
