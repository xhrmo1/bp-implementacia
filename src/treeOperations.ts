import * as nodeClass from "./classes"
import * as pathOP from "./pathOperations"
import * as sizeOP from "./sizeOperations"

/**
 * This file implements 8 main tree operations over ST-trees
 * function param sizePartitioning says whether we are 
 * using naivePartitioning or partitioningBySize
 * For keeping consistency, every operation requeires sizePartitioning,
 * even if operation does not requiers requeire it
 * author:  Lukáš Hrmo
 */

/** 
 * @return parent for vertex, if vertex is root of the tree, returns null
 */
export function parent(vertex: nodeClass.ExternalNode, sizePartitioning: boolean): nodeClass.ExternalNode | null {
    if (vertex == pathOP.tail(pathOP.path(vertex))) {
        return vertex.dparent
    }
    return pathOP.after(vertex)
}

/** 
 * operation expose can violate rule about solid edge for Partitioning by size
 * need to check/repair it by conceal
 * @return root of the tree
 */
export function root(vertex: nodeClass.ExternalNode, sizePartitioning: boolean, treeDataStructure: nodeClass.CollectionOfTrees): nodeClass.ExternalNode {
    let p = pathOP.expose(vertex, sizePartitioning, treeDataStructure)
    vertex = pathOP.tail(p)
    if (sizePartitioning) {
        sizeOP.conceal(p, sizePartitioning, treeDataStructure)
    }
    return vertex
}

/** 
 * @return cost of edge[parent(vertex),vertex], returns null if vertex is root
 */
export function cost(vertex: nodeClass.ExternalNode, sizePartitioning: boolean) {
    if (pathOP.tail(pathOP.path(vertex)) == vertex) {
        return vertex.dcost
    }
    return pathOP.pcost(vertex)
}

/** 
 * operation expose can violate rule about solid edge for Partitioning by size
 * need to check/repair it by conceal
 * @return parent for vertex, if vertex is root of the tree, returns null
 */
export function mincost(vertex: nodeClass.ExternalNode, sizePartitioning: boolean, treeDataStructure: nodeClass.CollectionOfTrees) {
    let p = pathOP.expose(vertex, sizePartitioning, treeDataStructure)
    let x = pathOP.pmincost(p)
    if (sizePartitioning) {
        sizeOP.conceal(p, sizePartitioning, treeDataStructure)
    }
    return x
}

/** 
 * creates newPath from vertex to root(vertex), updates all edges on this path by x
 * operation expose can violate rule about solid edge for Partitioning by size
 * need to check/repair it by conceal
 * @return null, function just modifies the tree 
 */
export function update(vertex: nodeClass.ExternalNode, r: number, sizePartitioning: boolean, treeDataStructure: nodeClass.CollectionOfTrees) {
    let p = pathOP.expose(vertex, sizePartitioning, treeDataStructure)
    pathOP.pupdate(p, r)
    if (sizePartitioning) {
        sizeOP.conceal(p, sizePartitioning, treeDataStructure)
    }

}

/** 
 * combine two trees by solid edge with value x
 * creates newPath from vertex to root(vertex), updates all edges on this path by x
 * operation expose can violate rule about solid edge for Partitioning by size
 * need to check/repair it by conceal
 * @return null, connects two trees into one
 */
export function link(vertexHead: nodeClass.ExternalNode, vertexTail: nodeClass.ExternalNode, r: number, sizePartitioning: boolean, treeDataStructure: nodeClass.CollectionOfTrees) {
    let p = pathOP.concatenate(
        pathOP.path(vertexTail), //connect with pat
        pathOP.expose(vertexHead, sizePartitioning, treeDataStructure), // vertexTail will be head of path because of expose
        r,
        sizePartitioning)
    if (sizePartitioning) {
        sizeOP.conceal(p, sizePartitioning, treeDataStructure)
    }
}

/** 
 * combine two trees by solid edge with value x
 * creates newPath from vertex to root(vertex), updates all edges on this path by x
 * operation expose can violate rule about solid edge for Partitioning by size
 * need to check/repair it by conceal
 * @return edge cost [parent(vertex),vertex]
 */
export function cut(vertex: nodeClass.ExternalNode, sizePartitioning: boolean, treeDataStructure: nodeClass.CollectionOfTrees): number {
    let p = pathOP.expose(vertex, sizePartitioning, treeDataStructure)
    let [q, r, x, y] = pathOP.split(vertex, sizePartitioning, treeDataStructure)
    vertex.dparent = null
    if (sizePartitioning) {
        sizeOP.conceal(r, sizePartitioning, treeDataStructure)
        sizeOP.conceal(pathOP.path(vertex), sizePartitioning, treeDataStructure)
    }
    return y
}

/** 
 * make vertex root of the tree withoude adding/deleting edge/node
 * operation expose can violate rule about solid edge for Partitioning by size
 * need to check/repair it by conceal
 * @return null, 
 */
export function evert(vertex: nodeClass.ExternalNode, sizePartitioning: boolean, treeDataStructure: nodeClass.CollectionOfTrees) {
    let p = pathOP.expose(vertex, sizePartitioning, treeDataStructure)
    pathOP.reverse(p)
    vertex.dparent = null
    if (sizePartitioning) {
        sizeOP.conceal(p, sizePartitioning, treeDataStructure)
    }
}