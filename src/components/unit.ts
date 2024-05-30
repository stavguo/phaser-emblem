import {
    defineComponent,
    Types,
} from 'bitecs'

export default defineComponent({
    movement: Types.ui8,
    tile: Types.eid,
    hp: Types.ui8,
    attackPower: Types.ui8,
    def: Types.ui8,
})
