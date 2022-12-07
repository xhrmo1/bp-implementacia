import * as nodeClass from "./classes"

/**
 * Part of solution for ST-trees
 * File implements basic 13 path operations and 2 composed operations
 * 
 * Author: Lukáš Hrmo
 */

/**
 *
 * @param vertex externalNode 
 * @returns pathPoiner into which vertex belongs to
 */
export function path(vertex: nodeClass.ExternalNode): nodeClass.Path {
    return vertex.pathPointer
}

/**
 * 
 * @param p pointer to path, can be even single-vertex path
 * @returns left most vertex in path
 */
export function head(p: nodeClass.Path): nodeClass.ExternalNode {
    if (p.pathRoot == null && p.allNodes != null) {
        return p.allNodes[0]
    }
    if (p.pathRoot?.reversed) {
        return p.pathRoot?.btail
    }
    return p.pathRoot?.bhead
}

/**
 * 
 * @param p pointer to path, can be even single-vertex path
 * @returns right most vertex in path
 */
export function tail(p: nodeClass.Path): nodeClass.ExternalNode {
    if (p.pathRoot == null && p.allNodes != null) {
        return p.allNodes[0]
    }
    if (p.pathRoot?.reversed) {
        return p.pathRoot?.bhead
    }
    return p.pathRoot?.btail

}

/**
 * traverse from vertex to right throught bright
 * @param vertex 
 * @returns right most child of vertex, 
 *          if vertext is ExternalNode, return that vertex
 */
function goingRightDown(vertex: nodeClass.InternalNode | nodeClass.ExternalNode): nodeClass.ExternalNode | null {
    if (vertex instanceof nodeClass.ExternalNode) {
        return vertex
    }
    if (vertex.bright instanceof nodeClass.ExternalNode) {
        return vertex.bright
    }
    if (vertex.bright != null) {
        return goingRightDown(vertex.bright)
    }
    return vertex.bleft instanceof nodeClass.ExternalNode ? vertex.bleft : null
}

/**
 * going up until vertex is left child of bparent
 * @param vertex current node
 * @param previousNode node, from which we came
 * @returns vertex, which is after(vertex)
 */
function goingUPleft(vertex: nodeClass.InternalNode, previousNode: any): nodeClass.ExternalNode | null {
    if (vertex.bleft == previousNode) {
        if (vertex.bParent == null) {
            return null
        }
        return goingUPleft(vertex.bParent, vertex)
    }
    if (vertex.bleft == null) {
        return null
    }
    if (vertex.bleft instanceof nodeClass.ExternalNode) {
        return vertex.bleft
    }
    return goingRightDown(vertex.bleft)
}

/**
 * search for node, which is child of vertex
 * @param vertex for which we want before
 * @returns vertex before
 */
function beforeSearch(vertex: nodeClass.ExternalNode): nodeClass.ExternalNode | null {
    if (vertex.bParent != null) {
        if (vertex.bParent.bleft instanceof nodeClass.ExternalNode && vertex.bParent.bleft != vertex) {
            return vertex.bParent.bleft
        }
        return goingUPleft(vertex.bParent, vertex)
    }
    return null
}

/**
 * wrapper for beforeSearch, if path is reverse, search for after
 * @param vertex externalNode, for which we want before externalNode
 * @returns externalNode 
 */
export function before(vertex: nodeClass.ExternalNode): nodeClass.ExternalNode | null {
    if (vertex.bParent != null && !vertex.bParent.reversed) {
        return beforeSearch(vertex)
    }
    return afterSearch(vertex)
}

/**
 * traverse virtual tree by bleft
 * @param vertex 
 * @returns left most vertex 
 */
function goingLeftDown(vertex: nodeClass.InternalNode): nodeClass.ExternalNode | null {
    if (vertex.bleft instanceof nodeClass.ExternalNode) {
        return vertex.bleft
    }
    if (vertex.bleft != null) {
        return goingLeftDown(vertex.bleft)
    }
    return null
}

/**
 *  traversing virtual tree until vertex.bleft == previousVertex
 * @param vertex currentVertex
 * @param previousNode vertex we visited last time
 * @returns first vertex, which is left from our vertex
 */
function goingUpRight(vertex: nodeClass.InternalNode, previousNode: any): nodeClass.ExternalNode | null {
    if (vertex.bright == previousNode) {
        if (vertex.bParent == null) {
            return null
        }
        return goingUpRight(vertex.bParent, vertex)
    }
    if (vertex.bright == null) {
        return null
    }
    if (vertex.bright instanceof nodeClass.ExternalNode) {
        return vertex.bright
    }
    return goingLeftDown(vertex.bright)
}

/**
 * search vertex which is parent of vertex
 * @param vertex for which we want after
 * @returns null if vertex is tail of path
 */
function afterSearch(vertex: nodeClass.ExternalNode): nodeClass.ExternalNode | null {
    if (vertex.bParent != null) {
        if (vertex.bParent.bright instanceof nodeClass.ExternalNode && vertex.bParent.bright != vertex) {
            return vertex.bParent.bright
        }
        return goingUpRight(vertex.bParent, vertex)
    }
    return null
}

/**
 * wrapper for afterSearch, if reversed on path, use before
 * @param vertex for which we want after
 * @returns after
 */
export function after(vertex: nodeClass.ExternalNode): nodeClass.ExternalNode | null {
    if (vertex.bParent != null && !vertex.bParent.reversed) {
        return afterSearch(vertex)
    }
    return beforeSearch(vertex)
}

/**
 * 
 * @param vertex current vertex
 * @param previousNode vertex we visited previous
 * @returns edgeCost, null, if vertex is tail of path
 */
function pcostInside(vertex: nodeClass.InternalNode, previousNode: any): number | null {
    if (vertex.bleft == previousNode) {
        return vertex.edgeCost(vertex)
    }
    if (vertex.bParent == null) {
        return null
    }
    return pcostInside(vertex.bParent, vertex)
}

/**
 * wrapper for pcostInside, handle single-vertex paths
 * @param vertex for which we to know cost 
 * @returns edgeCost between (after(vertex),vertex), null if vertex is tail of path
 */
export function pcost(vertex: nodeClass.ExternalNode): number | null {
    if (vertex.bParent != null) {
        return pcostInside(vertex.bParent, vertex)
    }
    return null
}

/**
 * search for edge with minimum cost
 * @param vertex currently searching edge
 * @returns vertex where edge between(parent(vertex),vertex) has smallest cost
 */
function pmincostInside(vertex: nodeClass.InternalNode): nodeClass.ExternalNode | null {
    let u: nodeClass.InternalNode | nodeClass.ExternalNode
    u = vertex
    while (!(u.netcost == 0 && (u.bright instanceof nodeClass.ExternalNode || u.bright.netmin > 0))) {
        if (u.bright instanceof nodeClass.InternalNode && u.netcost == 0) {
            u = u.bright
        } else {
            if (u.netcost > 0) {
                u = u.bleft
            }
        }
        if (u instanceof nodeClass.ExternalNode) {
            break
        }
    }
    if (u instanceof nodeClass.ExternalNode) {
        return u
    }
    return goingRightDown(u.bleft)

}

/**
 * wrapper for pmincostInside, handle single-vertex paths
 * @param p where we want to search
 * @returns vertex where edge between(parent(vertex),vertex) has smallest cost
 */
export function pmincost(p: nodeClass.Path) {
    if (p.pathRoot != null) {
        return pmincostInside(p.pathRoot)
    }
    return null
}

/**
 * by updating netMin, we update edgeCost for all edges in virtual tree
 * @param p root to virtual tree
 * @param x increase edgesCost by
 */
export function pupdate(p: nodeClass.Path, x: number) {
    p.pathRoot.netmin += x
}

/**
 * negatee attribute reversed
 * @param vertex edge from virtual tree 
 */
function reverseInside(vertex: nodeClass.InternalNode) {
    vertex.reversed = !vertex.reversed
    if (vertex.bleft instanceof nodeClass.InternalNode) {
        reverseInside(vertex.bleft)
    }
    if (vertex.bright instanceof nodeClass.InternalNode) {
        reverseInside(vertex.bright)
    }
}

/**
 * wrapper for reverseInside, negate attribute reversed in virtual tree
 * @param p root of virtual tree
 * @returns void
 */
export function reverse(p: nodeClass.Path) {
    if (p.pathRoot == null) {
        return
    }
    if (p.allNodes != null) {
        p.allNodes = p.allNodes.reverse()
    }
    reverseInside(p.pathRoot)
}

/**
 * left rotation on vertex
 * @param parentVertex so we can setupt bparent and bleft correctly
 * @param vertex we want to rotate on
 * @returns new root of rotated tree
 */
function leftrotation(parentVertex: nodeClass.InternalNode, vertex: nodeClass.InternalNode): nodeClass.InternalNode {
    const newParent = vertex.bright
    if (newParent instanceof nodeClass.ExternalNode) {
        return vertex // externalNode cannot have children
    }
    const newRightChild = newParent.bleft
    vertex.bright = newRightChild
    vertex.bParent = newParent
    newParent.bleft = vertex
    newParent.bParent = parentVertex
    parentVertex.bleft = newParent
    //end of rotation, setting up weights
    vertex.weight = vertex.bleft.weight + vertex.bright.weight
    parentVertex.weight = parentVertex.bleft.weight + parentVertex.bright.weight
    if (parentVertex.getRank() > 1 + Math.floor(Math.log2(parentVertex.weight))) { // rank conditions is invalid
        parentVertex.rank = 1 + Math.floor(Math.log2(parentVertex.weight))
    }
    return newParent
}

/**
 * rebalancing to left by using leftRotation
 * @param vertex vertex, on which we are rebalancing
 */
function leftRebalancing(vertex: nodeClass.InternalNode) {
    let leftNodeRank: number = vertex.bleft.getRank();
    let rightNodeRank: number = vertex.bright.getRank();
    // rankDifference between left and right is maximum one
    while (Math.abs(leftNodeRank - rightNodeRank) > 1 && vertex.bleft instanceof nodeClass.InternalNode) {
        leftrotation(vertex.bParent, vertex)
    }
    vertex.weight = Math.max(vertex.bleft.weight, vertex.bright.weight) + 1
}

/**
 * right rotation on vertex
 * @param parentVertex so we can setup bparent and bright correctly
 * @param vertex we want to rotate on
 * @returns new root of rotated tree
 */
function rightrotation(parentVertex: nodeClass.InternalNode, vertex: nodeClass.InternalNode): nodeClass.InternalNode {
    const newParent = vertex.bleft
    if (newParent instanceof nodeClass.ExternalNode) {
        return vertex // externalNode cannot have children
    }
    const newLeftChild = newParent.bright
    vertex.bleft = newLeftChild
    vertex.bParent = newParent
    newParent.bright = vertex
    newParent.bParent = parentVertex
    parentVertex.bright = newParent
    //end of rotation, setting up weights
    vertex.weight = vertex.bleft.weight + vertex.bright.weight
    parentVertex.weight = parentVertex.bleft.weight + parentVertex.bright.weight
    if (parentVertex.getRank() > 1 + Math.floor(Math.log2(parentVertex.weight))) { // rank conditions is invalid
        parentVertex.rank = 1 + Math.floor(Math.log2(parentVertex.weight))
    }
    return newParent
}

/**
 * rebalancing to right by using rightRotation
 * @param vertex vertex, on which we are rebalancing
 */
function rightRebalancing(vertex: nodeClass.InternalNode) {
    let leftNodeRank: number = vertex.bleft.getRank();
    let rightNodeRank: number = vertex.bright.getRank();
    // rankDifference between left and right is maximum one
    while (Math.abs(leftNodeRank - rightNodeRank) > 1 && vertex.bright instanceof nodeClass.InternalNode) {
        rightrotation(vertex.bParent, vertex)
    }
    vertex.weight = Math.max(vertex.bleft.weight, vertex.bright.weight) + 1
}

/**
 * @param vertex internalNode
 * @returns root of virtualTree
 */
function getRootVirtualTree(vertex: nodeClass.InternalNode): nodeClass.InternalNode {
    while (vertex.bParent != null) {
        vertex = vertex.bParent
    }
    return vertex
}

/**
 * join two paths and create one path of it, rebalance virtual tree
 * @param p path from which we use tail()
 * @param q path from which we use head()
 * @param x cost of edge
 * @param sizePartitioning wheter using Partitioning by Size 
 * @returns combined path
 */
export function concatenate(p: nodeClass.Path, q: nodeClass.Path, x: number, sizePartitioning: boolean): nodeClass.Path {
    let tailVertex = tail(p) //leftVirtualTree
    let headVertex = head(q) //rightVirtualTree
    let qRoot = q.pathRoot != null ? q.pathRoot : q.allNodes[0] //left
    let pRoot = p.pathRoot != null ? p.pathRoot : p.allNodes[0]
    let newSolidEdge = new nodeClass.InternalNode(sizePartitioning, tailVertex.name + "-edge-" + headVertex)
    newSolidEdge.bleft = pRoot
    newSolidEdge.bright = qRoot

    if (pRoot.getRank() == qRoot.getRank() || (pRoot.getRank() > qRoot.getRank() && p.pathRoot == null) || (qRoot.getRank() > pRoot.getRank() && q.pathRoot == null)) {
        newSolidEdge.weight = newSolidEdge.bleft.weight + newSolidEdge.bright.weight
        newSolidEdge.rank = Math.max(pRoot.getRank(), qRoot.getRank()) + 1
        newSolidEdge.netcost = x - Math.min(newSolidEdge.bleft.getNetMin(), newSolidEdge.bright.getNetMin())
        newSolidEdge.netmin = Math.min(newSolidEdge.bleft.getNetMin(), newSolidEdge.bright.getNetMin())
        if (newSolidEdge.bleft instanceof nodeClass.InternalNode) {
            newSolidEdge.bleft.netmin = newSolidEdge.bleft.netmin - newSolidEdge.netmin
        }
        if (newSolidEdge.bright instanceof nodeClass.InternalNode) {
            newSolidEdge.bright.netmin = newSolidEdge.bright.netmin - newSolidEdge.netmin
        }
    } else if (pRoot.getRank() > qRoot.getRank()) {
        rightRebalancing(newSolidEdge)
    } else { // last option is qRoot.rank > pRoot.getRank() && q.pathRoot != null -> q contains at least one edge
        leftRebalancing(newSolidEdge)
    }

    tailVertex.dcost = null
    tailVertex.dparent = null

    let pathVirtualRoot = getRootVirtualTree(newSolidEdge)
    return new nodeClass.Path(pathVirtualRoot, p.pathID, p.allNodes.concat(q.allNodes))
}

/**
 * link vertex to subTree as rightChild, no need to rebalance
 * @param vertex 
 * @param subTree 
 * @returns combined Tree
 */
function rightJoin(vertex: nodeClass.InternalNode, subTree: nodeClass.InternalNode | nodeClass.ExternalNode) {
    vertex.bright = subTree
    return vertex
}

/**
 * link vertex to subTree as leftChild, no need to rebalance
 * @param vertex 
 * @param subTree 
 * @returns 
 */
function leftJoin(vertex: nodeClass.InternalNode, subTree: nodeClass.InternalNode | nodeClass.ExternalNode) {
    vertex.bleft = subTree
    return vertex
}

/**
 * divide path into two separe paths, also split virtual tree
 * @param x we start splitting from
 * @param e1 we dont want this InternalNode in any of virtual trees 
 * @param e2 we dont want this InternalNode in any of virtual trees 
 * @returns root of two new created paths
 */
function splitPath(x: nodeClass.ExternalNode, e1: nodeClass.InternalNode | null, e2: nodeClass.InternalNode | null): (nodeClass.InternalNode | nodeClass.ExternalNode)[] {
    let leftSubTree: nodeClass.InternalNode | nodeClass.ExternalNode;
    let rightSubTree: nodeClass.InternalNode | nodeClass.ExternalNode;
    let px = x.bParent

    while (px != null) {
        if (x == px.bright) {
            px.bright = null // in output subtree wont be node
            if (px == e1 || px == e2) {
                leftSubTree = px.bleft //ignoring px
            } else {
                leftSubTree = leftJoin(px, leftSubTree)
            }
        } else { // x == px.bleft
            px.bleft = null
            if (px == e1 || px == e2) {
                rightSubTree = px.bright
            } else {
                rightSubTree = rightJoin(px, rightSubTree)
            }
        }
        px = px.bParent
    }
    return [leftSubTree, rightSubTree]
}

/**
 * function traverse from vertex to root of virtual tree by attribute bParent, looking for two edges: e1, e2
 * @param vertex for which we are looking two edges
 * @returns: e1 - edge between vertex and children(vertex) on same path; null if vertex is head
 *          e2 - edge between vertex and parent(vertex); null if vertex is tail         
 */
function edgesConnectedWithVertex(vertex: nodeClass.ExternalNode): [nodeClass.InternalNode | null, nodeClass.InternalNode | null, number, number] {
    let e1: nodeClass.InternalNode | null = null;
    let e2: nodeClass.InternalNode | null = null;
    let e1Cost: number = 0, e2Cost: number = 0;

    if (vertex.bParent == null) {
        return [e1, e2, e1Cost, e2Cost]
    }

    if (vertex.bParent.bleft == vertex) {
        e1 = vertex.bParent
        e1Cost = vertex.bParent.edgeCost(vertex.bParent)
    } else {
        e2 = vertex.bParent
        e2Cost = vertex.bParent.edgeCost(vertex.bParent)
    }

    let currentVertex: nodeClass.InternalNode = vertex.bParent
    while (currentVertex.bParent != null) {
        if (e1 == null) { // means we found e2, e1 will be found as currentVertex being currentVertex.bparent.bRight  
            if (currentVertex.bParent.bleft == currentVertex) {
                e1 = currentVertex.bParent
                e1Cost = currentVertex.bParent.edgeCost(currentVertex.bParent)
            }
        } else if (e2 == null) {
            if (currentVertex.bParent.bright == currentVertex) {
                e2 = currentVertex.bParent
                e2Cost = currentVertex.bParent.edgeCost(currentVertex.bParent)
            }
        }
        currentVertex = currentVertex.bParent
    }

    return [e1, e2, e1Cost, e2Cost]
}

/**
 * split path into two paths, also split virtual tree
 * @param vertex on which vertex we want to split
 * @param sizePartitioning wheter we are using sizePartitioning
 * @param collectionOfTrees 
 * @returns two new create paths and edge cost of (after(vertex), vertex) and (vertex,before(vertex))
 */
export function split(vertex: nodeClass.ExternalNode, sizePartitioning: boolean, collectionOfTrees: nodeClass.CollectionOfTrees): [nodeClass.Path | null, nodeClass.Path | null, number, number] {
    let leftSubTree: nodeClass.InternalNode | nodeClass.ExternalNode, rightSubTree: nodeClass.InternalNode | nodeClass.ExternalNode;
    let e1: nodeClass.InternalNode | null, e2: nodeClass.InternalNode | null;
    let e1Cost: number, e2Cost: number;
    let index = path(vertex).allNodes.indexOf(vertex);
    [e1, e2, e1Cost, e2Cost] = edgesConnectedWithVertex(vertex);
    [leftSubTree, rightSubTree] = splitPath(vertex, e1, e2);
    console.log
    if (leftSubTree instanceof nodeClass.ExternalNode) {
        collectionOfTrees.basicRoots.push(leftSubTree)
    } else {
        var leftPath = new nodeClass.Path(leftSubTree, collectionOfTrees.getPathID(), path(vertex).allNodes.slice(index + 1))
    }

    if (rightSubTree instanceof nodeClass.ExternalNode) {
        collectionOfTrees.basicRoots.push(rightSubTree)
    } else {
        var rightPath = new nodeClass.Path(rightSubTree, collectionOfTrees.getPathID(), path(vertex).allNodes.slice(0, index))
    }

    return [leftPath, rightPath, e1Cost, e2Cost]

}

/**
 * A tail(p).dparent to p, convert all incidents
 * @param p this path will be increased
 * @param sizePartitioning wheter we are using partitioning by size
 * @param treeDataStructure 
 * @returns p
 */
export function splice(p: nodeClass.Path, sizePartitioning: boolean, treeDataStructure: nodeClass.CollectionOfTrees): nodeClass.Path {
    var v = tail(p).dparent
    var [qPath, rPath, x, y] = split(v, sizePartitioning, treeDataStructure)
    if (v != null) {
        v.weight = v.weight - p.getWeight()
        if (sizePartitioning) {
            v.removeFromPathSet(tail(p))
        }
    }
    if (qPath != null) {
        tail(qPath).dparent = v
        tail(qPath).dcost = x
        if (v != null) {
            v.weight = v.weight + qPath.getWeight()
            if (sizePartitioning) {
                v.addToPathSet(tail(qPath))
            }
        }
    }

    p = concatenate(p, path(v), tail(p).dcost, sizePartitioning)

    if (rPath == null) {
        return p
    } else {
        return concatenate(p, rPath, y, sizePartitioning)
    }
}

/**
 * Create new path from v to root (v)
 * @param v head of new path
 * @param sizePartitioning wheter we are using partitioning by size
 * @param treeDataStructure 
 * @returns new created path
 */
export function expose(v: nodeClass.ExternalNode, sizePartitioning: boolean, treeDataStructure: nodeClass.CollectionOfTrees): nodeClass.Path {
    var [qPath, rPath, x, y] = split(v, sizePartitioning, treeDataStructure)
    var p: nodeClass.Path

    if (qPath != null) {
        tail(qPath).dparent = v
        tail(qPath).dcost = x
        v.weight = v.weight + qPath.getWeight()
        if (sizePartitioning) {
            v.addToPathSet(tail(qPath))
        }
    }

    if (rPath == null) {
        p = path(v)
    } else {
        p = concatenate(path(v), rPath, y, sizePartitioning,)
    }

    while (tail(p).dparent != null) {
        p = splice(p, sizePartitioning, treeDataStructure)
    }
    return p
}