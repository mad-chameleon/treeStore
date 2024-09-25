"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeStore = void 0;
;
var TreeStore = /** @class */ (function () {
    function TreeStore(items) {
        this.items = items;
        this.itemsDict = new Map();
        this.itemChildren = new Map();
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var item = _a[_i];
            var parent_1 = item.parent.toString();
            var id = item.id.toString();
            this.itemsDict.set(id, item);
            var ids = this.itemChildren.get(parent_1) || [];
            this.itemChildren.set(parent_1, __spreadArray(__spreadArray([], ids, true), [id], false));
        }
    }
    TreeStore.prototype.getAll = function () {
        return this.items;
    };
    TreeStore.prototype.getItem = function (id) {
        var item = this.itemsDict.get(id.toString());
        return item || null;
    };
    TreeStore.prototype.getChildren = function (id) {
        var _this = this;
        var childrenIds = this.itemChildren.get(id.toString()) || [];
        return childrenIds.map(function (id) { return _this.getItem(id); });
    };
    TreeStore.prototype.getAllChildren = function (id) {
        var allChildren = [];
        var stack = this.getChildren(id);
        while (stack.length) {
            var currentChild = stack.pop();
            if (!currentChild) {
                continue;
            }
            allChildren.push(currentChild);
            var currentChildId = currentChild.id.toString();
            // concat быстрее на больших массивах
            stack.push.apply(stack, this.getChildren(currentChildId));
        }
        return allChildren;
    };
    TreeStore.prototype.getAllParents = function (id) {
        var parents = [];
        var item = this.getItem(id.toString());
        if (!item) {
            return parents;
        }
        var currentParent = this.getItem(item.parent.toString());
        while (currentParent) {
            parents.push(currentParent);
            var currentParentId = currentParent.parent.toString();
            if (currentParentId === 'root') {
                return parents;
            }
            currentParent = this.getItem(currentParentId);
        }
        return parents;
    };
    return TreeStore;
}());
exports.TreeStore = TreeStore;
var items = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },
    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },
    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];
var ts = new TreeStore(items);
// console.log(ts.getAll());
// console.log(ts.getItem(7));
// console.log(ts.getChildren(4));
// console.log(ts.getChildren(5));
// console.log(ts.getChildren(2));
// console.log(ts.getAllChildren(2));
// console.log(ts.getAllParents(7));
