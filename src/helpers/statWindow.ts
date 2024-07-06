import * as Phaser from 'phaser'

import Selected from '../components/selected'
import { Unit } from '../components/unit'

export default class StatWindow extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, eid: number, windowWidth: number, windowHeight: number) {
        super(scene, (Selected.x[eid] > (scene.scale.width / 2)) ? 5 : scene.scale.width - 5 - windowWidth, 5)

        this.setDepth(100)
            .setScrollFactor(0, 0)
            .disableInteractive()

        // Setup background box
        const box = scene.add.nineslice(0, 0, 'panel-brown', 0, windowWidth / 2, windowWidth / 2, 60, 40, 49, 49)
            .setOrigin(0, 0)
            .setScale(2)
        this.add(box)

        // Setup stats text, padding goes here
        const line = new Phaser.Geom.Line(
            15,
            15,
            15,
            15 + windowHeight,
        )
        const elements: Phaser.GameObjects.Text[] = []
        const hp = scene.add.text(0, 0, `HP: ${Unit.hp[eid].toString()}`, { color: '#000000' })
            .setDepth(102)
            .setScrollFactor(0, 0)
            .setOrigin(0, 0)
        elements.push(hp)
        const ap = scene.add.text(0, 0, `Attack Power: ${Unit.attackPower[eid].toString()}`, { color: '#000000' })
            .setDepth(102)
            .setScrollFactor(0, 0)
            .setOrigin(0, 0)
        elements.push(ap)
        const def = scene.add.text(0, 0, `Defense: ${Unit.def[eid].toString()}`, { color: '#000000' })
            .setDepth(102)
            .setScrollFactor(0, 0)
            .setOrigin(0, 0)
        elements.push(def)
        Phaser.Actions.PlaceOnLine(elements, line)
        this.add(elements)

        // Setup Listeners
        scene.input.on('pointerup', () => {
            if (this !== null && this.alpha !== 1) {
                this.setAlpha(1)
            }
        })
        scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
            if (!p.isDown) {
                return
            }
            else {
                if (this !== null && this.alpha === 1) {
                    this.setAlpha(0.7)
                }
            }
        })
    }
}
