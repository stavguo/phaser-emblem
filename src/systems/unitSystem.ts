import * as Phaser from 'phaser'
import {
    defineQuery,
    defineSystem,
    enterQuery,
    IWorld,
} from 'bitecs'
import Cell from '../components/cell'
import { Unit as UnitComponent } from '../components/unit'
import Unit from '../helpers/unit'

export default function createUnitSystem(scene: Phaser.Scene, unitSprites: Map<number, Unit>) {
    const unitQuery = defineQuery([UnitComponent, Cell])
    const unitEnterQuery = enterQuery(unitQuery)
    const textures = [
        'player',
        'ally',
        'enemy',
    ]
    return defineSystem((world: IWorld) => {
        unitEnterQuery(world).forEach((eid) => {
            const row = Cell.row[eid]
            const col = Cell.col[eid]
            const texture = textures[UnitComponent.type[eid]]
            const unit = new Unit(scene, col * 64, row * 64, texture, 0)
            scene.add.existing(unit)
            unitSprites.set(eid, unit)
        })
        return world
    })
}
