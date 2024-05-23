import * as Phaser from 'phaser'

export default class Tile extends Phaser.GameObjects.Image {
    available: boolean
    selected: boolean
    clicked: boolean
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number) {
        super(scene, x, y, texture, frame)
        this.setScale(4)
        this.setOrigin(0)
        this.setDepth(1)
        this.disableInteractive()
    }
}
