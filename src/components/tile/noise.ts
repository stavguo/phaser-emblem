import {
    defineComponent,
    Types,
} from 'bitecs'

export enum NoiseEnum {
    Water = -0.6,
    Sand = -0.3,
    Plain = 0.4,
    Forest = 0.7,
    Thicket = 1,
}

// Component assigned to tiles to help the actor move.
export const Noise = defineComponent({
    value: Types.f32,
})
