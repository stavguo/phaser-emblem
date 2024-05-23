import * as Phaser from 'phaser'
import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
} from 'bitecs'
import Selected from '../components/selected'

const selectQuery = defineQuery([Selected])
const selectEnterQuery = enterQuery(selectQuery)
const selectExitQuery = exitQuery(selectQuery)
const normalText = 'Click and drag anywhere to move around the scene.\nClick on a unit to view the spaces it can move to.\n'
const selectText = 'Click a tinted space to move a unit there.\n'
export default function createTutorialTextSystem(scene: Phaser.Scene) {
    const text = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY / 4,
        normalText,
    )
        .setDepth(100)
        .setScrollFactor(0, 0)
        .setOrigin(0.5, 0.5)
    const rect = scene.add.rectangle(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY / 4,
        text.width,
        text.height,
        0x000000,
        0.3,
    )
        .setDepth(99)
        .setScrollFactor(0, 0)
        .setOrigin(0.5, 0.5)
    return defineSystem((world) => {
        selectEnterQuery(world).forEach(() => {
            text.setText(selectText)
            rect.setSize(text.width, text.height).setOrigin(0.5, 0.5)
        })
        selectExitQuery(world).forEach(() => {
            text.setText(normalText)
            rect.setSize(text.width, text.height).setOrigin(0.5, 0.5)
        })
        return world
    })
}
