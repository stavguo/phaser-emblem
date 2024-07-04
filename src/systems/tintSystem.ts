import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
} from 'bitecs'
import * as Phaser from 'phaser'

import Selected from '../components/selected'
import Tint from '../components/tint'
import { Team, Unit } from '../components/unit'

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
                if (Unit.team[selectedUnit] === Team.Player) {
                    tile!.setTint(0x7D99D7, 0xffffff, 0xffffff, 0xffffff)
                }
                else if (Unit.team[selectedUnit] === Team.Enemy) {
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
