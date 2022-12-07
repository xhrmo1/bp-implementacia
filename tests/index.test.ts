import * as pathOP from "../src/pathOperations"
import * as nodeClass from "../src/classes"

let treeCollection = new nodeClass.CollectionOfTrees([], [])

/* Path1 */

let path1 = new nodeClass.Path(null, "path1", [])
let temp = new nodeClass.InternalNode(true, "temp", false, null, 0, 0, null, 0, 0, 0)

let A = new nodeClass.ExternalNode("A", 11, 3, temp, [], path1)
let D = new nodeClass.ExternalNode("D", 8, 1, temp, [], path1)
let E = new nodeClass.ExternalNode("E", 7, 4, temp, [], path1)
let G = new nodeClass.ExternalNode("G", 3, 2, temp, [], path1)
let H = new nodeClass.ExternalNode("H", 1, 1, temp, [], path1)
path1.allNodes = [H, G, E, D, A]
let edgeG_H = new nodeClass.InternalNode(true, "edgeG_H", null, 0, 0, G, H, H, G, 3)
let edgeE_G = new nodeClass.InternalNode(true, "edgeE_G", null, 0, 2, E, H, edgeG_H, E, 7)
let edgeA_D = new nodeClass.InternalNode(true, "edgeA_D", null, 4, 0, A, D, D, A, 4)
let edgeD_E = new nodeClass.InternalNode(true, "edgeD_E", null, 2, 1, A, H, edgeE_G, edgeA_D, 11)
path1.pathRoot = edgeD_E
edgeA_D.bParent = edgeD_E
edgeG_H.bParent = edgeE_G
edgeE_G.bParent = edgeD_E
A.bParent = edgeA_D
D.bParent = edgeA_D
E.bParent = edgeE_G
G.bParent = edgeG_H
H.bParent = edgeG_H
treeCollection.basicRoots.push(A)
treeCollection.pathRoots.push(path1)
/* Path2 */
let path2 = new nodeClass.Path(null, "path2", [])
let F = new nodeClass.ExternalNode("F", 3, 1, temp, [], path2)
let I = new nodeClass.ExternalNode("I", 2, 1, temp, [], path2)
let J = new nodeClass.ExternalNode("J", 1, 1, temp, [], path2)
path2.allNodes = [J, I, F]
let edgeI_J = new nodeClass.InternalNode(true, "edgeI_J", null, 0, 0, J, F, F, J, 2)
let edgeF_I = new nodeClass.InternalNode(true, "edgeF_I", null, 3, 13, F, edgeI_J, F, F, 3)
treeCollection.basicRoots.push(F)
treeCollection.pathRoots.push(path2)


describe('Testing static path operations on path1', () => {
    test('Path test: node A', () => {
        expect(pathOP.path(A)).toBe(path1);
    });
    test('Head test: path1', () => {
        expect(pathOP.head(path1)).toBe(H);
    });
    test('Tail test: path1', () => {
        expect(pathOP.tail(path1)).toBe(A);
    });

    test('Before test: H', () => {
        expect(pathOP.before(H)).toBe(null);
    });
    test('Before test: H reverse', () => {
        edgeG_H.reversed = true
        expect(pathOP.before(H)).toBe(G);
        edgeG_H.reversed = false
    });
    test('Before test: E', () => {
        expect(pathOP.before(E)).toBe(G);
    });
    test('Before test: E reverse', () => {
        edgeE_G.reversed = true
        expect(pathOP.before(E)).toBe(D);
        edgeE_G.reversed = false
    });

    test('After test: A', () => {
        expect(pathOP.after(A)).toBe(null);
    });
    test('After test: A reverse', () => {
        edgeA_D.reversed = true
        expect(pathOP.after(A)).toBe(D);
        edgeA_D.reversed = false
    });
    test('After test: E', () => {
        expect(pathOP.after(E)).toBe(D);
    });
    test('After test: E reverse', () => {
        edgeE_G.reversed = true
        expect(pathOP.after(E)).toBe(G);
        edgeE_G.reversed = false
    });

    test('PCost test: E ', () => {
        expect(pathOP.pcost(E)).toBe(3);
    });
    test('PCost test: A ', () => {
        expect(pathOP.pcost(A)).toBeNull;
    });

    test('Pcostmin test: path1 ', () => { //checknut aj vo vizualizacii
        expect(pathOP.pmincost(path1)).toBe(H)

    });

});

function resetTree() {
    path1 = new nodeClass.Path(null, "path1", [])
    temp = new nodeClass.InternalNode(true, "temp", false, null, 0, 0, null, 0, 0, 0)

    A = new nodeClass.ExternalNode("A", 11, 3, temp, [], path1)
    D = new nodeClass.ExternalNode("D", 8, 1, temp, [], path1)
    E = new nodeClass.ExternalNode("E", 7, 4, temp, [], path1)
    G = new nodeClass.ExternalNode("G", 3, 2, temp, [], path1)
    H = new nodeClass.ExternalNode("H", 1, 1, temp, [], path1)
    path1.allNodes = [H, G, E, D, A]
    edgeG_H = new nodeClass.InternalNode(true, "edgeG_H", null, 0, 0, G, H, H, G, 3)
    edgeE_G = new nodeClass.InternalNode(true, "edgeE_G", null, 0, 2, E, H, edgeG_H, E, 7)
    edgeA_D = new nodeClass.InternalNode(true, "edgeA_D", null, 4, 0, A, D, D, A, 4)
    edgeD_E = new nodeClass.InternalNode(true, "edgeD_E", null, 2, 1, A, H, edgeE_G, edgeA_D, 11)
    path1.pathRoot = edgeD_E
    edgeA_D.bParent = edgeD_E
    edgeG_H.bParent = edgeE_G
    edgeE_G.bParent = edgeD_E
    A.bParent = edgeA_D
    D.bParent = edgeA_D
    E.bParent = edgeE_G
    G.bParent = edgeG_H
    H.bParent = edgeG_H

    treeCollection.pathCount = 0
    treeCollection.basicRoots = [F] //clear root array
    treeCollection.pathRoots = [path2] // clear path array

    path2 = new nodeClass.Path(null, "path2", [])
    F = new nodeClass.ExternalNode("F", 3, 1, temp, [], path2)
    I = new nodeClass.ExternalNode("I", 2, 1, temp, [], path2)
    J = new nodeClass.ExternalNode("J", 1, 1, temp, [], path2)
    path2.allNodes = [J, I, F]
    edgeI_J = new nodeClass.InternalNode(true, "edgeI_J", null, 0, 0, J, F, F, J, 2)
    edgeF_I = new nodeClass.InternalNode(true, "edgeF_I", null, 3, 13, F, edgeI_J, F, F, 3)


    treeCollection.basicRoots.push(F)
    treeCollection.pathRoots.push(path2)
}

describe('Testing dynamic path operations on path1', () => {
    beforeEach(() => {
        resetTree()
    })

    test("PUpdate test: path1 +3", () => {
        pathOP.pupdate(path1, 3)
        expect(pathOP.pcost(H)).toBe(5);
        expect(pathOP.pcost(G)).toBe(7);
        expect(pathOP.pcost(E)).toBe(6);
        expect(pathOP.pcost(D)).toBe(9);
        expect(pathOP.pcost(A)).toBeNull;
        expect(pathOP.pmincost(path1)).toBe(H)
    });

    test("Reverse test: path1", () => {
        pathOP.reverse(path1);
        expect(pathOP.after(H)).toBeNull;
        expect(pathOP.before(H)).toBe(G);
        expect(pathOP.tail(path1)).toBe(H);
        expect(pathOP.head(path1)).toBe(A);
    })

    test("Concatenate test: tail(path2) head(path1)", () => {
        let newPath = pathOP.concatenate(path2, path1, 10, true);
        console.log(newPath)
        expect(newPath.allNodes.length).toBe(8)
    })

    test("Concatenate split: path1 E", () => {
        let [p, q, x, y] = pathOP.split(E, true, treeCollection);
        expect(x).toBe(3)
        expect(y).toBe(4)
        expect(p?.pathRoot?.bleft).toBe(H)
        expect(p?.pathRoot?.bright).toBe(G)
        expect(q?.pathRoot?.bleft).toBe(D)
        expect(q?.pathRoot?.bright).toBe(A)
    })

    test("Concatenate split: path1 A", () => {
        let [p, q, x, y] = pathOP.split(A, true, treeCollection);
        expect(p).toBeNull
        expect(x).toBe(0)
        expect(q?.allNodes.length).toBe(4)
    })

    test("Concatenate split: path1 H", () => {
        let [p, q, x, y] = pathOP.split(H, true, treeCollection);
        expect(q).toBeNull
        expect(y).toBe(0)
        expect(p?.allNodes.length).toBe(4)
    })
})