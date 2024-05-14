import {
    defineComponent,
    Types,
} from 'bitecs'

export const Node = defineComponent({
    parent: Types.i16,
    gCost: Types.i16, // Manhattan distance from start node
    hCost: Types.i16, // Manhattan distance from target node
})
