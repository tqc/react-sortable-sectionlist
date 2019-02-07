import React, { Component } from 'react';

import './App.scss';

import Sections from "./examples/Sections";
import Tree from "./examples/Tree";

class App extends Component {

    render() {
        return (
            <div className="App">
                <h1>React Sortable Section List</h1>
                <a className="subtitle" href="https://github.com/tqc/react-sortable-sectionlist">github.com/tqc/react-sortable-sectionlist</a>

                <p>A work in progress react list component. Design goals include:</p>
                <ul>
                    <li>Common API for web and React Native implementations</li>
                    <li>Reasonable performance with large lists</li>
                    <li>Animation based on datasource changes rather than UI events</li>
                    <li>Extensible with arbitrary list item components</li>
                    <li>Multicolumn, but with the option for full width items</li>
                </ul>



                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, </p>
                <p>quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <hr/>
                <h2>Demo</h2>
                <p>A similar data structure rendered as a tree or grid by using different item components</p>
                <div className="demorow">
                    <div className="treedemo">
                        <Tree />
                    </div>
                    <div className="griddemo">
                        <Sections />
                    </div>
                </div>
                <hr/>
                <h2>Usage</h2>
                <pre><code>npm install react-sortable-sectionlist
                </code></pre>
                <p>See src/examples for details</p>
                <pre><code>{"<SortableSectionList\n\
    className='grid'\n\
    numCols={4}\n\
    itemWidth={150}\n\
    itemHeight={200}\n\
    rootItemHeight={40}\n\
    toggleSection={this.toggleSection}\n\
    headerComponent={SectionHeader}\n\
    itemComponent={ThumbnailItem}\n\
    willAcceptDrop={this.willAcceptDrop}\n\
    handleMove={this.handleMove}\n\
    sections={sections} />"}
                </code></pre>




            </div>

        );
    }
}

export default App;
