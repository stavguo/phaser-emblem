export function satisfiesBounds(row: number, col: number) {
    return (row >= 0 && row < 20 && col >= 0 && col < 30) ? true : false
}
