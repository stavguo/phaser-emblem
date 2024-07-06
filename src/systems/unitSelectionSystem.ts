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

import Actionable from '../components/actionable'
import Moved from '../components/moved'
import Selected from '../components/selected'
import { Tile } from '../components/tile'
import Tint from '../components/tint'
import { Unit } from '../components/unit'
import GameWorld from '../helpers/gameWorld'
import uniformCostSearch from '../helpers/uniformCostSearch'

export default function createUnitSelectionSystem(unitSprites: Map<number, Phaser.GameObjects.Sprite>) {
    const unitQuery = defineQuery([Unit])
    const enterUnitQuery = enterQuery(unitQuery)
    const selectedQuery = defineQuery([Selected])
    const selectedEnterQuery = enterQuery(selectedQuery)
    const selectedExitQuery = exitQuery(selectedQuery)
    const tileTintQuery = defineQuery([Tint, Tile])
    const setUpPointer = (pointer: Phaser.Input.Pointer, eid: number, world: GameWorld) => {
        if (pointer.getDuration() < 150 || pointer.getDistance() === 0) {
            // Unselect previous component
            if (world.selected !== 0 && hasComponent(world, Selected, world.selected)) {
                removeComponent(world, Selected, world.selected)
            }
            world.selected = eid
            // Select this component
            addComponent(world, Selected, eid)
            Selected.x[eid] = pointer.x | 0
            Selected.y[eid] = pointer.y | 0
        }
    }
    return defineSystem((world: GameWorld) => {
        enterUnitQuery(world).forEach((eid) => {
            const unit = unitSprites.get(eid)!
            unit.setInteractive()
            unit.on('pointerup', (p: Phaser.Input.Pointer) => setUpPointer(p, eid, world))
        })
        selectedExitQuery(world).forEach((eid) => {
            const unit = unitSprites.get(eid)!
            unit.setInteractive()
            unit.on('pointerup', (p: Phaser.Input.Pointer) => setUpPointer(p, eid, world))
            tileTintQuery(world).forEach(eid => removeComponent(world, Tint, eid))
        })
        selectedEnterQuery(world).forEach((eid) => {
            const unit = unitSprites.get(eid)!
            unit.removeListener('pointerup')
            unit.disableInteractive()
            if (!hasComponent(world, Moved, eid) && hasComponent(world, Actionable, eid)) {
                const tiles = uniformCostSearch(Unit.tile[eid], Unit.movement[eid], world)
                for (const tileEid of tiles) {
                    if (Tile.unit[tileEid] === 0 || tileEid === Unit.tile[eid])
                        addComponent(world, Tint, tileEid)
                }
            }
        })
        return world
    })
}
