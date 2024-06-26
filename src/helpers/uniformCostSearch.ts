import { hasComponent } from 'bitecs'

import Enemy from '../components/enemy'
import Player from '../components/player'
import { Tile, TileType } from '../components/tile'
import GameWorld from '../helpers/gameWorld'
import getNeighbors from './getNeighbors'

export default function uniformCostSearch(eid: number, mov: number, world: GameWorld): number[] {
    const frontier: number[] = []
    frontier.push(eid)
    const costs = new Map()
    costs.set(eid, 0)

    while (frontier.length > 0) {
        frontier.sort((a: number, b: number) => costs.get(a) <= costs.get(b) ? 1 : -1)
        const current = frontier.pop()!
        for (const n of getNeighbors(current, world.widthInTiles, world.heightInTiles)) {
            // If not a water tile and not a player on the same team.
            if (Tile.type[n] === TileType.Sea) continue
            if (Tile.unit[n] !== 0) {
                if ((hasComponent(world, Player, Tile.unit[n]) && hasComponent(world, Enemy, Tile.unit[eid]))
                    || (hasComponent(world, Enemy, Tile.unit[n]) && hasComponent(world, Player, Tile.unit[eid]))) {
                    continue
                }
            }
            const newCost: number = costs.get(current) + Tile.cost[n]
            if (newCost <= mov && (!costs.has(n) || newCost < costs.get(n))) {
                costs.set(n, newCost)
                frontier.push(n)
            }
        }
    }
    return Array.from(costs.keys())
}
