import {
    addComponent,
    addEntity,
    defineQuery,
    defineSystem,
    enterQuery,
    IWorld
} from 'bitecs'
import { Actor, ActorStateEnum, ActorTypeEnum } from '../components/actor/actor'
import { CurrentTile } from '../components/actor/currentTile'
import { Distance } from '../components/actor/distance'
import { Enemy } from '../components/actor/enemy'
import { Player } from '../components/actor/player'
import { Cell } from '../components/base/cell'
import { Frame } from '../components/base/frame'
import { Sprite } from '../components/base/sprite'
import { Noise } from '../components/tile/noise'
import { Terrain } from '../components/tile/terrain'

const noiseQuery = defineQuery([Noise])
const noiseEnterQuery = enterQuery(noiseQuery)

const plainTileIds: number[] = []

const MAX_ENEMIES = 5
const MAX_PLAYERS = 3

function addPlayer(row: number, col: number, world: IWorld) {
    const player = addEntity(world)
    addComponent(world, Actor, player)
    Actor.state[player] = ActorStateEnum.Available
    Actor.type[player] = ActorTypeEnum.Player
    addComponent(world, Player, player)
    addComponent(world, Cell, player)
    Cell.row[player] = row
    Cell.col[player] = col
    addComponent(world, Sprite, player)
    Sprite.texture[player] = 0
    addComponent(world, Frame, player)
    Frame.frame[player] = 0
    addComponent(world, Distance, player)
    Distance.dist[player] = 5
    addComponent(world, CurrentTile, player)
}

function addEnemy(row: number, col: number, world: IWorld) {
    const enemy = addEntity(world)
    addComponent(world, Actor, enemy)
    Actor.state[enemy] = ActorStateEnum.Available
    Actor.type[enemy] = ActorTypeEnum.Enemy
    addComponent(world, Enemy, enemy)
    addComponent(world, Cell, enemy)
    Cell.row[enemy] = row
    Cell.col[enemy] = col
    addComponent(world, Sprite, enemy)
    Sprite.texture[enemy] = 1
    addComponent(world, Frame, enemy)
    Frame.frame[enemy] = 0
    addComponent(world, Distance, enemy)
    Distance.dist[enemy] = 5
    addComponent(world, CurrentTile, enemy)
}

function addActors(world: IWorld) {
    for (let i = 0; i < MAX_PLAYERS; i++) {
        const tileId = plainTileIds[Math.floor(Math.random() * plainTileIds.length)]
        plainTileIds.filter(el => el !== tileId)
        addPlayer(Cell.row[tileId], Cell.col[tileId], world)
    }
    for (let i = 0; i < MAX_ENEMIES; i++) {
        const tileId = plainTileIds[Math.floor(Math.random() * plainTileIds.length)]
        plainTileIds.filter(el => el !== tileId)
        addEnemy(Cell.row[tileId], Cell.col[tileId], world)
    }
}

export const createNoiseSystem = () => {
    return defineSystem(world => {
        const enterEntities = noiseEnterQuery(world)
        for (let i = 0; i < enterEntities.length; ++ i) {
            const tileId = enterEntities[i]
            const noise = Noise.value[tileId]
            addComponent(world, Frame, tileId)
            addComponent(world, Terrain, tileId)
            if (noise < -0.6) {
                Frame.frame[tileId] = 0
                Terrain.cost[tileId] = 0
            }
            // else if (noise < -0.3) {
            //     Frame.frame[tileId] = 1
            //     Terrain.cost[tileId] = 2
            // }
            else if (noise < 0.4) {
                Frame.frame[tileId] = 2
                Terrain.cost[tileId] = 1
                plainTileIds.push(tileId)
            } else if (noise < 0.7) {
                Frame.frame[tileId] = 3
                Terrain.cost[tileId] = 2
            } else if (noise < 1) {
                Frame.frame[tileId] = 4
                Terrain.cost[tileId] = 3
            }
            if (i === enterEntities.length - 1) {
                addActors(world)
            }
        }
        return world
    })
}