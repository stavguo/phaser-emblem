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
import Unit from '../components/unit'

export default function createUnitSystem(scene: Phaser.Scene, unitSprites: Map<number, Phaser.GameObjects.Sprite>) {
    const unitQuery = defineQuery([Unit, Cell])
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
            const unit = new Phaser.GameObjects.Sprite(scene, col * 64, row * 64, texture, 0).setScale(4).setOrigin(0).setDepth(1).setInteractive()
            scene.add.existing(unit)
            unitSprites.set(eid, unit)
        })
        return world
    })
}
