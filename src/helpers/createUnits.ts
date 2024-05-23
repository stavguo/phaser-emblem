import {
    addComponent,
    addEntity,
    defineQuery,
    enterQuery,
} from 'bitecs'
import { Tile as TileComponent, TileType } from '../components/tile'
import Cell from '../components/cell'
import { Unit as UnitComponent, UnitType } from '../components/unit'
import GameWorld from './gameWorld'

export default function createUnits(world: GameWorld) {
    const TileQuery = defineQuery([TileComponent])
    const TileEnterQuery = enterQuery(TileQuery)
    const playerUnits = 5
    const enemyUnits = 5
    const createUnit = (unitType: UnitType, eid: number, world: GameWorld) => {
        const unit = addEntity(world)
        TileComponent.unit[eid] = unit

        addComponent(world, UnitComponent, unit)
        UnitComponent.type[unit] = unitType
        UnitComponent.movement[unit] = 5
        UnitComponent.tile[unit] = eid

        addComponent(world, Cell, unit)
        Cell.row[unit] = Cell.row[eid]
        Cell.col[unit] = Cell.col[eid]
    }
    const randomTiles = TileEnterQuery(world)
        .filter(eid => TileComponent.type[eid] != TileType.Sea)
        .map(eid => ({ eid, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ eid }) => eid)
        .slice(0, playerUnits + enemyUnits)
    for (let i = 0; i < playerUnits; i++) {
        const eid = randomTiles[i]
        createUnit(UnitType.Player, eid, world)
    }
    for (let i = playerUnits; i < playerUnits + enemyUnits; i++) {
        const eid = randomTiles[i]
        createUnit(UnitType.Enemy, eid, world)
    }
}
