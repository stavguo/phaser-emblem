import * as Phaser from 'phaser'

import Selected from '../components/selected'
import UnitComponent from '../components/unit'
import Button from './button'

export default class ActionMenu {
    private container!: Phaser.GameObjects.Container
    private width!: number
    private height!: number
    public waitButton!: Phaser.GameObjects.Container

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
            100,
            40,
            100,
            25 + this.height,
        )
        const elements: Phaser.GameObjects.Container[] = []

        this.waitButton = new Button(scene, 160, 40, 'wait')
        elements.push(this.waitButton)

        const hp1 = new Button(scene, 160, 40, 'weapons')
        elements.push(hp1)

        const hp2 = new Button(scene, 160, 40, 'items')
        elements.push(hp2)

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
        this.container.destroy()
        this.container = null
    }
}
