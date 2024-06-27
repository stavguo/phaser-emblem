import {
    defineQuery,
    defineSystem,
    enterQuery,
    IWorld,
} from 'bitecs'
import * as Phaser from 'phaser'

import Cell from '../components/cell'
import { Tile } from '../components/tile'

export default function createTileSystem(scene: Phaser.Scene, tiles: Map<number, Phaser.GameObjects.Image>) {
    const tileQuery = defineQuery([Tile, Cell])
    const tileEnterQuery = enterQuery(tileQuery)
    return defineSystem((world: IWorld) => {
        tileEnterQuery(world).forEach((eid) => {
            const tile = new Phaser.GameObjects.Image(scene, Cell.col[eid] * 64, Cell.row[eid] * 64, 'terrain', Tile.type[eid]).setScale(4).setOrigin(0).setDepth(1).disableInteractive()
            scene.add.existing(tile)
            tiles.set(eid, tile)
        })
        return world
    })
}
