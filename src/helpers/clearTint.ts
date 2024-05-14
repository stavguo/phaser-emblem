import { IWorld, removeComponent } from 'bitecs'
import { Tint } from '../components/tile/tint'
import { Path } from '../types/Path'

export function clearTint(
    actorId: number,
    availableTilesAll: Map<number, Map<number, Path>>,
    world: IWorld,
) {
    Array.from(availableTilesAll.get(actorId).keys()).map((key) => {
        removeComponent(world, Tint, key)
    })
}
