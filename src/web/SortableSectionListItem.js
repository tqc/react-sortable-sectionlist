import React from 'react';
import PropTypes from 'prop-types';
import Animated from "animated/lib/targets/react-dom";
import SortableSectionListItem from "../common/SortableSectionListItem";
import ItemContent from "./ItemContent";
import PlaceholderItem from "./PlaceholderItem";

export default class SortableSectionListItemWeb extends SortableSectionListItem {
    getInitialAnimatedState() {
        return {
            animWidth: new Animated.Value(0),
            animOpacity: new Animated.Value(0),
            animHeight: new Animated.Value(0)
        };
    }
    animateAdd() {
        Animated.timing(this.state.animOpacity, {toValue: 1, duration: 500}).start();
        Animated.timing(this.state.animWidth, {toValue: 150, duration: 500}).start();
        Animated.timing(this.state.animHeight, {toValue: this.props.itemHeight, duration: 500}).start();
    }
    animateRemove() {
        Animated.timing(this.state.animOpacity, {toValue: 0, duration: 500}).start();
        Animated.timing(this.state.animWidth, {toValue: 0, duration: 500}).start();
        Animated.timing(this.state.animHeight, {toValue: 0, duration: 500}).start();
    }
    renderPlaceholder() {
        let PlaceholderComponent = this.props.placeholderComponent || PlaceholderItem;
        return (<PlaceholderComponent {...this.props} />);
    }
    renderHeader() {
        let {item, toggleSection} = this.props;
        let HeaderComponent = this.props.headerComponent || ItemContent;
        return (
            <div className={"ssli ssli-" + item.level}
                onClick={() => toggleSection(item)}
            >
                <HeaderComponent {...this.props} />
            </div>
        );
    }
    renderItem() {
        let {item, toggleSection, level} = this.props;
        let ItemComponent = this.props.itemComponent || ItemContent;

        return (
            <Animated.div className={"ssli ssli-" + level}
                style={{
                    //width: item.removing ? width : width,
                    opacity: this.state.animOpacity,
                    width: this.state.animWidth,
                    //            width: item.removing ? 0 : 150,
                    height: this.state.animHeight,
                    //            backgroundColor: item.removing ? "red" : "transparent"
                    //marginLeft: isDropTarget ? 150 : 0
                }}
                onClick={() => toggleSection(item)}
            >
                <ItemComponent {...this.props} />
            </Animated.div>
        );
    }
}