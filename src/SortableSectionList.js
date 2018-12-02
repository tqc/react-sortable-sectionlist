import React, { Component } from 'react';
import Animated from "animated/lib/targets/react-dom";
import PropTypes from 'prop-types';

function flattenData(parentItem, item, index, dropTargetId, dropType, draggedItemId) {

    let parentId = parentItem ? parentItem.id : null;
    let idPrefix = parentItem ? parentItem.id + "-" : "";
    let itemLevel = parentItem ? parentItem.level + 1 : 0;

    if (typeof item !== "object") {
        item = {
            id: idPrefix + index,
            title: item,
            level: itemLevel,
            parentId: parentId
        };
    }

    let result = [];
    if (dropTargetId === item.id && dropType === "before") {
        result.push({
            id: "placeholder",
            title: "Placeholder",
            level: itemLevel
        });
    }

    if (item.id !== draggedItemId)
        result.push({
            ...item,
            level: itemLevel,
            parentId
        });

    if (!item.data || item.data.length === 0 || item.collapsed) {
    // nothing to add
    }
    else {
        for (let i = 0; i < item.data.length; i++) {
            result.push.apply(result, flattenData(result[0], item.data[i], i, dropTargetId, dropType, draggedItemId));
        }
    }
    if (dropTargetId === item.id && dropType === "into" && !item.collapsed) {
        result.push({
            id: "placeholder",
            title: "Placeholder",
            level: itemLevel + 1
        });
    }

    if (dropTargetId === item.id && dropType === "after") {
        result.push({
            id: "placeholder",
            title: "Placeholder",
            level: itemLevel
        });
    }

    return result;
}

class ItemContent extends Component {
    render() {
        let {item} = this.props;
        return <div>{item.title}</div>;
    }
}

class SortableSectionListItem extends Component {
  state = {
      animWidth: new Animated.Value(0),
      animOpacity: new Animated.Value(0),
      animHeight: new Animated.Value(0)
  };
  componentDidMount() {
      console.log("item mounted");
      Animated.timing(this.state.animOpacity, {toValue: 1, duration: 500}).start();
      Animated.timing(this.state.animWidth, {toValue: 150, duration: 500}).start();
      Animated.timing(this.state.animHeight, {toValue: this.props.itemHeight, duration: 500}).start();
  }
  componentDidUpdate() {
      if (this.props.item.removing) {
          Animated.timing(this.state.animOpacity, {toValue: 0, duration: 500}).start();
          Animated.timing(this.state.animWidth, {toValue: 0, duration: 500}).start();
          Animated.timing(this.state.animHeight, {toValue: 0, duration: 500}).start();
      }
      else {
          Animated.timing(this.state.animOpacity, {toValue: 1, duration: 500}).start();
          Animated.timing(this.state.animWidth, {toValue: 150, duration: 500}).start();
          Animated.timing(this.state.animHeight, {toValue: this.props.itemHeight, duration: 500}).start();
      }
  }
  render() {
      let {item, toggleSection} = this.props;
      let HeaderComponent = this.props.headerComponent || ItemContent;
      let ItemComponent = this.props.itemComponent || ItemContent;
      if (item.id === "placeholder") {
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
      if (item.level === 0) {
          return (
              <div className={"ssli ssli-" + item.level}
                  onClick={() => toggleSection(item)}
              >
                  <HeaderComponent {...this.props} />
              </div>
          );
      }
      else if (item.level >= 0) {
          return (
              <Animated.div className={"ssli ssli-" + item.level}
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
}


class DraggedItem extends Component {
  state = {
      animOpacity: new Animated.Value(0),
  };
  componentDidMount() {
      console.log("item mounted");
      Animated.timing(this.state.animOpacity, {toValue: 1, duration: 500}).start();
  }
  componentDidUpdate() {
  /*  if (this.props.item.removing) {
      Animated.timing(this.state.animOpacity, {toValue: 0, duration: 500}).start();
    }
    else {
      Animated.timing(this.state.animOpacity, {toValue: 1, duration: 500}).start();
    }*/
  }
  render() {
      let {item, toggleSection, numCols, isDropTarget} = this.props;
      let ItemComponent = this.props.itemComponent || ItemContent;
      let width = 600 / numCols;


      return (
          <Animated.div className={"draggeditem"}
              style={{
                  left: item.x,
                  top: item.y,
                  opacity: this.state.animOpacity,
              }}
          >
              <ItemComponent {...this.props} />
          </Animated.div>
      );
  }
}



class SortableSectionList extends Component {
    static propTypes = {
        className: PropTypes.string,
        numCols: PropTypes.number.isRequired,
        itemHeight: PropTypes.number.isRequired,
        rootItemHeight: PropTypes.number.isRequired,
        toggleSection: PropTypes.func.isRequired,
        willAcceptDrop: PropTypes.func.isRequired,
        handleMove: PropTypes.func.isRequired,
        headerComponent: PropTypes.func.isRequired,
        itemComponent: PropTypes.func.isRequired,
        sections: PropTypes.arrayOf(PropTypes.shape({
        })).isRequired
    }
    constructor() {
        super();
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.state = {
            dropTargetIndex: null,
        };
    }
    itemAt(x, y) {
        let itemX = 0;
        let itemY = 0;
        let parentSectionIndex = null;
        let parentSection = null;
        for (let i = 0; i < this.flattenedList.length; i++) {
            let item = this.flattenedList[i];
            if (item.removing) continue;
            let nextIndex = i;
            let nextItem = this.flattenedList[++nextIndex];
            while (nextItem && nextItem.removing) nextItem = this.flattenedList[++nextIndex];
            let itemHeight = this.props.itemHeight;
            let itemWidth = 150;

            if (item.level === 0) {
                parentSectionIndex = i;
                parentSection = item;
                itemHeight = this.props.rootItemHeight;
                itemWidth = 1000;
            }

            if (x > itemX && x < itemX + itemWidth && y > itemY && y < itemY + itemHeight) return {
                item,
                index: i,
                xOffset: x - itemX,
                yOffset: y - itemY
            };

            if ((nextItem && nextItem.level === 0) && x > itemX + itemWidth && y > itemY && y < itemY + itemHeight) return {
                item: parentSection,
                index: parentSectionIndex,
                xOffset: 0,
                yOffset: 0
            };


            if (item.level === 0) {
                itemX = 0;
                itemY += itemHeight;
            } else {
                itemX += itemWidth;
                if (itemX > 500 || (nextItem && nextItem.level === 0)) {
                    itemX = 0;
                    itemY += itemHeight;
                }
            }
        }
        return null;
    }

    onMouseDown(e) {
        if (this.state.draggedItem) return;
        let x = e.pageX - this.div.offsetLeft;
        let y = e.pageY - this.div.offsetTop;
        let target = this.itemAt(x, y);
        console.log(target);
        if (!target) return;
        let draggedItem = {
            ...target.item,
            x: x - target.xOffset,
            y: y - target.yOffset,
            xOffset: target.xOffset,
            yOffset: target.yOffset
        };
        if (draggedItem.level === 0) return;
        this.setState({draggedItem: draggedItem});
        this.setState({dropTargetIndex: target.index});

    }
    onMouseMove(e) {
        if (!this.state.draggedItem) return;
        let x = e.pageX - this.div.offsetLeft;
        let y = e.pageY - this.div.offsetTop;

        let draggedItem = {
            ...this.state.draggedItem,
            x: x - this.state.draggedItem.xOffset,
            y: y - this.state.draggedItem.xOffset,
        };
        this.setState({draggedItem: draggedItem});


        let target = this.itemAt(x, y);
        let dropTargetId = null;
        let dropTargetItem = null;
        let dropType = null;
        if (!target || !target.item) {
            // not accepting drop
        }
        else if (target.item.id === "placeholder") {
            // no change?
            return;
        }
        else {
            dropTargetItem = target.item;
            dropTargetId = target.item.id;
            dropType = this.props.willAcceptDrop(target.item, this.state.draggedItem, target.xOffset, target.yOffset, this.props.itemWidth, this.props.itemHeight);
        }


        if (dropTargetId !== this.state.dropTargetId || dropType !== this.state.dropType) {
            this.setState({dropTargetId, dropTargetItem, dropType});
        }

        console.log(dropTargetId + ": " + dropType);
    }
    onMouseUp(e) {
        if (!this.state.draggedItem) return;
        if (!this.state.dropType) return;

        this.props.handleMove(this.state.dropTargetItem, this.state.draggedItem, this.state.dropType);
        this.setState({draggedItem: null, dropTargetId: null, dropType: null});
    }
    render() {
        let now = new Date().getTime();
        let {sections} = this.props;
        let {draggedItem, dropTargetId, dropType} = this.state;
        let flattenedList = [];
        let draggedElement = null;
        let oldList = (this.flattenedList || []);
        for (let i = 0; i < sections.length; i++) {
            flattenedList.push.apply(flattenedList, flattenData(null, sections[i], i, dropTargetId, dropType, draggedItem && draggedItem.id));
        }

        let currentIds = flattenedList.map(o => o.id);
        let oldIds = oldList.map(o => o.id);
        let removedIds = oldIds.filter(id => currentIds.indexOf(id) < 0);
        let addedIds = oldIds.filter(id => currentIds.indexOf(id) < 0);

        let i = 0; let j = 0;

        this.flattenedList = [];

        while (i < currentIds.length) {
            if (addedIds.indexOf(currentIds[i]) >= 0) {
                // new item
                this.flattenedList.push(flattenedList[i]);
                i++;
            }
            else {
                // get to this item in old list, recording anything removed
                while (j < oldIds.length && oldIds[j] !== currentIds[i]) {
                    if (currentIds.indexOf(oldIds[j]) < 0 && !(oldList[j].removed < now - 1000)) {
                        this.flattenedList.push({
                            removed: now,
                            ...oldList[j],
                            removing: true
                        });
                    }
                    j++;
                }
            }

            this.flattenedList.push(flattenedList[i]);
            i++;
            j++;
        }


        while (j < oldIds.length) {
            if (currentIds.indexOf(oldIds[j]) < 0 && !(oldList[j].removed < now - 1000)) {
                this.flattenedList.push({
                    removed: now,
                    ...oldList[j],
                    removing: true
                });
            }
            j++;
        }

        console.log(removedIds);


        if (draggedItem) {
            draggedElement = (<DraggedItem {...this.props} key={draggedItem.id} item={draggedItem} />);
        }

        // console.log(flattenedList);
        return (
            <div
                ref={(el) => { this.div = el; }}
                className={"sectionlist " + this.props.className}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
            >
                {this.flattenedList.map((item, index) => <SortableSectionListItem {...this.props} isDropTarget={index === this.state.dropTargetIndex} key={item.id} item={item} />)}
                {draggedElement}
            </div>
        );
    }
}

export default SortableSectionList;
