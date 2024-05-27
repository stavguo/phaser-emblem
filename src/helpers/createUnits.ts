import {
    addComponent,
    addEntity,
    defineQuery,
    enterQuery,
} from 'bitecs'
import { Tile as TileComponent, TileType } from '../components/tile'
import Cell from '../components/cell'
import UnitComponent from '../components/unit'
import GameWorld from './gameWorld'
import Player from '../components/player'
import Enemy from '../components/enemy'

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
        addComponent(world, Player, unit)
    }
    for (let i = playerUnits; i < playerUnits + enemyUnits; i++) {
        const eid = randomTiles[i]
        const unit = createUnit(eid, world)
        addComponent(world, UnitComponent, unit)
        UnitComponent.movement[unit] = 5
        UnitComponent.tile[unit] = eid
        addComponent(world, Enemy, unit)
    }
}
