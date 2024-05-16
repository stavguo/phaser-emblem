import * as Phaser from 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

// 16x16 tiles, 15 by 10
const scale = 4
const width = 240
const height = 160
const config = {
    // type can't be Phaser.AUTO because tinting tiles is only possible with WebGL
    type: Phaser.WEBGL,
    backgroundColor: '#000',
    pixelArt: true,
    roundPixels: true,
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: (window.innerWidth > window.innerHeight)
            ? Phaser.Scale.CENTER_BOTH
            : Phaser.Scale.CENTER_HORIZONTALLY,
        width: scale * ((window.innerWidth > window.innerHeight) ? width : height),
        height: scale * ((window.innerWidth > window.innerHeight) ? height : width),
    },
    dom: {
        createContainer: true,
    },
    scene: [
        PreloadScene,
        MainScene,
    ],
}

new Phaser.Game(config)
