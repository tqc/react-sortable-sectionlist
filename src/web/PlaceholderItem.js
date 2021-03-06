import React from 'react';
import PlaceholderItem from "../common/PlaceholderItem";

export default class PlaceholderItemWeb extends PlaceholderItem {
    static propTypes = PlaceholderItem.propTypes;
    render() {
        let {item} = this.props;
        return (
            <div className={"ssli ssli-" + item.level}
                style={{
                    width: item.removing ? 0 : 150,
                    height: item.removing ? 0 : this.props.itemHeight,
                    //backgroundColor: item.removing ? "red" : "transparent"
                }}
            >
            </div>
        );
    }
}