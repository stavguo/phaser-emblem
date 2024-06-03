import { defineQuery, defineSystem, enterQuery, hasComponent } from 'bitecs'

import Enemy from '../components/enemy'
import Moved from '../components/moved'
import { Tile } from '../components/tile'
import Unit from '../components/unit'
import bfs from '../helpers/bfs'
import GameWorld from '../helpers/gameWorld'

export default function createActionSystem() {
    const movedQuery = defineQuery([Moved])
    const movedEnterQuery = enterQuery(movedQuery)
    return defineSystem((world: GameWorld) => {
        movedEnterQuery(world).forEach((eid) => {
            // Do BFS
            bfs(Unit.tile[eid], 2, world).forEach((eid) => {
                if (Tile.unit[eid] !== 0 && hasComponent(world, Enemy, Tile.unit[eid])) {
                    console.log('enemy within range!')
                }
            })
        })
        return world
    })
}
