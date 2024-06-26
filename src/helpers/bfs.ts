import Cell from '../components/cell'
import { Tile, TileType } from '../components/tile'
import GameWorld from '../helpers/gameWorld'
import getNeighbors from './getNeighbors'

const manhattanDist = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

export default function bfs(eid: number, rng: number, world: GameWorld): number[] {
    const frontier: number[] = []
    frontier.push(eid)
    const reached = new Set<number>()
    reached.add(eid)

    while (frontier.length > 0) {
        const cur = frontier.pop()!
        for (const n of getNeighbors(world, Cell.row[cur], Cell.col[cur])) {
            // If not a water tile.
            if (Tile.type[n] === TileType.Sea) continue
            if (!reached.has(n) && manhattanDist(Cell.col[eid], Cell.row[eid], Cell.col[n], Cell.row[n]) <= rng) {
                reached.add(n)
                frontier.push(n)
            }
        }
    }
    return Array.from(reached)
}
