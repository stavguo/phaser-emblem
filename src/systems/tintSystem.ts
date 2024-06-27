import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
    hasComponent,
} from 'bitecs'
import * as Phaser from 'phaser'

import Enemy from '../components/enemy'
import Player from '../components/player'
import Selected from '../components/selected'
import Tint from '../components/tint'

export default function createTintSystem(tiles: Map<number, Phaser.GameObjects.Image>) {
    const selectedQuery = defineQuery([Selected])
    const tintQuery = defineQuery([Tint])
    const tintEnterQuery = enterQuery(tintQuery)
    const tintExitQuery = exitQuery(tintQuery)
    return defineSystem((world) => {
        tintEnterQuery(world).forEach((eid) => {
            try {
                const selectedUnits = selectedQuery(world)
                const selectedUnit = (selectedUnits.length === 1)
                    ? selectedUnits[0]
                    : (() => { throw new Error('Expected one selected unit.') })()
                const tile = tiles.get(eid)
                if (hasComponent(world, Player, selectedUnit)) {
                    tile!.setTint(0x7D99D7, 0xffffff, 0xffffff, 0xffffff)
                }
                else if (hasComponent(world, Enemy, selectedUnit)) {
                    tile!.setTint(0xffffff, 0xffffff, 0xffffff, 0xd77d7d)
                }
            }
            catch (error) {
                console.log(error)
            }
        })
        tintExitQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)
            tile!.clearTint()
        })
        return world
    })
}
