import {
    addComponent,
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
    removeComponent,
} from 'bitecs'
import GameWorld from '../helpers/gameWorld'
import { Unit as UnitComponent } from '../components/unit'
import Unit from '../helpers/unit'
import Tint from '../components/tint'
import uniformCostSearch from '../helpers/uniformCostSearch'
import { Tile as TileComponent } from '../components/tile'
import Selected from '../components/selected'

export default function createUnitSelectionSystem(unitSprites: Map<number, Unit>) {
    const unitQuery = defineQuery([UnitComponent])
    const enterUnitQuery = enterQuery(unitQuery)
    const selectedQuery = defineQuery([Selected])
    const selectedEnterQuery = enterQuery(selectedQuery)
    const selectedExitQuery = exitQuery(selectedQuery)
    const tintQuery = defineQuery([Tint])
    return defineSystem((world: GameWorld) => {
        enterUnitQuery(world).forEach((eid) => {
            const unit = unitSprites.get(eid)
            unit.on('pointerup', (pointer: Phaser.Input.Pointer) => {
                if (pointer.getDuration() < 150 || pointer.getDistance() === 0) {
                    selectedQuery(world).forEach(e => removeComponent(world, Selected, e))
                    addComponent(world, Selected, eid)
                }
            })
        })
        selectedExitQuery(world).forEach(() => {
            tintQuery(world).forEach(eid => removeComponent(world, Tint, eid))
        })
        selectedEnterQuery(world).forEach((eid) => {
            const tiles = uniformCostSearch(UnitComponent.tile[eid], UnitComponent.movement[eid], world)
            for (const tileEid of tiles) {
                if (tileEid === UnitComponent.tile[eid] || TileComponent.unit[tileEid] !== 0) continue
                addComponent(world, Tint, tileEid)
            }
        })
        return world
    })
}
