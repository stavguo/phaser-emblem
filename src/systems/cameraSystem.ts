import * as Phaser from 'phaser'

export default function cameraSetup(scene: Phaser.Scene) {
    const cam = scene.cameras.main
    cam.setBounds(0, 0, (240 * 4) * 2, (160 * 4) * 2)
    scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
        if (!p.isDown) {
            return
        }
        else {
            cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom
            cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom
        }
    })
}
