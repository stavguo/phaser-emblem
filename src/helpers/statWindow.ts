import Selected from '../components/selected'

export default class StatWindow {
    private container!: Phaser.GameObjects.Container

    constructor(scene: Phaser.Scene, eid: number) {
        // Initialize UI
        const { width } = scene.scale
        this.container = scene.add.container((Selected.x[eid] > (width / 2)) ? 5 : width - 5, 5)
            .setDepth(100)
            .setScrollFactor(0, 0)
            // .setAlpha(0.7)
            .disableInteractive()
        const box = scene.add.nineslice(0, 0, 'panel-beige-light', 0, 150, 100, 60, 40, 49, 49)
            .setOrigin((Selected.x[eid] > (width / 2)) ? 0 : 1, 0)
            .setScale(2)
        this.container.add(box)

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
