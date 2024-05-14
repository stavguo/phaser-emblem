import {
    addComponent,
    defineQuery,
    defineSystem,
    enterQuery,
    IWorld,
    removeComponent,
} from 'bitecs'
import * as Phaser from 'phaser'
import { Actor } from '../components/actor/actor'
import { CurrentTile } from '../components/actor/currentTile'
import { Selected } from '../components/actor/selected'
import { Step } from '../components/tile/step'
import { Tint } from '../components/tile/tint'
import { clearTint } from '../helpers/clearTint'
import { Path } from '../types/Path'

const tintQuery = defineQuery([Tint])
const tintQueryEnter = enterQuery(tintQuery)
const selectQuery = defineQuery([Selected])
const actorQuery = defineQuery([Actor])

function moveActor(
    actorId: number,
    targetId: number,
    availableTiles: Map<number, Path>,
    world: IWorld,
) {
    let cursor = targetId
    let parent = null
    const current = CurrentTile.tile[actorId]
    while (cursor !== current) {
        parent = availableTiles.get(cursor).parent
        addComponent(world, Step, cursor)
        Step.actor[cursor] = actorId
        Step.prevTile[cursor] = parent
        Step.targetId[cursor] = targetId
        cursor = parent
    }
}

function tileDoubleClick(
    tileId: number,
    world: IWorld,
    availableTiles: Map<number, Map<number, Path>>,
) {
    const selectedId = (selectQuery(world).length === 1) ? selectQuery(world)[0] : -1
    if (selectedId !== -1) {
        const actorEntities = actorQuery(world)
        for (let i = 0; i < actorEntities.length; ++i) {
            const actorId = actorEntities[i]
            Array.from(availableTiles.keys()).map((key) => {
                if (availableTiles.get(key).has(tileId) && selectedId === actorId) {
                    moveActor(actorId, tileId, availableTiles.get(actorId), world)
                    clearTint(actorId, availableTiles, world)
                    removeComponent(world, Selected, selectedId)
                }
            })
        }
    }
}

export const createSelectTileSystem = (
    scene: Phaser.Scene,
    spriteById: Map<number, Phaser.GameObjects.Sprite>,
    availableTilesAll: Map<number, Map<number, Path>>,
) => {
    return defineSystem((world) => {
        const tileEntities = tintQueryEnter(world)
        for (let i = 0; i < tileEntities.length; ++i) {
            const id = tileEntities[i]
            const tile = spriteById.get(id)
            if (tile) {
                let lastTime = 0
                tile.on('pointerdown', () => {
                    const clickDelay = scene.time.now - lastTime
                    lastTime = scene.time.now
                    if (clickDelay < 350) {
                        tileDoubleClick(
                            id,
                            world,
                            availableTilesAll,
                        )
                    }
                })
            }
        }
        return world
    })
}
