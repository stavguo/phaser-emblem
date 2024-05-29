import {
    defineQuery,
    defineSystem,
    enterQuery,
    IWorld,
} from 'bitecs'
import * as Phaser from 'phaser'

import Cell from '../components/cell'
import { Tile as TileComponent } from '../components/tile'
import Tile from '../helpers/tile'

export default function createTileSystem(scene: Phaser.Scene, tiles: Map<number, Tile>) {
    const tileQuery = defineQuery([TileComponent, Cell])
    const tileEnterQuery = enterQuery(tileQuery)
    return defineSystem((world: IWorld) => {
        tileEnterQuery(world).forEach((eid) => {
            const tile = new Tile(scene, Cell.col[eid] * 64, Cell.row[eid] * 64, 'terrain', TileComponent.type[eid]).setOrigin(0).setScale(4)
            scene.add.existing(tile)
            tiles.set(eid, tile)
        })
        return world
    })
}
