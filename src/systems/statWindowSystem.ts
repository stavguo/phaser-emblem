import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
    Not,
} from 'bitecs'
import * as Phaser from 'phaser'

import Selected from '../components/selected'
import GameWorld from '../helpers/gameWorld'
import StatWindow from '../helpers/statWindow'
import Moved from '../components/moved'
import Actionable from '../components/actionable'

export default function createStatWindowSystem(scene: Phaser.Scene) {
    const selectedQuery = defineQuery([Selected])
    const selectedEnterQuery = enterQuery(selectedQuery)
    const selectedExitQuery = exitQuery(selectedQuery)
    const movedQuery = defineQuery([Selected, Moved, Actionable])
    const movedEnterQuery = enterQuery(movedQuery)
    const statWindows: Map<number, Phaser.GameObjects.Container> = new Map()
    return defineSystem((world: GameWorld) => {
        selectedEnterQuery(world).forEach((eid: number) => {
            const statWindow = new StatWindow(scene, eid, 200, 200)
            scene.add.existing(statWindow)
            statWindows.set(eid, statWindow)
        })
        selectedExitQuery(world).forEach((eid: number) => {
            statWindows.get(eid)?.destroy()
            statWindows.delete(eid)
        })
        movedEnterQuery(world).forEach((eid: number) => {
            statWindows.get(eid)?.destroy()
            statWindows.delete(eid)
        })
        return world
    })
}
