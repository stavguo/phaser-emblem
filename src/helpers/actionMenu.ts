import * as Phaser from 'phaser'

import Selected from '../components/selected'
import Button from './button'

export default class ActionMenu extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, eid: number, windowWidth: number, windowHeight: number) {
        super(scene, (Selected.x[eid] > (scene.scale.width / 2)) ? 5 : scene.scale.width - 5 - windowWidth, 5)

        this.setDepth(200)
            .setScrollFactor(0, 0)
            .disableInteractive()

        // Setup background box
        const box = scene.add.nineslice(0, 0, 'panel-brown', 0, windowWidth / 2, windowHeight / 2, 60, 40, 49, 49)
            .setOrigin(0, 0)
            .setScale(2)
        this.add(box)

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



