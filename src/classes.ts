/**
 * File describes objects used for implementing ST-trees
 * Every object is implemented as class
 * author:  Lukáš Hrmo
 */

/**
 * class ExternalNode represents nodes used in graph, they are also leafes of virtual tree. 
 * 
 * name: unique identification
 * size: number of descendats in graph + 1
 * pathPointer: every external node belongs to some path
 * bParent: pointer to InternalNode if node belongs to path, which containts more than one node
 * weight: weight = size            if node belongs to single-node path 
 *         weight = y.size - x.size if edge (y,x) is solid
 * dparent: pointer to parent node, if the node belongs to another path othwerwise null 
 * dcost:   edge value between (x.dparent,x), null if x.dparent == null
 * 
 * pathSet: array is empty if using NaivePartitioning, 
 *          represents children of node connected by dashed edge
 */
export class ExternalNode {
    name: string
    size: number
    pathPointer: Path
    bParent: InternalNode | null
    weight: number = 0;
    dparent: ExternalNode | null
    dcost: number | null

    pathSet: ExternalNode[] = []// using only by partitioning by size

    /**
     * Constructor initilize ExternalNode object
     * */
    constructor
        (
            name: string, size: number, weight: number,
            bParent: InternalNode = null, pathSet: ExternalNode[] = null, pathPointer: Path
        ) {
        this.name = name;
        this.bParent = bParent
        this.size = size
        this.weight = weight
        this.pathSet = pathSet
        this.pathPointer = pathPointer
    }
    /**
     * used for rebalancing virtual tree
     * @returns rank for node, 
     */
    getRank(): number {
        return Math.floor(Math.log2(this.weight))
    }


    /**
     * ExternalNode does not containt netMinValue. however sometimes we dont want to
     * distinguish between internal and external node, so we define functions for both
     * @returns positive infinity, because externalNode does not contains netMin
     */
    getNetMin(): number {
        return Math.pow(10, 1000)
    }

    /**
     * remove node from pathSet
     * @param v child connected by dashed edge
     */
    removeFromPathSet(v: ExternalNode) {
        this.pathSet = this.pathSet.filter((e) => { e.name != v.name })
    }
    /**
     * add node to pathSet
     * @param v child connected by dashed edge
     */
    addToPathSet(v: ExternalNode) {
        this.pathSet.push(v)
    }
}

/**
 * InternalNode is used as inside nodes for virtual tree. 
 * InternalNode represents edge between (x,y). Where x is succesor and y is ancestor
 * 
 * sizePartitioning: decides wheter we are using naivePartitiong or Partitioning by size
 * name: unique identification
 * bhead: left most node
 * btail: right most node
 * bleft: left child
 * bright: right child
 * bparent: parent in virtual tree
 * netmin: helps us to find minimum edge cost in path, edgeMin is small edge cost in virtual tree
 *         netmin = edgeMin(x) if node is a root of virtual tree
 *         netmin = edgeMin(x) - edgeMin(bparent(x)) otherwise 
 * netcost: edgeCost(x) - edgeMin(x), edgeCost(x) is cost of edge which is represented by x
 * rank: symbolize depth of node in virtualTree, 
 * weight: counted as sum of bleft and bright
 * reversed: if true, head/tail and bleft/bright are exchanged
 * 
 * leftmin: only if sizePartitioning is true, is minimal weight sum of leftsubtree
 * rightmin: symmetric to leftmin
 */
export class InternalNode {
    sizePartitioning: boolean = true // if false, we are using sizePartitinong
    name: string;

    bhead: ExternalNode;
    btail: ExternalNode
    bleft: InternalNode | ExternalNode;
    bright: InternalNode | ExternalNode;
    bParent: InternalNode | null;
    netmin: number;
    netcost: number;

    rank: number = 0
    weight: number = 0
    reversed: boolean;

    // these used only when attributes sizePartitioning is false
    leftmin: number = 0
    rightmin: number = 0

    /**
     * Constructor initilize ExternalNode object
     * */
    constructor(
        sizePartitioning: boolean, name: string, bParent: any = null, netmin: any = 0,
        netcost: any = 0, btail: any = null, bhead: any = null, bleft: any = null,
        bright: any = null, weight: number = 0) {
        this.name = name
        this.sizePartitioning = sizePartitioning
        this.reversed = false
        this.bParent = bParent
        this.netmin = netmin
        this.netcost = netcost
        this.bhead = bhead
        this.bleft = bleft
        this.bright = bright
        this.btail = btail
        this.weight = weight

    }

    /**
     * return edgeCost, which  as iN.netcost + sum of netMin from iN to root of virtualtreee
     * @param iN internalNode,
     * @returns cost of edge
     */
    edgeCost(iN: InternalNode): number {
        return this.netcost + this.edgemin(iN)
    }
    /**
     * sum of netMin from iN to root of virtual tree
     * @param iN internalNode
     * @returns sum of netMin
     */
    edgemin(iN: InternalNode | null): number {
        let sum: number = 0
        while (iN != null) {
            sum += iN.netmin
            iN = iN.bParent
        }
        return sum
    }
    /**
     * Getter for rank
     * @returns rank
     */
    getRank(): number {
        return this.rank
    }
    /**
     * Getter for netMin
     * @returns netMin
     */
    getNetMin(): number {
        return this.netmin
    }
    /**
     * 
     * @param lSum sum of all weight from head(path(this)) to before(ancestor)
     * @param l  of ancestor
     * @param rSum sum of all weight from after(sucessor) to tail(path(this)) 
     * @param r weight of sucessor
     * @returns Whether internalNode is heavy or light edge
     */
    isHeavy(lSum: number, l: number, rSum: number, r: number): boolean {
        if (this.reversed) {
            return (rSum - r > 0)
        }
        return (lSum - l > 0)
    }
}

/**
 * Path contains general information aboutPaht
 * 
 * pathRoot: pointer to root of virtual tree
 * allNodes: list of all nodes, which belong to this path, in order from head to tail
 * pathID: unique identification
 */
export class Path {
    pathRoot: InternalNode | null;
    allNodes: ExternalNode[]
    pathID: string;
    /**
     * Constructor initilize ExternalNode object
     * */
    constructor(pathRoot: InternalNode | null, pathID: string, allNodes: ExternalNode[]) {
        this.pathRoot = pathRoot
        this.pathID = pathID
        this.allNodes = allNodes
    }
    /**
     * Return weight of path, which is weight of this.pathRoot
     * @returns weight of path
     */
    getWeight() {
        if (this.pathRoot == null) {
            return this.allNodes[0].weight
        }
        return this.pathRoot.weight
    }
}

// We maintain collection of vertex-disjoin trees by this class
/**
 * CollectionOfTrees collection of vertex-disjoin trees by this class
 * 
 * basicRotos: list of roots to trees
 * pathRoots: list of paths
 * pathCount: Counts paths, so next path will have always unique ID
 */
export class CollectionOfTrees {
    basicRoots: ExternalNode[]
    pathRoots: Path[]
    pathCount: number = 0
    /**
     * Constructor initilize ExternalNode object
     * */
    constructor(
        basicRoots: ExternalNode[], pathRoots: Path[]
    ) {
        this.basicRoots = basicRoots
        this.pathRoots = pathRoots
    }
    /**
     * when creating newPath generate new pathID
     * @returns pathID as string
     */
    getPathID(): string {
        this.pathCount++
        return "path" + this.pathCount
    }
}

