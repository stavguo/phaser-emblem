import { IWorld, TypedArray } from 'bitecs'

export default interface GameWorld extends IWorld {
    widthInTiles: number
    heightInTiles: number
    tiles: TypedArray
    selected: number
}
