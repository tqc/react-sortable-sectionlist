import React, { Component } from 'react';

import './App.scss';

import Sections from "./examples/Sections";
import Tree from "./examples/Tree";

class App extends Component {

    render() {
        return (
            <div className="App">
                <h1>React Sortable Section List</h1>
                <p>Intro...</p>
                <h2>Tree</h2>
                <p>As a tree..</p>
                <Tree />
                <h2>Grid</h2>
                <p>As a grid...</p>
                <Sections />
            </div>

        );
    }
}

export default App;
