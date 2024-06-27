import * as Phaser from 'phaser'

import Selected from '../components/selected'
import Unit from '../components/unit'

export default class StatWindow {
    private container!: Phaser.GameObjects.Container | null
    private width!: number
    private height!: number

    constructor(scene: Phaser.Scene, eid: number) {
        this.width = 200
        this.height = 200

        // Initialize UI Container
        const { width } = scene.scale
        this.container = scene.add.container((Selected.x[eid] > (width / 2)) ? 5 : width - 5 - this.width, 5)
            .setDepth(100)
            .setScrollFactor(0, 0)
            .disableInteractive()

        // Setup background box
        const box = scene.add.nineslice(0, 0, 'panel-brown', 0, this.width / 2, this.width / 2, 60, 40, 49, 49)
            .setOrigin(0, 0)
            .setScale(2)
        this.container.add(box)

        // Setup stats text, padding goes here
        const line = new Phaser.Geom.Line(
            15,
            15,
            15,
            15 + this.height,
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
        this.container.add(elements)

        // Setup Listeners
        scene.input.on('pointerup', () => {
            if (this.container !== null && this.container.alpha !== 1) {
                this.container.setAlpha(1)
            }
        })
        scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
            if (!p.isDown) {
                return
            }
            else {
                if (this.container !== null && this.container.alpha === 1) {
                    this.container.setAlpha(0.7)
                }
            }
        })
    }

    destroy() {
        if (this.container !== null) this.container.destroy()
        this.container = null
    }
}
