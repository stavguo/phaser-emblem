import { addComponent, defineQuery, defineSystem, enterQuery, exitQuery, removeComponent } from 'bitecs'
import * as Phaser from 'phaser'

import Moved from '../components/moved'
import { Tile } from '../components/tile'
import { Team, Unit } from '../components/unit'
import bfs from '../helpers/bfs'
import GameWorld from '../helpers/gameWorld'
import Actionable from '../components/actionable'
import { Tint } from '../components/tint'
import Selected from '../components/selected'
import ActionMenu from '../helpers/actionMenu'
import Button from '../helpers/button'

export default function createActionSystem(scene: Phaser.Scene) {
    const movedQuery = defineQuery([Selected, Moved, Actionable])
    const movedEnterQuery = enterQuery(movedQuery)
    const movedExitQuery = exitQuery(movedQuery)
    const unitMenus: Map<number, Phaser.GameObjects.Container> = new Map()
    const windowWidth: number = 200
    const windowHeight: number = 240
    const wait = (world: GameWorld) => {
        console.log("wait")
        removeComponent(world, Actionable, world.selected)
        addComponent(world, Tint, world.selected)
        removeComponent(world, Selected, world.selected)
    }
    return defineSystem((world: GameWorld) => {
        // TODO: When ent with select and moved component, show action menu
        movedEnterQuery(world).forEach((eid) => {
            const actionMenu = new ActionMenu(scene, eid, windowWidth, windowHeight)
            scene.add.existing(actionMenu)
            unitMenus.set(eid, actionMenu)
            const line = new Phaser.Geom.Line(
                100,
                40,
                100,
                15 + windowHeight,
            )
            const elements: Phaser.GameObjects.Container[] = []
            // Do BFS
            bfs(Unit.tile[eid], 2, world).forEach((eid) => {
                if (Tile.unit[eid] !== 0 && Unit.team[Tile.unit[eid]] === Team.Enemy) {
                    const attackButton = new Button(scene, 160, 40, 'attack')
                    attackButton.on('pointerup', (pointer: Phaser.Input.Pointer) => {
                        console.log("attack")
                        removeComponent(world, Actionable, world.selected)
                        addComponent(world, Tint, world.selected)
                        removeComponent(world, Selected, world.selected)
                    })
                    elements.push(attackButton)
                }
            })
            const waitButton = new Button(scene, 160, 40, 'wait')
            waitButton.on('pointerup', (pointer: Phaser.Input.Pointer) => {
                wait(world)
            })
            elements.push(waitButton)
            const equipButton = new Button(scene, 160, 40, 'equip')
            equipButton.on('pointerup', (pointer: Phaser.Input.Pointer) => {
                console.log("equip")
            })
            elements.push(equipButton)
            Phaser.Actions.PlaceOnLine(elements, line)
            actionMenu.add(elements)
        })
        // TODO: Remove action menu when unselection occurs
        movedExitQuery(world).forEach((eid) => {
            wait(world)
            unitMenus.get(eid)?.destroy()
            unitMenus.delete(eid)
        })
        return world
    })
}
