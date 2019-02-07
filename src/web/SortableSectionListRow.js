import React from 'react';
import Animated from "animated/lib/targets/react-dom";
import SortableSectionListRow from "../common/SortableSectionListRow";

import SortableSectionListItem from "./SortableSectionListItem";

export default class SortableSectionListRowWeb extends SortableSectionListRow {
    static propTypes = SortableSectionListRow.propTypes;
    getInitialAnimatedState() {
        return {
            animOpacity: new Animated.Value(0),
            animHeight: new Animated.Value(0)
        };
    }
    animateAdd() {
        Animated.timing(this.state.animOpacity, {toValue: 1, duration: 500}).start();
        Animated.timing(this.state.animHeight, {toValue: this.props.row.height, duration: 500}).start();
    }
    animateRemove() {
        Animated.timing(this.state.animOpacity, {toValue: 0, duration: 500}).start();
        Animated.timing(this.state.animHeight, {toValue: 0, duration: 500}).start();
    }
    render() {
        let {row} = this.props;

        return (
            <Animated.div className={"sslr sslr-" + row.level}
                style={{
                    opacity: this.state.animOpacity,
                    height: this.state.animHeight,
                }}
            >
                {row.items.map((item, index) => <SortableSectionListItem {...this.props} isDropTarget={this.state.dropTarget && this.state.dropTarget.indexInRow === index} key={item.id} item={item} level={row.level} />)}
            </Animated.div>
        );
    }
}