export let treeData = [
    {id: "s1", title: 'Title1', children: ['item1', 'item2']},
    {id: "s2", title: 'Title2', children: [{id: "s4", title: 'Subfolder', children: ['item7', 'item8']}, 'item3', 'item4']},
    {id: "s3", title: 'Title3', children: ['item5', 'item6']},
];

export let sectionData = [
    {id: "s1", title: 'First Section', children: ['item1', 'item2']},
    {id: "s2", title: 'Second Section', children: ['item2a', 'item2b', 'item2c', 'item2d']},
    {id: "s3", title: 'Third Section', children: ['item3', 'item4', 'item7', 'item8', 'item9', 'item10']},
    {id: "s4", title: 'Fourth Section', children: ['item5', 'item6']},
];


export function moveItem(originalTree, targetItem, droppedItem, dropType) {
    let fromSectionId = droppedItem.parentId;
    let toSectionId = null;
    if (dropType === null) return;
    if (dropType === "into") {
        toSectionId = targetItem.id;
    }
    else {
        toSectionId = targetItem.parentId;
    }

    // todo: update this to work with items deeper in the tree

    let fromSection = originalTree.find(s => s.id === fromSectionId);
    let toSection = originalTree.find(s => s.id === toSectionId);

    let fromSectionData = [...fromSection.children];
    let toSectionData = fromSectionId === toSectionId ? fromSectionData : [...toSection.children];

    let originalItem = fromSectionData.find(o => o === droppedItem.title || o.id === droppedItem.id);


    if (!originalItem) {
        console.warn("original item not found");
        return;
    }


    if (dropType === "into") {
        fromSectionData.splice(fromSectionData.indexOf(originalItem), 1);
        toSectionData.push(originalItem);
    }
    else {
        fromSectionData.splice(fromSectionData.indexOf(originalItem), 1);
        let originalTargetItem = toSectionData.find(o => o === targetItem.title || o.id === targetItem.id);
        if (dropType === "before") {
            toSectionData.splice(toSectionData.indexOf(originalTargetItem), 0, {...originalItem, parentId: toSectionId});
        }
        else if (dropType === "after") {
            toSectionData.splice(toSectionData.indexOf(originalTargetItem) + 1, 0, {...originalItem, parentId: toSectionId});
        }
    }



    let newData = originalTree.map((section) => {
        if (section.id === fromSectionId) {
            return {
                ...section,
                children: fromSectionData
            };
        }
        else if (section.id === toSectionId) {
            return {
                ...section,
                children: toSectionData
            };
        }
        else return section;
    });

    return newData;
}

export function expandStringItems(d, parentId, index) {
    if (typeof d === "string") {
        return {
            id: (parentId || "item") + "-" + index,
            title: d,
            parentId
        };
    }
    else if (Array.isArray(d)) {
        return d.map((n, i) => expandStringItems(n, parentId, i));
    }
    else if (typeof d === "object") {
        let result = {
            parentId,
            ...d,
        };
        if (!d.id) result.id = (parentId || "item") + "-" + index;
        if (d.children) result.children = expandStringItems(d.children, result.id);
        return result;
    }
    else {
        return d;
    }
}

export function mutatedTree(treeNode, id, fn) {
    if (treeNode.id === id) return fn(treeNode);
    if (typeof treeNode !== "object") return treeNode;
    if (!treeNode.children || treeNode.children.length === 0) return treeNode;
    let newData = treeNode.children.map(n => mutatedTree(n, id, fn));
    for (let i = 0; i < newData.length; i++) {
        if (newData[i] !== treeNode.children[i]) {
            return {
                ...treeNode,
                children: newData
            };
        }
    }
    return treeNode;
}
