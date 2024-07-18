import {
    defineComponent,
    Types,
} from 'bitecs'

export enum Color {
    Red,
    Green,
    Blue,
}

export const Tint = defineComponent({
    color: Types.ui8
})
