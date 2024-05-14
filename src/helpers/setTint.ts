import { addComponent, IWorld } from 'bitecs'
import { Actor, ActorTypeEnum } from '../components/actor/actor'
import { Tint } from '../components/tile/tint'
import { Path } from '../types/Path'

export function setTint(
    actorId: number,
    availableTiles: Map<number, Path>,
    world: IWorld
) {
    Array.from(availableTiles.keys()).map((key) => {
        addComponent(world, Tint, key)
        if (Actor.type[actorId] === ActorTypeEnum.Player) {
            Tint.color[key] = 0
        } else {
            Tint.color[key] = 1
        }
    })
}