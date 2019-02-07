# React Sortable SectionList

A work in progress react list component. Design goals include:

 * Common API for web and React Native implementations
 * Reasonable performance with large lists
 * Animation based on datasource changes rather than UI events
 * Extensible with arbitrary list item components
 * Multicolumn, but with the option for full width items

[Demo](http://tqc/github.io/react-sortable-sectionlist)

# Usage 

    npm install react-sortable-sectionlist

See src/examples for details

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
