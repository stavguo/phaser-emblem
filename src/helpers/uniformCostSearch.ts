import { Tile, TileType } from '../components/tile'
import getNeighborTiles from './getNeighborTiles'
import GameWorld from '../helpers/gameWorld'
import { Unit } from '../components/unit'

export default function uniformCostSearch(startTileEid: number, movementPoints: number, world: GameWorld): number[] {
    const frontier: number[] = []
    frontier.push(startTileEid)
    const costSoFar = new Map()
    costSoFar.set(startTileEid, 0)

    while (frontier.length > 0) {
        frontier.sort((a: number, b: number) => costSoFar.get(a) <= costSoFar.get(b) ? 1 : -1)
        const current = frontier.pop()
        for (const eid of getNeighborTiles(current, world.widthInTiles, world.heightInTiles)) {
            // If not a water tile and not a player on the same team.
            if (Tile.type[eid] === TileType.Sea || (Tile.unit[eid] !== 0 && Unit.type[Tile.unit[eid]] !== Unit.type[Tile.unit[startTileEid]])) continue
            const newCost: number = costSoFar.get(current) + Tile.cost[eid]
            if (newCost <= movementPoints && (!costSoFar.has(eid) || newCost < costSoFar.get(eid))) {
                costSoFar.set(eid, newCost)
                frontier.push(eid)
            }
        }
    }
    return Array.from(costSoFar.keys())
}
