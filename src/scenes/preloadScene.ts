import * as Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' })
    }

    preload() {
        this.load.spritesheet('terrain', 'assets/img/terrain.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('player', 'assets/img/goodChar.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('enemy', 'assets/img/badChar.png', { frameWidth: 16, frameHeight: 16 })
    }

    create() {
        this.scene.start('MainScene')
    }
}
