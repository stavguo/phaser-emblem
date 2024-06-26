import {
    addComponent,
    addEntity,
} from 'bitecs'
import { createNoise2D } from 'simplex-noise'

import Cell from '../components/cell'
import { Tile, TileType } from '../components/tile'
import GameWorld from './gameWorld'

export default function createTiles(world: GameWorld) {
    const noise2D = createNoise2D()
    for (let row = 0; row < world.heightInTiles; ++row) {
        for (let col = 0; col < world.widthInTiles; ++col) {
            const eid = addEntity(world)
            world.tiles[(row * world.widthInTiles) + col] = eid

            addComponent(world, Cell, eid)
            Cell.row[eid] = row
            Cell.col[eid] = col

            const noise = noise2D(row / 10, col / 10)
            addComponent(world, Tile, eid)
            // Set to null eid.
            Tile.unit[eid] = 0
            if (noise < -0.6) {
                Tile.type[eid] = TileType.Sea
                Tile.cost[eid] = 0
            }
            else if (noise < 0.4) {
                Tile.type[eid] = TileType.Plain
                Tile.cost[eid] = 1
            }
            else if (noise < 0.7) {
                Tile.type[eid] = TileType.Tree
                Tile.cost[eid] = 2
            }
            else if (noise < 1) {
                Tile.type[eid] = TileType.Forest
                Tile.cost[eid] = 3
            }
        }
    }
}
