import {
    addComponent,
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
    hasComponent,
    removeComponent,
} from 'bitecs'
import * as Phaser from 'phaser'

import Cell from '../components/cell'
import Moved from '../components/moved'
import { Tile } from '../components/tile'
import Tint from '../components/tint'
import { Unit } from '../components/unit'
import GameWorld from '../helpers/gameWorld'

export default function createMovementSystem(tiles: Map<number, Phaser.GameObjects.Image>, unitSprites: Map<number, Phaser.GameObjects.Sprite>) {
    const tintQuery = defineQuery([Tint, Tile])
    const tintEnterQuery = enterQuery(tintQuery)
    const tintExitQuery = exitQuery(tintQuery)
    return defineSystem((world: GameWorld) => {
        tintEnterQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)!
            tile.setInteractive()
            tile.removeListener('pointerup')
            tile.on('pointerup', (pointer: Phaser.Input.Pointer) => {
                if (!hasComponent(world, Moved, world.selected) && (pointer.getDuration() < 150 || pointer.getDistance() === 0)) {
                    const startTile = Unit.tile[world.selected]
                    const endTile = eid

                    Unit.tile[world.selected] = endTile
                    Tile.unit[endTile] = world.selected
                    Tile.unit[startTile] = 0

                    const row = Cell.row[endTile]
                    const col = Cell.col[endTile]
                    const sprite = unitSprites.get(world.selected)!
                    sprite.setPosition(col * 16 * 4, row * 16 * 4)
                    tintQuery(world).forEach(eid => removeComponent(world, Tint, eid))
                    addComponent(world, Moved, world.selected)
                }
            })
        })
        tintExitQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)!
            tile.removeListener('pointerup')
            tile.disableInteractive()
        })
        return world
    })
}
