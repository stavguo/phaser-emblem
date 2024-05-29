import * as Phaser from 'phaser'

import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

// As a reminder tiles are 16x16 pixels, 3:2 aspect ratio
const screenScale = 4
const widthPixels = 240
const heightPixels = 160
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
        width: screenScale * ((window.innerWidth > window.innerHeight) ? widthPixels : heightPixels),
        height: screenScale * ((window.innerWidth > window.innerHeight) ? heightPixels : widthPixels),
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
