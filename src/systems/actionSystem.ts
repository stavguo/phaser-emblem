import { defineQuery, defineSystem, enterQuery, hasComponent } from 'bitecs'

import Moved from '../components/moved'
import { Tile } from '../components/tile'
import bfs from '../helpers/bfs'
import GameWorld from '../helpers/gameWorld'
import { Team, Unit } from '../components/unit'

export default function createActionSystem() {
    const movedQuery = defineQuery([Moved])
    const movedEnterQuery = enterQuery(movedQuery)
    return defineSystem((world: GameWorld) => {
        movedEnterQuery(world).forEach((eid) => {
            // Do BFS
            bfs(Unit.tile[eid], 2, world).forEach((eid) => {
                if (Tile.unit[eid] !== 0 && Unit.team[Tile.unit[eid]] === Team.Enemy) {
                    console.log('enemy within range!')
                }
            })
        })
        return world
    })
}
