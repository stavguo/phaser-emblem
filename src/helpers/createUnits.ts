import {
    addComponent,
    addEntity,
    defineQuery,
    enterQuery,
} from 'bitecs'

import Cell from '../components/cell'
import Enemy from '../components/enemy'
import Player from '../components/player'
import { Tile, TileType } from '../components/tile'
import Unit from '../components/unit'
import GameWorld from './gameWorld'

// TODO: Create array of units to make by adding their specific attributes (e.g. movement, texture, etc.)
export default function createUnits(world: GameWorld) {
    const TileQuery = defineQuery([Tile])
    const TileEnterQuery = enterQuery(TileQuery)
    const playerUnits = 5
    const enemyUnits = 5
    const createUnit = (eid: number, world: GameWorld) => {
        const unit = addEntity(world)
        Tile.unit[eid] = unit

        addComponent(world, Cell, unit)
        Cell.row[unit] = Cell.row[eid]
        Cell.col[unit] = Cell.col[eid]

        return unit
    }
    const randomTiles = TileEnterQuery(world)
        .filter(eid => Tile.type[eid] != TileType.Sea)
        .map(eid => ({ eid, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ eid }) => eid)
        .slice(0, playerUnits + enemyUnits)
    for (let i = 0; i < playerUnits; i++) {
        const eid = randomTiles[i]
        const unit = createUnit(eid, world)
        addComponent(world, Unit, unit)
        Unit.movement[unit] = 5
        Unit.tile[unit] = eid
        Unit.hp[unit] = Math.random() * (30 - 20) + 20 // https://stackoverflow.com/a/1527820
        Unit.attackPower[unit] = Math.random() * (19 - 10) + 10
        Unit.def[unit] = Math.random() * (9 - 0) + 0
        addComponent(world, Player, unit)
    }
    for (let i = playerUnits; i < playerUnits + enemyUnits; i++) {
        const eid = randomTiles[i]
        const unit = createUnit(eid, world)
        addComponent(world, Unit, unit)
        Unit.movement[unit] = 5
        Unit.tile[unit] = eid
        Unit.hp[unit] = Math.random() * (30 - 20) + 20 // https://stackoverflow.com/a/1527820
        Unit.attackPower[unit] = Math.random() * (19 - 10) + 10
        Unit.def[unit] = Math.random() * (9 - 0) + 0
        addComponent(world, Enemy, unit)
    }
}
