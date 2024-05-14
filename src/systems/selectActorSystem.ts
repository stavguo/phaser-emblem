import {
    addComponent,
    defineQuery,
    defineSystem,
    enterQuery, IWorld,
    removeComponent,
} from 'bitecs'
import * as Phaser from 'phaser'
import { Actor } from '../components/actor/actor'
import { Phase } from '../components/state/phase'
import { Selected } from '../components/actor/selected'
import { clearTint } from '../helpers/clearTint'
import { manStart } from '../helpers/manhattan'
import { setTint } from '../helpers/setTint'
import { Path } from '../types/Path'

const actorQuery = defineQuery([Actor])
const gameManagerQuery = defineQuery([Phase])
const actorQueryEnter = enterQuery(actorQuery)
const selectQuery = defineQuery([Selected])

async function actorDoubleClick(
    playerId: number,
    gmId: number,
    availableTilesAll: Map<number, Map<number, Path>>,
    world: IWorld,
) {
    const selectedId = (selectQuery(world).length === 1) ? selectQuery(world)[0] : -1
    // If this actor is selected when double clicked
    if (selectedId === playerId) {
        clearTint(playerId, availableTilesAll, world)
        removeComponent(world, Selected, selectedId)
    }
    // If this actor is not selected when double clicked
    else if (selectedId !== playerId) {
        // If there is already a selected actor
        if (selectedId !== -1) {
            clearTint(selectedId, availableTilesAll, world)
            removeComponent(world, Selected, selectedId)
            await new Promise(f => setTimeout(f, 100))
        }
        manStart(world, playerId, availableTilesAll)
        setTint(playerId, availableTilesAll.get(playerId), world)
        addComponent(world, Selected, playerId)
    }
}

export const createSelectActorSystem = (
    scene: Phaser.Scene,
    spriteById: Map<number, Phaser.GameObjects.Sprite>,
    availableTilesAll: Map<number, Map<number, Path>>,
) => {
    return defineSystem((world) => {
        const gmEntities = gameManagerQuery(world)
        const actorEntities = actorQueryEnter(world)
        for (let i = 0; i < actorEntities.length; ++i) {
            const id = actorEntities[i]
            const char = spriteById.get(id)
            if (char) {
                let lastTime = 0
                char.on('pointerdown', () => {
                    const clickDelay = scene.time.now - lastTime
                    lastTime = scene.time.now
                    if (clickDelay < 350) {
                        actorDoubleClick(
                            id,
                            gmEntities[0],
                            availableTilesAll,
                            world,
                        )
                    }
                })
            }
        }
        return world
    })
}
