import Cell from '../components/cell'
import { Tile, TileType } from '../components/tile'
import { Team, Unit } from '../components/unit'
import GameWorld from '../helpers/gameWorld'
import bfs from './bfs'
import getNeighbors from './getNeighbors'

export default function uniformCostSearch(eid: number, mov: number, world: GameWorld) {
    const frontier: number[] = []
    frontier.push(eid)
    const costs: Map<number, number> = new Map()
    costs.set(eid, 0)
    const attackable: Set<number> = new Set()

    while (frontier.length > 0) {
        frontier.sort((a: number, b: number) => costs.get(a)! <= costs.get(b)! ? 1 : -1)
        const cur = frontier.pop()!
        for (const n of getNeighbors(world, Cell.row[cur], Cell.col[cur])) {
            // If not a water tile and not a player on the same team.
            if (Tile.type[n] === TileType.Sea) continue
            if (Tile.unit[n] !== 0) {
                const thisUnit = Tile.unit[eid]
                const otherUnit = Tile.unit[n]
                if ((Unit.team[thisUnit] === Team.Player && Unit.team[otherUnit] === Team.Enemy)
                    || (Unit.team[otherUnit] === Team.Player && Unit.team[thisUnit] === Team.Enemy)) {
                    continue
                }
            }
            const newCost: number = costs.get(cur)! + Tile.cost[n]
            if (!costs.has(n) || newCost < costs.get(n)!) {
                if (newCost <= mov) {
                    costs.set(n, newCost)
                    frontier.push(n)
                    if (newCost == mov) {
                        bfs(n, 2, world).forEach((eid) => attackable.add(eid))
                    }
                }
            }
        }
    }
    const reachable = Array.from(costs.keys())
    return {
        reachable: reachable,
        attackable: (attackable as any).difference(new Set(reachable))
    }
    
}
