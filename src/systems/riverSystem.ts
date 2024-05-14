import {
    defineQuery,
    defineSystem,
    enterQuery,
} from 'bitecs'
import { Cell } from '../components/base/cell'
import { Frame } from '../components/base/frame'
import { Noise, NoiseEnum } from '../components/tile/noise'
import { Terrain } from '../components/tile/terrain'
import { satisfiesBounds } from '../helpers/satisfiesBounds'

const noiseQuery = defineQuery([Noise])
const noiseEnterQuery = enterQuery(noiseQuery)

const highestTiles: number[] = []

const randomRiverMax = 4 // non-inclusive

export const createRiverSystem = (tiles: Map<string, number>) => {
    return defineSystem((world) => {
        const enterEntities = noiseEnterQuery(world)
        for (let i = 0; i < enterEntities.length; ++i) {
            const tileId = enterEntities[i]
            const noise = Noise.value[tileId]
            if (noise > NoiseEnum.Forest) {
                highestTiles.push(tileId)
            }
            // Last iteration
            if (i === (enterEntities.length - 1)) {
                for (let i = 0; i < Math.floor(Math.random() * randomRiverMax); ++i) {
                    let currentTileId = highestTiles[Math.floor(Math.random() * highestTiles.length)]
                    const river: number[] = []
                    while (currentTileId !== -1 && Noise.value[currentTileId] > NoiseEnum.Water) {
                        Frame.frame[currentTileId] = 0
                        Terrain.cost[currentTileId] = 0
                        river.push(currentTileId)
                        // get possible tiles
                        const possibleTileIds: number[] = []
                        // North
                        if (satisfiesBounds(Cell.row[currentTileId] - 1, Cell.col[currentTileId])) {
                            possibleTileIds.push(tiles.get(`${Cell.col[currentTileId]},${Cell.row[currentTileId] - 1}`))
                        }
                        // South
                        if (satisfiesBounds(Cell.row[currentTileId] + 1, Cell.col[currentTileId])) {
                            possibleTileIds.push(tiles.get(`${Cell.col[currentTileId]},${Cell.row[currentTileId] + 1}`))
                        }
                        // East
                        if (satisfiesBounds(Cell.row[currentTileId], Cell.col[currentTileId] + 1)) {
                            possibleTileIds.push(tiles.get(`${Cell.col[currentTileId] + 1},${Cell.row[currentTileId]}`))
                        }
                        // West
                        if (satisfiesBounds(Cell.row[currentTileId], Cell.col[currentTileId] - 1)) {
                            possibleTileIds.push(tiles.get(`${Cell.col[currentTileId] - 1},${Cell.row[currentTileId]}`))
                        }
                        // filter out visited tiles
                        possibleTileIds.filter(id => !river.includes(id))
                        // sort
                        possibleTileIds.sort((a, b) => Noise.value[b] - Noise.value[a])
                        currentTileId = possibleTileIds.pop()
                    }
                }
            }
        }
        return world
    })
}
