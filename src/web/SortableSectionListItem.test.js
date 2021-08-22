const SortableSectionListItem = require("./SortableSectionListItem")
// @ponicode
describe("getInitialAnimatedState", () => {
    let inst

    beforeEach(() => {
        inst = new SortableSectionListItem.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.getInitialAnimatedState()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("animateRemove", () => {
    let inst

    beforeEach(() => {
        inst = new SortableSectionListItem.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.animateRemove()
        }
    
        expect(callFunction).not.toThrow()
    })
})
