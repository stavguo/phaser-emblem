import { IWorld } from 'bitecs'

export default interface GameWorld extends IWorld {
    widthInTiles: number
    heightInTiles: number
}
