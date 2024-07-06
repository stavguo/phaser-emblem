import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
} from 'bitecs'
import * as Phaser from 'phaser'

import Selected from '../components/selected'
import GameWorld from '../helpers/gameWorld'
import StatWindow from '../helpers/statWindow'

export default function createStatWindowSystem(scene: Phaser.Scene) {
    const selectedQuery = defineQuery([Selected])
    const selectedEnterQuery = enterQuery(selectedQuery)
    const selectedExitQuery = exitQuery(selectedQuery)
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
        return world
    })
}
