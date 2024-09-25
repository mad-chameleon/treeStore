type idType = number | string;

export interface IItem {
    id: idType;
    parent: idType;
    type?: string | null;
}

interface ITreeStore {
    items: IItem[];
    itemsById: Map<string, IItem>
    childrenById: Map<string, string[]>

    getAll: () => IItem[];
    getItem: (id: string | number) => IItem | null;
    getChildren: (id: string | number) => (IItem | null)[];
    getAllChildren: (id: string | number) => IItem[];
    getAllParents: (id: string | number) => IItem[];
}

export class TreeStore implements ITreeStore{
    items: IItem[];
    itemsById: Map<string, IItem>
    childrenById: Map<string, string[]>

    constructor(items: IItem[]) {
        this.items = items;
        this.itemsById = new Map();
        this.childrenById = new Map();

        for (const item of this.items) {
            const parent = item.parent.toString();
            const id = item.id.toString();

            this.itemsById.set(id, item);

            const ids = this.childrenById.get(parent) || [];
            this.childrenById.set(parent, [...ids, id]);
        }
    }

    getAll() {
        return this.items;
    }

    getItem(id: idType) {
        const item = this.itemsById.get(id.toString());
        return item || null;
    }

    getChildren (id: idType) {
        const childrenIds = this.childrenById.get(id.toString()) || [];
        return childrenIds.map((id) => this.getItem(id));
    }

    getAllChildren(id: idType) {
        const allChildren: IItem[] = [];
        const stack = this.getChildren(id);

        while (stack.length) {
            const currentChild = stack.pop();
            if (!currentChild) {
                continue;
            }
            allChildren.push(currentChild);
            const currentChildId = currentChild.id.toString();
            stack.push(...this.getChildren(currentChildId));
        }
        return allChildren;
    }

    getAllParents(id: idType) {
        const parents: IItem[] = [];
        const item = this.getItem(id.toString());
        if (!item) {
            return parents;
        }
        let currentParent = this.getItem(item.parent.toString());

        while (currentParent) {
            parents.push(currentParent);
            const currentParentId = currentParent.parent.toString();
            if (currentParentId === 'root') {
                return parents;
            }
            currentParent = this.getItem(currentParentId);
        }
        return parents;
    }
}
