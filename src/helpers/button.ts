import * as Phaser from 'phaser'

export default class Button extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, width: number, height: number, label: string) {
        super(scene, 0, 0)
        const button = scene.add.nineslice(0, 0, 'button-long-beige', 0, width, height, 49, 48, 20, 20)
            .setOrigin(0.5, 0.5)
            //.setScale(0.25)
        this.add(button)
        const text = scene.add.text(0, 0, label, { color: '#000000' })
            .setDepth(102)
            //.setScrollFactor(0, 0)
            .setOrigin(0.5, 0.5)
        this.add(text)
        this.setSize(width, height)
        this.setInteractive()
        this.setScrollFactor(0, 0)
        this.on('pointerover', function() {
            text.setColor('white')
        })
        this.on('pointerout', function() {
            text.setColor('black')
        })
    }
}