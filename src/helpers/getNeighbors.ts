export default function getNeighbors(index: number, width: number, height: number): number[] {
    const neighbors: number[] = []
    const x = index % width
    const y = Math.floor(index / width)
    if (y > 0) {
        neighbors.push(index - width)
    }
    if (y < height) {
        neighbors.push(index + width)
    }
    if (x > 0) {
        neighbors.push(index - 1)
    }
    if (x < width) {
        neighbors.push(index + 1)
    }
    return neighbors
}
