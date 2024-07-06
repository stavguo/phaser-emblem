import {
    addComponent,
    defineQuery,
    defineSystem,
    exitQuery,
    hasComponent,
    IWorld,
    Not,
    removeComponent,
} from 'bitecs'
import * as Phaser from 'phaser'

import Actionable from '../components/actionable'
import Moved from '../components/moved'
import Tint from '../components/tint'
import { Team, Unit } from '../components/unit'
import GameWorld from '../helpers/gameWorld'

export default function createPhaseSystem(scene: Phaser.Scene, world: GameWorld) {
    const actionableQuery = defineQuery([Unit, Actionable])
    const notActionableQuery = defineQuery([Unit, Not(Actionable)])
    const actionableExitQuery = exitQuery(actionableQuery)
    const actionablePlayers = (world: IWorld) => {
        return actionableQuery(world).filter(eid => Unit.team[eid] === Team.Player)
    }
    const actionableEnemies = (world: IWorld) => {
        return actionableQuery(world).filter(eid => Unit.team[eid] === Team.Enemy)
    }
    const players = (world: IWorld) => {
        return notActionableQuery(world).filter(eid => Unit.team[eid] === Team.Player)
    }
    const enemies = (world: IWorld) => {
        return notActionableQuery(world).filter(eid => Unit.team[eid] === Team.Enemy)
    }
    const makePhaseMessage = (text: string, color: string, enterEntities: number[], exitEntities: number[]) => {
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
                        enterEntities.forEach((eid) => {
                            addComponent(world, Actionable, eid)
                            if (hasComponent(world, Moved, eid))
                                removeComponent(world, Moved, eid)
                            removeComponent(world, Tint, eid)
                        })
                        exitEntities.forEach((eid) => {
                            removeComponent(world, Tint, eid)
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
    // Initialize map with all players Actionable
    makePhaseMessage('Player Phase', '#0000ff', players(world), enemies(world))
    return defineSystem((world) => {
        actionableExitQuery(world).forEach((eid) => {
            if (Unit.team[eid] === Team.Player) {
                addComponent(world, Tint, eid)
                if (actionablePlayers(world).length === 0) {
                    makePhaseMessage('Enemy Phase', '#ff0000', enemies(world), players(world))
                }
            }
            else if (Unit.team[eid] === Team.Enemy) {
                if (actionableEnemies(world).length === 0) {
                    makePhaseMessage('Player Phase', '#0000ff', players(world), enemies(world))
                }
            }
        })
        return world
    })
}
