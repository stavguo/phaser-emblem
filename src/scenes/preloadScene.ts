import * as Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' })
    }

    preload() {
        this.load.spritesheet('terrain', 'assets/img/terrain.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('player', 'assets/img/goodChar.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('enemy', 'assets/img/badChar.png', { frameWidth: 16, frameHeight: 16 })
        this.load.image('panel-beige-light', 'assets/img/panel_beigeLight.png')
        this.load.image('panel-brown', 'assets/img/panel_brown.png')
        this.load.image('button-long-beige', 'assets/img/buttonLong_beige.png')
    }

    create() {
        this.scene.start('MainScene')
    }
}
