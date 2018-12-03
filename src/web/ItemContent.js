import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ItemContent extends Component {
    static propTypes = {
        item: PropTypes.shape({
        }).isRequired
    }
    render() {
        let {item} = this.props;
        return <div>{item.title}</div>;
    }
}