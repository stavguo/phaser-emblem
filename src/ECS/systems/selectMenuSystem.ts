import * as Phaser from 'phaser'
import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery
} from 'bitecs'
import { Selected } from '../components/actor/selected'
import { Cell } from '../components/base/cell'
import { CurrentTile } from '../components/actor/currentTile'

const selectQuery = defineQuery([Selected])
const selectEnterQuery = enterQuery(selectQuery)
const selectExitQuery = exitQuery(selectQuery)

let menu: Phaser.GameObjects.DOMElement

export const createSelectMenuSystem = (scene: Phaser.Scene) => {
    return defineSystem(world => {
        const enterEntities = selectEnterQuery(world)
        for (let i = 0; i < enterEntities.length; ++ i) {
            const eid = enterEntities[i]
            // TODO: Determine wheter to set menu on left or right
            menu = scene.add.dom(
                (7 * 64) + 32,
                5 * 64
            ).createFromCache('selectMenu').setScale(1,1).setScrollFactor(0)
            // TODO: If within enemy range, add "attack" button to menu
        }
        const exitEntities = selectExitQuery(world)
        for (let i = 0; i < exitEntities.length; ++ i) {
            const eid = exitEntities[i]
            menu.removeElement()
        }
        return world
    })
}