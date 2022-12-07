import * as nodeClass from "./classes"
import * as pathOP from "./pathOperations"

/**
 * File implement operation for paths used by Size Partitioning
 * only used, when attribute sizePartitioning is true
 * author:  Lukáš Hrmo
 */

/** 
 * wrapper for findLightEdge to not search on single-vertex paths
 * return: null if path is single-vertex otherwise return findLightEdge, 
 */
export function light(path: nodeClass.Path): nodeClass.ExternalNode | null {
    if (path.pathRoot == null) {
        return null
    }
    return findLightEdge(path.pathRoot, 0, 0)
}

/** 
 * vertex symbolizes edge between (x,y), where x is parent of y
 * return: y, right most descendant of left subtree 
 */
function findAncestor(vertex: nodeClass.InternalNode): nodeClass.ExternalNode {
    let nextNode = vertex.bleft
    if (nextNode instanceof nodeClass.InternalNode) {
        nextNode = nextNode.btail
    }
    return nextNode
}

/** 
 * vertex symbolizes edge between (x,y), where x is parent of y
 * return: x, left most descendant of right subtree 
 */
function findSuccessor(vertex: nodeClass.InternalNode): nodeClass.ExternalNode {
    let nextNode = vertex.bright
    if (nextNode instanceof nodeClass.InternalNode) {
        nextNode = nextNode.bhead
    }
    return nextNode
}

/** 
 * searches for light internalNode (light-solid edge) in virtual tree, 
 * return: internalNode - virtual tree contains light-solid edge
 *         null         - virtual tree does not contains light-solid edge
 */
function findLightEdge(vertex: nodeClass.InternalNode, leftWeightSum: number, rightWeightSum: number): nodeClass.ExternalNode | null {
    let rightLight: nodeClass.ExternalNode | null = null, leftLight: nodeClass.ExternalNode | null = null
    if (vertex.bright instanceof nodeClass.InternalNode) {
        rightLight = findLightEdge(vertex.bright, leftWeightSum, rightWeightSum + vertex.bleft.weight)
        if (rightLight != null) {
            return rightLight
        }
    }

    let leftVertex = findAncestor(vertex)
    let rightVertex = findSuccessor(vertex)
    if (vertex.isHeavy(leftWeightSum, leftVertex.weight, rightWeightSum, rightVertex.weight)) {
        return rightVertex
    }

    if (vertex.bleft instanceof nodeClass.InternalNode) {
        leftLight = findLightEdge(vertex.bleft, leftWeightSum + vertex.bright.weight, rightWeightSum)
        if (leftLight != null) {
            return leftLight
        }
    }
    return null
}

/**  
 * finds between children connected by dashed edge, path with biggest weight 
 * return: [Path,number] - path with greatest weight, weight of the path 
 *         [null,number] - null if vertex does not contains chilldren conencted by dashed edge
 */
export function maxwt(v: nodeClass.ExternalNode): [nodeClass.Path | null, number] {
    if (v.pathSet == null) {
        return [null, 0]
    }
    var maxWTNode: nodeClass.Path | null = null, maxWTValue: number = 0
    for (let e of v.pathSet) {
        if (maxWTValue < e.weight) {
            maxWTValue = e.weight
            maxWTNode = e.pathPointer
        }
    }
    return [maxWTNode, 0]
}

/**  
 * converts light-solid edge to light-dashed, split the path into two paths
 * return: Path - new created path
 */
export function slice(p: nodeClass.Path | null, sizeStruct: boolean, treeDataStructure: nodeClass.CollectionOfTrees) {
    var v: nodeClass.ExternalNode | null
    var r: nodeClass.Path | null, s: nodeClass.Path | undefined
    var x: number, y: number

    if (p == null) {
        return null
    }
    v = light(p)
    if (v == null) { // operation has no light edges
        return null
    }

    [p, r, x, y] = pathOP.split(v, sizeStruct, treeDataStructure)

    if (r == null) {
        s = pathOP.path(v)
    } else {
        s = pathOP.concatenate(pathOP.path(v), r, y, sizeStruct)
    }
    if (p != null) {
        pathOP.tail(p).dparent = v
        pathOP.tail(p).dcost = x
        v.weight = v.weight + p.getWeight()
    }
    var [q, qValue] = maxwt(v)
    if (q != null) {
        if (2 * qValue > v.weight) {
            v.weight = v.weight - q.getWeight()
            v.removeFromPathSet(pathOP.tail(q))
            pathOP.concatenate(q, s, qValue, sizeStruct)
        }
    }
    v.addToPathSet(pathOP.tail(p))
    return p
}

/**  
 * converts multiple light-solid edges to light-dashed, split the path into two paths
 * return: null
 */
export function conceal(path: nodeClass.Path | null, sizeStruct: boolean, treeDataStructure: nodeClass.CollectionOfTrees) {
    while (light(path) != null) {
        path = slice(path, sizeStruct, treeDataStructure)
        if (!(path instanceof nodeClass.Path)) {
            break
        }
    }
    if (path == null) {
        return null
    }
    let v = pathOP.head(path)
    let [s, sValue] = maxwt(v)
    if (s != null && 2 * sValue > v.weight) {
        let [q, r, x, y] = pathOP.split(v, sizeStruct, treeDataStructure)
        v.weight = v.weight - sValue
        v.removeFromPathSet(pathOP.tail(s))
        let sVal = pathOP.tail(s).dcost
        if (sVal == null) {
            sVal = 0
        }
        pathOP.concatenate(s, pathOP.path(v), sVal, sizeStruct)
        if (r != null) {
            pathOP.concatenate(s, r, y, sizeStruct)
        }
    }
}