import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SortableSectionList from "../web/SortableSectionList";

import {sectionData, expandStringItems, moveItem, mutatedTree} from "./ExampleModel";



class SectionHeader extends Component {
    static propTypes = {
        item: PropTypes.shape({
        }).isRequired,
        toggleSection: PropTypes.func,
    }
    render() {
        let {item} = this.props;
        return (
            <div className="sectionheader">{item.title}</div>
        );
    }
}

class ThumbnailItem extends Component {

    render() {
        let {item} = this.props;
        return (
            <div className="draggablethumb">Thumb {item.title}</div>
        );
    }
}


class Sections extends Component {
    constructor() {
        super();
        this.state = {
            sections: expandStringItems(sectionData),
        };
        console.log(this.state.sections);
        this.toggleSection = this.toggleSection.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.willAcceptDrop = this.willAcceptDrop.bind(this);
    }
    toggleSection(item) {
        let newData = this.state.sections.map((node) => {
            return mutatedTree(node, item.id, n => ({...n, collapsed: !n.collapsed}));
        });
        this.setState({sections: newData});
    }
    willAcceptDrop(targetItem, droppedItem, x, y) {
        if (targetItem.level === 0) return "into";
        if (x < 75) return "before";
        //else if (x >= 50  && x < 100) return "into";
        else if (x >= 75) return "after";
        else return null;
    }
    handleMove(targetItem, droppedItem, dropType) {

        console.log("Dropping " + droppedItem.title + " " + dropType + " " + targetItem.title);

        this.setState({sections: moveItem(this.state.sections, targetItem, droppedItem, dropType)});



    }
    render() {
        let {sections} = this.state;
        return (
            <SortableSectionList
                className="grid"
                numCols={4}
                itemWidth={150}
                itemHeight={200}
                rootItemHeight={40}
                toggleSection={this.toggleSection}
                headerComponent={SectionHeader}
                itemComponent={ThumbnailItem}
                willAcceptDrop={this.willAcceptDrop}
                handleMove={this.handleMove}
                sections={sections} />

        );
    }
}

export default Sections;
