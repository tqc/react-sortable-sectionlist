import { Component } from 'react';
import PropTypes from 'prop-types';

export default class PlaceholderItem extends Component {
    static propTypes = {
        item: PropTypes.shape({
        }).isRequired
    }
    render() {
        return null;
    }
}