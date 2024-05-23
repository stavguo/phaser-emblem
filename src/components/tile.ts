import {
    defineComponent,
    Types,
} from 'bitecs'

export enum TileType {
    Sea,
    // River,
    Plain,
    Tree,
    Forest,
}

export const Tile = defineComponent({
    type: Types.ui8,
    cost: Types.ui8,
    unit: Types.eid,
})
