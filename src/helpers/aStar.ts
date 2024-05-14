import { addComponent, IWorld, removeComponent } from 'bitecs'
import { Cell } from '../components/base/cell'
import { Terrain } from '../components/tile/terrain'
import { Tint, TintEnum } from '../components/tile/tint'
import { Node } from '../components/tile/node'
import { satisfiesBounds } from './satisfiesBounds'

function manhattanDistance(x: number, y: number) {
    return Math.abs(Cell.col[x] - Cell.col[y]) + Math.abs(Cell.row[x] - Cell.row[y])
}

function compareF(a: number, b: number) {
    if (Node.gCost[a] + Node.hCost[a] > Node.gCost[b] + Node.hCost[b]) return -1
    if (Node.gCost[a] + Node.hCost[a] < Node.gCost[b] + Node.hCost[b]) return 1
    return 0
}

function removeNodes(arr: number[], world: IWorld) {
    arr.forEach(id => removeComponent(world, Node, id))
}

export function aStar(
    startId: number,
    targetId: number,
    world: IWorld,
    tiles: Map<string, number>,
) {
    // OPEN - the set of nodes to be evaluated
    const open: number[] = []

    // CLOSED - the set of nodes already evaluated
    const closed: number[] = []

    // add the start node to OPEN
    addComponent(world, Node, startId)
    Node.parent[startId] = -1
    Node.gCost[startId] = 0
    Node.hCost[startId] = manhattanDistance(startId, targetId)
    open.push(startId)

    // loop
    while (open.length > 0) {
        // current = node in open with the lowest f_cost
        open.sort(compareF)

        // remove current from OPEN
        const current = open.pop()

        // add current to closed
        closed.push(current)

        // if current is the target node (path has been found), return
        if (current === targetId) {
            let p = current
            const path = []
            while (p !== startId) {
                // Debugging tint
                addComponent(world, Tint, p)
                Tint.color[p] = TintEnum.Black

                // add node to path and get parent
                path.push(p)
                p = Node.parent[closed.find(el => el === p)]
            }
            // Debugging tint
            addComponent(world, Tint, p)
            Tint.color[p] = TintEnum.Black

            // Remove node components
            removeNodes(open, world)
            removeNodes(closed, world)

            return path.reverse()
        }

        const neighbors: number[] = []
        // North
        if (satisfiesBounds(Cell.row[current] - 1, Cell.col[current])) {
            neighbors.push(tiles.get(`${Cell.col[current]},${Cell.row[current] - 1}`))
        }
        // South
        if (satisfiesBounds(Cell.row[current] + 1, Cell.col[current])) {
            neighbors.push(tiles.get(`${Cell.col[current]},${Cell.row[current] + 1}`))
        }
        // East
        if (satisfiesBounds(Cell.row[current], Cell.col[current] + 1)) {
            neighbors.push(tiles.get(`${Cell.col[current] + 1},${Cell.row[current]}`))
        }
        // West
        if (satisfiesBounds(Cell.row[current], Cell.col[current] - 1)) {
            neighbors.push(tiles.get(`${Cell.col[current] - 1},${Cell.row[current]}`))
        }

        // foreach neighbor of the current node
        for (let i = 0; i < neighbors.length; ++i) {
            const neighbor = neighbors[i]

            // if neighbor is not traversable or neighbor is in CLOSED, skip to the next neighbor
            if (Terrain.cost[neighbor] === 0 || closed.find(el => el === neighbor)) continue

            // if new path to neighbor is shorter or neighbor is not in OPEN
            const newCost = Node.gCost[current] + Terrain.cost[neighbor]
            // const newCost = Node.gCost[current] + (Noise.value[neighbor] * 10)
            const oldCost = (Node.gCost[neighbor]) ? Node.gCost[neighbor] : 0

            const neighborNotInOpen = !open.find(el => el === neighbor)
            if (newCost < oldCost || neighborNotInOpen) {
                // set f_cost of neighbor
                Node.gCost[neighbor] = newCost
                Node.hCost[neighbor] = manhattanDistance(neighbor, targetId)
                // set parent of neighbor to current
                Node.parent[neighbor] = current

                // if neighbor is not in OPEN
                if (neighborNotInOpen)
                    // add neighbor to OPEN
                    open.push(neighbor)
            }
        }
    }
    console.log('could not find path')
    // Remove node components
    removeNodes(open, world)
    removeNodes(closed, world)

    return []
}
