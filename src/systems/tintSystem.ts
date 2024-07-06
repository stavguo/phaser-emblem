import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
} from 'bitecs'
import * as Phaser from 'phaser'

import { Tile } from '../components/tile'
import Tint from '../components/tint'
import { Team, Unit } from '../components/unit'
import GameWorld from '../helpers/gameWorld'

export default function createTintSystem(tiles: Map<number, Phaser.GameObjects.Image>, unitSprites: Map<number, Phaser.GameObjects.Sprite>) {
    const greyColor = 0x808080
    const unitTintQuery = defineQuery([Tint, Unit])
    const unitTintEnterQuery = enterQuery(unitTintQuery)
    const unitTintExitQuery = exitQuery(unitTintQuery)
    const tileTintQuery = defineQuery([Tint, Tile])
    const tileTintEnterQuery = enterQuery(tileTintQuery)
    const tileTintExitQuery = exitQuery(tileTintQuery)
    return defineSystem((world: GameWorld) => {
        tileTintEnterQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)
            if (Unit.team[world.selected] === Team.Player) {
                tile!.setTint(0x7D99D7, 0xffffff, 0xffffff, 0xffffff)
            }
            else if (Unit.team[world.selected] === Team.Enemy) {
                tile!.setTint(0xffffff, 0xffffff, 0xffffff, 0xd77d7d)
            }
        })
        tileTintExitQuery(world).forEach((eid) => {
            tiles.get(eid)!.clearTint()
        })
        unitTintEnterQuery(world).forEach((eid) => {
            unitSprites.get(eid)!.setTint(greyColor)
        })
        unitTintExitQuery(world).forEach((eid) => {
            unitSprites.get(eid)!.clearTint()
        })
        return world
    })
}
