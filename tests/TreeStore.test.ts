import assert from 'node:assert';
import { describe, it, beforeEach } from "node:test";

import { TreeStore, IItem } from '../src/TreeStore.js';

describe('TreeStore', () => {
    let treeStore: TreeStore;
    let items: IItem[];

    beforeEach(() => {
        items = [
            { id: 1, parent: 'root' },
            { id: "2", parent: 1, type: 'test' },
            { id: 3, parent: 1, type: 'test' },

            { id: "4", parent: 2, type: 'test' },
            { id: 5, parent: 2, type: 'test' },
            { id: "6", parent: 2, type: 'test' },

            { id: 7, parent: 4, type: null },
            { id: 8, parent: 4, type: null },
        ];
        treeStore = new TreeStore(items);
    });

    describe('getAll', () => {
        it('should return all items', () => {
            const allItems = treeStore.getAll();
            assert.deepStrictEqual(
                allItems,
                items,
                `items should be equal \n expected: ${JSON.stringify(items)} \n received: ${JSON.stringify(allItems)}`);
        });

        it('should return an empty array', () => {
            const emptyTreeStore = new TreeStore([]);
            const allItems = emptyTreeStore.getAll();
            assert.deepStrictEqual(
                allItems,
                [],
                `should return an empty array, received: ${JSON.stringify(allItems)}`);
        });
    });

    describe('getItem', () => {
        it('should return the correct item by ID', () => {
            const item = treeStore.getItem(7);
            const expected = { id: 7, parent: 4, type: null };
            assert.deepStrictEqual(
                item,
                expected,
                `should return the correct item by ID \n expected: ${JSON.stringify(expected)} \n received: ${JSON.stringify(item)}`);
        });

        it('should return null for non-existent ID', () => {
            const nullItem = treeStore.getItem(999);
            assert.strictEqual(
                nullItem,
                null,
                `should return null for non-existent ID \n received: ${JSON.stringify(nullItem)}`);
        });
    });

    describe('getChildren', () => {
        it('should return correct children array', () => {
            const children = treeStore.getChildren(4);
            const expected = [
                { id: 7, parent: 4, type: null },
                { id: 8, parent: 4, type: null },
            ];
            assert.deepStrictEqual(
                children,
                expected,
                `should return correct children array \n expected: ${JSON.stringify(expected)} \n received: ${JSON.stringify(children)}`);
        });

        it('should return an empty array if no children exist', () => {
            const noChildren = treeStore.getChildren(5);
            assert.deepStrictEqual(
                noChildren,
                [],
                `should return an empty array if no children exist \n received: ${JSON.stringify(noChildren)}`);
        });
    });

    describe('getAllChildren', () => {
        it('should return all descendants recursively', () => {
            const allChildren = treeStore.getAllChildren(2);
            const expected = [
                { id: "4", parent: 2, type: "test" },
                { id: 5, parent: 2, type: "test" },
                { id: "6", parent: 2, type: "test" },
                { id: 7, parent: 4, type: null },
                { id: 8, parent: 4, type: null },
            ];
            const sortById = (a: IItem, b: IItem) => a.id.toString().localeCompare(b.id.toString());
            assert.deepStrictEqual(
                allChildren.sort(sortById),
                expected.sort(sortById),
                `should return all descendants recursively \n expected: ${JSON.stringify(expected)} \n received: ${JSON.stringify(allChildren)}`);
        });

        it('should return an empty array if no descendants exist', () => {
            const noChildren = treeStore.getChildren(8);
            assert.deepStrictEqual(
                noChildren,
                [],
                `should return an empty array if no descendants exist \n received: ${JSON.stringify(noChildren)}`);
        });
    });

    describe('getAllParents', () => {
        it('should return all parents up to the root', () => {
            const parents = treeStore.getAllParents(7);
            const expected = [
                { id: "4", parent: 2, type: 'test' },
                { id: "2", parent: 1, type: 'test' },
                { id: 1, parent: 'root' },
            ];
            assert.deepStrictEqual(
                parents,
                expected,
                `should return all parents up to the root expected: ${JSON.stringify(expected)} \n received: ${JSON.stringify(parents)}`);
        });

        it('should return an empty array if no parents exist', () => {
            const parents = treeStore.getAllParents(1);
            const expected = [];
            assert.deepStrictEqual(
                parents,
                expected,
                `should return an empty array if no parents expected: ${JSON.stringify(expected)} \n received: ${JSON.stringify(parents)}`);
        });
    });
});

