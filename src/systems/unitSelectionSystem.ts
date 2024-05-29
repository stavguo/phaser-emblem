import {
    addComponent,
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
    removeComponent,
} from 'bitecs'

import Selected from '../components/selected'
import { Tile as TileComponent } from '../components/tile'
import Tint from '../components/tint'
import UnitComponent from '../components/unit'
import GameWorld from '../helpers/gameWorld'
import StatWindow from '../helpers/statWindow'
import uniformCostSearch from '../helpers/uniformCostSearch'
import Unit from '../helpers/unit'

export default function createUnitSelectionSystem(scene: Phaser.Scene, unitSprites: Map<number, Unit>) {
    const unitQuery = defineQuery([UnitComponent])
    const enterUnitQuery = enterQuery(unitQuery)
    const selectedQuery = defineQuery([Selected])
    const selectedEnterQuery = enterQuery(selectedQuery)
    const selectedExitQuery = exitQuery(selectedQuery)
    const tintQuery = defineQuery([Tint])
    let statWindow: StatWindow = null
    return defineSystem((world: GameWorld) => {
        enterUnitQuery(world).forEach((eid) => {
            const unit = unitSprites.get(eid)
            unit.on('pointerup', (pointer: Phaser.Input.Pointer) => {
                if (pointer.getDuration() < 150 || pointer.getDistance() === 0) {
                    selectedQuery(world).forEach(e => removeComponent(world, Selected, e))
                    addComponent(world, Selected, eid)
                    Selected.x[eid] = pointer.x | 0
                    Selected.y[eid] = pointer.y | 0
                }
            })
        })
        selectedExitQuery(world).forEach(() => {
            tintQuery(world).forEach(eid => removeComponent(world, Tint, eid))
            if (statWindow !== null) statWindow.destroy()
        })
        selectedEnterQuery(world).forEach((eid) => {
            statWindow = new StatWindow(scene, eid)
            const tiles = uniformCostSearch(UnitComponent.tile[eid], UnitComponent.movement[eid], world)
            for (const tileEid of tiles) {
                if (tileEid === UnitComponent.tile[eid] || TileComponent.unit[tileEid] !== 0) continue
                addComponent(world, Tint, tileEid)
            }
        })
        return world
    })
}
