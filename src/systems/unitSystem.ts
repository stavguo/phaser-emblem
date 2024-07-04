import {
    defineQuery,
    defineSystem,
    enterQuery,
    IWorld,
} from 'bitecs'
import * as Phaser from 'phaser'

import Cell from '../components/cell'
import { Unit } from '../components/unit'

export default function createUnitSystem(scene: Phaser.Scene, unitSprites: Map<number, Phaser.GameObjects.Sprite>) {
    const unitQuery = defineQuery([Unit, Cell])
    const unitEnterQuery = enterQuery(unitQuery)
    const textures = ['player', 'enemy', 'ally', 'neutral']
    return defineSystem((world: IWorld) => {
        unitEnterQuery(world).forEach((eid) => {
            const row = Cell.row[eid]
            const col = Cell.col[eid]
            const unit = new Phaser.GameObjects.Sprite(scene, col * 64, row * 64, textures[Unit.team[eid]], 0).setScale(4).setOrigin(0).setDepth(1).setInteractive()
            scene.add.existing(unit)
            unitSprites.set(eid, unit)
        })
        return world
    })
}
