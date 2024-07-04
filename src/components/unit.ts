import {
    defineComponent,
    Types,
} from 'bitecs'

export enum Team {
    Player,
    Enemy,
    Ally,
    Neutral,
}

export const Unit = defineComponent({
    movement: Types.ui8,
    tile: Types.eid,
    hp: Types.ui8,
    attackPower: Types.ui8,
    def: Types.ui8,
    team: Types.ui8,
})
