import { Component } from 'react';
import PropTypes from 'prop-types';


export default class SortableSectionListItem extends Component {
    static propTypes = {
        item: PropTypes.shape({
            removing: PropTypes.bool
        }).isRequired,
        level: PropTypes.number.isRequired
    }
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
        let {item, level} = this.props;
        if (item.id === "placeholder") {
            return this.renderPlaceholder();
        }
        if (level === 0) {
            return this.renderHeader();
        }
        else if (level >= 0) {
            return this.renderItem();
        }
        else {
            return null;
        }
    }
}