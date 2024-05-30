import {
    addComponent,
    addEntity,
    defineQuery,
    enterQuery,
} from 'bitecs'

import Cell from '../components/cell'
import Enemy from '../components/enemy'
import Player from '../components/player'
import { Tile as TileComponent, TileType } from '../components/tile'
import UnitComponent from '../components/unit'
import GameWorld from './gameWorld'

// TODO: Create array of units to make by adding their specific attributes (e.g. movement, texture, etc.)
export default function createUnits(world: GameWorld) {
    const TileQuery = defineQuery([TileComponent])
    const TileEnterQuery = enterQuery(TileQuery)
    const playerUnits = 5
    const enemyUnits = 5
    const createUnit = (eid: number, world: GameWorld) => {
        const unit = addEntity(world)
        TileComponent.unit[eid] = unit

        addComponent(world, Cell, unit)
        Cell.row[unit] = Cell.row[eid]
        Cell.col[unit] = Cell.col[eid]

        return unit
    }
    const randomTiles = TileEnterQuery(world)
        .filter(eid => TileComponent.type[eid] != TileType.Sea)
        .map(eid => ({ eid, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ eid }) => eid)
        .slice(0, playerUnits + enemyUnits)
    for (let i = 0; i < playerUnits; i++) {
        const eid = randomTiles[i]
        const unit = createUnit(eid, world)
        addComponent(world, UnitComponent, unit)
        UnitComponent.movement[unit] = 5
        UnitComponent.tile[unit] = eid
        UnitComponent.hp[unit] = Math.random() * (30 - 20) + 20 // https://stackoverflow.com/a/1527820
        UnitComponent.attackPower[unit] = Math.random() * (19 - 10) + 10
        UnitComponent.def[unit] = Math.random() * (9 - 0) + 0
        addComponent(world, Player, unit)
    }
    for (let i = playerUnits; i < playerUnits + enemyUnits; i++) {
        const eid = randomTiles[i]
        const unit = createUnit(eid, world)
        addComponent(world, UnitComponent, unit)
        UnitComponent.movement[unit] = 5
        UnitComponent.tile[unit] = eid
        UnitComponent.hp[unit] = Math.random() * (30 - 20) + 20 // https://stackoverflow.com/a/1527820
        UnitComponent.attackPower[unit] = Math.random() * (19 - 10) + 10
        UnitComponent.def[unit] = Math.random() * (9 - 0) + 0
        addComponent(world, Enemy, unit)
    }
}
