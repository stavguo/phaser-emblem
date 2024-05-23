import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
    removeComponent,
} from 'bitecs'
import Tint from '../components/tint'
import Tile from '../helpers/tile'
import { Tile as TileComponent } from '../components/tile'
import { Unit as UnitComponent, UnitType } from '../components/unit'
import Selected from '../components/selected'
import Cell from '../components/cell'
import Unit from '../helpers/unit'

// TODO: Rename this, it's basically used for all movement now.
export default function createTintSystem(tiles: Map<number, Tile>, unitSprites: Map<number, Unit>) {
    const selectedQuery = defineQuery([Selected])
    const tintQuery = defineQuery([Tint])
    const tintEnterQuery = enterQuery(tintQuery)
    const tintExitQuery = exitQuery(tintQuery)
    return defineSystem((world) => {
        tintEnterQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)
            const selected = selectedQuery(world)[0]
            if (UnitComponent.type[selected] === UnitType.Player) {
                tile.setTint(0x7D99D7, 0xffffff, 0xffffff, 0xffffff)
            }
            else if (UnitComponent.type[selected] === UnitType.Enemy) {
                tile.setTint(0xffffff, 0xffffff, 0xffffff, 0xd77d7d)
            }
            tile.setInteractive()
            tile.on('pointerup', (pointer: Phaser.Input.Pointer) => {
                if (pointer.getDuration() < 150 || pointer.getDistance() === 0) {
                    const startUnit = selectedQuery(world)[0]
                    const startTile = UnitComponent.tile[startUnit]
                    const endTile = eid

                    UnitComponent.tile[startUnit] = endTile
                    TileComponent.unit[endTile] = startUnit
                    TileComponent.unit[startTile] = 0

                    const row = Cell.row[endTile]
                    const col = Cell.col[endTile]
                    unitSprites.get(startUnit).setPosition(col * 16 * 4, row * 16 * 4)
                    selectedQuery(world).forEach(e => removeComponent(world, Selected, e))
                }
            })
        })
        tintExitQuery(world).forEach((eid) => {
            const tile = tiles.get(eid)
            tile.clearTint()
            tile.removeAllListeners()
            tile.disableInteractive()
        })
        return world
    })
}
