import * as Phaser from 'phaser'
import {
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery
} from 'bitecs'
import { Selected } from '../components/actor/selected'

const selectQuery = defineQuery([Selected])
const selectEnterQuery = enterQuery(selectQuery)
const selectExitQuery = exitQuery(selectQuery)
const normalText = 'Click and drag anywhere to move around the scene.\nDouble-click any character to select them.\n'
const selectText = 'Double-click any tinted tile to move the selected character there.\nUndo selection by double-clicking the selected character.\n'
export const createTutorialTextSystem = (scene: Phaser.Scene) => {
    console.log('we out hereeee')
    let text = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY / 4,
        normalText
    )
        .setDepth(100)
        .setScrollFactor(0,0)
        .setOrigin(0.5, 0.5)
    let rect = scene.add.rectangle(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY / 4,
        text.width,
        text.height,
        0x000000,
        0.3
    )
        .setDepth(99)
        .setScrollFactor(0,0)
        .setOrigin(0.5, 0.5)
    return defineSystem(world => {
        selectEnterQuery(world).forEach(() => {
            text.setText(selectText)
            rect.setSize(text.width, text.height).setOrigin(0.5,0.5)
        })
        selectExitQuery(world).forEach(() => {
            text.setText(normalText)
            rect.setSize(text.width, text.height).setOrigin(0.5,0.5)
        })
        return world
    })
}