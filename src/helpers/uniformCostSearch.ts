import Cell from '../components/cell'
import { Tile, TileType } from '../components/tile'
import GameWorld from '../helpers/gameWorld'
import getNeighbors from './getNeighbors'
import { Unit, Team } from '../components/unit'

export default function uniformCostSearch(eid: number, mov: number, world: GameWorld): number[] {
    const frontier: number[] = []
    frontier.push(eid)
    const costs = new Map()
    costs.set(eid, 0)

    while (frontier.length > 0) {
        frontier.sort((a: number, b: number) => costs.get(a) <= costs.get(b) ? 1 : -1)
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
            const newCost: number = costs.get(cur) + Tile.cost[n]
            if (newCost <= mov && (!costs.has(n) || newCost < costs.get(n))) {
                costs.set(n, newCost)
                frontier.push(n)
            }
        }
    }
    return Array.from(costs.keys())
}
