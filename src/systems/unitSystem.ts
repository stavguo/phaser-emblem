import {
    defineQuery,
    defineSystem,
    enterQuery,
    hasComponent,
    IWorld,
} from 'bitecs'
import * as Phaser from 'phaser'

import Ally from '../components/ally'
import Cell from '../components/cell'
import Enemy from '../components/enemy'
import Player from '../components/player'
import UnitComponent from '../components/unit'
import Unit from '../helpers/unit'

export default function createUnitSystem(scene: Phaser.Scene, unitSprites: Map<number, Unit>) {
    const unitQuery = defineQuery([UnitComponent, Cell])
    const unitEnterQuery = enterQuery(unitQuery)
    const getTexture = (eid: number, world: IWorld) => {
        if (hasComponent(world, Player, eid)) {
            return 'player'
        }
        else if (hasComponent(world, Enemy, eid)) {
            return 'enemy'
        }
        else if (hasComponent(world, Ally, eid)) {
            return 'ally'
        }
    }
    return defineSystem((world: IWorld) => {
        unitEnterQuery(world).forEach((eid) => {
            const row = Cell.row[eid]
            const col = Cell.col[eid]
            const texture = getTexture(eid, world)!
            const unit = new Unit(scene, col * 64, row * 64, texture, 0)
            scene.add.existing(unit)
            unitSprites.set(eid, unit)
        })
        return world
    })
}
