import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
    hasComponent,
} from 'bitecs'
import Tint from '../components/tint'
import Tile from '../helpers/tile'
import Selected from '../components/selected'
import Player from '../components/player'
import Enemy from '../components/enemy'

export default function createTintSystem(tiles: Map<number, Tile>) {
    const selectedQuery = defineQuery([Selected])
    const tintQuery = defineQuery([Tint])
    const tintEnterQuery = enterQuery(tintQuery)
    const tintExitQuery = exitQuery(tintQuery)
    return defineSystem((world) => {
        tintEnterQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)
            const selected = selectedQuery(world)[0]
            if (hasComponent(world, Player, selected)) {
                tile.setTint(0x7D99D7, 0xffffff, 0xffffff, 0xffffff)
            }
            else if (hasComponent(world, Enemy, selected)) {
                tile.setTint(0xffffff, 0xffffff, 0xffffff, 0xd77d7d)
            }
        })
        tintExitQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)
            tile.clearTint()
        })
        return world
    })
}
