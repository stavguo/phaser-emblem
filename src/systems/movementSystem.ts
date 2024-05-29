import {
    addComponent,
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
    hasComponent,
    removeComponent,
} from 'bitecs'
import Tint from '../components/tint'
import Tile from '../helpers/tile'
import { Tile as TileComponent } from '../components/tile'
import UnitComponent from '../components/unit'
import Selected from '../components/selected'
import Cell from '../components/cell'
import Unit from '../helpers/unit'
import Moved from '../components/moved'

export default function createMovementSystem(tiles: Map<number, Tile>, unitSprites: Map<number, Unit>) {
    const selectedQuery = defineQuery([Selected])
    const tintQuery = defineQuery([Tint])
    const tintEnterQuery = enterQuery(tintQuery)
    const tintExitQuery = exitQuery(tintQuery)
    return defineSystem((world) => {
        tintEnterQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)
            tile.setInteractive()
            tile.removeListener('pointerup')
            tile.on('pointerup', (pointer: Phaser.Input.Pointer) => {
                console.log(selectedQuery(world).length)
                const startUnit = selectedQuery(world)[0]
                if (!hasComponent(world, Moved, startUnit) && (pointer.getDuration() < 150 || pointer.getDistance() === 0)) {
                    const startTile = UnitComponent.tile[startUnit]
                    const endTile = eid

                    UnitComponent.tile[startUnit] = endTile
                    TileComponent.unit[endTile] = startUnit
                    TileComponent.unit[startTile] = 0

                    const row = Cell.row[endTile]
                    const col = Cell.col[endTile]
                    const sprite = unitSprites.get(startUnit)
                    sprite.setPosition(col * 16 * 4, row * 16 * 4)
                    addComponent(world, Moved, startUnit)
                    selectedQuery(world).forEach(e => removeComponent(world, Selected, e))
                }
            })
        })
        tintExitQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)
            tile.removeListener('pointerup')
            tile.disableInteractive()
        })
        return world
    })
}
