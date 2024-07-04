import {
    addComponent,
    defineQuery,
    defineSystem,
    enterQuery,
    IWorld,
    Not,
    removeComponent,
} from 'bitecs'
import * as Phaser from 'phaser'

import Moved from '../components/moved'
import { Team, Unit } from '../components/unit'
import GameWorld from '../helpers/gameWorld'

export default function createPhaseSystem(scene: Phaser.Scene, world: GameWorld, unitSprites: Map<number, Phaser.GameObjects.Sprite>) {
    const movedQuery = defineQuery([Unit, Moved])
    const notMovedQuery = defineQuery([Unit, Not(Moved)])
    const movedEnterQuery = enterQuery(movedQuery)
    const playerMoved = (world: IWorld) => {
        return movedQuery(world).filter(eid => Unit.team[eid] === Team.Player)
    }
    const enemyMoved = (world: IWorld) => {
        return movedQuery(world).filter(eid => Unit.team[eid] === Team.Enemy)
    }
    const playerNotMoved = (world: IWorld) => {
        return notMovedQuery(world).filter(eid => Unit.team[eid] === Team.Player)
    }
    const enemyNotMoved = (world: IWorld) => {
        return notMovedQuery(world).filter(eid => Unit.team[eid] === Team.Enemy)
    }
    const makePhaseMessage = (text: string, color: string, clearQuery: number[]) => {
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
                    onStart: function () {
                        clearQuery.forEach((eid) => {
                            removeComponent(world, Moved, eid)
                            unitSprites.get(eid)!.clearTint()
                        })
                    },
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
    // Initialize map with all enemies as moved
    enemyNotMoved(world).forEach(eid => addComponent(world, Moved, eid))
    return defineSystem((world) => {
        movedEnterQuery(world).forEach((eid) => {
            if (Unit.team[eid] === Team.Player) {
                const greyColor = 0x808080
                unitSprites.get(eid)!.setTint(greyColor)
                if (playerNotMoved(world).length === 0) {
                    makePhaseMessage('Enemy Phase', '#ff0000', enemyMoved(world))
                }
            } else if (Unit.team[eid] === Team.Enemy) {
                if (enemyNotMoved(world).length === 0) {
                    makePhaseMessage('Player Phase', '#0000ff', playerMoved(world))
                }
            }
        })
        return world
    })
}
