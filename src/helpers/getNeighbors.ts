import GameWorld from './gameWorld'

export default function getNeighbors(world: GameWorld, row: number, col: number): number[] {
    const neighbors: number[] = []
    const index = (row * world.widthInTiles) + col
    if (row > 0) {
        neighbors.push(world.tiles[index - world.widthInTiles])
    }
    if (row < world.heightInTiles) {
        neighbors.push(world.tiles[index + world.widthInTiles])
    }
    if (col > 0) {
        neighbors.push(world.tiles[index - 1])
    }
    if (col < world.widthInTiles) {
        neighbors.push(world.tiles[index + 1])
    }
    return neighbors
}
