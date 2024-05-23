import {
    defineComponent,
    Types,
} from 'bitecs'

export enum UnitType {
    Player,
    Ally,
    Enemy,
}

export const Unit = defineComponent({
    type: Types.ui8,
    movement: Types.ui8,
    tile: Types.eid,
})
