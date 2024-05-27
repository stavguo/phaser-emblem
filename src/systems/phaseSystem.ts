import {
    Not,
    addComponent,
    defineQuery,
    defineSystem,
    enterQuery,
    removeComponent,
} from 'bitecs'
import UnitComponent from '../components/unit'
import Unit from '../helpers/unit'
import Moved from '../components/moved'
import Player from '../components/player'
import Enemy from '../components/enemy'
import GameWorld from '../helpers/gameWorld'

const makePhaseMessage = (text: string, color: string, scene: Phaser.Scene) => {
    const textObj = scene.add.text(
        scene.cameras.main.centerX,
        scene.cameras.main.centerY / 4,
        text,
        {
            color: color,
        },
    )
        .setDepth(100)
        .setScrollFactor(0, 0)
        .setOrigin(0.5, 0.5)
        .setScale(2)
        .setStroke('#ffffff', 6)
        .setAlpha(0)
        .disableInteractive()
    scene.tweens.chain({
        targets: textObj,
        tweens: [
            {
                alpha: { from: 0, to: 1 },
                delay: 1000,
                duration: 1000,
                ease: 'Linear',
            },
            {
                alpha: { from: 1, to: 0 },
                delay: 3000,
                duration: 1000,
                ease: 'Linear',
                onComplete: function () {
                    textObj.destroy()
                },
            },
        ],
    })
}

export default function createPhaseSystem(scene: Phaser.Scene, world: GameWorld, unitSprites: Map<number, Unit>) {
    const movedPlayerQuery = defineQuery([UnitComponent, Player, Moved])
    const notMovedPlayerQuery = defineQuery([UnitComponent, Player, Not(Moved)])
    const movedPlayerEnterQuery = enterQuery(movedPlayerQuery)
    const movedEnemyQuery = defineQuery([UnitComponent, Enemy, Moved])
    const notMovedEnemyQuery = defineQuery([UnitComponent, Enemy, Not(Moved)])
    const movedEnemyEnterQuery = enterQuery(movedEnemyQuery)
    // Initialize map with all enemies as moved
    notMovedEnemyQuery(world).forEach(eid => addComponent(world, Moved, eid))
    return defineSystem((world) => {
        movedPlayerEnterQuery(world).forEach((eid) => {
            const greyColor = 0x808080
            unitSprites.get(eid).setTint(greyColor)
            if (notMovedPlayerQuery(world).length === 0) {
                movedEnemyQuery(world).forEach((eid) => {
                    removeComponent(world, Moved, eid)
                    // TODO (1/2): No point tinting enemies if they move on their own with A* later.
                    unitSprites.get(eid).clearTint()
                })
                makePhaseMessage('Enemy Phase', '#ff0000', scene)
            }
        })
        movedEnemyEnterQuery(world).forEach((eid) => {
            // TODO (2/2): No point tinting enemies if they move on their own with A* later.
            const greyColor = 0x808080
            unitSprites.get(eid).setTint(greyColor)
            if (notMovedEnemyQuery(world).length === 0) {
                movedPlayerQuery(world).forEach((eid) => {
                    removeComponent(world, Moved, eid)
                    unitSprites.get(eid).clearTint()
                })
                makePhaseMessage('Player Phase', '#0000ff', scene)
            }
        })
        return world
    })
}
